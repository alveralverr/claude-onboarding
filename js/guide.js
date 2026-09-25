/* ==========================================================================
   Onboarding guide v2 behaviour (index.html only; loaded with defer).
   - Progress lives in localStorage "magic-onboarding-v1", shared with v1 so
     returning users keep their ticks: { checkboxes: {key: true}, v2: {...} }.
   - Path = Setup (all checkboxes in #setup) 60% + first task (s5-0) 20%
     + safety check passed 20%. Nothing on the page is ever locked.
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'magic-onboarding-v1';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- State ---------- */
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (s && typeof s === 'object') { s.checkboxes = s.checkboxes || {}; s.v2 = s.v2 || {}; return s; }
    } catch (e) { /* storage blocked or corrupt */ }
    return { checkboxes: {}, v2: {} };
  }
  var state = load();
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------- Checkboxes ---------- */
  var boxes = $$('input[data-cb-key]');
  boxes.forEach(function (cb) {
    cb.checked = !!state.checkboxes[cb.getAttribute('data-cb-key')];
    cb.addEventListener('change', function () {
      var k = cb.getAttribute('data-cb-key');
      if (cb.checked) state.checkboxes[k] = true; else delete state.checkboxes[k];
      save();
      var panel = cb.closest('[data-panel]');
      var wasDone = panel && panel.classList.contains('is-complete');
      refresh();
      if (panel && !wasDone && panel.classList.contains('is-complete')) announcePanelDone(panel);
      if (k === 's5-0' && cb.checked) toast('First task done. One step left: the safety check.');
    });
  });

  /* ---------- Setup tabs ---------- */
  var tabsRoot = $('[data-tabs="setup"]');
  var tabs = tabsRoot ? $$('[role="tab"]', tabsRoot) : [];
  var panels = tabsRoot ? $$('[data-panel]', tabsRoot) : [];
  var prevBtn = tabsRoot && $('[data-tab-prev]', tabsRoot);
  var nextBtn = tabsRoot && $('[data-tab-next]', tabsRoot);
  var countEl = tabsRoot && $('[data-tab-count]', tabsRoot);
  var current = 0;

  function panelKeys(panel) { return $$('input[data-cb-key]', panel).map(function (i) { return i.getAttribute('data-cb-key'); }); }
  function panelComplete(panel) { var k = panelKeys(panel); return k.length > 0 && k.every(function (x) { return state.checkboxes[x]; }); }
  function firstIncompleteTab() {
    for (var i = 0; i < panels.length; i++) if (!panelComplete(panels[i])) return i;
    return -1;
  }
  function selectTab(i, focus) {
    if (!tabs.length) return;
    current = Math.max(0, Math.min(tabs.length - 1, i));
    tabs.forEach(function (t, n) {
      var on = n === current;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p, n) { p.hidden = n !== current; });
    if (focus) tabs[current].focus();
    var rail = tabs[current].parentElement, t = tabs[current]; // horizontal only, never moves the page
    rail.scrollTo({ left: t.offsetLeft - (rail.clientWidth - t.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.textContent = current === tabs.length - 1 ? 'Next: first task' : 'Next';
    if (countEl) countEl.textContent = (current + 1) + ' of ' + tabs.length;
  }
  function announcePanelDone(panel) {
    var i = panels.indexOf(panel);
    var name = $('.tab__l', tabs[i]).textContent;
    if (i < tabs.length - 1) toast(name + ' done. Next: ' + $('.tab__l', tabs[i + 1]).textContent + '.');
    else if (firstIncompleteTab() === -1) toast('Setup complete. Now run your first real task.');
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(current + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab(current - 1, true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs.length - 1, true); }
    });
  });
  function scrollToTabs() { if (tabsRoot) tabsRoot.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
  if (prevBtn) prevBtn.addEventListener('click', function () { selectTab(current - 1); scrollToTabs(); });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    if (current === tabs.length - 1) { location.hash = 'first-task'; return; }
    selectTab(current + 1); scrollToTabs();
  });

  /* ---------- Progress ---------- */
  var setupKeys = [];
  $$('#setup input[data-cb-key]').forEach(function (i) { setupKeys.push(i.getAttribute('data-cb-key')); });

  function status() {
    var setupDone = setupKeys.filter(function (k) { return state.checkboxes[k]; }).length;
    var s = {
      setupDone: setupDone,
      setupTotal: setupKeys.length,
      setup: setupDone === setupKeys.length,
      first: !!state.checkboxes['s5-0'],
      safety: !!state.v2.safety
    };
    s.pct = Math.round((setupDone / Math.max(1, setupKeys.length)) * 60 + (s.first ? 20 : 0) + (s.safety ? 20 : 0));
    s.all = s.setup && s.first && s.safety;
    return s;
  }

  function continueTarget(s) {
    if (!s.setup) return { href: '#setup', label: s.setupDone ? 'Continue setup' : 'Start setup' };
    if (!s.first) return { href: '#first-task', label: 'Run your first task' };
    if (!s.safety) return { href: '#safety', label: 'Take the safety check' };
    return { href: '#ready', label: 'Get your certificate' };
  }

  function refresh() {
    var s = status();
    $$('[data-progress-pct]').forEach(function (el) { el.textContent = s.pct + '%'; });
    $$('[data-progress-fill]').forEach(function (el) { el.style.width = s.pct + '%'; });
    var arc = $('.pill-progress__arc');
    if (arc) arc.style.strokeDashoffset = String(94.25 * (1 - s.pct / 100));

    var steps = { setup: s.setup, first: s.first, safety: s.safety };
    var currentStep = !s.setup ? 'setup' : !s.first ? 'first' : !s.safety ? 'safety' : null;
    Object.keys(steps).forEach(function (k) {
      var li = $('.pstep[data-step="' + k + '"]');
      if (li) { li.classList.toggle('is-done', steps[k]); li.classList.toggle('is-current', k === currentStep); }
      var dot = $('.dot[data-status="' + k + '"]');
      if (dot) { dot.classList.toggle('is-done', steps[k]); dot.classList.toggle('is-part', k === 'setup' && !s.setup && s.setupDone > 0); }
    });
    var metaSetup = $('[data-meta="setup"]');
    if (metaSetup) metaSetup.textContent = s.setup ? 'Done' : s.setupDone ? s.setupDone + ' of ' + s.setupTotal + ' ticked' : '~20 min';
    var metaFirst = $('[data-meta="first"]');
    if (metaFirst) metaFirst.textContent = s.first ? 'Done' : '~10 min';
    var metaSafety = $('[data-meta="safety"]');
    if (metaSafety) metaSafety.textContent = s.safety ? 'Passed' : '~5 min';

    var ready = $('[data-ready]');
    if (ready) {
      ready.classList.toggle('is-ready', s.all);
      var icon = $('.path__lock', ready);
      if (icon) icon.innerHTML = s.all ? '<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' : '<rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />';
      var note = $('[data-ready-note]', ready);
      if (note) note.innerHTML = s.all ? '<a href="certificate.html" target="_blank" rel="noopener">Get your certificate</a>' : 'Finish all three steps first.';
    }
    var readySec = $('#ready');
    if (readySec) readySec.hidden = !s.all;

    var t = continueTarget(s);
    $$('[data-continue]').forEach(function (a) { a.setAttribute('href', t.href); });
    $$('[data-continue-label]').forEach(function (a) { a.textContent = t.label; });

    tabs.forEach(function (tab, i) { tab.classList.toggle('is-done', panelComplete(panels[i])); });
    panels.forEach(function (p) { p.classList.toggle('is-complete', panelComplete(p)); });
  }

  // Continue links jump to the first unfinished setup tab.
  $$('[data-continue], a[href="#setup"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (a.getAttribute('href') !== '#setup') return;
      var i = firstIncompleteTab();
      if (i >= 0) selectTab(i);
    });
  });

  /* ---------- Safety check ---------- */
  var quiz = $('#quiz');
  if (quiz) {
    var qs = $$('.q', quiz);
    var result = $('[data-quiz-result]', quiz);
    var markPassed = function () {
      quiz.classList.add('is-passed');
      qs.forEach(function (q) {
        var r = $('input[value="' + q.getAttribute('data-answer') + '"]', q);
        if (r) r.checked = true;
        q.classList.remove('is-wrong', 'is-missing'); q.classList.add('is-right');
      });
      result.textContent = 'Passed. You know the rules for safe client work.';
      result.className = 'quiz__result is-pass';
    };
    if (state.v2.safety) markPassed();
    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var wrong = 0, missing = 0;
      qs.forEach(function (q) {
        var picked = $('input:checked', q);
        q.classList.remove('is-wrong', 'is-right', 'is-missing');
        if (!picked) { missing++; q.classList.add('is-missing'); return; }
        if (picked.value === q.getAttribute('data-answer')) q.classList.add('is-right');
        else { wrong++; q.classList.add('is-wrong'); }
      });
      if (missing) {
        result.textContent = 'Answer all five questions first.';
        result.className = 'quiz__result is-fail';
        ($('.q.is-missing', quiz) || quiz).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      if (wrong) {
        result.textContent = (5 - wrong) + ' of 5 right. Check the notes above and try again.';
        result.className = 'quiz__result is-fail';
        return;
      }
      state.v2.safety = true; save();
      markPassed(); refresh();
      toast(status().all ? "Path complete. You're ready for client work." : 'Safety check passed.');
      if (status().all) setTimeout(function () { $('#ready').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }, 600);
    });
  }

  /* ---------- Copy buttons ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy');
    if (!btn) return;
    var p = btn.parentElement.querySelector('p');
    copyText(p.textContent.trim()).then(function () {
      btn.textContent = 'Copied'; btn.classList.add('is-copied');
      setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1600);
    }, function () { toast('Copy failed. Select the text and copy it manually.'); });
  });

  /* ---------- YouTube facades (no YouTube requests until clicked) ---------- */
  var PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  function buildYT(el) {
    var id = el.getAttribute('data-yt'), title = el.getAttribute('data-title') || 'Video';
    el.innerHTML = '';
    var img = document.createElement('img');
    img.className = 'yt__img'; img.alt = ''; img.loading = 'lazy';
    img.onerror = function () { img.onerror = null; img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; };
    img.src = 'https://i.ytimg.com/vi/' + id + '/hq720.jpg'; // 16:9, no letterbox
    el.appendChild(img);
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Play video: ' + title);
    b.innerHTML = '<span class="yt__play">' + PLAY_SVG + '</span><span class="yt__t"></span>';
    b.querySelector('.yt__t').textContent = title;
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = title;
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      el.innerHTML = ''; el.appendChild(f);
    });
    el.appendChild(b);
  }
  $$('.yt[data-yt]').forEach(buildYT);

  var demo = $('[data-demo]');
  if (demo) {
    var stage = $('[data-demo-stage]', demo);
    $$('[data-demo-btn]', demo).forEach(function (b, _, all) {
      b.addEventListener('click', function () {
        all.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        var parts = b.getAttribute('data-demo-btn').split('|');
        stage.setAttribute('data-yt', parts[0]); stage.setAttribute('data-title', parts[1]);
        buildYT(stage);
      });
    });
  }

  /* ---------- Click-to-play animations ---------- */
  $$('.gifplay').forEach(function (fig) {
    var img = $('img', fig), poster = img.getAttribute('src');
    function toggle() {
      var playing = fig.classList.toggle('is-playing');
      img.src = playing ? fig.getAttribute('data-gif') : poster;
    }
    $('.gifplay__btn', fig).addEventListener('click', toggle);
    img.addEventListener('click', function () { if (fig.classList.contains('is-playing')) toggle(); });
  });

  /* ---------- Muted demo videos: play only while on screen ---------- */
  var autoVids = $$('video[data-autoplay]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    autoVids.forEach(function (v) { v.controls = true; v.preload = 'metadata'; });
  } else {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () { v.controls = true; }); }
        else v.pause();
      });
    }, { threshold: 0.4 });
    autoVids.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- Voiceover (audio created on first click) ---------- */
  var audio = null, audioBtn = null;
  function stopVO() {
    if (audio) { audio.pause(); audio = null; }
    if (audioBtn) audioBtn.setAttribute('aria-pressed', 'false');
    audioBtn = null;
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.vo[data-vo]');
    if (!btn) return;
    if (btn === audioBtn) { stopVO(); return; }
    stopVO();
    audio = new Audio(btn.getAttribute('data-vo'));
    audioBtn = btn;
    btn.setAttribute('aria-pressed', 'true');
    audio.addEventListener('ended', stopVO);
    audio.addEventListener('error', function () { btn.classList.add('is-error'); stopVO(); toast('Audio unavailable right now.'); });
    var p = audio.play();
    if (p && p.catch) p.catch(function () { stopVO(); });
  });

  /* ---------- Sections sheet ---------- */
  var sheet = $('#sheet'), openBtn = $('[data-menu-open]'), lastFocus = null;
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    $('.sheet__close', sheet).focus();
  }
  function closeSheet(restore) {
    sheet.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restore && lastFocus) lastFocus.focus();
  }
  if (sheet && openBtn) {
    openBtn.addEventListener('click', openSheet);
    $$('[data-menu-close]', sheet).forEach(function (b) { b.addEventListener('click', function () { closeSheet(true); }); });
    $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { closeSheet(false); }); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') closeSheet(true);
      if (e.key === 'Tab') { // keep focus inside the panel
        var f = $$('a, button', sheet).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- Comparison table: one tool at a time on phones ---------- */
  var compare = $('.compare');
  if (compare) {
    $$('[data-focus-btn]', compare).forEach(function (b, _, all) {
      b.addEventListener('click', function () {
        all.forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        compare.setAttribute('data-focus', b.getAttribute('data-focus-btn'));
      });
    });
  }

  /* ---------- Interface tour ---------- */
  var tour = $('[data-tour]');
  if (tour) {
    var screens = $$('[data-screen]', tour);
    $$('[data-screen-btn]', tour).forEach(function (b, _, all) {
      b.addEventListener('click', function () {
        all.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        screens.forEach(function (s) { s.hidden = s.getAttribute('data-screen') !== b.getAttribute('data-screen-btn'); });
        stopVO();
      });
    });
    screens.forEach(function (screen) {
      var tip = $('[data-tip]', screen);
      $$('.pin', screen).forEach(function (pin) {
        pin.setAttribute('aria-label', 'Label ' + pin.textContent + ': show what it does');
        pin.addEventListener('click', function () {
          var n = pin.getAttribute('data-pin');
          var item = $('[data-item="' + n + '"]', screen);
          $$('.pin', screen).forEach(function (p) { p.classList.toggle('is-on', p === pin); });
          $$('[data-item]', screen).forEach(function (li) { li.classList.toggle('is-on', li === item); });
          if (item) tip.innerHTML = '<p><strong>' + n + '.</strong> ' + item.innerHTML + '</p>';
        });
      });
    });
  }

  /* ---------- Connector capabilities ---------- */
  var CONNECTORS = [
    { name: 'Gmail', access: 'rw', cat: 'Google Workspace', logo: 'assets/media/logo-gmail.webp',
      can: ['Search threads and messages', 'Read thread content', 'Create and list draft emails', 'Create and list labels', 'Label or unlabel threads and messages', 'Trash emails (via the TRASH label)'],
      cant: ['Rename or recolor labels', 'Delete labels', 'Send emails directly (drafts only)', 'Permanently delete emails (trash only)', 'Read attachment contents directly'] },
    { name: 'Google Calendar', access: 'rw', cat: 'Google Workspace', logo: 'assets/media/logo-calendar.webp',
      can: ['List calendars and events', 'Get event details', 'Create events', 'Update events', 'Delete events (hard delete)', 'Respond to event invites', 'Suggest available times'],
      cant: ['Create or delete calendars', 'Manage recurring event series (instances only)', 'Set calendar permissions'] },
    { name: 'Google Drive', access: 'rw', cat: 'Google Workspace', logo: 'assets/media/logo-drive.webp',
      can: ['Search and list files', 'Read and download file content', 'Get file metadata and permissions', 'Copy files', 'Create new files (converted to Google Docs)', 'Upload files'],
      cant: ['Delete files', 'Edit or overwrite existing files', 'Move files between folders'] },
    { name: 'Slack', access: 'rw', cat: 'Productivity', logo: 'assets/media/logo-slack.svg',
      can: ['Send and schedule messages', 'Create message drafts', 'Read channels, threads, and files', 'Search public and private channels', 'List channel members and user profiles', 'Create conversations', 'Create, read, and update canvases', 'Add and get reactions', 'Search emojis and users'],
      cant: ['Edit or delete sent messages', 'Upload files', 'Delete channels'] },
    { name: 'Notion', access: 'rw', cat: 'Productivity', logo: 'assets/media/logo-notion.webp',
      can: ['Search pages and databases', 'Create and update pages', 'Create databases and views', 'Duplicate and move pages', 'Create and get comments', 'Get teams and users', 'Fetch page content', 'Update views and data sources'],
      cant: ['Permanently delete pages', 'Upload file attachments', 'Manage workspace permissions'] },
    { name: 'Canva', access: 'interactive', cat: 'Design', logo: 'assets/media/logo-canva.webp',
      can: ['Search, create, copy, and export designs', 'Generate designs with AI', 'Resize and merge designs', 'Import designs from a URL', 'Move designs between folders', 'Manage folders and brand kits', 'Edit design content and elements', 'Upload assets', 'Comment on and reply to designs', 'Publish brand templates'],
      cant: ['Delete designs or files', 'Delete folders'] },
    { name: 'Asana', access: 'rw', cat: 'Project management', logo: 'assets/media/logo-asana.webp',
      can: ['View and search tasks, projects, and goals', 'Create and update tasks with owners and due dates', 'Set task priority and assignees', 'Delete tasks', 'Add comments to tasks', 'Create and update goals and metrics', 'Set task dependencies and parents', 'Add or remove task followers', 'Create projects and project status'],
      cant: ['Delete projects or goals', 'Manage billing or workspace settings'] },
    { name: 'ClickUp', access: 'rw', cat: 'Project management', logo: 'assets/media/logo-clickup.webp',
      can: ['Create, update, and delete tasks', 'Set task priority and details', 'Add tags, links, and dependencies', 'Attach files to tasks', 'Merge and move tasks', 'Create folders, lists, and reminders', 'Create and manage documents and pages', 'Track time on tasks', 'Add comments and send team chat messages'],
      cant: ['Delete spaces or folders', 'Manage billing or workspace-level settings'] },
    { name: 'Fathom', access: 'ro', cat: 'Productivity', logo: 'assets/media/logo-fathom.webp',
      can: ['List and search past meetings', 'Get meeting summaries', 'Get full transcripts', 'Get recordings by URL or call ID', 'Find people', 'List teams and identity'],
      cant: ['Schedule or create meetings', 'Delete meetings or recordings', 'Edit transcripts', 'Any write action (read-only connector)'] },
    { name: 'Microsoft 365', access: 'ro', cat: 'Productivity', logo: 'assets/media/logo-microsoft.webp', note: 'Available on Team and Enterprise plans only.',
      can: ['Search documents across SharePoint and OneDrive', 'Analyze email threads in Outlook', 'Get calendar event insights', 'Review Teams chat conversations', 'Summarize documents and communications'],
      cant: ['Send emails or Teams messages', 'Create or edit documents', 'Create calendar events', 'Any write action (read-only connector)'] }
  ];
  var ACCESS = { rw: 'Read and write', interactive: 'Interactive', ro: 'Read only' };
  var cc = $('[data-cc]');
  if (cc) {
    var grid = $('[data-cc-grid]', cc);
    var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var li = function (a) { return a.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join(''); };
    grid.innerHTML = CONNECTORS.map(function (c) {
      return '<details class="ccard" data-access="' + c.access + '"><summary>' +
        '<span class="ccard__logo"><img src="' + c.logo + '" alt="" width="26" height="26" loading="lazy"></span>' +
        '<span class="ccard__id"><span class="ccard__name">' + esc(c.name) + '</span><span class="ccard__meta">' + esc(c.cat) + ' · ' + c.can.length + ' can, ' + c.cant.length + ' can’t</span></span>' +
        '<span class="badge badge--' + c.access + '">' + ACCESS[c.access] + '</span><span class="ccard__chev" aria-hidden="true"></span></summary>' +
        '<div class="ccard__body">' + (c.note ? '<p class="ccard__note">' + esc(c.note) + '</p>' : '') +
        '<div class="ccard__can"><h4>Can do</h4><ul>' + li(c.can) + '</ul></div>' +
        '<div class="ccard__cant"><h4>Can’t do</h4><ul>' + li(c.cant) + '</ul></div></div></details>';
    }).join('');
    var counts = { all: CONNECTORS.length, rw: 0, interactive: 0, ro: 0 };
    CONNECTORS.forEach(function (c) { counts[c.access]++; });
    $$('[data-count]', cc).forEach(function (el) { el.textContent = counts[el.getAttribute('data-count')]; });
    $$('.fchip', cc).forEach(function (chip, _, all) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-f');
        all.forEach(function (x) { var on = x === chip; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        $$('.ccard', grid).forEach(function (card) { card.hidden = f !== 'all' && card.getAttribute('data-access') !== f; });
      });
    });
  }

  /* ---------- Model picker ---------- */
  var MODELS = {
    opus: { model: 'Opus', why: 'Your default. Best quality and reasoning for all EA work: research, writing, Cowork, and complex tasks. Start here and only step down if limits actually stop you.' },
    sonnet: { model: 'Sonnet', why: 'Your fallback when Opus says you’ve hit your limit. Still strong for most tasks and lighter on quota.' },
    haiku: { model: 'Haiku', why: 'Bulk data only: high-volume rote work such as bulk categorization or simple extraction at scale. Almost never right for day-to-day EA work.' }
  };
  var picker = $('[data-picker]');
  if (picker) {
    var pick = function (v) {
      $('[data-picker-model]', picker).textContent = MODELS[v].model;
      $('[data-picker-why]', picker).textContent = MODELS[v].why;
      $$('.mtable tr[data-model]').forEach(function (tr) { tr.classList.toggle('is-on', tr.getAttribute('data-model') === v); });
    };
    $$('input[name="model"]', picker).forEach(function (r) { r.addEventListener('change', function () { pick(r.value); }); });
    pick('opus');
  }

  /* ---------- Help router ---------- */
  var PRODUCT = 'product-team@getmagicea.com';
  var ROUTES = {
    invite: { who: 'Product Team', why: 'Can’t accept the invite or sign in? Email the Product Team.', email: PRODUCT },
    templates: { who: 'Product Team', why: 'Can’t see Magic templates or skills? It’s usually a permissions issue. Email the Product Team.', email: PRODUCT },
    google: { who: 'Connectors, then your Account Lead', why: 'Check Customize › Connectors in the desktop app first. Still not connecting? Message your Account Lead.' },
    refuse: { who: 'Your Account Lead', why: 'First add more context to your request (see Prompting). Still stuck? Ask your Account Lead.' },
    limit: { who: 'Wait, or switch to Sonnet', why: 'Hit your Opus limit? Wait for the reset, or switch to Sonnet for the rest of the task. Don’t drop to Haiku for client work. Hitting Sonnet limits too? Tell your Account Lead.' },
    general: { who: 'Your Account Lead', why: 'General Claude questions go to your Account Lead first.' },
    tech: { who: 'Product Team', why: 'Technical issues with the desktop app or extension go to the Product Team.', email: PRODUCT }
  };
  var router = $('[data-router]');
  if (router) {
    var who = $('[data-router-who]', router), why = $('[data-router-why]', router), act = $('[data-router-action]', router);
    var route = function (k) {
      var r = ROUTES[k];
      $$('[data-route]', router).forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-route') === k ? 'true' : 'false'); });
      who.textContent = r.who; why.textContent = r.why;
      if (r.email) { act.hidden = false; act.href = 'mailto:' + r.email; act.textContent = 'Email ' + r.email; }
      else act.hidden = true;
    };
    $$('[data-route]', router).forEach(function (b) { b.addEventListener('click', function () { route(b.getAttribute('data-route')); }); });
    route('invite');
  }

  /* ---------- Reset ---------- */
  var reset = $('[data-reset]');
  if (reset) reset.addEventListener('click', function () {
    if (!confirm('Reset your onboarding progress in this browser?')) return;
    state = { checkboxes: {}, v2: {} }; save();
    location.reload();
  });

  /* ---------- Init ---------- */
  var start = firstIncompleteTab();
  selectTab(start < 0 ? 0 : start);
  refresh();
})();
