/* ============================================================
   LAWRENCE PORTFOLIO - Script
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
  let hidden = false;
  function hideLoader() {
    if (hidden) return;
    hidden = true;
    loader.classList.add('hidden');
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 550);
  }
  // Short brand beat only - never wait on images/fonts (window.load).
  if (document.readyState !== 'loading') {
    setTimeout(hideLoader, 750);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 750));
  }
  // Failsafe: the page is never stuck behind the loader.
  setTimeout(hideLoader, 2500);
})();

// EmailJS is loaded on demand the first time the contact form is touched -
// it is not part of the initial page load.
let emailjsPromise = null;
function ensureEmailJSReady() {
  if (!emailjsPromise) {
    emailjsPromise = import('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm')
      .then((mod) => {
        const emailjs = mod.default;
        emailjs.init('oq3QckoJwy4K07siy');
        window.emailjs = emailjs;
        return true;
      })
      .catch((err) => {
        console.error('EmailJS failed to load:', err);
        emailjsPromise = null; // allow a retry on the next attempt
        return false;
      });
  }
  return emailjsPromise;
}

document.addEventListener('DOMContentLoaded', () => {
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
  // IntersectionObserver - no per-scroll offsetTop/offsetHeight reads.
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

    // Dot: instant via transform - zero layout cost
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX - DOT_R}px, ${mouseY - DOT_R}px)`;
    }, { passive: true });

    // Ring: frame-rate-independent lerp (smooth at any hz)
    (function animateRing(time) {
      const dt     = Math.min(time - lastT, 50);
      lastT        = time;
      // alpha=0.18 @ 60fps - stays consistent at 30/60/120/144hz
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
  // (initial theme class is applied by the inline script in <head>)
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('lp-theme', isLight ? 'light' : 'dark');
  });

  // ─── Tech Stack Marquee ───
  // A single lane whose moving units are whole category blocks. It drifts
  // continuously, pauses when you point at it, and can be dragged to scrub.
  // The loop only runs while the section is on screen, so the page is not
  // animating for viewers who never scroll this far.
  (function initStackMarquee() {
    const lane = document.getElementById('stackLane');
    const track = document.getElementById('stackTrack');
    if (!lane || !track) return;

    // Reduced motion: leave the lane as a plain scrollable strip (see styles.css).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const BASE_SPEED = 34;   // px per second at rest
    const EASE = 0.1;        // how quickly speed settles toward its target

    const originals = [...track.children];
    if (!originals.length) return;

    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return track.scrollWidth + gap;
    };

    // Clone whole category blocks until the track is at least twice the lane, so
    // there is always content to wrap into. Clones are decorative: a screen
    // reader should hear the stack once, not repeated.
    const copyWidth = measure();
    if (!copyWidth) return;
    const needed = Math.ceil((lane.clientWidth * 2 + copyWidth) / copyWidth);
    const copies = Math.min(Math.max(needed, 2), 12);
    for (let c = 1; c < copies; c++) {
      originals.forEach(group => {
        const clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    let offset = 0;
    let speed = BASE_SPEED;
    let target = BASE_SPEED;
    let dragging = false;
    let pointerId = null;
    let lastX = 0;
    let velocity = 0;

    const draw = () => {
      // Keep the offset inside one copy so the transform never grows unbounded.
      offset = ((offset % copyWidth) + copyWidth) % copyWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    lane.addEventListener('pointerenter', () => { if (!dragging) target = 0; });
    lane.addEventListener('pointerleave', () => { if (!dragging) target = BASE_SPEED; });

    lane.addEventListener('pointerdown', e => {
      dragging = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      velocity = 0;
      speed = 0;
      target = 0;
      lane.setPointerCapture(e.pointerId);
      lane.classList.add('is-dragging');
      document.body.classList.add('cursor-grabbing');
    });

    lane.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      offset -= dx;          // 1:1 with the pointer
      velocity = dx;         // used as release momentum
      draw();
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (pointerId !== null && lane.hasPointerCapture(pointerId)) {
        lane.releasePointerCapture(pointerId);
      }
      pointerId = null;
      lane.classList.remove('is-dragging');
      document.body.classList.remove('cursor-grabbing');
      // Carry the fling into the loop, then let it decay back to the drift.
      speed = -velocity * 12;
      target = lane.matches(':hover') ? 0 : BASE_SPEED;
    };

    lane.addEventListener('pointerup', endDrag);
    lane.addEventListener('pointercancel', endDrag);

    let rafId = null;
    let last = 0;

    const tick = now => {
      const dt = Math.min((now - last) / 1000, 0.05);  // clamp so tab switches do not jump
      last = now;
      if (!dragging) {
        speed += (target - speed) * EASE;
        offset += speed * dt;
        draw();
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafId !== null) return;
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    draw();

    // Track visibility separately from tab focus: the observer will not re-fire
    // when you return to the tab, so resuming has to consult the remembered state.
    let inView = true;
    const section = document.getElementById('stack');
    if (section && 'IntersectionObserver' in window) {
      inView = false;
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        if (inView && !document.hidden) start(); else stop();
      }, { rootMargin: '150px' }).observe(section);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (inView) start();
    });
  })();

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

  // ─── Stats Breakdown Popovers ───
  const statTriggers = document.querySelectorAll('.stat-item__trigger');
  const closeBreakdowns = () => {
    statTriggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      document.getElementById(trigger.getAttribute('aria-controls')).hidden = true;
    });
  };
  statTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const willOpen = panel.hidden;
      closeBreakdowns();
      if (willOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });
  if (statTriggers.length) {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.stat-item--expandable')) closeBreakdowns();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBreakdowns();
    });
  }

  // ─── Community & Impact Data ───
  // Three tiers, descending emphasis. Adding an entry is one object appended to
  // the right array. Anything with a non-empty `images` becomes clickable and
  // opens the gallery; entries marked `template: true` render as empty slots.
  //
  // Rendered here, ABOVE the scroll-reveal observer below, so the cards exist
  // by the time it collects `.reveal` elements.

  const COMMUNITY_ICONS = {
    mic:   '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    book:  '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    chip:  '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    star:  '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    bolt:  '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    flag:  '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  };

  // Tier 1 - talks delivered and positions held
  // Tier 1 - talks delivered and positions held
  const communitySpeaking = [
    {
      id: 'awspolar', icon: 'layers',
      title: 'Resource Speaker · AWS Learning Club Polar',
      org: 'AWS Learning Club Polar · Santa Rosa, Laguna',
      date: 'Jun 30, 2026',
      images: [
        'assets/speakership/aws-polar/1.jpg',
        'assets/speakership/aws-polar/2.jpg',
        'assets/speakership/aws-polar/3.jpg',
      ],
      desc: 'Taught full stack development by building and deploying a live serverless notes app on DynamoDB, Lambda, API Gateway, IAM, and S3 in eighty minutes, entirely on the AWS Free Tier.',
      story: `On June 30, 2026 in Santa Rosa, Laguna, I taught the full stack development session for the AWS Learning Club Polar workshop series. We built a working serverless notes application and put it on the internet in eighty minutes.\n\nThe build covered the entire request path. Amazon DynamoDB handled persistence, AWS Lambda carried the backend logic, IAM defined the permission boundaries and security posture, API Gateway connected the client to the functions, and Amazon S3 served the frontend as a static site. Every service we touched sits inside the AWS Free Tier, so each attendee could rebuild the whole stack afterwards at zero cost.\n\nTo keep the architecture legible for a mixed room, we ran a single analogy end to end. The dining hall is the frontend, the waiter is the API, the kitchen is the backend, and the fridge is the database. Watching people map those roles onto real AWS services was the part that made the session land.\n\nThe room ranged from students to working professionals, which is the audience serverless suits well, since nobody has to provision or maintain a server to ship something real.`,
    },
    {
      id: 'qq-w1', icon: 'mic',
      title: 'Speaker · Build Nights: Quick Quest Kickoff',
      org: 'AWS User Group Philippines · KiroXQuick program',
      date: 'Jun 19, 2026',
      images: [
        'assets/speakership/quick-quest-w1/1.jpg',
        'assets/speakership/quick-quest-w1/2.jpg',
        'assets/speakership/quick-quest-w1/3.jpg',
        'assets/speakership/quick-quest-w1/4.jpg',
      ],
      desc: 'Opened Build Nights: Quick Quest, a Friday night series under the AWS KiroXQuick program, introducing Amazon Quick to 60 attendees ranging from high school students to PhD holders.',
      story: `On June 19, 2026 I spoke at the kickoff of Build Nights: Quick Quest, a workshop series run under the Amazon Web Services KiroXQuick program.\n\nThe series runs every Friday night from 6 to 9 PM, structured so each session compounds on the one before it rather than standing alone. The kickoff established that arc and introduced Amazon Quick, a service new enough that very few practitioners had hands on time with it yet.\n\nSixty people attended. What made the room work was its range, with high school students, undergraduates, early career professionals, and PhD holders all working through the same material. That spread forces the teaching to stay concrete, because an explanation that only lands for one experience level fails visibly and immediately.`,
    },
    {
      id: 'qq-w6', icon: 'chart',
      title: 'Speaker · Quick Quest Week 6',
      org: 'Build Nights: Quick Quest · AWS User Group Philippines',
      date: 'Jul 24, 2026',
      images: [
        'assets/speakership/quick-quest-w6/1.jpg',
        'assets/speakership/quick-quest-w6/2.jpg',
        'assets/speakership/quick-quest-w6/3.jpg',
        'assets/speakership/quick-quest-w6/4.jpg',
        'assets/speakership/quick-quest-w6/5.jpg',
      ],
      desc: 'Delivered Data and Insights without Enterprise, covering the Flows file upload step, Quick data, the data summarizer pattern, and Create image, so teams could turn their own CSVs into charted insights.',
      story: `On July 24, 2026 I spoke on Data and Insights without Enterprise, the sixth session of Build Nights: Quick Quest.\n\nEach team brought or built a small CSV tied to the problem statement they had been carrying since Week 3. From there they assembled a flow that uploads the file, summarizes it, extracts three to five key insights, and generates a visual from the result. The session worked through the Flows file upload step, Quick data, the data summarizer pattern, and the Create image step.\n\nThe checkpoint was deliberately concrete. Every team had to leave with one insight and one visual drawn from their own data rather than from a sample set.\n\nI also demonstrated Amazon Quick Sight to show what a dedicated business intelligence layer adds on top, but kept it demonstration only so that no team was blocked behind a service they had not provisioned.`,
    },
    {
      id: 'acm', icon: 'flag',
      title: 'Resource Speaker · ACM Core VerteX',
      org: 'FEU Institute of Technology',
      date: 'Speaker',
      images: ['assets/leadership/feu tech/download.jpg'],
      desc: 'Invited speaker at ACM Core VerteX at FEU Institute of Technology. Gave a tech talk to 40+ students and led a hands-on build-along session using AWS PartyRock.',
      story: `Invited as resource speaker at the ACM Core VerteX event held at FEU Institute of Technology. Delivered a tech talk to 40+ students covering practical AI concepts and modern development workflows.\n\nFacilitated a hands-on build-along session using AWS PartyRock, guiding participants through building their first AI-powered application without writing code.\n\nThe goal was to lower the barrier to AI experimentation for students at any skill level. You don't need to be a machine learning expert to ship something real with AI.`,
    },
    {
      id: 'aimaxxin', icon: 'book',
      title: 'Technical Speaker · AI Maxxin',
      org: 'AI Maxxin On-Site Workshop',
      date: 'Speaker',
      images: ['assets/leadership/ai maxxin/1.jpg'],
      desc: 'Featured speaker at the "AI Maxxin" on-site workshop. Taught over 60 participants advanced prompt engineering and how to put Langflow to work.',
      story: `Featured as technical speaker at the AI Maxxin on-site workshop, teaching over 60 participants advanced prompt engineering techniques and practical applications of Langflow.\n\nCovered prompt chaining, context management, and building agentic workflows, turning complex AI concepts into skills people could use the same day.\n\nThe Langflow demos showed how to build multi-step AI pipelines visually, so even non-developers could create production-ready AI applications without writing backend code.`,
    },
    {
      id: 'ailead', icon: 'chip',
      title: 'Department of Artificial Intelligence Lead',
      org: 'AWS Cloud Club PUP',
      date: 'Oct 2025 - Present',
      images: ['assets/speakership/dai/1.jpg'],
      desc: "Onboarded 90+ junior associates and ran online and on-site workshops over 10 months, building the department's learning roadmap along the way.",
      story: '',
    },
    {
      id: 'startupdev', icon: 'users',
      title: 'Associate Start Up Dev Director',
      org: 'AWS User Group Philippines · e:Novators',
      date: 'Role',
      images: ['assets/leadership/startup-dev/1.jpg'],
      desc: 'Built development roadmaps for startups at AWS User Group Philippines e:Novators and designed sandbox environments where teams could experiment freely.',
      story: '',
    },
    {
      id: 'research', icon: 'star',
      title: 'Deputy Head for Research and Extension',
      org: 'IT Students Research Colloquium',
      date: 'Role',
      images: ['assets/leadership/research/1.jpg'],
      desc: 'Ran on-site review sessions, managed documentation, and coordinated over 12 student groups for the IT Students Research Colloquium.',
      story: '',
    },
    {
      id: 'z2a', icon: 'bolt',
      title: 'Technical Lead · Zero to Agent Manila',
      org: 'Vercel Global Build Week · Leap Studios, Makati',
      date: 'Apr 25, 2026',
      images: [
        'assets/speakership/zero-to-agent/1.jpg',
        'assets/speakership/zero-to-agent/2.jpg',
        'assets/speakership/zero-to-agent/3.jpg',
      ],
      desc: "Technical Lead at Vercel's Zero to Agent Manila, part of their Global Build Week flagship event. Led technical sessions and guided participants in building AI agent applications.",
      story: '',
    },
  ];

  // Tier 2 - events helped run without speaking.
  // Quick Quest weeks 2 to 5: technical and curriculum handler, speaker lead.
  const communityOrganizing = [
    {
      id: 'qq-w2',
      title: 'Quick Quest Week 2',
      org: 'Build Nights: Quick Quest · AWS User Group Philippines',
      date: 'Week 2 of 6',
      images: [
        'assets/speakership/quick-quest-w2/1.jpg',
        'assets/speakership/quick-quest-w2/2.jpg',
        'assets/speakership/quick-quest-w2/3.jpg',
        'assets/speakership/quick-quest-w2/4.jpg',
      ],
      contributed: 'Handled the technical setup and curriculum design for the session and led the speaker lineup. 69 participants attended.',
    },
    {
      id: 'qq-w3',
      title: 'Quick Quest Week 3 · Automate Repetitive Tasks with Quick Flows',
      org: 'Build Nights: Quick Quest · AWS User Group Philippines',
      date: 'Week 3 of 6',
      images: [
        'assets/speakership/quick-quest-w3/1.jpg',
        'assets/speakership/quick-quest-w3/2.jpg',
        'assets/speakership/quick-quest-w3/3.jpg',
        'assets/speakership/quick-quest-w3/4.jpg',
      ],
      contributed: 'Wrote the curriculum and ran the technical setup for a session on building NLP flows end to end. 65 participants attended.',
      story: 'Wrote the curriculum and ran the technical setup for Week 3 of Build Nights: Quick Quest. The session covered NLP flow creation and the core step types, including Ask user, Web search, General knowledge, and Reasoning groups, along with @references and the difference between guided and chat run modes. Teams formed on the night, wrote a one line problem statement, and left with a v1 flow running end to end. 65 participants attended.',
    },
    {
      id: 'qq-w4',
      title: 'Quick Quest Week 4 · Spaces and Memory',
      org: 'Build Nights: Quick Quest · AWS User Group Philippines',
      date: 'Week 4 of 6',
      images: [
        'assets/speakership/quick-quest-w4/1.jpg',
        'assets/speakership/quick-quest-w4/2.jpg',
      ],
      contributed: 'Designed the curriculum around Spaces, knowledge bases, file connectors, the Quick data step, and Memory for proactive context. Each team built a shared Space, loaded real documents, then rewired their Week 3 flow to answer from their own files rather than the open web. 54 participants.',
    },
    {
      id: 'qq-w5',
      title: 'Quick Quest Week 5 · Research-in-Flows',
      org: 'Build Nights: Quick Quest · AWS User Group Philippines',
      date: 'Jul 17, 2026',
      images: [
        'assets/speakership/quick-quest-w5/1.jpg',
        'assets/speakership/quick-quest-w5/2.jpg',
        'assets/speakership/quick-quest-w5/3.jpg',
      ],
      contributed: 'Built the curriculum for treating research as a workflow step. Teams added a Research step inside their flow to produce a cited brief feeding their output, tuned the research objective with @references to their own inputs, and steered preferred sources across government, academic, and industry material.',
    },
  ];

  // Tier 3 - events attended
  const communityAttended = [
    {
      id: 'sonai26',
      title: 'State of the Nation in AI 2026',
      org: 'Global AI Council Philippines · GSIS Theater',
      date: 'Jan 2026',
      images: ['assets/events/sonai-2026/1.jpg', 'assets/events/sonai-2026/2.jpg'],
      learned: 'Governance has to move as fast as capability. Strong policy frameworks mean little without execution, so adoption and oversight have to be designed together.',
      story: 'Attended the State of the Nation in AI at the GSIS Theater, hosted by the Global AI Council Philippines. The programme deliberately moved past the hype and focused on the concrete steps needed for AI to build a better society rather than merely faster systems.\n\nThe government and policy panel made the case that the national frameworks are already sound and that execution is the real constraint, covering the TALA model and a broader push to improve digital safety. The MSME session was the most practical, working through why small businesses need documented standard operating procedures before automating anything, how OCR and accreditation systems have matured since 2005, and a field case of reaching farmers in Mindanao through smartphones alone.\n\nThe IT-BPM panel addressed job evolution directly. Entry level roles are shifting while advanced roles expand, and judgment remains the human contribution that current systems cannot replace. The education and research panel resonated most as a student, introducing projects such as iTANONG and ACABAI-PH for digitalizing Filipino language data, alongside commitments to produce more graduates, startups, and finished research.\n\nThe throughline I took away is that technology without principles creates power without purpose, and that governing AI well is an engineering problem as much as a policy one.',
    },
    {
      id: 'bwai25',
      title: 'Build with AI: Developing AI Assistants with Gemini 2.0 and Streamlit',
      org: 'GDG PUP · Polytechnic University of the Philippines',
      date: 'May 2025',
      images: ['assets/events/build-with-ai/1.jpg', 'assets/events/build-with-ai/2.jpg', 'assets/events/build-with-ai/3.jpg'],
      learned: 'A capable model is only half an assistant. Managing conversation state and grounding responses in real context is what separates a demo from something people will actually use.',
      story: 'A GDG PUP build session on assembling a working AI assistant end to end rather than calling a model once and stopping there. The material paired the Gemini 2.0 API with Streamlit, using Gemini for multimodal reasoning and function calling, and Streamlit for a front end that could be stood up in the same sitting.\n\nThe useful part was the plumbing between the two. Session state has to persist across reruns or the assistant forgets the conversation, prompts need structure so the model returns something parseable, and function calling has to be wired to real handlers before the assistant can do anything beyond talk. Streamlit made the iteration loop short enough to test each of those decisions immediately.\n\nI left with a clearer sense of where the engineering effort in an assistant actually sits, which is less in model selection and more in context management, tool wiring, and handling the cases where the model returns something unexpected.',
    },
    {
      id: 'awsaiml25',
      title: 'AWS User Group May Meetup: AI/ML Edition',
      org: 'AWS User Group Philippines · AWS Office, Arthaland',
      date: 'May 2025',
      images: ['assets/events/aws-aiml-meetup/1.jpg', 'assets/events/aws-aiml-meetup/2.jpg'],
      learned: 'Foundation models are most useful treated as managed infrastructure you compose against, not models you train. Bedrock removes the undifferentiated work and leaves the design decisions.',
      story: 'Attended Day 2 of the AWS User Group May Meetup, AI/ML Edition, at the AWS office in Arthaland, a hands-on workshop on foundation models in Amazon Bedrock led by a Principal Developer Advocate at AWS.\n\nWorking in Bedrock directly reframed how I approach model work. Rather than training from scratch, the exercise was selecting an appropriate foundation model, shaping prompts against it, and tuning inference parameters such as temperature and token limits to get output that was consistent enough to build on. Having several models available behind one API made the tradeoffs between them concrete instead of theoretical.\n\nThe wider takeaway was architectural. Treating the model as a managed service moves the hard problems to where they belong, which is prompt design, evaluation, and how the model is integrated into the rest of the system.',
    },
    {
      id: 'limitless25',
      title: 'LIMITLESS: National Youth Summit on Statistics',
      org: 'UP School of Statistics · Diliman',
      date: 'May 2025',
      images: ['assets/events/limitless-2025/1.jpg', 'assets/events/limitless-2025/2.jpg', 'assets/events/limitless-2025/3.jpg'],
      learned: 'Most of the work in data science happens before the analysis. Our team placed 1st in the closing quiz bee, which was a good reminder that fundamentals travel further than tooling.',
      story: 'A full day at the UP School of Statistics that turned out to be one of the most directly useful events I attended. The data science and statistical modeling talks walked through how practitioners collect, clean, and interpret real world data, and the speakers worked from actual project datasets rather than tidy examples, including how they approached analysis and presented findings to non-technical audiences.\n\nThe actuarial session covered the profession from entry paths through to how insurance pricing works underneath, which made the applied side of statistics far more tangible. The afternoon was a hands-on workshop where our group cleaned, analyzed, and visualized a dataset, then had to defend our interpretation of it.\n\nWe closed with a quiz bee and our team placed 1st, which was a genuinely satisfying result given most of us were not statistics majors. The lasting lesson was that the modeling is rarely the bottleneck. Cleaning, framing the question, and communicating the result carry most of the weight.',
    },
    {
      id: 'phtcf25',
      title: 'Philippine Tech Career Fest',
      org: 'NexHire · Metro Manila',
      date: 'Mar 2025',
      images: ['assets/events/ph-tech-career-fest/1.jpg', 'assets/events/ph-tech-career-fest/2.jpg', 'assets/events/ph-tech-career-fest/3.jpg'],
      learned: 'Founders consistently valued demonstrated shipping over credentials, which sharpened how I decided to document and present my own projects.',
      story: 'NexHire brought together internship programmes, early stage companies, and students from across several universities. I spent the day working through what different internship tracks actually involve, which turned out to vary far more than the job titles suggest.\n\nThe founder sessions were the most valuable part. Hearing people describe building companies from nothing, including the parts that did not work, gave a much more honest picture of early stage engineering than a polished case study would. A recurring theme across conversations was that demonstrated work carries more weight than credentials, which directly changed how I decided to document and present my own projects.\n\nThe networking was worth as much as the talks. Connecting with students from other universities working on similar problems has continued to be useful well past the event itself.',
    },
    {
      id: 'arduino25',
      title: 'Arduino Day Philippines 2025',
      org: 'STI College Cubao · Quezon City',
      date: 'Mar 2025',
      images: ['assets/events/arduino-day-2025/1.jpg', 'assets/events/arduino-day-2025/2.jpg', 'assets/events/arduino-day-2025/3.jpg'],
      learned: 'Hardware constraints force a discipline that software rarely demands. Watching teams pitch under real memory and power limits changed how I think about scoping.',
      story: 'Arduino Day Philippines at STI College Cubao, attended with the Institute of Bachelors in Information Technology Studies. The day combined a hackathon, exhibitor booths, and talks from people working in embedded systems.\n\nWatching the hackathon teams pitch was the most instructive part. Building on microcontrollers imposes limits that are easy to ignore in web work, including finite memory, power budgets, and sensor behaviour that does not cooperate, and the strongest teams were the ones that had scoped tightly around those constraints rather than fighting them. The booths made the breadth of the ecosystem clear, from sensors and prototyping boards through to finished products built on the same foundations.\n\nI came away with more respect for the discipline that hardware enforces, and a habit of asking earlier what a system is actually constrained by before deciding what to build.',
    },
    {
      id: 'nuclear25',
      title: 'Igniting Discussion on Nuclear Energy: Balancing Power, Profit, and the Planet',
      org: 'UP Institute of Civil Engineering · Diliman',
      date: 'Mar 2025',
      images: ['assets/events/nuclear-energy/1.jpg', 'assets/events/nuclear-energy/2.jpg', 'assets/events/nuclear-energy/3.jpg'],
      learned: 'Infrastructure decisions are never purely technical. The environmental, economic, and political cases have to hold simultaneously, or the engineering never gets built.',
      story: 'A panel at the UP Institute of Civil Engineering examining nuclear energy from three directions at once, hosted with PUP The Programmers Guild.\n\nThe format was what made it work. The environmental case was presented from the national nuclear research institute, covering waste handling and safety engineering. The economic case came from an economist working through capital costs, financing structures, and the timescales on which such plants return value. The political case was made by a sitting legislator, addressing why technically sound proposals still stall in practice.\n\nHearing all three in sequence made the interdependence unavoidable. A design that is sound on the engineering merits but unfinanceable, or financeable but politically unviable, does not get built. That framing has stayed with me as a general lesson about large systems, which is that feasibility is rarely a single axis, and the constraint that kills a project is often not the technical one.',
    },
    {
      id: 'blockchain25',
      title: 'New Year, New Knowledge: Introduction to Blockchain Technology',
      org: 'The Blocklabs, Inc. · DRRMO Building, Las Pinas',
      date: 'Jan 2025',
      images: ['assets/events/intro-to-blockchain/1.jpg', 'assets/events/intro-to-blockchain/2.jpg'],
      learned: 'Working in Move made the distinction between resource oriented and account oriented models concrete, which is where most of the security reasoning in on-chain code lives.',
      story: 'A full day workshop run by The Blocklabs at the DRRMO Building in Las Pinas, arranged through PUP The Programmers Guild, structured to move from fundamentals into writing code rather than stopping at theory.\n\nThe sessions covered blockchain fundamentals including consensus, immutability, and how transactions are actually settled, then moved into Core DAO and the Move programming language. Move was the part I found most valuable. Its resource oriented model treats assets as types that cannot be silently copied or discarded, which pushes a whole category of bug out of reach at compile time rather than leaving it to be caught in an audit. Coming from conventional account oriented thinking, that was a genuine shift in perspective.\n\nWe closed with NFT creation, which tied the theory to something deployable and made the token standards concrete. The lasting takeaway was less about any single chain and more about how much the underlying data model shapes what is safe to express in on-chain code.',
    },
  ];

  // Gallery entries are derived from the arrays above so each item is defined once.
  const communityGalleryData = {};
  [...communitySpeaking, ...communityOrganizing, ...communityAttended].forEach(item => {
    if (item.images && item.images.length) {
      communityGalleryData[item.id] = {
        title: item.org ? `${item.title} · ${item.org}` : item.title,
        date: item.date || '',
        badge: null,
        images: item.images,
        story: item.story || item.contributed || item.learned || item.desc || '',
        projectLink: '', projectLinkText: '',
      };
    }
  });

  // ─── Render Community & Impact ───
  const escHtml = str => String(str).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const communityIcon = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  const slotIcon = communityIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>');

  const photoBadge = count => `<span class="leadership-card__photo-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>${count} ${count === 1 ? 'photo' : 'photos'}</span>`;

  const galleryAttrs = item => item.images.length
    ? ` data-community="${item.id}" role="button" tabindex="0"`
    : '';

  const speakingGrid = document.getElementById('speakingGrid');
  if (speakingGrid) {
    speakingGrid.innerHTML = communitySpeaking.map((item, i) => {
      const hasImg = item.images.length > 0;
      const classes = ['leadership-card', 'reveal', `reveal-delay-${i % 3 + 1}`];
      if (hasImg) classes.push('has-gallery');
      const media = hasImg
        ? `<div class="leadership-card__img-wrap"><img src="${escHtml(item.images[0])}" alt="${escHtml(item.title)}" class="leadership-card__img" loading="lazy" decoding="async" onerror="this.parentElement.style.display='none'" />${photoBadge(item.images.length)}</div>`
        : '';
      return `<div class="${classes.join(' ')}"${galleryAttrs(item)}>
          ${media}
          <div class="leadership-card__inner">
            <div class="leadership-card__icon">${communityIcon(COMMUNITY_ICONS[item.icon])}</div>
            <h4 class="leadership-card__title">${escHtml(item.title)}</h4>
            <p class="leadership-card__desc">${escHtml(item.desc)}</p>
          </div>
        </div>`;
    }).join('');
  }

  const organizingGrid = document.getElementById('organizingGrid');
  if (organizingGrid) {
    organizingGrid.innerHTML = communityOrganizing.map((item, i) => {
      const hasImg = item.images.length > 0;
      const classes = ['organizing-card', 'reveal', `reveal-delay-${i % 3 + 1}`];
      if (hasImg) classes.push('has-gallery');
      if (item.template) classes.push('is-template');
      const media = hasImg
        ? `<div class="organizing-card__img-wrap"><img src="${escHtml(item.images[0])}" alt="${escHtml(item.title)}" class="organizing-card__img" loading="lazy" decoding="async" onerror="this.parentElement.style.display='none'" /></div>`
        : `<div class="organizing-card__img-wrap slot">${slotIcon}</div>`;
      return `<div class="${classes.join(' ')}"${galleryAttrs(item)}>
          ${media}
          <div class="organizing-card__body">
            <span class="organizing-card__kind">Organizing team</span>
            <h4 class="organizing-card__title">${escHtml(item.title)}</h4>
            <p class="organizing-card__meta">${escHtml(item.org)} · ${escHtml(item.date)}</p>
            <p class="organizing-card__desc">${escHtml(item.contributed)}</p>
          </div>
        </div>`;
    }).join('');
  }

  // Only the three most recent events show by default; the rest sit behind the toggle.
  const ATTENDED_VISIBLE = 3;

  const attendedList = document.getElementById('attendedList');
  if (attendedList) {
    attendedList.innerHTML = communityAttended.map((item, i) => {
      const hasImg = item.images.length > 0;
      const classes = ['attended-row', 'reveal'];
      if (hasImg) classes.push('has-gallery');
      if (item.template) classes.push('is-template');
      if (i >= ATTENDED_VISIBLE) classes.push('attended-row--extra');
      const media = hasImg
        ? `<div class="attended-row__thumb-wrap"><img src="${escHtml(item.images[0])}" alt="${escHtml(item.title)}" class="attended-row__thumb" loading="lazy" decoding="async" onerror="this.parentElement.style.display='none'" /></div>`
        : `<div class="attended-row__thumb-wrap slot">${slotIcon}</div>`;
      return `<div class="${classes.join(' ')}"${galleryAttrs(item)}>
          ${media}
          <div class="attended-row__body">
            <h4 class="attended-row__title">${escHtml(item.title)}</h4>
            <p class="attended-row__meta">${escHtml(item.org)}</p>
            <p class="attended-row__learned"><b>Learned:</b> ${escHtml(item.learned)}</p>
          </div>
          <span class="attended-row__year">${escHtml(item.date)}</span>
        </div>`;
    }).join('');
  }

  const attendedToggle = document.getElementById('attendedToggle');
  const attendedToggleText = document.getElementById('attendedToggleText');
  if (attendedList && attendedToggle && communityAttended.length > ATTENDED_VISIBLE) {
    const hiddenCount = communityAttended.length - ATTENDED_VISIBLE;
    const collapsedLabel = `Show ${hiddenCount} more event${hiddenCount === 1 ? '' : 's'}`;
    attendedToggleText.textContent = collapsedLabel;
    attendedToggle.hidden = false;

    const tierBlock = attendedList.closest('.tier-block');

    attendedToggle.addEventListener('click', () => {
      // Measured before the toggle, while the layout and scroll position are
      // still settled. The tier's own offset does not move when the list
      // collapses, only its height, so this target stays valid afterwards.
      let tierTop = 0;
      for (let el = tierBlock; el; el = el.offsetParent) tierTop += el.offsetTop;
      tierTop -= (nav ? nav.offsetHeight : 0) + 16;
      const wasBelowTier = window.scrollY > tierTop;

      const expanded = attendedList.classList.toggle('is-expanded');
      attendedToggle.setAttribute('aria-expanded', String(expanded));
      attendedToggleText.textContent = expanded ? 'Show less' : collapsedLabel;

      // Collapsing from far down the list would otherwise leave the viewport
      // stranded below the section, so pull the tier header back into view.
      if (!expanded && tierBlock && wasBelowTier) {
        window.scrollTo({ top: tierTop, behavior: 'smooth' });
      }
    });
  }

  // Reads "N items" for real entries, "N slots" while a tier is still all templates.
  const setCount = (id, list) => {
    const el = document.getElementById(id);
    if (!el) return;
    const n = list.length;
    const noun = list.every(i => i.template) ? 'slot' : 'item';
    el.textContent = `${n} ${noun}${n === 1 ? '' : 's'}`;
  };
  setCount('countSpeaking', communitySpeaking);
  setCount('countOrganizing', communityOrganizing);
  setCount('countAttended', communityAttended);

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
  }

  // ─── Back to Top ───
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Contact Form Validation & Submission ───
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // Warm up EmailJS as soon as the visitor starts filling the form,
  // so the library is ready by the time they hit send.
  contactForm.addEventListener('focusin', () => { ensureEmailJSReady(); }, { once: true });

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
          // Send email using EmailJS
          window.emailjs.send('service_oxo99ul', 'template_381oosj', {
            from_name: nameVal,
            from_email: emailVal,
            subject: subjectVal,
            message: messageVal,
            to_email: 'paneslawrence8@gmail.com',
          }).then(() => {
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
      title: 'Zero to Agent Manila Official Website',
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
      story: `The core problem we solved: BPO agents wait days, sometimes weeks, just to get a Letter of Authority (LOA) from their HMO before they can see a doctor. When the issue is mental health, that wait is dangerous.\n\nKalinga cuts that entire pipeline. The app has a built-in triage system that assesses the agent's condition first: severity, urgency, and type of concern. Once the app determines the LOA is warranted, it facilitates approval and directly connects the agent to their HMO provider. No paperwork lag. No waiting on HR to process a referral at 3AM.\n\nWe designed everything around the night-shift reality: triage prompts timed to shift start and end, AI-guided check-ins at peak burnout hours, and an anonymous peer support layer for agents who can't reach anyone mid-shift.\n\nAwarded 2nd Place at the Presidential Annual Innovation Hackathon (HABI 4.0), a nationwide competition held at the Malacañang grounds.`,
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
      story: `Competed as a duo at Zero Vector Ventures, the first venture capital hackathon in the Philippines, and placed 3rd.\n\nOur task wasn't just to build a product. It was to prove a problem is venture backable: real, large, and significant enough that investors should care.\n\nWe made the case around BPO companies and the financial hemorrhage caused by mental health issues in the workforce. The data is stark. Philippine BPOs lose significant revenue every year to absenteeism, turnover, and productivity loss directly tied to unaddressed mental health. The root cause: triage systems are broken. Agents wait weeks for LOA approvals just to access their HMO benefits, by which point the damage is already done.\n\nWe proved the problem size, quantified the loss, and showed that the status quo is too costly to ignore. That's exactly the framing that makes a problem fundable.`,
      projectLink: '', projectLinkText: '',
    },
    stellar: {
      title: 'Stellar PH Online Bootcamp',
      date: 'Mar 2026',
      badge: 'gold', badgeText: 'Winner',
      images: [],
      story: `Won the Stellar Philippines Web3/Blockchain online bootcamp by shipping GreenProof, a Recycle-to-Earn smart contract built on Stellar Soroban using Rust.\n\nQuezon City generates over 2,500 metric tons of solid waste daily, collected only twice a week, with almost no incentive for residents to segregate properly. GreenProof flips that dynamic: residents bring recyclables to verified collection points, local partners weigh and record the deposit on-chain as Impact Points (1kg = 1 point), and XLM rewards are deposited directly to the resident's Stellar wallet.\n\nEvery transaction is auditable on the Stellar testnet, so the barangay and the LGU never have to take anyone's word for it. The smart contract (CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG) handles reward logic end-to-end in Rust, deployed via Soroban. First time I shipped a production smart contract from scratch.`,
      projectLink: '#projects', projectLinkText: 'View Project: GreenProof',
    },
  };

  // ─── Speaking Gallery Data ───
  const speakingGalleryData = {
    acm: {
      title: 'Resource Speaker · ACM Core VerteX @ FEU Institute of Technology',
      date: 'Speaker',
      badge: null,
      images: [
        'assets/leadership/feu tech/download.jpg',
      ],
      story: `Invited as resource speaker at the ACM Core VerteX event held at FEU Institute of Technology. Delivered a tech talk to 40+ students covering practical AI concepts and modern development workflows.\n\nFacilitated a hands-on build-along session using AWS PartyRock, guiding participants through building their first AI-powered application without writing code.\n\nThe goal was to lower the barrier to AI experimentation for students at any skill level. You don't need to be a machine learning expert to ship something real with AI.`,
      projectLink: '', projectLinkText: '',
    },
    aimaxxin: {
      title: 'Technical Speaker · AI Maxxin On-Site Workshop',
      date: 'Speaker',
      badge: null,
      images: [
        'assets/leadership/ai maxxin/1.jpg',
      ],
      story: `Featured as technical speaker at the AI Maxxin on-site workshop, teaching over 60 participants advanced prompt engineering techniques and practical applications of Langflow.\n\nCovered prompt chaining, context management, and building agentic workflows, turning complex AI concepts into skills people could use the same day.\n\nThe Langflow demos showed how to build multi-step AI pipelines visually, so even non-developers could create production-ready AI applications without writing backend code.`,
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
      galleryHero.classList.remove('no-img', 'portrait-active');
      galleryHeroImg.onload = () => {
        if (galleryHeroImg.naturalHeight > galleryHeroImg.naturalWidth) {
          galleryHero.classList.add('portrait-active');
        }
      };
      galleryHeroImg.onerror = () => galleryHero.classList.add('no-img');
      galleryHeroImg.src = src;
      if (heroBg) heroBg.style.backgroundImage = `url('${src}')`;
      galleryHeroImg.classList.remove('fading');
    }, 200);
  }

  // Warm the browser cache for the photos next to the current one so
  // arrow navigation swaps instantly.
  function preloadAdjacent() {
    [galleryIdx - 1, galleryIdx + 1].forEach(i => {
      if (galleryImages[i]) {
        const img = new Image();
        img.src = galleryImages[i];
      }
    });
  }

  function renderGallery() {
    setHeroImage(galleryImages[galleryIdx] || '');
    preloadAdjacent();
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
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
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
