// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.navtoggle');
  var links = document.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Ask an Expert form
  var form = document.getElementById('ask-expert-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot spam check — bots fill hidden fields, humans never see this one
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        return; // silently drop likely-bot submissions
      }

      var msg = document.getElementById('form-msg');
      var submitBtn = form.querySelector('button[type="submit"]');
      var endpoint = form.getAttribute('action');

      if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        msg.textContent = 'Form is not connected yet — see setup instructions before this goes live.';
        msg.className = 'form-msg err';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          msg.textContent = 'Thanks — your question has been sent to our expert panel. We reply by email, usually within 2–3 working days.';
          msg.className = 'form-msg ok';
          form.reset();
        } else {
          msg.textContent = 'Something went wrong sending your question. Please try again, or email us directly.';
          msg.className = 'form-msg err';
        }
      }).catch(function () {
        msg.textContent = 'Something went wrong sending your question. Please try again, or email us directly.';
        msg.className = 'form-msg err';
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send my question';
      });
    });
  }
});
