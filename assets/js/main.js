/* ===================
   MAIN JAVASCRIPT FILE - FIXED VERSION
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
   NAVBAR FUNCTIONALITY - FIXED
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

  // Active nav link highlighting - IMPROVED
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", function () {
    let current = "";
    const scrollPosition = window.scrollY + 100; // Add offset for navbar

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
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
   SMOOTH SCROLLING - IMPROVED
   =================== */

function initSmoothScrolling() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        // Get current navbar height dynamically
        const navbar = document.querySelector(".navbar");
        const navbarHeight = navbar.classList.contains("scrolled") ? 70 : 80;

        // Calculate target position with proper offset
        const targetPosition = target.offsetTop - navbarHeight - 10; // Extra 10px padding

        window.scrollTo({
          top: Math.max(0, targetPosition), // Ensure we don't scroll to negative position
          behavior: "smooth",
        });
      }
    });
  });
}

/* ===================
   SCROLL ANIMATIONS - IMPROVED
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

        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
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
        this.getAttribute("href") === "#programs" ||
        this.getAttribute("href") === "#about"
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
   PARALLAX EFFECTS - OPTIMIZED
   =================== */

function initParallaxEffects() {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    const floatingElements = document.querySelectorAll(".floating-element");

    // Only apply parallax on larger screens for performance
    if (window.innerWidth > 768) {
      // Parallax hero background (subtle effect)
      if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      // Animate floating elements
      floatingElements.forEach((element, index) => {
        if (scrolled < hero.offsetHeight) {
          const speed = 0.1 + index * 0.05;
          element.style.transform = `translateY(${scrolled * speed}px)`;
        }
      });
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Throttled scroll event for better performance
  window.addEventListener("scroll", requestTick);

  // Add more floating elements dynamically
  createFloatingElements();
}

function createFloatingElements() {
  const hero = document.querySelector(".hero");
  const floatingContainer = document.querySelector(".floating-elements");

  if (!floatingContainer || window.innerWidth <= 768) return;

  // Create additional floating elements
  for (let i = 0; i < 3; i++) {
    const element = document.createElement("div");
    element.className = "floating-element";
    element.style.left = Math.random() * 100 + "%";
    element.style.top = Math.random() * 100 + "%";
    element.style.animationDelay = Math.random() * 6 + "s";
    element.style.width = Math.random() * 40 + 30 + "px";
    element.style.height = element.style.width;
    element.style.opacity = "0.5";
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
      typeWriter(heroTitle, originalText, 80);
    }
  }, 800);
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
   SECTION VISIBILITY TRACKING - NEW
   =================== */

function initSectionTracking() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentSection = entry.target.getAttribute("id");

          // Update active nav link
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentSection) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-80px 0px -80px 0px", // Account for navbar
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
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

// Smooth scroll to element - IMPROVED
function scrollToElement(element, offset = 0) {
  const navbar = document.querySelector(".navbar");
  const navbarHeight = navbar.classList.contains("scrolled") ? 70 : 80;
  const elementPosition = getElementPosition(element);
  const offsetPosition = elementPosition.top - navbarHeight - offset;

  window.scrollTo({
    top: Math.max(0, offsetPosition),
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
      scrollToElement(mainContent);
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

// Enhanced smooth scroll polyfill
if (!CSS.supports("scroll-behavior", "smooth")) {
  // Override the initSmoothScrolling function
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
          const navbar = document.querySelector(".navbar");
          const navbarHeight = navbar.classList.contains("scrolled") ? 70 : 80;
          const targetPosition = target.offsetTop - navbarHeight - 10;

          smoothScrollTo(Math.max(0, targetPosition));
        }
      });
    });
  }

  function smoothScrollTo(targetY) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = 800;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startY + distance * easeInOutQuad(progress));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

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

  window.debugScrollPosition = function () {
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      console.log(`${section.id}:`, {
        top: rect.top,
        bottom: rect.bottom,
        offsetTop: section.offsetTop,
        scrollY: window.scrollY,
      });
    });
  };
}

/* ===================
   INITIALIZATION - UPDATED
   =================== */

// Initialize section tracking after DOM load
document.addEventListener("DOMContentLoaded", function () {
  // Add the new section tracking
  initSectionTracking();
});

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
