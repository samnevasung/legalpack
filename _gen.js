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
  <p>LegalPack AI reads every page of your legal pack and flags issues in plain English — in minutes.</p>
  <p class="free-note">⚡ New users get their first analysis completely free. No card required.</p>
  <a href="/dashboard.html" class="btn-primary">Analyse your legal pack free →</a>
</div>`;

const CTA_BLOCK = (h, sub) => `<div class="cta-block">
  <h2>${h}</h2>
  <p>${sub}</p>
  <div class="free-badge">⚡ First analysis free for new users</div><br>
  <a href="/dashboard.html">Analyse Your Legal Pack →</a>
</div>`;

const HERO = (breadcrumb, tag, h1, intro, readtime) => `<div class="hero-content">
  <div class="breadcrumb"><a href="/">Home</a> › ${breadcrumb}</div>
  <div class="article-tag">${tag}</div>
  <h1>${h1}</h1>
  <p class="article-intro">${intro}</p>
  <div class="article-meta">
    <span>📅 Updated June 2026</span>
    <span>⏱ ${readtime}</span>
    <span>🇬🇧 England &amp; Wales</span>
  </div>
</div>`;

// ─── PAGE DEFINITIONS ────────────────────────────────────────────────────────

const pages = [];

// 1. auction-legal-pack-review-24-hours
pages.push({
  file: 'auction-legal-pack-review-24-hours.html',
  slug: 'auction-legal-pack-review-24-hours',
  title: 'Auction Legal Pack Review in 24 Hours | LegalPack AI',
  desc: 'Need an auction legal pack reviewed fast? Solicitors take 3–7 days. LegalPack AI delivers a full risk report in minutes — available 24/7 including the night before your auction.',
  tag: { color: '#d97706', bg: '#fffbeb', border: '#fef3c7' },
  tagText: '⚡ Fast Review',
  breadcrumb: 'Guides › Auction Legal Pack Review 24 Hours',
  h1: 'Auction legal pack review in <em>24 hours</em>',
  intro: 'Auction packs drop with almost no warning. Solicitors take 3–7 working days. If your auction is tomorrow — or tonight — you need a faster option.',
  readtime: '5 min read',
  body: `
<h2>Why buyers need a legal pack review before bidding</h2>
<p>UK property auctions operate under a critical legal principle: when the hammer falls, contracts exchange immediately. There is no cooling-off period, no right to renegotiate, and no protection if you discover a problem in the legal pack after winning the lot. The pack was available — the law assumes you read it.</p>
<p>Auction legal packs routinely contain title defects, onerous special conditions, hidden buyer fees, short leases, flying freeholds, and service charge arrears. None of these are negotiating points after exchange — they become your legal obligations the moment you win.</p>

<h2>How long does a solicitor take to review an auction legal pack?</h2>
<p>A standard solicitor's review of an auction legal pack typically takes <strong>3–7 working days</strong>. That includes reading the title register and plan, checking all three sets of searches (local authority, drainage, environmental), reviewing special conditions, and drafting a written advice letter. If the property is leasehold, add time for reviewing the lease, management information, and service charge accounts.</p>
<p>Many auction houses publish packs only 2–4 weeks before the sale — and in some cases just a few days before. If you're in a competitive market watching multiple lots, waiting a week per pack is simply not practical.</p>

<div class="callout warn">
  <div class="callout-title">⚠ The night-before problem</div>
  <p>Auction packs are sometimes updated the night before a sale with amended special conditions or additional documents. A solicitor who reviewed the pack five days ago has not seen those amendments. You need a review completed as close to auction day as possible.</p>
</div>

<h2>What a 24-hour legal pack review should cover</h2>
<ul>
  <li><strong>Title register</strong> — class of title, any charges, restrictions, overriding interests</li>
  <li><strong>Special conditions of sale</strong> — non-standard terms, added buyer fees, shortened completion windows, deposit requirements above 10%</li>
  <li><strong>Property searches</strong> — local authority, drainage (CON29DW), environmental — looking for planning issues, flood risk, contamination</li>
  <li><strong>Lease review</strong> (if leasehold) — remaining term, ground rent escalation, service charge history, management pack</li>
  <li><strong>Title plan</strong> — boundary issues, access, rights of way</li>
  <li><strong>Missing documents</strong> — what has been referenced but not provided</li>
</ul>

<h2>What LegalPack AI delivers</h2>
<p>LegalPack AI processes your legal pack documents — PDFs, ZIPs, multi-file uploads — and produces a structured risk report covering all of the above in <strong>3–5 minutes</strong>. The report uses the same document categories a cautious UK property solicitor would review, and flags issues at three severity levels: Critical, Warning, and Note.</p>
<p>It is available 24 hours a day, 7 days a week — including bank holidays, Sunday evenings, and the hour before your auction starts.</p>

<div class="ai-flag">
  <div class="ai-flag-label">⚠ LegalPack AI — Sample Flag</div>
  Special Conditions — Clause 4: Buyer to pay seller's legal costs capped at £1,500 plus VAT on completion. This is in addition to the buyer's premium stated in the auction catalogue. Total additional buyer cost: approximately £3,300 inc. VAT not included in the guide price.
</div>

${CTA_BOX('hidden fees and title issues')}

<h2>Can AI replace a solicitor for an auction legal pack review?</h2>
<p>No — and we're transparent about that. LegalPack AI is a risk-identification tool, not legal advice. It does not provide an opinion on whether you should bid, cannot raise pre-auction enquiries on your behalf, and does not carry professional indemnity insurance. What it does is give you a structured, plain-English summary of what is in the pack — fast enough to be useful before an auction.</p>
<p>The ideal approach is to use LegalPack AI to screen the pack immediately, then forward the flagged issues to a solicitor for targeted advice. This is faster and often cheaper than a full solicitor review from scratch.</p>

<h2>How to get an auction legal pack reviewed quickly</h2>
<ol>
  <li><strong>Download the full legal pack</strong> from the auction house website as soon as it's published — typically a ZIP file</li>
  <li><strong>Upload to LegalPack AI</strong> — we support PDF, ZIP, JPG, and multi-file — and receive your risk report in minutes</li>
  <li><strong>Share the report with a solicitor</strong> for targeted advice on any Critical or Warning flags before bidding</li>
  <li><strong>Re-check the day before</strong> — download the pack again in case it has been updated with amended conditions</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>How fast can a legal pack be reviewed?</h3>
<p>LegalPack AI delivers a risk report in 3–5 minutes for most packs. A solicitor typically takes 3–7 working days. If your auction is soon, using AI to identify the key issues first and then getting targeted solicitor advice is the fastest practical approach.</p>
<h3>Can I review a legal pack myself?</h3>
<p>You can read the documents yourself, but most buyers lack the legal background to spot all issues — particularly in the title register, special conditions, and lease covenants. LegalPack AI bridges that gap by translating the documents into plain English with flagged risk levels.</p>
<h3>What if the pack is updated after the initial review?</h3>
<p>Auction houses sometimes issue addendum packs the day before a sale. Always download the latest version and re-run the analysis before bidding.</p>

${CTA_BLOCK('Legal pack review in minutes, not days', 'Upload your pack now and get a full risk report before your auction. Available 24/7.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/auction-legal-pack-review.html" class="related-link">Auction legal pack review: the complete guide<span>Everything a legal pack review should cover</span></a>
    <a href="/how-to-read-auction-legal-pack.html" class="related-link">How to read an auction legal pack<span>Step-by-step guide to every document</span></a>
    <a href="/auction-legal-pack-checklist.html" class="related-link">Auction legal pack checklist<span>Every document and clause to check before bidding</span></a>
    <a href="/hidden-costs-auction-legal-pack.html" class="related-link">Hidden costs in auction legal packs<span>Fees buried in special conditions most buyers miss</span></a>
  </div>
</div>`
});

// 2. possessory-title-land-registry
pages.push({
  file: 'possessory-title-land-registry.html',
  slug: 'possessory-title-land-registry',
  title: 'Possessory Title at HM Land Registry: What It Means | LegalPack AI',
  desc: 'Possessory title is the lowest grade registered by HM Land Registry. Learn how it is registered, what the title register shows, how to check it, and how to upgrade to absolute title.',
  tag: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  tagText: '🔴 Title Risk',
  breadcrumb: 'Guides › Possessory Title Land Registry',
  h1: 'Possessory title and the <em>Land Registry</em>',
  intro: 'When HM Land Registry registers a property with possessory title, it is telling you something important: the owner could not prove their right to the land from documentary evidence. Here is exactly what that means, where to find it, and what you can do about it.',
  readtime: '6 min read',
  body: `
<h2>How the Land Registry grades title</h2>
<p>Every registered property in England and Wales has a class of title recorded in the A Register (the proprietorship register). HM Land Registry uses four grades, from best to worst:</p>
<table class="data-table">
<thead><tr><th>Class</th><th>What it means</th><th>State Guarantee?</th></tr></thead>
<tbody>
<tr><td><strong>Absolute Freehold / Absolute Leasehold</strong></td><td>Owner has proven title from documentary evidence. Standard for most properties.</td><td>Yes</td></tr>
<tr><td><strong>Good Leasehold</strong></td><td>Leasehold title accepted but landlord's freehold title not investigated.</td><td>Partial</td></tr>
<tr><td><strong>Qualified Title</strong></td><td>Title good only from a particular date or subject to a specific qualification. Rare.</td><td>Partial</td></tr>
<tr><td><strong>Possessory Title</strong></td><td>Owner registered based on possession, not documentary proof of right.</td><td>No</td></tr>
</tbody>
</table>

<h2>Where to find the class of title in the title register</h2>
<p>Open the official title register (downloadable from the Land Registry portal for £3 per title). Look at <strong>section A1</strong> — the first entry in the A Register (Proprietorship Register). It will read one of:</p>
<ul>
  <li><em>"Title absolute"</em> — the standard, good outcome</li>
  <li><em>"Possessory freehold title"</em> or <em>"Possessory leasehold title"</em> — the red flag</li>
</ul>
<p>In auction legal packs the title register is always included as a standard document. LegalPack AI reads the A Register entry and flags possessory title automatically at Critical severity.</p>

<h2>Why the Land Registry registers possessory title</h2>
<p>The Land Registry will register possessory title when an applicant for first registration cannot produce the original title deeds or otherwise prove their root of title. The most common reasons are:</p>
<ul>
  <li><strong>Lost deeds</strong> — the original conveyancing documents were held by a solicitor who has since closed, destroyed in a fire, or simply lost over generations of ownership</li>
  <li><strong>Adverse possession</strong> — the applicant has been in continuous, open, and uninterrupted possession of the land for the required period (12 years under the pre-2003 law) without the paper title</li>
  <li><strong>Missing links in the ownership chain</strong> — one or more historic conveyances cannot be located, creating a gap that prevents absolute title being established</li>
  <li><strong>Probate complications</strong> — the deceased owner held land informally without ever having the title formally conveyed to them in their name</li>
</ul>

<div class="callout danger">
  <div class="callout-title">🔴 No State Guarantee</div>
  <p>With absolute title, HM Land Registry's State Guarantee means that if you suffer loss due to a Land Registry error, you can claim indemnity. With possessory title, there is no equivalent guarantee for the period before registration. A third party with a superior claim could potentially assert rights against the property.</p>
</div>

<h2>What the Land Registry shows alongside possessory title</h2>
<p>The title register entry for a possessory title property typically includes a caution or note along the lines of: <em>"The title is registered with possessory title only. Any purchaser must take subject to any estate, right, interest or power over the land which precedes the date of registration."</em> This is a formal warning that the owner's title is not guaranteed for the period before they were registered.</p>

<h2>Checking possessory title before an auction</h2>
<p>Before bidding on any property where the title register shows possessory title, establish:</p>
<ol>
  <li><strong>When was possessory title first registered?</strong> The longer ago, the lower the practical risk of an adverse claim. 20+ years with no challenge is materially different from a recent registration.</li>
  <li><strong>Why was possessory title registered?</strong> Lost deeds are generally benign. Adverse possession against a traceable former owner is much higher risk.</li>
  <li><strong>Is indemnity insurance available?</strong> Contact a legal indemnity insurer — the circumstances of the possessory registration determine whether insurance is available and at what premium.</li>
  <li><strong>Will your mortgage lender accept possessory title?</strong> Most mainstream lenders decline. Check with your lender before bidding.</li>
</ol>

${CTA_BOX('possessory title and all other title issues')}

<h2>How to upgrade possessory title to absolute title</h2>
<p>After the possessory title owner has been registered for at least 12 years and there is no adverse claim, an application can be made to HM Land Registry to upgrade to absolute title under <strong>Rule 124 of the Land Registration Rules 2003</strong>. The applicant must provide:</p>
<ul>
  <li>Statutory declaration confirming continuous possession and no known adverse claim</li>
  <li>Evidence of occupation (utility bills, council tax records, correspondence)</li>
  <li>Confirmation that no third party has asserted any rights to the land</li>
</ul>
<p>The Land Registry will then consider the application and, if satisfied, upgrade the title. This typically takes 3–6 months and costs £1,500–£3,000 in legal fees plus Land Registry fees.</p>

<h2>Frequently asked questions</h2>
<h3>What does possessory title mean on the Land Registry?</h3>
<p>It means the property was registered with the lowest grade of title because the applicant could not produce documentary proof of their right to the land at the time of first registration. The State does not guarantee the owner's title, and the register entry will explicitly note this.</p>
<h3>How do I find out if a property has possessory title?</h3>
<p>Download the official title register from HM Land Registry (£3) and check section A1. If it states "Possessory Freehold" or "Possessory Leasehold", the property has possessory title. In an auction context, the legal pack will include the title register — LegalPack AI reads it and flags the title class automatically.</p>
<h3>Can possessory title be upgraded?</h3>
<p>Yes, after 12 years of registered possession without adverse claim, an application can be made under Rule 124 LRR 2003. The process takes several months and costs approximately £1,500–£3,000 in legal fees.</p>

${CTA_BLOCK('Know your title before you bid', 'LegalPack AI reads the title register and flags possessory title, restrictions, and charges — in minutes.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide for auction buyers<span>Everything you need to know before bidding</span></a>
    <a href="/upgrade-possessory-title.html" class="related-link">How to upgrade possessory title to absolute title<span>The Land Registry application process explained</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>How to get cover and what it costs</span></a>
    <a href="/title-defects-property.html" class="related-link">Title defects at auction<span>All the title issues found in auction legal packs</span></a>
  </div>
</div>`
});

// 3. possessory-title-indemnity-insurance
pages.push({
  file: 'possessory-title-indemnity-insurance.html',
  slug: 'possessory-title-indemnity-insurance',
  title: 'Possessory Title Indemnity Insurance: Cost & How to Get It | LegalPack AI',
  desc: 'Possessory title indemnity insurance protects buyers and lenders against adverse claims on properties with possessory title. Learn what it covers, what it costs, and when it may be refused.',
  tag: { color: '#d97706', bg: '#fffbeb', border: '#fef3c7' },
  tagText: '⚠ Insurance',
  breadcrumb: 'Guides › Possessory Title Indemnity Insurance',
  h1: 'Possessory title <em>indemnity insurance</em>: what it covers and what it costs',
  intro: 'Legal indemnity insurance is often the only practical solution for making a possessory title property mortgageable and sellable. But it is not always available — and when it is, the circumstances of the registration determine the cost.',
  readtime: '5 min read',
  body: `
<h2>What is possessory title indemnity insurance?</h2>
<p>Possessory title indemnity insurance is a one-off premium legal insurance policy that protects the buyer (and their mortgage lender, if any) against financial loss arising from a third party asserting a superior claim to the property based on rights that predate the possessory title registration. It does not change the class of title — the Land Registry entry still shows possessory — but it gives the buyer and lender financial protection if a claim materialises.</p>
<p>The policy runs with the land. It transfers to future buyers on sale, which makes the property easier to sell later. Most policies are purchased for the full market value of the property.</p>

<h2>What possessory title insurance covers</h2>
<ul>
  <li><strong>Loss in value</strong> if a third party successfully claims a superior title</li>
  <li><strong>Legal costs</strong> of defending any adverse claim</li>
  <li><strong>Mortgage lender's position</strong> — the lender is usually noted on the policy as an additional insured</li>
  <li><strong>Future sale costs</strong> — if the policy makes it possible to sell without discounting for the possessory title</li>
</ul>

<div class="callout warn">
  <div class="callout-title">⚠ What it does not cover</div>
  <p>Insurance does not make the title absolute. It does not cover a claim from someone who was already known to assert rights before the policy was taken out. If there is an active dispute or a known claimant, insurance will be declined.</p>
</div>

<h2>How much does possessory title indemnity insurance cost?</h2>
<p>The premium depends on several factors: the property value, the length of time since possessory title was registered, the reason for possessory registration, and the insurer's assessment of risk. Typical indicative ranges:</p>
<table class="data-table">
<thead><tr><th>Scenario</th><th>Typical Premium</th></tr></thead>
<tbody>
<tr><td>Residential property (lost deeds, 15+ years registered, no known claim)</td><td>£300–£600</td></tr>
<tr><td>Residential property (adverse possession, 12 years, benign)</td><td>£500–£1,200</td></tr>
<tr><td>Higher value property (£500k+) or recent registration</td><td>£1,000–£3,000+</td></tr>
<tr><td>Known or suspected adverse claimant</td><td>Declined</td></tr>
</tbody>
</table>
<p>Premiums are one-off, paid at the time the policy is arranged. There are no annual renewals.</p>

<h2>When possessory title insurance may be refused</h2>
<p>Insurers will decline to provide cover in certain circumstances:</p>
<ul>
  <li>There is a known person or entity who has asserted, or could assert, a superior title</li>
  <li>The possessory title was registered very recently (within 1–2 years in some cases)</li>
  <li>The reason for possessory registration is actively disputed</li>
  <li>There are ongoing boundary disputes or overlapping registered titles</li>
  <li>The land was acquired through adverse possession and the original owner can be traced and is likely to challenge</li>
</ul>

<div class="callout danger">
  <div class="callout-title">🔴 If insurance is refused</div>
  <p>If a legal indemnity insurer declines to cover a possessory title property, that is a significant red flag. Without insurance, most mortgage lenders will not lend, and future buyers will face the same problem. A cash purchase without insurance is possible but represents an elevated risk that should only be taken with specialist legal advice.</p>
</div>

<h2>How to arrange possessory title insurance</h2>
<ol>
  <li><strong>Instruct a solicitor</strong> — they will contact legal indemnity insurers (Aviva, CLS, Defaqto-rated specialists) on your behalf</li>
  <li><strong>Provide the circumstances</strong> — the insurer will ask why the title is possessory, when it was registered, and whether any adverse claim is known</li>
  <li><strong>Premium is quoted</strong> — usually within 24–48 hours for standard cases</li>
  <li><strong>Policy issued on completion</strong> — the lender is noted on the policy and it transfers on future sale</li>
</ol>
<p>For auction buyers, this process needs to happen <em>before bidding</em>, not after. Once you win at auction, contracts are exchanged — you cannot make your purchase conditional on insurance being available.</p>

${CTA_BOX('possessory title and insurance requirements')}

<h2>Frequently asked questions</h2>
<h3>Do I need a solicitor to arrange possessory title insurance?</h3>
<p>Technically no, but in practice yes. Insurers prefer to deal with solicitors who can confirm the circumstances accurately. At auction, your conveyancing solicitor should arrange the insurance as part of the pre-auction due diligence.</p>
<h3>Does possessory title insurance make a property mortgageable?</h3>
<p>Some lenders — particularly specialist lenders and some high street banks — will accept possessory title if backed by an adequate indemnity policy. However, many mainstream lenders still decline regardless of insurance. Check your lender's specific policy before bidding.</p>
<h3>Does the insurance transfer when I sell?</h3>
<p>Yes. Possessory title indemnity policies are indefinite and transfer to future buyers without additional premium. This makes the property easier to sell and means future buyers benefit from the same protection.</p>

${CTA_BLOCK('Check your legal pack for possessory title risk', 'LegalPack AI flags possessory title, indemnity requirements, and mortgage risk — in minutes. First analysis free for new users.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide<span>What it is, why it appears at auction, and the risks</span></a>
    <a href="/possessory-title-mortgage-lenders.html" class="related-link">Possessory title mortgage lenders<span>Which lenders accept possessory title and under what conditions</span></a>
    <a href="/should-i-buy-house-possessory-title.html" class="related-link">Should I buy a house with possessory title?<span>A framework for making the decision</span></a>
    <a href="/title-defects-property.html" class="related-link">Title defects at auction<span>All title issues found in auction legal packs</span></a>
  </div>
</div>`
});

// 4. possessory-title-mortgage-lenders
pages.push({
  file: 'possessory-title-mortgage-lenders.html',
  slug: 'possessory-title-mortgage-lenders',
  title: 'Possessory Title Mortgage Lenders: Who Will Lend? | LegalPack AI',
  desc: 'Most mortgage lenders decline possessory title properties. Learn which lenders may consider lending, what conditions they impose, and how to find finance for a possessory title property.',
  tag: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  tagText: '🏦 Mortgage',
  breadcrumb: 'Guides › Possessory Title Mortgage Lenders',
  h1: 'Possessory title and <em>mortgage lenders</em>: who will lend?',
  intro: 'Most high street mortgage lenders automatically decline possessory title properties. Before bidding at auction on a property with this title class, you need to know your finance options — and the answer needs to come from your lender, not from assumptions.',
  readtime: '5 min read',
  body: `
<h2>Why most lenders decline possessory title</h2>
<p>Mortgage lenders instruct their own solicitors to investigate title as part of the lending process. When those solicitors report possessory title, the lender faces a problem: the security they are lending against does not carry the State Guarantee. In the event of a superior claimant successfully asserting rights, the lender's security could be worth less than the outstanding mortgage.</p>
<p>Most mainstream lenders take a conservative position and decline to lend on possessory title properties altogether, regardless of indemnity insurance, because their lending criteria specify absolute (or good leasehold) title as a minimum requirement.</p>

<h2>Which lenders may consider possessory title?</h2>
<p>While we cannot confirm current lender policies (these change and must be verified directly), the general landscape is:</p>
<table class="data-table">
<thead><tr><th>Lender type</th><th>General position on possessory title</th></tr></thead>
<tbody>
<tr><td>Major high street banks (Barclays, NatWest, HSBC, Lloyds)</td><td>Typically decline</td></tr>
<tr><td>Building societies (nationwide, Santander)</td><td>Typically decline without indemnity insurance; some case-by-case</td></tr>
<tr><td>Specialist residential lenders</td><td>Some will consider with indemnity insurance in place</td></tr>
<tr><td>Bridging lenders</td><td>More flexible — many will lend on possessory title with insurance</td></tr>
<tr><td>Cash buyers</td><td>No lender constraint — risk sits with buyer</td></tr>
</tbody>
</table>

<div class="callout warn">
  <div class="callout-title">⚠ Bridging finance and auction</div>
  <p>Bridging finance is commonly used for auction purchases because it completes within 28 days. Bridging lenders are generally more flexible on title quality than high street lenders — but they charge significantly higher rates (typically 0.75–1.5% per month) and arrangement fees. Always factor bridging costs into your maximum bid calculation.</p>
</div>

<h2>What lenders typically require for possessory title</h2>
<p>Lenders who do consider possessory title typically require:</p>
<ul>
  <li><strong>A legal indemnity policy</strong> noting the lender as an additional insured, for at least the full mortgage amount</li>
  <li><strong>Confirmation of the reason for possessory registration</strong> — lost deeds with no known adverse claimant is far more acceptable than recent adverse possession</li>
  <li><strong>Minimum time since registration</strong> — many lenders require possessory title to have been registered for at least 10–15 years without challenge</li>
  <li><strong>Specialist legal advice</strong> from the borrower's solicitor confirming the risk is acceptable</li>
</ul>

<h2>The auction timing problem</h2>
<p>At a traditional property auction, completion is required within 28 days of the hammer falling. Standard residential mortgages take 4–12 weeks to complete. This creates a fundamental conflict — you cannot get a standard mortgage in time for an auction completion.</p>
<p>Most buyers at auction either use cash, bridging finance (which can complete in days), or the Modern Method of Auction (which gives 56 days). If you need a standard mortgage, you need either MMoA or an unusually fast lender.</p>
<p>For possessory title specifically: confirm your lender's position, confirm insurance availability, and confirm completion timeline — all before you bid. You cannot walk away after the hammer falls.</p>

${CTA_BOX('possessory title and mortgage risk in your legal pack')}

<h2>How to find a lender for possessory title</h2>
<ol>
  <li><strong>Speak to a specialist mortgage broker</strong> who has access to the whole market — they will know which lenders are currently accepting possessory title and under what conditions</li>
  <li><strong>Get a Decision in Principle before the auction</strong> — verbal assurances are not enough; get written confirmation that your lender will proceed subject to satisfactory legal report</li>
  <li><strong>Confirm insurance availability</strong> — the lender will need to see the indemnity policy; arrange this before bidding</li>
  <li><strong>Use bridging as a fallback</strong> — even if your long-term plan is a mortgage, bridging finance can complete the auction purchase while you arrange mortgage finance on a less pressured timeline</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>Can I get a mortgage on a possessory title property?</h3>
<p>Some lenders will consider it, typically with legal indemnity insurance in place and subject to the circumstances of the possessory registration. Most mainstream lenders decline. A specialist mortgage broker is essential.</p>
<h3>Does indemnity insurance guarantee mortgage approval?</h3>
<p>No. Some lenders will not lend on possessory title regardless of insurance, because their lending criteria require absolute title. Insurance addresses the financial risk but does not change the lender's criteria.</p>
<h3>What is the fastest way to finance an auction property with possessory title?</h3>
<p>Bridging finance. Bridging lenders are more flexible on title quality and can complete within days. The cost is higher than a standard mortgage but bridges the gap until you can refinance or sell.</p>

${CTA_BLOCK('Know your title before you bid', 'LegalPack AI flags possessory title and mortgage risk in minutes. First analysis free for new users.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide<span>What it is, why it appears at auction, and the risks</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>What it covers, what it costs, and when it is refused</span></a>
    <a href="/bridging-finance-auction-property.html" class="related-link">Bridging finance for auction property<span>How bridging works and what it costs</span></a>
    <a href="/what-makes-auction-property-unmortgageable.html" class="related-link">What makes an auction property unmortgageable?<span>The title and structural issues lenders decline</span></a>
  </div>
</div>`
});

// 5. does-possessory-title-affect-value
pages.push({
  file: 'does-possessory-title-affect-value.html',
  slug: 'does-possessory-title-affect-value',
  title: 'Does Possessory Title Affect Property Value? | LegalPack AI',
  desc: 'Possessory title typically reduces property value by 5–20% compared to absolute title equivalents. Understand why, how valuers treat it, and whether the discount is worth the risk.',
  tag: { color: '#d97706', bg: '#fffbeb', border: '#fef3c7' },
  tagText: '💷 Valuation',
  breadcrumb: 'Guides › Does Possessory Title Affect Value',
  h1: 'Does possessory title <em>affect property value</em>?',
  intro: 'Yes — possessory title almost always reduces the market value of a property relative to an otherwise identical property with absolute title. The size of the discount depends on the circumstances of the registration, mortgage lender attitudes, and insurance availability.',
  readtime: '5 min read',
  body: `
<h2>Why possessory title depresses value</h2>
<p>Property value is driven by the number of buyers who can compete for it. Possessory title reduces that pool in two ways:</p>
<ul>
  <li><strong>Mortgage lenders decline</strong> — most mainstream lenders will not lend on possessory title, immediately excluding all buyers who need a mortgage. A smaller buyer pool means less competitive bidding and a lower price.</li>
  <li><strong>Buyer risk premium</strong> — even cash buyers will discount a possessory title property to account for the uncertainty over the title, the cost of insurance, potential upgrade costs, and the difficulty they will face when they come to sell.</li>
</ul>
<p>RICS valuers are required to report on the class of title when valuing a property for mortgage purposes. A report showing possessory title will trigger a referral back to the lender who will typically decline to proceed.</p>

<h2>Typical value discounts for possessory title</h2>
<table class="data-table">
<thead><tr><th>Scenario</th><th>Approximate Discount vs Absolute Title</th></tr></thead>
<tbody>
<tr><td>Lost deeds, 20+ years registered, insurance available, benign circumstances</td><td>3–8%</td></tr>
<tr><td>Adverse possession, 12+ years, no known claimant, insurance available</td><td>8–15%</td></tr>
<tr><td>Recent registration, circumstances unclear, insurance marginal</td><td>15–25%</td></tr>
<tr><td>Known adverse claimant, insurance refused</td><td>25–40%+ or unbuildable</td></tr>
</tbody>
</table>
<p>These are indicative ranges, not guaranteed figures. Every case is different and local market conditions also play a role.</p>

<div class="callout info">
  <div class="callout-title">💡 The auction opportunity</div>
  <p>The value discount created by possessory title is exactly why these properties appear at auction — and why experienced investors can buy below comparable market value. The key is buying at a price that reflects the true risk-adjusted value, not the same price you would pay for an absolute title equivalent.</p>
</div>

<h2>How to assess whether the discount is worth it</h2>
<p>Before bidding on a possessory title property, work through this framework:</p>
<ol>
  <li><strong>Establish why the title is possessory</strong> — the reason determines the realistic risk of an adverse claim</li>
  <li><strong>Get an insurance quote</strong> — if insurance is available and affordable, the residual risk is much lower</li>
  <li><strong>Calculate your exit</strong> — how easy will it be to sell this property? To whom? Will future buyers face the same mortgage problems you are facing?</li>
  <li><strong>Price in all costs</strong> — insurance premium (£300–£2,000+), legal fees, potential upgrade application costs (£1,500–£3,000)</li>
  <li><strong>Set your maximum bid accordingly</strong> — the discount to comparable absolute title properties should be your starting point, not the guide price</li>
</ol>

<h2>Does upgrading to absolute title restore full value?</h2>
<p>Yes, in most cases. Once HM Land Registry upgrades the title to absolute, the property becomes mortgageable on standard terms and the full buyer pool is restored. This is why some investors deliberately buy possessory title properties at a discount, upgrade the title over 12 years (during which they let the property), and then sell at full market value.</p>
<p>The maths only works if the purchase discount is large enough to justify the holding period, upgrade costs, and the risk that the upgrade application is refused or an adverse claim materialises during the holding period.</p>

${CTA_BOX('possessory title risk in your auction legal pack')}

<h2>Frequently asked questions</h2>
<h3>Does possessory title always reduce value?</h3>
<p>Almost always, yes — at least relative to what the same property would be worth with absolute title. The size of the reduction depends on the circumstances. Very benign cases (old registration, lost deeds, insurance available) may see discounts of only 3–5%. More complex cases can see 20–30%+ reductions.</p>
<h3>Can a property with possessory title be valued for mortgage purposes?</h3>
<p>A RICS valuer will carry out the valuation, but they must report the class of title. Most lenders will then decline to lend based on the legal report, regardless of the valuation figure. The valuation and the lender's title requirements are separate processes.</p>
<h3>Is it worth buying a possessory title property at auction?</h3>
<p>It can be, if the price reflects the risk. The due diligence must include establishing why the title is possessory, whether insurance is available, how you will finance the purchase, and what your exit strategy is. LegalPack AI identifies possessory title and the circumstances around it in your legal pack.</p>

${CTA_BLOCK('Understand the title risk before you set your bid', 'LegalPack AI flags possessory title, valuations, and mortgage risk in minutes. First analysis free.')}

<div class="related-guides">
  <h2>Related guides</h2>
  <div class="related-list">
    <a href="/possessory-title.html" class="related-link">Possessory title: complete guide<span>What it is and what it means for auction buyers</span></a>
    <a href="/possessory-title-indemnity-insurance.html" class="related-link">Possessory title indemnity insurance<span>How to get cover and what it costs</span></a>
    <a href="/possessory-title-mortgage-lenders.html" class="related-link">Possessory title mortgage lenders<span>Which lenders will consider possessory title</span></a>
    <a href="/hidden-costs-auction-legal-pack.html" class="related-link">Hidden costs in auction legal packs<span>All the fees buyers miss before bidding</span></a>
  </div>
</div>`
});

// Write pages 1-5
for (const p of pages) {
  const html = HEAD(p.title, p.desc, p.slug, p.tag) +
    HERO(p.breadcrumb, p.tagText, p.h1, p.intro, p.readtime) +
    '\n<div class="page-layout">\n<article>\n' +
    p.body +
    '\n</article>\n' + SIDEBAR + '\n</div>\n' + FOOTER;
  fs.writeFileSync(path.join(BASE, p.file), html, 'utf8');
  console.log('Written:', p.file);
}
console.log('Batch 1 done (5 pages)');
