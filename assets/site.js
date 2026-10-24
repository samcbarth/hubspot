/* HubSpot Field Notes - site behavior. No dependencies. */
(function () {
  'use strict';

  var CONFIG = {
    hubspotPortal: '20693956',
    hubspotRegion: 'na1',
    ga4: 'G-D523BX43Q2', // Add a G-XXXXXXX id here to turn on Google Analytics 4.
    forms: {
      newsletter: '66972f44-0848-401e-99db-e238d9837fb7',
      fix: '68745fcd-08d8-4544-8009-b7ca3c45129b'
    },
    meetings: 'https://meetings.hubspot.com/sam-barth/meeting-with-sam',
    votesUrl: 'https://script.google.com/macros/s/AKfycbxDBkDGUwhzBF0556X97OuiBb29hfzDN-VMm5VoUvSbRts_za_orLbykiE5ztpwRnQP/exec'
  };
  window.FIELD_NOTES_CONFIG = CONFIG;

  var root = document.documentElement;
  var base = root.getAttribute('data-base') || '';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------- Theme (per-viewer preference only) ---------- */
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  var toggle = $('.theme-toggle');
  function paintToggle() {
    if (!toggle) return;
    var dark = currentTheme() === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  }
  if (toggle) {
    paintToggle();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('hfn-theme', next);
      paintToggle();
    });
  }

  /* ---------- Analytics ---------- */
  if (CONFIG.ga4) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.ga4);
  }
  function track(name, params) {
    if (window.gtag) window.gtag('event', name, params || {});
  }

  /* ---------- Article cards ---------- */
  var ARTICLES = (window.ARTICLES || []).filter(function (a) { return !a.draft; });

  function cardHTML(a) {
    var hubs = (a.hubs || []).slice(0, 2).map(function (h) { return '<span class="badge">' + esc(h) + '</span>'; }).join('');
    return '<a class="card" href="' + base + 'articles/' + esc(a.slug) + '/">' +
      '<div class="badges"><span class="badge badge-type">' + (a.type === 'tip' ? 'Quick tip' : 'Guide') + '</span>' +
      '<span class="badge badge-problem">' + esc(a.problem) + '</span>' + hubs + '</div>' +
      '<h3>' + esc(a.title) + '</h3><p>' + esc(a.excerpt) + '</p>' +
      '<div class="card-meta"><span>' + esc(a.minutes) + ' min</span><span>' + esc(a.difficulty) + '</span><span>' + (a.validated ? 'Validated ' + esc(a.validated) : 'Verified ' + esc(a.verified)) + '</span></div></a>';
  }

  /* ---------- Home: search + filters ---------- */
  var cardsEl = $('#cards');
  if (cardsEl && $('#search')) {
    var search = $('#search'), fHub = $('#f-hub'), fFeature = $('#f-feature'), fProblem = $('#f-problem'), countEl = $('#result-count');

    function fill(select, values) {
      values.sort().forEach(function (v) {
        var o = document.createElement('option'); o.value = v; o.textContent = v; select.appendChild(o);
      });
    }
    function uniq(key) {
      var seen = {};
      ARTICLES.forEach(function (a) { [].concat(a[key] || []).forEach(function (v) { seen[v] = 1; }); });
      return Object.keys(seen);
    }
    fill(fHub, uniq('hubs'));
    fill(fFeature, uniq('features'));
    fill(fProblem, uniq('problem'));

    var params = new URLSearchParams(location.search);
    if (params.get('q')) search.value = params.get('q');
    if (params.get('hub')) fHub.value = params.get('hub');
    if (params.get('feature')) fFeature.value = params.get('feature');
    if (params.get('problem')) fProblem.value = params.get('problem');

    function haystack(a) {
      return [a.title, a.excerpt, a.problem, a.tier, (a.hubs || []).join(' '), (a.features || []).join(' '), (a.keywords || []).join(' ')].join(' ').toLowerCase();
    }
    function render() {
      var terms = search.value.toLowerCase().split(/\s+/).filter(Boolean);
      var list = ARTICLES.filter(function (a) {
        if (fHub.value && (a.hubs || []).indexOf(fHub.value) < 0) return false;
        if (fFeature.value && (a.features || []).indexOf(fFeature.value) < 0) return false;
        if (fProblem.value && a.problem !== fProblem.value) return false;
        var h = haystack(a);
        return terms.every(function (t) { return h.indexOf(t) >= 0; });
      });
      cardsEl.innerHTML = list.length ? list.map(cardHTML).join('') : !ARTICLES.length ? '<p class="empty">The first field notes are publishing now. <a href="' + base + 'request-a-fix.html">Request a fix</a> to get yours on the list.</p>' : '<p class="empty">Nothing matches yet. <a href="' + base + 'request-a-fix.html">Request this fix</a> and I will write it up.</p>';
      countEl.textContent = list.length + (list.length === 1 ? ' article' : ' articles');
      var q = new URLSearchParams();
      if (search.value) q.set('q', search.value);
      if (fHub.value) q.set('hub', fHub.value);
      if (fFeature.value) q.set('feature', fFeature.value);
      if (fProblem.value) q.set('problem', fProblem.value);
      var qs = q.toString();
      history.replaceState(null, '', qs ? '?' + qs : location.pathname);
    }
    [search, fHub, fFeature, fProblem].forEach(function (el) { el.addEventListener('input', render); });
    render();
  }

  /* ---------- Article page ---------- */
  var prose = $('.prose');
  var slug = document.body.getAttribute('data-slug');

  // Table of contents
  var tocEl = $('[data-toc]');
  if (prose && tocEl) {
    var heads = $$('h2', prose).filter(function (h) { return !h.closest('.tldr'); });
    if (heads.length > 1) {
      var html = '<h2>On this page</h2><ol>';
      heads.forEach(function (h) {
        if (!h.id) h.id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        html += '<li><a href="#' + h.id + '">' + esc(h.textContent) + '</a></li>';
      });
      tocEl.innerHTML = html + '</ol>';
      var links = $$('a', tocEl);
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
          });
        }, { rootMargin: '-15% 0px -75% 0px' });
        heads.forEach(function (h) { io.observe(h); });
      }
    }
  }

  // Copy buttons on code blocks
  $$('.code').forEach(function (block) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn'; btn.type = 'button'; btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var text = $('pre', block).innerText;
      var done = function () {
        btn.textContent = 'Copied'; btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
    block.appendChild(btn);
  });

  // Lightbox for screenshots
  var shots = $$('.shot a');
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button><img alt="">';
    document.body.appendChild(lb);
    var lbImg = $('img', lb);
    var close = function () { lb.classList.remove('open'); lbImg.src = ''; };
    shots.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lbImg.src = a.getAttribute('href');
        lbImg.alt = ($('img', a) || {}).alt || '';
        lb.classList.add('open');
        $('.lightbox-close', lb).focus();
      });
    });
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- HubSpot deep links (client-side only, never stored) ---------- */
  var PORTAL_RE = /^\d{3,12}$/;
  function cleanPortal(v) {
    v = String(v || '').trim();
    var m = v.match(/app(?:-[a-z0-9]+)?\.hubspot\.com\/[a-z-]+\/(\d{3,12})/i); // accept a pasted HubSpot URL
    if (m) return m[1];
    return v.replace(/\D/g, '');
  }
  function hostFor(region) { return region === 'eu1' ? 'https://app-eu1.hubspot.com' : 'https://app.hubspot.com'; }
  function specificUrl(path, portal, region) { return hostFor(region) + path.replace('{portalId}', portal); }
  function genericUrl(path) { return 'https://app.hubspot.com/l' + path.replace('/{portalId}', ''); }
  window.FieldNotesLinks = { cleanPortal: cleanPortal, specificUrl: specificUrl, genericUrl: genericUrl, PORTAL_RE: PORTAL_RE };

  var portalBox = $('[data-portal-box]');
  var hsLinks = $$('a.hs-link[data-hs]');
  if (portalBox && hsLinks.length) {
    hsLinks.forEach(function (a) {
      if (!a.getAttribute('href')) a.setAttribute('href', genericUrl(a.getAttribute('data-hs')));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
    portalBox.classList.add('portal-box');
    portalBox.innerHTML =
      '<label for="portal-id">Open these links in your own HubSpot portal</label>' +
      '<p>Paste your portal ID (the number in your HubSpot URL) or any HubSpot URL. It stays in this tab and is not saved or sent anywhere.</p>' +
      '<div class="portal-row"><input id="portal-id" inputmode="numeric" autocomplete="off" placeholder="e.g. 12345678 or a HubSpot URL">' +
      '<select id="portal-region" aria-label="Data center"><option value="na1">US data center</option><option value="eu1">EU data center</option></select></div>' +
      '<div class="portal-status" id="portal-status" aria-live="polite">Links open your default HubSpot portal until you add an ID.</div>';
    var input = $('#portal-id'), region = $('#portal-region'), status = $('#portal-status');
    var apply = function () {
      var id = cleanPortal(input.value);
      var ok = PORTAL_RE.test(id);
      hsLinks.forEach(function (a) {
        var path = a.getAttribute('data-hs');
        a.href = ok ? specificUrl(path, id, region.value) : genericUrl(path);
      });
      if (!input.value) { status.className = 'portal-status'; status.textContent = 'Links open your default HubSpot portal until you add an ID.'; }
      else if (ok) { status.className = 'portal-status ok'; status.textContent = hsLinks.length + ' links now open portal ' + id + '.'; }
      else { status.className = 'portal-status bad'; status.textContent = 'That does not look like a portal ID. It is the 3 to 12 digit number in your HubSpot URL.'; }
    };
    input.addEventListener('input', apply);
    region.addEventListener('change', apply);
  }

  /* ---------- Was this helpful? ---------- */
  var vote = $('[data-vote]');
  if (vote && slug) {
    var voted = store('hfn-vote-' + slug);
    vote.innerHTML = '<p>Was this helpful?</p><button type="button" data-v="yes">Yes</button><button type="button" data-v="no">No</button><span class="thanks" aria-live="polite"></span>';
    var thanks = $('.thanks', vote);
    var lock = function (v) {
      $$('button', vote).forEach(function (b) { b.disabled = true; });
      thanks.innerHTML = v === 'yes'
        ? 'Thanks. That tells me what to write more of.'
        : 'Thanks. <a href="' + base + 'request-a-fix.html?from=' + encodeURIComponent(slug) + '">Tell me what is still broken</a>.';
    };
    if (voted) lock(voted);
    $$('button', vote).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-v');
        store('hfn-vote-' + slug, v);
        lock(v);
        track('article_vote', { slug: slug, vote: v });
        fetch(CONFIG.votesUrl + '?action=like&id=' + encodeURIComponent('hfn:' + slug + ':' + v)).catch(function () {});
      });
    });
  }

  /* ---------- Related articles ---------- */
  var relEl = $('[data-related]');
  if (relEl && slug) {
    var me = ARTICLES.filter(function (a) { return a.slug === slug; })[0];
    if (me) {
      var scored = ARTICLES.filter(function (a) { return a.slug !== slug; }).map(function (a) {
        var s = 0;
        (a.features || []).forEach(function (f) { if ((me.features || []).indexOf(f) >= 0) s += 3; });
        (a.hubs || []).forEach(function (h) { if ((me.hubs || []).indexOf(h) >= 0) s += 1; });
        if ((me.related || []).indexOf(a.slug) >= 0) s += 10;
        return { a: a, s: s };
      }).filter(function (x) { return x.s > 0; }).sort(function (x, y) { return y.s - x.s; }).slice(0, 3);
      if (scored.length) {
        relEl.innerHTML = '<h2>Related field notes</h2><div class="cards">' + scored.map(function (x) { return cardHTML(x.a); }).join('') + '</div>';
      }
    }
  }

  /* ---------- Booking CTAs (one free meetings link, UTM-tagged per placement) ---------- */
  var page = slug || (location.pathname.split('/').pop().replace(/\.html$/, '') || 'home');
  var isBookPage = page === 'book';
  function meetUrl(medium, content) {
    return CONFIG.meetings + '?utm_source=fieldnotes&utm_campaign=free-call&utm_medium=' +
      encodeURIComponent(medium) + '&utm_content=' + encodeURIComponent(content || page);
  }
  function bookLink(cls, medium, content, label) {
    return '<a class="' + cls + '" data-book="' + esc(medium) + '|' + esc(content || page) + '" href="' + esc(meetUrl(medium, content)) + '">' + esc(label) + '</a>';
  }
  $$('[data-meetings]').forEach(function (a) {
    var medium = a.getAttribute('data-meetings') || 'inline-link';
    a.href = meetUrl(medium, page);
    a.setAttribute('data-book', medium + '|' + page);
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-book]');
    if (!a) return;
    var p = a.getAttribute('data-book').split('|');
    track('book_click', { placement: p[0], content: p[1], page: page });
  });

  var me0 = slug && ARTICLES.filter(function (a) { return a.slug === slug; })[0];
  var TOPICS = [
    { key: 'workflows', f: ['Workflows', 'Approvals'], h: 'Workflow still not behaving?', fix: 'Fix my workflow', plan: 'Plan an automation' },
    { key: 'email', f: ['Email', 'Forms', 'Campaigns', 'Segments', 'Subscriptions', 'Deliverability', 'Marketing events', 'Ads', 'Social', 'SMS', 'Lead capture', 'CTAs', 'Marketing contacts', 'Consent'], h: 'Email or form still giving you trouble?', fix: 'Fix my email setup', plan: 'Plan a campaign setup' },
    { key: 'data', f: ['Properties', 'Records', 'Imports', 'Import', 'Associations', 'Duplicates', 'Data quality', 'Contacts', 'Companies', 'Custom objects', 'Lifecycle stages', 'Lifecycle', 'Export', 'Data', 'Data model', 'Objects', 'Views', 'Data enrichment', 'Ownership', 'Owners'], h: 'CRM data still messy?', fix: 'Fix my data problem', plan: 'Plan a data cleanup' },
    { key: 'sales', f: ['Deals', 'Pipelines', 'Sequences', 'Meetings', 'Calling', 'Calls', 'Tasks', 'Quotes', 'Leads', 'Lead scoring', 'Sales extension', 'Prospecting', 'Sales workspace', 'Products', 'Line items', 'Snippets'], h: 'Sales setup still not working?', fix: 'Fix my sales setup', plan: 'Plan a pipeline build' },
    { key: 'service', f: ['Help desk', 'Inbox', 'Tickets', 'Chat', 'Chatflows', 'Knowledge base', 'Surveys', 'Connected inbox', 'SLA', 'Customer success', 'Bots', 'Support portal', 'Routing'], h: 'Service setup still stuck?', fix: 'Fix my help desk', plan: 'Plan a service setup' },
    { key: 'build', f: ['Pages', 'Website', 'Domains', 'Themes', 'Templates', 'Design Manager', 'Design manager', 'API', 'Integrations', 'Salesforce', 'Blog', 'HubL', 'Modules', 'Developer', 'Tracking code', 'Landing pages', 'Data sync', 'Apps', 'Sandboxes', 'Projects', 'Multi-language', 'WordPress', 'Shopify', 'NetSuite', 'QuickBooks', 'Dynamics 365'], h: 'Site or integration still broken?', fix: 'Fix my site or integration', plan: 'Scope a build' }
  ];
  var HUB_TOPIC = { 'Developer': 'build', 'Content Hub': 'build', 'Service Hub': 'service', 'Sales Hub': 'sales', 'Marketing Hub': 'email', 'Data Hub': 'data', 'Smart CRM': 'data' };
  var GENERIC = { key: 'general', h: 'Still stuck?', fix: 'Fix this with Sam', plan: 'Plan something bigger' };
  function topicFor(a) {
    if (!a) return GENERIC;
    var feats = a.features || [];
    for (var i = 0; i < feats.length; i++) {
      for (var j = 0; j < TOPICS.length; j++) if (TOPICS[j].f.indexOf(feats[i]) >= 0) return TOPICS[j];
    }
    var hubs = a.hubs || [];
    for (var k = 0; k < hubs.length; k++) {
      var key = HUB_TOPIC[hubs[k]];
      if (key) return TOPICS.filter(function (t) { return t.key === key; })[0];
    }
    return GENERIC;
  }
  var FREE_SUB = 'Free 15 or 30 minute call, in your portal.';

  // Article end card: topic heading, "broken now" + "planning" buttons
  if (slug) {
    var endCard = $$('.cta-band .cta-card').filter(function (c) { return $('[data-meetings]', c); })[0];
    if (endCard) {
      var t = topicFor(me0);
      endCard.classList.add('book-card');
      endCard.innerHTML = '<h3>' + esc(t.h) + '</h3><p>' + FREE_SUB + '</p><div class="book-actions">' +
        bookLink('btn btn-primary', 'end-card', t.key + '-fix', t.fix) +
        bookLink('btn btn-ghost', 'end-card', t.key + '-plan', t.plan) + '</div>';
    }
  }

  // Mid-article nudge on troubleshooting articles, at the end of the first section
  if (prose && me0 && (me0.problem === 'Fix it' || me0.problem === 'Gotcha')) {
    var h2s = $$('h2', prose).filter(function (h) { return !h.closest('.tldr'); });
    if (h2s.length > 1 && !/^sources$/i.test(h2s[1].textContent.trim())) {
      var nudge = document.createElement('p');
      nudge.className = 'book-nudge';
      nudge.innerHTML = 'Not your exact setup? ' + bookLink('', 'mid-article', topicFor(me0).key, 'Book a free 15 minutes with Sam') + ' and we\'ll look at yours.';
      prose.insertBefore(nudge, h2s[1]);
    }
  }

  // Drop-down banner and exit popup: never both on one page, each at most once per 7 days
  var WEEK = 7 * 24 * 3600 * 1000;
  function recent(key) { var v = Number(store(key)); return v && Date.now() - v < WEEK; }
  function session(key, val) {
    try { if (val === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, val); } catch (e) { return null; }
  }
  var promoShown = false;

  if (!isBookPage && !recent('hfn-book-banner') && !session('hfn-book-banner')) {
    setTimeout(function () {
      if (promoShown) return;
      promoShown = true;
      session('hfn-book-banner', '1');
      var bar = document.createElement('div');
      bar.className = 'book-banner';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Book a free call');
      bar.innerHTML = '<p>Stuck on something in HubSpot? Book a free 15 or 30 minute call with Sam.</p>' +
        bookLink('btn btn-primary', 'banner', page, 'Book a free call') +
        '<button class="book-x" type="button" aria-label="Dismiss">&times;</button>';
      var hdr = $('.site-header');
      if (hdr) bar.style.top = hdr.offsetHeight + 'px';
      document.body.appendChild(bar);
      void bar.offsetHeight; // commit the hidden position so the drop-in transition runs
      bar.classList.add('show');
      $('.book-x', bar).addEventListener('click', function () {
        store('hfn-book-banner', String(Date.now()));
        bar.classList.remove('show');
        setTimeout(function () { bar.remove(); }, 400);
      });
      track('book_view', { placement: 'banner', page: page });
    }, 6000);
  }

  var desktop = window.matchMedia && window.matchMedia('(pointer: fine) and (min-width: 900px)').matches;
  if (!isBookPage && desktop && !recent('hfn-book-exit')) {
    var armedAt = Date.now() + 4000;
    var onLeave = function (e) {
      if (e.relatedTarget || e.clientY > 0 || Date.now() < armedAt || promoShown) return;
      document.removeEventListener('mouseout', onLeave);
      promoShown = true;
      store('hfn-book-exit', String(Date.now()));
      var pop = document.createElement('div');
      pop.className = 'book-modal';
      pop.innerHTML = '<div class="book-dialog" role="dialog" aria-modal="true" aria-labelledby="book-modal-h">' +
        '<h2 id="book-modal-h">Before you go</h2>' +
        '<p>Didn\'t find your answer? Bring your question to a free 15 or 30 minute call and we\'ll answer it in your portal.</p>' +
        '<div class="book-actions">' + bookLink('btn btn-primary', 'exit-popup', page, 'Book a free call') +
        '<button class="btn btn-ghost" type="button" data-close>No thanks</button></div></div>';
      document.body.appendChild(pop);
      var shut = function () { pop.remove(); document.removeEventListener('keydown', esc1); };
      var esc1 = function (ev) { if (ev.key === 'Escape') shut(); };
      pop.addEventListener('click', function (ev) { if (ev.target === pop || ev.target.hasAttribute('data-close')) shut(); });
      document.addEventListener('keydown', esc1);
      $('.btn-primary', pop).focus();
      track('book_view', { placement: 'exit-popup', page: page });
    };
    document.addEventListener('mouseout', onLeave);
  }

  // /book page role picker: reorders the meeting types
  var picker = $('[data-book-picker]');
  if (picker) {
    var ORDER = {
      admin: ['quick-fix', 'audit', 'ongoing', 'scoping'],
      marketer: ['quick-fix', 'scoping', 'audit', 'ongoing'],
      sales: ['audit', 'quick-fix', 'scoping', 'ongoing'],
      developer: ['scoping', 'quick-fix', 'ongoing', 'audit']
    };
    var list = $('[data-book-types]');
    var role = 'any';
    var paint = function () {
      var order = ORDER[role] || ['quick-fix', 'audit', 'scoping', 'ongoing'];
      order.forEach(function (type) {
        var card = $('[data-type="' + type + '"]', list);
        var a = $('a', card);
        a.href = meetUrl('book-page', role + '-' + type);
        a.setAttribute('data-book', 'book-page|' + role + '-' + type);
        list.appendChild(card);
      });
      $$('button', picker).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-role') === role)); });
    };
    $$('button', picker).forEach(function (b) {
      b.addEventListener('click', function () {
        role = role === b.getAttribute('data-role') ? 'any' : b.getAttribute('data-role');
        paint();
        track('book_role', { role: role });
      });
    });
    paint();
  }

  /* ---------- HubSpot forms ---------- */

  var formSlots = $$('[data-hs-form]');
  if (formSlots.length) {
    var s = document.createElement('script');
    s.src = 'https://js.hsforms.net/forms/embed/v2.js';
    s.async = true;
    s.onload = function () {
      formSlots.forEach(function (slot, i) {
        if (!slot.id) slot.id = 'hs-form-' + i;
        window.hbspt.forms.create({
          region: CONFIG.hubspotRegion,
          portalId: CONFIG.hubspotPortal,
          formId: CONFIG.forms[slot.getAttribute('data-hs-form')],
          target: '#' + slot.id
        });
      });
    };
    s.onerror = function () {
      formSlots.forEach(function (slot) {
        slot.innerHTML = '<p class="form-fallback">The form did not load (an ad blocker can do this). <a href="' + CONFIG.meetings + '">Book a call with Sam</a> instead.</p>';
      });
    };
    document.body.appendChild(s);
  }
})();
