/* =========================================
   PORTAFOLIO · Interacciones
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Año del footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Plugin: AOS (animaciones al hacer scroll) ---------- */
  if (window.AOS) {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 60 });
  } else {
    document.body.classList.add("no-aos");
  }

  /* ---------- Plugin: Typed.js (efecto máquina de escribir) ---------- */
  const frases = [
    "Estudiante de Ingeniería de Software",
    "Desarrollador Web en formación",
    "Apasionado por las bases de datos",
    "Trabajo en equipo con Scrum"
  ];
  if (window.Typed && !reduceMotion) {
    new Typed("#typed", {
      strings: frases,
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1800,
      loop: true
    });
  } else {
    document.getElementById("typed").textContent = frases[0];
  }

  /* ---------- Plugin: Leaflet (mapa de ubicación) ---------- */
  const coords = [-1.2491, -78.6168]; // Ambato, Ecuador
  if (window.L) {
    const map = L.map("map", { scrollWheelZoom: false }).setView(coords, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    const pin = L.divIcon({ className: "", html: '<div class="map-pin"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
    L.marker(coords, { icon: pin }).addTo(map).bindPopup("<b>Ambato</b><br>Tungurahua, Ecuador");
  }

  /* ---------- Navbar: fondo al hacer scroll + botón arriba ---------- */
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("to-top");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Menú móvil ---------- */
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    })
  );

  /* ---------- Enlace activo según la sección visible ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = links.querySelectorAll("a");
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const dur = 1400;
      const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countObs.observe(c));

  /* ---------- Brillo que sigue al cursor en proyectos ---------- */
  document.querySelectorAll(".project").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Inclinación suave del avatar ---------- */
  const avatar = document.querySelector("[data-tilt]");
  if (avatar && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * -10;
      avatar.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
  }

  /* ---------- Fondo: partículas conectadas ---------- */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const total = Math.min(70, Math.floor((w * h) / 22000));
    particles = Array.from({ length: total }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(167, 139, 250, 0.55)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - d / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
});
