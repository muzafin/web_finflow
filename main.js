/* =============================================
   FINFLOW – main.js
   ============================================= */

// ---- Toast Notification ----
function showToast(message, duration = 3500) {
  // Inject toast styles once
  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      #ff-toast {
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(24px);
        background: var(--inverse-surface);
        color: var(--inverse-on-surface);
        padding: 14px 24px;
        border-radius: 999px;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0,0,0,.25);
        z-index: 9999;
        opacity: 0;
        transition: opacity .3s ease, transform .3s ease;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #ff-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  let toast = document.getElementById('ff-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ff-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Mobile nav toggle ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

function closeNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
}

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
    closeNav();
  }
});

// ---- Scroll Reveal (Intersection Observer) ----
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

reveals.forEach((el) => revealObserver.observe(el));

// ---- Smooth active nav link highlight ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.style.color = '';
          a.style.background = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = 'var(--primary)';
            a.style.background = 'rgba(0,105,71,.08)';
          }
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((s) => sectionObserver.observe(s));

// ---- Dynamic User Count ----
let currentDownloads = parseInt(localStorage.getItem('finflow_downloads')) || 5000;

function updateDownloadUI() {
  const trustedEl = document.getElementById('trustedUsersCount');
  if (trustedEl) trustedEl.textContent = currentDownloads.toLocaleString();
  
  const statsNumEl = document.getElementById('statsUsersNum');
  if (statsNumEl && !statsNumEl.dataset.animating) {
    statsNumEl.textContent = currentDownloads.toLocaleString();
  }
}

// Initialize on load
updateDownloadUI();

// ---- Download button: link to APK / Play Store ----
const PLAY_STORE_URL = '#'; // Ganti dengan link Google Play Store kamu
const APK_URL        = 'finflow.apk'; // APK langsung dari repo

document.getElementById('androidBtn').href = PLAY_STORE_URL;

// APK button – trigger download dengan nama file yang jelas
const apkBtn = document.getElementById('apkBtn');
apkBtn.href     = APK_URL;
apkBtn.download = 'FinFlow.apk'; // nama file saat didownload
apkBtn.addEventListener('click', () => {
  // Increment download counter
  currentDownloads += Math.floor(Math.random() * 3) + 1; // Simulate 1-3 downloads per click for fun
  localStorage.setItem('finflow_downloads', currentDownloads);
  updateDownloadUI();

  // Tampilkan toast notifikasi saat download dimulai
  showToast('⬇️ Downloading FinFlow.apk...');
});

// ---- Animated counter for stats ----
function animateCounter(el, target, suffix = '', duration = 1600) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const startVal = 0;

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
    const current = startVal + (target - startVal) * eased;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

// Observe stats section to trigger counters
const statsNums = document.querySelectorAll('.stats-num');
const statsData = [
  { value: currentDownloads, suffix: '', display: 'dynamic' },
  { value: 3,    suffix: 's', display: '3s'  },
  { value: 95,   suffix: '%', display: '95%' },
  { value: 7,    suffix: '+', display: '7+'  },
];

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      statsNums.forEach((el, i) => {
        const data = statsData[i];
        if (data) {
          if (data.display === 'dynamic') {
            el.dataset.animating = "true";
            animateCounter(el, currentDownloads, '');
            setTimeout(() => { delete el.dataset.animating; el.textContent = currentDownloads.toLocaleString(); }, 1600);
          } else if (data.display === '5K+') {
            animateCounter(el, 5, 'K+');
          } else {
            animateCounter(el, data.value, data.suffix);
          }
        }
      });
      statsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// ---- Minimal particle effect on hero ----
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.4;';
  const heroEl = document.querySelector('.hero');
  if (!heroEl) return;
  heroEl.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = heroEl.offsetWidth;
    H = canvas.height = heroEl.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 3 + 1;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.alpha = Math.random() * .4 + .1;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  function init() {
    resize();
    particles = Array.from({ length: 35 }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 105, 71, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();
