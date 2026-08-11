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
        
        // Calculate scroll progress for mobile based on native horizontal scrolling
        const maxScroll = timelineViewport.scrollWidth - timelineViewport.clientWidth;
        if (maxScroll > 0) {
          const pct = timelineViewport.scrollLeft / maxScroll;
          if (bottomFill) {
            bottomFill.style.width = `${pct * 100}%`;
          }
        }
        
        timelineCards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          // Active card sits in the center viewport of mobile
          if (cardRect.left < window.innerWidth * 0.7 && cardRect.right > window.innerWidth * 0.1) {
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


  // ---- Interactive National Footprint Map Interactivity -------
  const mapData = {
  "up": {
    "name": "Uttar Pradesh",
    "count": 3,
    "projects": [
      {
        "name": "Taj Palace",
        "location": "Lucknow, Uttar Pradesh",
        "scope": "All Public Areas, Presidential Suites & Guest Rooms",
        "image": "assets/images/portfolio/project_20.jpg"
      },
      {
        "name": "Ayodhyam",
        "location": "Ayodhya, Uttar Pradesh",
        "scope": "All Public Areas & Luxury Guest Rooms",
        "image": "assets/images/portfolio/project_21.jpg"
      },
      {
        "name": "Adani Headquarters",
        "location": "Noida, Uttar Pradesh",
        "scope": "1,00,000 Sq. Ft. Regional Headquarters Offices",
        "image": "assets/images/portfolio/project_73.jpg"
      }
    ]
  },
  "wb": {
    "name": "West Bengal",
    "count": 3,
    "projects": [
      {
        "name": "Taj Ganga Kutir",
        "location": "Raichak, West Bengal",
        "scope": "All Public Areas, Specialty Restaurants & Presidential Suites",
        "image": "assets/images/portfolio/project_22.jpg"
      },
      {
        "name": "Taj Ganga Kutir (Phase II)",
        "location": "Raichak, West Bengal",
        "scope": "150 Guest Rooms, 10 Luxury Villas & Lobbies",
        "image": "assets/images/portfolio/project_23.jpg"
      },
      {
        "name": "L&T Offices",
        "location": "Kolkata, West Bengal",
        "scope": "1,00,000 Sq. Ft. Regional Corporate Offices",
        "image": "assets/images/portfolio/project_72.jpg"
      }
    ]
  },
  "or": {
    "name": "Odisha",
    "count": 3,
    "projects": [
      {
        "name": "Taj Puri Resort & Spa",
        "location": "Puri, Odisha",
        "scope": "Guest Rooms, Deluxe Suites & Grand Ballroom",
        "image": "assets/images/portfolio/project_24.jpg"
      },
      {
        "name": "Taj Puri Resort & Spa (Phase II)",
        "location": "Puri, Odisha",
        "scope": "Specialty Restaurant, Spa, Fitness Center & Reception",
        "image": "assets/images/portfolio/project_25.jpg"
      },
      {
        "name": "Vivanta by Taj",
        "location": "Bhubaneswar, Odisha",
        "scope": "136 Guest Rooms, Specialty Restaurants & Public Areas",
        "image": "assets/images/portfolio/project_36.jpg"
      }
    ]
  },
  "rj": {
    "name": "Rajasthan",
    "count": 7,
    "projects": [
      {
        "name": "Taj Gorbandh Palace",
        "location": "Jaisalmer, Rajasthan",
        "scope": "Guest Rooms, Executive Suites & All-Day Dining",
        "image": "assets/images/portfolio/project_26.jpg"
      },
      {
        "name": "Taj Gorbandh Palace (Phase II)",
        "location": "Jaisalmer, Rajasthan",
        "scope": "Library Bar Lounge, Specialty Restaurant, Spa & Gym",
        "image": "assets/images/portfolio/project_27.jpg"
      },
      {
        "name": "Taj Amer",
        "location": "Jaipur, Rajasthan",
        "scope": "173 King Rooms, 52 Twin Rooms & 19 Suites",
        "image": "assets/images/portfolio/project_28.jpg"
      },
      {
        "name": "Taj Amer (Phase II)",
        "location": "Jaipur, Rajasthan",
        "scope": "Spa & Fitness Centre, The Executive Club & Boardrooms",
        "image": "assets/images/portfolio/project_29.jpg"
      },
      {
        "name": "Taj Amer (Phase III)",
        "location": "Jaipur, Rajasthan",
        "scope": "Grand Ballrooms, Pre-Function Area & Guest Lobbies",
        "image": "assets/images/portfolio/project_30.jpg"
      },
      {
        "name": "Taj Amer (Spa & Retail)",
        "location": "Jaipur, Rajasthan",
        "scope": "Spa Lobbies, Reception, Treatment Rooms & Yoga Studio",
        "image": "assets/images/portfolio/project_31.jpg"
      },
      {
        "name": "BNP Factory Craft Village",
        "location": "Rajasthan",
        "scope": "27-Acre state-of-the-art Furniture Manufacturing plant & Craft Village",
        "image": "assets/images/portfolio/project_98.jpg"
      }
    ]
  },
  "mh": {
    "name": "Maharashtra",
    "count": 23,
    "projects": [
      {
        "name": "The Chambers, Taj Mahal Palace",
        "location": "Mumbai, Maharashtra",
        "scope": "Executive Waiting Area, Dining & Lift Lobbies",
        "image": "assets/images/portfolio/project_32.jpg"
      },
      {
        "name": "Taj Mahal Palace (Conference Suites)",
        "location": "Mumbai, Maharashtra",
        "scope": "Premium Boardrooms & Conference Rooms",
        "image": "assets/images/portfolio/project_33.jpg"
      },
      {
        "name": "Taj Mahal Palace (Private Lounges)",
        "location": "Mumbai, Maharashtra",
        "scope": "Elite Members' Lounges & Dining Spaces",
        "image": "assets/images/portfolio/project_34.jpg"
      },
      {
        "name": "Hyatt Regency",
        "location": "Pune, Maharashtra",
        "scope": "Grand Lobby, Banquet Area, Bar & Pre-Function",
        "image": "assets/images/portfolio/project_42.jpg"
      },
      {
        "name": "Hyatt Regency (Phase II)",
        "location": "Pune, Maharashtra",
        "scope": "Main Reception, Specialty Restaurant & Common Areas",
        "image": "assets/images/portfolio/project_43.jpg"
      },
      {
        "name": "Novotel Hotel",
        "location": "Pune, Maharashtra",
        "scope": "300 Keys, All-Day Dining, Specialty Restaurant & Common Areas",
        "image": "assets/images/portfolio/project_45.jpg"
      },
      {
        "name": "Jio World Drive Club",
        "location": "BKC, Mumbai, Maharashtra",
        "scope": "Luxe Reception, Members' Lounges & Common Areas",
        "image": "assets/images/portfolio/project_46.jpg"
      },
      {
        "name": "Jio World Drive Club (Clubhouse)",
        "location": "BKC, Mumbai, Maharashtra",
        "scope": "14,00,050 Sq. Ft. Members-Only Clubhouse",
        "image": "assets/images/portfolio/project_47.jpg"
      },
      {
        "name": "L&T Training Centre",
        "location": "Palava, Maharashtra",
        "scope": "1,50,000 Sq. Ft. Residential Training Centre",
        "image": "assets/images/portfolio/project_52.jpg"
      },
      {
        "name": "L&T Training Centre (Lobby)",
        "location": "Palava, Maharashtra",
        "scope": "Lobby & Classroom Common Areas",
        "image": "assets/images/portfolio/project_53.jpg"
      },
      {
        "name": "Motilal Oswal Headquarters",
        "location": "Mumbai, Maharashtra",
        "scope": "75,000 Sq. Ft. Executive HQ Offices",
        "image": "assets/images/portfolio/project_55.jpg"
      },
      {
        "name": "L&T Headquarters",
        "location": "Mumbai, Maharashtra",
        "scope": "Executive Corporate Headquarters & Boardrooms",
        "image": "assets/images/portfolio/project_64.jpg"
      },
      {
        "name": "L&T Headquarters (Lobby)",
        "location": "Mumbai, Maharashtra",
        "scope": "Double-Height Entrance Lobby & Waiting Area",
        "image": "assets/images/portfolio/project_65.jpg"
      },
      {
        "name": "Wipro Campus (Block A)",
        "location": "Pune, Maharashtra",
        "scope": "3,00,000 Sq. Ft. Corporate IT Campus Offices",
        "image": "assets/images/portfolio/project_66.jpg"
      },
      {
        "name": "Wipro Campus (Block B)",
        "location": "Pune, Maharashtra",
        "scope": "2,00,000 Sq. Ft. Corporate IT Campus Offices",
        "image": "assets/images/portfolio/project_67.jpg"
      },
      {
        "name": "Wipro Campus (Block C)",
        "location": "Pune, Maharashtra",
        "scope": "1,50,000 Sq. Ft. Corporate IT Campus Offices",
        "image": "assets/images/portfolio/project_68.jpg"
      },
      {
        "name": "Wipro Campus (Block D)",
        "location": "Pune, Maharashtra",
        "scope": "3,00,000 Sq. Ft. Corporate IT Campus Offices",
        "image": "assets/images/portfolio/project_69.jpg"
      },
      {
        "name": "Reliance Headquarters",
        "location": "Mumbai, Maharashtra",
        "scope": "2,50,000 Sq. Ft. Corporate Headquarters",
        "image": "assets/images/portfolio/project_74.jpg"
      },
      {
        "name": "Dhirubhai Ambani International School",
        "location": "BKC, Mumbai, Maharashtra",
        "scope": "Full Campus Interiors & Classroom Spaces",
        "image": "assets/images/portfolio/project_76.jpg"
      },
      {
        "name": "Shoppers Stop",
        "location": "Mumbai, Maharashtra",
        "scope": "1,50,000 Sq. Ft. Retail Store Layout & Furniture",
        "image": "assets/images/portfolio/project_80.jpg"
      },
      {
        "name": "Celebrity Cricketer Home",
        "location": "Bandra, Mumbai, Maharashtra",
        "scope": "45,000 Sq. Ft. Ultra-Luxury Exclusive Multi-Storey Residence",
        "image": "assets/images/portfolio/project_83.jpg"
      },
      {
        "name": "Reliance Apartment Building",
        "location": "Mumbai, Maharashtra",
        "scope": "Turnkey Luxury 3 BHK, 4 BHK, and 5 BHK Apartments",
        "image": "assets/images/portfolio/project_86.jpg"
      },
      {
        "name": "BNP Paribas Headquarters",
        "location": "Mumbai & Pune",
        "scope": "1,50,000 Sq. Ft. Corporate Banking Headquarters",
        "image": "assets/images/portfolio/project_95.jpg"
      }
    ]
  },
  "ga": {
    "name": "Goa",
    "count": 1,
    "projects": [
      {
        "name": "SeleQtions by Taj \u2014 Cidade de Goa",
        "location": "Goa",
        "scope": "Public Areas, Restaurants, Grand Ballroom & BOH Areas",
        "image": "assets/images/portfolio/project_35.jpg"
      }
    ]
  },
  "jh": {
    "name": "Jharkhand",
    "count": 3,
    "projects": [
      {
        "name": "Radisson Hotel",
        "location": "Jamshedpur, Jharkhand",
        "scope": "Guest Rooms, Premium Suites, Owner's Suite & Ballroom",
        "image": "assets/images/portfolio/project_37.jpg"
      },
      {
        "name": "Radisson Hotel",
        "location": "Ranchi, Jharkhand",
        "scope": "Main Lobby, Common Areas, Reception & Guest Rooms",
        "image": "assets/images/portfolio/project_40.jpg"
      },
      {
        "name": "DB Mall (Phase II)",
        "location": "Ranchi, Jharkhand",
        "scope": "8,00,000 Sq. Ft. Shopping Centre Interiors",
        "image": "assets/images/portfolio/project_79.jpg"
      }
    ]
  },
  "tn": {
    "name": "Tamil Nadu",
    "count": 1,
    "projects": [
      {
        "name": "Novotel Hotel",
        "location": "Chennai, Tamil Nadu",
        "scope": "158 Keys, Bar Area, All-Day Dining & Common Areas",
        "image": "assets/images/portfolio/project_38.jpg"
      }
    ]
  },
  "tg": {
    "name": "Telangana",
    "count": 3,
    "projects": [
      {
        "name": "Novotel Hotel",
        "location": "Hyderabad, Telangana",
        "scope": "152 Keys, Main Lobby & All Common Areas",
        "image": "assets/images/portfolio/project_39.jpg"
      },
      {
        "name": "Members Only Club",
        "location": "Hyderabad, Telangana",
        "scope": "Exclusive Clubhouse Reception & Private Lounges",
        "image": "assets/images/portfolio/project_48.jpg"
      },
      {
        "name": "Members Only Club (Dining)",
        "location": "Hyderabad, Telangana",
        "scope": "Fine Dining Areas, Cigar Lounge & Sports Room",
        "image": "assets/images/portfolio/project_49.jpg"
      }
    ]
  },
  "ka": {
    "name": "Karnataka",
    "count": 1,
    "projects": [
      {
        "name": "Marriott Hotel",
        "location": "Bangalore, Karnataka",
        "scope": "330 Keys, Lobby, Common Areas & Corridors",
        "image": "assets/images/portfolio/project_41.jpg"
      }
    ]
  },
  "hr": {
    "name": "Haryana",
    "count": 2,
    "projects": [
      {
        "name": "Novotel Hotel",
        "location": "Gurugram, Haryana",
        "scope": "156 Keys, Waiting Area, All-Day Dining & Conference Rooms",
        "image": "assets/images/portfolio/project_44.jpg"
      },
      {
        "name": "Amrita Hospitals (AIMS)",
        "location": "Faridabad, Haryana",
        "scope": "9,00,000 Sq. Ft. Turnkey Hospital, 302 ICUs, 4 OT Rooms",
        "image": "assets/images/portfolio/project_77.jpg"
      }
    ]
  },
  "gj": {
    "name": "Gujarat",
    "count": 3,
    "projects": [
      {
        "name": "Motilal Oswal Headquarters",
        "location": "Ahmedabad, Gujarat",
        "scope": "95,000 Sq. Ft. Corporate HQ Offices",
        "image": "assets/images/portfolio/project_54.jpg"
      },
      {
        "name": "MD and Chairman of RIL",
        "location": "Jamnagar, Gujarat",
        "scope": "15,00,000 Sq. Ft. Private Residential Estate",
        "image": "assets/images/portfolio/project_87.jpg"
      },
      {
        "name": "Vantara Niwas",
        "location": "Jamnagar, Gujarat",
        "scope": "Ultra-Luxury Private Estate Interiors & Fit-out",
        "image": "assets/images/portfolio/project_97.jpg"
      }
    ]
  },
  "pan": {
    "name": "Pan India",
    "count": 12,
    "projects": [
      {
        "name": "Wipro Offices",
        "location": "Pan India",
        "scope": "10,00,000 Sq. Ft. IT Campus Offices Across Major Cities",
        "image": "assets/images/portfolio/project_56.jpg"
      },
      {
        "name": "L&T Corporate Offices",
        "location": "Pan India",
        "scope": "4,50,000 Sq. Ft. Corporate Offices (Mumbai & Pune)",
        "image": "assets/images/portfolio/project_57.jpg"
      },
      {
        "name": "TCS IT Offices",
        "location": "Pan India",
        "scope": "35,00,000 Sq. Ft. IT & Corporate Offices",
        "image": "assets/images/portfolio/project_58.jpg"
      },
      {
        "name": "Reliance Corporate Offices",
        "location": "Pan India",
        "scope": "35,00,000 Sq. Ft. Corporate Spaces",
        "image": "assets/images/portfolio/project_59.jpg"
      },
      {
        "name": "Adani Corporate Offices",
        "location": "Pan India",
        "scope": "35,00,000 Sq. Ft. Corporate Spaces",
        "image": "assets/images/portfolio/project_60.jpg"
      },
      {
        "name": "HDFC Bank Offices",
        "location": "Pan India",
        "scope": "35,00,000 Sq. Ft. Banking Branches (Bhubaneswar & Kolkata)",
        "image": "assets/images/portfolio/project_61.jpg"
      },
      {
        "name": "ICICI Bank Offices",
        "location": "Pan India",
        "scope": "10,00,000 Sq. Ft. Banking Offices",
        "image": "assets/images/portfolio/project_62.jpg"
      },
      {
        "name": "HSBC Bank Offices",
        "location": "Pan India",
        "scope": "15,00,000 Sq. Ft. Corporate Banking Offices",
        "image": "assets/images/portfolio/project_63.jpg"
      },
      {
        "name": "Shoppers Stop (Pan India)",
        "location": "Pan India",
        "scope": "20,00,000 Sq. Ft. Turnkey Retail Outlets (40 Stores)",
        "image": "assets/images/portfolio/project_81.jpg"
      },
      {
        "name": "Citibank Corporate Offices",
        "location": "Pan India",
        "scope": "Space Planning & Interior fit-out for Banking Branches",
        "image": "assets/images/portfolio/project_94.jpg"
      },
      {
        "name": "Samhi Hotels Portfolio",
        "location": "Pan India",
        "scope": "2,500 Guest Rooms & Public Suites Complete Fit-out",
        "image": "assets/images/portfolio/project_96.jpg"
      },
      {
        "name": "Deutsche Bank Offices",
        "location": "Pan India",
        "scope": "Turnkey Interior Fit-out & High-Security Transaction Hubs",
        "image": "assets/images/portfolio/project_99.jpg"
      }
    ]
  },
  "kl": {
    "name": "Kerala",
    "count": 2,
    "projects": [
      {
        "name": "UST Global Kerala HQ",
        "location": "Kerala",
        "scope": "13,00,000 Sq. Ft. IT Regional Headquarters",
        "image": "assets/images/portfolio/project_70.jpg"
      },
      {
        "name": "UST Global Kerala HQ (Phase II)",
        "location": "Kerala",
        "scope": "2,00,000 Sq. Ft. Regional Office Spaces",
        "image": "assets/images/portfolio/project_71.jpg"
      }
    ]
  },
  "mp": {
    "name": "Madhya Pradesh",
    "count": 1,
    "projects": [
      {
        "name": "DB Mall",
        "location": "Bhopal, Madhya Pradesh",
        "scope": "15,00,000 Sq. Ft. Shopping Centre Public Areas",
        "image": "assets/images/portfolio/project_78.jpg"
      }
    ]
  },
  "dl": {
    "name": "Delhi NCR",
    "count": 4,
    "projects": [
      {
        "name": "Luxe Retail Mall",
        "location": "Delhi",
        "scope": "6,00,000 Sq. Ft. Shopping Centre Atrium & Retail Layouts",
        "image": "assets/images/portfolio/project_82.jpg"
      },
      {
        "name": "MD of the Publishing House",
        "location": "New Delhi",
        "scope": "15,00,000 Sq. Ft. Elite Residential Estate",
        "image": "assets/images/portfolio/project_84.jpg"
      },
      {
        "name": "MD of the Publishing House (Lobby)",
        "location": "New Delhi",
        "scope": "15,00,000 Sq. Ft. Residential Reception & Dining Areas",
        "image": "assets/images/portfolio/project_85.jpg"
      },
      {
        "name": "Indian Accent",
        "location": "New Delhi",
        "scope": "Turnkey Interior Fit-out for India's Best Fine-Dining Restaurant",
        "image": "assets/images/portfolio/project_93.jpg"
      }
    ]
  },
  "pb": {
    "name": "Punjab",
    "count": 1,
    "projects": [
      {
        "name": "Taj Swarna",
        "location": "Amritsar, Punjab",
        "scope": "Turnkey Interior Executions (Lobby & Public Areas)",
        "image": "assets/images/portfolio/project_20.jpg"
      }
    ]
  }
};

  const mapPins = document.querySelectorAll('.map-pin');
  const activeStateName = document.getElementById('active-state-name');
  const activeStateCount = document.getElementById('active-state-count');
  const activeStateList = document.getElementById('active-state-list');
  const panIndiaTrigger = document.getElementById('pan-india-trigger');
  const indiaSvgMap = document.getElementById('india-svg-map');

  if (activeStateList) {
    const renderStateProjects = (stateCode) => {
      const stateInfo = mapData[stateCode] || { name: 'Region Details', count: 0, projects: [] };
      
      // Update Name & Count
      if (activeStateName) activeStateName.textContent = stateInfo.name;
      if (activeStateCount) activeStateCount.textContent = `${stateInfo.count} Projects`;
      
      // Highlight matching state path in SVG if present
      if (indiaSvgMap) {
        indiaSvgMap.querySelectorAll('.state-path').forEach(path => path.classList.remove('active'));
        const activePath = indiaSvgMap.getElementById(stateCode);
        if (activePath) activePath.classList.add('active');
      }

      // Highlight matching map pin
      mapPins.forEach(pin => {
        if (pin.getAttribute('data-state') === stateCode) {
          pin.classList.add('active');
        } else {
          pin.classList.remove('active');
        }
      });

      // Clear & render scrollable cards
      activeStateList.innerHTML = '';
      
      if (stateInfo.projects.length === 0) {
        activeStateList.innerHTML = `
          <div style="text-align: center; color: #80808a; padding: 40px 0;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 10px; opacity: 0.5;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>No localized projects logged under this region.</p>
          </div>
        `;
        return;
      }

      stateInfo.projects.forEach(p => {
        const itemHtml = `
          <div class="map-project-item" style="opacity: 0; animation: tabFadeIn 0.4s ease forwards;">
            <img src="${p.image}" alt="${p.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.06);">
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px;">
              <h4 style="font-size: 0.95rem; color: var(--color-secondary); font-weight: 600; margin: 0; line-height: 1.3;">${p.name}</h4>
              <p style="font-size: 0.8rem; color: var(--color-text); margin: 0; line-height: 1.3;">${p.location}</p>
              <p style="font-size: 0.75rem; color: var(--color-primary); font-weight: 500; margin: 0; line-height: 1.3; font-style: italic;">${p.scope}</p>
            </div>
          </div>
        `;
        activeStateList.insertAdjacentHTML('beforeend', itemHtml);
      });
    };

    // Hover / Click Event listeners on pins
    mapPins.forEach(pin => {
      const stateCode = pin.getAttribute('data-state');
      
      pin.addEventListener('mouseenter', () => {
        renderStateProjects(stateCode);
      });
      
      pin.addEventListener('click', (e) => {
        e.preventDefault();
        renderStateProjects(stateCode);
      });
    });

    // Hover / Click Event listeners on state paths themselves to prevent hover miss or lag
    if (indiaSvgMap) {
      const statePaths = indiaSvgMap.querySelectorAll('.state-path');
      statePaths.forEach(path => {
        const stateCode = path.getAttribute('id');
        if (mapData[stateCode]) {
          path.style.cursor = 'pointer';
          
          path.addEventListener('mouseenter', () => {
            renderStateProjects(stateCode);
          });
          
          path.addEventListener('click', (e) => {
            e.preventDefault();
            renderStateProjects(stateCode);
          });
        }
      });
    }

    // Pan India Trigger Click
    if (panIndiaTrigger) {
      panIndiaTrigger.addEventListener('mouseenter', () => {
        renderStateProjects('pan');
      });
      panIndiaTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        renderStateProjects('pan');
      });
    }

    // Initialize with Maharashtra
    renderStateProjects('mh');
  }

});