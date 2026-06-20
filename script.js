/* ============ AETHER · interactions ============ */
(() => {
  const root = document.documentElement;

  /* ---- cursor glow + parallax ---- */
  const cursor = document.getElementById('cursorGlow');
  const core = document.getElementById('quantumCore');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let tx = mx, ty = my;

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.setProperty('--mx', mx + 'px');
    cursor.style.setProperty('--my', my + 'px');
  }, { passive: true });

  /* card spotlight follow */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--cy', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* magnetic buttons */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });

  /* core parallax */
  function loop() {
    tx += (mx - tx) * 0.05;
    ty += (my - ty) * 0.05;
    if (core) {
      const dx = (tx / window.innerWidth - 0.5) * 14;
      const dy = (ty / window.innerHeight - 0.5) * 14;
      core.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- particle field ---- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, dpr, particles = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.min(120, Math.floor(window.innerWidth / 14));
    particles = Array.from({ length: count }, () => spawn());
  }
  function spawn() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.06 * dpr,
      vy: (Math.random() - 0.5) * 0.06 * dpr,
      r: Math.random() * 1.4 + 0.3,
      hue: Math.random() < 0.5 ? '96,165,250' : '6,182,212'
    };
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const a = 0.18 * p.z + 0.05;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue},${a})`;
      ctx.arc(p.x, p.y, p.r * dpr * p.z, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
})();
