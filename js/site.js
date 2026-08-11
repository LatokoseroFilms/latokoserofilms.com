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

    var select = function (item, autoplay) {
      if (!item) return;

      items.forEach(function (i) {
        if (i === item) i.setAttribute('aria-current', 'true');
        else i.removeAttribute('aria-current');
      });

      var d = item.dataset;

      npTitle.innerHTML = '';
      npTitle.appendChild(document.createTextNode(d.title));
      if (d.titleNe) {
        var alt = document.createElement('span');
        alt.className = 'entry-alt';
        alt.textContent = d.titleNe;
        npTitle.appendChild(alt);
      }

      npMeta.textContent = d.meta || '';
      npMeta.hidden = !d.meta;
      npBlurb.textContent = d.blurb || '';
      npBlurb.hidden = !d.blurb;

      // Rebuilt rather than mutated: swapping an iframe's src leaves the
      // previous video in session history, so Back would walk the playlist
      // instead of leaving the page.
      frame.innerHTML = '';
      if (d.youtube) {
        var iframe = document.createElement('iframe');
        iframe.id = 'player';
        iframe.src =
          'https://www.youtube-nocookie.com/embed/' + d.youtube + (autoplay ? '?autoplay=1' : '');
        iframe.title = d.title;
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        frame.appendChild(iframe);
      } else {
        var empty = document.createElement('div');
        empty.className = 'embed-empty';
        var p = document.createElement('p');
        p.textContent = 'This one isn’t online yet — email us and we’ll send a link.';
        empty.appendChild(p);
        frame.appendChild(empty);
      }
    };

    playlist.addEventListener('click', function (e) {
      var item = e.target.closest('.pl-item');
      if (!item) return;

      // Let modified clicks on a real YouTube link behave normally.
      if (item.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)) return;

      e.preventDefault();
      select(item, true);
      history.replaceState(null, '', '#' + item.dataset.slug);

      // On narrow screens the player sits above the list, so a tap swaps
      // something the user can't see. Bring it back into view when it isn't.
      var rect = frame.getBoundingClientRect();
      var offscreen = rect.bottom < 80 || rect.top > window.innerHeight - 80;
      if (offscreen) frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Deep links from the homepage tiles land on a specific project.
    var fromHash = function () {
      var slug = window.location.hash.slice(1);
      if (!slug) return;

      var item = items.filter(function (i) { return i.dataset.slug === slug; })[0];
      if (item) {
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
