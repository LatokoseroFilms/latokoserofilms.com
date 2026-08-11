/* Latokosero Films — site behaviour.
   No dependencies, no build step. Everything degrades to working HTML. */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
   * Brief form endpoint.
   *
   * This MUST be set before launch. Point it at whatever receives the brief
   * — a Formspree/Getform/Basin form, a Google Apps Script web app writing
   * to a sheet, or your own handler. Whatever you pick has to do three
   * things: store the brief, notify the team, and send the confirmation
   * that promises a reply in two working days.
   *
   * Deliberately not a mailto: link. A mailto loses briefs on phones, can't
   * be tracked, and can't send an autoresponder.
   * ------------------------------------------------------------------- */
  var FORM_ENDPOINT = '';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ------------------------------------------------------------- nav */

  var toggle = $('.nav-toggle');
  var navList = $('#primary-nav');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    navList.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------ logo */

  /* Every placement points at one file. If it isn't there, drop the image
     and let the slot's text fallback take over, so the site reads correctly
     before the asset lands and needs no edit afterwards. Checked on load as
     well as on error, because a cached 404 never fires an error event. */
  var wireLogo = function (img) {
    var fail = function () {
      var slot = img.closest('[data-logo-slot]');
      if (slot) slot.classList.add('is-missing');
      img.remove();
    };

    img.addEventListener('error', fail);
    img.addEventListener('load', function () {
      if (img.naturalWidth === 0) fail();
    });
    if (img.complete && img.naturalWidth === 0) fail();
  };

  $$('[data-logo]').forEach(wireLogo);

  // Same treatment for marks added later, e.g. in the player's empty state.
  var logoMark = function (height) {
    var img = document.createElement('img');
    img.className = 'logo-mark';
    img.src = '/assets/logo-mark.svg';
    img.alt = '';
    img.setAttribute('data-logo', '');
    img.width = height;
    img.height = height;
    wireLogo(img);
    return img;
  };

  /* ------------------------------------------------ tile hover loops */

  // Loops are preload="none" so they cost nothing until someone hovers.
  $$('.tile').forEach(function (tile) {
    var loop = $('.tile-loop', tile);
    if (!loop) return;

    var play = function () {
      var p = loop.play();
      if (p && p.catch) p.catch(function () {});
    };
    var stop = function () {
      loop.pause();
      loop.currentTime = 0;
    };

    tile.addEventListener('mouseenter', play);
    tile.addEventListener('focus', play);
    tile.addEventListener('mouseleave', stop);
    tile.addEventListener('blur', stop);
  });

  /* -------------------------------------------- before/after slider */

  $$('[data-compare]').forEach(function (fig) {
    var range = $('.compare-range', fig);
    var clip = $('.compare-before-clip', fig);
    var images = $$('img', fig);

    // If either proof image is missing, say so rather than showing an empty
    // frame. Checked on load because a cached 404 never fires onerror.
    var checkImages = function () {
      var broken = images.some(function (img) {
        return img.complete && img.naturalWidth === 0;
      });
      if (broken) fig.dataset.missing = 'true';
    };

    images.forEach(function (img) {
      img.addEventListener('error', function () { fig.dataset.missing = 'true'; });
      img.addEventListener('load', checkImages);
    });
    checkImages();

    if (!range || !clip) return;
    range.addEventListener('input', function () {
      clip.style.setProperty('--split', range.value + '%');
    });
  });

  /* -------------------------------------------- work page: the player */

  var playlist = $('.theatre-list');
  if (playlist) {
    var frame = $('#player-frame');
    var npTitle = $('#np-title');
    var npMeta = $('#np-meta');
    var npBlurb = $('#np-blurb');
    var items = $$('.pl-item', playlist);

    /* Builds the player fresh rather than mutating an existing iframe's src:
       reassigning src pushes a history entry, so Back would walk the
       playlist instead of leaving the page. */
    var buildPlayer = function (container, d, autoplay) {
      container.innerHTML = '';

      if (d.youtube) {
        var iframe = document.createElement('iframe');
        iframe.src =
          'https://www.youtube-nocookie.com/embed/' + d.youtube + (autoplay ? '?autoplay=1' : '');
        iframe.title = d.title;
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
        return;
      }

      var empty = document.createElement('div');
      empty.className = 'embed-empty';
      empty.appendChild(logoMark(36));
      var p = document.createElement('p');
      p.textContent = 'This one isn’t online yet — email us and we’ll send a link.';
      empty.appendChild(p);
      container.appendChild(empty);
    };

    var fillText = function (titleEl, metaEl, blurbEl, d) {
      titleEl.innerHTML = '';
      titleEl.appendChild(document.createTextNode(d.title));
      if (d.titleNe) {
        var alt = document.createElement('span');
        alt.className = 'entry-alt';
        alt.textContent = d.titleNe;
        titleEl.appendChild(alt);
      }

      metaEl.textContent = d.meta || '';
      metaEl.hidden = !d.meta;
      blurbEl.textContent = d.blurb || '';
      blurbEl.hidden = !d.blurb;
    };

    var markCurrent = function (item) {
      items.forEach(function (i) {
        if (i === item) i.setAttribute('aria-current', 'true');
        else i.removeAttribute('aria-current');
      });
    };

    /* ------------------------------------------- inline (page) player */

    var select = function (item, autoplay) {
      if (!item) return;
      markCurrent(item);
      fillText(npTitle, npMeta, npBlurb, item.dataset);
      buildPlayer(frame, item.dataset, autoplay);
    };

    /* ------------------------------------------------ expanded viewer */

    var lb = $('#lightbox');
    var lbFrame = lb && $('#lb-frame', lb);
    var lbTitle = lb && $('#lb-title', lb);
    var lbMeta = lb && $('#lb-meta', lb);
    var lbBlurb = lb && $('#lb-blurb', lb);
    var lbCount = lb && $('#lb-count', lb);
    var lbPrev = lb && $('#lb-prev', lb);
    var lbNext = lb && $('#lb-next', lb);
    var lbPanel = lb && $('.lightbox-panel', lb);

    var lbIndex = -1;
    var lastFocused = null;
    var inertTargets = [$('.masthead'), $('#main'), $('.footer')].filter(Boolean);

    // Moved out of the page flow so the rest of the document can be marked
    // inert while it's open without the dialog inheriting it.
    if (lb) document.body.appendChild(lb);

    var isOpen = function () { return lb && !lb.hidden; };

    var showAt = function (index, autoplay) {
      if (index < 0 || index >= items.length) return;

      lbIndex = index;
      var item = items[index];

      markCurrent(item);
      fillText(lbTitle, lbMeta, lbBlurb, item.dataset);
      buildPlayer(lbFrame, item.dataset, autoplay);

      // The page behind stays in step, so closing leaves you where you were.
      fillText(npTitle, npMeta, npBlurb, item.dataset);
      buildPlayer(frame, item.dataset, false);

      lbCount.textContent = index + 1 + ' of ' + items.length;
      lbPrev.disabled = index === 0;
      lbNext.disabled = index === items.length - 1;

      history.replaceState(null, '', '#' + item.dataset.slug);
    };

    var openViewer = function (index) {
      if (!lb) return;

      lastFocused = document.activeElement;
      lb.hidden = false;
      document.body.classList.add('is-locked');
      inertTargets.forEach(function (el) { el.setAttribute('inert', ''); });

      showAt(index, true);
      lbPanel.focus();
    };

    var closeViewer = function () {
      if (!isOpen()) return;

      lb.hidden = true;
      document.body.classList.remove('is-locked');
      inertTargets.forEach(function (el) { el.removeAttribute('inert'); });

      // Destroys the iframe, which is what actually stops playback.
      lbFrame.innerHTML = '';

      if (lastFocused && lastFocused.isConnected) lastFocused.focus();
      else if (items[lbIndex]) items[lbIndex].focus();
    };

    var step = function (delta) {
      var next = lbIndex + delta;
      if (next >= 0 && next < items.length) showAt(next, true);
    };

    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target.closest('[data-close]')) closeViewer();
      });
      lbPrev.addEventListener('click', function () { step(-1); });
      lbNext.addEventListener('click', function () { step(1); });

      document.addEventListener('keydown', function (e) {
        if (!isOpen()) return;

        if (e.key === 'Escape') { closeViewer(); return; }
        if (e.key === 'ArrowLeft') { step(-1); return; }
        if (e.key === 'ArrowRight') { step(1); return; }

        if (e.key !== 'Tab') return;

        // Keep focus inside the dialog while it owns the screen.
        var focusable = $$('button:not([disabled]), iframe, [href]', lbPanel);
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = document.activeElement;

        if (e.shiftKey && (active === first || active === lbPanel)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    /* ---------------------------------------------------- playlist ---- */

    playlist.addEventListener('click', function (e) {
      var item = e.target.closest('.pl-item');
      if (!item) return;

      // Let modified clicks on a real YouTube link behave normally.
      if (item.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)) return;

      e.preventDefault();

      if (lb) openViewer(items.indexOf(item));
      else select(item, true);
    });

    // Deep links from the homepage tiles land on a project, but in the page
    // rather than the viewer — arriving straight into a modal is jarring.
    var fromHash = function () {
      if (isOpen()) return;

      var slug = window.location.hash.slice(1);
      if (!slug) return;

      var item = items.filter(function (i) { return i.dataset.slug === slug; })[0];
      if (item) {
        lbIndex = items.indexOf(item);
        select(item, false);
        item.scrollIntoView({ block: 'nearest' });
      }
    };

    fromHash();
    window.addEventListener('hashchange', fromHash);
  }

  /* ------------------------------------------------------ brief form */

  var form = $('#brief-form');
  if (!form) return;

  var errorBox = $('#form-error');
  var confirmation = $('#brief-confirmation');
  var submitBtn = $('button[type="submit"]', form);

  var showError = function (msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.hidden = false;
  };

  var clearFieldMessages = function () {
    $$('.field-message', form).forEach(function (el) { el.remove(); });
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (errorBox) errorBox.hidden = true;
  };

  // Native validation messages vary wildly across browsers and none of them
  // explain why the budget band matters, so we write our own.
  var validate = function () {
    var problems = [];

    $$('[required]', form).forEach(function (input) {
      var ok = input.value.trim() !== '';
      if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

      if (!ok) {
        input.setAttribute('aria-invalid', 'true');
        var msg = document.createElement('p');
        msg.className = 'field-message';
        msg.textContent =
          input.id === 'budget'
            ? 'Pick a band, even a rough one — “not sure yet” is a valid answer.'
            : input.type === 'email'
              ? 'We need an email address we can reply to.'
              : 'This one’s required.';
        input.parentNode.appendChild(msg);
        problems.push(input);
      }
    });

    return problems;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFieldMessages();

    var problems = validate();
    if (problems.length) {
      problems[0].focus();
      return;
    }

    // Honeypot: bots fill every field they find.
    if (form.company_website && form.company_website.value !== '') return;

    if (!FORM_ENDPOINT) {
      showError(
        'The brief form isn’t connected yet. Email hello@latokoserofilms.com and we’ll pick it up from there.'
      );
      return;
    }

    var data = new FormData(form);
    data.delete('company_website');
    data.append('page', window.location.pathname);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);

        form.hidden = true;
        if (confirmation) {
          confirmation.hidden = false;
          confirmation.focus();
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send the brief';
        showError(
          'That didn’t send. Try again, or email hello@latokoserofilms.com and we’ll pick it up from there.'
        );
      });
  });
})();
