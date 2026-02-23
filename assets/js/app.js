// Inlined from old `index.html` (originally from `js/loadComponents.js`, loader removed)
function initNavigation() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  // Components may fail to load; guard to avoid runtime errors
  if (!mobileMenuBtn || !mobileMenu) {
    console.warn("Navigation could not be initialized (missing elements).");
    return;
  }

  const menuSpans = mobileMenuBtn.querySelectorAll("span");
  let isMenuOpen = false;

  // Toggle Mobile Menu
  mobileMenuBtn.addEventListener("click", function () {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
      mobileMenu.classList.add("border-t", "border-gray-200");

      menuSpans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      menuSpans[1].style.opacity = "0";
      menuSpans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      mobileMenu.style.maxHeight = "0";
      mobileMenu.classList.remove("border-t", "border-gray-200");

      menuSpans[0].style.transform = "none";
      menuSpans[1].style.opacity = "1";
      menuSpans[2].style.transform = "none";
    }
  });

  // Close menu when clicking a link
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.style.maxHeight = "0";
      mobileMenu.classList.remove("border-t", "border-gray-200");
      isMenuOpen = false;

      menuSpans[0].style.transform = "none";
      menuSpans[1].style.opacity = "1";
      menuSpans[2].style.transform = "none";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !mobileMenu.contains(event.target) &&
      !mobileMenuBtn.contains(event.target) &&
      isMenuOpen
    ) {
      mobileMenu.style.maxHeight = "0";
      mobileMenu.classList.remove("border-t", "border-gray-200");
      isMenuOpen = false;

      menuSpans[0].style.transform = "none";
      menuSpans[1].style.opacity = "1";
      menuSpans[2].style.transform = "none";
    }
  });

  // Highlight active link on scroll
  window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
}

function initTabs() {
  const uniqueGroups = new Set(
    Array.from(document.querySelectorAll("[data-tabs-group]")).map((btn) =>
      btn.getAttribute("data-tabs-group")
    )
  );

  uniqueGroups.forEach((groupName) => {
    const triggers = document.querySelectorAll(
      `[data-tabs-group="${groupName}"]`
    );
    const panels = document.querySelectorAll(
      `[data-tab-panel^="${groupName}"]`
    );

    const activate = (target) => {
      triggers.forEach((btn) => btn.classList.remove("is-active"));
      panels.forEach((panel) => panel.classList.add("hidden"));

      const activeTrigger = Array.from(triggers).find(
        (btn) => btn.getAttribute("data-tab-trigger") === target
      );
      const activePanel = Array.from(panels).find(
        (panel) => panel.getAttribute("data-tab-panel") === target
      );

      if (activeTrigger) activeTrigger.classList.add("is-active");
      if (activePanel) activePanel.classList.remove("hidden");
    };

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab-trigger");
        activate(target);
      });
    });

    if (triggers.length) {
      activate(triggers[0].getAttribute("data-tab-trigger"));
    }
  });
}

// Swiper Slider Initialization
function initSlider() {
  // Check if Swiper is available
  if (typeof Swiper === "undefined") {
    console.warn(
      "Swiper not loaded. Make sure to include Swiper JS and CSS in your HTML."
    );
    return;
  }

  // Check if swiper container exists
  const swiperContainer = document.querySelector(".js-center-slider");
  if (!swiperContainer) {
    console.warn(
      "Swiper container (.js-center-slider) not found. Skipping slider initialization."
    );
    return;
  }

  // Initialize Swiper (center mode)
  try {
    new Swiper(".js-center-slider", {
      slidesPerView: 1.15,
      spaceBetween: 28,
      loop: true,
      centeredSlides: true,
      grabCursor: false,
      navigation: {
        nextEl: ".js-center-next",
        prevEl: ".js-center-prev",
      },
      pagination: {
        el: ".js-center-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 1.4 },
        768: { slidesPerView: 1.7 },
        1024: { slidesPerView: 2.25 },
        1280: { slidesPerView: 2.6 },
      },
    });

    console.log("✅ Center-mode slider initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Swiper:", error);
  }
}

// Custom Feedback Slider - Infinite Center Mode
function initFeedbackSlider() {
  const track = document.getElementById("feedback-slider-track");
  const prevBtn = document.getElementById("feedback-prev-btn");
  const nextBtn = document.getElementById("feedback-next-btn");

  if (!track || !prevBtn || !nextBtn) {
    console.warn(
      "Feedback slider elements not found. Skipping initialization."
    );
    return;
  }

  // Avoid duplicate clones if init runs more than once
  track.querySelectorAll(".feedback-clone").forEach((n) => n.remove());

  let slides = Array.from(track.querySelectorAll(".feedback-slide"));

  if (slides.length === 0) {
    console.warn("No feedback slides found.");
    return;
  }

  const totalRealSlides = slides.length;
  let currentIndex = 1; // 0 = cloned last, 1..totalRealSlides = real, totalRealSlides+1 = cloned first
  let isTransitioning = false;
  let animationFrameId = null;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[totalRealSlides - 1].cloneNode(true);
  firstClone.classList.add("feedback-clone");
  lastClone.classList.add("feedback-clone");
  firstClone.setAttribute("aria-hidden", "true");
  lastClone.setAttribute("aria-hidden", "true");

  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  slides = Array.from(track.querySelectorAll(".feedback-slide"));
  track.style.willChange = "transform";

  function updateNavButtons() {
    prevBtn.classList.add("active");
    nextBtn.classList.add("active");
  }

  function setTransition(enabled) {
    track.style.transition = enabled
      ? "transform 520ms cubic-bezier(0.4, 0, 0.2, 1)"
      : "none";
  }

  function updateSlider(skipTransition = false) {
    setTransition(!skipTransition);

    const containerWidth = track.parentElement.offsetWidth;
    const isMobile = window.innerWidth < 1024;

    let activeWidth, sideWidth;
    if (isMobile) {
      activeWidth = containerWidth;
      sideWidth = 0;
    } else {
      activeWidth = containerWidth * 0.5;
      sideWidth = containerWidth * 0.4;
    }

    const prevIndex = currentIndex - 1;
    const nextIndex = currentIndex + 1;

    slides.forEach((slide, index) => {
      slide.classList.remove(
        "feedback-prev-adjacent",
        "feedback-next-adjacent"
      );

      const card = slide.querySelector(".feedback-card");
      if (index === currentIndex) {
        slide.style.width = activeWidth + "px";
        slide.style.maxWidth = activeWidth + "px";
        slide.style.minWidth = activeWidth + "px";
        slide.style.height = "500px";
        slide.style.display = "flex";
        if (card) {
          card.classList.add("active");
          card.classList.remove("inactive");
          card.style.width = "100%";
          card.style.maxWidth = "100%";
          card.style.height = "500px";
        }
      } else {
        if (!isMobile) {
          if (index === prevIndex)
            slide.classList.add("feedback-prev-adjacent");
          else if (index === nextIndex)
            slide.classList.add("feedback-next-adjacent");
        }

        slide.style.display = "flex";
        if (isMobile) {
          slide.style.width = containerWidth + "px";
          slide.style.maxWidth = containerWidth + "px";
          slide.style.minWidth = containerWidth + "px";
        } else {
          slide.style.width = sideWidth + "px";
          slide.style.maxWidth = sideWidth + "px";
          slide.style.minWidth = sideWidth + "px";
          slide.style.height = "300px";
        }
        if (card) {
          card.classList.remove("active");
          card.classList.add("inactive");
          card.style.width = "100%";
          card.style.maxWidth = "100%";
          if (!isMobile) {
            card.style.height = "300px";
          }
        }
      }
    });

    if (isMobile) {
      const transformX = -(currentIndex * containerWidth);
      track.style.transform = `translateX(${transformX}px)`;
    } else {
      const widthsBefore = currentIndex * sideWidth;
      const containerCenter = containerWidth / 2;
      const activeSlideCenter = widthsBefore + activeWidth / 2;
      const transformX = containerCenter - activeSlideCenter;
      track.style.transform = `translateX(${transformX}px)`;
    }

    updateNavButtons();
  }

  function goToNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateSlider(false);
  }

  function goToPrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateSlider(false);
  }

  // Start at first real slide (no animation)
  updateSlider(true);
  requestAnimationFrame(() => setTransition(true));

  nextBtn.addEventListener("click", goToNext);
  prevBtn.addEventListener("click", goToPrev);

  // Seamless infinite loop using transitionend (no setTimeout jumps)
  track.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    if (currentIndex === totalRealSlides + 1) {
      // jumped to cloned first -> snap to real first
      setTransition(false);
      currentIndex = 1;
      updateSlider(true);
      track.getBoundingClientRect();
      setTransition(true);
    } else if (currentIndex === 0) {
      // jumped to cloned last -> snap to real last
      setTransition(false);
      currentIndex = totalRealSlides;
      updateSlider(true);
      track.getBoundingClientRect();
      setTransition(true);
    }

    isTransitioning = false;
  });

  // Swipe functionality
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50;

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeDistanceX = touchStartX - touchEndX;
    const swipeDistanceY = touchStartY - touchEndY;

    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
      if (swipeDistanceX > minSwipeDistance) goToNext();
      else if (swipeDistanceX < -minSwipeDistance) goToPrev();
    }
  }

  // Mouse drag support for desktop
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    track.style.cursor = "pointer";
    e.preventDefault();
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  track.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = "pointer";

    const dragDistanceX = dragStartX - e.clientX;
    const dragDistanceY = dragStartY - e.clientY;

    if (Math.abs(dragDistanceX) > Math.abs(dragDistanceY)) {
      if (dragDistanceX > minSwipeDistance) goToNext();
      else if (dragDistanceX < -minSwipeDistance) goToPrev();
    }
  });

  track.addEventListener("mouseleave", () => {
    isDragging = false;
    track.style.cursor = "pointer";
  });

  track.style.cursor = "pointer";

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlider(true);
    }, 150);
  });

  window.addEventListener("beforeunload", () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  console.log("✅ Custom feedback slider initialized successfully");
}

// Two Cards Per Slide Carousel (Vanilla JS) - improved (infinite loop + smooth transitions)
function initTwoCardCarousel() {
  const track = document.getElementById("carousel-track");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (!track || !nextBtn || !prevBtn) {
    console.warn("Carousel elements missing. Skipping initialization.");
    return;
  }

  // Track drag vs click so dragging on images/cards never triggers navigation
  let lastDragAt = 0;

  // Prevent accidental navigation from empty anchors inside cards (e.g., <a href="">)
  // and also suppress click right after a drag.
  track.addEventListener(
    "click",
    (e) => {
      if (Date.now() - lastDragAt < 450) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const a = e.target?.closest?.("a");
      if (!a || !track.contains(a)) return;
      const href = (a.getAttribute("href") || "").trim();
      if (!href || href === "#" || href === "./" || href === "/") {
        e.preventDefault();
      }
    },
    true
  );

  // Prevent browser default image/link dragging ghost
  track.addEventListener("dragstart", (e) => e.preventDefault());

  const viewport = track.parentElement;
  const originals = Array.from(track.children);

  if (originals.length === 0) return;

  // State in "slides" (each slide = viewport width)
  let cardsPerSlide = 2;
  let totalSlides = 1;
  let currentIndex = 1; // 0 = cloned last, 1..totalSlides = real, totalSlides+1 = cloned first
  let isTransitioning = false;

  // Basic UX
  track.style.cursor = "pointer";
  viewport.style.width = "100%";
  viewport.style.touchAction = "pan-y";

  function computeSettings() {
    cardsPerSlide = window.innerWidth < 768 ? 1 : 2;
    totalSlides = Math.max(1, Math.ceil(originals.length / cardsPerSlide));
  }

 function setCardWidths() {
  const containerWidth = viewport.offsetWidth;
  const cardWidth = containerWidth / cardsPerSlide;

  Array.from(track.children).forEach((card) => {
    card.style.minWidth = `${cardWidth}px`;
    card.style.width = `${cardWidth}px`;
  });
}

  function setTransition(enabled) {
    track.style.transition = enabled
      ? "transform 520ms cubic-bezier(0.4, 0, 0.2, 1)"
      : "none";
  }

  function translateToIndex(index) {
    const containerWidth = viewport.offsetWidth || viewport.getBoundingClientRect().width;
    track.style.transform = `translateX(${-index * containerWidth}px)`;
  }

  function rebuild() {
    // Reset DOM to originals (remove old clones)
    track.innerHTML = "";
    originals.forEach((el) => track.appendChild(el));

    computeSettings();

    // If not enough items, keep it simple and disable navigation
    if (originals.length <= cardsPerSlide) {
      nextBtn.style.opacity = "0.6";
      prevBtn.style.opacity = "0.6";
      nextBtn.style.pointerEvents = "none";
      prevBtn.style.pointerEvents = "none";
      setCardWidths();
      setTransition(false);
      track.style.transform = "translateX(0px)";
      return;
    }

    // Enable navigation
    nextBtn.style.opacity = "";
    prevBtn.style.opacity = "";
    nextBtn.style.pointerEvents = "";
    prevBtn.style.pointerEvents = "";

    // Add clones: last slide cards at start, first slide cards at end
    const prependCount = Math.min(cardsPerSlide, originals.length);
    const appendCount = Math.min(cardsPerSlide, originals.length);

    const tail = originals.slice(-prependCount).map((el) => {
      const clone = el.cloneNode(true);
      clone.classList.add("carousel-clone");
      clone.setAttribute("aria-hidden", "true");
      return clone;
    });
    const head = originals.slice(0, appendCount).map((el) => {
      const clone = el.cloneNode(true);
      clone.classList.add("carousel-clone");
      clone.setAttribute("aria-hidden", "true");
      return clone;
    });

    // Prepend in correct order
    tail.reverse().forEach((clone) => track.insertBefore(clone, track.firstChild));
    head.forEach((clone) => track.appendChild(clone));

    setCardWidths();

    // Jump to first real slide without animation
    currentIndex = 1;
    setTransition(false);
    translateToIndex(currentIndex);
    requestAnimationFrame(() => setTransition(true));
  }

  function goTo(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    setTransition(true);
    translateToIndex(currentIndex);
  }

  function next() {
    if (isTransitioning) return;
    goTo(currentIndex + 1);
  }

  function prev() {
    if (isTransitioning) return;
    goTo(currentIndex - 1);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Smooth infinite loop fixup on transition end
  track.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    // Past last real slide -> jump to first real slide
    if (currentIndex === totalSlides + 1) {
      setTransition(false);
      currentIndex = 1;
      translateToIndex(currentIndex);
      // Force reflow then re-enable transitions
      track.getBoundingClientRect();
      setTransition(true);
    }

    // Before first real slide -> jump to last real slide
    if (currentIndex === 0) {
      setTransition(false);
      currentIndex = totalSlides;
      translateToIndex(currentIndex);
      track.getBoundingClientRect();
      setTransition(true);
    }

    isTransitioning = false;
  });

  // Swipe / drag
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50;

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const swipeDistanceX = touchStartX - touchEndX;
      const swipeDistanceY = touchStartY - touchEndY;

      if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (swipeDistanceX > minSwipeDistance) next();
        else if (swipeDistanceX < -minSwipeDistance) prev();
      }
    },
    { passive: true }
  );

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let didDrag = false;

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    didDrag = false;
    track.classList.add("is-dragging");
    track.style.cursor = "pointer";
    // Avoid selecting text / dragging images
    e.preventDefault();
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = Math.abs(dragStartX - e.clientX);
    const dy = Math.abs(dragStartY - e.clientY);
    if (!didDrag && dx > 6 && dx > dy) didDrag = true;
    e.preventDefault();
  });

  track.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove("is-dragging");
    track.style.cursor = "grab";

    const dragDistanceX = dragStartX - e.clientX;
    const dragDistanceY = dragStartY - e.clientY;

    if (Math.abs(dragDistanceX) > Math.abs(dragDistanceY)) {
      if (dragDistanceX > minSwipeDistance) next();
      else if (dragDistanceX < -minSwipeDistance) prev();
    }

    if (didDrag) lastDragAt = Date.now();
  });

  track.addEventListener("mouseleave", () => {
    isDragging = false;
    track.classList.remove("is-dragging");
    track.style.cursor = "pointer";
  });

  // Resize: rebuild clones + widths
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => rebuild(), 150);
  });

  // First build
  rebuild();
}

// Counter Animation System - Professional Version
class CounterAnimationSystem {
  constructor() {
    this.initialized = false;
    this.animatedSections = new Set();
    this.observer = null;
    this.options = {
      duration: 2000,
      ease: "easeOutQuart",
      delayBetweenCounters: 150,
      threshold: 0.3,
      rootMargin: "100px",
    };
  }

  init() {
    if (this.initialized) {
      console.warn("Counter system already initialized");
      return;
    }

    console.log("🚀 Initializing Professional Counter Animation System...");

    setTimeout(() => {
      this.setupIntersectionObserver();
      this.bindEvents();
      this.initialized = true;
      console.log("✅ Counter system initialized successfully");
    }, 100);
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !this.animatedSections.has(entry.target)
          ) {
            this.animateSection(entry.target);
          }
        });
      },
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin,
      }
    );

    document.querySelectorAll(".counter-section").forEach((section) => {
      this.observer.observe(section);
    });
  }

  bindEvents() {
    // Desktop hover
    document.querySelectorAll(".counter-section").forEach((section) => {
      section.addEventListener("mouseenter", () => {
        if (!this.animatedSections.has(section)) {
          this.animateSection(section);
        }
      });

      // Touch events for mobile
      section.addEventListener(
        "touchstart",
        () => {
          if (!this.animatedSections.has(section)) {
            this.animateSection(section);
          }
        },
        { passive: true }
      );
    });

    // Mobile trigger button
    const mobileBtn = document.getElementById("mobileCounterTrigger");
    if (mobileBtn) {
      mobileBtn.addEventListener("click", () => {
        const section = mobileBtn.closest(".counter-section");
        if (section && !this.animatedSections.has(section)) {
          this.animateSection(section);
          mobileBtn.textContent = "✅ Stats Animated!";
          mobileBtn.classList.remove("animate-pulse");
          mobileBtn.classList.add("opacity-70");
        }
      });
    }

    // Desktop gradient hover
    const desktopGradient = document.querySelector(".group\\/gradient");
    if (desktopGradient) {
      desktopGradient.addEventListener("mouseenter", () => {
        const section = desktopGradient.closest(".counter-section");
        if (section && !this.animatedSections.has(section)) {
          this.animateSection(section);
        }
      });
    }
  }

  animateSection(section) {
    if (!section || this.animatedSections.has(section)) return;

    this.animatedSections.add(section);
    console.log(
      `🎯 Animating section: ${
        section.getAttribute("data-counter-section") || "unnamed"
      }`
    );

    const counters = section.querySelectorAll(".counter");
    const totalCounters = counters.length;

    counters.forEach((counter, index) => {
      setTimeout(() => {
        this.animateSingleCounter(counter);
      }, index * this.options.delayBetweenCounters);
    });

    section.classList.add("counter-animated");
    setTimeout(() => {
      section.classList.add("counter-complete");
    }, this.options.duration + totalCounters * this.options.delayBetweenCounters);
  }

  animateSingleCounter(counter) {
    const target = parseInt(counter.getAttribute("data-target")) || 0;
    const start = parseInt(counter.getAttribute("data-start")) || 0;

    if (target <= start) return;

    const duration = this.options.duration;
    const startTime = performance.now();
    const increment = target - start;

    const easeFunctions = {
      easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
      easeInOutQuad: (t) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
      easeOutBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
    };

    const ease = easeFunctions[this.options.ease] || easeFunctions.easeOutQuart;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = ease(progress);

      const currentValue = Math.floor(start + increment * easedProgress);
      counter.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counter.textContent = target.toLocaleString();
        counter.classList.add("counter-complete");

        const isLastCounter =
          !counter.nextElementSibling ||
          !counter.nextElementSibling.classList.contains("counter");

        if (isLastCounter) {
          this.triggerCompletionEffect(counter);
        }
      }
    };

    requestAnimationFrame(animate);
  }

  triggerCompletionEffect(counter) {
    counter.parentElement.classList.add("animate-pulse");
    setTimeout(() => {
      counter.parentElement.classList.remove("animate-pulse");
    }, 1000);
    console.log("🎉 All counters completed!");
  }

  resetSection(section) {
    if (!section) return;

    this.animatedSections.delete(section);
    section.classList.remove("counter-animated", "counter-complete");

    section.querySelectorAll(".counter").forEach((counter) => {
      counter.textContent = counter.getAttribute("data-start") || "0";
      counter.classList.remove("counter-complete");
    });

    const mobileBtn = document.getElementById("mobileCounterTrigger");
    if (mobileBtn && mobileBtn.closest(".counter-section") === section) {
      mobileBtn.textContent = "🎯 View Animated Stats";
      mobileBtn.classList.remove("opacity-70");
      mobileBtn.classList.add("animate-pulse");
    }
  }

  resetAll() {
    document.querySelectorAll(".counter-section").forEach((section) => {
      this.resetSection(section);
    });
    console.log("🔄 All counters reset");
  }
}

// Initialize the counter system
function initCounterAnimation() {
  window.counterSystem = new CounterAnimationSystem();
  window.counterSystem.init();
  return window.counterSystem;
}

// Header Scroll Handler - Fixed after 10px scroll
function initHeaderScroll() {
  const header = document.getElementById("mainHeader");

  if (!header) {
    console.warn(
      "Header element not found. Skipping scroll handler initialization."
    );
    return;
  }

  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 10) {
      header.classList.add("header-fixed");
    } else {
      header.classList.remove("header-fixed");
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  updateHeader();
  window.addEventListener("scroll", onScroll, { passive: true });

  console.log("✅ Header scroll handler initialized");
}

// One-page bootstrap (no component loading)
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Initializing application...");

  initNavigation();
  initHeaderScroll();
  initTabs();
  initSlider();
  initFeedbackSlider();
  initTwoCardCarousel();

  // View services button should scroll on one-page
  const viewAllServicesBtn = document.getElementById("viewAllServicesBtn");
  if (viewAllServicesBtn) {
    viewAllServicesBtn.addEventListener("click", () => {
      const section = document.getElementById("AllServices");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Year in footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Counter animation
  const counterSystem = initCounterAnimation();

  // Auto-start for mobile
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      const section = document.querySelector(".counter-section");
      if (section && !counterSystem.animatedSections.has(section)) {
        console.log("📱 Mobile auto-start triggered");
        counterSystem.animateSection(section);
      }
    }, 1500);
  }

  console.log("🎉 All systems ready!");
});

// Make sure functions are available globally if needed
window.initNavigation = initNavigation;
window.initTabs = initTabs;
window.initSlider = initSlider;
window.initFeedbackSlider = initFeedbackSlider;
window.initTwoCardCarousel = initTwoCardCarousel;
window.initCounterAnimation = initCounterAnimation;
window.initHeaderScroll = initHeaderScroll;
window.resetCounters = () => window.counterSystem?.resetAll();

// AOS initialization with mobile detection
function initAOS() {
  // Check if device is mobile
  const isMobile = window.innerWidth <= 1024;

  if (!isMobile) {
    // Initialize AOS only for non-mobile devices
    AOS.init({
      duration: 1000,
      delay: 200,
      once: false,
      disable: false, // Enable for desktop
    });
  } else {
    // Disable AOS for mobile devices
    AOS.init({
      disable: true, // Disable for mobile
    });
  }
}
/* ............................................extra Carousel Container ........................................*/

// Carousel data with images
const carouselData = [
  {
    id: 1,
    title: "Innovation",
    color: "text-[#0000ff]",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    content: `
      <div class="h-full w-full flex flex-col lg:flex-row items-center">
        <!-- Text Column -->
        <div class="w-full lg:w-1/2 px-4 lg:px-8 flex flex-col justify-center order-2 lg:order-1">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0000ff] mb-4 md:mb-6 leading-tight">Where Innovation Meets Authenticity</h2>
          <p class="text-gray-600 leading-relaxed mb-6 md:mb-8 text-base md:text-lg">
           At CodeNdCoffee, we create a workspace where creativity meets professionalism. Our team members are encouraged to stay authentic, showcase their unique style, and are always treated with respect and excellence. Every day, we strive to foster an inclusive environment, free from bias, where innovative software solutions and digital products thrive.
          </p>
          
          
  <a href="#" class="inline-flex items-center text-[#0000ff] hover:text-green-700 font-semibold transition-all duration-300 text-lg group">
            EXPLORE INITIATIVES
             <svg class="w-5 h-5 ml-3 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
 
          
        </div>
        
        <!-- Image Column -->
        <div class="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center order-1 lg:order-2 mb-6 lg:mb-0">
          <div class="relative overflow-hidden rounded-2xl shadow-2xl">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80" 
                 alt="Diversity and Inclusion" 
                 class="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover transform transition-transform duration-700 hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
       
          
            </div>

         
 
        </div>
      </div>
    `,
  },
  {
    id: 2,
    title: "Sustainable",
    color: "text-[#0000ff]",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: `
      <div class="h-full w-full flex flex-col lg:flex-row items-center">
        <!-- Text Column -->
        <div class="w-full lg:w-1/2 px-4 lg:px-8 flex flex-col justify-center order-2 lg:order-1">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0000ff] mb-4 md:mb-6 leading-tight">Sustainable Innovation, Responsible Software</h2>
          <p class="text-gray-600 leading-relaxed mb-6 md:mb-8 text-base md:text-lg">
            At CodeNdCoffee, we are committed to reducing our environmental impact and promoting sustainable practices across all our operations. By leveraging innovative technologies and supporting renewable energy initiatives, we aim to achieve net-zero emissions by 2040 while delivering cutting-edge software solutions.
          </p>
          <a href="#" class="inline-flex items-center text-[#0000ff] hover:text-green-700 font-semibold transition-all duration-300 text-lg group">
            EXPLORE INITIATIVES
             <svg class="w-5 h-5 ml-3 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
 
        </div>
        
        <!-- Image Column -->
        <div class="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center order-1 lg:order-2 mb-6 lg:mb-0">
          <div class="relative overflow-hidden rounded-2xl shadow-2xl">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Environmental Responsibility" 
                 class="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover transform transition-transform duration-700 hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 3,
    title: "Creativity",
    color: "text-[#0000ff]",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: `
      <div class="h-full w-full flex flex-col lg:flex-row items-center">
        <!-- Text Column -->
        <div class="w-full lg:w-1/2 px-4 lg:px-8 flex flex-col justify-center order-2 lg:order-1">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0000ff] mb-4 md:mb-6 leading-tight">Creative Solutions</h2>
          <p class="text-gray-600 leading-relaxed mb-6 md:mb-8 text-base md:text-lg">
            At CodeNdCoffee, we drive progress through innovative software solutions and creative digital products. Our R&D initiatives focus on sustainable technologies, smart digital transformations, and practices that support a circular economy.
          </p>
        <a href="#" class="inline-flex items-center text-[#0000ff] hover:text-green-700 font-semibold transition-all duration-300 text-lg group">
            EXPLORE INITIATIVES
             <svg class="w-5 h-5 ml-3 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
 
        </div>
        
        <!-- Image Column -->
        <div class="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center order-1 lg:order-2 mb-6 lg:mb-0">
          <div class="relative overflow-hidden rounded-2xl shadow-2xl">
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Innovation Technology" 
                 class="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover transform transition-transform duration-700 hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 4,
    title: "Safety",
    color: "text-[#0000ff]",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: `
      <div class="h-full w-full flex flex-col lg:flex-row items-center">
        <!-- Text Column -->
        <div class="w-full lg:w-1/2 px-4 lg:px-8 flex flex-col justify-center order-2 lg:order-1">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0000ff] mb-4 md:mb-6 leading-tight">Prioritizing People, Safety, and Excellence</h2>
          <p class="text-gray-600 leading-relaxed mb-6 md:mb-8 text-base md:text-lg">
            At CodeNdCoffee, the health, safety, and well-being of our employees, partners, and communities are our top priorities. We uphold the highest workplace standards and promote a safe, supportive environment across all our offices and operations
          </p>
       <a href="#" class="inline-flex items-center text-[#0000ff] hover:text-green-700 font-semibold transition-all duration-300 text-lg group">
            EXPLORE INITIATIVES
             <svg class="w-5 h-5 ml-3 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
 
        </div>
        
        <!-- Image Column -->
        <div class="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center order-1 lg:order-2 mb-6 lg:mb-0">
          <div class="relative overflow-hidden rounded-2xl shadow-2xl">
            <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Safety First" 
                 class="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover transform transition-transform duration-700 hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    `,
  },
];

// Carousel state
let currentSlide = 0;
let isAnimating = false;

// DOM Elements
const tabsContainer = document.getElementById("tabs-container");
const carouselTrack = document.getElementById("carousel-track");

// Initialize carousel
function initCarousel() {
  // Clear existing content
  tabsContainer.innerHTML = '';
  carouselTrack.innerHTML = '';
  
  // Create tabs
  carouselData.forEach((slide, index) => {
    // Create tab button
    const tabBtn = document.createElement("button");
    tabBtn.className = `tab-btn flex-shrink-0 lg:w-full text-left px-4 py-3 lg:px-6 lg:py-4 rounded-lg transition-all duration-500 ease-out ${
      index === 0 
        ? "active bg-gradient-to-r from-blue-50 to-white border-l-4 border-[#0000ff] shadow-sm mb-5" 
        : "text-gray-600 hover:bg-gray-50 mb-5"
    }`;
    tabBtn.innerHTML = `
      <div class="flex items-center">
        <span class="font-medium text-sm md:text-base lg:text-lg transition-all duration-300 ${
          index === 0 ? "text-[#0000ff] font-semibold" : "text-gray-600"
        }">${slide.title}</span>
        <svg class="w-4 h-4 ml-2 transform transition-transform duration-300 ${
          index === 0 ? "opacity-100 translate-x-0" : "opacity-0 "
        }" fill="none" stroke="#0000ff" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    `;
    tabBtn.addEventListener("click", () => {
      if (!isAnimating) goToSlide(index);
    });
    tabsContainer.appendChild(tabBtn);

    // Create carousel slide
    const carouselSlide = document.createElement("div");
    carouselSlide.className = `carousel-slide absolute inset-0 w-full h-full ${
      index === 0 ? "active opacity-100 scale-100" : "opacity-0 scale-95"
    }`;
    carouselSlide.innerHTML = slide.content;
    carouselTrack.appendChild(carouselSlide);
  });

  // Initialize AOS if function exists
  if (typeof initAOS === 'function') {
    initAOS();
  }
}

// Professional slide animation with smooth transitions
function goToSlide(index) {
  if (isAnimating || index === currentSlide) return;
  
  isAnimating = true;
  
  // Get all slides and tabs
  const slides = document.querySelectorAll(".carousel-slide");
  const tabs = document.querySelectorAll(".tab-btn");
  const direction = index > currentSlide ? "next" : "prev";
  
  // Exit animation for current slide
  const currentSlideEl = slides[currentSlide];
  currentSlideEl.classList.add("exit-animation");
  currentSlideEl.classList.remove("active", "opacity-100", "scale-100");
  
  // Prepare new slide with entrance animation
  const newSlideEl = slides[index];
  newSlideEl.classList.remove("opacity-0", "scale-95");
  newSlideEl.classList.add(`enter-animation-${direction}`);
  
  // Update tabs with smooth transition
  tabs.forEach((tab, tabIndex) => {
    const titleSpan = tab.querySelector("span");
    const arrowIcon = tab.querySelector("svg");
    
    if (tabIndex === index) {
      // Active tab
      tab.classList.add("active", "bg-gradient-to-r", "from-blue-50", "to-white", "border-l-4", "border-[#0000ff]", "shadow-sm", "mb-5");
      tab.classList.remove("text-gray-600", "hover:bg-gray-50");
      titleSpan.classList.add("text-[#0000ff]", "font-semibold");
      titleSpan.classList.remove("text-gray-600");
      arrowIcon.classList.add("opacity-100", "translate-x-0");
      arrowIcon.classList.remove("opacity-0", "-translate-x-2");
      arrowIcon.setAttribute("stroke", "#0000ff");
    } else {
      // Inactive tab
      tab.classList.remove("active", "bg-gradient-to-r", "from-blue-50", "to-white", "border-l-4", "border-[#0000ff]", "shadow-sm");
      tab.classList.add("text-gray-600", "hover:bg-gray-50", "mb-5");
      titleSpan.classList.remove("text-[#0000ff]", "font-semibold");
      titleSpan.classList.add("text-gray-600");
      arrowIcon.classList.remove("opacity-100", "translate-x-0");
      arrowIcon.classList.add("opacity-0", "-translate-x-2");
      arrowIcon.setAttribute("stroke", "currentColor");
    }
  });
  
  // Update current slide
  currentSlide = index;
  
  // Wait for exit animation to complete, then start entrance
  setTimeout(() => {
    // Remove exit animation classes
    currentSlideEl.classList.remove("exit-animation");
    
    // Add active classes to new slide
    newSlideEl.classList.remove(`enter-animation-${direction}`);
    newSlideEl.classList.add("active", "opacity-100", "scale-100");
    
    isAnimating = false;
  }, 300);
}

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", function () {
  initCarousel();
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (carouselTrack) {
  carouselTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselTrack.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  if (isAnimating) return;
  
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next slide
      const nextSlide = (currentSlide + 1) % carouselData.length;
      goToSlide(nextSlide);
    } else {
      // Swipe right - previous slide
      const prevSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
      goToSlide(prevSlide);
    }
  }
}
// ..................................Faqs........................................


// FAQ accordion helpers (keeps inline handlers working)
function toggleFaq(button, faqNumber) {
  const faqItem = button.closest(".faq-item");
  const answer = faqItem?.querySelector(".faq-answer");
  const icon = faqItem?.querySelector(".icon-plus i");
  const isExpanded = button.getAttribute("aria-expanded") === "true";

  closeOtherFAQs(faqNumber);

  if (isExpanded) {
    closeFaq(button, answer, icon);
  } else {
    openFaq(button, answer, icon);
  }
}

function openFaq(button, answer, icon) {
  if (!button || !answer || !icon) return;

  button.setAttribute("aria-expanded", "true");
  answer.setAttribute("aria-hidden", "false");

  answer.style.maxHeight = answer.scrollHeight + "px";
  answer.classList.add("open");

  icon.classList.remove("fa-plus");
  icon.classList.add("fa-minus");
  icon.style.transform = "rotate(180deg)";

  button.style.fontWeight = "600";
  button.closest(".faq-item")?.classList.add("active");
}

function closeFaq(button, answer, icon) {
  if (!button || !answer || !icon) return;

  button.setAttribute("aria-expanded", "false");
  answer.setAttribute("aria-hidden", "true");

  answer.style.maxHeight = "0";
  setTimeout(() => answer.classList.remove("open"), 300);

  icon.classList.remove("fa-minus");
  icon.classList.add("fa-plus");
  icon.style.transform = "rotate(0deg)";

  button.style.fontWeight = "";
  button.closest(".faq-item")?.classList.remove("active");
}

function closeOtherFAQs(currentFaq) {
  const allFaqs = document.querySelectorAll(".faq-item");
  allFaqs.forEach((faq, index) => {
    if (index + 1 !== currentFaq) {
      const answer = faq.querySelector(".faq-answer");
      const button = faq.querySelector(".faq-question");
      const icon = faq.querySelector(".icon-plus i");
      if (answer?.classList.contains("open")) {
        closeFaq(button, answer, icon);
      }
    }
  });
}

function closeAllFAQs() {
  const allFaqs = document.querySelectorAll(".faq-item");
  allFaqs.forEach((faq) => {
    const answer = faq.querySelector(".faq-answer");
    const button = faq.querySelector(".faq-question");
    const icon = faq.querySelector(".icon-plus i");
    if (answer?.classList.contains("open")) {
      closeFaq(button, answer, icon);
    }
  });
}

function initFaqAccessibility() {
  // Keyboard support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains("faq-question")) {
        e.preventDefault();
        const faqNumber =
          Array.from(document.querySelectorAll(".faq-question")).indexOf(focusedElement) + 1;
        toggleFaq(focusedElement, faqNumber);
      }
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const currentFaq = document.activeElement;
      const allFaqButtons = Array.from(document.querySelectorAll(".faq-question"));
      const currentIndex = allFaqButtons.indexOf(currentFaq);

      if (currentIndex !== -1) {
        const nextIndex =
          e.key === "ArrowDown"
            ? (currentIndex + 1) % allFaqButtons.length
            : (currentIndex - 1 + allFaqButtons.length) % allFaqButtons.length;
        allFaqButtons[nextIndex].focus();
      }
    }
  });

  // Close all FAQs when clicking outside (optional)
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".faq-item") && !e.target.closest(".faq-question")) {
      // Uncomment to close when clicking outside:
      // closeAllFAQs();
    }
  });
}













  window.addEventListener("load", function () {
    const modal = document.getElementById("cookieModal");

    // Show modal if not already accepted in session
    if (!sessionStorage.getItem("cookiesAccepted")) {
      setTimeout(() => {
        modal.style.transform = "translateY(0)";
        modal.style.opacity = "1";
      }, 300);
    }
  });

  document.getElementById("acceptCookies").addEventListener("click", function () {
    sessionStorage.setItem("cookiesAccepted", "true");
    closeModal();
  });

  document.getElementById("declineCookies").addEventListener("click", function () {
    closeModal();
  });

  function closeModal() {
    const modal = document.getElementById("cookieModal");
    modal.style.transform = "translateY(100%)";
    modal.style.opacity = "0";
  }


