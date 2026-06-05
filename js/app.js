/* ============================================================
   Claude × Magic — Onboarding Playbook
   Vanilla JS for: tabbed setup navigation, copy-prompt buttons,
   help router, smooth-scroll anchor links.

   State, progress, gating, and the model picker live in js/ui.js
   (single source of truth). This file owns no localStorage.
   ============================================================ */

(function () {
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
      who: "Wait, or step down to Sonnet",
      why: "Hit your Opus limit? Wait for the reset, or switch to Sonnet for the rest of the task — don't drop to Haiku for client work. Learn to manage your tokens for urgent tasks.",
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
  if (select) {
    select.addEventListener("change", updateRouter);
    updateRouter();
  }

  /* ---------- smooth scroll for in-page anchor links ---------- */
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
})();
