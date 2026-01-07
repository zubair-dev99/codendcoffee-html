// AllServices page-specific JavaScript

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

// Show more/less toggle & container state
function initShowMoreToggle() {
  const toggle = document.getElementById("show-more-toggle");
  if (!toggle) return;

  const setContainerState = (checked) => {
    let p = toggle.parentElement;
    while (p && !p.classList.contains("container")) p = p.parentElement;
    if (!p) return;
    if (checked) p.classList.add("expanded");
    else p.classList.remove("expanded");
  };

  setContainerState(toggle.checked);

  toggle.addEventListener("change", function () {
    setContainerState(this.checked);

    // When unchecked (Show Less), scroll to the top of the services section
    if (!this.checked) {
      const target = document.getElementById("AllServices") || document.getElementById("servicesGrid");
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });

  const label = document.querySelector("label[for='show-more-toggle']");
  if (label) {
    label.addEventListener("click", function () {
      setTimeout(() => setContainerState(toggle.checked), 10);
    });
  }
}

// Equalize `.service-card` heights on mobile and keep spacing tidy
function initEqualizeServiceCards() {
  const selector = "#servicesGrid .service-card";

  function equalize() {
    const cards = Array.from(document.querySelectorAll(selector));
    if (!cards.length) return;

    cards.forEach((c) => (c.style.height = "auto"));
    if (window.innerWidth > 767) return;

    const visible = cards.filter((c) => c.offsetParent !== null);
    let max = 0;
    visible.forEach((c) => {
      const h = c.getBoundingClientRect().height;
      if (h > max) max = h;
    });
    if (max > 0) visible.forEach((c) => (c.style.height = Math.ceil(max) + "px"));
  }

  const debounced = (fn, wait = 120) => {
    let t;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  };

  const onResize = debounced(equalize, 150);
  window.addEventListener("resize", onResize);

  document.querySelectorAll("#servicesGrid img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", equalize);
  });

  const toggle = document.getElementById("show-more-toggle");
  if (toggle) toggle.addEventListener("change", () => setTimeout(equalize, 120));

  setTimeout(equalize, 120);
}

// Service Mobile Slider - Infinite Center Mode (AllServices only)
function initInfiniteCarousels() {
  const carousels = Array.from(document.querySelectorAll("[data-infinite-carousel]"));
  if (!carousels.length) return;

  carousels.forEach((root) => {
    const track =
      root.querySelector("[data-carousel-track]") ||
      root.querySelector(":scope > div") ||
      root.firstElementChild;

    if (!track) {
      console.warn("Infinite carousel: missing track element.", root);
      return;
    }

    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");

    const enableBelow = parseInt(root.getAttribute("data-carousel-enable-below") || "1024", 10);
    const baseItems = parseInt(root.getAttribute("data-carousel-items") || "2", 10);
    const autoplay = (root.getAttribute("data-carousel-autoplay") || "true") !== "false";
    const delay = parseInt(root.getAttribute("data-carousel-delay") || "3200", 10);

    const originalMarkup = track.innerHTML;
    let enabled = false;

    // State
    let itemsPerView = baseItems;
    let cloneCount = Math.max(2, itemsPerView + 1);
    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayTimer = null;
    let resizeTimer = null;

    // Interaction state
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    function getCssGapPx() {
      // Some browsers may report `gap` as "normal" for flex; keep this as a fallback only.
      const cs = window.getComputedStyle(track);
      const raw =
        cs.gap ||
        cs.columnGap ||
        cs.rowGap ||
        "0";
      const gap = parseFloat(raw);
      return Number.isFinite(gap) ? gap : 0;
    }

    function computeItemsPerView() {
      // Keep it simple: use the configured value on mobile; clamp to [1..]
      itemsPerView = Math.max(1, baseItems);
      cloneCount = Math.max(2, itemsPerView + 1);
    }

    function setTransition(enabledTransition) {
      track.style.transition = enabledTransition
        ? "transform 520ms cubic-bezier(0.4, 0, 0.2, 1)"
        : "none";
    }

    function applyItemWidth(widthPx) {
      Array.from(track.children).forEach((item) => {
        item.style.minWidth = `${widthPx}px`;
        item.style.width = `${widthPx}px`;
        item.style.maxWidth = `${widthPx}px`;
      });
    }

    function measureGapPx() {
      const kids = track.children;
      if (kids.length >= 2) {
        // Transform shifts both rects equally, so delta is stable.
        const r1 = kids[0].getBoundingClientRect();
        const r2 = kids[1].getBoundingClientRect();
        const step = r2.left - r1.left;
        const gap = step - r1.width;
        if (Number.isFinite(gap) && gap >= 0) return gap;
      }
      return getCssGapPx();
    }

    function setItemWidths() {
      const viewportWidth = root.clientWidth || root.getBoundingClientRect().width || 0;
      const safeViewport = viewportWidth || 0;

      // Pass 1: set a rough width so we can measure the real gap reliably.
      const guessWidth = Math.max(0, safeViewport / Math.max(1, itemsPerView));
      applyItemWidth(guessWidth);
      track.getBoundingClientRect(); // force layout

      const gap = measureGapPx();

      // Pass 2: compute exact width to fit N items + (N-1) gaps within the viewport.
      const width = Math.max(0, (safeViewport - gap * (itemsPerView - 1)) / itemsPerView);
      applyItemWidth(width);

      return { itemWidth: width, gap };
    }

    function stepSizePx() {
      const { itemWidth, gap } = setItemWidths();
      return itemWidth + gap;
    }

    function translateToIndex(index, skipTransition = false) {
      const step = stepSizePx();
      setTransition(!skipTransition);
      track.style.transform = `translateX(${-index * step}px)`;
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (!autoplay || !enabled) return;
      autoplayTimer = setInterval(() => {
        goNext();
      }, Math.max(1200, delay));
    }

    function cleanupInlineStyles() {
      track.style.transition = "";
      track.style.transform = "";
      Array.from(track.children).forEach((item) => {
        item.style.minWidth = "";
        item.style.width = "";
        item.style.maxWidth = "";
      });
    }

    function rebuild() {
      const shouldEnable = window.innerWidth < enableBelow;

      // Disable (desktop) — restore original DOM & remove transforms
      if (!shouldEnable) {
        if (enabled) {
          enabled = false;
          stopAutoplay();
          track.innerHTML = originalMarkup;
          cleanupInlineStyles();
          track.classList.remove("is-dragging");
        }
        return;
      }

      // Enable (mobile/tablet)
      enabled = true;
      computeItemsPerView();

      // Restore originals, then clone
      track.innerHTML = originalMarkup;
      const originals = Array.from(track.children);

      if (originals.length <= itemsPerView) {
        // Not enough items to slide; just keep as-is
        cleanupInlineStyles();
        stopAutoplay();
        return;
      }

      // Ensure horizontal track behavior (mobile only)
      root.style.overflow = "hidden";
      root.style.touchAction = "pan-y";
      track.style.willChange = "transform";

      // Clone edges (for seamless looping)
      const head = originals.slice(0, cloneCount).map((el) => {
        const c = el.cloneNode(true);
        c.classList.add("carousel-clone");
        c.setAttribute("aria-hidden", "true");
        return c;
      });
      const tail = originals.slice(-cloneCount).map((el) => {
        const c = el.cloneNode(true);
        c.classList.add("carousel-clone");
        c.setAttribute("aria-hidden", "true");
        return c;
      });

      // Prepend tail in correct order
      tail.reverse().forEach((c) => track.insertBefore(c, track.firstChild));
      head.forEach((c) => track.appendChild(c));

      // Start at the first real item
      currentIndex = cloneCount;
      isTransitioning = false;
      translateToIndex(currentIndex, true);
      requestAnimationFrame(() => setTransition(true));

      startAutoplay();
    }

    function totalRealItems() {
      // Works because rebuild rehydrates from originalMarkup first.
      const tmp = document.createElement("div");
      tmp.innerHTML = originalMarkup;
      return tmp.children.length;
    }

    function goTo(index) {
      if (!enabled || isTransitioning) return;
      isTransitioning = true;
      currentIndex = index;
      translateToIndex(currentIndex, false);
    }

    function goNext() {
      goTo(currentIndex + 1);
    }

    function goPrev() {
      goTo(currentIndex - 1);
    }

    // Buttons (optional)
    if (nextBtn) nextBtn.addEventListener("click", () => goNext());
    if (prevBtn) prevBtn.addEventListener("click", () => goPrev());

    // Pause on interaction
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener(
      "touchstart",
      () => {
        stopAutoplay();
      },
      { passive: true }
    );
    root.addEventListener(
      "touchend",
      () => {
        startAutoplay();
      },
      { passive: true }
    );

    // Transition end: snap to real range for infinite illusion
    track.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "transform") return;
      if (!enabled) return;

      const realCount = totalRealItems();
      const firstReal = cloneCount;
      const lastReal = cloneCount + realCount - 1;

      if (currentIndex > lastReal) {
        setTransition(false);
        currentIndex = firstReal;
        translateToIndex(currentIndex, true);
        track.getBoundingClientRect();
        setTransition(true);
      } else if (currentIndex < firstReal) {
        setTransition(false);
        currentIndex = lastReal;
        translateToIndex(currentIndex, true);
        track.getBoundingClientRect();
        setTransition(true);
      }

      isTransitioning = false;
    });

    // Touch swipe
    track.addEventListener(
      "touchstart",
      (e) => {
        if (!enabled) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        if (!enabled) return;
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const dx = touchStartX - touchEndX;
        const dy = touchStartY - touchEndY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx > 0) goNext();
          else goPrev();
        }
      },
      { passive: true }
    );

    // Mouse drag (desktop browsers at small widths)
    track.addEventListener("mousedown", (e) => {
      if (!enabled) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      track.classList.add("is-dragging");
      track.style.cursor = "grabbing";
      e.preventDefault();
    });

    track.addEventListener("mousemove", (e) => {
      if (!enabled || !isDragging) return;
      e.preventDefault();
    });

    track.addEventListener("mouseup", (e) => {
      if (!enabled || !isDragging) return;
      isDragging = false;
      track.classList.remove("is-dragging");
      track.style.cursor = "grab";

      const dx = dragStartX - e.clientX;
      const dy = dragStartY - e.clientY;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) goNext();
        else goPrev();
      }
    });

    track.addEventListener("mouseleave", () => {
      isDragging = false;
      track.classList.remove("is-dragging");
      track.style.cursor = "grab";
    });

    // Visibility handling (avoid autoplay running in background tab)
    document.addEventListener("visibilitychange", () => {
      if (!enabled) return;
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    // Initial build + resize rebuild
    rebuild();
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => rebuild(), 150);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Keep inline onclick handlers functional
  window.toggleFaq = toggleFaq;

  initFaqAccessibility();
  initShowMoreToggle();
  initEqualizeServiceCards();
  initInfiniteCarousels();

  const openFaqOnResize = () => {
    const openFaq = document.querySelector(".faq-answer.open");
    if (openFaq) openFaq.style.maxHeight = openFaq.scrollHeight + "px";
  };

  window.addEventListener("resize", openFaqOnResize);
});





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