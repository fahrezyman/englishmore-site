/* ===================
   MAIN JAVASCRIPT FILE
   =================== */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initSmoothScrolling();
  initScrollAnimations();
  initCounterAnimations();
  initInteractiveEffects();
  initParallaxEffects();
  initTypingEffect();
  initFormHandling();

  // Mark page as loaded
  document.body.classList.add("loaded");
});

/* ===================
   NAVBAR FUNCTIONALITY
   =================== */

function initNavbar() {
  const navbar = document.getElementById("navbar");

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Active nav link highlighting
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });
}

/* ===================
   MOBILE MENU
   =================== */

function initMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const navMenu = document.querySelector(".nav-menu");

  mobileMenu.addEventListener("click", function () {
    // Toggle mobile menu
    this.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent body scrolling when menu is open
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close mobile menu when clicking on nav links
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

/* ===================
   SMOOTH SCROLLING
   =================== */

function initSmoothScrolling() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ===================
   SCROLL ANIMATIONS
   =================== */

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");

        // Add staggered animation for grid items
        if (
          entry.target.parentElement.classList.contains("features-grid") ||
          entry.target.parentElement.classList.contains("programs-grid") ||
          entry.target.parentElement.classList.contains("testimonials-grid")
        ) {
          const siblings = Array.from(entry.target.parentElement.children);
          const index = siblings.indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

/* ===================
   COUNTER ANIMATIONS
   =================== */

function initCounterAnimations() {
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        element.textContent = target + "+";
      } else {
        element.textContent = Math.floor(current) + "+";
      }
    }, stepTime);
  }

  // Animate counters when they come into view
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector(".stat-number");
          const targetValue = parseInt(statNumber.textContent);
          animateCounter(statNumber, targetValue);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-item").forEach((el) => {
    statsObserver.observe(el);
  });
}

/* ===================
   INTERACTIVE EFFECTS
   =================== */

function initInteractiveEffects() {
  // Add hover effects to cards
  const cards = document.querySelectorAll(
    ".feature-card, .program-card, .testimonial-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add click ripple effect to buttons
  const buttons = document.querySelectorAll(
    ".cta-button, .btn-primary, .btn-secondary"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.height, rect.width);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add loading states to buttons
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      if (
        this.getAttribute("href") === "#contact" ||
        this.getAttribute("href") === "#programs"
      ) {
        // Don't add loading state for anchor links
        return;
      }

      const originalText = this.textContent;
      this.textContent = "Loading...";
      this.style.pointerEvents = "none";

      setTimeout(() => {
        this.textContent = originalText;
        this.style.pointerEvents = "auto";
      }, 2000);
    });
  });
}

/* ===================
   PARALLAX EFFECTS
   =================== */

function initParallaxEffects() {
  // Parallax effect for hero section
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    const floatingElements = document.querySelectorAll(".floating-element");

    // Parallax hero background
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Animate floating elements
    floatingElements.forEach((element, index) => {
      const speed = 0.2 + index * 0.1;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Add more floating elements dynamically
  createFloatingElements();
}

function createFloatingElements() {
  const hero = document.querySelector(".hero");
  const floatingContainer = document.querySelector(".floating-elements");

  if (!floatingContainer) return;

  // Create additional floating elements
  for (let i = 0; i < 5; i++) {
    const element = document.createElement("div");
    element.className = "floating-element";
    element.style.left = Math.random() * 100 + "%";
    element.style.top = Math.random() * 100 + "%";
    element.style.animationDelay = Math.random() * 6 + "s";
    element.style.width = Math.random() * 60 + 40 + "px";
    element.style.height = element.style.width;
    floatingContainer.appendChild(element);
  }
}

/* ===================
   TYPING EFFECT
   =================== */

function initTypingEffect() {
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // Initialize typing effect after a delay
  setTimeout(() => {
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
      const originalText = heroTitle.textContent;
      typeWriter(heroTitle, originalText, 100);
    }
  }, 500);
}

/* ===================
   FORM HANDLING
   =================== */

function initFormHandling() {
  // Form validation function
  window.validateForm = function (formData) {
    const email = formData.get("email");
    const name = formData.get("name");
    const phone = formData.get("phone");

    if (!name || name.length < 2) {
      return { valid: false, message: "Nama harus diisi minimal 2 karakter" };
    }

    if (!email || !email.includes("@")) {
      return { valid: false, message: "Email tidak valid" };
    }

    if (!phone || phone.length < 10) {
      return { valid: false, message: "Nomor telepon tidak valid" };
    }

    return { valid: true };
  };

  // Handle contact form submissions (if forms are added later)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const validation = validateForm(formData);

      if (!validation.valid) {
        alert(validation.message);
        return;
      }

      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.textContent = "Mengirim...";
      submitButton.disabled = true;

      setTimeout(() => {
        alert("Pesan berhasil dikirim! Kami akan menghubungi Anda segera.");
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2000);
    });
  });
}

/* ===================
   UTILITY FUNCTIONS
   =================== */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Get element position relative to viewport
function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    right: rect.right + window.pageXOffset,
    bottom: rect.bottom + window.pageYOffset,
    width: rect.width,
    height: rect.height,
  };
}

// Check if element is in viewport
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <=
      (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
  const elementPosition = getElementPosition(element);
  const offsetPosition = elementPosition.top - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

/* ===================
   PERFORMANCE OPTIMIZATIONS
   =================== */

// Optimize scroll events with throttling
const optimizedScrollHandler = throttle(function () {
  // Handle navbar scroll effect
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Handle parallax effects
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const floatingElements = document.querySelectorAll(".floating-element");

  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }

  floatingElements.forEach((element, index) => {
    const speed = 0.2 + index * 0.1;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
}, 16); // ~60fps

// Apply optimized scroll handler
window.addEventListener("scroll", optimizedScrollHandler);

/* ===================
   ERROR HANDLING
   =================== */

// Global error handler
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  // You could send error reports to your analytics service here
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled Promise Rejection:", e.reason);
  e.preventDefault();
});

/* ===================
   ACCESSIBILITY FEATURES
   =================== */

// Add keyboard navigation support
document.addEventListener("keydown", function (e) {
  // Skip to main content with Alt+M
  if (e.altKey && e.key === "m") {
    e.preventDefault();
    const mainContent =
      document.querySelector("main") || document.querySelector(".hero");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Close mobile menu with Escape key
  if (e.key === "Escape") {
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.querySelector(".nav-menu");

    if (navMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});

// Add focus indicators for keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

document.addEventListener("mousedown", function () {
  document.body.classList.remove("keyboard-navigation");
});

/* ===================
   BROWSER COMPATIBILITY
   =================== */

// Polyfill for IntersectionObserver (for older browsers)
if (!window.IntersectionObserver) {
  // Fallback: show all elements immediately
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    el.classList.add("animated");
  });
}

// Polyfill for smooth scrolling
if (!CSS.supports("scroll-behavior", "smooth")) {
  // Fallback smooth scroll implementation
  window.scrollTo = function (options) {
    if (typeof options === "object") {
      const start = window.pageYOffset;
      const target = options.top;
      const distance = target - start;
      const duration = 500;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, start + distance * easeInOutQuad(progress));

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  };

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}

/* ===================
   DEVELOPMENT HELPERS
   =================== */

// Development mode detection
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "";

if (isDevelopment) {
  console.log("🚀 EnglishMaster Landing Page - Development Mode");
  console.log("📱 Viewport:", window.innerWidth + "x" + window.innerHeight);
  console.log("🌐 User Agent:", navigator.userAgent);

  // Add development helpers
  window.debugAnimations = function () {
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      el.style.border = "2px solid red";
      setTimeout(() => (el.style.border = ""), 2000);
    });
  };

  window.showStats = function () {
    const stats = {
      "Animated Elements": document.querySelectorAll(".animated").length,
      "Total Cards": document.querySelectorAll(
        ".feature-card, .program-card, .testimonial-card"
      ).length,
      "Floating Elements":
        document.querySelectorAll(".floating-element").length,
      "Navigation Links": document.querySelectorAll(".nav-menu a").length,
    };
    console.table(stats);
  };
}

/* ===================
   EXPORT FOR MODULES
   =================== */

// If using modules, export useful functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    getElementPosition,
    isInViewport,
    scrollToElement,
    validateForm: window.validateForm,
  };
}
