/* ============================================================
   BNP INTERIORS – Architecture & Interior Design
   Enhanced JavaScript: Animations, Scroll Effects & Micro-Interactions
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ---- Page Loader (Smooth Preloader Animation & Safe Dismiss) --
  const loader = document.getElementById('page-loader');
  if (loader) {
    const dismissLoader = () => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 550);
      }
    };

    // Show smooth loader bar animation then fade out after 450ms
    setTimeout(dismissLoader, 450);
    window.addEventListener('load', dismissLoader);
  }

  // ---- Scroll Reading Progress Bar & Header Scroll Behaviour ----
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress-bar');

  const updateScroll = () => {
    const scrollY = window.scrollY;
    
    // Toggle header scrolled class
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Update scroll progress bar
    if (progressBar) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // ---- Mobile Menu Toggle ------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ---- Hero Slider --------------------------------------------
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let current = 0;
    let interval;

    const goTo = (index) => {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    };

    const startAuto = () => {
      interval = setInterval(() => goTo(current + 1), 6000);
    };

    const stopAuto = () => clearInterval(interval);

    document.getElementById('hero-next')?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    document.getElementById('hero-prev')?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    });

    startAuto();
  }

  // ---- Services Tabs ------------------------------------------
  const tabNav = document.getElementById('services-tab-nav');
  const tabContent = document.getElementById('services-tab-content');
  if (tabNav && tabContent) {
    const tabBtns = tabNav.querySelectorAll('.tab-btn');
    const tabPanels = tabContent.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.tab, 10);
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (tabPanels[idx]) {
          tabPanels[idx].classList.add('active');
        }
      });
    });
  }

  // ---- Projects Filter (8 Categories) -------------------------
  const filterNav = document.getElementById('projects-filter');
  const projectsGrid = document.getElementById('projects-grid') || document.getElementById('projects-slider-track');
  if (filterNav && projectsGrid) {
    const filterBtns = filterNav.querySelectorAll('.filter-btn');
    const cards = projectsGrid.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = '';
            card.style.animation = 'tabFadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Check URL parameters for active filters on load (projects.html redirect check)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      const matchBtn = Array.from(filterBtns).find(btn => btn.getAttribute('data-filter') === filterParam);
      if (matchBtn) {
        setTimeout(() => matchBtn.click(), 100);
      }
    }
  }

  // ---- Project Overview Grid Interactivity --------------------
  const catCards = document.querySelectorAll('.overview-cat-card');
  const projectShowcaseSec = document.getElementById('projects-showcase-section');

  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat');
      
      // If we are on index.html, click the matching filter button on the projects showcase slider
      if (filterNav && projectsGrid) {
        const filterBtns = filterNav.querySelectorAll('.filter-btn');
        const matchBtn = Array.from(filterBtns).find(btn => btn.getAttribute('data-filter') === cat);
        if (matchBtn) {
          matchBtn.click();
        }

        // Smooth scroll to projects section
        if (projectShowcaseSec) {
          projectShowcaseSec.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If we are on other pages, redirect to projects.html with filter parameter
        window.location.href = `projects.html?filter=${cat}`;
      }
    });
  });

  // ---- Testimonials Slider ------------------------------------
  const testSlider = document.getElementById('testimonials-slider');
  if (testSlider) {
    const cards = testSlider.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.test-dot');
    let testCurrent = 0;

    const goTest = (index) => {
      cards[testCurrent].classList.remove('active');
      if (dots[testCurrent]) dots[testCurrent].classList.remove('active');
      testCurrent = (index + cards.length) % cards.length;
      cards[testCurrent].classList.add('active');
      if (dots[testCurrent]) dots[testCurrent].classList.add('active');
    };

    document.getElementById('test-next')?.addEventListener('click', () => goTest(testCurrent + 1));
    document.getElementById('test-prev')?.addEventListener('click', () => goTest(testCurrent - 1));

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTest(i));
    });

    setInterval(() => goTest(testCurrent + 1), 6000);
  }

  // ---- Scroll to Top ------------------------------------------
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll Animation Observer -----------------------------
  const scrollAnimObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('in-view');

        // Trigger counter animation if element is a stat value
        if ((el.classList.contains('stat-value') || el.classList.contains('stat-num') || el.classList.contains('badge-num')) && !el.classList.contains('counted')) {
          el.classList.add('counted');
          animateCounter(el);
        }

        // Trigger skill bar animation
        if (el.classList.contains('skills-bars')) {
          el.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.classList.add('animate');
          });
        }

        scrollAnimObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe all animated targets
  document.querySelectorAll('[data-anim], [data-anim-stagger], .stat-value, .stat-num, .badge-num, .skills-bars, .text-reveal, .line-draw').forEach(el => {
    scrollAnimObserver.observe(el);
  });

  // ---- Counter Animation Function -----------------------------
  function animateCounter(el) {
    const dataTargetAttr = el.getAttribute('data-target');
    let target = 0;
    let prefix = '';
    let suffix = '';
    let hasComma = false;

    if (dataTargetAttr) {
      target = parseInt(dataTargetAttr.replace(/,/g, ''), 10);
      hasComma = dataTargetAttr.includes(',');
    } else {
      const originalText = el.textContent.trim();
      const match = originalText.match(/^([^0-9,]*)([0-9,]+)([^0-9,]*)$/);
      if (!match) return;
      prefix = match[1];
      const rawNum = match[2].replace(/,/g, '');
      suffix = match[3];
      target = parseInt(rawNum, 10);
      hasComma = match[2].includes(',');
    }

    if (isNaN(target)) return;

    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out expo
      const current = Math.floor(target * (1 - Math.pow(2, -10 * progress)));
      
      let formattedNum = current.toString();
      if (hasComma || target >= 1000) {
        formattedNum = current.toLocaleString('en-IN');
      }
      
      el.textContent = prefix + formattedNum + suffix;

      if (frame >= totalFrames) {
        let finalNum = target.toString();
        if (hasComma || target >= 1000) {
          finalNum = target.toLocaleString('en-IN');
        }
        el.textContent = prefix + finalNum + suffix;
        clearInterval(timer);
      }
    }, frameRate);
  }

  // ---- Scroll Parallax Effect for Banner & Hero Backgrounds --
  const parallaxImages = document.querySelectorAll('.cta-section, .page-hero');
  if (parallaxImages.length > 0 && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const pageTop = window.scrollY;
      parallaxImages.forEach(sec => {
        const speed = 0.35;
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const yPos = -(pageTop * speed);
          sec.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
        }
      });
    }, { passive: true });
  }

  // ---- Interactive Sticky Horizontal Scroll Timeline ---------
  const timelineSection = document.getElementById('journey-timeline');
  const timelineSticky = timelineSection ? timelineSection.querySelector('.timeline-sticky-wrapper') : null;
  const timelineViewport = document.getElementById('timeline-horizontal-viewport');
  const timelineContainer = document.getElementById('timeline-3d-container');
  const timelineCards = document.querySelectorAll('.timeline-card');
  const bottomFill = document.getElementById('timeline-bottom-progress');
  const trackProgress = document.getElementById('timeline-track-progress');

  if (timelineSection && timelineContainer && timelineCards.length > 0) {
    
    // Function to calculate and update sizes dynamically based on actual width
    const updateTimelineDimensions = () => {
      const isDesktop = window.innerWidth > 768;
      
      if (isDesktop) {
        // Calculate the total scrollable width of the timeline
        const containerWidth = timelineContainer.scrollWidth;
        const viewportWidth = window.innerWidth;
        
        // Horizontal distance the timeline needs to scroll:
        // We want the last card to fully reveal and center, so add some extra end padding
        const maxTranslate = Math.max(0, containerWidth - viewportWidth + (viewportWidth * 0.1));
        
        // Make the vertical section height directly proportional to the horizontal scrollable width!
        // Scroll travel = maxTranslate. Adding window.innerHeight keeps it sticky for exactly that scroll travel.
        const scrollHeight = maxTranslate + window.innerHeight;
        timelineSection.style.height = `${scrollHeight}px`;
      } else {
        timelineSection.style.height = 'auto';
      }
    };

    // Calculate dimensions on load and resize
    window.addEventListener('resize', updateTimelineDimensions);
    setTimeout(updateTimelineDimensions, 300);

    const updateScrollState = () => {
      const isDesktop = window.innerWidth > 768;
      let lastActiveCard = null;
      
      if (isDesktop) {
        const sectionRect = timelineSection.getBoundingClientRect();
        const sectionHeight = timelineSection.offsetHeight;
        const windowHeight = window.innerHeight;

        // Start scroll is when the top of the section hits the top of viewport
        const startScroll = window.pageYOffset + sectionRect.top;
        const totalScrollable = sectionHeight - windowHeight;
        const currentScroll = window.pageYOffset - startScroll;

        // Calculate progress percentage (0 to 1)
        let pct = currentScroll / totalScrollable;
        pct = Math.max(0, Math.min(1, pct));

        // Calculate translation
        const containerWidth = timelineContainer.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxTranslate = Math.max(0, containerWidth - viewportWidth + (viewportWidth * 0.1));
        const currentTranslate = pct * maxTranslate;
        
        // Translate track
        timelineContainer.style.transform = `translateX(-${currentTranslate}px)`;

        // Update bottom progress bar
        if (bottomFill) {
          bottomFill.style.width = `${pct * 100}%`;
        }

        // Highlight active cards based on horizontal viewport position
        timelineCards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          // Card is active when it occupies the center area of screen
          if (cardRect.left < window.innerWidth * 0.65) {
            card.classList.add('active');
            lastActiveCard = card;
          } else {
            card.classList.remove('active');
          }
        });
      } else {
        // Mobile horizontal swiping active cards observer
        timelineContainer.style.transform = '';
        
        timelineCards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          // Active card is the one sitting in the left-center of mobile screen
          if (cardRect.left < window.innerWidth * 0.7) {
            card.classList.add('active');
            lastActiveCard = card;
          } else {
            card.classList.remove('active');
          }
        });
      }

      // Default to first card if none are active
      if (!lastActiveCard && timelineCards.length > 0) {
        lastActiveCard = timelineCards[0];
        lastActiveCard.classList.add('active');
      }

      // Draw progress line exactly to the center of the last active card's node
      if (lastActiveCard && trackProgress) {
        const node = lastActiveCard.querySelector('.timeline-card-node');
        if (node) {
          const nodeX = lastActiveCard.offsetLeft + node.offsetLeft + node.offsetWidth / 2;
          trackProgress.style.width = `${nodeX}px`;
        }
      }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    if (timelineViewport) {
      timelineViewport.addEventListener('scroll', updateScrollState, { passive: true });
    }
    updateScrollState();
  }

  // ---- Lightbox for Gallery & Portfolio Images ---------------
  const galleryItems = document.querySelectorAll('.gallery-strip-item img, .project-img-wrap img, .about-img-main img');
  galleryItems.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(17,17,18,0.94); z-index: 99999;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      backdrop-filter: blur(10px); animation: tabFadeIn 0.3s ease;
    `;
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt || '';
    image.style.cssText = 'max-width: 90vw; max-height: 88vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position: absolute; top: 24px; right: 32px; background: none; border: none;
      color: #fff; font-size: 2.2rem; cursor: pointer; opacity: 0.8; transition: opacity 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
    closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

    overlay.appendChild(image);
    overlay.appendChild(closeBtn);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) document.body.removeChild(overlay); });
    document.body.appendChild(overlay);

    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape' && document.body.contains(overlay)) {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', esc);
      }
    });
  }

  // ---- Active Menu Link Highlighting ------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Form Submission Feedback ------------------------------
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector('button');
      if (input && input.value) {
        const origText = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#caa05c';
        btn.style.borderColor = '#caa05c';
        btn.style.color = '#1c1c1d';
        input.value = '';
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 3000);
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        const origText = btn.innerHTML;
        btn.innerHTML = '✓ Message Sent Successfully!';
        btn.style.background = '#caa05c';
        btn.style.borderColor = '#caa05c';
        btn.style.color = '#1c1c1d';
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
          contactForm.reset();
        }, 3500);
      }
    });
  }

  // ---- Projects Slider Handler --------------------------------
  const projTrack = document.getElementById('projects-slider-track');
  const projPrev = document.getElementById('projects-slider-prev');
  const projNext = document.getElementById('projects-slider-next');

  if (projTrack) {
    const cardScrollDist = 360;
    if (projPrev) projPrev.addEventListener('click', () => projTrack.scrollBy({ left: -cardScrollDist * 2, behavior: 'smooth' }));
    if (projNext) projNext.addEventListener('click', () => projTrack.scrollBy({ left: cardScrollDist * 2, behavior: 'smooth' }));
  }



  // 3D Card Dynamic Perspective Mouse Tilt
  document.querySelectorAll('.timeline-content').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -9;
      const tiltY = (x / (rect.width / 2)) * 9;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px) scale(1.025)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)`;
    });
  });

  // ---- Dynamic Mouse Follower Ambient Glow -------------------
  if (window.innerWidth > 992) {
    const mouseGlow = document.createElement('div');
    mouseGlow.className = 'mouse-glow-element';
    document.body.appendChild(mouseGlow);

    let moveTimeout;
    window.addEventListener('mousemove', (e) => {
      document.body.classList.add('mouse-moving');
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        document.body.classList.remove('mouse-moving');
      }, 1000);
    }, { passive: true });
  }

});
