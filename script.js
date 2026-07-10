/* ============================================================
   LAWRENCE PORTFOLIO — Script
   All interactive features: nav, scroll, particles,
   contact form, project modal, typing animation, etc.
   ============================================================ */

// ─── Loader (runs before DOMContentLoaded) ───
;(function() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  if (sessionStorage.getItem('lp-visited')) {
    loader.remove();
    return;
  }
  sessionStorage.setItem('lp-visited', '1');
  function hideLoader() {
    loader.classList.add('hidden');
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 550);
  }
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 1400);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1000));
  }
})();

// EmailJS is initialized in HTML via ES module import
let emailjsReady = false;

// Function to ensure EmailJS is ready
function ensureEmailJSReady() {
  return new Promise((resolve) => {
    // Check if EmailJS is available from the module import
    if (typeof window.emailjs !== 'undefined' && window.emailjs.send) {
      emailjsReady = true;
      console.log('✅ EmailJS v4 is ready');
      resolve(true);
    } else {
      // Wait for EmailJS to load
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = setInterval(() => {
        if (typeof window.emailjs !== 'undefined' && window.emailjs.send) {
          emailjsReady = true;
          console.log('✅ EmailJS v4 loaded and ready');
          clearInterval(checkInterval);
          resolve(true);
        } else if (attempts >= maxAttempts) {
          console.error('❌ EmailJS failed to load after multiple attempts');
          clearInterval(checkInterval);
          resolve(false);
        }
        attempts++;
      }, 100);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Ensure EmailJS is ready
  ensureEmailJSReady();

  // ─── Certifications Data ───
  const certifications = [
    {
      title: 'OCI 2025 Certified Generative AI Professional',
      provider: 'Oracle Cloud Infrastructure (OCI)',
      year: '2025',
      image: '/badges/oci-gen-ai.png',
      verifyLink: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=3EB572DD3D34A43BCE970A54F66E101690930394DDA52A9F56A561783AFE6C58',
    },
    {
      title: 'OCI 2025 Certified AI Foundations Associate',
      provider: 'Oracle Cloud Infrastructure (OCI)',
      year: '2025',
      image: '/badges/oci-ai-foundations.png',
      verifyLink: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=FC015617CF2E6357A6D4A10F3744606B15038602579AABE43333216C5BFADE04',
    },
    {
      title: 'Multicloud Network Associate',
      provider: 'Aviatrix',
      year: '2025',
      image: '/badges/aviatrix-ace.png',
      verifyLink: 'https://www.credly.com/badges/a90eb6d7-3f87-41c9-be3e-376f73ef7021/linked_in_profile',
    },
    {
      title: 'Programming (JAVA) National Certificate (NCIII)',
      provider: 'Technical Education and Skills Development Authority (TESDA)',
      year: '2025',
      image: '/badges/tesda-java.png',
      verifyLink: '',
    },
    {
      title: 'AI Fundamentals',
      provider: 'DataCamp',
      year: '2025',
      image: '/badges/datacamp-ai.avif',
      verifyLink: 'https://www.datacamp.com/skill-verification/AIF0022200308048',
    },
    {
      title: 'Data Literacy',
      provider: 'DataCamp',
      year: '2025',
      image: '/badges/datacamp-data.avif',
      verifyLink: 'https://www.datacamp.com/skill-verification/DL0030908107146',
    },
  ];

  // ─── Year ───
  document.getElementById('year').textContent = new Date().getFullYear();

  // ─── Mobile Nav ───
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── Unified Scroll Handler (nav, progress bar, back-to-top) ───
  // One rAF-throttled listener instead of four; writes only, no layout reads.
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  let scrollTicking = false;

  const onScroll = () => {
    const scrollTop = window.scrollY;
    nav.classList.toggle('scrolled', scrollTop > 60);
    backToTop.classList.toggle('visible', scrollTop > 600);
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgress.style.transform = `scaleX(${pct})`;
    }
    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  // ─── Active Nav Link (Scroll Spy) ───
  // IntersectionObserver — no per-scroll offsetTop/offsetHeight reads.
  const navLinkEls = document.querySelectorAll('.nav__link');
  const setActiveNav = (id) => {
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-nav') === id);
    });
  };
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveNav(entry.target.id);
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  document.querySelectorAll('section[id]').forEach(s => spyObserver.observe(s));

  // ─── Custom Cursor ───
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    const DOT_R  = 3;   // half of 6px dot
    const RING_R = 16;  // half of 32px ring

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let lastT  = performance.now();

    // Dot: instant via transform — zero layout cost
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX - DOT_R}px, ${mouseY - DOT_R}px)`;
    }, { passive: true });

    // Ring: frame-rate-independent lerp (smooth at any hz)
    (function animateRing(time) {
      const dt     = Math.min(time - lastT, 50);
      lastT        = time;
      // alpha=0.18 @ 60fps — stays consistent at 30/60/120/144hz
      const factor = 1 - Math.pow(0.82, dt / 16.67);
      ringX += (mouseX - ringX) * factor;
      ringY += (mouseY - ringY) * factor;
      cursorRing.style.transform = `translate(${ringX - RING_R}px, ${ringY - RING_R}px)`;
      requestAnimationFrame(animateRing);
    })(performance.now());

    const hoverSel = 'a, button, .project-card, .stack-pill, .cert-card, .leadership-card, input, textarea, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-clicking'));
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  // ─── Theme Toggle ───
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('lp-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
  }
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('lp-theme', isLight ? 'light' : 'dark');
  });

  // ─── Stats Count-Up ───
  const statNumbers = document.querySelectorAll('.stat-item__number[data-target]');
  if (statNumbers.length) {
    const countUpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();
        (function tick(now) {
          const elapsed = now - start;
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(eased * target);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        })(performance.now());
        countUpObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => countUpObserver.observe(el));
  }

  // ─── Scroll Reveal ───
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Render Certification Badges ───
  const certificationsList = document.getElementById('certificationsList');
  if (certificationsList) {
    certificationsList.textContent = 'Loading certifications...';
    certificationsList.innerHTML = certifications.map((cert, index) => {
      const hasLink = !!cert.verifyLink;
      const Tag = hasLink ? 'a' : 'div';
      const delayClass = '';
      const linkAttrs = hasLink
        ? `href="${cert.verifyLink}" target="_blank" rel="noopener noreferrer"`
        : '';

      const externalIcon = hasLink ? '<span class="cert-card__external" aria-hidden="true">↗</span>' : '';

      return `
        <${Tag} class="cert-card ${delayClass}" ${linkAttrs}>
          <div class="cert-card__badge">
            <img src="${cert.image}" alt="${cert.title} badge" class="cert-card__badge-img" loading="lazy" />
          </div>
          <div class="cert-card__body">
            <h4 class="cert-card__title">
              ${cert.title}
              ${externalIcon}
            </h4>
            <p class="cert-card__issuer">${cert.provider}</p>
            <p class="cert-card__date">${cert.year}</p>
          </div>
        </${Tag}>
      `;
    }).join('');

    console.log(`✅ Certifications rendered: ${certifications.length}`);
  }

  // ─── Back to Top ───
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Contact Form Validation & Submission ───
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate name
    const nameVal = document.getElementById('name').value.trim();
    if (!nameVal) {
      document.getElementById('nameGroup').classList.add('error');
      valid = false;
    } else {
      document.getElementById('nameGroup').classList.remove('error');
    }

    // Validate email
    const emailVal = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      document.getElementById('emailGroup').classList.add('error');
      valid = false;
    } else {
      document.getElementById('emailGroup').classList.remove('error');
    }

    // Validate subject
    const subjectVal = document.getElementById('subject').value.trim();
    if (!subjectVal) {
      document.getElementById('subjectGroup').classList.add('error');
      valid = false;
    } else {
      document.getElementById('subjectGroup').classList.remove('error');
    }

    // Validate message
    const messageVal = document.getElementById('message').value.trim();
    if (!messageVal) {
      document.getElementById('messageGroup').classList.add('error');
      valid = false;
    } else {
      document.getElementById('messageGroup').classList.remove('error');
    }

    if (valid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg>
        Sending...
      `;

      // Ensure EmailJS is ready before sending
      ensureEmailJSReady().then((ready) => {
        if (!ready) {
          console.error('EmailJS not available');
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send Message
          `;
          showToast('❌ Email service not available. Refresh page and try again.');
          return;
        }

        try {
          console.log('Sending email with data:', { from_name: nameVal, from_email: emailVal, subject: subjectVal });

          // Send email using EmailJS
          emailjs.send('service_oxo99ul', 'template_381oosj', {
            from_name: nameVal,
            from_email: emailVal,
            subject: subjectVal,
            message: messageVal,
            to_email: 'paneslawrence8@gmail.com',
          }).then((response) => {
            console.log('✅ Email sent successfully:', response);
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            showToast('✅ Message sent successfully!');

            // Store message in localStorage as backup
            const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
            messages.push({
              name: nameVal,
              email: emailVal,
              subject: subjectVal,
              message: messageVal,
              timestamp: new Date().toISOString(),
            });
            localStorage.setItem('portfolio_messages', JSON.stringify(messages));
          }).catch((error) => {
            console.error('❌ EmailJS Error:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send Message
            `;
            showToast(`❌ Failed to send message: ${error.text || error.message}`);
          });
        } catch (error) {
          console.error('❌ Form submission error:', error);
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send Message
          `;
          showToast('❌ An error occurred. Please try again.');
        }
      });
    }
  });

  // Clear error on input
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });

  // ─── Competition → Project cross-link highlight ───
  document.querySelectorAll('.competition-item__project-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const key = link.dataset.projectLink;
      if (!key) return;
      const projectsSection = document.getElementById('projects');
      const card = document.querySelector(`.project-card[data-project="${key}"]`);
      if (!projectsSection || !card) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const header = projectsSection.querySelector('.section-header') || projectsSection;
      const navHeight = nav.offsetHeight;
      const top = header.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      window.setTimeout(() => {
        card.classList.add('project-card--highlight');
        window.setTimeout(() => {
          card.classList.remove('project-card--highlight');
        }, 1500);
      }, 700);
    });
  });

  // ─── Project Modal ───
  const projectData = {
    kalinga: {
      title: 'Kalinga',
      desc: 'Kalinga (Filipino for "care") is a React Native app addressing unique mental health challenges faced by BPO agents working overnight shifts. Combines mood tracking, guided breathing exercises, sleep logging, and AI-driven peer support to help users build resilience against burnout, isolation, and circadian disruption.',
      image: 'assets/project-hyperledger.jpg',
      tags: ['React Native', 'Expo', 'TypeScript', 'NativeWind', 'Supabase'],
      features: [
        'Mood + sleep tracking with night-shift-aware analytics',
        'Guided breathing & grounding exercises',
        'AI companion for late-night check-ins',
        'Anonymous peer support community',
        'Supabase-backed secure profile + history',
      ],
      liveUrl: '',
      sourceUrl: 'https://github.com/lauurnce/habi-4.0-ws-2026',
    },
    '02a-manila': {
      title: 'Zero to Agent Manila — Official Website',
      desc: 'Built and shipped the official Next.js site for Zero to Agent Manila 2026, an AI/agent developer event in the Philippines. Designed for fast load, mobile-first browsing, and conversion-driven CTAs covering schedule, speakers, venue, and registration.',
      image: 'assets/project-nebula.jpg',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      features: [
        'Responsive event landing with hero + agenda',
        'Speaker and sponsor showcase',
        'Registration CTA flow',
        'Optimized SEO + OpenGraph cards',
        'Deployed on Vercel edge',
      ],
      liveUrl: 'https://02a-manila-2026.vercel.app',
      sourceUrl: 'https://github.com/lauurnce/02a-manila-2026',
    },
    greenproof: {
      title: 'GreenProof',
      desc: 'GreenProof tackles Quezon City\'s 2,500-metric-ton daily waste problem by incentivizing recycling at the barangay level. Residents earn Stellar XLM for verified plastic deposits (1kg = 1 Impact Point), with all transactions recorded on a transparent on-chain ledger. Barangays and LGUs manage collection points and verification, turning waste segregation into a community-owned economic system.',
      image: 'assets/project-amberflow.jpg',
      tags: ['Rust', 'Stellar', 'Soroban', 'Web3', 'TypeScript'],
      features: [
        'On-chain Impact Points ledger (Stellar Testnet)',
        '1kg plastic = 1 XLM reward smart contract logic',
        'Barangay/LGU verification + collection point management',
        'Resident dashboard for tracking contributions',
        'Transparent auditable rewards via Soroban',
      ],
      liveUrl: 'https://stellar.expert/explorer/testnet/contract/CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG',
      sourceUrl: 'https://github.com/lauurnce/greenproof-ph',
    },
  };



  
  // ─── Competition Gallery Data ───
  const competitionGalleryData = {
    habi40: {
      title: 'Presidential Annual Innovation Hackathon (HABI 4.0)',
      date: 'Apr 2026',
      badge: 'silver', badgeText: '2nd Place',
      images: [
        'assets/competitions/habi40/1.jpg',
        'assets/competitions/habi40/2.jpg',
        'assets/competitions/habi40/3.jpg',
        'assets/competitions/habi40/4.jpg',
        'assets/competitions/habi40/5.jpg',
      ],
      story: `The core problem we solved: BPO agents wait days — sometimes weeks — just to get a Letter of Authority (LOA) from their HMO before they can see a doctor. When the issue is mental health, that wait is dangerous.\n\nKalinga cuts that entire pipeline. The app has a built-in triage system that initially assesses the agent's condition — severity, urgency, type of concern. Once the app determines the LOA is warranted, it facilitates approval and directly connects the agent to their HMO provider. No paperwork lag. No waiting on HR to process a referral at 3AM.\n\nWe designed everything around the night-shift reality: triage prompts timed to shift start and end, AI-guided check-ins at peak burnout hours, and an anonymous peer support layer for agents who can't reach anyone mid-shift.\n\nAwarded 2nd Place at the Presidential Annual Innovation Hackathon (HABI 4.0), a nationwide competition held at the Malacañang grounds.`,
      projectLink: '#projects', projectLinkText: 'View Project: Kalinga',
    },
    zerovector: {
      title: 'Zero Vector Ventures Hackathon',
      date: 'Mar 2026',
      badge: 'bronze', badgeText: '3rd Place',
      images: [
        'assets/competitions/zerovector/1.jpg',
        'assets/competitions/zerovector/2.jpg',
        'assets/competitions/zerovector/3.jpg',
      ],
      story: `Competed as a duo at Zero Vector Ventures — the first venture capital hackathon in the Philippines — and placed 3rd.\n\nOur task wasn't just to build a product. It was to prove a problem is venture backable: real, large, and significant enough that investors should care.\n\nWe made the case around BPO companies and the financial hemorrhage caused by mental health issues in the workforce. The data is stark — Philippine BPOs lose significant revenue annually to absenteeism, turnover, and productivity loss directly tied to unaddressed mental health. The root cause: triage systems are broken. Agents wait weeks for LOA approvals just to access their HMO benefits, by which point the damage is already done.\n\nWe proved the problem size, quantified the loss, and showed that the status quo is too costly to ignore — the exact framing that makes a problem fundable.`,
      projectLink: '', projectLinkText: '',
    },
    stellar: {
      title: 'Stellar PH Online Bootcamp',
      date: 'Mar 2026',
      badge: 'gold', badgeText: 'Winner',
      images: [],
      story: `Won the Stellar Philippines Web3/Blockchain online bootcamp by shipping GreenProof — a Recycle-to-Earn smart contract built on Stellar Soroban using Rust.\n\nQuezon City generates over 2,500 metric tons of solid waste daily, collected only twice a week, with almost no incentive for residents to segregate properly. GreenProof flips that dynamic: residents bring recyclables to verified collection points, local partners weigh and record the deposit on-chain as Impact Points (1kg = 1 point), and XLM rewards are deposited directly to the resident's Stellar wallet.\n\nEvery transaction is auditable on the Stellar testnet — no trust required from the barangay or the LGU. The smart contract (CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG) handles reward logic end-to-end in Rust, deployed via Soroban. First time I shipped a production smart contract from scratch.`,
      projectLink: '#projects', projectLinkText: 'View Project: GreenProof',
    },
  };

  // ─── Speaking Gallery Data ───
  const speakingGalleryData = {
    acm: {
      title: 'Resource Speaker — ACM Core VerteX @ FEU Institute of Technology',
      date: 'Speaker',
      badge: null,
      images: [
        'assets/leadership/feu tech/download.jpg',
      ],
      story: `Invited as resource speaker at the ACM Core VerteX event held at FEU Institute of Technology. Delivered a tech talk to 40+ students covering practical AI concepts and modern development workflows.\n\nFacilitated a hands-on build-along session using AWS PartyRock, guiding participants through building their first AI-powered application without writing code.\n\nThe session was designed to lower the barrier to AI experimentation for students at any skill level — showing that you don't need to be a machine learning expert to ship something real with AI.`,
      projectLink: '', projectLinkText: '',
    },
    aimaxxin: {
      title: 'Technical Speaker — AI Maxxin On-Site Workshop',
      date: 'Speaker',
      badge: null,
      images: [
        'assets/leadership/ai maxxin/1.jpg',
      ],
      story: `Featured as technical speaker at the AI Maxxin on-site workshop, instructing over 60 participants on advanced Prompt Engineering techniques and practical applications of Langflow.\n\nCovered prompt chaining, context management, and building agentic workflows — translating complex AI concepts into immediately actionable skills.\n\nLangflow demonstrations showed how to build multi-step AI pipelines visually, empowering non-developers to create production-ready AI applications without writing backend code.`,
      projectLink: '', projectLinkText: '',
    },
  };

  // ─── Gallery Modal Logic ───
  const galleryOverlay    = document.getElementById('galleryOverlay');
  const galleryHero       = document.getElementById('galleryHero');
  const galleryHeroImg    = document.getElementById('galleryHeroImg');
  const galleryThumbs     = document.getElementById('galleryThumbs');
  const galleryCounter    = document.getElementById('galleryCounter');
  const galleryTitle      = document.getElementById('galleryTitle');
  const galleryStory      = document.getElementById('galleryStory');
  const galleryDate       = document.getElementById('galleryDate');
  const galleryBadge      = document.getElementById('galleryBadge');
  const galleryProjectLink     = document.getElementById('galleryProjectLink');
  const galleryProjectLinkText = document.getElementById('galleryProjectLinkText');
  const galleryPrev       = document.getElementById('galleryPrev');
  const galleryNext       = document.getElementById('galleryNext');
  const galleryClose      = document.getElementById('galleryClose');

  let galleryImages = [];
  let galleryIdx    = 0;

  function setHeroImage(src) {
    galleryHeroImg.classList.add('fading');
    const heroBg = document.getElementById('galleryHeroBg');
    setTimeout(() => {
      galleryHeroImg.src = src;
      galleryHero.classList.remove('no-img', 'portrait-active');
      if (heroBg) heroBg.style.backgroundImage = `url('${src}')`;
      galleryHeroImg.onload = () => {
        if (galleryHeroImg.naturalHeight > galleryHeroImg.naturalWidth) {
          galleryHero.classList.add('portrait-active');
        }
      };
      galleryHeroImg.onerror = () => galleryHero.classList.add('no-img');
      galleryHeroImg.classList.remove('fading');
    }, 200);
  }

  function renderGallery() {
    setHeroImage(galleryImages[galleryIdx] || '');
    galleryCounter.textContent = `${galleryIdx + 1} / ${galleryImages.length}`;
    galleryPrev.disabled = galleryIdx === 0;
    galleryNext.disabled = galleryIdx === galleryImages.length - 1;

    galleryThumbs.textContent = '';
    galleryImages.forEach((src, i) => {
      const thumb = document.createElement('img');
      thumb.src      = src;
      thumb.alt      = `Photo ${i + 1}`;
      thumb.loading  = 'lazy';
      thumb.className = 'gallery-thumb' + (i === galleryIdx ? ' active' : '');
      thumb.addEventListener('click', () => { galleryIdx = i; renderGallery(); });
      galleryThumbs.appendChild(thumb);
    });
  }

  function openGallery(data) {
    galleryImages = data.images || [];
    galleryIdx    = 0;
    galleryTitle.textContent = data.title;
    galleryStory.textContent = data.story || '';
    galleryDate.textContent  = data.date  || '';

    if (data.badgeText) {
      galleryBadge.textContent  = data.badgeText;
      galleryBadge.className    = `status-badge status-badge--${data.badge}`;
      galleryBadge.style.display = '';
    } else {
      galleryBadge.style.display = 'none';
    }

    if (data.projectLink) {
      galleryProjectLink.href             = data.projectLink;
      galleryProjectLinkText.textContent  = data.projectLinkText;
      galleryProjectLink.style.display    = '';
    } else {
      galleryProjectLink.style.display = 'none';
    }

    const hasImages = galleryImages.length > 0;
    galleryHero.style.display    = hasImages ? '' : 'none';
    galleryThumbs.style.display  = hasImages ? '' : 'none';
    document.getElementById('galleryPrev').style.display    = hasImages ? '' : 'none';
    document.getElementById('galleryNext').style.display    = hasImages ? '' : 'none';
    document.getElementById('galleryCounter').style.display = hasImages ? '' : 'none';
    if (hasImages) renderGallery();
    galleryOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    galleryOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryPrev.addEventListener('click', () => { if (galleryIdx > 0) { galleryIdx--; renderGallery(); } });
  galleryNext.addEventListener('click', () => { if (galleryIdx < galleryImages.length - 1) { galleryIdx++; renderGallery(); } });
  galleryClose.addEventListener('click', closeGallery);
  galleryOverlay.addEventListener('click', (e) => { if (e.target === galleryOverlay) closeGallery(); });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!galleryOverlay.classList.contains('open')) return;
    if (e.key === 'Escape')      closeGallery();
    if (e.key === 'ArrowLeft'  && galleryIdx > 0)                       { galleryIdx--; renderGallery(); }
    if (e.key === 'ArrowRight' && galleryIdx < galleryImages.length - 1) { galleryIdx++; renderGallery(); }
  });

  // Touch swipe (mobile)
  let touchStartX = 0;
  galleryOverlay.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  galleryOverlay.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && galleryIdx < galleryImages.length - 1) { galleryIdx++; renderGallery(); }
    if (dx > 0 && galleryIdx > 0)                        { galleryIdx--; renderGallery(); }
  }, { passive: true });

  // Competition items → gallery
  document.querySelectorAll('.competition-item[data-competition]').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.competition-item__project-link')) return;
      const data = competitionGalleryData[item.dataset.competition];
      if (data) openGallery(data);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  // Speaking cards → gallery
  document.querySelectorAll('.leadership-card[data-speaking]').forEach(card => {
    card.addEventListener('click', () => {
      const data = speakingGalleryData[card.dataset.speaking];
      if (data) openGallery(data);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  const modalOverlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.project;
      const data = projectData[key];
      if (!data) return;

      document.getElementById('modalImage').src = data.image;
      document.getElementById('modalImage').alt = data.title;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalDesc').textContent = data.desc;
      const modalLive = document.getElementById('modalLive');
      const modalSource = document.getElementById('modalSource');
      if (data.liveUrl) {
        modalLive.href = data.liveUrl;
        modalLive.style.display = '';
      } else {
        modalLive.style.display = 'none';
      }
      if (data.sourceUrl) {
        modalSource.href = data.sourceUrl;
        modalSource.style.display = '';
      } else {
        modalSource.style.display = 'none';
      }

      const tagsContainer = document.getElementById('modalTags');
      tagsContainer.innerHTML = data.tags.map(t =>
        `<span class="project-card__tag">${t}</span>`
      ).join('');

      const featuresContainer = document.getElementById('modalFeatures');
      featuresContainer.innerHTML = data.features.map(f =>
        `<li>${f}</li>`
      ).join('');

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ─── Toast ───
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ─── Smooth Scroll for all anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ─── Keyboard / Accessibility ───
  document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
});
