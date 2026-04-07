// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.hash) {
      e.preventDefault();
      document.querySelector(link.hash).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Mobile menu toggle (optional if needed later)
const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}


