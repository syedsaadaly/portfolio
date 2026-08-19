/* ============================================
   SYED SAAD ALI — PORTFOLIO
   script.js
   ============================================ */

// ─── NAV SCROLL EFFECT ───────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── HAMBURGER MENU ──────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks   = document.querySelectorAll('.mob-link');
let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  mobileMenu.classList.toggle('open', open);
  // Animate hamburger bars
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
}

hamburger.addEventListener('click', () => toggleMenu(!menuOpen));

mobLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) toggleMenu(false);
});

// ─── SCROLL REVEAL ───────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 320);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ─── ACTIVE NAV LINK ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a:not(.nav__cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--text)';
          link.style.fontWeight = '500';
        } else {
          link.style.fontWeight = '';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── SMOOTH SCROLL OFFSET (for fixed nav) ────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── SKILL PILL HOVER RIPPLE ─────────────────
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('mouseover', function () {
    this.style.transition = 'background 0.25s, color 0.25s, border-color 0.25s, transform 0.25s';
  });
});

// ─── CURSOR GLOW (subtle, desktop only) ──────
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,111,71,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.6s ease, top 0.6s ease;
    top: -200px; left: -200px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ─── CAROUSELS (Projects + Certificates) ─────
// Both run on the same shell so they read as one component: header arrows,
// autoplay that backs off while you're reading, identical timing.
function buildCarousel(selector, prevEl, nextEl, opts) {
  const el = document.querySelector(selector);
  if (!el) return null;

  const swiper = new Swiper(selector, {
    spaceBetween: 20,
    loop: true,
    loopAdditionalSlides: 2,
    speed: 800,
    grabCursor: true,
    autoplay: { delay: opts.delay, disableOnInteraction: false },
    navigation: { prevEl, nextEl },
    keyboard: { enabled: true, onlyInViewport: true },
    breakpoints: opts.breakpoints,
  });

  // Hovering a card means you're reading it — hold the slide there.
  el.addEventListener('mouseenter', () => swiper.autoplay?.stop());
  el.addEventListener('mouseleave', () => swiper.autoplay?.start());

  return swiper;
}

const projectsSwiper = buildCarousel('.projectsSwiper', '#projectsPrev', '#projectsNext', {
  delay: 3000,
  breakpoints: {
    0:    { slidesPerView: 1, spaceBetween: 16 },
    540:  { slidesPerView: 2, spaceBetween: 16 },
    900:  { slidesPerView: 3, spaceBetween: 20 },
    1200: { slidesPerView: 4, spaceBetween: 20 },
  },
});

const certsSwiper = buildCarousel('.certsSwiper', '#certsPrev', '#certsNext', {
  delay: 4200,
  breakpoints: {
    0:    { slidesPerView: 1, spaceBetween: 16 },
    720:  { slidesPerView: 2, spaceBetween: 18 },
    1100: { slidesPerView: 3, spaceBetween: 20 },
  },
});

// ─── FOOTER YEAR ─────────────────────────────
// The markup carries 2026 as a fallback; this keeps it current on its own.
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
