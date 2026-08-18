/* ============================================
   NEXT TEAM — Hire Modal (modal.js)
   Öppnas via .hire-btn på alla sidor
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  const overlay = document.getElementById('nt-hire-modal');
  if (!overlay) return;

  // Öppna modal via alla knappar med class hire-btn
  document.querySelectorAll('.hire-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Stäng via close-knapp
  const closeBtn = overlay.querySelector('.nt-modal__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Stäng via klick utanför modal
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Stäng via Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Formulär submit
  const form = overlay.querySelector('#hire-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('.nt-submit-btn');
      submitBtn.textContent = 'Skickar...';
      submitBtn.disabled = true;

      // TODO: Koppla till Formspree, Netlify Forms eller egen backend
      // Formspree exempel: action="https://formspree.io/f/DITT_ID" method="POST"
      setTimeout(function () {
        form.innerHTML = '<div style="text-align:center;padding:40px 0"><i class="fas fa-check-circle" style="font-size:3rem;color:#F47C20;margin-bottom:16px;display:block"></i><h4 style="color:#1C2E4A;font-weight:700">Tack för din förfrågan!</h4><p style="color:#6c757d">Vi återkommer inom 1–2 timmar.</p></div>';
      }, 1000);
    });
  }

});
