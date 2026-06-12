# Al Noor Al Amal Automotive Group - Corporate Website

A world-class, premium corporate automotive landing page website engineered for **Al Noor Al Amal Automotive Group**, headquartered in Dubai, United Arab Emirates. 

This website has been designed to represent a multi-million-dollar GCC automotive corporation, optimized to engage institutional clients, strategic partners, and sovereign wealth investors.

---

## 💎 Design Philosophy & Aesthetics

- **Dark Luxury Theme**: Built on deep onyx backgrounds (`#0B0D10`), dark charcoal surfaces (`#13161B`), and rich gold-to-amber gradients (`#D4AF37`).
- **Institutional Polish**: Clean layouts, high contrast typography, and premium geometric styling (referencing global luxury benchmarks like BMW, Mercedes-Benz, and Porsche corporate pages).
- **Cinematic Experience**: Immersive layouts incorporating AI-generated automotive concept imagery, smooth parallex scroll reveals, and high-fidelity custom cursors.
- **Modern Glassmorphism**: Translucent panels with background blurs, fine borders, and interactive cursor glow states.

---

## 🛠️ Technology Stack

- **HTML5 & Semantic Structure**: Fully structured SEO-friendly HTML grid and flex components.
- **CSS3 / Vanilla CSS Styling**: Complete custom design system leveraging CSS variables, clean transitions, and fine border rendering.
- **Three.js**: Interactive 3D particle net background undulating in real-time, responding dynamically to user mouse coordinates.
- **GSAP & ScrollTrigger**: Powering all scroll-driven visuals, staggered text revelations, KPI counting up, and horizontal scrolling trajectory mechanics.
- **Lenis Smooth Scroll**: Guarantees consistent, high-performance inertia scroll behavior across modern browsers.
- **Responsive Layout**: Fluidly adapting from 4K displays down to standard tablet and mobile viewports.

---

## 📂 Project Structure

```
/project-root
│
├── index.html          # Semantic HTML5 Layout & CDN imports
├── css/
│   └── style.css       # Corporate styling, responsive variables & custom scroll
├── js/
│   └── main.js        # Three.js canvas setup, Lenis scroll, GSAP ScrollTrigger, form logic
├── assets/
│   ├── images/         # Cinematic AI-generated high-fidelity PNG assets
│   │   ├── hero_bg.png
│   │   ├── parts_bg.png
│   │   ├── workshop_bg.png
│   │   ├── used_cars_bg.png
│   │   └── shipping_bg.png
│   └── icons/          # Directory for logo and custom assets
└── README.md           # Documentation
```

---

## 🚀 Quick Start / Development

1. Clone or download this project folder.
2. Since the background utilizes **Three.js**, you can run the files via a local development server to avoid CORS issues if assets or modules are imported in the future.
3. To start a local server using python:
   ```bash
   python -m http.server 8000
   ```
   Or using Node.js:
   ```bash
   npx serve .
   ```
4. Navigate to `http://localhost:8000` (or the respective port) in your web browser.
5. Smooth scrolling, custom cursor hover morphs, horizontal timeline scrubbing, and the Three.js 3D grid will initialize automatically.
