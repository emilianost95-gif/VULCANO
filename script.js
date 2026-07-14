/* ═══════════════════════════════════════════════
   VULCANO METALÚRGICA — script.js
   Loader · Cursor · Chispas Canvas · GSAP/ScrollTrigger
   Filtros · Contadores · Timeline · Form WhatsApp
   ═══════════════════════════════════════════════ */

document.documentElement.classList.add('js');

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5492634710472'; // ← reemplazar por el número real

/* ══════════ 1. LOADER INDUSTRIAL ══════════ */
(function loader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');
  const msg = document.getElementById('loaderMsg');
  const msgs = [
    'Encendiendo hornos',
    'Calibrando plasma CNC',
    'Ajustando amperaje',
    'Templando acero',
    'Listo para fabricar'
  ];
  let p = 0;

  const tick = setInterval(() => {
    p = Math.min(p + Math.random() * 18 + 6, 100);
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    msg.textContent = msgs[Math.min(Math.floor(p / 22), msgs.length - 1)];
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('is-done');
        document.body.style.overflow = '';
        heroIntro();
      }, 350);
    }
  }, 160);

  document.body.style.overflow = 'hidden';
})();

/* ══════════ 2. CURSOR PERSONALIZADO ══════════ */
(function cursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function raf() {
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll('a, button, .proj, .svc').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
})();

/* ══════════ 3. CHISPAS METÁLICAS (CANVAS) ══════════ */
(function sparks() {
  const canvas = document.getElementById('sparksCanvas');
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = Math.min(70, Math.floor(window.innerWidth / 18));

  function spawn(initial = false) {
    const hot = Math.random() < 0.32; // 32% chispas naranjas, resto polvo metálico
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + 10,
      r: hot ? Math.random() * 1.8 + 0.8 : Math.random() * 1.2 + 0.4,
      vy: -(Math.random() * 0.5 + 0.15) * (hot ? 1.6 : 1),
      vx: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: Math.random() * 0.0035 + 0.0012,
      hot,
      flicker: Math.random() * Math.PI * 2
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(spawn(true));

  (function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (let p of particles) {
      p.x += p.vx + Math.sin(t / 900 + p.flicker) * 0.12;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -10) Object.assign(p, spawn());

      const alpha = p.life * (p.hot ? 0.9 : 0.35);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.hot) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255,140,40,0.9)';
        ctx.fillStyle = `rgba(255,${150 + Math.floor(Math.sin(t / 120 + p.flicker) * 40)},60,${alpha})`;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(200,210,220,${alpha})`;
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  })(0);
})();

/* ══════════ 4. NAVBAR ══════════ */
(function navbar() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    })
  );
})();

/* ══════════ 5. GSAP — HERO + SCROLL ══════════ */
gsap.registerPlugin(ScrollTrigger);

function heroIntro() {
  if (prefersReduced) {
    gsap.set('.hero__line > span, .reveal-up', { y: 0, opacity: 1 });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.hero__line > span', { y: 0, duration: 1.1, stagger: 0.14 })
    .to('.hero__eyebrow', { y: 0, opacity: 1, duration: 0.8 }, '-=0.7')
    .to('.hero__sub', { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
    .to('.hero__cta', { y: 0, opacity: 1, duration: 0.8 }, '-=0.5');
}

(function scrollAnimations() {
  if (prefersReduced) return;

  // Parallax sutil del hero al hacer scroll
  gsap.to('.hero__content', {
    yPercent: -14, opacity: 0.25, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Firma: cordón de soldadura en títulos
  document.querySelectorAll('.weld-title').forEach(title => {
    const spark = document.createElement('span');
    spark.className = 'weld-spark';
    title.appendChild(spark);
    ScrollTrigger.create({
      trigger: title, start: 'top 82%', once: true,
      onEnter: () => title.classList.add('is-welded')
    });
  });

  // Aparición de tarjetas por lotes
  const batches = [
    { sel: '.svc', y: 40 },
    { sel: '.proj', y: 50 },
    { sel: '.why__card', y: 40 },
    { sel: '.testi', y: 40 },
    { sel: '.stat', y: 30 }
  ];
  batches.forEach(({ sel, y }) => {
    gsap.set(sel, { y, opacity: 0 });
    ScrollTrigger.batch(sel, {
      start: 'top 88%', once: true,
      onEnter: els => gsap.to(els, {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out'
      })
    });
  });

  // Bloques de contacto y cabeceras
  gsap.utils.toArray('.section__head, .contact__info, .contact__form').forEach(el => {
    gsap.from(el, {
      y: 36, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  });
})();

/* ══════════ 6. CONTADORES ══════════ */
(function counters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: prefersReduced ? 0 : 2.2, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString('es-CL'); }
        });
      }
    });
  });
})();

/* ══════════ 7. TIMELINE PROCESO ══════════ */
(function timeline() {
  const progress = document.getElementById('timelineProgress');
  const steps = document.querySelectorAll('.tstep');
  if (!progress) return;

  gsap.to(progress, {
    height: '100%', ease: 'none',
    scrollTrigger: {
      trigger: '#timeline', start: 'top 70%', end: 'bottom 60%',
      scrub: prefersReduced ? false : 0.6
    }
  });

  steps.forEach(step => {
    ScrollTrigger.create({
      trigger: step, start: 'top 72%', once: true,
      onEnter: () => step.classList.add('is-active')
    });
  });
})();

/* ══════════ 8. FILTROS DE PROYECTOS ══════════ */
(function filters() {
  const buttons = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.proj');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;

      projects.forEach(p => {
        const show = cat === 'all' || p.dataset.cat === cat;
        if (show) {
          p.classList.remove('is-hidden');
          if (!prefersReduced) {
            gsap.fromTo(p, { opacity: 0, y: 24, scale: 0.97 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
          }
        } else {
          p.classList.add('is-hidden');
        }
      });
      ScrollTrigger.refresh();
    });
  });
})();

/* ══════════ 9. TILT SUAVE EN SERVICIOS ══════════ */
(function tilt() {
  if (prefersReduced || window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ══════════ 10. FORMULARIO → WHATSAPP ══════════ */
(function contactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const email = form.email.value.trim();
    const servicio = form.servicio.value;
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !telefono || !servicio || !mensaje) {
      note.textContent = '⚠ Completa los campos obligatorios.';
      note.style.color = 'var(--orange)';
      return;
    }

    const texto =
      `Hola, soy *${nombre}*.\n` +
      `Quiero cotizar: *${servicio}*.\n\n` +
      `${mensaje}\n\n` +
      `📞 ${telefono}` + (email ? `\n✉ ${email}` : '');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`,
      '_blank', 'noopener'
    );

    note.textContent = '✓ Abriendo WhatsApp con tu cotización…';
    note.style.color = 'var(--blue)';
    form.reset();
  });
})();
