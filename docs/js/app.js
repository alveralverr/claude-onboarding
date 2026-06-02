/* ============================================================
   Claude × Magic — Onboarding Playbook
   Vanilla JS for: progress persistence, copy-prompt buttons,
   model picker, help router, smooth-scroll progress link.
   ============================================================ */

(function () {
  const STORAGE_KEY = "magic-claude-onboarding-v1";

  /* ---------- state load / save ---------- */
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) {}
  }
  const state = loadState();

  /* ---------- checklist hydrate + persist ---------- */
  const checklistGroups = document.querySelectorAll("[data-step-id]");
  checklistGroups.forEach((group) => {
    const stepId = group.dataset.stepId;
    const checks = group.querySelectorAll('input[type="checkbox"]');
    checks.forEach((cb, i) => {
      const key = `${stepId}::${i}`;
      if (state[key]) cb.checked = true;
      cb.addEventListener("change", () => {
        state[key] = cb.checked;
        saveState(state);
        renderProgress();
      });
    });
  });

  /* ---------- tabbed setup ---------- */
  const tabs = Array.from(document.querySelectorAll(".setup-tab"));
  const panels = Array.from(document.querySelectorAll(".setup-panel"));
  const prevBtn = document.getElementById("setupPrev");
  const nextBtn = document.getElementById("setupNext");

  function activateTab(id, scroll) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === id));
    panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === id));
    const idx = tabs.findIndex((t) => t.dataset.tab === id);
    if (prevBtn) prevBtn.disabled = idx <= 0;
    if (nextBtn) {
      const last = idx >= tabs.length - 1;
      nextBtn.disabled = last;
      nextBtn.querySelector("[data-next-label]") &&
        (nextBtn.querySelector("[data-next-label]").textContent = last ? "Done" : "Next");
    }
    if (scroll) {
      const wrap = document.getElementById("setupTabs");
      if (wrap) {
        const top = wrap.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }
  function currentIdx() {
    return tabs.findIndex((t) => t.classList.contains("is-active"));
  }
  tabs.forEach((t) => t.addEventListener("click", () => activateTab(t.dataset.tab, false)));
  if (prevBtn) prevBtn.addEventListener("click", () => {
    const i = currentIdx(); if (i > 0) activateTab(tabs[i - 1].dataset.tab, true);
  });
  if (nextBtn) nextBtn.addEventListener("click", () => {
    const i = currentIdx(); if (i < tabs.length - 1) activateTab(tabs[i + 1].dataset.tab, true);
  });

  function updateTabsDone() {
    tabs.forEach((t) => {
      const panel = panels.find((p) => p.dataset.panel === t.dataset.tab);
      if (!panel) return;
      const checks = panel.querySelectorAll('input[type="checkbox"]');
      if (checks.length === 0) return;
      const allDone = Array.from(checks).every((c) => c.checked);
      t.classList.toggle("is-done", allDone);
    });
  }

  /* ---------- progress meter ---------- */
  function renderProgress() {
    const allChecks = document.querySelectorAll("[data-step-id] input[type='checkbox']");
    const total = allChecks.length;
    let done = 0;
    allChecks.forEach((cb) => { if (cb.checked) done++; });

    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    document.getElementById("progressDone").textContent = done;
    document.getElementById("progressTotal").textContent = total;
    document.getElementById("progressFill").style.width = pct + "%";

    updateTabsDone();

    const status = document.getElementById("progressStatus");
    const jump = document.getElementById("progressJump");

    if (done === 0) {
      status.textContent = "Start with step one below.";
      jump.textContent = "Jump in →";
      jump.setAttribute("href", "#setup");
      jump.dataset.targetTab = "s1";
    } else if (done === total) {
      status.textContent = "All done. Look at you.";
      jump.textContent = "Open the feedback form →";
      jump.setAttribute("href", "#feedback");
      delete jump.dataset.targetTab;
    } else {
      // find first step with an unchecked box
      const nextStep = findNextUnchecked();
      status.textContent = `${pct}% complete. Pick up where you left off.`;
      if (nextStep) {
        jump.textContent = "Continue →";
        // if the next step lives in a tab panel, route to setup + that tab
        const panel = document.querySelector(`.setup-panel[data-step-id="${nextStep}"]`);
        if (panel) {
          jump.setAttribute("href", "#setup");
          jump.dataset.targetTab = panel.dataset.panel;
        } else {
          jump.setAttribute("href", "#" + nextStep);
          delete jump.dataset.targetTab;
        }
      }
    }
  }

  function findNextUnchecked() {
    const groups = document.querySelectorAll("[data-step-id]");
    for (const g of groups) {
      const checks = g.querySelectorAll('input[type="checkbox"]');
      for (const cb of checks) {
        if (!cb.checked) return g.dataset.stepId;
      }
    }
    return null;
  }

  /* ---------- reset progress ---------- */
  document.getElementById("resetProgress").addEventListener("click", () => {
    if (!confirm("Reset all checkboxes? This only affects this browser.")) return;
    Object.keys(state).forEach((k) => delete state[k]);
    saveState(state);
    document
      .querySelectorAll("[data-step-id] input[type='checkbox']")
      .forEach((cb) => { cb.checked = false; });
    renderProgress();
  });

  /* ---------- copy-prompt buttons ---------- */
  document.querySelectorAll("code.prompt[data-copy]").forEach((el) => {
    el.addEventListener("click", async () => {
      const text = el.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // fallback for non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand("copy"); ta.remove();
      }
      el.classList.add("is-copied");
      setTimeout(() => el.classList.remove("is-copied"), 1500);
    });
  });

  /* ---------- model picker ---------- */
  const MODELS = {
    haiku: {
      name: "Haiku",
      why: "Fast and cheap. Good for quick summaries, short emails, and simple lookups. Don't use it for anything that needs real reasoning.",
    },
    sonnet: {
      name: "Sonnet",
      why: "The default for most EA tasks. Strong reasoning, fast enough, doesn't blow through your daily limit.",
    },
    opus: {
      name: "Opus",
      why: "Reach for it only when you genuinely need it — building a workflow, advanced analysis, multi-step reasoning. Burns through your quota fast on simple stuff.",
    },
  };
  function updatePicker() {
    const picked = document.querySelector('input[name="task"]:checked');
    if (!picked) return;
    const m = MODELS[picked.value];
    document.getElementById("pickerModel").textContent = m.name;
    document.getElementById("pickerWhy").textContent = m.why;
  }
  document
    .querySelectorAll('input[name="task"]')
    .forEach((r) => r.addEventListener("change", updatePicker));
  updatePicker();

  /* ---------- help router ---------- */
  const ROUTES = {
    invite: {
      who: "Product Team",
      why: "Can't accept the invite or sign in? Email the Product Team — product-team@getmagicea.com.",
    },
    templates: {
      who: "Product Team",
      why: "Can't see Magic templates or skills? That's usually a permissions issue. Email the Product Team.",
    },
    google: {
      who: "Connectors, then your AL",
      why: "Google account not connecting? Check Connectors in Settings first, then message your Account Lead.",
    },
    refuse: {
      who: "Your Account Lead",
      why: "Try rephrasing first — see the Prompting section. Still stuck? Ask your AL.",
    },
    limit: {
      who: "Wait or switch model",
      why: "Hit the rate limit? Wait for the reset or switch to Haiku. Learn to manage your tokens for urgent tasks.",
    },
    general: {
      who: "Your Account Lead",
      why: "General Claude questions go to your AL first.",
    },
    tech: {
      who: "Product Team",
      why: "Technical issues with the extension or desktop app go to the Product Team.",
    },
  };
  const select = document.getElementById("routerSelect");
  function updateRouter() {
    const r = ROUTES[select.value];
    if (!r) return;
    document.getElementById("routerWho").textContent = r.who;
    document.getElementById("routerWhy").textContent = r.why;
  }
  select.addEventListener("change", updateRouter);
  updateRouter();

  /* ---------- smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 24;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", "#" + id);
    });
  });

  /* ---------- initial render ---------- */
  // route the hero "continue" link to the right setup tab
  const jumpLink = document.getElementById("progressJump");
  if (jumpLink) {
    jumpLink.addEventListener("click", () => {
      const tt = jumpLink.dataset.targetTab;
      if (tt) setTimeout(() => activateTab(tt, false), 10);
    });
  }
  renderProgress();
})();
