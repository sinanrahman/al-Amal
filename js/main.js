/* ═══════════════════════════════════════════════════════════
   AL NOOR AL AMAL AUTOMOTIVE GROUP — main.js
   Full premium interactions engine
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    initTheme();
    initPreloader();
    initCursor();
    initLenis();
    initThreeJS();
    initNav();
    initMobileMenu();
    initSwiper();
    initReveal();
    initCounters();
    initKPIBars();
    initChartBars();
    initTimeline();
    initChartLine();
    initParallax();
    initForm();
});

/* ─────────────────────────────────────────────────────────
   THEME — localStorage persistence, no flash
───────────────────────────────────────────────────────── */
function initTheme() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;

    const saved = localStorage.getItem('ana-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    btn.addEventListener('click', () => {
        const cur  = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ana-theme', next);
    });
}

/* ─────────────────────────────────────────────────────────
   PRELOADER
───────────────────────────────────────────────────────── */
function initPreloader() {
    const el  = document.getElementById('preloader');
    const bar = document.getElementById('pre-fill');
    const pct = document.getElementById('pre-pct');
    if (!el) return;

    let p = 0;
    const interval = setInterval(() => {
        p += Math.random() * 4.5 + 0.6;
        if (p >= 100) {
            p = 100;
            clearInterval(interval);
            if (bar) bar.style.width = '100%';
            if (pct) pct.textContent = '100%';
            setTimeout(() => {
                el.classList.add('gone');
                runHeroEntrance();
            }, 420);
        } else {
            if (bar) bar.style.width = p + '%';
            if (pct) pct.textContent = Math.round(p) + '%';
        }
    }, 20);
}

function runHeroEntrance() {
    if (typeof gsap === 'undefined') return;

    gsap.timeline()
        .from('.nav',              { y: -90, opacity: 0, duration: 1,   ease: 'power3.out' }, 0)
        .from('.hero-badge',       { y: 30,  opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
        .from('.h1-line',          { y: 60,  opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1 }, 0.35)
        .from('.hero-lead',        { y: 30,  opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.65)
        .from('.hero-blockquote',  { y: 20,  opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.78)
        .from('.hero-actions',     { y: 20,  opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.9)
        .from('.hero-stats',       { y: 20,  opacity: 0, duration: 0.7, ease: 'power3.out' }, 1.0)
        .from('.scroll-ind',       { opacity: 0,          duration: 0.6                   }, 1.15);
}

/* ─────────────────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────────────────── */
function initCursor() {
    const ring = document.getElementById('cur-ring');
    const dot  = document.getElementById('cur-dot');
    if (!ring || !dot) return;

    let mx = 0, my = 0, rx = 0, ry = 0, dx = 0, dy = 0;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function raf() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        dx += (mx - dx) * 0.45;
        dy += (my - dy) * 0.45;

        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        dot.style.left  = dx + 'px';
        dot.style.top   = dy + 'px';

        requestAnimationFrame(raf);
    })();

    const hoverEls = document.querySelectorAll(
        'a, button, input, select, textarea, .kpi-card, .tl-node, .ovs, .inv-p, .oslide'
    );
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('on'));
        el.addEventListener('mouseleave', () => ring.classList.remove('on'));
    });
}

/* ─────────────────────────────────────────────────────────
   LENIS SMOOTH SCROLL
───────────────────────────────────────────────────────── */
function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        duration: 1.35,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ({ scroll, limit }) => {
        const fill = document.getElementById('sprog-fill');
        if (fill) fill.style.width = (scroll / (limit || 1) * 100) + '%';
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    if (typeof gsap !== 'undefined') {
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
    }
}

/* ─────────────────────────────────────────────────────────
   THREE.JS PARTICLE WAVE BACKGROUND
───────────────────────────────────────────────────────── */
function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.18;';
    document.body.prepend(canvas);

    let W = window.innerWidth, H = window.innerHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.set(0, 55, 130);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

    const cols = 70, rows = 70, sp = 4.2, total = cols * rows;
    const positions = new Float32Array(total * 3);

    let i = 0;
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            positions[i * 3]     = (c - cols / 2) * sp;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = (r - rows / 2) * sp;
            i++;
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
        color: 0xD4AF37,
        size: 0.52,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
        tx = (e.clientX / W - 0.5) * 24;
        ty = (e.clientY / H - 0.5) * 14;
    });

    const clk = new THREE.Clock();

    (function animate() {
        requestAnimationFrame(animate);
        const t   = clk.getElapsedTime();
        const arr = geo.attributes.position.array;
        let idx = 0;
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const x = arr[idx * 3];
                const z = arr[idx * 3 + 2];
                arr[idx * 3 + 1] =
                    Math.sin(x * 0.055 + t * 0.4) * 10 +
                    Math.cos(z * 0.055 + t * 0.3) * 7;
                idx++;
            }
        }
        geo.attributes.position.needsUpdate = true;

        cx += (tx - cx) * 0.04;
        cy += (ty - cy) * 0.04;
        pts.rotation.y = cx * 0.03;
        pts.rotation.x = 0.2 + cy * 0.018;

        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        W = window.innerWidth; H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });
}

/* ─────────────────────────────────────────────────────────
   STICKY NAV — Glassmorphism on Scroll
───────────────────────────────────────────────────────── */
function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const fn = () => nav.classList.toggle('glass-nav', window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
}

/* ─────────────────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────────────────── */
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const menu   = document.getElementById('mob-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        burger.classList.toggle('active', open);
        burger.setAttribute('aria-expanded', open);
        menu.setAttribute('aria-hidden', !open);
    });

    menu.querySelectorAll('.mm-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ─────────────────────────────────────────────────────────
   SWIPER — Operational Carousel
───────────────────────────────────────────────────────── */
function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    const countEl = document.getElementById('snav-count');
    const total   = 5;

    const sw = new Swiper('#ops-swiper', {
        slidesPerView: 1.05,
        spaceBetween: 16,
        speed: 800,
        grabCursor: true,
        effect: 'slide',
        pagination: { el: '.ops-pag', clickable: true },
        navigation: {
            nextEl: '#s-next',
            prevEl: '#s-prev',
        },
        breakpoints: {
            768:  { slidesPerView: 1.08, spaceBetween: 20 },
            1100: { slidesPerView: 1.18, spaceBetween: 24 },
        },
        on: {
            slideChange(swiper) {
                if (countEl) {
                    const idx = String(swiper.realIndex + 1).padStart(2, '0');
                    const tot = String(total).padStart(2, '0');
                    countEl.textContent = `${idx} / ${tot}`;
                }
            }
        }
    });
}

/* ─────────────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────────────── */
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Add stagger to children within grid parents
    const parents = document.querySelectorAll(
        '.ov-stats, .kpi-grid, .tl-grid, .inv-pillars, .vcp-metrics, .inv-stats'
    );
    parents.forEach(parent => {
        parent.querySelectorAll('.reveal').forEach((child, i) => {
            child.dataset.i = i;
        });
    });

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = Number(entry.target.dataset.i || 0) * 110;
            setTimeout(() => entry.target.classList.add('vis'), delay);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────────────────
   COUNTERS
───────────────────────────────────────────────────────── */
function initCounters() {
    const ctrs = document.querySelectorAll('.cnt');
    if (!ctrs.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseFloat(el.dataset.t);
            const isInt  = Number.isInteger(target);
            const dur    = 1900;
            const start  = performance.now();

            (function tick(now) {
                const p  = Math.min((now - start) / dur, 1);
                const e  = 1 - Math.pow(1 - p, 3);
                el.textContent = isInt
                    ? Math.ceil(target * e)
                    : (target * e).toFixed(1);
                if (p < 1) requestAnimationFrame(tick);
            })(start);

            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    ctrs.forEach(c => io.observe(c));
}

/* ─────────────────────────────────────────────────────────
   KPI BAR ANIMATIONS
───────────────────────────────────────────────────────── */
function initKPIBars() {
    const bars = document.querySelectorAll('.kpi-bar');
    if (!bars.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const b = entry.target;
            b.style.width = (b.dataset.w || 0) + '%';
            io.unobserve(b);
        });
    }, { threshold: 0.4 });

    bars.forEach(b => io.observe(b));
}

/* ─────────────────────────────────────────────────────────
   EXCELLENCE CHART BARS
───────────────────────────────────────────────────────── */
function initChartBars() {
    const card = document.querySelector('.exc-chart-card');
    if (!card) return;

    const bars    = card.querySelectorAll('.ecc-bar');
    const targets = [...bars].map(b => b.style.getPropertyValue('--bh'));
    bars.forEach(b => b.style.setProperty('--bh', '0%'));

    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        bars.forEach((b, i) => {
            setTimeout(() => b.style.setProperty('--bh', targets[i]), i * 90);
        });
        io.disconnect();
    }, { threshold: 0.3 });

    io.observe(card);
}

/* ─────────────────────────────────────────────────────────
   TIMELINE SCROLL PROGRESS
───────────────────────────────────────────────────────── */
function initTimeline() {
    const line = document.getElementById('tl-prog');
    const wrap = document.querySelector('.tl-prog-wrap');
    if (!line || !wrap || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
        trigger: '.traj-sec',
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: 1.5,
        onUpdate: self => {
            line.style.width = (self.progress * 100) + '%';
        }
    });
}

/* ─────────────────────────────────────────────────────────
   INVESTOR CHART LINE
───────────────────────────────────────────────────────── */
function initChartLine() {
    const line = document.querySelector('.i-line');
    if (!line) return;

    line.style.animationPlayState = 'paused';

    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        line.style.animationPlayState = 'running';
        io.disconnect();
    }, { threshold: 0.5 });

    io.observe(line);
}

/* ─────────────────────────────────────────────────────────
   PARALLAX — Hero Image
───────────────────────────────────────────────────────── */
function initParallax() {
    const img = document.querySelector('.hero-bg-img');
    if (!img || typeof gsap === 'undefined') return;

    gsap.to(img, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        }
    });
}

/* ─────────────────────────────────────────────────────────
   INQUIRY FORM
───────────────────────────────────────────────────────── */
function initForm() {
    const form    = document.getElementById('inq-form');
    const success = document.getElementById('fg-success');
    const reset   = document.getElementById('fg-reset');
    const msgEl   = document.getElementById('f-msg');
    const cntEl   = document.getElementById('char-cnt');
    const subBtn  = document.getElementById('sub-btn');
    if (!form) return;

    // Character counter
    if (msgEl && cntEl) {
        msgEl.addEventListener('input', () => {
            cntEl.textContent = msgEl.value.length + ' / 500';
        });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll('[required]').forEach(inp => {
            const fld = inp.closest('.fld');
            if (!inp.value.trim()) {
                fld.classList.add('err');
                valid = false;
            } else {
                fld.classList.remove('err');
            }
        });

        if (!valid) return;

        if (subBtn) {
            subBtn.textContent = 'TRANSMITTING…';
            subBtn.disabled    = true;
        }

        setTimeout(() => {
            if (success) success.classList.add('show');
            if (subBtn) {
                subBtn.textContent = 'Submit Secure Inquiry';
                subBtn.disabled    = false;
            }
        }, 1600);
    });

    form.querySelectorAll('[required]').forEach(inp => {
        inp.addEventListener('input', () => {
            if (inp.value.trim()) inp.closest('.fld')?.classList.remove('err');
        });
    });

    if (reset) {
        reset.addEventListener('click', () => {
            form.reset();
            if (cntEl) cntEl.textContent = '0 / 500';
            success?.classList.remove('show');
        });
 
    }
}
