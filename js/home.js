console.log("Welcome to BeanGo!");

// Navigation links
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('header, section');

// Highlight active link on scroll
function setActiveLink(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const id = entry.target.getAttribute('id') || 'home';
      const activeLink = document.querySelector(`nav a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

const observer = new IntersectionObserver(setActiveLink, {
  root: null,
  threshold: 0.5
});

sections.forEach(section => observer.observe(section));

// Smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
