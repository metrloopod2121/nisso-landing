// ВИЖЕН — landing interactions: mobile nav, FAQ accordion, CTA modal placeholder.

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const topbar = document.getElementById('topbar');
  const burger = document.getElementById('burger');
  if (burger && topbar) {
    burger.addEventListener('click', () => {
      const isOpen = topbar.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
    topbar.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', () => {
        topbar.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach(other => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // CTA modal (placeholder — real signup action to be wired later)
  const overlay = document.getElementById('modalOverlay');
  const openModal = () => overlay.classList.add('is-open');
  const closeModal = () => overlay.classList.remove('is-open');

  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', openModal);
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOk').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
