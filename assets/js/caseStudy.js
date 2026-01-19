        document.addEventListener('DOMContentLoaded', function() {
            const sliderTrack = document.getElementById('sliderTrack');
            const slides = document.querySelectorAll('.slide');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const indicators = document.querySelectorAll('.indicator');
            
            let currentSlide = 1;
            let slideCount = slides.length;
            let realSlideCount = 3;
            let isTransitioning = false;
            let autoplayInterval;
            const autoplaySpeed = 6000;
            
            // Initialize slider position
            sliderTrack.style.transform = `translateX(-${100}%)`;
            
            // Initialize slider
            function initSlider() {
                updateIndicators();
                startAutoplay();
            }
            
            // Update slider position
            function updateSliderPosition(instant = false) {
                if (instant) {
                    sliderTrack.style.transition = 'none';
                } else {
                    sliderTrack.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                
                sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                if (!instant) {
                    isTransitioning = true;
                    
                    // Animate content
                    animateContent();
                    
                    setTimeout(() => {
                        isTransitioning = false;
                        checkInfiniteLoop();
                    }, 800);
                } else {
                    animateContent();
                }
            }
            
            // Animate content with fade-up effect
            function animateContent() {
                // Remove animation classes
                const currentSlideElement = slides[currentSlide];
                const fadeElements = currentSlideElement.querySelectorAll('.fade-up');
                
                fadeElements.forEach(el => {
                    el.classList.remove('fade-up');
                    void el.offsetWidth; 
                });
                
                // Add animation classes with delay
                setTimeout(() => {
                    fadeElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('fade-up');
                        }, index * 100);
                    });
                }, 300);
            }
            
            // Check and reset for infinite loop
            function checkInfiniteLoop() {
                if (currentSlide === 0) {
                    currentSlide = realSlideCount;
                    updateSliderPosition(true);
                } else if (currentSlide === slideCount - 1) {
                    currentSlide = 1;
                    updateSliderPosition(true);
                }
                
                updateIndicators();
            }
            
            // Update indicators
            function updateIndicators() {
                let realIndex;
                
                if (currentSlide === 0) {
                    realIndex = realSlideCount - 1;
                } else if (currentSlide === slideCount - 1) {
                    realIndex = 0;
                } else {
                    realIndex = currentSlide - 1;
                }
                
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === realIndex);
                });
            }
            
            // Go to next slide
            function nextSlide() {
                if (isTransitioning) return;
                
                currentSlide++;
                updateSliderPosition();
                
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    startAutoplay();
                }
            }
            
            // Go to previous slide
            function prevSlide() {
                if (isTransitioning) return;
                
                currentSlide--;
                updateSliderPosition();
                
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    startAutoplay();
                }
            }
            
            // Go to specific slide
            function goToSlide(index) {
                if (isTransitioning) return;
                
                currentSlide = index + 1;
                updateSliderPosition();
                
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    startAutoplay();
                }
            }
            
            // Start autoplay
            function startAutoplay() {
                if (autoplayInterval) clearInterval(autoplayInterval);
                
                autoplayInterval = setInterval(() => {
                    if (!isTransitioning) {
                        nextSlide();
                    }
                }, autoplaySpeed);
            }
            
            // Event listeners
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    goToSlide(index);
                });
            });
            
            // Pause autoplay on hover
            sliderTrack.parentElement.addEventListener('mouseenter', () => {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                }
            });
            
            // Resume autoplay on mouse leave
            sliderTrack.parentElement.addEventListener('mouseleave', () => {
                startAutoplay();
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSlide();
                }
            });
            
            // Touch swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderTrack.parentElement.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            sliderTrack.parentElement.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }
            
            // Initialize
            initSlider();
            animateContent();
        });



           // Initialize AOS
        AOS.init({
            duration: 600,
            once: false,
            mirror: true,
            offset: 50
        });


// ...new jsx...
     // Simple JavaScript function for view details
      function viewDetails(caseStudyId) {
        alert(
          `Viewing details for: ${caseStudyId}\n\nThis would typically open a modal or navigate to a detailed page.`,
        );

        // You can add more functionality here:
        // 1. Open a modal with more details
        // 2. Navigate to a separate page
        // 3. Show more information
      }

      // Add animation delays to all animated elements
      document.addEventListener("DOMContentLoaded", function () {
        const animatedElements = document.querySelectorAll(".animate-fade-up");
        animatedElements.forEach((element, index) => {
          element.style.animationDelay = `${index * 0.1}s`;
        });

        // Add click handlers to all cards
        const cards = document.querySelectorAll(".case-study-card");
        cards.forEach((card) => {
          card.addEventListener("click", function (e) {
            if (!e.target.closest(".cta-button")) {
              const title = this.querySelector(".case-study-title").textContent;
              alert(`Opening detailed view for: ${title}`);
            }
          });
        });
      });






// .......................featured/case tabs.................
        const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      // Buttons
      tabButtons.forEach(b => b.classList.remove("active-tab"));
      btn.classList.add("active-tab");

      // Content
      tabContents.forEach(content => {
        content.classList.add("hidden");
        content.classList.remove("block");
      });

      document.getElementById(target).classList.remove("hidden");
      document.getElementById(target).classList.add("block");
    });
  });