/* ═══════════════════════════════════════════════════════════
   NOOR AL AMAL AUTOMOTIVE GROUP — main.js
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
    initHorizontalScroll();
    initReveal();
    initCounters();
    initKPIBars();
    initChartBars();
    initTimeline();
    initChartLine();
    initParallax();
    initForm();
    initBrandsSlider();
    initPerformanceCharts();
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
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ana-theme', next);
    });
}

/* ─────────────────────────────────────────────────────────
   PRELOADER
───────────────────────────────────────────────────────── */
function initPreloader() {
    const el = document.getElementById('preloader');
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
        .from('.nav', { y: -90, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
        .from('.hero-badge', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
        .from('.h1-line', { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1 }, 0.35)
        .from('.hero-lead', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.65)
        .from('.hero-blockquote', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.78)
        .from('.hero-actions', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.9)
        .from('.hero-stats', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, 1.0)
        .from('.scroll-ind', { opacity: 0, duration: 0.6 }, 1.15);
}

/* ─────────────────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────────────────── */
function initCursor() {
    const ring = document.getElementById('cur-ring');
    const dot = document.getElementById('cur-dot');
    if (!ring || !dot) return;

    let mx = 0, my = 0, rx = 0, ry = 0, dx = 0, dy = 0;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function raf() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        dx += (mx - dx) * 0.45;
        dy += (my - dy) * 0.45;

        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        dot.style.left = dx + 'px';
        dot.style.top = dy + 'px';

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

    window.lenis = lenis;

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
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
            positions[i * 3] = (c - cols / 2) * sp;
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
        const t = clk.getElapsedTime();
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
    const menu = document.getElementById('mob-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        burger.classList.toggle('active', open);
        burger.setAttribute('aria-expanded', open);
        menu.setAttribute('aria-hidden', !open);

        document.body.style.overflow = open ? 'hidden' : '';
        if (window.lenis) {
            if (open) window.lenis.stop();
            else window.lenis.start();
        }
    });

    menu.querySelectorAll('.mm-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');

            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        });
    });
}

/* ─────────────────────────────────────────────────────────
   HORIZONTAL SCROLL — Operations Showcase
───────────────────────────────────────────────────────── */
function initHorizontalScroll() {
    const section = document.getElementById('carousel');
    const inner = document.getElementById('ops-horizontal-inner');
    const slides = gsap.utils.toArray('.oslide');

    if (!section || !inner || !slides.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=3000",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
        }
    });

    gsap.set(slides[0], { x: 0 });
    for (let i = 1; i < slides.length; i++) {
        gsap.set(slides[i], { x: "100vw" });
    }

    for (let i = 1; i < slides.length; i++) {
        let finalX = i * 4;
        tl.to(slides[i], {
            x: finalX + "vw",
            ease: "power1.inOut"
        }, i === 1 ? undefined : "-=0.3");
    }
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
            const el = entry.target;
            const target = parseFloat(el.dataset.t);
            const isInt = Number.isInteger(target);
            const dur = 1900;
            const start = performance.now();

            (function tick(now) {
                const p = Math.min((now - start) / dur, 1);
                const e = 1 - Math.pow(1 - p, 3);
                el.textContent = isInt
                    ? Math.ceil(target * e).toLocaleString()
                    : (target * e).toFixed(1).toLocaleString();
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

    const bars = card.querySelectorAll('.ecc-bar');
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
    const form = document.getElementById('inq-form');
    const success = document.getElementById('fg-success');
    const reset = document.getElementById('fg-reset');
    const msgEl = document.getElementById('f-msg');
    const cntEl = document.getElementById('char-cnt');
    const subBtn = document.getElementById('sub-btn');
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
            subBtn.disabled = true;
        }

        setTimeout(() => {
            if (success) success.classList.add('show');
            if (subBtn) {
                subBtn.textContent = 'Submit Secure Inquiry';
                subBtn.disabled = false;
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

/* ─────────────────────────────────────────────────────────
   BRANDS SLIDER SCROLL NAV
───────────────────────────────────────────────────────── */
function initBrandsSlider() {
    const prevBtn = document.querySelector('.brand-nav-btn.prev');
    const nextBtn = document.querySelector('.brand-nav-btn.next');
    const sliderCol = document.querySelector('.brands-slider-col');

    if (!prevBtn || !nextBtn || !sliderCol) return;

    // Scroll amount is roughly half the visible container width
    prevBtn.addEventListener('click', () => {
        sliderCol.scrollBy({ left: -(sliderCol.clientWidth / 2), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        sliderCol.scrollBy({ left: sliderCol.clientWidth / 2, behavior: 'smooth' });
    });
}

/* ─────────────────────────────────────────────────────────
   PERFORMANCE CHARTS
───────────────────────────────────────────────────────── */
function initPerformanceCharts() {
    if (typeof Chart === 'undefined') return;

    function getChartColors() {
        const isL = document.documentElement.getAttribute('data-theme') === 'light';
        return {
            isL,
            text: isL ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            grid: isL ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
            rev: isL ? '#000000' : '#ffffff'
        };
    }
    let cColors = getChartColors();

    Chart.defaults.color = cColors.text;
    Chart.defaults.font.family = '"Inter", sans-serif';
    
    let mChart, tChart, cChart;

    const mCtx = document.getElementById('marketGraph');
    if (mCtx) {
        mChart = new Chart(mCtx, {
            type: 'line',
            data: {
                labels: ['2025', '2026', '2027', '2028', '2029', '2030'],
                datasets: [
                    {
                        label: 'Aftermarket Parts USD Bn',
                        data: [490, 505, 520, 540, 560, 580],
                        borderColor: '#ed1c24',
                        backgroundColor: '#ed1c24',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#ed1c24',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Repair & Maintenance USD Bn',
                        data: [820, 870, 920, 970, 1030, 1090],
                        borderColor: '#d4af37',
                        backgroundColor: '#d4af37',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#d4af37',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Used Car USD Tn',
                        data: [2.00, 2.14, 2.30, 2.45, 2.60, 2.70],
                        borderColor: '#ff5252',
                        borderDash: [5, 5],
                        backgroundColor: '#ff5252',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#ff5252',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, color: cColors.text } }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Year', color: cColors.text },
                        grid: { color: cColors.grid },
                        ticks: { color: cColors.text }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'USD Billion', color: cColors.text },
                        grid: { color: cColors.grid },
                        ticks: { color: cColors.text },
                        min: 450,
                        max: 1150
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'USD Trillion', color: cColors.text },
                        grid: { drawOnChartArea: false },
                        ticks: { color: cColors.text },
                        min: 1.9,
                        max: 2.8
                    }
                }
            }
        });
    }

    const tCtx = document.getElementById('tableGraph');
    if (tCtx) {
        tChart = new Chart(tCtx, {
            type: 'line',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                datasets: [
                    {
                        label: 'Branches / Franchise',
                        data: [3, 8, 15, 25, 40],
                        borderColor: '#ed1c24',
                        backgroundColor: '#ed1c24',
                        borderWidth: 2,
                        pointRadius: 4,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Spare Parts SKUs',
                        data: [1000, 2500, 5000, 8000, 12000],
                        borderColor: '#d4af37',
                        backgroundColor: '#d4af37',
                        borderWidth: 2,
                        pointRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Used Vehicle Deals',
                        data: [120, 300, 750, 1500, 3000],
                        borderColor: '#ff5252',
                        backgroundColor: '#ff5252',
                        borderWidth: 2,
                        pointRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Service Jobs / Year',
                        data: [2500, 7500, 18000, 40000, 75000],
                        borderColor: '#b71c1c',
                        backgroundColor: '#b71c1c',
                        borderWidth: 2,
                        pointRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Revenue Target (Multiplier)',
                        data: [1, 2.5, 5, 9, 15],
                        borderColor: cColors.rev,
                        backgroundColor: cColors.rev,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, color: cColors.text } }
                },
                scales: {
                    x: {
                        grid: { color: cColors.grid },
                        ticks: { color: cColors.text }
                    },
                    y: {
                        type: 'logarithmic',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Volume / Units (Log Scale)', color: cColors.text },
                        grid: { color: cColors.grid },
                        ticks: { color: cColors.text }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Lower Values (Linear)', color: cColors.text },
                        grid: { drawOnChartArea: false },
                        ticks: { color: cColors.text }
                    }
                }
            }
        });
    }

    const cCtx = document.getElementById('companyGraph');
    if (cCtx) {
        cChart = new Chart(cCtx, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5'],
                datasets: [
                    {
                        label: 'Branches / Franchise',
                        data: [3, 8, 15, 25, 40],
                        borderColor: '#ed1c24',
                        backgroundColor: '#ed1c24',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#ed1c24'
                    },
                    {
                        label: 'Service Jobs Index',
                        data: [1.25, 3.75, 9.0, 20.0, 37.5],
                        borderColor: '#d4af37',
                        backgroundColor: '#d4af37',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#d4af37'
                    },
                    {
                        label: 'Used Vehicle Index',
                        data: [1.2, 3.0, 7.5, 15.0, 30.0],
                        borderColor: '#ff5252',
                        backgroundColor: '#ff5252',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#ff5252'
                    },
                    {
                        label: 'Revenue Growth Index',
                        data: [1.0, 2.5, 5.0, 9.0, 15.0],
                        borderColor: cColors.rev,
                        backgroundColor: cColors.rev,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: cColors.rev
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, color: cColors.text } }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Year', color: cColors.text },
                        grid: { color: cColors.grid },
                        ticks: { color: cColors.text }
                    },
                    y: {
                        title: { display: false },
                        grid: { color: cColors.grid },
                        ticks: { color: cColors.text },
                        min: 0,
                        max: 45
                    }
                }
            }
        });
    }

    const observer = new MutationObserver(() => {
        cColors = getChartColors();
        Chart.defaults.color = cColors.text;
        
        [mChart, tChart, cChart].forEach(chart => {
            if (!chart) return;
            if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = cColors.text;
            }
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.grid) scale.grid.color = cColors.grid;
                    if (scale.ticks) scale.ticks.color = cColors.text;
                    if (scale.title && scale.title.text) scale.title.color = cColors.text;
                });
            }
            chart.data.datasets.forEach(ds => {
                if (ds.label === 'Revenue Target (Multiplier)' || ds.label === 'Revenue Growth Index') {
                    ds.borderColor = cColors.rev;
                    ds.backgroundColor = cColors.rev;
                    if (ds.pointBackgroundColor) ds.pointBackgroundColor = cColors.rev;
                }
            });
            chart.update();
        });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
