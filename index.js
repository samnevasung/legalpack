require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
const Anthropic = require('@anthropic-ai/sdk');
let pdfParse;
try { pdfParse = require('pdf-parse'); } catch(e) { pdfParse = null; }

// ── DETERMINISTIC COST EXTRACTION ─────────────────────────────────────────────
function extractBuyerCosts(text) {
  if (!text) return [];
  const found = [];
  const seen = new Set();

  function add(label, amount, numericAmount, frequency, mandatory, evidence) {
    const key = label + amount;
    if (seen.has(key)) return;
    seen.add(key);
    found.push({ label, amount, numericAmount, frequency: frequency || 'one-off', mandatory: !!mandatory, evidence, source: 'extracted' });
  }

  // Helper to parse numeric from string
  function parseNum(s) {
    if (!s) return null;
    const n = parseFloat(s.replace(/,/g, ''));
    return isNaN(n) ? null : n;
  }

  const patterns = [
    // Buyer's premium / auction fee
    { re: /buyer['']?s?\s+premium\s+(?:of\s+)?(?:is\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: "Buyer's Premium", freq: 'one-off', mandatory: true },
    { re: /administration\s+(?:charge|fee)\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Administration Fee', freq: 'one-off', mandatory: true },
    { re: /buyer['']?s?\s+(?:legal\s+)?fee\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: "Buyer's Legal Fee", freq: 'one-off', mandatory: true },

    // Deposits
    { re: /(?:deposit|reservation\s+fee)\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Deposit', freq: 'one-off', mandatory: true },
    { re: /([£$][\d,]+(?:\.\d{2})?)\s+(?:deposit|reservation\s+fee)/gi, label: 'Deposit', freq: 'one-off', mandatory: true },

    // Ground rent
    { re: /ground\s+rent\s+(?:of\s+|is\s+|:\s*)?([£$][\d,]+(?:\.\d{2})?)\s*(?:per\s+(?:annum|year|p\.?a\.?))?/gi, label: 'Ground Rent', freq: 'annual', mandatory: true },

    // Service charge
    { re: /service\s+charge\s+(?:of\s+|is\s+|:\s*)?([£$][\d,]+(?:\.\d{2})?)\s*(?:per\s+(?:annum|year|p\.?a\.?))?/gi, label: 'Service Charge', freq: 'annual', mandatory: true },

    // VAT
    { re: /VAT\s+(?:of\s+|at\s+)?(\d+(?:\.\d+)?%)/gi, label: 'VAT', freq: 'one-off', mandatory: true },
    { re: /(?:plus|subject\s+to|inc(?:luding)?.)\s+VAT\s+(?:at\s+)?(\d+(?:\.\d+)?%)/gi, label: 'VAT Applicable', freq: 'one-off', mandatory: true },

    // Search fees
    { re: /search\s+fees?\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Search Fees', freq: 'one-off', mandatory: true },

    // Late completion / daily interest
    { re: /(?:interest|penalty)\s+(?:at\s+)?(\d+(?:\.\d+)?%)\s+per\s+(?:annum|year|day)/gi, label: 'Late Completion Interest Rate', freq: 'daily', mandatory: false },
    { re: /([£$][\d,]+(?:\.\d{2})?)\s+per\s+(?:working\s+)?day/gi, label: 'Daily Penalty', freq: 'daily', mandatory: false },

    // Seller's solicitor costs passed to buyer
    { re: /seller['']?s?\s+(?:solicitor['']?s?\s+)?(?:legal\s+)?(?:costs?|fees?)\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: "Seller's Legal Costs (Buyer Pays)", freq: 'one-off', mandatory: true },

    // Indemnity insurance
    { re: /indemnity\s+(?:insurance|policy)\s+(?:premium\s+)?(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Indemnity Insurance Premium', freq: 'one-off', mandatory: true },

    // Management pack / leasehold pack fee
    { re: /management\s+pack\s+(?:fee\s+)?(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Management Pack Fee', freq: 'one-off', mandatory: true },

    // Completion / transfer fee
    { re: /(?:completion|transfer)\s+fee\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Completion/Transfer Fee', freq: 'one-off', mandatory: true },

    // Reserve / sinking fund contribution
    { re: /(?:reserve|sinking)\s+fund\s+(?:contribution\s+)?(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Reserve/Sinking Fund Contribution', freq: 'annual', mandatory: false },

    // General £X,XXX patterns with context
    { re: /(?:sum|amount|charge|payment|contribution|liability|arrears)\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Stated Buyer Payment', freq: 'one-off', mandatory: true },

    // Percentage buyer's premium
    { re: /buyer['']?s?\s+premium\s+(?:of\s+)?(\d+(?:\.\d+)?%)/gi, label: "Buyer's Premium", freq: 'one-off', mandatory: true },

    // Annual rent
    { re: /(?:annual\s+rent|rent\s+per\s+annum)\s+(?:of\s+)?([£$][\d,]+(?:\.\d{2})?)/gi, label: 'Annual Rent', freq: 'annual', mandatory: true },
  ];

  for (const { re, label, freq, mandatory } of patterns) {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      const raw = m[1];
      const num = parseNum(raw.replace(/[£$]/g, ''));

      // Get surrounding context (up to 120 chars)
      const start = Math.max(0, m.index - 60);
      const end = Math.min(text.length, m.index + m[0].length + 60);
      const context = text.slice(start, end).replace(/\s+/g, ' ').trim();

      // Skip if numeric is suspiciously large (probably a price, not a fee)
      if (num && num > 500000) continue;

      const displayAmount = raw.startsWith('£') || raw.startsWith('$') ? raw : `${raw}`;
      add(label, displayAmount, num, freq, mandatory, `"...${context}..."`);
    }
  }

  return found;
}

async function extractTextFromPDFBuffer(buffer) {
  if (!pdfParse) return null;
  try {
    const data = await pdfParse(buffer, { max: 0 });
    return data.text || null;
  } catch(e) {
    console.log('pdf-parse error:', e.message);
    return null;
  }
}

// Pre-build system prompt once at startup — identical content = cache always hits
const ANALYSIS_SYSTEM_PROMPT = buildAnalysisPrompt();

const app = express();
app.set('trust proxy', 1); // Railway sits behind a proxy
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' } });
const analysisLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: { error: 'Too many analysis requests' } });

// ── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser) return res.status(401).json({ error: 'Invalid token' });

    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error || !user) {
      // Get signup IP — normalise IPv6 loopback to IPv4
      const signupIp = (req.ip || req.headers['x-forwarded-for'] || '').split(',')[0].trim().replace('::ffff:', '') || 'unknown';

      // Check if this IP already claimed a free credit
      let freeCredit = 0;
      if (signupIp && signupIp !== 'unknown' && signupIp !== '127.0.0.1' && signupIp !== '::1') {
        const { data: ipMatch } = await supabase
          .from('users')
          .select('id')
          .eq('signup_ip', signupIp)
          .eq('ip_credit_claimed', true)
          .limit(1);
        if (!ipMatch || ipMatch.length === 0) {
          freeCredit = 1; // first account from this IP — grant free credit
        }
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
          first_name: authUser.user_metadata?.given_name || '',
          last_name: authUser.user_metadata?.family_name || '',
          plan: 'pay_as_you_go',
          analyses_used_this_month: 0,
          analyses_total: 0,
          pay_as_you_go_credits: freeCredit,
          signup_ip: signupIp,
          ip_credit_claimed: freeCredit === 1,
        })
        .select()
        .single();
      if (createError) return res.status(500).json({ error: 'Failed to create user record' });
      user = newUser;
      if (freeCredit === 1) console.log(`Free credit granted to ${authUser.email} from IP ${signupIp}`);
    }

    req.user = user;
    req.authUser = authUser;
    next();
  } catch (e) {
    console.error('Auth error:', e);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ── ENSURE STRIPE CUSTOMER ────────────────────────────────────────────────────
// Creates a Stripe customer if the user doesn't have one yet, returns the ID
async function ensureStripeCustomer(user) {
  if (user.stripe_customer_id) return user.stripe_customer_id;
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || user.email,
    metadata: { supabase_user_id: user.id }
  });
  await supabase.from('users')
    .update({ stripe_customer_id: customer.id })
    .eq('id', user.id);
  user.stripe_customer_id = customer.id; // update in-memory too
  return customer.id;
}

// ── PLAN LIMITS ───────────────────────────────────────────────────────────────
const PLANS = {
  pay_as_you_go: { analysesPerMonth: null, pricePerAnalysis: 999 },
  standard:      { analysesPerMonth: 50,   monthlyPrice: 2999 },
  pro:           { analysesPerMonth: 120,  monthlyPrice: 9999 },
};

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }));

// ════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════════════════════

app.post('/auth/profile', requireAuth, async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const { data: user, error } = await supabase
      .from('users')
      .update({ first_name: firstName, last_name: lastName, name: fullName })
      .eq('id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ user: safeUser(user) });
  } catch(e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.post('/auth/ensure-stripe', requireAuth, async (req, res) => {
  try {
    await ensureStripeCustomer(req.user);
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: 'Failed to create Stripe customer' });
  }
});

// ── PHONE VERIFICATION + FREE CREDIT ─────────────────────────────────────────
app.post('/auth/verify-phone', requireAuth, async (req, res) => {
  const { phone } = req.body;
  const user = req.user;

  if (!phone) return res.status(400).json({ error: 'Phone required' });

  // Check this phone number hasn't already been used to claim a credit
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .eq('phone_verified', true)
    .neq('id', user.id) // allow re-verify of same user
    .limit(1);

  if (existing && existing.length > 0) {
    // Phone already used on another account — no credit, but still mark verified
    await supabase.from('users').update({ phone, phone_verified: true }).eq('id', user.id);
    return res.json({ ok: true, credited: false, message: 'Phone already used on another account' });
  }

  // Check if this user already got their phone credit
  if (user.phone_verified) {
    return res.json({ ok: true, credited: false, message: 'Already verified' });
  }

  // Grant 1 free credit and mark phone as verified
  const { error } = await supabase.from('users').update({
    phone,
    phone_verified: true,
    pay_as_you_go_credits: (user.pay_as_you_go_credits || 0) + 1
  }).eq('id', user.id);

  if (error) {
    console.error('Phone verify update error:', error);
    return res.status(500).json({ error: 'Failed to update record' });
  }

  console.log(`Phone verified and 1 free credit granted to ${user.email}`);
  res.json({ ok: true, credited: true, message: '1 free credit granted!' });
});

app.get('/auth/me', requireAuth, async (req, res) => {
  res.json({ user: safeUser(req.user) });
});

// ════════════════════════════════════════════════════════════════════════════
// ANALYSIS ROUTES
// ════════════════════════════════════════════════════════════════════════════

app.post('/analyse/check', requireAuth, async (req, res) => {
  const user = req.user;
  const plan = PLANS[user.plan];

  if (user.plan === 'pay_as_you_go') {
    if ((user.pay_as_you_go_credits || 0) < 1) {
      return res.status(402).json({ error: 'No credits remaining', noCredits: true });
    }
    return res.json({ allowed: true, plan: user.plan });
  }

  if (plan && plan.analysesPerMonth !== null) {
    if (user.analyses_used_this_month >= plan.analysesPerMonth) {
      return res.status(402).json({
        error: `Monthly limit reached (${plan.analysesPerMonth} analyses)`,
        limitReached: true,
        used: user.analyses_used_this_month,
        limit: plan.analysesPerMonth
      });
    }
    return res.json({
      allowed: true,
      plan: user.plan,
      used: user.analyses_used_this_month,
      limit: plan.analysesPerMonth,
      remaining: plan.analysesPerMonth - user.analyses_used_this_month
    });
  }

  res.json({ allowed: true });
});

app.post('/analyse', requireAuth, analysisLimiter, async (req, res) => {
  const { batches, batchIndex, totalBatches, extractedText, listingMeta } = req.body;
  const user = req.user;

  if (!batches || !Array.isArray(batches) || batches.length === 0) {
    return res.status(400).json({ error: 'No content provided' });
  }

  // Run deterministic extraction on first batch only (text already extracted client-side)
  let extractedCosts = [];
  if (batchIndex === 1 && extractedText) {
    extractedCosts = extractBuyerCosts(extractedText);
    console.log(`Deterministic extraction: ${extractedCosts.length} cost items found`);
  }

  // Build listing meta note for first batch
  const listingMetaNote = (batchIndex === 1 && listingMeta && Object.values(listingMeta).some(v => v))
    ? `\n\nAUCTION LISTING METADATA (scraped from auctioneer website — treat as supplementary context, verify against documents):\n${Object.entries(listingMeta).filter(([k,v]) => v).map(([k,v]) => `${k}: ${v}`).join('\n')}`
    : '';

  try {
    const contentBlocks = [];
    for (const item of batches) {
      if (item.type === 'text') {
        contentBlocks.push({ type: 'text', text: item.text });
      } else if (item.type === 'image') {
        contentBlocks.push({
          type: 'image',
          source: { type: 'base64', media_type: item.mediaType, data: item.data }
        });
        contentBlocks.push({ type: 'text', text: `[Image: ${item.name}]` });
      } else if (item.type === 'document') {
        contentBlocks.push({
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: item.data },
          title: item.name
        });
      }
    }

    const batchNote = totalBatches > 1
      ? `BATCH ${batchIndex}/${totalBatches}: Extract ALL risks and costs from THIS batch only. Same JSON format required.\n\n`
      : '';

    const extractionNote = (batchIndex === 1 && extractedCosts.length > 0)
      ? `\n\nDETERMINISTIC PRE-EXTRACTION: The following monetary figures were pattern-matched directly from the document text. CONFIRM, REJECT, or AUGMENT each, and find any costs the patterns missed:\n${JSON.stringify(extractedCosts, null, 2)}`
      : '';

    // Only push batch context — full instructions live in system prompt (cached)
    if (batchNote || extractionNote || listingMetaNote) {
      contentBlocks.push({ type: 'text', text: batchNote + extractionNote + listingMetaNote });
    }

    // Retry with backoff on rate limit
    let message;
    for (let attempt = 0; attempt <= 4; attempt++) {
      try {
        message = await anthropic.messages.create({
          model: 'claude-sonnet-4-5',
          max_tokens: 16000,
          system: [
            {
              type: 'text',
              text: ANALYSIS_SYSTEM_PROMPT,
              cache_control: { type: 'ephemeral' }
            }
          ],
          messages: [{ role: 'user', content: contentBlocks }]
        });
        break;
      } catch (err) {
        if (err.status === 429 && attempt < 4) {
          const retryAfter = parseInt(err.headers?.['retry-after'] || '0') * 1000;
          const wait = retryAfter > 0 ? Math.min(retryAfter, 120000) : Math.min(10000 * Math.pow(2, attempt), 120000);
          console.log(`Rate limit hit on attempt ${attempt + 1}, waiting ${wait/1000}s...`);
          await new Promise(r => setTimeout(r, wait));
        } else { throw err; }
      }
    }

    const usage = message.usage;
    let rawText = message.content[0].text.trim();
    
    // Strip markdown code fences
    let text = rawText
      .replace(/^```json\s*/i, '').replace(/\s*```$/i, '')
      .replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      .trim();
    
    // Extract JSON object
    const s = text.indexOf('{'), e = text.lastIndexOf('}');
    if (s !== -1 && e !== -1) text = text.slice(s, e + 1);

    let result;
    try {
      result = JSON.parse(text);
    } catch (parseErr) {
      console.log('Primary parse failed, attempting recovery. Raw length:', rawText.length);
      console.log('Parse error:', parseErr.message);
      console.log('Text sample:', text.substring(0, 200));
      result = attemptRecovery(text);
      if (!result) {
        // Last resort: return a minimal valid result with the error flagged
        console.log('Recovery failed, returning minimal result');
        result = {
          address: req.body.packName || 'Unknown',
          tenure: 'Unknown',
          overallRisk: 'HIGH',
          summary: 'Analysis could not be fully parsed. The documents may be too complex or contain unusual formatting. Please try re-uploading the legal pack.',
          top5Risks: ['Analysis parsing error — please re-run the analysis'],
          flags: [{
            severity: 'critical',
            category: 'System',
            title: 'Analysis Processing Error',
            detail: 'The AI analysis could not be parsed correctly. This may be due to document complexity or size. Please try again — if the issue persists, try uploading a smaller or cleaner version of the legal pack.',
            buyerImpact: 'Analysis incomplete — do not rely on this report.',
            documentSource: 'System'
          }],
          buyerCostFigures: [],
          buyerCostSummary: { confirmedTotal: '£0', hasUnquantifiedLiabilities: false, unquantifiedLiabilities: [], costWarning: 'Analysis incomplete.' },
          missingDocuments: [],
          mortgageability: 'Unknown',
          suitableFor: 'Unknown',
          investorAssessment: { mortgageable: false, resaleable: false, tenantable: false, insurable: 'Unknown', cautionaryNote: 'Analysis incomplete — please re-run.' },
          titleAnalysis: { whatBuyerCannotDo: 'Analysis incomplete.' }
        };
      }
    }

    // Normalise AI output — reduce false positives, fix document classification
    result = normalizeAnalysisResult(result);

    // Inject listing metadata into result for report display
    if (listingMeta && batchIndex === 1) {
      result._listingMeta = listingMeta;
    }

    // Use extracted address as pack name — prefer listing meta address if AI didn't find one
    const packName = result.address || (listingMeta?.propertyAddress) || req.body.packName || 'Legal Pack';

    if (batchIndex === totalBatches) {
      await recordAnalysis(user, packName, result, usage);
    }

    // Delay between batches to stay under rate limit
    if (batchIndex < totalBatches) {
      await new Promise(r => setTimeout(r, 5000));
    }

    res.json({
      result,
      packName,
      usage: { input: usage.input_tokens, output: usage.output_tokens },
      batchIndex,
      totalBatches
    });

  } catch (e) {
    console.error('Analysis error:', e);
    if (e.status === 429) {
      return res.status(429).json({ error: 'Rate limit hit — please wait 30 seconds and try again' });
    }
    res.status(500).json({ error: e.message || 'Analysis failed' });
  }
});

app.get('/analyses', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('analyses')
    .select('id, pack_name, verdict, risk_score, issues_count, high_count, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: 'Failed to fetch analyses' });
  res.json({ analyses: data });
});

app.get('/analyses/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Analysis not found' });
  res.json({ analysis: data });
});

// DELETE /analyses/:id
app.delete('/analyses/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('analyses')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: 'Failed to delete' });
  res.json({ deleted: true });
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════════════════════════════════════

const ADMIN_EMAIL = 'aliahmedv2005@gmail.com';

const requireAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user || user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  req.authUser = user;
  next();
};

app.get('/admin/users', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Failed to fetch users' });
  res.json({ users: data });
});

app.get('/admin/analyses', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('analyses')
    .select('id, pack_name, verdict, risk_score, issues_count, high_count, tokens_input, tokens_output, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return res.status(500).json({ error: 'Failed to fetch analyses' });

  // Attach emails
  const userIds = [...new Set(data.map(a => a.user_id))];
  const { data: users } = await supabase.from('users').select('id, email').in('id', userIds);
  const emailMap = {};
  (users || []).forEach(u => emailMap[u.id] = u.email);
  const enriched = data.map(a => ({ ...a, user_email: emailMap[a.user_id] || null }));

  res.json({ analyses: enriched });
});

app.post('/admin/grant-credit', requireAdmin, async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const { data: u } = await supabase.from('users').select('pay_as_you_go_credits').eq('id', userId).single();
  const { error } = await supabase.from('users')
    .update({ pay_as_you_go_credits: (u?.pay_as_you_go_credits || 0) + 1 })
    .eq('id', userId);
  if (error) return res.status(500).json({ error: 'Failed to grant credit' });
  res.json({ ok: true });
});

app.post('/admin/change-plan', requireAdmin, async (req, res) => {
  const { userId, plan } = req.body;
  if (!userId || !plan) return res.status(400).json({ error: 'userId and plan required' });
  const valid = ['pay_as_you_go', 'standard', 'pro'];
  if (!valid.includes(plan)) return res.status(400).json({ error: 'Invalid plan' });
  const { error } = await supabase.from('users').update({ plan }).eq('id', userId);
  if (error) return res.status(500).json({ error: 'Failed to change plan' });
  res.json({ ok: true });
});

// ════════════════════════════════════════════════════════════════════════════
// STRIPE ROUTES
// ════════════════════════════════════════════════════════════════════════════

// POST /payments/intent — embedded checkout payment intent
app.post('/payments/intent', requireAuth, async (req, res) => {
  const { plan } = req.body;
  const user = req.user;
  try {
    const customerId = await ensureStripeCustomer(user);
    if (plan === 'pay_as_you_go') {
      const qty = Math.max(1, Math.min(50, parseInt(req.body.qty) || 1));
      const unitPrice = qty > 1 ? Math.round(999 * 0.75) : 999; // 25% off for bulk
      const total = unitPrice * qty;
      const intent = await stripe.paymentIntents.create({
        amount: total, currency: 'gbp', customer: customerId,
        setup_future_usage: 'off_session',
        metadata: { userId: user.id, plan: 'pay_as_you_go', qty: qty.toString() },
        description: `LegalPack AI — ${qty} Analysis Credit${qty > 1 ? 's' : ''}${qty > 1 ? ' (25% bulk discount)' : ''}`
      });
      res.json({ clientSecret: intent.client_secret, type: 'payment', amount: total, qty });
    } else if (plan === 'standard' || plan === 'pro') {
      const priceId = plan === 'standard' ? process.env.STRIPE_STANDARD_PRICE_ID : process.env.STRIPE_PRO_PRICE_ID;
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: { userId: user.id, plan }
      });
      res.json({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        type: 'subscription',
        subscriptionId: subscription.id,
        amount: plan === 'standard' ? 2999 : 9999
      });
    } else {
      res.status(400).json({ error: 'Invalid plan' });
    }
  } catch(e) {
    console.error('Payment intent error:', e);
    res.status(500).json({ error: e.message || 'Failed to create payment' });
  }
});

app.post('/payments/checkout', requireAuth, async (req, res) => {
  const { plan } = req.body;
  const user = req.user;

  try {
    // Always ensure a Stripe customer exists before creating any session
    const customerId = await ensureStripeCustomer(user);

    let session;

    if (plan === 'pay_as_you_go') {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'LegalPack AI — Single Analysis',
              description: 'Full AI analysis of one property auction legal pack'
            },
            unit_amount: 999,
          },
          quantity: 1,
        }],
        success_url: `${process.env.FRONTEND_URL}/legal-pack-ai.html?payment=success`,
        cancel_url: `${process.env.FRONTEND_URL}/legal-pack-ai.html?payment=cancelled`,
        metadata: { userId: user.id, plan: 'pay_as_you_go' }
      });
    } else if (plan === 'standard') {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [{ price: process.env.STRIPE_STANDARD_PRICE_ID, quantity: 1 }],
        success_url: `${process.env.FRONTEND_URL}/legal-pack-ai.html?payment=success`,
        cancel_url: `${process.env.FRONTEND_URL}/legal-pack-ai.html?payment=cancelled`,
        metadata: { userId: user.id, plan: 'standard' }
      });
    } else if (plan === 'pro') {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
        success_url: `${process.env.FRONTEND_URL}/legal-pack-ai.html?payment=success`,
        cancel_url: `${process.env.FRONTEND_URL}/legal-pack-ai.html?payment=cancelled`,
        metadata: { userId: user.id, plan: 'pro' }
      });
    } else {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    res.json({ url: session.url });

  } catch (e) {
    console.error('Checkout error:', e);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.post('/payments/portal', requireAuth, async (req, res) => {
  try {
    // Ensure customer exists before opening portal
    const customerId = await ensureStripeCustomer(req.user);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error('Portal error:', e);
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});


// ── PROPERTY INTEL ────────────────────────────────────────────────────────────
app.post('/intel/property', requireAuth, async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Address required' });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `You are a UK property data researcher. Search for detailed information about this UK property: "${address}".

Search for:
1. Land Registry sold price history (search "land registry sold prices ${address}" and site:rightmove.co.uk/house-prices)
2. Current listing if available (Rightmove, Zoopla)
3. EPC rating (search "EPC certificate ${address}" or epc.opendatacommunities.org)
4. Council tax band (search "council tax band ${address}")
5. Flood risk (search "flood risk ${address} UK environment agency")
6. Planning history (search "planning applications ${address}")
7. Nearby recently sold properties for comparables

After searching, return ONLY a valid JSON object with no extra text:
{
  "lastSoldPrice": "£XXX,XXX or null",
  "lastSoldDate": "Month YYYY or null",
  "lastSoldType": "Freehold/Leasehold or null",
  "estimatedValue": "£XXX,XXX or null",
  "epcRating": "A/B/C/D/E/F/G or null",
  "councilTaxBand": "A/B/C/D/E/F/G/H or null",
  "floodRisk": "Very Low/Low/Medium/High or null",
  "tenure": "Freehold/Leasehold or null",
  "listingStatus": "Currently listed at £XXX,XXX / Not currently listed",
  "planningHistory": ["brief description of each application"],
  "comparables": [
    {"address": "nearby address", "price": "£XXX,XXX", "date": "Mon YYYY"}
  ],
  "notes": "any important notes about the property or area"
}`
      }]
    });

    const text = message.content.filter(b => b.type === 'text').map(b => b.text).join('');
    let intel = {};
    try {
      const s = text.indexOf('{'), e = text.lastIndexOf('}');
      if (s !== -1) intel = JSON.parse(text.slice(s, e + 1));
    } catch(e) {
      console.error('Intel parse error:', e);
    }
    res.json({ intel });
  } catch(e) {
    console.error('Property intel error:', e);
    res.status(500).json({ error: 'Property search failed' });
  }
});

// ── AUCTION SEARCH ────────────────────────────────────────────────────────────
app.post('/intel/auctions', requireAuth, async (req, res) => {
  const { city, county, radius } = req.body;
  if (!city) return res.status(400).json({ error: 'Location required' });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for upcoming UK property auctions near ${city}${county ? ', ' + county : ''} within ${radius} miles. Today is ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.

Search these auction houses specifically:
- SDL Auctions (sdlauctions.co.uk)
- iamsold (iamsold.co.uk)
- Allsop (allsopauctions.com)
- EIG Property Auctions (eigpropertyauctions.co.uk)
- Auction.co.uk
- Pugh Auctions (pugh-auctions.com)
- Mark Jenkinson (markjenkinson.co.uk)
- BidX1 (bidx1.com)
- Also search "property auction ${city} 2025 2026"

Find REAL upcoming auction dates. Return ONLY a valid JSON array:
[
  {
    "auctioneer": "Company name",
    "title": "Auction name/description",
    "date": "Day Month YYYY",
    "location": "Venue name and city, or Online",
    "url": "actual URL to auction page",
    "lots": "number or null",
    "distanceMiles": estimated miles from ${city} as number or null
  }
]

Only include auctions that have not yet happened. Return empty array [] if none found.`
      }]
    });

    const text = message.content.filter(b => b.type === 'text').map(b => b.text).join('');
    let auctions = [];
    try {
      const s = text.indexOf('['), e = text.lastIndexOf(']');
      if (s !== -1) auctions = JSON.parse(text.slice(s, e + 1));
    } catch(e) {
      console.error('Auctions parse error:', e);
    }
    res.json({ auctions });
  } catch(e) {
    console.error('Auction search error:', e);
    res.status(500).json({ error: 'Auction search failed' });
  }
});

// ── STRIPE WEBHOOK ────────────────────────────────────────────────────────────
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error('Webhook signature failed:', e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  try {
    switch (event.type) {

      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        const userId = intent.metadata?.userId;
        const qty = parseInt(intent.metadata?.qty) || 1;
        if (!userId || intent.metadata?.plan !== 'pay_as_you_go') break;
        const { data: u } = await supabase.from('users').select('pay_as_you_go_credits').eq('id', userId).single();
        await supabase.from('users')
          .update({ pay_as_you_go_credits: (u?.pay_as_you_go_credits || 0) + qty })
          .eq('id', userId);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId) break;

        if (session.mode === 'payment') {
          // PAYG: add credits based on qty purchased
          const qty = parseInt(session.metadata?.qty) || 1;
          const { data: u } = await supabase.from('users').select('pay_as_you_go_credits').eq('id', userId).single();
          await supabase.from('users')
            .update({ pay_as_you_go_credits: (u?.pay_as_you_go_credits || 0) + qty })
            .eq('id', userId);
        }

        // Store stripe_customer_id if not already set
        if (session.customer) {
          await supabase.from('users')
            .update({ stripe_customer_id: session.customer })
            .eq('id', userId)
            .is('stripe_customer_id', null);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const plan = getPlanFromStripePrice(sub.items.data[0]?.price?.id);
        if (!plan) break;

        const { data: user } = await supabase
          .from('users').select('id').eq('stripe_customer_id', sub.customer).single();

        if (user) {
          await supabase.from('users')
            .update({
              plan,
              stripe_subscription_id: sub.id,
              subscription_status: sub.status,
              current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null
            })
            .eq('id', user.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const { data: user } = await supabase
          .from('users').select('id').eq('stripe_customer_id', sub.customer).single();

        if (user) {
          await supabase.from('users')
            .update({ plan: 'pay_as_you_go', subscription_status: 'cancelled', stripe_subscription_id: null })
            .eq('id', user.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.billing_reason === 'subscription_cycle') {
          const { data: user } = await supabase
            .from('users').select('id').eq('stripe_customer_id', invoice.customer).single();

          if (user) {
            await supabase.from('users')
              .update({ analyses_used_this_month: 0 })
              .eq('id', user.id);
          }
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (e) {
    console.error('Webhook handler error:', e);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════

function safeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    plan: user.plan,
    analysesUsedThisMonth: user.analyses_used_this_month,
    analysesTotal: user.analyses_total,
    payAsYouGoCredits: user.pay_as_you_go_credits || 0,
    subscriptionStatus: user.subscription_status,
    currentPeriodEnd: user.current_period_end,
    createdAt: user.created_at,
  };
}

async function recordAnalysis(user, packName, result, usage) {
  const flags = result.flags || result.risks || [];
  const criticalCount = flags.filter(f => f.severity === 'critical' || f.severity === 'high').length;

  await supabase.from('analyses').insert({
    user_id: user.id,
    pack_name: packName,
    verdict: result.verdict || (criticalCount > 3 ? 'no' : criticalCount > 0 ? 'caution' : 'yes'),
    risk_score: result.riskScore || (criticalCount * 15),
    issues_count: flags.length,
    high_count: criticalCount,
    result_json: result,
    tokens_input: usage?.input_tokens || 0,
    tokens_output: usage?.output_tokens || 0,
  });

  if (user.plan === 'pay_as_you_go') {
    await supabase.from('users')
      .update({
        pay_as_you_go_credits: Math.max(0, (user.pay_as_you_go_credits || 0) - 1),
        analyses_total: (user.analyses_total || 0) + 1
      })
      .eq('id', user.id);
  } else {
    await supabase.from('users')
      .update({
        analyses_used_this_month: (user.analyses_used_this_month || 0) + 1,
        analyses_total: (user.analyses_total || 0) + 1
      })
      .eq('id', user.id);
  }
}

function getPlanFromStripePrice(priceId) {
  if (priceId === process.env.STRIPE_STANDARD_PRICE_ID) return 'standard';
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  return null;
}

function buildAnalysisPrompt() {
  return `CORE ROLE
You are an extremely cautious UK property solicitor and auction due-diligence analyst acting solely for the BUYER.
Your job is to protect the buyer from real legal, financial, title, planning, lease, auction, mortgageability and resale risks.
However, you must be commercially realistic.
You must NOT catastrophise routine conveyancing wording.
You must NOT treat standard search disclaimers as confirmed defects.
You must NOT treat every missing or unparsed document as a severe risk.
You must distinguish confirmed issues from possible issues, standard limitations, and optional buyer due diligence.
The product should feel like: "a cautious UK auction conveyancer" NOT: "an AI catastrophising every theoretical issue."

Assume the buyer may be inexperienced, using savings or bridging finance, and cannot afford hidden liabilities, unmortgageable issues, or resale problems.

You must:
- Read EVERY page
- Cross-check documents against each other
- Never invent facts
- Never assume missing information is acceptable, but classify absence accurately
- Distinguish between confirmed defects, possible issues, standard legal limitations, and optional buyer due diligence
- Do not escalate routine boilerplate wording into major risk unless the document contains an actual adverse entry
- Prioritise buyer protection, but remain legally realistic and evidence-based

If something is unclear, contradictory, or absent: state this precisely, explain why it matters, say what further enquiry/document is needed. Do NOT exaggerate the consequence unless supported by evidence.

==================================================
FIRST TASK — IDENTIFY PROPERTY
==================================================
Before analysis:
1. Identify the FULL property address
2. Identify tenure: Freehold / Leasehold / Share of Freehold / Commonhold / Unknown
3. Identify: title number, seller, auction house if present, guide price if present

Cross-check the address across: title register, EPC, searches, special conditions, lease, transfer, sales particulars, auction conditions. Flag any mismatch immediately.

==================================================
DOCUMENT STATUS LOGIC
==================================================
Do NOT simply say "missing" for everything. Classify documents into:
1. PROVIDED — Document is clearly present and reviewed.
2. NOT IDENTIFIED — Document was not found in the uploaded pack or parsed content.
3. REFERENCED BUT NOT FOUND — A document appears to be referred to, but the actual document was not available.
4. OPTIONAL BUYER DUE DILIGENCE — Documents not normally expected inside auction legal packs, but a prudent buyer may still want them (structural survey, CCTV drainage, EICR, asbestos survey).

IMPORTANT: Do NOT list a document as missing if you have analysed it or quoted from it.
Example: If you analyse the Drainage and Water Search, it MUST be listed under provided, not missing.
If Common Auction Conditions are present but Special Conditions are not identified, say: "Common Auction Conditions are provided, however no separate Special Conditions of Sale document was identified within the uploaded pack." Do NOT say: "No property-specific legal terms provided" unless this is clearly true.

==================================================
FREEHOLD / LEASEHOLD SUPPRESSION
==================================================
If tenure is Freehold: Suppress leasehold-only warnings unless actual leasehold evidence exists.
Do NOT warn about: management pack, lease extension, ground rent, service charge, forfeiture, freeholder consent, lease length — unless the documents actually show leasehold or mixed tenure.
If tenure is Unknown: You may state that leasehold/freehold position cannot be verified, but do not assume leasehold risks.

==================================================
RISK CLASSIFICATION
==================================================
Every issue must include:
1. severity: critical / warning / note / information
2. confidence: confirmed / likely / possible / standard precaution / information only
3. issueType: verified issue / possible issue / standard legal limitation / information gap / optional buyer due diligence

VERIFIED ISSUE: Direct evidence exists. (blank TR2 transferee, no title guarantee, adverse local search entry, unpaid arrears stated, restrictive covenant shown, enforcement notice shown)
POSSIBLE ISSUE: Documents suggest further enquiries may be needed, but no defect is confirmed.
STANDARD LEGAL LIMITATION: Generic search-provider wording or routine caveat that appears in many searches. ("please refer to vendor", "no statutory access to records", "further enquiries should be made", generic drainage notes, generic environmental caveats)
OPTIONAL BUYER DUE DILIGENCE: Useful checks buyers often commission themselves. (structural survey, EICR, CCTV drainage, gas reinspection, asbestos survey)

==================================================
STANDARD SEARCH WORDING DETECTION
==================================================
You must recognise common boilerplate. Do NOT escalate generic wording into major defects.
Examples of boilerplate (should be note/information/standard precaution/further enquiry, NOT critical/severe/unmortgageable):
- "further enquiries should be made"
- "no statutory access to records"
- "please refer to vendor"
- "records do not confirm"
- "public sewer within 100 feet"
- "not all transferred assets are shown"

Only escalate if the document contains a specific adverse result.

==================================================
LANGUAGE MODERATION
==================================================
Prefer: "Further enquiries advised" / "Unable to verify from provided documents" / "Buyer should confirm with solicitor/lender" / "This may require clarification" / "No adverse entry identified, but the document does not confirm..."
Avoid overusing: "unmortgageable" / "uninsurable" / "unlimited liability" / "catastrophic" / "fundamental due diligence impossible" / "buyer inherits non-compliance"
Only use strong language where there is direct evidence.

BAD: "Buyer inherits non-compliance with Building Regulations."
GOOD: "If any extension or structure has been built over or near a public sewer without consent, retrospective approval may be required. No actual breach is confirmed from the documents provided."

==================================================
BUYER COST RULES — NON-NEGOTIABLE
==================================================
Do NOT estimate costs. Only extract figures expressly stated in the documents.
1. Do NOT estimate costs under any circumstances.
2. Do NOT create financial ranges or guesses.
3. Do NOT assign monetary values to theoretical liabilities.
4. Do NOT monetise repair obligations, indemnity clauses, service charge risks, forfeiture clauses, maintenance obligations, lease risks, planning risks, or future liabilities unless the document states an exact figure, percentage, daily rate, annual amount, or formula.
5. Only include an item in buyerCostFigures if there is an actual £ figure, percentage, daily rate, annual amount, or formula expressly stated in the legal pack.
6. If a document says the buyer may be liable but gives no figure, put it in flags or unquantifiedLiabilities, NOT buyerCostFigures.
7. confirmedTotal must only sum items where numericAmount is a real number from the document.

The DETERMINISTIC PRE-EXTRACTION results passed to you should be CONFIRMED, REJECTED, or AUGMENTED — do not invent new costs beyond what is in the documents.

==================================================
MISSING DOCUMENT PRIORITY
==================================================
Do not flood the report with scary "missing" warnings. Classify by importance:

CRITICAL: title register/title plan, special conditions, local authority search, lease (if leasehold), evidence of seller authority, vacant possession/tenancy position where relevant
MODERATE: EPC, planning/building regulation certificates, environmental search, mining search where relevant
LOW/OPTIONAL: TA10, chancel search, structural survey, EICR, guarantees/warranties, sales particulars

Structural surveys are usually NOT part of auction legal packs. Do NOT call a structural survey "missing" as though the legal pack is defective. Classify it as optional buyer due diligence.
Chancel repair: say "Some buyers choose to obtain a chancel search or low-cost indemnity policy." Do NOT say "Absence creates uninsurable risk."

==================================================
OUTPUT FORMAT
==================================================
Return ONLY valid JSON. No commentary, no preamble, no explanation outside the JSON.

{
  "address": "full property address or null",
  "tenure": "Freehold",
  "titleNumber": "string or null",
  "seller": "string or null",
  "auctionHouse": "string or null",
  "guidePrice": "string or null",
  "leaseYears": null,
  "groundRent": "exact figure or N/A",
  "serviceCharge": "exact annual figure or N/A",
  "mortgageability": "Standard",
  "suitableFor": "Standard Mortgage",
  "overallRisk": "LOW",
  "summary": "3-4 sentence plain English executive summary of the most important things a buyer must know before bidding",
  "top5Risks": ["brief description of each top risk"],
  "documentStatus": {
    "provided": [{ "document": "document name", "evidence": "filename/page/reference" }],
    "notIdentified": [{ "document": "document name", "importance": "critical", "reason": "why this matters" }],
    "referencedButNotFound": [{ "document": "document name", "reason": "where/how it was referenced" }],
    "optionalBuyerDueDiligence": [{ "document": "document name", "reason": "why buyer may still want it" }]
  },
  "buyerCostFigures": [
    {
      "label": "exact description of the buyer cost",
      "amount": "exact figure as stated in document — NEVER estimated",
      "numericAmount": 1500,
      "frequency": "one-off",
      "vatApplies": true,
      "mandatory": true,
      "documentSource": "exact document name",
      "evidence": "exact wording, page number, or clause reference"
    }
  ],
  "buyerCostSummary": {
    "confirmedTotal": "£0",
    "hasUnquantifiedLiabilities": true,
    "unquantifiedLiabilities": ["Plain English description of buyer liabilities where NO figure is stated"],
    "costWarning": "This total only includes figures expressly stated in the documents. It does not include unquantified future liabilities, survey costs, solicitor costs, SDLT, finance costs, or any costs not stated in the legal pack."
  },
  "flags": [
    {
      "severity": "warning",
      "confidence": "possible",
      "issueType": "possible issue",
      "category": "Planning/Searches",
      "title": "specific concise title",
      "detail": "plain English explanation with exact clause/page references and quoted wording where possible",
      "buyerImpact": "what this specifically means for the buyer — cost, restriction, or risk",
      "documentSource": "which document this was found in",
      "evidence": "exact quote or page/clause reference"
    }
  ],
  "missingDocuments": [
    {
      "document": "document name",
      "status": "not identified",
      "importance": "critical",
      "risk": "plain English explanation without exaggeration"
    }
  ],
  "titleAnalysis": {
    "restrictiveCovenants": "description or None found",
    "easements": "description or None found",
    "overage": "description or None found",
    "charges": "description or None found",
    "accessIssues": "description or None found",
    "whatBuyerCannotDo": "plain English summary of restrictions"
  },
  "investorAssessment": {
    "mortgageable": true,
    "resaleable": true,
    "tenantable": true,
    "insurable": "Likely",
    "cautionaryNote": "Would a cautious investor proceed, proceed with solicitor checks, or walk away? Explain realistically."
  }
}

==================================================
FINAL CRITICAL RULES
==================================================
- NEVER invent facts.
- NEVER invent costs.
- NEVER estimate costs.
- NEVER list a document as missing if it is clearly present or quoted in your own analysis.
- NEVER escalate routine search boilerplate into severe risk.
- NEVER include leasehold warnings where tenure is clearly freehold unless leasehold evidence exists.
- NEVER say "appears fine" without evidence.
- If uncertain, state: "Unable to verify from provided documents."
- Distinguish: confirmed issues / possible issues / standard legal limitations / missing evidence / optional buyer due diligence
- Order flags by actual importance, not theoretical worst case.
- Be cautious but commercially realistic.

Return ONLY JSON. No preamble, no explanation outside the JSON.`;
}

function normalizeAnalysisResult(result) {
  if (!result || typeof result !== 'object') return result;
  const tenure = String(result.tenure || '').toLowerCase();

  // Ensure arrays/objects exist
  result.flags = Array.isArray(result.flags) ? result.flags : [];
  result.missingDocuments = Array.isArray(result.missingDocuments) ? result.missingDocuments : [];
  result.documentStatus = result.documentStatus || { provided: [], notIdentified: [], referencedButNotFound: [], optionalBuyerDueDiligence: [] };
  result.documentStatus.provided = Array.isArray(result.documentStatus.provided) ? result.documentStatus.provided : [];
  result.documentStatus.notIdentified = Array.isArray(result.documentStatus.notIdentified) ? result.documentStatus.notIdentified : [];
  result.documentStatus.referencedButNotFound = Array.isArray(result.documentStatus.referencedButNotFound) ? result.documentStatus.referencedButNotFound : [];
  result.documentStatus.optionalBuyerDueDiligence = Array.isArray(result.documentStatus.optionalBuyerDueDiligence) ? result.documentStatus.optionalBuyerDueDiligence : [];

  // If a document is cited in flags, treat it as provided
  const providedNames = new Set(
    result.documentStatus.provided.map(d => String(d.document || '').toLowerCase()).filter(Boolean)
  );
  for (const flag of result.flags) {
    if (flag.documentSource) {
      const doc = String(flag.documentSource).trim();
      const key = doc.toLowerCase();
      if (doc && !providedNames.has(key) && key !== 'system') {
        result.documentStatus.provided.push({ document: doc, evidence: flag.evidence || flag.detail || 'Referenced in analysis' });
        providedNames.add(key);
      }
    }
    // Add safer defaults for new schema fields
    if (!flag.confidence) flag.confidence = flag.severity === 'critical' ? 'confirmed' : 'possible';
    if (!flag.issueType) flag.issueType = flag.severity === 'critical' ? 'verified issue' : 'possible issue';
  }

  // Remove missing docs that are actually provided
  const providedText = Array.from(providedNames).join(' ');
  const isActuallyProvided = (name) => {
    if (!name) return false;
    if (providedText.includes(name)) return true;
    if (name.includes('drainage and water') && providedText.includes('drainage')) return true;
    if (name.includes('drainage') && providedText.includes('drainage')) return true;
    return false;
  };
  result.missingDocuments = result.missingDocuments.filter(md => !isActuallyProvided(String(md.document || '').toLowerCase()));
  result.documentStatus.notIdentified = result.documentStatus.notIdentified.filter(md => !isActuallyProvided(String(md.document || '').toLowerCase()));

  // Suppress leasehold-only warnings if freehold
  if (tenure.includes('freehold') && !tenure.includes('leasehold')) {
    const leaseholdTerms = ['management pack', 'lease extension', 'ground rent', 'service charge', 'forfeiture', 'freeholder consent', 'lease length', 'leasehold'];
    const isLeaseholdOnly = (txt) => leaseholdTerms.some(t => txt.includes(t));
    result.flags = result.flags.filter(f => !isLeaseholdOnly(`${f.title || ''} ${f.detail || ''} ${f.category || ''}`.toLowerCase()));
    result.missingDocuments = result.missingDocuments.filter(md => !isLeaseholdOnly(`${md.document || ''} ${md.risk || ''}`.toLowerCase()));
    result.documentStatus.notIdentified = result.documentStatus.notIdentified.filter(md => !isLeaseholdOnly(`${md.document || ''} ${md.reason || ''}`.toLowerCase()));
  }

  // Move obviously optional items out of missingDocuments
  const optionalDocs = ['structural survey', 'building survey', 'cctv drainage', 'drainage survey', 'eicr', 'electrical installation condition report', 'asbestos survey', 'chancel', 'ta10', 'fittings and contents', 'guarantees', 'warranties'];
  const remainingMissing = [];
  for (const md of result.missingDocuments) {
    const txt = `${md.document || ''} ${md.risk || ''}`.toLowerCase();
    if (optionalDocs.some(term => txt.includes(term))) {
      result.documentStatus.optionalBuyerDueDiligence.push({ document: md.document, reason: md.risk || 'Buyer may wish to obtain this separately.' });
    } else {
      remainingMissing.push(md);
    }
  }
  result.missingDocuments = remainingMissing;

  // Downgrade possible/standard issues incorrectly marked critical
  for (const flag of result.flags) {
    const conf = String(flag.confidence || '').toLowerCase();
    const type = String(flag.issueType || '').toLowerCase();
    if (
      (conf.includes('possible') || conf.includes('standard') || type.includes('standard legal limitation') || type.includes('information gap')) &&
      flag.severity === 'critical'
    ) {
      flag.severity = 'warning';
    }
  }

  return result;
}

function attemptRecovery(text) {
  try {
    let fixed = text.replace(/,\s*$/, '');
    let depth = 0, inStr = false, escape = false;
    for (let i = 0; i < fixed.length; i++) {
      const c = fixed[i];
      if (escape) { escape = false; continue; }
      if (c === '\\') { escape = true; continue; }
      if (c === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (c === '{' || c === '[') depth++;
      if (c === '}' || c === ']') depth--;
    }
    if (inStr) fixed += '"';
    for (let k = 0; k < depth; k++) fixed += k === depth - 1 ? '}' : ']';
    return JSON.parse(fixed);
  } catch (e) { return null; }
}

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => console.log(`LegalPack AI backend running on port ${PORT}`));
server.timeout = 600000;        // 10 min — handles large ZIPs
server.keepAliveTimeout = 620000;
server.headersTimeout = 630000;

// ── SHARED REPORT (read-only public link) ─────────────────────────────────────
app.get('/share/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('analyses')
    .select('id, pack_name, result_json, issues_count, high_count, created_at')
    .eq('id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Report not found' });
  res.json({ report: data });
});

// ── NOTES ON REPORTS ──────────────────────────────────────────────────────────
app.patch('/analyses/:id/notes', requireAuth, async (req, res) => {
  const { notes } = req.body;
  const { error } = await supabase
    .from('analyses')
    .update({ notes })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: 'Failed to save notes' });
  res.json({ ok: true });
});

// ── LISTING SCRAPER ───────────────────────────────────────────────────────────
app.post('/scrape-listing', requireAuth, async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('http')) return res.status(400).json({ error: 'Valid URL required' });

  let puppeteer;
  try { puppeteer = require('puppeteer'); } catch(e) {
    return res.status(500).json({ error: 'Puppeteer not installed. Run: npm install puppeteer' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    // Navigate with timeout
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000)); // let JS render
    } catch(e) {
      // Try anyway even if timeout
      console.log('Navigation timeout, continuing:', e.message);
    }

    // Screenshot
    const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false, type: 'jpeg', quality: 75 });

    // Extract visible text for Claude to parse
    const pageText = await page.evaluate(() => {
      // Remove nav, footer, scripts, styles for cleaner text
      const remove = document.querySelectorAll('nav,footer,script,style,header,.cookie-banner,.cookie-notice,[class*="cookie"],[class*="nav"],[class*="footer"],[id*="cookie"]');
      remove.forEach(el => el.remove());
      return document.body?.innerText?.substring(0, 8000) || '';
    });

    const pageTitle = await page.title();
    await browser.close();
    browser = null;

    // Send screenshot + text to Claude to extract structured data
    const extractPrompt = `You are extracting property auction listing information from a UK auctioneer website.

Page URL: ${url}
Page title: ${pageTitle}

Page text content:
${pageText}

Extract the following fields. Return ONLY valid JSON, no other text:
{
  "auctionHouse": "name of the auction company (e.g. SDL Auctions, Allsop, BidX1, Savills, etc.)",
  "auctionDate": "date of auction in format DD Month YYYY, or null if not found",
  "auctionTime": "time of auction e.g. 10:00am, or null",
  "auctionVenue": "location or 'Online' or null",
  "propertyAddress": "full property address including postcode if shown, or null",
  "guidePrice": "guide price as shown e.g. £125,000 or £125,000+ or null",
  "lotNumber": "lot number as shown e.g. Lot 42, or null",
  "propertyType": "e.g. Terraced House, Flat, Land, Commercial, etc. or null",
  "tenure": "Freehold or Leasehold or null",
  "description": "1-2 sentence description of the property from the listing, or null",
  "legalPackUrl": "URL to download the legal pack if visible on the page, or null"
}

If a field genuinely cannot be found, use null. Never guess or invent values.`;

    const aiResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: screenshot }
          },
          { type: 'text', text: extractPrompt }
        ]
      }]
    });

    let extracted = {};
    try {
      const rawText = aiResponse.content[0]?.text || '{}';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch(e) {
      console.log('JSON parse error from Claude:', e.message);
    }

    return res.json({
      ok: true,
      screenshot: `data:image/jpeg;base64,${screenshot}`,
      extracted,
      url
    });

  } catch(e) {
    if (browser) try { await browser.close(); } catch(e2) {}
    console.error('Scrape error:', e.message);

    // Fallback: try plain HTTP fetch if Puppeteer fails
    try {
      const fetch = require('node-fetch');
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
        timeout: 10000
      });
      const html = await r.text();
      // Strip tags for plain text
      const text = html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').substring(0, 6000);

      const aiResponse = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{ role: 'user', content: `Extract property auction listing info from this UK auctioneer page text. URL: ${url}\n\nText: ${text}\n\nReturn ONLY JSON with fields: auctionHouse, auctionDate, auctionTime, auctionVenue, propertyAddress, guidePrice, lotNumber, propertyType, tenure, description, legalPackUrl. Use null for missing fields.` }]
      });

      let extracted = {};
      try { const m = (aiResponse.content[0]?.text||'{}').match(/\{[\s\S]*\}/); extracted = m ? JSON.parse(m[0]) : {}; } catch(e2) {}

      return res.json({ ok: true, screenshot: null, extracted, url, fallback: true });
    } catch(e2) {
      return res.status(500).json({ error: 'Could not scrape this page: ' + e.message });
    }
  }
});

// ── REFERRAL ──────────────────────────────────────────────────────────────────
app.post('/referral/apply', requireAuth, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required' });

  const codeClean = code.trim().toUpperCase();
  if (codeClean.length !== 8) return res.status(400).json({ error: 'Referral code must be 8 characters' });

  // Fetch all users and match in JS — avoids UUID column filtering issues
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, pay_as_you_go_credits');

  if (error || !users) return res.status(500).json({ error: 'Could not validate code' });

  console.log('Referral lookup: code =', codeClean, 'users count =', users.length);
  console.log('Sample IDs:', users.slice(0,3).map(u => u.id));

  // Match: first 8 chars of UUID (with hyphens stripped or not)
  const referrer = users.find(u => {
    const idUpper = u.id.toUpperCase();
    const idNoHyphen = u.id.replace(/-/g,'').toUpperCase();
    return idUpper.startsWith(codeClean) || idNoHyphen.startsWith(codeClean);
  });

  if (!referrer) return res.status(404).json({ error: 'Invalid referral code — check you entered it correctly' });
  if (referrer.id === req.user.id) return res.status(400).json({ error: 'You cannot use your own referral code' });

  // Check not already used
  const { data: existing } = await supabase
    .from('users')
    .select('referral_used')
    .eq('id', req.user.id)
    .single();

  if (existing?.referral_used) return res.status(400).json({ error: 'You have already used a referral code' });

  // Grant 1 credit to both
  await Promise.all([
    supabase.from('users').update({
      pay_as_you_go_credits: (req.user.pay_as_you_go_credits || 0) + 1,
      referral_used: true
    }).eq('id', req.user.id),
    supabase.from('users').update({
      pay_as_you_go_credits: (referrer.pay_as_you_go_credits || 0) + 1
    }).eq('id', referrer.id)
  ]);

  console.log('Referral success:', req.user.id, 'used code of', referrer.id);
  res.json({ ok: true, message: 'You and your friend each get 1 free credit!' });
});
