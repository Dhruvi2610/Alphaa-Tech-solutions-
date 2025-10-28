/* ==============================
   Alphaa Tech JS - Full Website
   Features:
   - accessible hamburger menu overlay
   - typing effect with blinking cursor
   - hero GIF parallax + subtle zoom on scroll
   - fade-in sections via IntersectionObserver
   - 3D tilt per-card on mouse move
   - floating blob variation speeds
   - simple appointment form submit (UI only)
   ============================== */

/* ---------- DOM refs ---------- */
const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menu-overlay');
const menuClose = document.getElementById('menu-close');
const yearSpan = document.getElementById('year');

/* show current year in footer */
if(yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ---------- Hamburger overlay toggle (use class toggle, accessible) ---------- */
function openMenu() {
  menuOverlay.classList.add('active');
  menuOverlay.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  menuOverlay.classList.remove('active');
  menuOverlay.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
}
hamburger.addEventListener('click', () => {
  menuOverlay.classList.contains('active') ? closeMenu() : openMenu();
});
if(menuClose) menuClose.addEventListener('click', closeMenu);
document.querySelectorAll('#menu-overlay a').forEach(a => a.addEventListener('click', closeMenu));

/* ---------- Fade-in sections (IntersectionObserver) ---------- */
const faders = document.querySelectorAll('.fade-in-section');
const appearOpts = { threshold: 0.12, rootMargin: "0px 0px -60px 0px" };
const appearIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if(!en.isIntersecting) return;
    en.target.classList.add('visible');
    obs.unobserve(en.target);
  });
}, appearOpts);
faders.forEach(f => appearIO.observe(f));

/* ---------- Typing effect (with blinking cursor) ---------- */
const typingTarget = document.querySelector('.hero-content .typing-line');
const originalText = "Your Trusted Outsourcing Partner from Baroda to the USA";
let typingIndex = 0;
const cursorEl = document.createElement('span');
cursorEl.className = 'typing-cursor';
cursorEl.innerHTML = '&nbsp;';
if(typingTarget) {
  typingTarget.appendChild(cursorEl); // cursor appended; letters will be inserted before
  // typed letters inserted before the cursor node
  function typeChar() {
    if(typingIndex < originalText.length) {
      // insert next character before the cursor
      const ch = document.createTextNode(originalText[typingIndex]);
      typingTarget.insertBefore(ch, cursorEl);
      typingIndex++;
      // speed slightly randomised for natural feel
      const delay = 28 + Math.random() * 40;
      setTimeout(typeChar, delay);
    } else {
      // when done keep cursor blinking for a bit then steady glow
      setTimeout(() => cursorEl.style.opacity = '0.9', 400);
    }
  }
  // start typing after small delay so hero fades in first
  window.addEventListener('load', () => setTimeout(typeChar, 300));
}

/* ---------- Hero parallax & subtle zoom on scroll ---------- */
const heroBg = document.querySelector('.hero-bg');
const heroBlobs = document.querySelectorAll('.hero-blobs .blob');
window.addEventListener('scroll', () => {
  const sc = window.scrollY;
  if(heroBg) {
    // move background slower for parallax and scale a tiny bit for zoom-on-scroll
    const translateY = sc * 0.18; // background moves slower
    const scaleVal = 1 + Math.min(sc / 7000, 0.06); // subtle scale cap
    heroBg.style.transform = `translateY(${translateY}px) scale(${scaleVal})`;
  }
  // move blobs at varied speeds for depth
  heroBlobs.forEach((b, i) => {
    const speed = 0.06 + i * 0.03;
    const offset = sc * speed;
    b.style.transform = `translateY(${offset}px)`;
  });
});

/* ---------- Floating blobs: give each blob a slightly different animation-duration ---------- */
document.querySelectorAll('.hero-blobs .blob').forEach((b, i) => {
  const base = 14;
  const rng = Math.random() * 8;
  b.style.animationDuration = `${base + rng}s`;
  b.style.animationDelay = `${i * 1.6}s`;
});

/* ---------- 3D tilt for cards (mouse) ---------- */
const cards = document.querySelectorAll('.card-3d');
cards.forEach(card => {
  // enable pointer events and preserve-3d
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const rotateY = (dx / rect.width) * 18; // control sensitivity
    const rotateX = (dy / rect.height) * -12;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px) scale(1.02)`;
    card.style.transition = 'transform 0.08s linear';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.45s cubic-bezier(.2,.9,.25,1)';
  });
});

/* ---------- Neon hover for primary buttons (CSS handles most; this adds extra polish) ---------- */
document.querySelectorAll('.btn-primary, .card-3d a.btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.boxShadow = `0 0 26px ${getComputedStyle(document.documentElement).getPropertyValue('--accent') || 'rgb(10,143,10)'}`;
    btn.style.transform = 'translateY(-3px) scale(1.02)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.boxShadow = '';
    btn.style.transform = '';
  });
});

/* ---------- Appointment form submit (demo, UI) ---------- */
const appointmentForm = document.getElementById('appointment-form');
if(appointmentForm){
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // simple UI confirmation — replace with real backend as needed
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    setTimeout(() => {
      submitBtn.textContent = 'Submitted ✓';
      appointmentForm.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1600);
    }, 900);
  });
}

/* ---------- small accessibility: close overlay on ESC ---------- */
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && menuOverlay.classList.contains('active')) closeMenu();
});