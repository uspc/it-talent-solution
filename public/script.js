// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.backdropFilter = 'blur(10px)';
  } else {
    navbar.style.background = '#fff';
    navbar.style.backdropFilter = 'none';
  }
});

// Job application functionality
document.querySelectorAll('.btn-apply').forEach(button => {
  button.addEventListener('click', function() {
    const jobTitle = this.closest('.job-card').querySelector('h4').textContent;
    alert(`Thank you for your interest in the ${jobTitle} position! We'll redirect you to our application portal.`);
  });
});

// Hero button functionality
document.querySelector('.btn-primary').addEventListener('click', function() {
  document.querySelector('#jobs').scrollIntoView({
    behavior: 'smooth'
  });
});

document.querySelector('.btn-secondary').addEventListener('click', function() {
  window.location.href = '/login.html';
});

console.log('IT Talent Solution website loaded successfully!');
