/* =========================================================
   Voiceover — section narration playback
   ---------------------------------------------------------
   A single controller drives every voiceover button on the
   page. Markup stays declarative: any
     <button class="voiceover-btn" data-voiceover-src="…">
   is wired up automatically. To add a section, drop the mp3
   in assets/voice/ and add one button with its src — no JS
   changes needed.

   Behaviour:
   - Only one clip plays at a time. Starting a new one (or
     re-clicking the active one) stops whatever is playing.
   - Buttons toggle between a "play" and "stop" state with a
     visible indicator of what is currently playing.
   - Missing/unreachable audio is handled gracefully: the
     button is disabled (and a warning logged) rather than
     throwing.
   - Real <button>s, aria-pressed + aria-label, fully
     keyboard operable (Enter / Space come for free).
   ========================================================= */
(function () {
  'use strict';

  var current = null; // { audio, btn }

  function setState(btn, playing) {
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');

    var label = btn.dataset.voiceoverLabel || 'this section';
    btn.setAttribute('aria-label',
      (playing ? 'Stop' : 'Play') + ' voiceover for ' + label);
  }

  function stopCurrent() {
    if (!current) return;
    try {
      current.audio.pause();
      current.audio.currentTime = 0;
    } catch (e) { /* ignore */ }
    setState(current.btn, false);
    current = null;
  }

  function disable(btn, reason) {
    btn.disabled = true;
    btn.classList.add('is-unavailable');
    btn.setAttribute('aria-label', 'Voiceover unavailable for ' +
      (btn.dataset.voiceoverLabel || 'this section'));
    console.warn('[voiceover] disabled button —', reason, btn.dataset.voiceoverSrc || '');
  }

  function play(btn, audio) {
    stopCurrent();
    current = { audio: audio, btn: btn };
    setState(btn, true);
    var p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function (err) {
        console.warn('[voiceover] playback failed —', err);
        stopCurrent();
      });
    }
  }

  function initButton(btn) {
    var src = btn.dataset.voiceoverSrc;
    if (!src) { disable(btn, 'no data-voiceover-src'); return; }

    // Encode the path so filenames with spaces (e.g. "00 - intro.mp3") load.
    var url = encodeURI(src);

    var audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = false; // play once per click; user re-clicks to replay

    audio.addEventListener('ended', function () {
      if (current && current.audio === audio) stopCurrent();
    });
    audio.addEventListener('error', function () {
      // File missing or unplayable — fail gracefully.
      if (current && current.audio === audio) stopCurrent();
      disable(btn, 'audio error (missing or unplayable)');
    });

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      if (current && current.btn === btn) {
        stopCurrent(); // re-click the active button → stop
      } else {
        play(btn, audio);
      }
    });

    // Pre-flight existence check when served over http(s); on
    // file:// (where HEAD isn't reliable) we let the audio
    // 'error' handler catch a missing file at play time.
    if (/^https?:/i.test(location.protocol)) {
      fetch(url, { method: 'HEAD' })
        .then(function (res) {
          if (!res.ok) disable(btn, 'HTTP ' + res.status);
          else audio.src = url;
        })
        .catch(function () {
          // Network/CORS hiccup — keep the button, defer to 'error'.
          audio.src = url;
        });
    } else {
      audio.src = url;
    }
  }

  function init() {
    var btns = document.querySelectorAll('.voiceover-btn[data-voiceover-src]');
    Array.prototype.forEach.call(btns, initButton);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public hook: let other modules (e.g. the Quickstart tab switcher) stop
  // playback so audio never persists across a context change.
  window.Voiceover = window.Voiceover || {};
  window.Voiceover.stop = stopCurrent;
})();
