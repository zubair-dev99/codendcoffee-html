const counters = document.querySelectorAll(".counter");
let hasAnimated = false;

const animateCounters = () => {
  if (hasAnimated) return;
  hasAnimated = true;

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;

    const increment = Math.ceil(target / 200); // 90 se 200 kar diya, animation slow ho jayegi

    const update = () => {
      count += increment;
      if (count < target) {
        counter.textContent = count + "+";
        setTimeout(update, 60); // 20ms delay lagaya
      } else {
        counter.textContent = target + "+";
      }
    };

    update();
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => observer.observe(counter));

// AOS initialization with mobile detection
function initAOS() {
  // Check if device is mobile
  const isMobile = window.innerWidth <= 768;

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

// Initialize on page load
document.addEventListener("DOMContentLoaded", initAOS);

// Re-initialize on window resize
window.addEventListener("resize", initAOS);
