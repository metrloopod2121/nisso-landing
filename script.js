// VISION — landing interactions: taskbar/Start menu, FAQ accordion, CTA modal placeholder.

document.addEventListener('DOMContentLoaded', () => {
  // Start menu toggle
  const startBtn = document.getElementById('startBtn');
  const startMenu = document.getElementById('startMenu');
  const closeStartMenu = () => {
    startMenu.classList.remove('is-open');
    startBtn.setAttribute('aria-expanded', 'false');
  };
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('is-open');
  });
  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) closeStartMenu();
  });

  // Smooth-scroll for taskbar tasks and Start menu links
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(el.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      closeStartMenu();
    });
  });

  // Tray clock
  const trayClock = document.getElementById('trayClock');
  const updateClock = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    trayClock.textContent = `${hh}:${mm}`;
  };
  updateClock();
  setInterval(updateClock, 15000);

  // Active taskbar task follows scroll position
  const sections = ['#top', '#program', '#format', '#faq']
    .map(id => document.querySelector(id))
    .filter(Boolean);
  const tasks = [...document.querySelectorAll('.xp-task')];
  const setActiveTask = () => {
    let current = sections[0];
    for (const sec of sections) {
      if (window.scrollY + 120 >= sec.offsetTop) current = sec;
    }
    tasks.forEach(t => t.classList.toggle('is-active', t.getAttribute('data-scroll') === '#' + current.id));
  };
  window.addEventListener('scroll', setActiveTask, { passive: true });
  setActiveTask();

  // Window controls: minimize / restore / close (shake — content windows don't actually close)
  document.querySelectorAll('.win-window:not(.win-window--modal)').forEach(win => {
    const minBtn = win.querySelector('.win-btn--min');
    const maxBtn = win.querySelector('.win-btn--max');
    const closeBtn = win.querySelector('.win-btn--close');

    if (minBtn) {
      minBtn.addEventListener('click', () => {
        win.classList.add('is-minimized');
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', () => {
        win.classList.remove('is-minimized');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        win.classList.add('is-shaking');
        win.addEventListener('animationend', () => win.classList.remove('is-shaking'), { once: true });
      });
    }
  });

  // Modal close button actually closes the modal
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('is-open');
  });

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

  // CTA: copy prepared Telegram message and open the chat.
  const overlay = document.getElementById('modalOverlay');
  const closeModal = () => overlay.classList.remove('is-open');
  const telegramUrl = 'https://t.me/vision_nz';
  const signupMessage = 'Ниссо, привет 💙 я с сайта. меня зовут ___. хочу присоединиться к VISION за 55 000 ₽. пришли, пожалуйста, реквизиты для оплаты.';
  const copySignupMessage = async () => {
    try {
      await navigator.clipboard.writeText(signupMessage);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = signupMessage;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
  };

  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      copySignupMessage();
      window.open(telegramUrl, '_blank', 'noopener');
    });
  });
  document.getElementById('modalOk').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
