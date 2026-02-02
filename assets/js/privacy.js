
  // Slideshow functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slide-dot");
  const totalSlides = slides.length;

  function goToSlide(n) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    currentSlide = n;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= totalSlides) next = 0;
    goToSlide(next);
  }

  let slideInterval = setInterval(nextSlide, 5000);

  const heroSection = document.querySelector(".hero-bg");
  heroSection.addEventListener("mouseenter", () => clearInterval(slideInterval));
  heroSection.addEventListener(
    "mouseleave",
    () => (slideInterval = setInterval(nextSlide, 5000))
  );

  // ===============================
  // PDF Download Functionality (ANIMATED)
  // ===============================
  // document.getElementById("downloadPdf").addEventListener("click", function () {
  //   const btn = this;
  //   const originalHTML = btn.innerHTML;

  //   // Loading animation
  //   btn.classList.add("loading");
  //   btn.innerHTML = `
  //     <span class="material-symbols-outlined spinner text-lg">progress_activity</span>
  //     Generating...
  //   `;
  //   btn.disabled = true;

  //   const { jsPDF } = window.jspdf;
  //   const doc = new jsPDF("p", "mm", "a4");

  //   // PDF content
  //   doc.setFontSize(22);
  //   doc.setTextColor(0, 0, 255);
  //   doc.text("Privacy Policy", 20, 20);

  //   doc.setFontSize(12);
  //   doc.setTextColor(100, 100, 100);
  //   doc.text("Software House - Last Updated: October 24, 2023", 20, 30);

  //   doc.setFontSize(14);
  //   doc.setTextColor(0, 0, 0);
  //   doc.text("1. Introduction", 20, 50);

  //   doc.setFontSize(11);
  //   doc.setTextColor(80, 80, 80);
  //   doc.text(
  //     "Welcome to Software House. We are committed to protecting your personal information and your right to privacy.",
  //     20,
  //     60,
  //     { maxWidth: 170 }
  //   );

  //   doc.setFontSize(14);
  //   doc.text("2. Information We Collect", 20, 85);
  //   doc.setFontSize(11);
  //   doc.text(
  //     "We collect personal information that you voluntarily provide to us.",
  //     20,
  //     95,
  //     { maxWidth: 170 }
  //   );

  //   doc.setFontSize(14);
  //   doc.text("3. How We Use Your Information", 20, 120);
  //   doc.setFontSize(11);
  //   doc.text(
  //     "We use personal information collected via our website for business purposes.",
  //     20,
  //     130,
  //     { maxWidth: 170 }
  //   );

  //   // Save PDF
  //   doc.save("Software-House-Privacy-Policy.pdf");

  //   // Restore with animation
  //   setTimeout(() => {
  //     btn.innerHTML = originalHTML;
  //     btn.disabled = false;
  //     btn.classList.remove("loading");
  //     btn.classList.add("done");

  //     setTimeout(() => btn.classList.remove("done"), 400);
  //   }, 900);
  // });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: "smooth",
      });
    });
  });

