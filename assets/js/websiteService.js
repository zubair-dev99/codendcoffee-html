const counters = document.querySelectorAll('.counter');
let hasAnimated = false;

const animateCounters = () => {
  if (hasAnimated) return;
  hasAnimated = true;

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;

    const increment = Math.ceil(target / 200); // 90 se 200 kar diya, animation slow ho jayegi

    const update = () => {
      count += increment;
      if (count < target) {
        counter.textContent = count + '+';
        setTimeout(update, 60); // 20ms delay lagaya
      } else {
        counter.textContent = target + '+';
      }
    };

    update();
  });
};

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  },
  { threshold: 0.4 }
);

counters.forEach(counter => observer.observe(counter));




