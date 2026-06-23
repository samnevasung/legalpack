const fs = require('fs');
const path = require('path');
const BASE = 'C:/Users/A/legalpack';

const HEAD = (title, desc, slug, tag) => `<!DOCTYPE html>
<html lang="en-GB">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18221573839"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18221573839');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="https://legalpackai.com/${slug}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="LegalPack AI">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="https://legalpackai.com/${slug}">
<meta property="og:image" content="https://legalpackai.com/logo-full@2x.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@legalpackai">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--purple:#6d28d9;--purple2:#7c3aed;--purplebg:#f5f0ff;--purplemid:#ddd6fe;--purpledeep:#4c1d95;--t1:#0d0c1a;--t2:#4a4863;--t3:#9490b0;--bg:#f8f7ff;--bg2:#f2f1fc;--b1:#e2e0f0;--red:#dc2626;--redbg:#fef2f2;--redmid:#fecaca;--amber:#d97706;--amberbg:#fffbeb;--ambermid:#fef3c7;--ok:#15803d;--okbg:#f0fdf4;--okmid:#dcfce7;}
html{font-size:16px;scroll-behavior:smooth}
body{background:#fff;color:var(--t1);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
a{color:var(--purple);text-decoration:none;}a:hover{text-decoration:underline;}
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--b1);padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo{display:flex;align-items:center;gap:9px;font-size:16px;font-weight:800;color:var(--t1);letter-spacing:-0.4px;text-decoration:none;}
.nav-logo-icon{width:30px;height:30px;background:var(--purple);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;}
.nav-cta{padding:9px 20px;background:var(--purple);color:#fff;border-radius:9px;font-size:13px;font-weight:700;text-decoration:none;transition:all 0.15s;box-shadow:0 3px 12px rgba(109,40,217,0.3);}
.nav-cta:hover{background:var(--purpledeep);text-decoration:none;}
.hero-content{max-width:760px;margin:0 auto;padding:64px 24px 48px;}
.breadcrumb{font-size:13px;color:var(--t3);margin-bottom:20px;font-family:'DM Mono',monospace;}
.breadcrumb a{color:var(--t3);}.breadcrumb a:hover{color:var(--purple);}
.article-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${tag.color};background:${tag.bg};border:1px solid ${tag.border};padding:4px 12px;border-radius:20px;margin-bottom:18px;}
h1{font-size:48px;font-weight:800;letter-spacing:-2.5px;line-height:1.04;color:var(--t1);margin-bottom:18px;}
h1 em{color:var(--purple);font-style:italic;font-family:'Instrument Serif',serif;font-weight:400;}
.article-intro{font-size:19px;color:var(--t2);line-height:1.72;margin-bottom:32px;font-weight:400;}
.article-meta{display:flex;align-items:center;gap:16px;font-size:13px;color:var(--t3);font-family:'DM Mono',monospace;padding-bottom:32px;border-bottom:1px solid var(--b1);margin-bottom:48px;}
article{max-width:760px;margin:0 auto;padding:0 24px 80px;}
h2{font-size:28px;font-weight:800;letter-spacing:-1px;color:var(--t1);margin:48px 0 16px;}
h3{font-size:20px;font-weight:700;letter-spacing:-0.4px;color:var(--t1);margin:32px 0 12px;}
p{font-size:16.5px;color:var(--t2);line-height:1.78;margin-bottom:18px;}
ul,ol{margin:0 0 18px 20px;}
li{font-size:16px;color:var(--t2);line-height:1.72;margin-bottom:8px;}
strong{color:var(--t1);font-weight:700;}
.callout{padding:18px 20px;border-radius:12px;margin:28px 0;border-left:3px solid;}
.callout.warn{background:var(--amberbg);border-color:var(--amber);}
.callout.danger{background:var(--redbg);border-color:var(--red);}
.callout.ok{background:var(--okbg);border-color:var(--ok);}
.callout.info{background:var(--purplebg);border-color:var(--purple);}
.callout-title{font-size:13px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px;}
.callout.warn .callout-title{color:var(--amber);}
.callout.danger .callout-title{color:var(--red);}
.callout.ok .callout-title{color:var(--ok);}
.callout.info .callout-title{color:var(--purple);}
.callout p{margin:0;font-size:15px;}
.ai-flag{background:var(--redbg);border:1px solid var(--redmid);border-left:4px solid var(--red);border-radius:12px;padding:20px 22px;margin:28px 0;font-family:'DM Mono',monospace;font-size:14px;color:var(--t2);line-height:1.65;}
.ai-flag-label{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--red);margin-bottom:10px;}
.cta-box{background:var(--purplebg);border:2px solid var(--purplemid);border-radius:16px;padding:32px;margin:40px 0;text-align:center;}
.cta-box h3{font-size:22px;font-weight:800;letter-spacing:-0.5px;color:var(--t1);margin-bottom:8px;}
.cta-box p{font-size:15px;color:var(--t2);line-height:1.65;margin-bottom:6px;}
.cta-box .free-note{font-size:13px;color:var(--ok);font-weight:700;margin-bottom:20px;}
.btn-primary{display:inline-block;padding:14px 32px;background:var(--purple);color:#fff;border-radius:9px;font-weight:700;font-size:14px;text-decoration:none;transition:all 0.15s;box-shadow:0 3px 12px rgba(109,40,217,0.3);}
.btn-primary:hover{background:var(--purpledeep);transform:translateY(-1px);text-decoration:none;}
.cta-block{background:linear-gradient(135deg,var(--purpledeep),#1e0e5c);border-radius:18px;padding:40px;text-align:center;margin:52px 0;}
.cta-block h2{color:#fff;font-size:26px;letter-spacing:-0.8px;margin:0 0 10px;}
.cta-block p{color:rgba(255,255,255,0.75);font-size:15px;margin:0 0 6px;}
.cta-block .free-badge{display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;font-size:12px;font-weight:700;padding:3px 12px;border-radius:20px;margin-bottom:20px;letter-spacing:0.3px;}
.cta-block a{display:inline-block;padding:15px 36px;background:#fff;color:var(--purpledeep);border-radius:10px;font-weight:800;font-size:15px;text-decoration:none;transition:all 0.15s;}
.cta-block a:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,0.2);text-decoration:none;}
.related-guides{margin:48px 0 0;}
.related-guides h2{margin-bottom:16px;}
.related-list{display:flex;flex-direction:column;gap:10px;}
.related-link{display:block;padding:14px 18px;background:var(--bg);border:1px solid var(--b1);border-radius:10px;font-size:15px;font-weight:600;color:var(--t1);text-decoration:none;transition:all 0.15s;}
.related-link:hover{background:var(--purplebg);border-color:var(--purplemid);color:var(--purple);text-decoration:none;}
.related-link span{font-size:13px;font-weight:400;color:var(--t3);display:block;margin-top:2px;}
.data-table{width:100%;border-collapse:collapse;margin:24px 0;}
.data-table th{font-size:13px;font-weight:700;color:var(--t2);text-align:left;padding:10px 14px;background:var(--bg);border-bottom:2px solid var(--b1);}
.data-table td{font-size:14.5px;color:var(--t2);padding:11px 14px;border-bottom:1px solid var(--b1);line-height:1.5;}
.data-table tr:last-child td{border-bottom:none;}
footer{background:var(--bg);border-top:1px solid var(--b1);padding:28px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
footer p{font-size:12px;color:var(--t3);font-family:'DM Mono',monospace;}
.footer-links{display:flex;gap:20px;}
.footer-links a{font-size:12px;color:var(--t3);}
.footer-links a:hover{color:var(--purple);}
.page-layout{max-width:1060px;margin:0 auto;display:flex;gap:40px;align-items:flex-start;}
.page-layout article{flex:1;min-width:0;max-width:none;margin:0;}
.sidebar{width:220px;flex-shrink:0;position:sticky;top:80px;padding-right:24px;}
.sidebar-box{background:var(--bg);border:1px solid var(--b1);border-radius:14px;padding:20px;}
.sidebar-title{font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--t3);margin-bottom:14px;font-family:'DM Mono',monospace;}
.sidebar-links{display:flex;flex-direction:column;gap:2px;}
.sidebar-link{display:block;font-size:13.5px;color:var(--t2);text-decoration:none;padding:9px 10px;border-radius:8px;transition:all 0.15s;line-height:1.3;}
.sidebar-link:hover{background:var(--purplebg);color:var(--purple);text-decoration:none;}
@media(max-width:900px){.page-layout{flex-direction:column;}.sidebar{width:100%;position:static;padding-right:0;}.sidebar-links{flex-direction:row;flex-wrap:wrap;gap:8px;}.sidebar-link{font-size:12.5px;padding:7px 10px;background:var(--bg);border:1px solid var(--b1);}}
@media(max-width:640px){nav{padding:0 20px;}h1{font-size:32px;letter-spacing:-1.2px;}footer{flex-direction:column;text-align:center;}}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo"><div class="nav-logo-icon">🔨</div>LegalPack AI</a>
  <div style="display:flex;align-items:center;gap:18px;">
    <a href="/about.html" style="font-size:13px;font-weight:600;color:#4a4863;text-decoration:none;">About</a>
    <a href="/faq.html" style="font-size:13px;font-weight:600;color:#4a4863;text-decoration:none;">FAQ</a>
    <a href="/dashboard.html" class="nav-cta">Analyse a Pack →</a>
  </div>
</nav>`;

const SIDEBAR = `<aside class="sidebar">
  <div class="sidebar-box">
    <div class="sidebar-title">Free Property Tools</div>
    <div class="sidebar-links">
      <a href="/btl-yield-calculator.html" class="sidebar-link">BTL Yield Calculator</a>
      <a href="/sdlt-calculator.html" class="sidebar-link">SDLT Calculator</a>
      <a href="/auction-legal-pack-checklist.html" class="sidebar-link">Legal Pack Checklist</a>
      <a href="/hidden-costs-auction-legal-pack.html" class="sidebar-link">Hidden Costs Guide</a>
      <a href="/possessory-title.html" class="sidebar-link">Possessory Title Guide</a>
      <a href="/faq.html" class="sidebar-link">FAQ</a>
    </div>
  </div>
</aside>`;

const FOOTER = `<footer>
  <div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:800;color:var(--t1);">
    <div style="width:24px;height:24px;background:var(--purple);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;">🔨</div>
    LegalPack AI
  </div>
  <p>© 2026 LegalPack AI · Built for UK property investors</p>
  <div class="footer-links">
    <a href="/">Home</a><a href="/about.html">About</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a>
  </div>
</footer>
</body></html>`;

const CTA_BOX = (topic) => `<div class="cta-box">
  <h3>Check your legal pack for ${topic}</h3>
  <p>LegalPack AI reads every page and flags issues in plain English — in minutes.</p>
  <p class="free-note">⚡ New users get their first analysis completely free. No card required.</p>
  <a href="/dashboard.html" class="btn-primary">Analyse your legal pack free →</a>
</div>`;

const CTA_BLOCK = (h, sub) => `<div class="cta-block">
  <h2>${h}</h2>
  <p>${sub}</p>
  <div class="free-badge">⚡ First analysis free for new users — no card required</div><br>
  <a href="/dashboard.html">Analyse Your Legal Pack →</a>
</div>`;

const HERO = (breadcrumb, tagText, tag, h1, intro, readtime) => `<div class="hero-content">
  <div class="breadcrumb"><a href="/">Home</a> › ${breadcrumb}</div>
  <div class="article-tag">${tagText}</div>
  <h1>${h1}</h1>
  <p class="article-intro">${intro}</p>
  <div class="article-meta">
    <span>📅 Updated June 2026</span>
    <span>⏱ ${readtime}</span>
    <span>🇬🇧 England &amp; Wales</span>
  </div>
</div>`;

function write(p) {
  const html = HEAD(p.title, p.desc, p.slug, p.tag)
    + HERO(p.breadcrumb, p.tagText, p.tag, p.h1, p.intro, p.readtime)
    + '\n<div class="page-layout">\n<article>\n'
    + p.body
    + '\n</article>\n' + SIDEBAR + '\n</div>\n' + FOOTER;
  fs.writeFileSync(path.join(BASE, p.file), html, 'utf8');
  console.log('Written:', p.file);
}

// ─────────────────────────────────────────────────────────────
// PAGE 6 — can-you-sell-land-with-possessory-title
// ─────────────────────────────────────────────────────────────
write({
  file: 'can-you-sell-land-with-possessory-title.html',
  slug: 'can-you-sell-land-with-possessory-title',
  title: 'Can You Sell Land with Possessory Title? | LegalPack AI',
  desc: 'You can sell land or property with possessory title, but it restricts your buyer pool and can reduce the sale price. Learn what to disclose, how to prepare, and how to maximise your sale.',
  tag: { color: '#15803d', bg: '#f0fdf4', border: '#dcfce7' },
  tagText: '✅ Selling Guide',
  breadcrumb: 'Guides › Can You Sell Land with Possessory Title',
  h1: 'Can you sell land with <em>possessory title</em>?',
  intro: 'Yes — possessory title land can be sold. There is no legal bar on transferring possessory title to a new owner. The practical challenge is that most buyers need a mortgage, most mortgage lenders decline possessory title, and this significantly reduces your buyer pool and achievable price.',
  readtime: '5 min read',
  body: `
<h2>Is it legal to sell possessory title land?</h2>
<p>Yes. Possessory title is a registered class of title at HM Land Registry. It can be bought and sold just like absolute title — the Land Registry will register the transfer to a new owner without issue. The seller's solicitor must disclose the class of title in the sale contract, and the buyer's solicitor will investigate the circumstances of the possessory registration as part of their due diligence.</p>
<p>The issues are practical, not legal. Selling possessory title land is harder than selling absolute title land because the restricted mortgage market dramatically narrows the pool of potential buyers.</p>

<h2>Who can buy possessory title land?</h2>
<ul>
  <li><strong>Cash buyers</strong> — the simplest purchasers. No lender to satisfy. Risk sits with the buyer, who will typically discount heavily for the title uncertainty.</li>
  <li><strong>Bridging finance buyers</strong> — bridging lenders are often more flexible on title quality. Buyers may use bridging to acquire and then attempt to refinance later or sell on.</li>
  <li><strong>Specialist mortgage buyers</strong> — some niche lenders will consider possessory title with indemnity insurance in place, though at higher rates than standard mortgages.</li>
  <li><strong>Investors and developers</strong> — experienced buyers who understand possessory title and have access to cash or specialist finance, and who will price the discount into their offer.</li>
</ul>

<div class="callout warn">
  <div class="callout-title">⚠ Auction is often the best route for possessory title sales</div>
  <p>Auction attracts cash buyers and experienced investors who are comfortable with title risk. A possessory title property that would languish on the open market for months — or fail to sell — can achieve a clean, unconditional sale at auction within weeks. The price will reflect the discount, but the certainty of sale is often worth it.</p>
</div>

<h2>What a seller must disclose</h2>
<p>The class of title is disclosed automatically through the official title register, which forms part of the contract package. The seller's solicitor is required to provide:</p>
<ul>
  <li>The official copies of the title register and title plan showing "Possessory Freehold" or "Possessory Leasehold"</li>
  <li>Any documents explaining the circumstances of the possessory registration (statutory declarations, correspondence with Land Registry)</li>
  <li>Details of any known adverse claim or boundary dispute</li>
  <li>Any existing indemnity insurance policy — this transfers to the buyer and is a significant selling point</li>
</ul>

<h2>How to prepare a possessory title property for sale</h2>
<ol>
  <li><strong>Arrange indemnity insurance if not already in place</strong> — a policy makes the property more attractive to lenders and gives buyers confidence. It transfers on sale, so the buyer benefits too.</li>
  <li><strong>Gather any supporting documents</strong> — statutory declarations, historical correspondence, records of possession. These help buyers' solicitors and insurers assess the risk quickly.</li>
  <li><strong>Consider upgrading to absolute title first</strong> — if you have been registered for 12+ years with no adverse claim, an application to upgrade may be worthwhile before marketing. The process takes several months but removes the discount entirely.</li>
  <li><strong>Price realistically</strong> — price the discount in from day one. Overpricing and reducing later wastes time and signals problems to buyers.</li>
  <li><strong>Consider auction</strong> — unconditional sale, cash buyers, experienced investors. Often the best route for possessory title property.</li>
</ol>

${CTA_BOX('title issues, indemnity requirements, and buyer risks')}

<h2>Frequently asked questions</h2>
<h3>Do I have to tell buyers about possessory title?</h3>
<p>Yes. The class of title appears in the official title register, which is provided to buyers as part of the contract pack. There is no practical way to conceal it, and attempting to do so would be fraudulent misrepresentation.</p>
<h3>Will possessory title affect my sale price?</h3>
<p>Almost certainly. Expect a discount of 5–20% compared to what you would achieve with absolute title, depending on the circumstances. The discount reflects the restricted buyer pool and the risk premium cash buyers require.</p>
<h3>Should I upgrade to absolute title before selling?</h3>
<p>If you qualify (12+ years registered, no adverse claim), upgrading before sale maximises your price and simplifies the sale. The cost (£1,500–£3,000 in legal fees plus several months) needs to be weighed against the expected price uplift.</p>

${CTA_BLOCK('Buying a possessory title property at auction?', 'LegalPack AI identifies possessory title, indemnity gaps, and mortgage risk in your legal pack — in minutes.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide<span>What it is, causes, and risks for buyers</span></a>
    <a href="/upgrade-possessory-title.html" class="related-link">How to upgrade possessory title to absolute title<span>The Land Registry application process explained</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>Get cover and maximise your sale prospects</span></a>
    <a href="/does-possessory-title-affect-value.html" class="related-link">Does possessory title affect property value?<span>Typical discounts and how valuers treat it</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 7 — should-i-buy-house-possessory-title
// ─────────────────────────────────────────────────────────────
write({
  file: 'should-i-buy-house-possessory-title.html',
  slug: 'should-i-buy-house-possessory-title',
  title: 'Should I Buy a House with Possessory Title? | LegalPack AI',
  desc: 'Buying a house with possessory title carries real risk but can offer significant value if approached correctly. Use this framework to decide whether the price justifies the title uncertainty.',
  tag: { color: '#d97706', bg: '#fffbeb', border: '#fef3c7' },
  tagText: '⚠ Buyer Decision',
  breadcrumb: 'Guides › Should I Buy a House with Possessory Title',
  h1: 'Should I buy a house with <em>possessory title</em>?',
  intro: 'The answer depends entirely on the specific circumstances — why the title is possessory, how long it has been registered, whether insurance is available, how you plan to finance the purchase, and what your exit strategy is. Here is the framework for making that decision.',
  readtime: '6 min read',
  body: `
<h2>The core question: why is the title possessory?</h2>
<p>Before anything else, the most important question is <em>why</em> this property has possessory title. The reason determines the realistic risk of an adverse claim and shapes every other consideration.</p>
<table class="data-table">
<thead><tr><th>Reason for possessory title</th><th>Risk level</th><th>Insurance likely?</th></tr></thead>
<tbody>
<tr><td>Lost deeds, 20+ years registered, no known claimant</td><td>Low</td><td>Yes</td></tr>
<tr><td>Lost deeds, recently registered</td><td>Low–Medium</td><td>Usually yes</td></tr>
<tr><td>Adverse possession, original owner untraceable, 12+ years</td><td>Medium</td><td>Often yes</td></tr>
<tr><td>Adverse possession, original owner traceable</td><td>High</td><td>Unlikely</td></tr>
<tr><td>Known dispute or challenge pending</td><td>Very High</td><td>No</td></tr>
</tbody>
</table>

<h2>The five questions to answer before bidding</h2>

<h3>1. Why is the title possessory?</h3>
<p>Ask the seller's solicitor. The explanation should be documented — a statutory declaration, Land Registry correspondence, or a narrative in the special conditions. If no explanation is forthcoming, treat that as a warning sign.</p>

<h3>2. Is indemnity insurance available?</h3>
<p>Contact a legal indemnity insurer before the auction. If they quote a policy, you have a concrete cost to factor in and a named insurer who has assessed the risk as acceptable. If they decline, that is critical information — it means the insurer sees an unacceptable risk of an adverse claim.</p>

<h3>3. Will your lender accept the title?</h3>
<p>If you need mortgage finance, confirm your lender's specific policy on possessory title in writing before bidding. Do not assume. Many lenders decline regardless of insurance. If you plan to use bridging finance, confirm the bridging lender's position.</p>

<h3>4. What is your exit strategy?</h3>
<p>How will you sell this property in the future? If you intend to sell within 5 years, you will face the same restricted buyer pool you are now encountering. Price that in. If you plan to hold long-term and upgrade to absolute title, check that you will qualify for the upgrade.</p>

<h3>5. Is the price right?</h3>
<p>The discount for possessory title should reflect all the costs and risks: insurance premium, potentially higher finance costs, reduced buyer pool on future sale, and upgrade costs if applicable. Compare to verified sales of absolute title equivalents in the same area.</p>

<div class="callout ok">
  <div class="callout-title">✅ When it can make sense to buy</div>
  <p>A possessory title property can be an excellent buy if: the reason is benign (lost deeds, long registration), insurance is available and affordable, you are a cash or bridging buyer, the price discount is material, and you have a clear exit strategy. Experienced auction investors buy possessory title deliberately for exactly this reason.</p>
</div>

<div class="callout danger">
  <div class="callout-title">🔴 Walk away if</div>
  <p>Insurance is refused. There is a known adverse claimant. The pack provides no explanation for the possessory registration. You need a standard mortgage and your lender has declined. The guide price does not reflect a meaningful discount to comparable absolute title properties.</p>
</div>

${CTA_BOX('possessory title risk before you decide to bid')}

<h2>What to check in the legal pack</h2>
<ul>
  <li><strong>A Register (Proprietorship Register)</strong> — confirms the class of title and the date of registration</li>
  <li><strong>Any Land Registry correspondence</strong> — some packs include letters explaining the reason for possessory registration</li>
  <li><strong>Statutory declarations</strong> — a sworn statement from the current or previous owner explaining the circumstances</li>
  <li><strong>Special conditions of sale</strong> — check whether the seller is requiring the buyer to accept the title without further enquiry</li>
  <li><strong>Existing indemnity policy</strong> — if one is already in place, check its coverage amount and whether it transfers</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Is possessory title always a problem?</h3>
<p>No. Many possessory title properties have been registered for decades with no adverse claim and are insurable at modest cost. The risk is real but manageable in the right circumstances. The key is doing the due diligence to understand which type of situation you are dealing with.</p>
<h3>Can I live in a possessory title house normally?</h3>
<p>Yes. Possessory title does not affect your right to occupy, use, or improve the property as the registered owner. The risk is theoretical — a third party asserting a superior claim — not practical in the day-to-day sense.</p>
<h3>What happens if someone challenges possessory title?</h3>
<p>If a third party claims a superior title, this would be resolved through HM Land Registry or the courts. If you have indemnity insurance, the insurer covers your legal costs and any resulting loss. Without insurance, you bear those costs yourself.</p>

${CTA_BLOCK('Read the legal pack before you decide', 'LegalPack AI analyses possessory title, explains the circumstances, and flags the risks — in minutes. First analysis free.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide<span>Everything you need to know before bidding</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>What it covers and when it is refused</span></a>
    <a href="/possessory-title-mortgage-lenders.html" class="related-link">Possessory title mortgage lenders<span>Which lenders accept possessory title</span></a>
    <a href="/does-possessory-title-affect-value.html" class="related-link">Does possessory title affect value?<span>Typical discounts and valuation treatment</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 8 — upgrade-possessory-title
// ─────────────────────────────────────────────────────────────
write({
  file: 'upgrade-possessory-title.html',
  slug: 'upgrade-possessory-title',
  title: 'How to Upgrade Possessory Title to Absolute Title | LegalPack AI',
  desc: 'Upgrading possessory title to absolute title requires a Land Registry application under Rule 124. Learn the eligibility criteria, the process, the costs, and how long it takes.',
  tag: { color: '#6d28d9', bg: '#f5f0ff', border: '#ddd6fe' },
  tagText: '📋 Title Upgrade',
  breadcrumb: 'Guides › Upgrade Possessory Title',
  h1: 'How to upgrade possessory title to <em>absolute title</em>',
  intro: 'Possessory title can be upgraded to absolute title through a formal application to HM Land Registry. It is not automatic — you must meet specific eligibility criteria, provide evidence of possession, and satisfy the Registrar that there is no adverse claim. Done correctly, it restores full market value to the property.',
  readtime: '6 min read',
  body: `
<h2>Why upgrade possessory title?</h2>
<p>Absolute title carries the State Guarantee — HM Land Registry guarantees the registered owner has a good title. Possessory title does not. The practical consequences of remaining on possessory title include: restricted mortgage lending, value discount of 5–20%, greater difficulty selling, and ongoing uncertainty about third-party claims. Upgrading removes all of these problems.</p>

<h2>The legal basis for upgrading</h2>
<p>The power to upgrade possessory title to absolute title is set out in <strong>Section 62 of the Land Registration Act 2002</strong> and <strong>Rule 124 of the Land Registration Rules 2003</strong>. The Land Registrar has discretion to upgrade where satisfied that the registered proprietor is entitled to be registered with absolute title.</p>
<p>In practice, the Registrar will upgrade where:</p>
<ul>
  <li>The registered proprietor has been in possession under the possessory title for at least <strong>12 years</strong></li>
  <li>There is no known adverse claim to the land</li>
  <li>The circumstances of the original registration are sufficiently explained and benign</li>
</ul>

<h2>Step-by-step: how to apply</h2>
<ol>
  <li><strong>Confirm eligibility</strong> — check that at least 12 years have passed since the possessory title was first registered. The date is in the title register history.</li>
  <li><strong>Instruct a property solicitor</strong> — the application requires a statutory declaration and supporting evidence. This is specialist work that needs a solicitor experienced in Land Registry applications.</li>
  <li><strong>Prepare a statutory declaration</strong> — a sworn statement confirming: continuous possession of the property since registration, no adverse claim has been made or threatened, and the circumstances of the original possessory registration.</li>
  <li><strong>Gather supporting evidence</strong> — utility bills, council tax records, correspondence addressed to the property, planning applications, insurance schedules — anything that corroborates continuous possession over the 12+ year period.</li>
  <li><strong>Submit Form AP1 to HM Land Registry</strong> — with the statutory declaration, evidence bundle, and Land Registry fee.</li>
  <li><strong>Land Registry considers the application</strong> — they may raise requisitions (questions) and may serve notice on any parties who might have an interest.</li>
  <li><strong>Title upgraded</strong> — if satisfied, the Registrar updates the register to show absolute title. The possessory entry is removed.</li>
</ol>

<h2>How much does upgrading possessory title cost?</h2>
<table class="data-table">
<thead><tr><th>Cost element</th><th>Typical range</th></tr></thead>
<tbody>
<tr><td>Solicitor's fees (preparation of statutory declaration, evidence bundle, application)</td><td>£1,200–£2,500</td></tr>
<tr><td>HM Land Registry fee (based on property value)</td><td>£40–£910</td></tr>
<tr><td>Disbursements (searches, office copies)</td><td>£50–£150</td></tr>
<tr><td><strong>Total typical cost</strong></td><td><strong>£1,500–£3,500</strong></td></tr>
</tbody>
</table>

<h2>How long does the upgrade take?</h2>
<p>HM Land Registry's current processing times for complex applications are <strong>3–9 months</strong>. Straightforward applications with clear evidence may complete at the lower end. If the Registrar raises requisitions or needs to notify third parties, the process takes longer. There is no guaranteed timeline.</p>

<div class="callout warn">
  <div class="callout-title">⚠ The Registrar can refuse</div>
  <p>The upgrade is not automatic. If the Registrar is not satisfied that there is no adverse claim, or if the circumstances of the original registration remain unclear, they can decline to upgrade. In that case, you remain on possessory title and have spent legal fees without achieving the upgrade. Expert solicitor advice before applying is essential.</p>
</div>

<h2>What if the upgrade is refused?</h2>
<p>If refused, options include: providing additional evidence and reapplying; continuing to hold on possessory title with indemnity insurance; or, in some cases, making an adverse possession application under Schedule 6 of the Land Registration Act 2002 if the circumstances support it. A specialist property litigation solicitor can advise on the best route.</p>

${CTA_BOX('possessory title and title upgrade requirements in your legal pack')}

<h2>Frequently asked questions</h2>
<h3>Can I upgrade possessory title myself without a solicitor?</h3>
<p>Technically you can submit the application directly to HM Land Registry, but in practice it is very difficult to do correctly without legal expertise. The statutory declaration must be properly drafted, the evidence bundle must address the Registrar's requirements, and errors can result in rejection. Solicitor involvement is strongly advised.</p>
<h3>Does upgrading possessory title cost a lot?</h3>
<p>Expect £1,500–£3,500 all-in. This should be weighed against the value uplift from having absolute title — for a property worth £200,000, removing a 10% possessory discount is worth £20,000. The maths typically favours upgrading.</p>
<h3>What happens to my indemnity insurance after the upgrade?</h3>
<p>It is no longer needed for the possessory title risk — absolute title carries the State Guarantee. However, many owners keep the policy in place as it may cover other historical issues. Confirm with your insurer and solicitor.</p>

${CTA_BLOCK('Buying a possessory title property at auction?', 'LegalPack AI reads the title register and flags the upgrade path, insurance requirements, and mortgage risk — in minutes. First analysis free.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide<span>What it is, why it appears, and the risks</span></a>
    <a href="/possessory-title-land-registry.html" class="related-link">Possessory title and the Land Registry<span>How the title register records and grades title</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>Protect the title while awaiting upgrade</span></a>
    <a href="/title-defects-property.html" class="related-link">Title defects at auction<span>All the title issues found in legal packs</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 9 — possessory-title-mortgage
// ─────────────────────────────────────────────────────────────
write({
  file: 'possessory-title-mortgage.html',
  slug: 'possessory-title-mortgage',
  title: 'Getting a Mortgage on Possessory Title Property | LegalPack AI',
  desc: 'Mortgaging a possessory title property is difficult but not impossible. Learn which lenders consider it, what conditions apply, and your options if a standard mortgage is refused.',
  tag: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  tagText: '🏦 Mortgage Guide',
  breadcrumb: 'Guides › Possessory Title Mortgage',
  h1: 'Getting a <em>mortgage</em> on a possessory title property',
  intro: 'Most standard mortgage lenders will not lend on possessory title — their criteria require absolute or good leasehold title. But with the right lender, the right insurance, and correct preparation, mortgage finance is sometimes possible. Here is what you need to know before bidding.',
  readtime: '5 min read',
  body: `
<h2>Why possessory title causes mortgage problems</h2>
<p>When you apply for a mortgage, the lender instructs their own solicitor to carry out a title investigation alongside your purchase. When that solicitor discovers possessory title in the A Register, they must report it to the lender. Most lenders' criteria state they will only lend on absolute freehold or good leasehold title — possessory title fails this test and the mortgage is declined at the legal stage, often after weeks of processing.</p>
<p>This is not the lender being unreasonable. Possessory title means the State does not guarantee the owner's right to the property. The lender's security — the charge registered against the property — is only as good as the underlying title. If a third party successfully asserts a superior claim, the property and the lender's security could be worthless.</p>

<h2>Your mortgage options for possessory title</h2>

<h3>Option 1: Standard residential mortgage (most likely to be declined)</h3>
<p>Some building societies and specialist banks will consider possessory title on a case-by-case basis if a legal indemnity policy is in place noting the lender as an additional insured. This is lender-specific and you must obtain written confirmation before bidding. Do not assume a Decision in Principle covers possessory title — DIP checks do not include title investigation.</p>

<h3>Option 2: Bridging finance (most practical for auction)</h3>
<p>Bridging lenders take a more commercial view on title quality. Many will lend on possessory title with indemnity insurance, particularly for experienced borrowers with a clear exit strategy. Bridging rates are higher (0.75–1.5% per month plus arrangement fees of 1–2%) but the speed of completion — days rather than weeks — makes bridging the go-to solution for auction purchases generally, and particularly for possessory title.</p>

<h3>Option 3: Cash purchase</h3>
<p>No lender constraints at all. The full risk sits with you, which is why cash buyers on possessory title properties demand significant discounts. If you are buying for investment and can absorb the risk, cash is the simplest route.</p>

<h3>Option 4: Upgrade title, then mortgage</h3>
<p>Buy with cash or bridging, apply to upgrade from possessory to absolute title (requires 12 years' registration and no adverse claim), and then remortgage once absolute title is granted. The timeline is long (potentially years) but removes all mortgage limitations.</p>

<div class="callout warn">
  <div class="callout-title">⚠ Auction deadlines make this harder</div>
  <p>At traditional auction, completion is required within 28 days. Standard mortgages take 4–12 weeks. Even lenders willing to consider possessory title cannot complete that fast. Bridging finance or cash are the only realistic options for traditional auction timescales. Modern Method of Auction (56 days) may allow standard mortgage — but confirm with your lender before bidding.</p>
</div>

<h2>What to prepare before speaking to lenders</h2>
<ul>
  <li>Official copies of the title register showing the class and date of possessory title</li>
  <li>Any statutory declaration or explanation of why the title is possessory</li>
  <li>A legal indemnity insurance quotation (or confirmation of an existing policy)</li>
  <li>Your solicitor's preliminary assessment of the title risk</li>
</ul>
<p>Armed with this information, a specialist mortgage broker can approach lenders who are known to consider possessory title and present the case properly.</p>

${CTA_BOX('possessory title, mortgage risk, and insurance requirements')}

<h2>Frequently asked questions</h2>
<h3>Will any mortgage lender accept possessory title?</h3>
<p>Some specialist lenders and certain building societies will consider it on a case-by-case basis, typically requiring indemnity insurance and satisfied that the circumstances are benign. A whole-of-market mortgage broker is the best route to finding them.</p>
<h3>Does indemnity insurance guarantee I can get a mortgage?</h3>
<p>No. Insurance reduces the lender's risk but does not override their lending criteria. Some lenders simply will not lend on possessory title regardless of insurance. Others will accept it. The answer depends entirely on the specific lender.</p>
<h3>Can I remortgage after upgrading to absolute title?</h3>
<p>Yes. Once HM Land Registry upgrades the title to absolute, the property is mortgageable on standard terms with the full range of lenders. This is the clean solution — but requires patience, as the upgrade process can take 3–9 months after eligibility is established.</p>

${CTA_BLOCK('Check the title before you arrange finance', 'LegalPack AI flags possessory title, explains the circumstances, and identifies mortgage risk — in minutes. First analysis free for new users.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title-mortgage-lenders.html" class="related-link">Possessory title mortgage lenders<span>Which lenders accept possessory title and the conditions they impose</span></a>
    <a href="/bridging-finance-auction-property.html" class="related-link">Bridging finance for auction property<span>How bridging works, costs, and when to use it</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>The insurance lenders and buyers need</span></a>
    <a href="/what-makes-auction-property-unmortgageable.html" class="related-link">What makes auction property unmortgageable?<span>All the title and structural issues lenders decline</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 10 — commercial-property-auction-legal-pack
// ─────────────────────────────────────────────────────────────
write({
  file: 'commercial-property-auction-legal-pack.html',
  slug: 'commercial-property-auction-legal-pack',
  title: 'Commercial Property Auction Legal Pack: What to Check | LegalPack AI',
  desc: 'Commercial property auction legal packs contain more documents and higher-value risks than residential packs. Learn what to look for in leases, VAT elections, planning, and title before bidding.',
  tag: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  tagText: '🏢 Commercial',
  breadcrumb: 'Guides › Commercial Property Auction Legal Pack',
  h1: 'Commercial property auction legal pack: <em>what to check</em>',
  intro: 'Commercial auction legal packs are significantly more complex than residential ones. A tenant lease, VAT election, planning history, environmental liability, and business rates can all materially affect the investment case — and all of them are buried in the legal pack.',
  readtime: '7 min read',
  body: `
<h2>How commercial legal packs differ from residential</h2>
<p>A residential legal pack typically contains: title register, title plan, searches, special conditions of sale, and (if leasehold) a lease and management information. A commercial legal pack often contains all of that plus:</p>
<ul>
  <li><strong>Leases</strong> — full commercial leases, licences to occupy, side letters, rent review memoranda</li>
  <li><strong>VAT election</strong> — whether the seller has opted to tax the property for VAT, making the purchase subject to 20% VAT on top of the hammer price</li>
  <li><strong>Asbestos reports</strong> — commercial property built pre-2000 may contain asbestos; management surveys are often included</li>
  <li><strong>Energy Performance Certificate (EPC)</strong> — commercial properties with an EPC below E cannot legally be let (MEES regulations)</li>
  <li><strong>Planning permissions and conditions</strong> — change of use history, outstanding planning obligations</li>
  <li><strong>Environmental reports</strong> — Phase 1 desktop study, sometimes Phase 2 intrusive surveys for industrial sites</li>
  <li><strong>Business rates information</strong> — rateable value, any reliefs, empty property rates implications</li>
</ul>

<div class="callout danger">
  <div class="callout-title">🔴 The VAT trap</div>
  <p>If the seller has opted to tax the property, the purchase price is subject to 20% VAT. On a £300,000 commercial property, that is an additional £60,000. This will not appear in the guide price or auction catalogue — it is buried in the special conditions. If you cannot recover VAT (because your business is not VAT-registered or the use is exempt), this is a real additional cost. Always check for the option to tax before bidding.</p>
  </div>

<h2>Key things to check in a commercial legal pack</h2>

<h3>Tenancy details</h3>
<p>If the property is tenanted, the lease is the most important document. Check:</p>
<ul>
  <li>Lease term and expiry date — how much income is contracted?</li>
  <li>Break clauses — can the tenant exit early, and when?</li>
  <li>Rent review provisions — upward only? Open market or indexed?</li>
  <li>Repairing obligations — full repairing and insuring (FRI) lease means tenant maintains the building; internal repairing only (IRI) means landlord bears external costs</li>
  <li>Permitted use — if the tenant's use is restricted and they vacate, can you let to another tenant without a change of use application?</li>
  <li>Rent arrears — is the current tenant in arrears? Check the management pack for payment history</li>
</ul>

<h3>Planning and permitted use</h3>
<p>Check the existing planning permission use class. A property marketed as a café (Use Class E) may have planning conditions restricting hours or uses that limit its value. A former industrial unit being sold for residential conversion may not yet have planning permission for that use — meaning the conversion value is speculative, not secured.</p>

<h3>Environmental liability</h3>
<p>Commercial and industrial sites can carry contamination liability that transfers to the buyer. Phase 1 reports identify potential pathways for contamination; Phase 2 reports (invasive surveys) confirm whether contamination is present. Remediation of a contaminated site can cost tens of thousands to millions of pounds.</p>

<h3>MEES and EPC rating</h3>
<p>Since April 2023, it is unlawful to grant a new commercial lease for a property with an EPC rating below E. Properties rated F or G cannot be legally let until they are improved. If you are buying a commercial property for rental income, an EPC below E means you cannot let it without spending on energy improvements first — factor this into your bid.</p>

${CTA_BOX('VAT elections, lease risks, and planning issues in your commercial legal pack')}

<h2>The auction timing problem for commercial property</h2>
<p>Commercial property due diligence typically takes 4–8 weeks. Auction legal packs are often published just 2–4 weeks before the sale. This creates genuine time pressure. The key documents to prioritise when time is short are: the special conditions (for VAT, buyer costs, and unusual obligations), the tenancy schedule and any existing lease, and the title register.</p>

<div class="ai-flag">
  <div class="ai-flag-label">⚠ LegalPack AI — Sample Commercial Flag</div>
  Option to Tax — Special Conditions, Schedule 1: The seller has opted to tax this property for VAT purposes. The purchase price of £275,000 is therefore subject to VAT at the standard rate (currently 20%), giving a total consideration of £330,000. Buyer should confirm VAT recovery position before bidding.
</div>

<h2>Frequently asked questions</h2>
<h3>Do I need a commercial solicitor to review a commercial auction legal pack?</h3>
<p>Yes — commercial property law is a specialist area. A residential conveyancer is not qualified to advise on commercial leases, option to tax, MEES compliance, or environmental liability. Instruct a commercial property solicitor before bidding.</p>
<h3>How do I check if a commercial property has the option to tax?</h3>
<p>The seller's solicitor should confirm it in the special conditions of sale. You can also check with HMRC (if you know the seller's VAT number) or ask your own solicitor to raise a pre-auction enquiry. LegalPack AI flags option to tax clauses in special conditions automatically.</p>
<h3>What is TOGC and how does it affect commercial auction purchases?</h3>
<p>A Transfer of Going Concern (TOGC) is a VAT relief that can disapply the 20% VAT charge if the commercial property is transferred as a going concern — broadly, the buyer continues the same business. This requires meeting specific HMRC conditions and is complex. Take specialist VAT advice before relying on TOGC.</p>

${CTA_BLOCK('Check your commercial legal pack before bidding', 'LegalPack AI flags VAT elections, lease risks, MEES issues, and environmental warnings — in minutes. First analysis free.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/auction-legal-pack-checklist.html" class="related-link">Auction legal pack checklist<span>Every document and clause to check before bidding</span></a>
    <a href="/hidden-costs-auction-legal-pack.html" class="related-link">Hidden costs in auction legal packs<span>Fees most buyers miss — including VAT</span></a>
    <a href="/auction-special-conditions.html" class="related-link">Special conditions of sale at auction<span>The clauses that override standard terms</span></a>
    <a href="/how-to-read-auction-legal-pack.html" class="related-link">How to read an auction legal pack<span>Step-by-step guide to every document</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 11 — leasehold-advisory-service
// ─────────────────────────────────────────────────────────────
write({
  file: 'leasehold-advisory-service.html',
  slug: 'leasehold-advisory-service',
  title: 'Leasehold Advisory Service for Auction Buyers | LegalPack AI',
  desc: 'Leasehold properties at auction carry unique risks — short leases, ground rent traps, service charge arrears, and onerous covenants. Get plain-English advice on your leasehold legal pack before you bid.',
  tag: { color: '#6d28d9', bg: '#f5f0ff', border: '#ddd6fe' },
  tagText: '🏠 Leasehold',
  breadcrumb: 'Guides › Leasehold Advisory Service',
  h1: 'Leasehold properties at auction: <em>what you need to know</em>',
  intro: 'Leasehold properties make up a large proportion of auction lots — particularly flats and former local authority properties. They carry risks that freehold properties do not: lease length, ground rent escalation, service charges, and management company issues. All of these are in the legal pack if you know where to look.',
  readtime: '7 min read',
  body: `
<h2>Why leasehold auction properties need extra scrutiny</h2>
<p>When you buy a leasehold property, you are not buying the land — you are buying the right to occupy it for a fixed period defined in the lease. When that period ends, the property reverts to the freeholder. A lease with 200 years remaining is close to freehold in practical terms; a lease with 60 years remaining is a depreciating asset that most lenders will not mortgage and most buyers will not touch at full price.</p>
<p>Auction is where leasehold problems are concentrated. Properties with short leases, ground rent traps, service charge disputes, or difficult management companies are difficult to sell on the open market — so they end up at auction, often at attractive guide prices that do not fully reflect the cost of resolving the underlying issues.</p>

<h2>The five leasehold risks to check in every legal pack</h2>

<h3>1. Lease length (remaining term)</h3>
<p>The critical thresholds are:</p>
<ul>
  <li><strong>80 years or less</strong> — lease extension becomes significantly more expensive. The freeholder can claim "marriage value" (a share of the uplift in value from the extension), which can add tens of thousands of pounds to the cost.</li>
  <li><strong>70 years or less</strong> — most mainstream mortgage lenders decline. The sellable buyer pool shrinks dramatically.</li>
  <li><strong>Below 60 years</strong> — considered very short. Extension is expensive, some lenders will not touch it regardless of extension, and buyers will discount heavily.</li>
</ul>
<p>Always check the original lease term and the date of the lease — calculate the remaining term to the year before bidding.</p>

<h3>2. Ground rent</h3>
<p>Ground rent is an annual payment to the freeholder. Historic ground rents were typically £50–£250 per year — negligible. Modern leases (particularly 2000–2019) introduced escalating ground rents that double every 10–25 years, creating significant future liabilities and rendering properties unmortgageable once ground rent exceeds 0.1% of the property value.</p>
<p>The Leasehold Reform (Ground Rent) Act 2022 banned onerous ground rents for new leases from June 2022, but pre-existing leases are not automatically affected. Check the lease for ground rent review clauses carefully.</p>

<h3>3. Service charges</h3>
<p>Service charges pay for the maintenance and management of the building. Check:</p>
<ul>
  <li>Current annual service charge — is it reasonable for the size and type of building?</li>
  <li>Service charge accounts — are there significant arrears owed by other leaseholders?</li>
  <li>Reserve fund balance — is money set aside for major works, or will there be a large special levy soon?</li>
  <li>Planned major works — check for any Section 20 notices (the consultation process for major works costing individual leaseholders over £250)</li>
</ul>

<h3>4. Service charge arrears transferring on purchase</h3>
<p>This is one of the most overlooked risks in leasehold auction packs. Under the Landlord and Tenant Act 1985 and the lease terms, service charge arrears owed by the previous owner may transfer to the buyer in some circumstances. Always request a management pack confirming the current balance owed.</p>

<h3>5. Forfeiture risk</h3>
<p>A lease can be forfeited (terminated) by the freeholder if the leaseholder materially breaches its terms — most commonly by non-payment of ground rent or service charge. Forfeiture is rarely exercised but the threat is real for properties with disputed arrears. Check whether there are any outstanding demands or breach notices in the legal pack.</p>

<div class="callout danger">
  <div class="callout-title">🔴 Short lease + service charge arrears = double risk</div>
  <p>The worst combination at auction is a short lease with outstanding service charge arrears. The lease extension cost will be inflated by the short lease premium; the arrears may transfer to you on purchase; and the restricted buyer pool means you will struggle to sell until both issues are resolved. Price both costs into your bid.</p>
</div>

${CTA_BOX('lease length, ground rent, and service charge risks in your legal pack')}

<h2>Leasehold reform: what buyers should know in 2026</h2>
<p>The Leasehold and Freehold Reform Act 2024 made significant changes to leasehold law in England and Wales, including: extending the standard lease extension term to 990 years for both houses and flats, abolishing marriage value for lease extensions (reducing extension costs significantly for sub-80 year leases), and reforms to service charge transparency. Some provisions are not yet in force — take up-to-date legal advice on the current position.</p>

<h2>Frequently asked questions</h2>
<h3>How do I check the remaining lease term in an auction legal pack?</h3>
<p>The official title register (included in the legal pack) states the lease term and the date it was granted. Calculate remaining term as: original term minus years elapsed since lease start date. LegalPack AI calculates this automatically and flags leases below key thresholds.</p>
<h3>Can I extend a lease on a property bought at auction?</h3>
<p>Yes, if you qualify. You must own the property for two years before you have the statutory right to extend under the Leasehold Reform, Housing and Urban Development Act 1993 (as amended). During those two years you cannot compel the freeholder to grant an extension — though you can negotiate informally.</p>
<h3>What is a management pack and do I need one?</h3>
<p>A management pack is a document produced by the managing agent or freeholder confirming: the current service charge balance, ground rent position, any arrears, upcoming major works, and building insurance details. It is essential for any leasehold auction purchase. Check whether one is included in the legal pack — if not, request it before bidding.</p>

${CTA_BLOCK('Check your leasehold legal pack before bidding', 'LegalPack AI reads every page — lease term, ground rent clauses, service charge accounts — and flags the risks in plain English. First analysis free for new users.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/short-lease-auction.html" class="related-link">Short lease properties at auction<span>The risks of buying a flat with under 80 years remaining</span></a>
    <a href="/service-charge-arrears.html" class="related-link">Service charge arrears at auction<span>When the previous owner's debts become yours</span></a>
    <a href="/leasehold-auction-property-risks.html" class="related-link">Leasehold auction property risks<span>The complete guide to leasehold at auction</span></a>
    <a href="/hidden-costs-auction-legal-pack.html" class="related-link">Hidden costs in auction legal packs<span>Ground rent, service charges, and event fees</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 12 — no-fee-auction-search-packs
// ─────────────────────────────────────────────────────────────
write({
  file: 'no-fee-auction-search-packs.html',
  slug: 'no-fee-auction-search-packs',
  title: 'No Fee Auction Search Packs Explained | LegalPack AI',
  desc: 'Some auction houses offer no-fee or free search packs. Learn what searches are included, what is missing, why "no fee" does not mean no risk, and what you still need to check before bidding.',
  tag: { color: '#15803d', bg: '#f0fdf4', border: '#dcfce7' },
  tagText: '🔍 Searches Guide',
  breadcrumb: 'Guides › No Fee Auction Search Packs',
  h1: 'No fee auction search packs: <em>what is actually included?</em>',
  intro: '"No sale no fee" and "free searches" are increasingly common marketing claims from auction houses and search providers. Before you rely on them, you need to understand what searches are included, what is not, and why free searches do not remove the need for independent due diligence on the legal pack.',
  readtime: '5 min read',
  body: `
<h2>What are auction property searches?</h2>
<p>Property searches are enquiries made to official bodies and databases that reveal information about a property that is not apparent from the title register. The three standard searches in a residential sale are:</p>
<ul>
  <li><strong>Local Authority Search (LLC1 and CON29)</strong> — planning history, planning obligations, road adoption status, tree preservation orders, conservation area status, and other local land charges</li>
  <li><strong>Drainage Search (CON29DW)</strong> — whether the property is connected to public sewers and water mains, and whether any public sewer runs within the property boundary</li>
  <li><strong>Environmental Search</strong> — flood risk, ground stability, contaminated land, radon, energy infrastructure in proximity</li>
</ul>
<p>Additional searches may be required depending on the property location: chancel repair search, coal mining search, tin mining (Cornwall), brine subsidence (Cheshire), or flood risk detail search.</p>

<h2>What "no fee" or "free search" packs typically include</h2>
<p>When an auction house advertises a "no sale no fee" search pack or "free searches included", they typically mean one of the following:</p>
<ul>
  <li><strong>Search indemnity insurance only</strong> — no actual searches have been carried out. Instead, an insurance policy is provided that covers the buyer if a search would have revealed something adverse. This is not the same as having up-to-date searches.</li>
  <li><strong>Personal (desktop) searches only</strong> — the LLC1 and CON29 results are obtained from a third-party database rather than directly from the local authority. These are faster and cheaper but are not official local authority searches and some lenders will not accept them.</li>
  <li><strong>A subset of the standard searches</strong> — for example, a local authority search but no drainage or environmental search.</li>
</ul>

<div class="callout warn">
  <div class="callout-title">⚠ Search indemnity is not the same as searches</div>
  <p>Search indemnity insurance covers you if a search <em>would have</em> revealed something adverse. It does not tell you what the searches would have revealed. You are bidding blind on the local authority, drainage, and environmental position — and relying on an insurer to compensate you if something turns out to be wrong. For most buyers and all mortgage lenders, actual searches are required.</p>
</div>

<h2>What Landmark and other providers offer</h2>
<p>Landmark Information Group is one of the UK's major property search and data providers. Their "no sale no fee" search products are commonly offered in auction packs. These typically provide a Landmark Environmental and flood search, sometimes combined with a CON29DW drainage search, obtained from their database. They do not include the local authority (LLC1/CON29) search, which must be obtained separately or replaced by indemnity insurance.</p>
<p>Always read the covering letter in the search pack carefully — it will state exactly what has been obtained and what, if anything, has been replaced by insurance.</p>

<h2>What you still need to check even with searches included</h2>
<p>Even a full set of up-to-date searches does not cover everything a buyer needs to know before bidding at auction. Searches reveal what official records say — they do not reveal what is in the legal pack itself:</p>
<ul>
  <li>Special conditions adding buyer costs or shortening the completion period</li>
  <li>Title defects, restrictive covenants, or possessory title</li>
  <li>Existing tenancies and lease terms</li>
  <li>Structural issues referenced in the pack documents</li>
  <li>Missing documents referenced but not provided</li>
</ul>

${CTA_BOX('special conditions, title issues, and hidden costs in your legal pack')}

<h2>Should I commission my own searches?</h2>
<p>For most buyers, yes — particularly if the pack contains only search indemnity rather than actual searches. Official local authority searches, drainage searches, and environmental searches each cost £30–£150 and can be obtained in 1–10 working days depending on the local authority. The cost is small relative to the purchase price and the potential consequences of missing a planning issue or contamination problem.</p>
<p>If your mortgage lender requires specific searches (most lenders specify requirements in the UK Finance Mortgage Lenders' Handbook), commission them before bidding regardless of what the auction pack contains.</p>

<h2>Frequently asked questions</h2>
<h3>Are search indemnity policies accepted by mortgage lenders?</h3>
<p>Some lenders accept search indemnity for residential purchases in certain circumstances; others require official searches. Check the UK Finance Mortgage Lenders' Handbook for your specific lender's requirements before relying on search indemnity.</p>
<h3>How long do auction property searches take?</h3>
<p>Official local authority searches vary significantly by council — from same-day to 10+ working days. Environmental and drainage searches are typically 24–48 hours. Order early and factor turnaround time into your pre-auction timeline.</p>
<h3>What happens if a search reveals a problem after I've bought at auction?</h3>
<p>If the problem was covered by search indemnity, you can make an insurance claim. If you had actual searches and did not read them carefully before bidding, you are unlikely to have any recourse — at auction, contracts exchange on the hammer falling regardless of subsequent discoveries.</p>

${CTA_BLOCK('Read the full legal pack, not just the searches', 'LegalPack AI analyses every document in your pack — title, special conditions, leases, and searches — and flags the risks in plain English. First analysis free for new users.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/auction-legal-pack-checklist.html" class="related-link">Auction legal pack checklist<span>Every document and clause to check before bidding</span></a>
    <a href="/hidden-costs-auction-legal-pack.html" class="related-link">Hidden costs in auction legal packs<span>Fees buried in special conditions most buyers miss</span></a>
    <a href="/how-to-read-auction-legal-pack.html" class="related-link">How to read an auction legal pack<span>Step-by-step guide to every document</span></a>
    <a href="/auction-legal-pack-review.html" class="related-link">Auction legal pack review<span>Why a full review matters and how to get one fast</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 13 — plain-english-legal-pack-summary
// ─────────────────────────────────────────────────────────────
write({
  file: 'plain-english-legal-pack-summary.html',
  slug: 'plain-english-legal-pack-summary',
  title: 'Plain English Legal Pack Summary for Auction Buyers | LegalPack AI',
  desc: 'Legal packs are written in dense legal language most buyers cannot parse. LegalPack AI translates every document into a plain English risk summary — so you know exactly what you are buying before you bid.',
  tag: { color: '#6d28d9', bg: '#f5f0ff', border: '#ddd6fe' },
  tagText: '📄 Plain English',
  breadcrumb: 'Guides › Plain English Legal Pack Summary',
  h1: 'Getting a plain English <em>legal pack summary</em>',
  intro: 'Auction legal packs are written by and for lawyers. Title registers reference obscure charges, special conditions invoke standard forms with dozens of amendments, and leases contain clauses that would take a non-lawyer hours to decipher. Most buyers bid without reading them. That is a significant financial risk.',
  readtime: '5 min read',
  body: `
<h2>Why legal packs are hard to read</h2>
<p>A typical auction legal pack contains 50–200 pages of legal documents. These include the title register (with Land Registry jargon and references to filed documents), property searches (with technical abbreviations and scoring systems), and special conditions of sale (which modify standard auction terms in ways that are material to the purchase price and completion obligations).</p>
<p>For a buyer without a legal background, reading a legal pack is genuinely difficult. The language is dense, the references are cross-document, and the consequences of missing a clause — an extra buyer fee, a short completion date, a title restriction — are binding on exchange, which happens on the fall of the hammer.</p>

<h2>What a plain English summary should cover</h2>
<p>A good plain English summary of an auction legal pack translates the key findings from every document category:</p>
<ul>
  <li><strong>Title overview</strong> — freehold or leasehold, class of title, any charges or restrictions on the register</li>
  <li><strong>Lease summary</strong> (if leasehold) — remaining term, ground rent amount and review mechanism, service charge estimate, management company details</li>
  <li><strong>Search findings</strong> — any planning issues, flood risk flags, drainage connection status, contamination risk</li>
  <li><strong>Special conditions summary</strong> — any additions to standard auction terms: buyer's legal cost obligations, extended deposits, non-standard completion dates, seller's exclusions</li>
  <li><strong>Hidden costs</strong> — buyer's premium, VAT implications, outstanding service charges, indemnity insurance requirements</li>
  <li><strong>Missing documents</strong> — what has been referenced but not provided in the pack</li>
  <li><strong>Risk rating</strong> — a clear overall assessment: proceed with confidence, proceed with caution, or serious issues to resolve before bidding</li>
</ul>

<h2>How LegalPack AI produces a plain English summary</h2>
<p>LegalPack AI reads every page of your uploaded legal pack — PDFs, ZIPs, multi-file uploads — and produces a structured report with plain English explanations for each finding. Issues are flagged at three severity levels:</p>
<ul>
  <li><strong>Critical</strong> — issues that could make the property unmortgageable, significantly increase your costs, or expose you to legal liability. These require specialist advice before bidding.</li>
  <li><strong>Warning</strong> — issues worth understanding and factoring into your bid, but not necessarily deal-breakers. Onerous repair obligations, planning conditions, or non-standard completion dates.</li>
  <li><strong>Note</strong> — information to be aware of but not immediately concerning. Historic planning permissions, standard search results, routine conditions.</li>
</ul>
<p>Each flag includes: the specific document and clause it was found in (e.g. "Special Conditions, Clause 4"), a plain English explanation of what it means, and where relevant, the financial or legal implication for you as buyer.</p>

<div class="ai-flag">
  <div class="ai-flag-label">⚠ LegalPack AI — Sample Plain English Flag</div>
  <strong>CRITICAL — Possessory Freehold Title</strong><br>
  Found in: Title Register, A Register (Proprietorship Register)<br>
  What this means: The Land Registry has registered this property with possessory title — the lowest grade. The owner cannot prove their right to the property from documentary evidence. The State does not guarantee this title.<br>
  What it means for you: Most mortgage lenders will decline. You will need cash or specialist finance. Indemnity insurance may be available (cost: ~£400–£800) — confirm before bidding. Seek specialist solicitor advice.
</div>

${CTA_BOX('a plain English summary of your auction legal pack')}

<h2>Can I get a plain English legal pack summary before the auction?</h2>
<p>Yes. LegalPack AI is available 24/7 — including the night before your auction. Upload your pack at any time and receive your plain English risk summary in 3–5 minutes. The report can be shared with a solicitor, a co-investor, or a bridging lender who needs to understand the title position quickly.</p>

<h2>Frequently asked questions</h2>
<h3>Is a plain English summary the same as legal advice?</h3>
<p>No. A plain English summary translates and explains the legal pack — it does not constitute legal advice and does not carry professional indemnity. For a transaction of this size, you should use the summary to identify issues and then take targeted legal advice from a qualified solicitor on any Critical or Warning flags before bidding.</p>
<h3>How long is a LegalPack AI report?</h3>
<p>Reports vary by pack complexity. A straightforward freehold residential pack might generate a 3–5 page report. A complex leasehold pack with special conditions, service charge disputes, and title issues might run to 8–12 pages. All reports are structured in a consistent format so key risks are immediately visible.</p>
<h3>Can I share the report with my solicitor?</h3>
<p>Yes — the report is exportable and can be shared in full with your solicitor, who can use it to focus their review on the flagged issues rather than starting from scratch. Many buyers find this approach faster and cheaper than a full solicitor review from first principles.</p>

${CTA_BLOCK('Get a plain English summary of your legal pack', 'Upload your pack and receive a structured, plain English risk report in minutes. First analysis free for new users — no card required.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/how-to-read-auction-legal-pack.html" class="related-link">How to read an auction legal pack<span>Step-by-step guide to every document in the pack</span></a>
    <a href="/auction-legal-pack-checklist.html" class="related-link">Auction legal pack checklist<span>Everything to check before bidding</span></a>
    <a href="/auction-legal-pack-review-24-hours.html" class="related-link">Auction legal pack review in 24 hours<span>When your auction is tomorrow and time is short</span></a>
    <a href="/hidden-costs-auction-legal-pack.html" class="related-link">Hidden costs in auction legal packs<span>Fees buried in special conditions</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 14 — auction-conveyancing-fees
// ─────────────────────────────────────────────────────────────
write({
  file: 'auction-conveyancing-fees.html',
  slug: 'auction-conveyancing-fees',
  title: 'Auction Conveyancing Fees: What Buyers Actually Pay | LegalPack AI',
  desc: 'Auction conveyancing fees are higher and faster-moving than standard conveyancing. Learn what legal fees to budget, what the buyer pays versus the seller, and what is buried in the special conditions.',
  tag: { color: '#d97706', bg: '#fffbeb', border: '#fef3c7' },
  tagText: '💷 Costs Guide',
  breadcrumb: 'Guides › Auction Conveyancing Fees',
  h1: 'Auction conveyancing fees: <em>what buyers actually pay</em>',
  intro: 'Buying at auction involves more legal work — and more legal cost — than most buyers anticipate. The 28-day completion window, the unconditional exchange on the hammer falling, and the risk-heavy nature of auction titles all drive up conveyancing fees. And that is before you look at what the special conditions add on top.',
  readtime: '6 min read',
  body: `
<h2>Why auction conveyancing costs more than standard conveyancing</h2>
<p>Standard conveyancing (open market purchase) involves a lengthy exchange-to-completion period during which enquiries can be raised, defects negotiated, and problems resolved. At auction, contracts exchange the moment the hammer falls — completion follows in 28 days. This means:</p>
<ul>
  <li>All legal due diligence must be done <em>before</em> bidding, not after</li>
  <li>The solicitor must work faster — often reviewing a 100-page legal pack in 2–5 days</li>
  <li>Pre-auction enquiries (raised before the sale) must be answered within days, not weeks</li>
  <li>Post-exchange, completion must be ready in 28 days — fast by any conveyancing standard</li>
</ul>
<p>Each of these factors means more solicitor time, which means higher fees.</p>

<h2>Typical auction conveyancing fee breakdown</h2>
<table class="data-table">
<thead><tr><th>Fee element</th><th>Typical range</th><th>Who pays</th></tr></thead>
<tbody>
<tr><td>Pre-auction legal pack review</td><td>£300–£600</td><td>Buyer</td></tr>
<tr><td>Conveyancing (post-auction, completion)</td><td>£800–£1,800</td><td>Buyer</td></tr>
<tr><td>Property searches (if not in pack)</td><td>£200–£400</td><td>Buyer</td></tr>
<tr><td>Land Registry registration fee</td><td>£40–£910 (value-based)</td><td>Buyer</td></tr>
<tr><td>Bank transfer/CHAPS fee</td><td>£20–£50</td><td>Buyer</td></tr>
<tr><td>Seller's legal fees (if in special conditions)</td><td>£500–£2,500</td><td>Buyer (if in conditions)</td></tr>
<tr><td>SDLT/LTT (stamp duty)</td><td>Variable by value</td><td>Buyer</td></tr>
</tbody>
</table>

<div class="callout danger">
  <div class="callout-title">🔴 Seller's legal fees passed to the buyer</div>
  <p>One of the most common hidden costs in auction special conditions is a clause requiring the buyer to pay the seller's legal fees on completion. This can be £500–£2,500 and is legally enforceable once contracts exchange. It will not appear in the guide price, the catalogue, or the lot description — only in the special conditions of sale buried in the legal pack. LegalPack AI flags this clause automatically.</p>
</div>

<h2>Buyer's premium: the other conveyancing-adjacent cost</h2>
<p>Buyer's premium is charged by the auction house, not the solicitor — but it is often confused with conveyancing costs. It is an additional fee payable to the auction house on top of the hammer price, either as a flat fee (typically £1,500–£3,500) or a percentage (1–3% plus VAT). This is disclosed in the auction catalogue but is frequently underestimated by buyers who focus only on the hammer price.</p>

<h2>How to calculate your total acquisition cost</h2>
<p>Before bidding, calculate your total acquisition cost as:</p>
<ol>
  <li>Hammer price (your maximum bid)</li>
  <li>+ Buyer's premium (check auction house terms)</li>
  <li>+ Conveyancing fees (£1,500–£2,500 for a typical residential purchase)</li>
  <li>+ Searches (if not included: £200–£400)</li>
  <li>+ Seller's legal fees (if in special conditions)</li>
  <li>+ SDLT (use the SDLT calculator for your specific purchase)</li>
  <li>+ Any other costs in the special conditions (indemnity insurance, etc.)</li>
</ol>
<p>The total is your real cost of acquisition — and your maximum bid must leave room for all of these to still make the deal work financially.</p>

<h2>How to reduce auction conveyancing costs</h2>
<ul>
  <li><strong>Use LegalPack AI for the pre-auction review</strong> — at a fraction of the cost of a full solicitor review, you can identify the key issues and then take targeted solicitor advice only on what matters. This can reduce total legal costs significantly.</li>
  <li><strong>Instruct a solicitor experienced in auction work</strong> — they will have efficient processes for 28-day completions and will not waste time on issues that experienced auction solicitors treat as standard</li>
  <li><strong>Check special conditions before you need a solicitor</strong> — knowing what is in the conditions lets you give a focused brief to your solicitor rather than paying them to read everything from scratch</li>
</ul>

${CTA_BOX('seller fee clauses, buyer premium, and hidden costs in your legal pack')}

<h2>Frequently asked questions</h2>
<h3>Do I pay conveyancing fees even if I do not win the lot?</h3>
<p>If you instructed a solicitor to review the legal pack pre-auction, you will pay for that work regardless of whether you win. Some solicitors offer fixed-fee pre-auction reviews; others charge hourly. Clarify the fee structure before instructing.</p>
<h3>Can I use an online conveyancer for an auction purchase?</h3>
<p>In theory yes, but with caution. Auction conveyancing requires speed and experience with unconditional exchange. Many online conveyancers are not set up for 28-day completions and may not have experience reviewing auction-specific special conditions. A specialist auction conveyancer is generally preferable.</p>
<h3>Are auction conveyancing fees fixed or variable?</h3>
<p>Most solicitors charge a fixed fee for auction conveyancing, which is agreed in advance. The fixed fee covers the post-exchange work; the pre-auction review may be charged separately. Always agree the fee structure in writing before instructing.</p>

${CTA_BLOCK('Know every cost before you bid', 'LegalPack AI finds seller fee clauses, buyer premiums, and all hidden costs in your legal pack — in minutes. First analysis free for new users.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/hidden-costs-auction-legal-pack.html" class="related-link">Hidden costs in auction legal packs<span>All the fees buried in special conditions</span></a>
    <a href="/auction-legal-pack-cost.html" class="related-link">Auction legal pack review cost<span>What solicitors charge and how to save</span></a>
    <a href="/seller-fees-auction.html" class="related-link">Seller fees at auction passed to buyers<span>The clause most buyers miss</span></a>
    <a href="/sdlt-calculator.html" class="related-link">SDLT calculator<span>Calculate your stamp duty before bidding</span></a>
  </div>
</div>`
});

// ─────────────────────────────────────────────────────────────
// PAGE 15 — possessory-title-application
// ─────────────────────────────────────────────────────────────
write({
  file: 'possessory-title-application.html',
  slug: 'possessory-title-application',
  title: 'Possessory Title Application: Registering at Land Registry | LegalPack AI',
  desc: 'Learn how possessory title is applied for at HM Land Registry, what evidence is required, how long it takes, and what rights it gives the registered owner.',
  tag: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  tagText: '🔴 Title Risk',
  breadcrumb: 'Guides › Possessory Title Application',
  h1: 'Possessory title application: <em>how it is registered</em>',
  intro: 'Understanding how possessory title is applied for helps buyers assess the risk behind any specific registration. The reason for the application — lost deeds, adverse possession, or estate complications — determines the realistic chance of an adverse claim, insurance availability, and mortgage lender attitude.',
  readtime: '5 min read',
  body: `
<h2>When is a possessory title application made?</h2>
<p>A possessory title application to HM Land Registry is made when a person seeks to register land but cannot produce the documentary evidence normally required to prove their root of title. The Land Registration Act 2002 and the Land Registration Rules 2003 set out when possessory title can be granted.</p>
<p>The most common triggers for a possessory title application are:</p>
<ul>
  <li><strong>First registration with lost or destroyed deeds</strong> — the property was previously held on unregistered title and the original deeds cannot be located. The applicant can show they are in possession but cannot prove the chain of ownership through documentary evidence.</li>
  <li><strong>Adverse possession</strong> — a person has occupied land continuously for the requisite period (12 years under the pre-2002 law; a different process applies under the LRA 2002 for registered land) and applies to be registered based on that factual possession rather than paper title.</li>
  <li><strong>Defective conveyancing chain</strong> — a link in the historical chain of title is missing, defective, or cannot be verified, preventing absolute title from being granted.</li>
  <li><strong>Estate complications</strong> — a deceased person held property informally, never having completed a formal transfer, and the estate cannot reconstruct the chain of ownership sufficiently to support absolute title.</li>
</ul>

<h2>What evidence is required for a possessory title application</h2>
<p>The Land Registry will consider an application for possessory title where the applicant provides:</p>
<ul>
  <li>A <strong>statutory declaration</strong> explaining the circumstances — how the applicant came to be in possession, why they cannot produce the original title deeds, and confirming that there is no known adverse claim</li>
  <li>Evidence of <strong>continuous possession</strong> of the property (utility bills, council tax records, correspondence, planning applications)</li>
  <li>Any deeds or documents that <em>are</em> available, even if incomplete</li>
  <li>Evidence that the applicant has <strong>dealt with the property as owner</strong> — paying rates, carrying out improvements, letting to tenants</li>
</ul>
<p>The Land Registry does not require a complete chain of title — that is precisely the point of possessory title. They require enough evidence to satisfy themselves that the applicant is in possession and that the registration is appropriate.</p>

<h2>What possessory title registration gives the owner</h2>
<p>Registration with possessory title gives the registered proprietor:</p>
<ul>
  <li>The same powers of an absolute proprietor to <strong>deal with the land</strong> — sell, mortgage, let, develop — subject to any restrictions on the register</li>
  <li><strong>Priority over subsequent dealings</strong> — third parties dealing with the land after registration take subject to the registered proprietor's possessory title</li>
  <li>The ability to <strong>apply for upgrade to absolute title</strong> after 12 years of registered possession without adverse claim</li>
</ul>
<p>What it does not give:</p>
<ul>
  <li>The <strong>State Guarantee</strong> — HM Land Registry does not guarantee the title against claims arising before the date of first registration</li>
  <li>Full <strong>mortgage lender acceptance</strong> — most mainstream lenders decline possessory title</li>
</ul>

<div class="callout info">
  <div class="callout-title">💡 Checking when the possessory title was registered</div>
  <p>The date of first registration matters. A possessory title registered 25 years ago with no adverse claim in that period has a very different risk profile from one registered last year. The date appears in the title register history — downloadable from HM Land Registry for £3. In an auction pack, it will be in the official copies provided by the seller's solicitor.</p>
</div>

<h2>Adverse possession applications under the LRA 2002</h2>
<p>For registered land, adverse possession applications since October 2003 follow a different process under Schedule 6 of the Land Registration Act 2002. The squatter applies after 10 years of adverse possession; the registered owner is notified; if they object within 65 business days, the squatter is removed; if they do not object (or cannot be found), the squatter is registered. This is distinct from the old 12-year limitation period rule, though that still applies to unregistered land first registered after adverse possession was completed.</p>

${CTA_BOX('possessory title circumstances and registration date in your legal pack')}

<h2>What buyers should ask about any possessory title registration</h2>
<ol>
  <li><strong>When was it registered?</strong> (From the title register)</li>
  <li><strong>Why was it registered?</strong> (From statutory declarations or Land Registry correspondence in the pack, or from pre-auction enquiries)</li>
  <li><strong>Has there been any adverse claim since registration?</strong> (From the seller's statutory declaration and any correspondence in the pack)</li>
  <li><strong>Is indemnity insurance available?</strong> (From a legal indemnity insurer — approach before bidding)</li>
  <li><strong>Will your lender accept it?</strong> (From your lender or mortgage broker in writing)</li>
</ol>
<p>These five questions, answered before the auction, give you everything you need to make an informed bidding decision on a possessory title property.</p>

<h2>Frequently asked questions</h2>
<h3>How long does a possessory title application take?</h3>
<p>HM Land Registry's processing times for first registration applications currently range from a few weeks to several months depending on complexity and the Registrar's current workload. Once registered, the possessory title appears in the register immediately.</p>
<h3>Can I object to someone making a possessory title application for my land?</h3>
<p>Yes. If HM Land Registry receives an application that affects your registered land, they will notify you. You have the right to object. For adverse possession applications under the LRA 2002, registered owners are specifically notified and have 65 business days to respond.</p>
<h3>What is the difference between adverse possession and possessory title?</h3>
<p>Adverse possession is the process — occupying land without the owner's permission for the required period. Possessory title is the outcome — the class of title registered when the Land Registry accepts an application based on possession rather than documentary evidence. Adverse possession is one route to possessory title; lost deeds are another.</p>

${CTA_BLOCK('Buying possessory title property at auction?', 'LegalPack AI reads the title register, identifies the registration date and circumstances, and flags the risks in plain English. First analysis free for new users.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide<span>What it is, why it appears at auction, and how to assess the risk</span></a>
    <a href="/possessory-title-land-registry.html" class="related-link">Possessory title and the Land Registry<span>Where to find it in the title register and what it means</span></a>
    <a href="/upgrade-possessory-title.html" class="related-link">How to upgrade possessory title to absolute title<span>The Rule 124 application process explained</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>What it covers, what it costs, and when it is refused</span></a>
  </div>
</div>`
});

console.log('\n✅ All 10 pages written (pages 6–15)');
