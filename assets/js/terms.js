
  // Slideshow functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  const totalSlides = slides.length;

  function goToSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = n;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= totalSlides) next = 0;
    goToSlide(next);
  }

  let slideInterval = setInterval(nextSlide, 5000);

  const heroSection = document.querySelector('.hero-bg');
  heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
  heroSection.addEventListener(
    'mouseleave',
    () => (slideInterval = setInterval(nextSlide, 5000))
  );


  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: 'smooth'
      });
    });
  });

