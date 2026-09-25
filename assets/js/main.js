/* ============================================================
   BNP INTERIORS – Architecture & Interior Design
   Enhanced JavaScript: Animations, Scroll Effects & Micro-Interactions
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ---- Dynamic Backend Feature Toggles (Blog Visibility) ----
  const initFeatureToggles = async () => {
    try {
      let isEnabled = false;
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('blog') === '1' || urlParams.get('enableBlog') === 'true' || urlParams.get('preview') === 'true') {
        isEnabled = true;
      } else if (window.StrapiAPI && typeof window.StrapiAPI.isBlogEnabled === 'function') {
        isEnabled = await window.StrapiAPI.isBlogEnabled();
      } else {
        // 1. Try local site config first
        try {
          const res = await fetch('/config/site-config.json?t=' + Date.now());
          if (res.ok) {
            const data = await res.json();
            if (typeof data.enableBlog === 'boolean') isEnabled = data.enableBlog;
          }
        } catch (e) {}

        // 2. Try Strapi backend features.json
        if (!isEnabled) {
          try {
            const sRes = await fetch('http://localhost:1337/features.json?t=' + Date.now());
            if (sRes.ok) {
              const sData = await sRes.json();
              if (typeof sData.enableBlog === 'boolean') isEnabled = sData.enableBlog;
            }
          } catch (e) {}
        }
      }

      if (isEnabled) {
        document.body.classList.add('feature-blog-enabled');
        document.querySelectorAll('[data-feature="blog"]').forEach(el => {
          el.style.removeProperty('display');
        });
      } else {
        document.body.classList.remove('feature-blog-enabled');
        document.querySelectorAll('[data-feature="blog"]').forEach(el => {
          el.style.setProperty('display', 'none', 'important');
        });
        // If current page is blog.html and blog is disabled, redirect to index.html
        if (window.location.pathname.endsWith('blog.html') && !urlParams.get('blog')) {
          window.location.replace('index.html');
        }
      }
    } catch (err) {
      document.querySelectorAll('[data-feature="blog"]').forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    }
  };
  initFeatureToggles();

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

        if (projectsGrid.scrollTo) {
          projectsGrid.scrollTo({ left: 0, behavior: 'smooth' });
        }
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
    } else {
      const initialActiveBtn = filterNav.querySelector('.filter-btn.active') || filterBtns[0];
      if (initialActiveBtn) {
        initialActiveBtn.click();
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
      // Calculate the total scrollable width of the timeline
      const containerWidth = timelineContainer.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      // Horizontal distance the timeline needs to scroll:
      // We want the last card to fully reveal and center properly
      const maxTranslate = Math.max(0, containerWidth - viewportWidth + (viewportWidth * 0.25));
      
      // Make the vertical section height directly proportional to the horizontal scrollable width!
      const scrollHeight = maxTranslate + window.innerHeight;
      timelineSection.style.height = `${scrollHeight}px`;
    };
    
    // Expose recalculate to window for 'Show More' functionality
    window.updateTimelineDimensions = updateTimelineDimensions;
    
    window.expandTimeline = function() {
      const hiddenCards = document.querySelectorAll('.timeline-hidden');
      hiddenCards.forEach(card => card.classList.remove('timeline-hidden'));
      const showMoreCard = document.querySelector('.timeline-show-more-card');
      if (showMoreCard) {
        showMoreCard.style.display = 'none';
      }
      setTimeout(updateTimelineDimensions, 50);
    };

    // Calculate dimensions on load and resize
    window.addEventListener('resize', updateTimelineDimensions);
    setTimeout(updateTimelineDimensions, 300);

    const updateScrollState = (e) => {
      // Sticky horizontal translation on vertical page scroll (universal across all viewports)
      let lastActiveCard = null;
      
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
      const maxTranslate = Math.max(0, containerWidth - viewportWidth + (viewportWidth * 0.25));
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

    // Mobile prev/next button handlers
    const mobilePrev = document.getElementById('timeline-mobile-prev');
    const mobileNext = document.getElementById('timeline-mobile-next');
    if (mobilePrev) {
      mobilePrev.addEventListener('click', () => {
        window.scrollBy({ top: -350, behavior: 'smooth' });
      });
    }
    if (mobileNext) {
      mobileNext.addEventListener('click', () => {
        window.scrollBy({ top: 350, behavior: 'smooth' });
      });
    }

    // Touch swipe handling for mobile devices to seamlessly drive compulsory timeline scroll
    if (timelineSticky) {
      let touchStartX = 0;
      let touchStartY = 0;

      timelineSticky.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      timelineSticky.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const currentX = e.touches[0].clientX;
          const currentY = e.touches[0].clientY;
          const deltaX = touchStartX - currentX;
          const deltaY = touchStartY - currentY;

          // If touch gesture is horizontal swipe, convert to vertical window scroll to drive compulsory horizontal crawling
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 4) {
            window.scrollBy(0, deltaX * 1.3);
            touchStartX = currentX;
            touchStartY = currentY;
          }
        }
      }, { passive: true });
    }
  }

  
  // ---- Client Certificates Lightbox Handler ---------------
  document.querySelectorAll('.cert-card-frame').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-cert-src');
      const title = card.getAttribute('data-cert-title');
      if (typeof openLightbox === 'function') {
        openLightbox(src, title);
      }
    });
  });

  // ---- Lightbox for Gallery & Portfolio Images ---------------
  const galleryItems = document.querySelectorAll('.gallery-strip-item img, .project-img-wrap img, .about-img-main img');
  galleryItems.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(10, 16, 28, 0.96); z-index: 99999;
      display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;
      -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); animation: tabFadeIn 0.3s ease; padding: 16px; touch-action: pan-y;
    `;
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      display: flex; flex-direction: column; align-items: center; max-width: 92vw; max-height: 92vh;
      cursor: default; position: relative;
    `;

    const image = document.createElement('img');
    image.src = src;
    image.alt = alt || '';
    image.style.cssText = 'max-width: 90vw; max-height: 74vh; object-fit: contain; border-radius: 4px; box-shadow: 0 25px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(202,160,92,0.3); background: #fff;';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close certificate preview');
    closeBtn.style.cssText = `
      position: fixed; top: 20px; right: 28px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
      color: #fff; font-size: 2.2rem; cursor: pointer; border-radius: 50%; width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center; line-height: 1; transition: all 0.2s; z-index: 100000;
    `;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = '#caa05c';
      closeBtn.style.borderColor = '#caa05c';
      closeBtn.style.color = '#101c36';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.1)';
      closeBtn.style.borderColor = 'rgba(255,255,255,0.2)';
      closeBtn.style.color = '#fff';
    });
    closeBtn.addEventListener('click', () => {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
    });

    wrapper.appendChild(image);

    if (alt) {
      const caption = document.createElement('div');
      caption.style.cssText = `
        margin-top: 14px; text-align: center; color: #fdfaf5; font-family: var(--font-heading);
        font-size: 1rem; font-weight: 600; letter-spacing: 0.5px;
        background: rgba(16, 28, 54, 0.85); border: 1px solid rgba(202, 160, 92, 0.4);
        padding: 8px 24px; border-radius: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      `;
      caption.textContent = alt;
      wrapper.appendChild(caption);
    }

    overlay.appendChild(wrapper);
    overlay.appendChild(closeBtn);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
      }
    });
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
        btn.textContent = 'Subscribed!';
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
        btn.innerHTML = 'Message Sent Successfully!';
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
  "mh": {
    "name": "Maharashtra",
    "count": 35,
    "projects": [
      {
        "name": "Taj The Trees",
        "location": "Vikhroli, Mumbai, Maharashtra",
        "scope": "Grand Ballrooms, Pre-Function Area, Reception Lobby, Circulation, Specialty Restaurant, Spa & Conference Facilities",
        "image": "assets/images/portfolio/taj_the_trees_vikhroli_maharashtra/1_6.png"
      },
      {
        "name": "The Chambers, Taj Mahal Palace",
        "location": "Mumbai, Maharashtra",
        "scope": "Bespoke Furniture, Executive Waiting Area, Elite Members' Lounges, Private Dining, Conference Suites & Lift Lobbies",
        "image": "assets/images/portfolio/taj_chambers_taj_mahal_palace_mumbai_maharashtra/chamber_1__6.png"
      },
      {
        "name": "Hyatt Regency",
        "location": "Pune, Maharashtra",
        "scope": "Grand Lobby, Reception, Banquet Area, Bar, Specialty Restaurant & Common Areas",
        "image": "assets/images/portfolio/hyatt_regency_pune_maharashtra/HYATT_REGENCY_1__2.png"
      },
      {
        "name": "Novotel Hotel, Suites & Resort",
        "location": "Pune, Maharashtra",
        "scope": "300 Keys, All-Day Dining, Specialty Restaurant & Common Areas",
        "image": "assets/images/portfolio/novotal_hotel_suites_and_resort_pune_maharashtra/NOVOTAL_1__1.png"
      },
      {
        "name": "ICICI Bank",
        "location": "Mumbai, Maharashtra",
        "scope": "Corporate Headquarters Fit-Out & Retail Banking Branches",
        "image": "assets/images/portfolio/icici/1_(1).png"
      },
      {
        "name": "Citi Bank",
        "location": "PAN India (Pune, Gurgaon, Bangalore, Delhi, Chandigarh, Mumbai)",
        "scope": "10,00,000 sq.ft Financial Corporate Spaces & Banking Headquarters",
        "image": "assets/images/portfolio/citi_bank/1_(1).png"
      },
      {
        "name": "BNP Paribas",
        "location": "PAN India (Mumbai, Chennai, Kolkata, Delhi, Ahmedabad)",
        "scope": "15,00,000 sq.ft Global Financial Banking Headquarters",
        "image": "assets/images/portfolio/bnp_paribas/1_(1).png"
      },
      {
        "name": "Deutsche Bank",
        "location": "PAN India (Mumbai, Pune)",
        "scope": "4,50,000 sq.ft Financial Corporate Offices & Trading Floors",
        "image": "assets/images/portfolio/deutsche_bank/1_(1).png"
      },
      {
        "name": "PwC (PricewaterhouseCoopers)",
        "location": "PAN India (Hyderabad, Mumbai, Kolkata, Gujarat)",
        "scope": "10,00,000 sq.ft Professional Services Corporate Offices",
        "image": "assets/images/portfolio/pwc/1_(1).png"
      },
      {
        "name": "Concentrix",
        "location": "Mumbai, Maharashtra",
        "scope": "Turnkey Corporate Headquarters & Global Operations Center",
        "image": "assets/images/portfolio/concentrix/1_(1).png"
      },
      {
        "name": "T-Systems",
        "location": "Pune, Maharashtra",
        "scope": "3,00,000 sq.ft Enterprise Technology Campus",
        "image": "assets/images/portfolio/t_systems/1_(1).png"
      },
      {
        "name": "Red Hat",
        "location": "Pune, Maharashtra",
        "scope": "2,00,000 sq.ft Tech Enterprise Headquarters",
        "image": "assets/images/portfolio/red_hat/1_(1).png"
      },
      {
        "name": "Workday",
        "location": "Pune, Maharashtra",
        "scope": "1,50,000 sq.ft Cloud Enterprise Headquarters",
        "image": "assets/images/portfolio/workday/1(5).png"
      },
      {
        "name": "NVIDIA",
        "location": "Pune, Maharashtra",
        "scope": "3,00,000 sq.ft AI Technology & R&D Campus",
        "image": "assets/images/portfolio/nvidia/chatgpt_image_may_16,_2026,_04_17_09_pm.png"
      },
      {
        "name": "Zee Media",
        "location": "Mumbai, Maharashtra",
        "scope": "2,50,000 sq.ft Broadcast & Media Corporate Headquarters",
        "image": "assets/images/portfolio/zee_media/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "Dhirubhai Ambani International School",
        "location": "BKC, Mumbai, Maharashtra",
        "scope": "Turnkey Educational Infrastructure, World-Class Learning Auditoriums & Campus Interiors",
        "image": "assets/images/portfolio/dhirubhai_ambani_school/img_76_1.jpeg"
      },
      {
        "name": "Piramal Clubhouse",
        "location": "Mumbai, Maharashtra",
        "scope": "Ultra-Luxury Private Clubhouse, Reception, Multi-Purpose Recreational & Dining Lounges",
        "image": "assets/images/portfolio/piramal_clubhouse_mumbai_maharsthra/img_2.png"
      },
      {
        "name": "Indian Accent, NMACC",
        "location": "BKC, Mumbai, Maharashtra",
        "scope": "Bespoke Luxury Fine Dining Fit-Out at Nita Mukesh Ambani Cultural Centre",
        "image": "assets/images/portfolio/indian_accent_nmacc_bkc_mumbai_maharashtra/INDIAN_ACCENT_1_1.png"
      },
      {
        "name": "Celebrity Cricketer Residence",
        "location": "Mumbai, Maharashtra",
        "scope": "45,000 sq.ft per floor Multi-Storey Private Luxury Residence",
        "image": "assets/images/portfolio/celebrity_cricketer_home/img_83_1.jpeg"
      },
      {
        "name": "R City Mall",
        "location": "Mumbai, Maharashtra",
        "scope": "2,50,000 sq.ft Turnkey Retail Mall Fit-Out, Skylit Atrium & Public Promenade",
        "image": "assets/images/portfolio/r_city_mall/r_city_mall_cover.jpg"
      },
      {
        "name": "HDFC Bank \u2013 Turbhe",
        "location": "Turbhe, Navi Mumbai, Maharashtra",
        "scope": "Turnkey Corporate Office Fit-Out & Executive Workstations",
        "image": "assets/images/portfolio/hdfc_turbhe/hdfc_turbhe_1.jpg"
      },
      {
        "name": "HDFC Bank \u2013 Airoli (ASA)",
        "location": "Airoli, Navi Mumbai, Maharashtra",
        "scope": "Corporate Office Architecture & Interior Fit-Out",
        "image": "assets/images/portfolio/hdfc_airoli/hdfc_airoli_1.jpg"
      },
      {
        "name": "HDFC Bank \u2013 Vikhroli",
        "location": "Vikhroli, Mumbai, Maharashtra",
        "scope": "Regional Financial Corporate Headquarters",
        "image": "assets/images/portfolio/hdfc_vikhroli/hdfc_vikhroli_1.jpg"
      },
      {
        "name": "HDFC Bank \u2013 Palava Training Centre",
        "location": "Palava City, Maharashtra",
        "scope": "1,50,000 sq.ft Residential Corporate Training Academy",
        "image": "assets/images/portfolio/hdfc_palava/hdfc_palava_1.jpg"
      },
      {
        "name": "HDFC Bank \u2013 Regional Offices",
        "location": "Pan-India (Nagpur, Kolkata, Chennai, Bangalore, Surat, Jaipur)",
        "scope": "35,00,000 sq.ft Pan-India Corporate & Retail Banking Network",
        "image": "assets/images/portfolio/hdfc_bank_offices/img_61_3.jpeg"
      },
      {
        "name": "Motilal Oswal Corporate HQ",
        "location": "Mumbai, Maharashtra",
        "scope": "75,000 sq.ft Financial Services Corporate Headquarters",
        "image": "assets/images/portfolio/motilal_oswal/ahm_1__(1).png"
      },
      {
        "name": "Citibank Eon 6C",
        "location": "Eon Free Zone 6C, Kharadi, Pune",
        "scope": "Global Technology & Operations Campus",
        "image": "assets/images/portfolio/citibank_eon_6c/citibank_eon_6c_1.jpg"
      },
      {
        "name": "Deutsche Bank Pune",
        "location": "Pune, Maharashtra",
        "scope": "Technology Hub & Regional Banking Center",
        "image": "assets/images/portfolio/deutsche_bank_pune/deutsche_bank_pune_1.jpg"
      },
      {
        "name": "BNPP Infinity 7B",
        "location": "Infinity IT Park 7B, Mumbai, Maharashtra",
        "scope": "Enterprise Banking & Technology Workspace",
        "image": "assets/images/portfolio/bnpp_infinity_7b/bnpp_infinity_7b_1.jpg"
      },
      {
        "name": "BNPP Infinity 4A",
        "location": "Infinity IT Park 4A, Mumbai, Maharashtra",
        "scope": "Global Financial Corporate Workspace Fit-Out",
        "image": "assets/images/portfolio/bnpp_infinity_4a/bnpp_infinity_4a_1.jpg"
      },
      {
        "name": "Deutsche Bank Mumbai",
        "location": "Mumbai, Maharashtra",
        "scope": "Financial Trading Floor & Corporate Headquarters",
        "image": "assets/images/portfolio/deutsche_bank_mumbai/deutsche_bank_mumbai_1.jpg"
      },
      {
        "name": "HDFC MIDC",
        "location": "MIDC, Andheri, Mumbai",
        "scope": "Commercial & Treasury Banking Operations Office",
        "image": "assets/images/portfolio/hdfc_midc/hdfc_midc_1.jpg"
      },
      {
        "name": "Citibank Koregaon Park",
        "location": "Koregaon Park, Pune, Maharashtra",
        "scope": "Turnkey Wealth Center & Executive Offices",
        "image": "assets/images/portfolio/citibank_koregaon_park/citibank_koregaon_park_1.jpg"
      },
      {
        "name": "HDFC Nagpur",
        "location": "Nagpur, Maharashtra",
        "scope": "Regional Commercial Banking Headquarters",
        "image": "assets/images/portfolio/hdfc_nagpur/hdfc_nagpur_1.jpg"
      }
    ]
  },
  "gj": {
    "name": "Gujarat",
    "count": 5,
    "projects": [
      {
        "name": "BNP Paribas",
        "location": "PAN India (Mumbai, Chennai, Kolkata, Delhi, Ahmedabad)",
        "scope": "15,00,000 sq.ft Global Financial Banking Headquarters",
        "image": "assets/images/portfolio/bnp_paribas/1_(1).png"
      },
      {
        "name": "PwC (PricewaterhouseCoopers)",
        "location": "PAN India (Hyderabad, Mumbai, Kolkata, Gujarat)",
        "scope": "10,00,000 sq.ft Professional Services Corporate Offices",
        "image": "assets/images/portfolio/pwc/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "HDFC Bank \u2013 Regional Offices",
        "location": "Pan-India (Nagpur, Kolkata, Chennai, Bangalore, Surat, Jaipur)",
        "scope": "35,00,000 sq.ft Pan-India Corporate & Retail Banking Network",
        "image": "assets/images/portfolio/hdfc_bank_offices/img_61_3.jpeg"
      },
      {
        "name": "Motilal Oswal Tower",
        "location": "Ahmedabad, Gujarat",
        "scope": "9,50,000 sq.ft Regional Headquarters Tower",
        "image": "assets/images/portfolio/motilal_oswal_ahmedabad/motilal_oswal_ahmedabad_1.jpg"
      }
    ]
  },
  "rj": {
    "name": "Rajasthan",
    "count": 3,
    "projects": [
      {
        "name": "Taj Gorbandh Palace",
        "location": "Jaisalmer, Rajasthan",
        "scope": "Guest Rooms, Executive Suites, All-Day Dining, Library Bar Lounge, Specialty Restaurant, Spa & Gym",
        "image": "assets/images/portfolio/taj_gorbandh_palace_jaisalmer_rajasthan/gorbandh_1__14.png"
      },
      {
        "name": "Taj Amer",
        "location": "Jaipur, Rajasthan",
        "scope": "173 King Rooms, 52 Twin Rooms, 19 Suites, Spa & Fitness Centre, Executive Club, Boardrooms & Grand Ballrooms",
        "image": "assets/images/portfolio/taj_amer_jaipur_rajasthan/amer_1__2.png"
      },
      {
        "name": "HDFC Bank \u2013 Regional Offices",
        "location": "Pan-India (Nagpur, Kolkata, Chennai, Bangalore, Surat, Jaipur)",
        "scope": "35,00,000 sq.ft Pan-India Corporate & Retail Banking Network",
        "image": "assets/images/portfolio/hdfc_bank_offices/img_61_3.jpeg"
      }
    ]
  },
  "up": {
    "name": "Uttar Pradesh",
    "count": 5,
    "projects": [
      {
        "name": "Taj Palace",
        "location": "Lucknow, Uttar Pradesh",
        "scope": "All Public Areas, Presidential Suites & Luxury Guest Rooms",
        "image": "assets/images/portfolio/taj_palace_lucknow/img_20_1.jpeg"
      },
      {
        "name": "Taj Ayodhyam",
        "location": "Ayodhya, Uttar Pradesh",
        "scope": "All Public Areas & Luxury Guest Rooms",
        "image": "assets/images/portfolio/taj_ayodhyam_ayodhya/img_21_3.jpeg"
      },
      {
        "name": "Dainik Bhaskar",
        "location": "Bhopal, Madhya Pradesh & Noida, Uttar Pradesh",
        "scope": "1,00,000 sq.ft Media & News Corporate Headquarters",
        "image": "assets/images/portfolio/dainik_baskar/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "DB Noida",
        "location": "Noida, Uttar Pradesh",
        "scope": "Corporate Headquarters & Media Fit-Out",
        "image": "assets/images/portfolio/db_noida/db_noida_1.jpg"
      }
    ]
  },
  "wb": {
    "name": "West Bengal",
    "count": 7,
    "projects": [
      {
        "name": "Taj Ganga Kutir",
        "location": "Raichak, West Bengal",
        "scope": "All Public Areas, Specialty Restaurants, Presidential Suites, 150 Guest Rooms, 10 Luxury Villas & Lobbies",
        "image": "assets/images/portfolio/taj_ganga_kutir_raichak_west_bengal/1_3.webp"
      },
      {
        "name": "BNP Paribas",
        "location": "PAN India (Mumbai, Chennai, Kolkata, Delhi, Ahmedabad)",
        "scope": "15,00,000 sq.ft Global Financial Banking Headquarters",
        "image": "assets/images/portfolio/bnp_paribas/1_(1).png"
      },
      {
        "name": "PwC (PricewaterhouseCoopers)",
        "location": "PAN India (Hyderabad, Mumbai, Kolkata, Gujarat)",
        "scope": "10,00,000 sq.ft Professional Services Corporate Offices",
        "image": "assets/images/portfolio/pwc/1_(1).png"
      },
      {
        "name": "Tecpro Systems Ltd",
        "location": "Kolkata, West Bengal",
        "scope": "1,00,000 sq.ft Engineering & Industrial Headquarters",
        "image": "assets/images/portfolio/tecpro_systems_ltd/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "HDFC Bank \u2013 Regional Offices",
        "location": "Pan-India (Nagpur, Kolkata, Chennai, Bangalore, Surat, Jaipur)",
        "scope": "35,00,000 sq.ft Pan-India Corporate & Retail Banking Network",
        "image": "assets/images/portfolio/hdfc_bank_offices/img_61_3.jpeg"
      },
      {
        "name": "HDFC Kolkata",
        "location": "Kolkata, West Bengal",
        "scope": "Regional Corporate Banking Operations Center",
        "image": "assets/images/portfolio/hdfc_kolkata/hdfc_kolkata_1.jpg"
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
        "scope": "Guest Rooms, Deluxe Suites, Grand Ballroom, Specialty Restaurant, Spa, Fitness Center & Reception",
        "image": "assets/images/portfolio/taj_puri_resort_spa/img_24_4.jpeg"
      },
      {
        "name": "Vivanta by Taj",
        "location": "Bhubaneswar, Odisha",
        "scope": "136 Guest Rooms, Specialty Restaurants, Grand Ballroom, Pre-Function & Public Areas",
        "image": "assets/images/portfolio/vivanta_bhubaneshwar_odisha/VIVANTA_1_4.png"
      },
      {
        "name": "HDFC Bank \u2013 Bhubaneswar",
        "location": "Bhubaneswar, Odisha",
        "scope": "State Regional Banking Headquarters & Offices",
        "image": "assets/images/portfolio/hdfc_bhubaneswar/hdfc_bhubaneswar_1.jpg"
      }
    ]
  },
  "tn": {
    "name": "Tamil Nadu",
    "count": 7,
    "projects": [
      {
        "name": "Fairfield by Marriott",
        "location": "Chennai, Tamil Nadu",
        "scope": "158 Keys, Bar Area, All-Day Dining, Pool Area, Gym, Market & Conference Rooms (HICSA Hotel of the Year 2019 Award Winner)",
        "image": "assets/images/portfolio/fairfield_chennai_tamil_nadu/FAIRFIELD_1__4.png"
      },
      {
        "name": "BNP Paribas",
        "location": "PAN India (Mumbai, Chennai, Kolkata, Delhi, Ahmedabad)",
        "scope": "15,00,000 sq.ft Global Financial Banking Headquarters",
        "image": "assets/images/portfolio/bnp_paribas/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "HDFC Bank \u2013 Regional Offices",
        "location": "Pan-India (Nagpur, Kolkata, Chennai, Bangalore, Surat, Jaipur)",
        "scope": "35,00,000 sq.ft Pan-India Corporate & Retail Banking Network",
        "image": "assets/images/portfolio/hdfc_bank_offices/img_61_3.jpeg"
      },
      {
        "name": "BNP Paribas Alwarpet",
        "location": "Alwarpet, Chennai, Tamil Nadu",
        "scope": "Turnkey Banking Branch & Regional Executive Offices",
        "image": "assets/images/portfolio/bnp_paribas_alwarpet/bnp_paribas_alwarpet_1.jpg"
      },
      {
        "name": "BNPP SP Infocity",
        "location": "SP Infocity, Chennai, Tamil Nadu",
        "scope": "Regional Financial Technology Hub & Banking Offices",
        "image": "assets/images/portfolio/bnpp_sp_infocity/bnpp_sp_infocity_1.jpg"
      },
      {
        "name": "HDFC Chennai Mogapir",
        "location": "Mogappair, Chennai, Tamil Nadu",
        "scope": "Regional Banking Facility & Retail Branch",
        "image": "assets/images/portfolio/hdfc_chennai_mogapir/hdfc_chennai_mogapir_1.jpg"
      }
    ]
  },
  "ka": {
    "name": "Karnataka",
    "count": 5,
    "projects": [
      {
        "name": "Citi Bank",
        "location": "PAN India (Pune, Gurgaon, Bangalore, Delhi, Chandigarh, Mumbai)",
        "scope": "10,00,000 sq.ft Financial Corporate Spaces & Banking Headquarters",
        "image": "assets/images/portfolio/citi_bank/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "Marriott Hotel",
        "location": "Bangalore, Karnataka",
        "scope": "330 Keys, Lobby, Corridors & Common Circulation Areas",
        "image": "assets/images/portfolio/marriott_hotel_bangalore/img_41_3.jpeg"
      },
      {
        "name": "HDFC Bank \u2013 Regional Offices",
        "location": "Pan-India (Nagpur, Kolkata, Chennai, Bangalore, Surat, Jaipur)",
        "scope": "35,00,000 sq.ft Pan-India Corporate & Retail Banking Network",
        "image": "assets/images/portfolio/hdfc_bank_offices/img_61_3.jpeg"
      },
      {
        "name": "HDFC JAYANAGAR BANGALORE",
        "location": "Jayanagar, Bangalore, Karnataka",
        "scope": "Flagship Regional Headquarters & Banking Floors",
        "image": "assets/images/portfolio/hdfc_jayanagar_bangalore/hdfc_jayanagar_bangalore_1.jpg"
      }
    ]
  },
  "tg": {
    "name": "Telangana",
    "count": 5,
    "projects": [
      {
        "name": "Sheraton",
        "location": "Hyderabad, Telangana",
        "scope": "152 Keys, Grand Lobby & All Common Circulation Areas",
        "image": "assets/images/portfolio/sheraton_hyderabad_telangana/img_1__1.png"
      },
      {
        "name": "PwC (PricewaterhouseCoopers)",
        "location": "PAN India (Hyderabad, Mumbai, Kolkata, Gujarat)",
        "scope": "10,00,000 sq.ft Professional Services Corporate Offices",
        "image": "assets/images/portfolio/pwc/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "Quorum Club",
        "location": "Hyderabad, Telangana",
        "scope": "Exclusive Members-Only Club & Executive Suites",
        "image": "assets/images/portfolio/quorum_club/quorum_club_1.jpg"
      },
      {
        "name": "District 150",
        "location": "Hyderabad, Telangana",
        "scope": "Hospitality-Powered Cultural & Lifestyle Workspaces",
        "image": "assets/images/portfolio/district_150/district_150_1.jpg"
      }
    ]
  },
  "kl": {
    "name": "Kerala",
    "count": 2,
    "projects": [
      {
        "name": "UST Global",
        "location": "Kerala",
        "scope": "13,00,000 sq.ft Regional Headquarters Mega Campus",
        "image": "assets/images/portfolio/ust_global/1_(1).png"
      },
      {
        "name": "EY (Ernst & Young)",
        "location": "Kerala",
        "scope": "2,00,000 sq.ft Regional Headquarters",
        "image": "assets/images/portfolio/ey/1_(1).png"
      }
    ]
  },
  "mp": {
    "name": "Madhya Pradesh",
    "count": 4,
    "projects": [
      {
        "name": "Dainik Bhaskar",
        "location": "Bhopal, Madhya Pradesh & Noida, Uttar Pradesh",
        "scope": "1,00,000 sq.ft Media & News Corporate Headquarters",
        "image": "assets/images/portfolio/dainik_baskar/1_(1).png"
      },
      {
        "name": "DB City Mall",
        "location": "Bhopal, Madhya Pradesh",
        "scope": "15,00,000 sq.ft Mega Retail & Shopping Complex",
        "image": "assets/images/portfolio/db_city_mall/db_city_mall_1.jpg"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "DB VILLA BHOPAL",
        "location": "Bhopal, Madhya Pradesh",
        "scope": "Bespoke Private Mansion Villa & Landscaping",
        "image": "assets/images/portfolio/db_villa_bhopal/db_villa_bhopal_2.jpg"
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
        "scope": "Guest Rooms, Premium Suites, Owner's Suite, Presidential Suites, Ballroom, Pre-Function & All-Day Dining",
        "image": "assets/images/portfolio/radisson_jamhshedpur_jharkhand/1_3.png"
      },
      {
        "name": "Courtyard by Marriott",
        "location": "Ranchi, Jharkhand",
        "scope": "Grand Lobby, Reception, Deluxe Guest Rooms & Public Circulation Spaces",
        "image": "assets/images/portfolio/courtyard_by_marriot_ranchi_jharkhand/COURTYARD_1_3.png"
      },
      {
        "name": "Nucleus Mall",
        "location": "Ranchi, Jharkhand",
        "scope": "8,00,000 sq.ft Prime Shopping Center & Commercial Hub",
        "image": "assets/images/portfolio/nucleus_mall/nucleas_1.png"
      }
    ]
  },
  "hr": {
    "name": "Haryana",
    "count": 3,
    "projects": [
      {
        "name": "Hyatt Place",
        "location": "Gurugram, Haryana",
        "scope": "156 Keys, Waiting Area, All-Day Dining & Conference Rooms",
        "image": "assets/images/portfolio/hyatt_place_gurugram_haryana/HYATT_PLACE_1__1.png"
      },
      {
        "name": "Citi Bank",
        "location": "PAN India (Pune, Gurgaon, Bangalore, Delhi, Chandigarh, Mumbai)",
        "scope": "10,00,000 sq.ft Financial Corporate Spaces & Banking Headquarters",
        "image": "assets/images/portfolio/citi_bank/1_(1).png"
      },
      {
        "name": "Amrita Hospitals (AIMS)",
        "location": "Faridabad, Delhi NCR",
        "scope": "9,00,000 sq.ft (100 Cr Order) \u00b7 Civil & Interiors: Flooring, PCC, Plaster & POP, Ceiling Finishes, Dry Wall Partitions, Doors, Wall Panelling, Bespoke Furniture (302 ICUs, 4 OTs, 158 Patient Rooms, 4 Floors)",
        "image": "assets/images/portfolio/amrita_hospitals_faridabad/img_77_1.jpeg"
      }
    ]
  },
  "dl": {
    "name": "Delhi NCR",
    "count": 9,
    "projects": [
      {
        "name": "Citi Bank",
        "location": "PAN India (Pune, Gurgaon, Bangalore, Delhi, Chandigarh, Mumbai)",
        "scope": "10,00,000 sq.ft Financial Corporate Spaces & Banking Headquarters",
        "image": "assets/images/portfolio/citi_bank/1_(1).png"
      },
      {
        "name": "BNP Paribas",
        "location": "PAN India (Mumbai, Chennai, Kolkata, Delhi, Ahmedabad)",
        "scope": "15,00,000 sq.ft Global Financial Banking Headquarters",
        "image": "assets/images/portfolio/bnp_paribas/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "Vegas Mall",
        "location": "Delhi NCR",
        "scope": "6,00,000 sq.ft Destination Retail & Entertainment Mall",
        "image": "assets/images/portfolio/vegas_mall/vegas.png"
      },
      {
        "name": "Amrita Hospitals (AIMS)",
        "location": "Faridabad, Delhi NCR",
        "scope": "9,00,000 sq.ft (100 Cr Order) \u00b7 Civil & Interiors: Flooring, PCC, Plaster & POP, Ceiling Finishes, Dry Wall Partitions, Doors, Wall Panelling, Bespoke Furniture (302 ICUs, 4 OTs, 158 Patient Rooms, 4 Floors)",
        "image": "assets/images/portfolio/amrita_hospitals_faridabad/img_77_1.jpeg"
      },
      {
        "name": "Publishing House MD Bungalow",
        "location": "New Delhi",
        "scope": "15,000 sq.ft per floor Multi-Storey Private Estate Bungalow",
        "image": "assets/images/portfolio/md_publishing_house/img_84_1.jpeg"
      },
      {
        "name": "Elegante Mall (NSP)",
        "location": "Netaji Subhash Place, Delhi",
        "scope": "Modern Retail Shopping Mall Fit-Out & Atrium",
        "image": "assets/images/portfolio/elegante_mall_nsp/elegante_mall_nsp_1.jpg"
      },
      {
        "name": "Citibank DLF Delhi",
        "location": "DLF, Delhi NCR",
        "scope": "Premier Wealth Management & Commercial Banking Branch",
        "image": "assets/images/portfolio/citibank_dlf_delhi/citibank_dlf_delhi_1.jpg"
      },
      {
        "name": "DB Golflinks Villa",
        "location": "Golf Links, New Delhi",
        "scope": "Ultra-Luxury Private Estate & General Contracting",
        "image": "assets/images/portfolio/db_golflinks_villa/db_golflinks_villa_1.jpg"
      }
    ]
  },
  "pb": {
    "name": "Punjab",
    "count": 1,
    "projects": [
      {
        "name": "Citi Bank",
        "location": "PAN India (Pune, Gurgaon, Bangalore, Delhi, Chandigarh, Mumbai)",
        "scope": "10,00,000 sq.ft Financial Corporate Spaces & Banking Headquarters",
        "image": "assets/images/portfolio/citi_bank/1_(1).png"
      }
    ]
  },
  "ga": {
    "name": "Goa",
    "count": 1,
    "projects": [
      {
        "name": "SeleQtions by Taj - Cidade de Goa",
        "location": "Goa",
        "scope": "All Public Areas, Restaurants, Grand Ballroom, Pre-Function, BOH Areas & General Manager's Office",
        "image": "assets/images/portfolio/taj_ciadade_de_goa/GOA_1__2.png"
      }
    ]
  },
  "pan": {
    "name": "Pan India Network",
    "count": 6,
    "projects": [
      {
        "name": "Citi Bank",
        "location": "PAN India (Pune, Gurgaon, Bangalore, Delhi, Chandigarh, Mumbai)",
        "scope": "10,00,000 sq.ft Financial Corporate Spaces & Banking Headquarters",
        "image": "assets/images/portfolio/citi_bank/1_(1).png"
      },
      {
        "name": "BNP Paribas",
        "location": "PAN India (Mumbai, Chennai, Kolkata, Delhi, Ahmedabad)",
        "scope": "15,00,000 sq.ft Global Financial Banking Headquarters",
        "image": "assets/images/portfolio/bnp_paribas/1_(1).png"
      },
      {
        "name": "Deutsche Bank",
        "location": "PAN India (Mumbai, Pune)",
        "scope": "4,50,000 sq.ft Financial Corporate Offices & Trading Floors",
        "image": "assets/images/portfolio/deutsche_bank/1_(1).png"
      },
      {
        "name": "PwC (PricewaterhouseCoopers)",
        "location": "PAN India (Hyderabad, Mumbai, Kolkata, Gujarat)",
        "scope": "10,00,000 sq.ft Professional Services Corporate Offices",
        "image": "assets/images/portfolio/pwc/1_(1).png"
      },
      {
        "name": "Shoppers Stop",
        "location": "PAN India (40 Outlets)",
        "scope": "20,00,000 sq.ft Retail Outlets Across 40 Malls Nationwide",
        "image": "assets/images/portfolio/shoppers_stop/img_80_1.jpeg"
      },
      {
        "name": "HDFC Bank \u2013 Regional Offices",
        "location": "Pan-India (Nagpur, Kolkata, Chennai, Bangalore, Surat, Jaipur)",
        "scope": "35,00,000 sq.ft Pan-India Corporate & Retail Banking Network",
        "image": "assets/images/portfolio/hdfc_bank_offices/img_61_3.jpeg"
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

    // Hover / Click Event listeners on pins only (state map paths are non-interactive background)
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

    // Video Playback Performance Observer (pauses other autoplay videos when off-screen)
    const autoplayVideos = document.querySelectorAll('video[autoplay]:not(#hero-bg-video)');
    if ('IntersectionObserver' in window && autoplayVideos.length > 0) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => {});
          } else {
            entry.target.pause();
          }
        });
      }, { threshold: 0, rootMargin: "300px 0px 300px 0px" });
      
      autoplayVideos.forEach((v) => videoObserver.observe(v));
    }

  }

  // ============================================================
  // HERO BANNER VIDEO & SOUNDTRACK SHOWCASE CONTROLLER
  // 1. Plays video and audio together immediately (or on first interaction if restricted by browser)
  // 2. Automatically pauses video and audio when scrolled past the hero banner
  // 3. Automatically resumes from the exact frame where it stopped when returning to the hero banner
  // ============================================================
  const heroVideo = document.getElementById('hero-bg-video');
  const heroSoundToggle = document.getElementById('hero-sound-toggle');
  const heroSection = document.querySelector('.hero.hero-cinematic') || (heroVideo ? heroVideo.parentElement : null);

  if (heroVideo && heroSoundToggle) {
    let userExplicitlyMuted = false;
    let isHeroInView = true;

    const updateSoundUI = (isMuted) => {
      if (isMuted) {
        heroSoundToggle.classList.remove('active');
        heroSoundToggle.setAttribute('aria-pressed', 'false');
        heroSoundToggle.setAttribute('title', 'Click to Enable Sound');
      } else {
        heroSoundToggle.classList.add('active');
        heroSoundToggle.setAttribute('aria-pressed', 'true');
        heroSoundToggle.setAttribute('title', 'Mute Sound');
      }
    };

    // Unmute audio safely and ensure playback
    const unmuteAndPlay = () => {
      if (userExplicitlyMuted) return;
      heroVideo.muted = false;
      heroVideo.volume = 1.0;
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updateSoundUI(false);
          // Once unmuted playback is confirmed running, cleanup one-time interaction listeners
          removeInteractionListeners();
        }).catch(() => {
          // If browser strictly requires a direct user click/tap, keep muted temporarily
          heroVideo.muted = true;
          heroVideo.play().catch(() => {});
          updateSoundUI(true);
        });
      }
    };

    // 1. Initial Launch: Ensure video plays immediately, attempt unmuted sound
    heroVideo.muted = true;
    heroVideo.play().then(() => {
      // Try unmuting immediately on page open
      unmuteAndPlay();
    }).catch(() => {
      heroVideo.muted = true;
      heroVideo.play().catch(() => {});
    });

    // 2. User Gesture Listeners: The very first click, tap, pointerdown anywhere on the page un-mutes
    const handleUserInteraction = () => {
      if (!userExplicitlyMuted && isHeroInView) {
        unmuteAndPlay();
      }
    };

    const interactionEvents = ['click', 'pointerdown', 'touchstart', 'keydown'];
    const removeInteractionListeners = () => {
      interactionEvents.forEach(evt => {
        window.removeEventListener(evt, handleUserInteraction, { capture: true, passive: true });
        document.removeEventListener(evt, handleUserInteraction, { capture: true, passive: true });
      });
    };

    interactionEvents.forEach(evt => {
      window.addEventListener(evt, handleUserInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleUserInteraction, { capture: true, passive: true });
    });

    // 3. Direct clicks on hero section
    if (heroSection) {
      heroSection.addEventListener('click', (e) => {
        if (e.target.closest('#hero-sound-toggle')) return;
        userExplicitlyMuted = false;
        unmuteAndPlay();
      });
    }

    // 4. Toggle button click handler
    heroSoundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (heroVideo.muted) {
        userExplicitlyMuted = false;
        unmuteAndPlay();
      } else {
        userExplicitlyMuted = true;
        heroVideo.muted = true;
        updateSoundUI(true);
      }
    });

    // 5. Scroll: Pause when scrolling past, resume from where it stopped when returning
    const pausePlayback = () => {
      if (!isHeroInView) return;
      isHeroInView = false;
      heroSoundToggle.classList.add('hero-paused');
      heroVideo.pause();
    };

    const resumePlayback = () => {
      if (isHeroInView) return;
      isHeroInView = true;
      heroSoundToggle.classList.remove('hero-paused');
      // Resumes smoothly from heroVideo.currentTime
      const p = heroVideo.play();
      if (p !== undefined) {
        p.then(() => {
          if (!userExplicitlyMuted && heroVideo.muted) {
            unmuteAndPlay();
          }
        }).catch(() => {});
      }
    };

    // Primary: IntersectionObserver
    if ('IntersectionObserver' in window && heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
            resumePlayback();
          } else {
            pausePlayback();
          }
        });
      }, {
        threshold: [0, 0.05, 0.2],
        rootMargin: '0px'
      });

      heroObserver.observe(heroSection);
    }

    // Secondary fail-safe scroll check (ensures immediate response on fast scrolls and mobile browsers)
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking && heroSection) {
        window.requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          // If hero section bottom is above header (scrolled past), pause
          if (rect.bottom <= 50) {
            pausePlayback();
          } else if (rect.bottom > 50 && rect.top < window.innerHeight) {
            resumePlayback();
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // 6. Tab Visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroVideo.pause();
      } else if (isHeroInView) {
        heroVideo.play().catch(() => {});
      }
    });
  }

  // ============================================================
  // AUTOMATIC MACHINERY CAROUSEL (NAVI MUMBAI PLANT)
  // ============================================================
  const initMfgCarousel = () => {
    const container = document.getElementById('mfg-carousel');
    if (!container) return;

    const track = document.getElementById('mfg-carousel-track');
    const slides = container.querySelectorAll('.mfg-carousel-slide');
    const prevBtn = document.getElementById('mfg-prev-btn');
    const nextBtn = document.getElementById('mfg-next-btn');
    const dotsContainer = document.getElementById('mfg-carousel-dots');
    const currentSlideEl = document.getElementById('mfg-current-slide');
    const progressBar = document.getElementById('mfg-progress-bar');
    const statusEl = container.querySelector('.mfg-carousel-status');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 3600; // 3.6 seconds per slide
    let progressStartTime = Date.now();
    let autoPlayTimer = null;
    let progressAnimId = null;
    let isPaused = false;

    // Generate Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `mfg-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to machinery slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          restartTimer();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const updateUI = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (currentSlideEl) {
        currentSlideEl.textContent = String(currentIndex + 1).padStart(2, '0');
      }
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.mfg-dot');
        dots.forEach((d, idx) => {
          d.classList.toggle('active', idx === currentIndex);
        });
      }
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateUI();
      progressStartTime = Date.now();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartTimer();
      });
    }

    // Smooth Progress Bar ticker
    function tickProgress() {
      if (!isPaused && progressBar) {
        const elapsed = Date.now() - progressStartTime;
        const pct = Math.min((elapsed / slideDuration) * 100, 100);
        progressBar.style.width = pct + '%';
      }
      progressAnimId = requestAnimationFrame(tickProgress);
    }

    function startTimer() {
      progressStartTime = Date.now();
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, slideDuration);
    }

    function restartTimer() {
      progressStartTime = Date.now();
      if (progressBar) progressBar.style.width = '0%';
      startTimer();
    }

    // Hover Pause / Resume
    container.addEventListener('mouseenter', () => {
      isPaused = true;
      if (statusEl) {
        statusEl.classList.add('paused');
        statusEl.innerHTML = '<span class="mfg-live-dot"></span> Paused';
      }
    });

    container.addEventListener('mouseleave', () => {
      isPaused = false;
      progressStartTime = Date.now();
      if (statusEl) {
        statusEl.classList.remove('paused');
        statusEl.innerHTML = '<span class="mfg-live-dot"></span> Auto-Playing';
      }
    });

    // Touch Swipe support
    let touchStartX = 0;
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isPaused = true;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      isPaused = false;
      restartTimer();
    }, { passive: true });

    // Initialize
    updateUI();
    startTimer();
    progressAnimId = requestAnimationFrame(tickProgress);
  };

  initMfgCarousel();

  /* ============================================================
     BNP FACTORY CRAFT VILLAGE DAY / NIGHT TOGGLE
     ============================================================ */
  const initCraftVillageToggle = () => {
    const dayImg = document.getElementById('cv-img-day');
    const nightImg = document.getElementById('cv-img-night');

    if (!dayImg || !nightImg) return;

    let showingDay = true;

    setInterval(() => {
      if (showingDay) {
        dayImg.classList.remove('active');
        nightImg.classList.add('active');
      } else {
        nightImg.classList.remove('active');
        dayImg.classList.add('active');
      }
      showingDay = !showingDay;
    }, 2000);
  };

  initCraftVillageToggle();

  /* ============================================================
     PROJECT CARD FULL-CLICKABILITY & 2-SECOND HOVER GALLERY SLIDESHOW
     ============================================================ */
  const initProjectCardInteractiveFeatures = () => {
    let projectsData = null;

    // Fetch projects data JSON
    fetch('assets/js/projects-data.json')
      .then(res => res.json())
      .then(data => {
        projectsData = data;
        // Preload image objects for ultra-smooth hover slideshow
        Object.values(data).forEach(p => {
          if (p.images && p.images.length > 1) {
            p.images.forEach(src => {
              const img = new Image();
              img.src = src;
            });
          }
        });
      })
      .catch(err => console.log('Projects data JSON load note:', err));

    // Helper to get project data for a card
    const getProjectData = (card) => {
      if (!projectsData) return null;
      // 1. Try URL parameter from link inside card
      const link = card.querySelector('a[href*="id="]');
      if (link) {
        const href = link.getAttribute('href');
        const match = href.match(/id=([^&]+)/);
        if (match && projectsData[match[1]]) {
          return projectsData[match[1]];
        }
      }
      // 2. Try title matching
      const titleEl = card.querySelector('.project-name, h3, h4');
      if (titleEl) {
        const text = titleEl.textContent.trim().toLowerCase();
        for (const pid in projectsData) {
          if (projectsData[pid].name.toLowerCase() === text) {
            return projectsData[pid];
          }
        }
      }
      return null;
    };

    // Attach full card clickability via event delegation
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;

      const link = card.querySelector('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // If user clicked directly on an anchor or button inside the card, allow natural behavior
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }

      // Otherwise navigate to href
      window.location.href = href;
    });

    // Attach 2-second hover gallery slideshow listeners
    const setupCardHoverGallery = (card) => {
      if (card._hoverSetupDone) return;
      card._hoverSetupDone = true;

      const imgWrap = card.querySelector('.project-img-wrap');
      const mainImg = imgWrap ? imgWrap.querySelector('img') : null;
      if (!imgWrap || !mainImg) return;

      let hoverTimer = null;
      let slideshowInterval = null;
      let originalSrc = mainImg.src;
      let indicator = null;

      const getOrCreateIndicator = () => {
        let ind = imgWrap.querySelector('.card-gallery-indicator');
        if (!ind) {
          ind = document.createElement('div');
          ind.className = 'card-gallery-indicator';
          imgWrap.appendChild(ind);
        }
        return ind;
      };

      card.addEventListener('mouseenter', () => {
        // Save original src in case it changed dynamically
        originalSrc = mainImg.src;

        // Clear any existing timer
        if (hoverTimer) clearTimeout(hoverTimer);

        // Start 2-second timer (2000 ms)
        hoverTimer = setTimeout(() => {
          const pData = getProjectData(card);
          if (!pData || !pData.images || pData.images.length <= 1) return;

          const images = pData.images;
          let currentIndex = images.indexOf(originalSrc);
          if (currentIndex === -1) currentIndex = 0;

          indicator = getOrCreateIndicator();
          indicator.textContent = `Gallery • ${currentIndex + 1}/${images.length}`;
          indicator.classList.add('active');

          // Start slideshow cycling every 1.8s
          slideshowInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            
            // Smooth transition opacity
            mainImg.style.opacity = '0.4';
            setTimeout(() => {
              mainImg.src = images[currentIndex];
              mainImg.style.opacity = '1';
              if (indicator) {
                indicator.textContent = `Gallery • ${currentIndex + 1}/${images.length}`;
              }
            }, 180);

          }, 1800);

        }, 2000);
      });

      card.addEventListener('mouseleave', () => {
        // Clear 2-second hover timer
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }

        // Stop slideshow interval
        if (slideshowInterval) {
          clearInterval(slideshowInterval);
          slideshowInterval = null;
        }

        // Revert image back to original cover photo
        if (mainImg && originalSrc) {
          mainImg.style.opacity = '0.5';
          setTimeout(() => {
            mainImg.src = originalSrc;
            mainImg.style.opacity = '1';
          }, 150);
        }

        // Hide gallery indicator badge
        if (indicator) {
          indicator.classList.remove('active');
        }
      });
    };

    // Observe and initialize all cards dynamically (supporting filtered / slider cards)
    const initCards = () => {
      document.querySelectorAll('.project-card').forEach(setupCardHoverGallery);
    };

    initCards();
    // Re-check periodically or on DOM changes for newly rendered cards
    const observer = new MutationObserver(() => initCards());
    observer.observe(document.body, { childList: true, subtree: true });
  };

  initProjectCardInteractiveFeatures();

});


