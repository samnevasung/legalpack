/* auth-guard.js — intercepts all /dashboard.html links sitewide and gates them behind auth */
(function () {
  var SB_URL = 'https://ktrbbaakmlwmhyvpufcs.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cmJiYWFrbWx3bWh5dnB1ZmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjA3NTEsImV4cCI6MjA5MzE5Njc1MX0.qwcf5P9m_aTVd9oLMhaK085MQTP7IM9LrYrYq1PIY0Q';
  var _client = null;
  var _mode = 'signup';

  /* ── client ── */
  function getClient() {
    if (window.sbClient) return window.sbClient;
    if (_client) return _client;
    if (window.supabase) {
      _client = window.supabase.createClient(SB_URL, SB_KEY);
      return _client;
    }
    return null;
  }

  function loadSupabase(cb) {
    if (window.supabase) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ── link interception ── */
  function isDashboardHref(href) {
    return href && href.indexOf('dashboard.html') !== -1;
  }

  function interceptClicks() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('a[href]');
      if (!el || !isDashboardHref(el.getAttribute('href'))) return;
      e.preventDefault();
      e.stopPropagation();
      var txt = (el.textContent || '').toLowerCase();
      var mode = txt.indexOf('sign in') !== -1 || txt.indexOf('log in') !== -1 || txt.indexOf('login') !== -1 ? 'login' : 'signup';
      var client = getClient();
      if (!client) { window.location.href = '/dashboard.html'; return; }
      client.auth.getSession().then(function (r) {
        if (r.data && r.data.session) {
          window.location.href = '/dashboard.html';
        } else {
          openGuardModal(mode);
        }
      });
    }, true);
  }

  /* ── modal ── */
  function openGuardModal(mode) {
    // Delegate to index.html's existing modal if available
    if (typeof openSignInModal === 'function' && mode === 'login') {
      openSignInModal();
      return;
    }
    if (typeof openAuthModal === 'function') {
      openAuthModal(null);
      return;
    }
    var modal = document.getElementById('ag-modal');
    if (!modal) { injectModal(); modal = document.getElementById('ag-modal'); }
    setMode(mode || 'signup');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeGuardModal() {
    var modal = document.getElementById('ag-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function setMode(mode) {
    _mode = mode;
    var s = mode === 'signup';
    var el = function(id){ return document.getElementById(id); };
    if (el('ag-title')) el('ag-title').textContent = s ? 'Create Account' : 'Sign In';
    if (el('ag-sub')) el('ag-sub').textContent = s ? 'Join LegalPack AI — stop bidding blind' : 'Welcome back';
    if (el('ag-names')) el('ag-names').style.display = s ? 'grid' : 'none';
    if (el('ag-submit')) el('ag-submit').textContent = s ? 'Create Account' : 'Sign In';
    if (el('ag-switch-text')) el('ag-switch-text').textContent = s ? 'Already have an account?' : "Don't have an account?";
    if (el('ag-switch-btn')) el('ag-switch-btn').textContent = s ? 'Sign In' : 'Create Account';
  }

  function injectModal() {
    var div = document.createElement('div');
    div.innerHTML = '<div id="ag-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(13,12,26,0.75);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:20px;">'
      + '<div style="background:#fff;border-radius:20px;width:min(440px,100%);padding:40px 32px;position:relative;box-shadow:0 32px 80px rgba(0,0,0,0.25);font-family:\'DM Sans\',sans-serif;">'
      + '<button onclick="window._agClose()" style="position:absolute;top:16px;right:18px;background:none;border:none;color:#9490b0;font-size:20px;cursor:pointer;line-height:1;">&#10005;</button>'
      + '<div style="text-align:center;margin-bottom:24px;">'
      + '<div style="font-size:1.25rem;font-weight:800;margin-bottom:6px;color:#0d0c1a;" id="ag-title">Create Account</div>'
      + '<div style="font-size:0.85rem;color:#6b7280;" id="ag-sub">Join LegalPack AI — stop bidding blind</div>'
      + '</div>'
      + '<button onclick="window._agGoogle()" style="width:100%;padding:13px;border-radius:10px;border:1px solid #e2e0f0;background:#fff;color:#0d0c1a;font-family:\'DM Sans\',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:18px;">'
      + '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>'
      + 'Continue with Google</button>'
      + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;"><div style="flex:1;height:1px;background:#e2e0f0;"></div><span style="color:#9490b0;font-size:0.78rem;">or</span><div style="flex:1;height:1px;background:#e2e0f0;"></div></div>'
      + '<div id="ag-names" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">'
      + '<input id="ag-fn" placeholder="First name" style="padding:11px 13px;background:#fff;border:1px solid #e2e0f0;border-radius:9px;color:#0d0c1a;font-family:\'DM Sans\',sans-serif;font-size:0.88rem;outline:none;width:100%;box-sizing:border-box;">'
      + '<input id="ag-ln" placeholder="Last name" style="padding:11px 13px;background:#fff;border:1px solid #e2e0f0;border-radius:9px;color:#0d0c1a;font-family:\'DM Sans\',sans-serif;font-size:0.88rem;outline:none;width:100%;box-sizing:border-box;"></div>'
      + '<input id="ag-email" type="email" placeholder="Email address" style="width:100%;padding:11px 13px;background:#fff;border:1px solid #e2e0f0;border-radius:9px;color:#0d0c1a;font-family:\'DM Sans\',sans-serif;font-size:0.88rem;margin-bottom:10px;outline:none;box-sizing:border-box;">'
      + '<input id="ag-pw" type="password" placeholder="Password" style="width:100%;padding:11px 13px;background:#fff;border:1px solid #e2e0f0;border-radius:9px;color:#0d0c1a;font-family:\'DM Sans\',sans-serif;font-size:0.88rem;margin-bottom:8px;outline:none;box-sizing:border-box;">'
      + '<div id="ag-err" style="display:none;color:#dc2626;font-size:0.78rem;margin-bottom:8px;padding:8px 12px;background:#fef2f2;border-radius:7px;border:1px solid #fecaca;"></div>'
      + '<button id="ag-submit" onclick="window._agSubmit()" style="width:100%;padding:13px;background:#6d28d9;color:#fff;border:none;border-radius:10px;font-family:\'DM Sans\',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;margin-bottom:16px;box-shadow:0 4px 16px rgba(109,40,217,0.3);">Create Account</button>'
      + '<div style="text-align:center;font-size:0.82rem;color:#6b7280;"><span id="ag-switch-text">Already have an account?</span>'
      + '<button onclick="window._agToggle()" style="background:none;border:none;color:#6d28d9;font-weight:700;cursor:pointer;font-size:0.82rem;margin-left:4px;" id="ag-switch-btn">Sign In</button></div>'
      + '</div></div>';
    document.body.appendChild(div.firstElementChild);
    document.getElementById('ag-modal').addEventListener('click', function (e) {
      if (e.target === this) closeGuardModal();
    });
    document.addEventListener('keydown', function (e) {
      var m = document.getElementById('ag-modal');
      if (!m || m.style.display !== 'flex') return;
      if (e.key === 'Escape') closeGuardModal();
      if (e.key === 'Enter') window._agSubmit();
    });
  }

  /* ── exposed handlers ── */
  window._agClose = closeGuardModal;
  window._agToggle = function () { setMode(_mode === 'signup' ? 'login' : 'signup'); };
  window._agGoogle = async function () {
    var client = getClient();
    if (!client) return;
    await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard.html' } });
  };
  window._agSubmit = async function () {
    var client = getClient();
    if (!client) return;
    var el = function(id){ return document.getElementById(id); };
    var email = el('ag-email').value.trim();
    var pw = el('ag-pw').value;
    var errEl = el('ag-err');
    var btn = el('ag-submit');
    errEl.style.display = 'none';
    if (!email || !pw) { errEl.textContent = 'Please fill in all fields'; errEl.style.display = 'block'; return; }
    btn.textContent = _mode === 'signup' ? 'Creating account...' : 'Signing in...';
    btn.disabled = true;
    try {
      if (_mode === 'signup') {
        var fn = el('ag-fn') ? el('ag-fn').value.trim() : '';
        var ln = el('ag-ln') ? el('ag-ln').value.trim() : '';
        var r = await client.auth.signUp({ email: email, password: pw, options: { data: { first_name: fn, last_name: ln, full_name: (fn + ' ' + ln).trim() } } });
        if (r.error) throw new Error(r.error.message);
        if (r.data.session) { window.location.href = '/dashboard.html'; return; }
        closeGuardModal();
        alert('Account created! Check your email to confirm, then sign in.');
      } else {
        var r = await client.auth.signInWithPassword({ email: email, password: pw });
        if (r.error) throw new Error(r.error.message);
        window.location.href = '/dashboard.html';
      }
    } catch (e) {
      errEl.textContent = e.message; errEl.style.display = 'block';
      btn.textContent = _mode === 'signup' ? 'Create Account' : 'Sign In'; btn.disabled = false;
    }
  };

  /* ── init ── */
  function setup() {
    _client = getClient();
    interceptClicks();
  }

  loadSupabase(function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  });
})();
