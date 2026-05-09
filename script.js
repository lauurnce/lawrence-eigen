/* ============================================================
   LAWRENCE PORTFOLIO — Script
   All interactive features: nav, scroll, particles,
   contact form, project modal, typing animation, etc.
   ============================================================ */

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
      image: 'assets/project-kalinga.png',
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
      image: 'assets/project-02a-manila.png',
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
      image: 'assets/project-greenproof.png',
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
