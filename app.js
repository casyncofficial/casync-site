// ============================================================
// CASYNC — shared site behaviour: nav toggle, quote form
// validation + local capture, blog tag filter.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---- quote / lead capture form ---- */
  var form = document.getElementById('quote-form');
  if (form) {
    var success = document.getElementById('quote-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var service = form.querySelector('#f-service');
      var mobile = form.querySelector('#f-mobile');
      var email = form.querySelector('#f-email');

      var serviceErr = document.getElementById('err-service');
      var mobileErr = document.getElementById('err-mobile');
      var emailErr = document.getElementById('err-email');

      [serviceErr, mobileErr, emailErr].forEach(function (el) { if (el) el.classList.remove('show'); });

      if (!service.value.trim() || service.value.trim().length < 10) {
        serviceErr.classList.add('show');
        valid = false;
      }

      var mobilePattern = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
      if (!mobilePattern.test(mobile.value.trim())) {
        mobileErr.classList.add('show');
        valid = false;
      }

      // Email is mandatory — hard block on missing or malformed address.
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        emailErr.classList.add('show');
        valid = false;
      }

      if (!valid) return;

      // Capture the lead locally for this demo build. In production this
      // should POST to your CRM/sheet endpoint (see comment at bottom of
      // this file) instead of — or in addition to — localStorage.
      try {
        var lead = {
          service: service.value.trim(),
          mobile: mobile.value.trim(),
          email: email.value.trim(),
          company: (form.querySelector('#f-company') || {}).value || '',
          callTime: (form.querySelector('#f-calltime') || {}).value || '',
          submittedAt: new Date().toISOString()
        };
        var existing = JSON.parse(localStorage.getItem('casync_leads') || '[]');
        existing.push(lead);
        localStorage.setItem('casync_leads', JSON.stringify(existing));
      } catch (err) {
        console.warn('Lead capture storage failed:', err);
      }

      form.reset();
      if (success) success.classList.add('show');
    });
  }

  /* ---- blog tag filter ---- */
  var tagButtons = document.querySelectorAll('.tag-btn');
  var posts = document.querySelectorAll('.post-card');
  if (tagButtons.length && posts.length) {
    tagButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tagButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var tag = btn.getAttribute('data-tag');
        posts.forEach(function (post) {
          var tags = (post.getAttribute('data-tags') || '').split(',');
          post.style.display = (tag === 'all' || tags.indexOf(tag) !== -1) ? '' : 'none';
        });
      });
    });
  }

});

/* ============================================================
   BACKEND HOOK (to wire up before real launch)
   Replace the localStorage block above with a fetch() call to
   your lead endpoint, e.g.:

     fetch('https://your-crm-or-sheet-endpoint/leads', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(lead)
     });

   Until that's wired up, leads are only stored in the visitor's
   own browser (localStorage) — they will NOT reach you. Open
   this file's TODO before going live with real client traffic.
   ============================================================ */
