/*1. TYPING ANIMATION — cycles through roles */
const roles = [
  "Front-end Developer",
  "UI Designer",
  "Creative Coder",
];

const roleEl = document.querySelector(".role");

if (roleEl) {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPING_SPEED = 80;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_WORD = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      roleEl.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;
    } else {
      roleEl.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = PAUSE_AFTER_WORD;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(type, delay);
  }

  // Add blinking cursor via CSS class
  roleEl.classList.add("typing-cursor");
  setTimeout(type, 600);
}


/*2. SMOOTH SCROLL — for same-page anchor links*/
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


/*
  3.SCROLL-TRIGGERED FADE-IN
   Used on about/skills/contact pages.
   Add class="fade-in" to any element you want
   to animate in on scroll. */
function initScrollReveal() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

initScrollReveal();


/* =============================================
   4. NAV LINK ACTIVE STATE
   Highlights the current page in nav
   ============================================= */
const navLinks = document.querySelectorAll(".nav-links a");
const currentPath = window.location.pathname;

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});


/*5. HERO ENTRANCE ANIMATION
   Staggers the left-panel content on load */
const heroItems = document.querySelectorAll(
  ".greeting, .left h1, .role, .social-links"
);

heroItems.forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;

  // Trigger after a tiny delay so transition fires
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  });
});