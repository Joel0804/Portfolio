/* main.js — shared across all pages */

/* 1. TYPING ANIMATION */
const roles = ["Front-end Developer", "UI Designer", "Creative Coder"];
const roleEl = document.querySelector(".role");

if (roleEl) {
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  const TYPING_SPEED = 80, DELETING_SPEED = 40, PAUSE = 1800;

  function type() {
    const current = roles[roleIndex];
    roleEl.textContent = isDeleting
      ? current.slice(0, charIndex - 1)
      : current.slice(0, charIndex + 1);
    isDeleting ? charIndex-- : charIndex++;

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    if (!isDeleting && charIndex === current.length) { delay = PAUSE; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }

    setTimeout(type, delay);
  }
  roleEl.classList.add("typing-cursor");
  setTimeout(type, 600);
}


/* 2. SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});


/* 3. SCROLL-TRIGGERED FADE-IN — exported so projects.js can re-call it */
function initScrollReveal() {
  const elements = document.querySelectorAll(".fade-in:not(.observed)");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => { el.classList.add("observed"); observer.observe(el); });
}

initScrollReveal();


/* 4. NAV LINK ACTIVE STATE */
const navLinks = document.querySelectorAll(".nav-links a, .sidebar-nav a");
const currentPath = window.location.pathname;

navLinks.forEach(link => {
  const href = link.getAttribute("href");
  if (href === currentPath || (href !== "/" && currentPath.startsWith(href))) {
    link.classList.add("active");
  }
});


/* 5. HERO ENTRANCE ANIMATION */
const heroItems = document.querySelectorAll(".greeting, .left h1, .role, .social-links");
heroItems.forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }));
});