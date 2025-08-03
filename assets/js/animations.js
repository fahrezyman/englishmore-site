/* ===================
   ANIMATIONS LIBRARY
   =================== */

// Animation configuration
const ANIMATION_CONFIG = {
  duration: {
    fast: 300,
    normal: 500,
    slow: 800,
  },
  easing: {
    easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
};

/* ===================
   SCROLL REVEAL ANIMATIONS
   =================== */

class ScrollReveal {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
      animationDelay: 0.1,
      ...options,
    };

    this.observer = null;
    this.elements = [];
    this.init();
  }

  init() {
    // Create intersection observer
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin,
      }
    );

    // Find all elements to animate
    this.elements = document.querySelectorAll("[data-animate]");

    // Set initial states and observe elements
    this.elements.forEach((element, index) => {
      this.setInitialState(element, index);
      this.observer.observe(element);
    });
  }

  setInitialState(element, index) {
    const animationType = element.dataset.animate;
    const delay = element.dataset.delay || index * this.options.animationDelay;

    element.style.transitionDelay = `${delay}s`;
    element.style.transition = `all 0.6s ${ANIMATION_CONFIG.easing.easeOut}`;

    switch (animationType) {
      case "fadeIn":
        element.style.opacity = "0";
        break;
      case "fadeInUp":
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        break;
      case "fadeInDown":
        element.style.opacity = "0";
        element.style.transform = "translateY(-30px)";
        break;
      case "fadeInLeft":
        element.style.opacity = "0";
        element.style.transform = "translateX(-30px)";
        break;
      case "fadeInRight":
        element.style.opacity = "0";
        element.style.transform = "translateX(30px)";
        break;
      case "scaleIn":
        element.style.opacity = "0";
        element.style.transform = "scale(0.8)";
        break;
      case "slideInUp":
        element.style.transform = "translateY(100%)";
        break;
      case "rotateIn":
        element.style.opacity = "0";
        element.style.transform = "rotate(-180deg) scale(0.8)";
        break;
    }
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.animateElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  animateElement(element) {
    const animationType = element.dataset.animate;

    // Add animated class
    element.classList.add("animated");

    // Reset transform and opacity
    switch (animationType) {
      case "fadeIn":
      case "fadeInUp":
      case "fadeInDown":
      case "fadeInLeft":
      case "fadeInRight":
      case "scaleIn":
      case "rotateIn":
        element.style.opacity = "1";
        element.style.transform =
          "translateY(0) translateX(0) scale(1) rotate(0)";
        break;
      case "slideInUp":
        element.style.transform = "translateY(0)";
        break;
    }

    // Fire custom event
    element.dispatchEvent(
      new CustomEvent("animated", {
        detail: { animationType },
      })
    );
  }

  // Manual trigger method
  trigger(selector) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : [selector];

    elements.forEach((element) => {
      if (element && element.dataset.animate) {
        this.animateElement(element);
      }
    });
  }

  // Reset animation
  reset(selector) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : [selector];

    elements.forEach((element, index) => {
      if (element && element.dataset.animate) {
        element.classList.remove("animated");
        this.setInitialState(element, index);
        this.observer.observe(element);
      }
    });
  }
}

/* ===================
   PARTICLE SYSTEM
   =================== */

class ParticleSystem {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.options = {
      particleCount: 50,
      colors: ["#667eea", "#764ba2", "#ffffff"],
      minSize: 2,
      maxSize: 6,
      speed: 0.5,
      ...options,
    };

    this.particles = [];
    this.animationId = null;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);

    // Set canvas style
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "1";

    this.resize();
    this.createParticles();
    this.animate();

    // Handle resize
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  createParticles() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size:
          Math.random() * (this.options.maxSize - this.options.minSize) +
          this.options.minSize,
        color:
          this.options.colors[
            Math.floor(Math.random() * this.options.colors.length)
          ],
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

/* ===================
   TEXT ANIMATIONS
   =================== */

class TextAnimations {
  static typeWriter(element, text, speed = 100, callback = null) {
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }

    type();
  }

  static countUp(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function update() {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        return;
      }
      element.textContent = Math.floor(start);
      requestAnimationFrame(update);
    }

    update();
  }

  static splitText(element, animationType = "fadeInUp") {
    const text = element.textContent;
    const words = text.split(" ");

    element.innerHTML = "";

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(20px)";
      span.style.transition = `all 0.6s ${ANIMATION_CONFIG.easing.easeOut}`;
      span.style.transitionDelay = `${index * 0.1}s`;

      element.appendChild(span);

      // Trigger animation
      setTimeout(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      }, 100);
    });
  }
}

/* ===================
   MORPHING ANIMATIONS
   =================== */

class MorphingButton {
  constructor(button, options = {}) {
    this.button = button;
    this.options = {
      morphDuration: 300,
      resetDelay: 2000,
      ...options,
    };

    this.originalContent = button.innerHTML;
    this.originalWidth = button.offsetWidth;
    this.originalHeight = button.offsetHeight;

    this.init();
  }

  init() {
    this.button.style.transition = `all ${this.options.morphDuration}ms ${ANIMATION_CONFIG.easing.easeInOut}`;
    this.button.style.position = "relative";
    this.button.style.overflow = "hidden";
  }

  morph(newContent, newStyles = {}) {
    // Apply new styles
    Object.assign(this.button.style, newStyles);

    // Change content with fade effect
    this.button.style.opacity = "0.7";

    setTimeout(() => {
      this.button.innerHTML = newContent;
      this.button.style.opacity = "1";
    }, this.options.morphDuration / 2);

    // Auto reset if specified
    if (this.options.resetDelay > 0) {
      setTimeout(() => {
        this.reset();
      }, this.options.resetDelay);
    }
  }

  reset() {
    this.button.style.width = this.originalWidth + "px";
    this.button.style.height = this.originalHeight + "px";
    this.button.style.opacity = "0.7";

    setTimeout(() => {
      this.button.innerHTML = this.originalContent;
      this.button.style.opacity = "1";
    }, this.options.morphDuration / 2);
  }
}

/* ===================
   LOADING ANIMATIONS
   =================== */

class LoadingAnimations {
  static createSpinner(container, size = 40, color = "#667eea") {
    const spinner = document.createElement("div");
    spinner.className = "custom-spinner";
    spinner.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            border: 3px solid rgba(${this.hexToRgb(color)}, 0.3);
            border-top: 3px solid ${color};
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        `;

    container.appendChild(spinner);
    return spinner;
  }

  static createPulse(container, color = "#667eea") {
    const pulse = document.createElement("div");
    pulse.className = "custom-pulse";
    pulse.style.cssText = `
            width: 40px;
            height: 40px;
            background-color: ${color};
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
            margin: 0 auto;
        `;

    container.appendChild(pulse);
    return pulse;
  }

  static createDots(container, color = "#667eea") {
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "loading-dots";
    dotsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
        `;

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.style.cssText = `
                width: 8px;
                height: 8px;
                background-color: ${color};
                border-radius: 50%;
                animation: bounce 1.4s ease-in-out infinite both;
                animation-delay: ${i * 0.16}s;
            `;
      dotsContainer.appendChild(dot);
    }

    container.appendChild(dotsContainer);
    return dotsContainer;
  }

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : "0, 0, 0";
  }
}

/* ===================
   PAGE TRANSITION ANIMATIONS
   =================== */

class PageTransitions {
  static fadeOut(callback, duration = 500) {
    document.body.style.transition = `opacity ${duration}ms ease-out`;
    document.body.style.opacity = "0";

    setTimeout(callback, duration);
  }

  static fadeIn(duration = 500) {
    document.body.style.transition = `opacity ${duration}ms ease-in`;
    document.body.style.opacity = "1";
  }

  static slideOut(direction = "left", callback, duration = 500) {
    const transform =
      direction === "left" ? "translateX(-100%)" : "translateX(100%)";

    document.body.style.transition = `transform ${duration}ms ease-out`;
    document.body.style.transform = transform;

    setTimeout(callback, duration);
  }

  static slideIn(direction = "right", duration = 500) {
    const initialTransform =
      direction === "right" ? "translateX(100%)" : "translateX(-100%)";

    document.body.style.transform = initialTransform;
    document.body.style.transition = `transform ${duration}ms ease-out`;

    requestAnimationFrame(() => {
      document.body.style.transform = "translateX(0)";
    });
  }
}

/* ===================
   INITIALIZE ANIMATIONS
   =================== */

// Initialize scroll reveal when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize scroll reveal
  const scrollReveal = new ScrollReveal();

  // Add particle system to hero section (optional)
  const heroSection = document.querySelector(".hero");
  if (heroSection && window.innerWidth > 768) {
    const particles = new ParticleSystem(heroSection, {
      particleCount: 30,
      colors: ["rgba(255,255,255,0.3)", "rgba(102,126,234,0.2)"],
      speed: 0.3,
    });
  }

  // Initialize morphing buttons
  document.querySelectorAll(".morph-button").forEach((button) => {
    new MorphingButton(button);
  });

  // Add CSS animations if not already present
  if (!document.querySelector("#animation-styles")) {
    const styles = document.createElement("style");
    styles.id = "animation-styles";
    styles.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
            }
            
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
            
            .keyboard-navigation *:focus {
                outline: 2px solid #667eea !important;
                outline-offset: 2px !important;
            }
        `;
    document.head.appendChild(styles);
  }
});

/* ===================
   EXPORT FOR MODULES
   =================== */

// Export classes if using modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ScrollReveal,
    ParticleSystem,
    TextAnimations,
    MorphingButton,
    LoadingAnimations,
    PageTransitions,
    ANIMATION_CONFIG,
  };
}
