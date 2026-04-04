/* ============================================================
   LAWRENCE PORTFOLIO — Script
   All interactive features: nav, scroll, particles,
   contact form, project modal, typing animation, etc.
   ============================================================ */

let emailjsReady = false;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS (with better error handling)
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init('oq3QckoJwy4K07siy');
      emailjsReady = true;
      console.log('✅ EmailJS initialized successfully');
    } catch (error) {
      console.error('❌ EmailJS init error:', error);
    }
  } else {
    console.warn('⚠️ EmailJS library not loaded yet, will retry on form submit');
  }

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

  // ─── Sticky Nav ───
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ─── Active Nav Link (Scroll Spy) ───
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-nav') === id);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ─── Hero Typing Animation ───
  const heroTag = document.getElementById('heroTag');
  const tagPhrases = [
    'Full-Stack Developer & AI Engineer',
    'Building scalable systems',
    'Architecting the future',
    'Open to collaboration',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout;

  function typeWriter() {
    const currentPhrase = tagPhrases[phraseIndex];
    if (isDeleting) {
      heroTag.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      heroTag.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 70;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % tagPhrases.length;
      delay = 500;
    }

    typeTimeout = setTimeout(typeWriter, delay);
  }
  typeWriter();

  // ─── Particle Canvas (Hero Background) ───
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createParticles() {
      particles = [];
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 183, 125, ${p.opacity})`;
        ctx.fill();

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 140, 0, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animFrame = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
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

  // ─── Tech Stack Bar Animation ───
  const stackBars = document.querySelectorAll('.stack-item__bar');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.width + '%';
          bar.classList.add('animate');
          barObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );
  stackBars.forEach(bar => barObserver.observe(bar));

  // ─── Back to Top ───
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

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

      // Check if EmailJS is available, try to init if not
      if (typeof emailjs === 'undefined') {
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
        // Try to initialize if not done yet
        if (!emailjsReady) {
          emailjs.init('oq3QckoJwy4K07siy');
          emailjsReady = true;
        }

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
    }
  });

  // Clear error on input
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });

  // ─── Project Modal ───
  const projectData = {
    hyperledger: {
      title: 'HyperLedger Interface',
      desc: 'A decentralized financial dashboard for real-time asset tracking across multi-chain environments. Built for institutional scalability, this platform aggregates data from Ethereum, Polygon, and Solana into a unified view with sub-second refresh rates.',
      image: 'assets/project-hyperledger.png',
      tags: ['Web3', 'React', 'Solidity', 'Node.js', 'Ethers.js'],
      features: [
        'Multi-chain wallet aggregation with real-time balance tracking',
        'Smart contract interaction panel for DeFi protocols',
        'Portfolio analytics with P&L tracking and risk scoring',
        'WebSocket-powered live transaction feed',
        'Role-based access control for institutional teams',
      ],
      liveUrl: '#',
      sourceUrl: '#',
    },
    nebula: {
      title: 'Nebula OS Kernel',
      desc: 'An experimental microkernel design written entirely in Rust, focusing on memory safety and isolated task execution for edge computing devices. Nebula implements a capability-based security model and a message-passing IPC system.',
      image: 'assets/project-nebula.png',
      tags: ['Rust', 'Systems Programming', 'Low-Level', 'Assembly'],
      features: [
        'Capability-based security model for process isolation',
        'Zero-copy message-passing IPC system',
        'Custom memory allocator with deterministic latency',
        'WASM runtime for sandboxed user-space applications',
        'Tested on ARM Cortex-M and RISC-V targets',
      ],
      liveUrl: '#',
      sourceUrl: '#',
    },
    amberflow: {
      title: 'Amber Flow UI',
      desc: 'A proprietary design system focused on high-density data visualization and terminal-inspired aesthetics. Amber Flow provides 60+ production-ready components, a Figma plugin for design-to-code, and a Storybook documentation site.',
      image: 'assets/project-amberflow.png',
      tags: ['Design System', 'React', 'Figma', 'Storybook', 'CSS'],
      features: [
        '60+ accessible, themeable React components',
        'Figma plugin for automated design token sync',
        'Dark and light mode support with dynamic palettes',
        'Interactive Storybook playground with code examples',
        'Performance-first: tree-shakable, < 30KB gzipped core',
      ],
      liveUrl: '#',
      sourceUrl: '#',
    },
  };

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
      document.getElementById('modalLive').href = data.liveUrl;
      document.getElementById('modalSource').href = data.sourceUrl;

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
