(function() {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Typewriter reveal for the "Context-rich version" line. Runs once, the
     first time a card is opened. Preserves inline markup (strong/code/em) by
     clearing every text node up front, then refilling them character by
     character across the whole line. */
  function typeLine(pair) {
    var line = pair.querySelector('.prompt-pair__line');
    if (!line || line.dataset.typed) return;
    line.dataset.typed = '1';
    if (reduce) return;            /* show the finished line immediately */

    var walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT, null);
    var nodes = [], total = 0, n;
    while ((n = walker.nextNode())) {
      nodes.push({ node: n, full: n.nodeValue, len: n.nodeValue.length });
      total += n.nodeValue.length;
      n.nodeValue = '';
    }
    if (!total) return;

    line.classList.add('pp-typing');

    function reveal(count) {
      var rem = count;
      for (var i = 0; i < nodes.length; i++) {
        var it = nodes[i];
        if (rem <= 0)            { it.node.nodeValue = ''; }
        else if (rem >= it.len)  { it.node.nodeValue = it.full; rem -= it.len; }
        else                     { it.node.nodeValue = it.full.slice(0, rem); rem = 0; }
      }
    }

    /* Fast: whole line types in ~0.5–1.1s regardless of length. */
    var duration = Math.min(1100, Math.max(500, total * 7));
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      reveal(Math.round(p * total));
      if (p < 1) requestAnimationFrame(frame);
      else line.classList.remove('pp-typing');
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll('.pp-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var pair = toggle.closest('.pp-collapsible');
      var open = pair.classList.toggle('pp-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) typeLine(pair);
    });
    toggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { toggle.click(); e.preventDefault(); }
    });
  });
})();

/* ---- */

/* Model picker: single source — update recommendation + highlight matching row.
   Copy aligns with the page guidance ("Start on Opus"). */
(function() {
  var recs = {
    opus:   { model: 'Opus',   why: 'Your default. Best quality and reasoning for all EA work — research, writing, Cowork, complex tasks. Start here and only step down if rate limits actually stop you.' },
    sonnet: { model: 'Sonnet', why: 'Rate-limit fallback. Switch here only when Opus tells you you\'ve hit your daily limit. Still strong for most tasks, lighter on quota.' },
    haiku:  { model: 'Haiku',  why: 'Bulk data only. High-volume rote tasks — bulk categorization, simple extraction at scale. Almost never the right choice for day-to-day EA work.' }
  };
  var radios  = document.querySelectorAll('input[name="task"]');
  var modelEl = document.getElementById('pickerModel');
  var whyEl   = document.getElementById('pickerWhy');
  if (!radios.length || !modelEl || !whyEl) return;
  function update(val) {
    var rec = recs[val];
    if (rec) { modelEl.textContent = rec.model; whyEl.textContent = rec.why; }
    document.querySelectorAll('.dtable--model tbody tr').forEach(function(r) {
      r.classList.remove('is-selected');
    });
    if (val === 'opus' || val === 'sonnet') {
      var target = document.querySelector('.dtable--model tbody tr[data-model="' + val + '"]');
      if (target) target.classList.add('is-selected');
    }
  }
  radios.forEach(function(r) {
    r.addEventListener('change', function() { update(this.value); });
    if (r.checked) update(r.value);
  });
})();

/* ---- */

/* ToC active-state tracker */
(function() {
  var tocLinks = Array.from(document.querySelectorAll('.toc__item a'));
  if (!tocLinks.length) return;
  var ids = tocLinks.map(function(a) { return a.getAttribute('href').slice(1); });
  function update() {
    var y = window.scrollY + 130, active = null;
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.offsetTop <= y) active = ids[i];
    }
    tocLinks.forEach(function(a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
    });
  }
  window.addEventListener('scroll', update, {passive: true});
  update();
})();

/* Next-button gate: require all checkboxes in active panel */
(function() {
  var btn = document.getElementById('setupNext');
  if (btn) {
    btn.addEventListener('click', function(e) {
      var panel = document.querySelector('.setup-panel.is-active');
      if (!panel) return;
      var boxes = Array.from(panel.querySelectorAll('input[type="checkbox"]'));
      if (!boxes.length) return;
      var allDone = boxes.every(function(b) { return b.checked; });
      if (!allDone) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var msg = document.getElementById('__gate_msg');
        if (!msg) {
          msg = document.createElement('p');
          msg.id = '__gate_msg';
          msg.style.cssText = 'color:var(--claude-orange-dk);font-size:13px;font-weight:600;letter-spacing:.01em;text-align:right;padding:0 48px 16px;margin:0;transition:opacity .3s;';
          msg.textContent = '✓ Complete all items above to continue.';
          document.querySelector('.setup-nav').insertAdjacentElement('afterend', msg);
        }
        msg.style.opacity = '1';
        clearTimeout(msg._t);
        msg._t = setTimeout(function() { msg.style.opacity = '0'; }, 3000);
      }
    }, true);
  }
})();

/* ---- */

/* ============================================================
   ONBOARDING GATE SYSTEM
   ============================================================ */
(function () {
  'use strict';

  var GATE_CHAIN   = ['intro','cowork-intro','need','setup','cowork','prompting','model','safety','learn'];
  var SETUP_TABS   = ['s1','s2','s3','s4','s5'];
  var ALWAYS_OPEN  = ['help','feedback'];
  var STORAGE_KEY  = 'magic-onboarding-v1';
  var SECTION_NAMES = {
    'intro':        "What’s Different",
    'cowork-intro': 'Claude Cowork',
    'need':         'What You Need',
    'setup':        'Setup',
    'cowork':       'Using Cowork',
    'prompting':    'Prompting',
    'model':        'Choosing a Model',
    'safety':       'Safety',
    'learn':        'Learning Resources'
  };

  var LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var CHECK_SVG = '<svg viewBox="0 0 16 16" fill="none" class="btn-check-icon" aria-hidden="true"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ── State ─────────────────────────────────────────────── */
  function loadState() {
    try { var s = JSON.parse(localStorage.getItem(STORAGE_KEY)); return (s && typeof s === 'object') ? s : {}; }
    catch(e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch(e) {}
  }
  function field(s, k, def) { return s[k] || def; }

  /* ── Unlock derivation ──────────────────────────────────── */
  function getUnlocked(state) {
    var completed = field(state, 'completed', []);
    var u = {};
    ALWAYS_OPEN.forEach(function(id) { u[id] = true; });
    u[GATE_CHAIN[0]] = true;
    for (var i = 0; i < GATE_CHAIN.length - 1; i++) {
      if (completed.indexOf(GATE_CHAIN[i]) >= 0) u[GATE_CHAIN[i+1]] = true;
    }
    return u;
  }

  function getUnlockedTabs(state) {
    var tabs = field(state, 'setupTabs', []);
    var u = {}; u[SETUP_TABS[0]] = true;
    for (var i = 0; i < SETUP_TABS.length - 1; i++) {
      if (tabs.indexOf(SETUP_TABS[i]) >= 0) u[SETUP_TABS[i+1]] = true;
    }
    if (tabs.indexOf('s5') >= 0) u['bonus'] = true;
    return u;
  }

  /* ── Overlay ────────────────────────────────────────────── */
  function createOverlay(sectionId) {
    var prevIdx = GATE_CHAIN.indexOf(sectionId) - 1;
    var prevId  = prevIdx >= 0 ? GATE_CHAIN[prevIdx] : null;
    var prevName = prevId ? SECTION_NAMES[prevId] : 'the previous section';
    var div = document.createElement('div');
    div.className = 'gate-overlay';
    div.setAttribute('data-gate-for', sectionId);
    div.innerHTML =
      '<div class="gate-overlay__inner">' +
        LOCK_SVG +
        '<p class="gate-overlay__title">Section locked</p>' +
        '<p class="gate-overlay__msg">Complete <strong>' + prevName + '</strong> to unlock this section.</p>' +
        (prevId ? '<a href="#' + prevId + '" class="gate-overlay__btn">↑ Go to ' + prevName + '</a>' : '') +
      '</div>';
    return div;
  }

  /* ── Apply gating ───────────────────────────────────────── */
  function applyGating(state) {
    var unlocked = getUnlocked(state);

    GATE_CHAIN.forEach(function(sid) {
      var section = document.getElementById(sid);
      if (!section) return;
      var isUnlocked = !!unlocked[sid];
      var existing   = section.querySelector('.gate-overlay');

      if (!isUnlocked) {
        section.classList.add('section--locked');
        if (!existing) section.appendChild(createOverlay(sid));
      } else if (existing) {
        existing.classList.add('gate-overlay--unlocking');
        setTimeout(function() {
          section.classList.remove('section--locked');
          if (existing.parentNode) existing.parentNode.removeChild(existing);
        }, 420);
      } else {
        section.classList.remove('section--locked');
      }
    });

    applyTabGating(state);
    applyNavDim(unlocked);
    syncCompleteBtns(state);
  }

  function applyTabGating(state) {
    var unlockedTabs = getUnlockedTabs(state);
    var doneTabs = field(state, 'setupTabs', []);
    var btns = document.querySelectorAll('.setup-tab[data-tab]');
    btns.forEach(function(btn) {
      var id = btn.getAttribute('data-tab');
      btn.classList.toggle('setup-tab--locked', !unlockedTabs[id]);
      btn.classList.toggle('is-done', doneTabs.indexOf(id) >= 0);
    });
  }

  function applyNavDim(unlocked) {
    /* TOC */
    document.querySelectorAll('.toc__item a[href]').forEach(function(a) {
      var id = a.getAttribute('href').replace('#','');
      var locked = GATE_CHAIN.indexOf(id) >= 0 && !unlocked[id];
      a.classList.toggle('toc-link--locked', locked);
      if (a.parentNode) a.parentNode.classList.toggle('toc-item--locked', locked);
    });
    /* Topbar */
    document.querySelectorAll('.topbar__nav a[href]').forEach(function(a) {
      var id = a.getAttribute('href').replace('#','');
      a.classList.toggle('toc-link--locked', GATE_CHAIN.indexOf(id) >= 0 && !unlocked[id]);
    });
  }

  function syncCompleteBtns(state) {
    var completed = field(state, 'completed', []);
    document.querySelectorAll('.section-complete-btn[data-completes]').forEach(function(btn) {
      if (completed.indexOf(btn.getAttribute('data-completes')) >= 0) markBtnDone(btn);
    });
  }

  function markBtnDone(btn) {
    btn.classList.add('is-done');
    btn.disabled = true;
    btn.innerHTML = CHECK_SVG + ' Completed';
  }

  /* ── Auto-completion checks ──────────────────────────────── */
  function checkNeedDone(state) {
    var completed = field(state, 'completed', []);
    if (completed.indexOf('need') >= 0) return;
    var boxes = field(state, 'checkboxes', {});
    var all = ['need-0','need-1','need-2','need-3','need-4'].every(function(k) { return boxes[k]; });
    if (!all) return;
    state.completed = completed.concat(['need']);
    saveState(state);
    applyGating(state);
    updateProgress(state);
    scrollTo('setup', 550);
  }

  function checkTabDone(state, panelId) {
    var tabs = field(state, 'setupTabs', []);
    var completed = field(state, 'completed', []);
    if (tabs.indexOf(panelId) >= 0) return;
    var panel = document.querySelector('.setup-panel[data-panel="' + panelId + '"]');
    if (!panel) return;
    var boxes = Array.from(panel.querySelectorAll('input[type="checkbox"]'));
    if (!boxes.length || !boxes.every(function(b) { return b.checked; })) return;

    state.setupTabs = tabs.concat([panelId]);
    if (panelId === 's5' && completed.indexOf('setup') < 0) {
      state.completed = completed.concat(['setup']);
      scrollTo('cowork', 700);
    }
    saveState(state);
    applyGating(state);
    updateProgress(state);
  }

  function scrollTo(id, delay) {
    setTimeout(function() {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay || 400);
  }

  /* ── Toast ───────────────────────────────────────────────── */
  function toast(msg) {
    var t = document.getElementById('__gate_toast');
    if (!t) {
      t = document.createElement('div'); t.id = '__gate_toast';
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
        'background:#1a1a2e;color:#fff;font:600 14px/-apple-system,BlinkMacSystemFont,sans-serif;' +
        'padding:12px 28px;border-radius:100px;box-shadow:0 4px 20px rgba(0,0,0,.28);' +
        'z-index:9999;transition:opacity .3s;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(t._t);
    t._t = setTimeout(function() { t.style.opacity = '0'; }, 2600);
  }

  /* ── Init ────────────────────────────────────────────────── */

  /* ── Progress bar ────────────────────────────────────────── */
  var TEXT_GATE_SECTIONS = ['intro','cowork-intro','cowork','prompting','model','safety','learn'];
  /* Computed from the DOM in init() — never hardcode (the page count drifts). */
  var TOTAL_STEPS = 0;

  function computeTotalSteps() {
    var keys = {};
    document.querySelectorAll('[data-cb-key]').forEach(function(cb) {
      keys[cb.getAttribute('data-cb-key')] = true;
    });
    return Object.keys(keys).length + TEXT_GATE_SECTIONS.length;
  }

  function countDone(state) {
    var completed = field(state, 'completed', []);
    var checkboxes = field(state, 'checkboxes', {});
    var doneText = 0;
    TEXT_GATE_SECTIONS.forEach(function(s) { if (completed.indexOf(s) >= 0) doneText++; });
    var doneCb = 0;
    for (var k in checkboxes) { if (checkboxes[k]) doneCb++; }
    return doneText + doneCb;
  }

  function getContinueTarget(state) {
    var completed = field(state, 'completed', []);
    var setupTabs = field(state, 'setupTabs', []);
    /* Walk the gate chain in order — first incomplete unlocked step */
    if (completed.indexOf('intro') < 0)        return '#intro';
    if (completed.indexOf('cowork-intro') < 0)  return '#cowork-intro';
    if (completed.indexOf('need') < 0)          return '#need';
    if (completed.indexOf('setup') < 0) {
      /* Find which setup tab is next */
      for (var i = 0; i < SETUP_TABS.length; i++) {
        if (setupTabs.indexOf(SETUP_TABS[i]) < 0) return '#setup';
      }
    }
    var afterSetup = ['cowork','prompting','model','safety','learn'];
    for (var i = 0; i < afterSetup.length; i++) {
      if (completed.indexOf(afterSetup[i]) < 0) return '#' + afterSetup[i];
    }
    return null; /* all done */
  }

  function updateProgress(state) {
    var target = getContinueTarget(state);
    var total  = TOTAL_STEPS;
    /* When the guide is fully complete, force 100% — countDone() can lag behind
       getContinueTarget() when localStorage was migrated from an older key scheme. */
    var done = !target ? total : countDone(state);
    /* Cap in-progress at 99% so the bar never accidentally rounds to 100%. */
    var pct  = !target ? 100 : Math.min(99, Math.round(done / total * 100));

    var elDone   = document.getElementById('progressDone');
    var elTotal  = document.getElementById('progressTotal');
    var elFill   = document.getElementById('progressFill');
    var elStatus = document.getElementById('progressStatus');
    var elJump   = document.getElementById('progressJump');
    var elReset  = document.getElementById('resetProgress');

    if (elDone)  elDone.textContent  = done;
    if (elTotal) elTotal.textContent = total;
    if (elFill)  elFill.style.width  = pct + '%';
    if (elJump) {
      if (!target) {
        /* 100% complete — turn the link into the certificate hand-off (opens a new tab). */
        elJump.textContent = 'Get your certificate →';
        elJump.setAttribute('href', 'certificate.html');
        elJump.setAttribute('target', '_blank');
        elJump.setAttribute('rel', 'noopener');
        elJump.style.pointerEvents = '';
        elJump.style.opacity = '';
      } else {
        elJump.textContent = done === 0 ? 'Get started →' : 'Continue →';
        elJump.setAttribute('href', target);
        elJump.removeAttribute('target');
        elJump.removeAttribute('rel');
        elJump.style.pointerEvents = '';
        elJump.style.opacity = '';
      }
    }

    if (elStatus) {
      if (!target)       { elStatus.textContent = "You're ready for client work — grab your certificate."; }
      else if (done === 0) { elStatus.textContent = "Start with What’s Different below."; }
      else               { elStatus.textContent = pct + '% complete'; }
    }

    /* Wire reset button once */
    if (elReset && !elReset._gWired) {
      elReset._gWired = true;
      elReset.addEventListener('click', function() {
        if (!confirm('Reset all your progress? This cannot be undone.')) return;
        localStorage.removeItem(STORAGE_KEY);
        document.querySelectorAll('[data-cb-key]').forEach(function(cb) { cb.checked = false; });
        document.querySelectorAll('.section-complete-btn').forEach(function(btn) {
          btn.classList.remove('is-done');
          btn.disabled = false;
          btn.innerHTML = 'Mark as read →';
        });
        var fresh = {};
        saveState(fresh);
        applyGating(fresh);
        updateProgress(fresh);
      });
    }
  }

  function init() {
    TOTAL_STEPS = computeTotalSteps();
    var state = loadState();
    var boxes = field(state, 'checkboxes', {});

    /* Restore checkbox states */
    document.querySelectorAll('[data-cb-key]').forEach(function(cb) {
      if (boxes[cb.getAttribute('data-cb-key')]) cb.checked = true;
    });

    /* Initial gating */
    applyGating(state);
    updateProgress(state);

    /* Checkbox listeners */
    document.querySelectorAll('[data-cb-key]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        var s = loadState();
        if (!s.checkboxes) s.checkboxes = {};
        s.checkboxes[this.getAttribute('data-cb-key')] = this.checked;
        saveState(s);
        var section = this.closest('section');
        if (!section) return;
        if (section.id === 'need') { checkNeedDone(s); }
        else if (section.id === 'setup') {
          var panel = this.closest('.setup-panel');
          if (panel) checkTabDone(s, panel.getAttribute('data-panel'));
        }
        updateProgress(s);
      });
    });

    /* "Mark as Read" button listeners */
    document.querySelectorAll('.section-complete-btn[data-completes]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var sid = this.getAttribute('data-completes');
        var s = loadState();
        if (!s.completed) s.completed = [];
        if (s.completed.indexOf(sid) < 0) { s.completed.push(sid); saveState(s); }
        markBtnDone(this);
        applyGating(s);
        updateProgress(s);
        var nextIdx = GATE_CHAIN.indexOf(sid) + 1;
        if (nextIdx < GATE_CHAIN.length) scrollTo(GATE_CHAIN[nextIdx], 460);
      });
    });

    /* Block clicks on locked setup tabs */
    var setupTabs = document.getElementById('setupTabs');
    if (setupTabs) {
      setupTabs.addEventListener('click', function(e) {
        var btn = e.target.closest('.setup-tab--locked');
        if (btn) {
          e.stopImmediatePropagation();
          e.preventDefault();
          toast('Complete the current step first →');
        }
      }, true);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ── Quickstart tabs: "What you need" / "Interface guide" ── */
(function () {
  function initQuickstartTabs() {
    var wrap = document.getElementById('quickstartTabs');
    if (!wrap) return;
    var tabs   = Array.from(wrap.querySelectorAll('.qs-tab'));
    var panels = Array.from(wrap.querySelectorAll('.qs-panel'));

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-qs');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-qs') === target);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickstartTabs);
  } else {
    initQuickstartTabs();
  }
})();

/* ── Interface guide: screen switcher + pin popup tooltips ── */
(function () {
  function initInterfaceGuide() {
    var ig = document.getElementById('interfaceGuide');
    if (!ig) return;

    var screens = Array.from(ig.querySelectorAll('.ig-screen'));

    /* Screen switcher — each screen carries its own copy of the control, so
       sync the active state across all copies. Switching closes any tooltip. */
    var btns = Array.from(ig.querySelectorAll('.ig-switch__btn'));
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-screen');
        btns.forEach(function (b) {
          var on = b.getAttribute('data-screen') === target;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        screens.forEach(function (s) {
          s.classList.toggle('is-active', s.getAttribute('data-screen') === target);
        });
        closeAll();
      });
    });

    /* One tooltip controller per screen. Each owns its pins, its hidden
       .ig-items data source, and its single .ig-tip element. */
    var controllers = screens.map(function (screen) {
      var shot = screen.querySelector('.ig__shot');
      var tip  = shot && shot.querySelector('.ig-tip');
      var data = screen.querySelector('.ig-items');
      if (!shot || !tip || !data) return { close: function () {} };

      var pins = Array.from(shot.querySelectorAll('.ig-pin'));
      var openPin = null;

      function close() {
        if (!openPin) return;
        tip.classList.remove('is-open', 'is-flash', 'ig-tip--left');
        tip.setAttribute('aria-hidden', 'true');
        openPin.classList.remove('is-selected');
        openPin = null;
      }

      function open(pin) {
        var n = pin.getAttribute('data-pin');
        var src = data.querySelector('.ig-item[data-item="' + n + '"]');
        if (!src) return;

        tip.querySelector('.ig-tip__num').textContent = n;
        tip.querySelector('.ig-tip__title').innerHTML = src.querySelector('.ig-item__title').innerHTML;
        tip.querySelector('.ig-tip__desc').innerHTML  = src.querySelector('.ig-item__desc').innerHTML;

        /* Position: to the right of the pin, flipping left near the edge.
           Pins use translate(-50%,-50%), so offsetLeft/Top is the visual
           centre. Measure the tip while still invisible (visibility:hidden
           keeps layout) before revealing. */
        tip.classList.remove('ig-tip--left');
        var cx = pin.offsetLeft, cy = pin.offsetTop;
        var pinHalf = pin.offsetWidth / 2;
        var gap = 12;
        var tipW = tip.offsetWidth, tipH = tip.offsetHeight;
        var maxX = shot.clientWidth, maxY = shot.clientHeight;

        var left = cx + pinHalf + gap;
        if (left + tipW > maxX - 6) {
          left = cx - pinHalf - gap - tipW;       /* flip to the left */
          tip.classList.add('ig-tip--left');
        }
        var top = Math.max(6, Math.min(cy - tipH / 2, maxY - tipH - 6));
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
        tip.style.setProperty('--arrow-y', (cy - top) + 'px');

        tip.classList.add('is-open');
        tip.setAttribute('aria-hidden', 'false');
        pin.classList.add('is-selected');

        /* blink twice */
        tip.classList.remove('is-flash');
        void tip.offsetWidth;
        tip.classList.add('is-flash');

        openPin = pin;
      }

      pins.forEach(function (pin) {
        pin.addEventListener('click', function (e) {
          e.stopPropagation();           /* don't trip the outside-click close */
          ig.classList.add('is-discovered');  /* retire the attention cues */
          if (openPin === pin) { close(); return; }   /* same pin → toggle off */
          close();
          open(pin);
        });
      });

      /* clicks inside the tooltip shouldn't close it */
      tip.addEventListener('click', function (e) { e.stopPropagation(); });

      return { close: close };
    });

    function closeAll() {
      controllers.forEach(function (c) { c.close(); });
    }

    /* Click anywhere outside an open tooltip/pin → close. Esc also closes. */
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInterfaceGuide);
  } else {
    initInterfaceGuide();
  }
})();

/* ── Demo carousel: tab switching + fullscreen ───────────── */
(function () {
  function initDemoCarousel() {
    var tabs   = document.querySelectorAll('.demo-carousel__tab');
    var panels = document.querySelectorAll('.demo-carousel__panel');

    /* Tab switching */
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-demo');

        /* Pause any playing video in the outgoing panel */
        panels.forEach(function (panel) {
          if (panel.classList.contains('is-active')) {
            var vid = panel.querySelector('video');
            if (vid) vid.pause();
          }
        });

        /* Update tabs */
        tabs.forEach(function (t) {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });

        /* Update panels */
        panels.forEach(function (panel) {
          panel.classList.toggle('is-active', panel.getAttribute('data-demo') === target);
        });
      });
    });

    /* Fullscreen button on the stage */
    var stage = document.querySelector('.demo-carousel__stage');
    if (stage) {
      stage.addEventListener('click', function (e) {
        var btn = e.target.closest('.demo-fullscreen-btn');
        if (!btn) return;
        var activePanel = stage.querySelector('.demo-carousel__panel.is-active');
        if (!activePanel) return;
        var target = activePanel.querySelector('video') || activePanel;
        var req = target.requestFullscreen ||
                  target.webkitRequestFullscreen ||
                  target.mozRequestFullScreen ||
                  target.msRequestFullscreen;
        if (req) req.call(target);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoCarousel);
  } else {
    initDemoCarousel();
  }
})();

/* ── Sync Connectors table width to Skills table width ───── */
(function () {
  function syncConnectorsWidth() {
    var skillsWrap      = document.querySelector('.skills-dtable-wrap:not(.connectors-dtable-wrap)');
    var connectorsWrap  = document.querySelector('.connectors-dtable-wrap');
    if (!skillsWrap || !connectorsWrap) return;
    /* Reset first so we measure the Skills table's natural width */
    connectorsWrap.style.width    = '';
    connectorsWrap.style.maxWidth = '';
    var w = skillsWrap.getBoundingClientRect().width;
    connectorsWrap.style.width    = w + 'px';
    connectorsWrap.style.maxWidth = w + 'px';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncConnectorsWidth);
  } else {
    syncConnectorsWidth();
  }
  window.addEventListener('resize', syncConnectorsWidth);
})();

/* ── ToC proximity show / hide ───────────────────────────── */
(function () {
  function initTocHover() {
    var toc = document.querySelector('.toc');
    if (!toc) return;

    var EDGE_PX   = 80;   /* px from right viewport edge to trigger reveal  */
    var HIDE_MS   = 600;  /* ms to wait before hiding after mouse moves away */
    var hideTimer = null;

    function show() {
      clearTimeout(hideTimer);
      toc.classList.add('toc--peek');
    }

    function scheduleHide() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        toc.classList.remove('toc--peek');
      }, HIDE_MS);
    }

    document.addEventListener('mousemove', function (e) {
      var fromRight = window.innerWidth - e.clientX;
      /* Also treat hovering anywhere over the TOC element as "near" */
      var rect    = toc.getBoundingClientRect();
      var nearToc = e.clientX >= rect.left - 12 &&
                    e.clientX <= rect.right + 12 &&
                    e.clientY >= rect.top  - 12 &&
                    e.clientY <= rect.bottom + 12;

      if (fromRight <= EDGE_PX || nearToc) {
        show();
      } else {
        scheduleHide();
      }
    }, { passive: true });

    /* Hide when the cursor leaves the window */
    document.addEventListener('mouseleave', scheduleHide);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTocHover);
  } else {
    initTocHover();
  }
})();

/* ── Context window — interactive step-by-step diagram ────── */
(function () {
  function initContextWindow() {
    var root = document.getElementById('cwAnim');
    if (!root) return;

    var stage = document.getElementById('cwStage');
    var truncWrap = document.getElementById('cwTrunc');
    var caption = document.getElementById('cwCaption');
    var dotsWrap = document.getElementById('cwDots');
    var meter = document.getElementById('cwMeter');
    var meterPct = document.getElementById('cwMeterPct');
    var btnPlay = document.getElementById('cwPlay');
    var btnPlayIco = document.getElementById('cwPlayIco');
    var btnPrev = document.getElementById('cwPrev');
    var btnNext = document.getElementById('cwNext');

    /* Block types map to the exact diagram palette (see CSS vars). */
    var T = 'terra', D = 'dark', L = 'light';

    /* Data model — one entry per turn, faithful to the original diagram. */
    var TURNS = [
      {
        title: 'Turn 1',
        minPhase: 1,
        input:  { phase: 1, blocks: [['Tools', T], ['User message', T]] },
        output: { phase: 2, blocks: [['Extended thinking', D], ['Text response', L], ['Tool use', L]] }
      },
      {
        title: 'Turn 2',
        minPhase: 3,
        input:  { phase: 3, blocks: [['Tools', T], ['User message', T], ['Extended thinking', D], ['Text response', L], ['Tool use', L], ['Tool result', T]] },
        output: { phase: 4, blocks: [['Text response', L]] }
      },
      {
        title: 'Turn 3',
        minPhase: 5,
        input:  { phase: 5, blocks: [['Tools', T], ['User message', T], ['Text response', L], ['Tool use', L], ['Tool result', T], ['Text response', L], ['User message', T]] },
        output: { phase: 6, blocks: [['Extended thinking', D]] }
      }
    ];

    var CAPTIONS = [
      'Press play to watch the context window fill, turn by turn.',
      '<strong>Turn 1 — Input.</strong> Your available tools and first message enter the window.',
      '<strong>Turn 1 — Output.</strong> Claude thinks, replies, and calls a tool — all of it stays in the window.',
      '<strong>Turn 2 — Input.</strong> Everything from Turn 1 carries forward. Nothing is dropped yet.',
      '<strong>Turn 2 — Output.</strong> A fresh response is generated and stacked on top.',
      '<strong>Turn 3 — Input.</strong> The full history carries forward again, and the window keeps growing.',
      '<strong>Turn 3 — Output.</strong> The reply now reaches the very edge of the context window.',
      '<strong>Limit reached.</strong> The window is full, so the final reply is cut off — no text response due to truncation.'
    ];

    var METER = [0, 12, 26, 48, 58, 84, 94, 100];
    var MAX = 7;

    /* ---- build group DOM ---- */
    function buildGroup(turnIdx, kind, group) {
      var g = document.createElement('div');
      g.className = 'cw-group cw-group--' + kind;
      g.setAttribute('data-phase', group.phase);

      var lbl = document.createElement('span');
      lbl.className = 'cw-group__label';
      lbl.textContent = kind === 'input' ? 'Input' : 'Output';
      g.appendChild(lbl);

      var blocks = document.createElement('div');
      blocks.className = 'cw-group__blocks';
      group.blocks.forEach(function (b, i) {
        var el = document.createElement('div');
        el.className = 'cw-block cw-block--' + b[1];
        el.setAttribute('data-phase', group.phase);
        el.style.setProperty('--i', i);
        el.textContent = b[0];
        blocks.appendChild(el);
      });
      g.appendChild(blocks);
      return g;
    }

    TURNS.forEach(function (turn, idx) {
      var col = document.createElement('div');
      col.className = 'cw-turn';
      col.setAttribute('data-min', turn.minPhase);

      var title = document.createElement('p');
      title.className = 'cw-turn__title';
      title.textContent = turn.title;
      col.appendChild(title);

      col.appendChild(buildGroup(idx, 'input', turn.input));
      col.appendChild(buildGroup(idx, 'output', turn.output));
      stage.appendChild(col);
    });

    /* ---- connector arrows ---- */
    var ARROW_SVG = '<svg viewBox="0 0 30 22" fill="none">' +
      '<line class="cw-arrow__line" x1="2" y1="11" x2="22" y2="11"/>' +
      '<path class="cw-arrow__head" d="M21 6 L30 11 L21 16 Z"/>' +
      '<circle class="cw-arrow__pulse" cx="4" cy="11" r="3"/></svg>';

    var arrowA = document.createElement('div');
    arrowA.className = 'cw-arrow cw-arrow--a';
    arrowA.setAttribute('data-phase', 3);
    arrowA.innerHTML = ARROW_SVG;
    var arrowB = document.createElement('div');
    arrowB.className = 'cw-arrow cw-arrow--b';
    arrowB.setAttribute('data-phase', 5);
    arrowB.innerHTML = ARROW_SVG;
    stage.appendChild(arrowA);
    stage.appendChild(arrowB);

    /* ---- truncation zone ---- */
    var slot = document.createElement('div');
    slot.className = 'cw-trunc-slot';
    var tbox = document.createElement('div');
    tbox.className = 'cw-trunc-box';
    var tlbl = document.createElement('span');
    tlbl.className = 'cw-group__label';
    tlbl.textContent = 'Output';
    var tblk = document.createElement('div');
    tblk.className = 'cw-trunc-block';
    tblk.innerHTML = 'No text response<br>due to truncation';
    tbox.appendChild(tlbl);
    tbox.appendChild(tblk);
    slot.appendChild(tbox);
    truncWrap.appendChild(slot);

    /* ---- dots (steps 1..MAX) ---- */
    var dots = [];
    for (var s = 1; s <= MAX; s++) {
      (function (step) {
        var d = document.createElement('button');
        d.className = 'cw-dot';
        d.type = 'button';
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', 'Step ' + step);
        d.addEventListener('click', function () { stop(); setStep(step); });
        dotsWrap.appendChild(d);
        dots.push(d);
      })(s);
    }

    var allBlocks = Array.prototype.slice.call(stage.querySelectorAll('.cw-block'));
    var allGroups = Array.prototype.slice.call(stage.querySelectorAll('.cw-group'));
    var allTurns = Array.prototype.slice.call(stage.querySelectorAll('.cw-turn'));

    var current = 0;
    var timer = null;

    function setStep(n) {
      n = Math.max(0, Math.min(MAX, n));
      current = n;
      root.setAttribute('data-active', n);

      allBlocks.forEach(function (el) {
        el.classList.toggle('is-in', parseInt(el.getAttribute('data-phase'), 10) <= n);
      });
      allGroups.forEach(function (el) {
        el.classList.toggle('is-on', parseInt(el.getAttribute('data-phase'), 10) <= n);
      });
      allTurns.forEach(function (el) {
        el.classList.toggle('is-on', parseInt(el.getAttribute('data-min'), 10) <= n);
      });

      arrowA.classList.toggle('is-on', n >= 3);
      arrowB.classList.toggle('is-on', n >= 5);

      caption.innerHTML = CAPTIONS[n];
      meter.style.width = METER[n] + '%';
      meterPct.textContent = METER[n] + '%';

      dots.forEach(function (d, i) {
        var step = i + 1;
        d.classList.toggle('is-active', step === n);
        d.classList.toggle('is-done', step < n);
      });

      btnPrev.disabled = n <= 0;
      btnNext.disabled = n >= MAX;
    }

    function setPlayIcon(playing) {
      btnPlayIco.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
      btnPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }

    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
      setPlayIcon(false);
    }

    function tick() {
      if (current >= MAX) { stop(); return; }
      setStep(current + 1);
      timer = setTimeout(tick, current >= MAX ? 0 : 1700);
    }

    function play() {
      if (timer) { stop(); return; }
      if (current >= MAX) setStep(0);
      setPlayIcon(true);
      timer = setTimeout(tick, 650);
    }

    btnPlay.addEventListener('click', play);
    btnPrev.addEventListener('click', function () { stop(); setStep(current - 1); });
    btnNext.addEventListener('click', function () { stop(); setStep(current + 1); });

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setStep(MAX);
      return;
    }

    setStep(0);

    /* auto-play once when scrolled into view */
    var started = false;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true;
            play();
            io.disconnect();
          }
        });
      }, { threshold: 0.35 });
      io.observe(root);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContextWindow);
  } else {
    initContextWindow();
  }
})();

/* ── "How a Cowork task runs" — step-by-step flow animation ─── */
(function () {
  function initDelegateRun() {
    var root = document.getElementById('delegateRun');
    if (!root) return;

    var steps = Array.prototype.slice.call(root.querySelectorAll('.dr-step'));
    var subs = Array.prototype.slice.call(root.querySelectorAll('.dr-sub__item'));
    var replay = document.getElementById('drReplay');
    var MAX = 7;            /* last stop index */
    var timer = null;
    var current = -1;

    function apply() {
      steps.forEach(function (st, i) {
        var s = parseInt(st.getAttribute('data-stop'), 10);
        st.classList.toggle('is-on', current >= s);
        st.classList.toggle('is-active', current === s);
        if (i < steps.length - 1) {
          var nextStop = parseInt(steps[i + 1].getAttribute('data-stop'), 10);
          st.classList.toggle('is-filled', current >= nextStop);
        }
      });
      subs.forEach(function (su) {
        var s = parseInt(su.getAttribute('data-stop'), 10);
        su.classList.toggle('is-on', current >= s);
        su.classList.toggle('is-active', current === s);
      });
    }

    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
    }

    function play() {
      stop();
      current = -1;
      root.classList.remove('is-complete');
      apply();
      var n = 0;
      function advance() {
        current = n;
        apply();
        if (n >= MAX) {
          timer = setTimeout(function () { root.classList.add('is-complete'); }, 1000);
          return;
        }
        n++;
        timer = setTimeout(advance, 1560);
      }
      timer = setTimeout(advance, 1100);
    }

    if (replay) replay.addEventListener('click', play);

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      current = MAX;
      apply();
      root.classList.add('is-complete');
      return;
    }

    apply();

    var started = false;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true;
            play();
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(root);
    } else {
      play();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDelegateRun);
  } else {
    initDelegateRun();
  }

  /* ── Chat vs Cowork — animated comparison ─────────────────────────
     The looping timeline lives in CSS; this just arms the layers to
     hidden and flips on the loop when the diagram scrolls into view.
     Reduced motion is left untouched (CSS shows the finished diagram). */
  function initChatVsCowork() {
    var el = document.getElementById('chatVsCowork');
    if (!el) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    el.classList.add('is-armed');

    function start() { el.classList.add('is-on'); }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { start(); io.disconnect(); }
        });
      }, { threshold: 0.35 });
      io.observe(el);
    } else {
      start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatVsCowork);
  } else {
    initChatVsCowork();
  }

  /* ── Minimize-risks card — brain → bullet arrows ──────────────────
     Arrow geometry is computed from live element positions so it stays
     connected at any width / on reflow; the loop timeline lives in CSS. */
  function initRiskViz() {
    var root = document.getElementById('riskViz');
    var svg = document.getElementById('riskWires');
    if (!root || !svg) return;

    var SVGNS = 'http://www.w3.org/2000/svg';
    var brain = root.querySelector('.risk-viz__brain');
    var bullets = Array.prototype.slice.call(root.querySelectorAll('.rv-bullet'));
    if (!brain || !bullets.length) return;

    svg.innerHTML = '';
    var lines = [];
    var heads = [];
    bullets.forEach(function (b, i) {
      var line = document.createElementNS(SVGNS, 'path');
      line.setAttribute('class', 'rv-arrow rv-anim rv-arrow--' + (i + 1));
      svg.appendChild(line);
      lines.push(line);

      var head = document.createElementNS(SVGNS, 'path');
      head.setAttribute('class', 'rv-head rv-anim rv-head--' + (i + 1));
      /* tip at the origin so it lands exactly on the target point; wings
         trail back along the line. Sized up from the original 9px head. */
      head.setAttribute('d', 'M0 0 L-15 -9 L-15 9 Z');
      svg.appendChild(head);
      heads.push(head);
    });

    function compute() {
      var cr = root.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + cr.width + ' ' + cr.height);
      svg.setAttribute('width', cr.width);
      svg.setAttribute('height', cr.height);

      var br = brain.getBoundingClientRect();
      var bx = br.left + br.width / 2 - cr.left;
      var by = br.top + br.height / 2 - cr.top;

      bullets.forEach(function (b, i) {
        var r = b.getBoundingClientRect();
        var tx = r.left - cr.left - 15;          /* land on the bullet dot, not the text */
        var ty = r.top - cr.top + Math.min(r.height / 2, 13);
        var dx = tx - bx;
        var c1x = bx + dx * 0.45;
        var c1y = by + (ty - by) * 0.06;
        var c2x = tx - Math.min(64, Math.abs(dx) * 0.4);
        var c2y = ty;
        lines[i].setAttribute('d', 'M' + bx + ' ' + by + ' C' + c1x + ' ' + c1y +
          ' ' + c2x + ' ' + c2y + ' ' + tx + ' ' + ty);
        var ang = Math.atan2(ty - c2y, tx - c2x) * 180 / Math.PI;
        heads[i].setAttribute('transform', 'translate(' + tx + ' ' + ty + ') rotate(' + ang + ')');
      });
    }

    compute();
    // re-measure once images/fonts settle and on resize
    window.addEventListener('load', compute);
    setTimeout(compute, 400);
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(compute, 120);
    });

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;          /* CSS shows the static, fully-drawn state */

    root.classList.add('is-armed');

    function start() { compute(); root.classList.add('is-on'); }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { start(); io.disconnect(); }
        });
      }, { threshold: 0.35 });
      io.observe(root);
    } else {
      start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRiskViz);
  } else {
    initRiskViz();
  }

  /* ── Guide lists — staggered reveal on scroll ─────────────────────
     Rows are armed (hidden) then revealed in sequence when each list
     scrolls into view. Reduced motion / no-JS leaves them fully shown. */
  function initGuideReveal() {
    var lists = Array.prototype.slice.call(document.querySelectorAll('[data-guide]'));
    if (!lists.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    lists.forEach(function (l) { l.classList.add('is-armed'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    lists.forEach(function (l) { io.observe(l); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuideReveal);
  } else {
    initGuideReveal();
  }
})();
