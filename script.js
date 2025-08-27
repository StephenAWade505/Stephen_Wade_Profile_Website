// Scroll Spy + Active Link a11y + Dynamic scroll offset
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector('.topnav');
  const navLinks = document.querySelectorAll('.topnav .links a');
  const sections = document.querySelectorAll('section[id]');

  // --- Dynamic nav height -> CSS var for scroll-margin-top
  const setNavHeightVar = () => {
    const h = nav?.offsetHeight || 75;
    document.documentElement.style.setProperty('--nav-h', `${h + 10}px`);
  };
  setNavHeightVar();
  window.addEventListener('resize', setNavHeightVar);

  // --- Helpers to set active link + aria-current
  const clearActive = () => {
    navLinks.forEach(l => {
      l.classList.remove('active');
      l.removeAttribute('aria-current');
    });
  };
  const activateLink = (id) => {
    const link = document.querySelector(`.topnav .links a[href="#${id}"]`);
    if (!link) return;
    clearActive();
    link.classList.add('active');
    link.setAttribute('aria-current', 'true');
  };

  // --- IntersectionObserver: window the center 40% of viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) activateLink(id);
    });
  }, {
    root: null,
    rootMargin: '-30% 0px -50% 0px', // top 30% and bottom 50% excluded
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));

  // --- Initial highlight on load (supports deep links)
  const initialHash = window.location.hash?.replace('#','');
  if (initialHash && document.getElementById(initialHash)) {
    activateLink(initialHash);
  } else if (sections.length) {
    activateLink(sections[0].id);
  }

  // --- Smooth scroll is handled by CSS; ensure keyboard focus for accessibility
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          // Let browser do the smooth scroll (CSS), then focus heading for a11y
          setTimeout(() => {
            const h2 = target.querySelector('h2');
            if (h2) h2.setAttribute('tabindex', '-1'), h2.focus({ preventScroll: true });
          }, 350);
        }
      }
    });
  });
});
