const releaseDate = new Date('2024-12-01T10:00:00+02:00');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const yearEl = document.getElementById('year');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const body = document.body;
const pricingButtons = document.querySelectorAll('[data-plan]');
const planSelect = document.getElementById('plan');
const form = document.querySelector('.signup-form');
const toast = document.querySelector('.toast');

function updateCountdown() {
  const now = new Date();
  const diff = releaseDate - now;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

function toggleNav() {
  navLinks.classList.toggle('nav__links--active');
  body.classList.toggle('nav-open');
}

function closeNav() {
  navLinks.classList.remove('nav__links--active');
  body.classList.remove('nav-open');
}

function selectPlan(planName) {
  if (!planSelect) return;
  planSelect.value = planName;
  planSelect.dispatchEvent(new Event('change'));
  planSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showToast(message) {
  if (!toast) return;
  toast.querySelector('.toast__message').textContent = message;
  toast.classList.add('toast--visible');
  setTimeout(() => toast.classList.remove('toast--visible'), 4000);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries());

  const requiredFieldsFilled = entries.name && entries.email && entries.plan;
  if (!requiredFieldsFilled || !form.checkValidity()) {
    showToast('Lūdzu, aizpildi obligātos laukus.');
    return;
  }

  showToast('Paldies! Nosūtījām drošu maksājuma saiti uz tavu e-pastu.');
  form.reset();
}

function setupSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  const track = slider.querySelector('.slider__track');
  const slides = slider.querySelectorAll('.slider__item');
  const prevBtn = slider.querySelector('[data-direction="prev"]');
  const nextBtn = slider.querySelector('[data-direction="next"]');
  let index = 0;

  function goToSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn?.addEventListener('click', () => goToSlide(index - 1));
  nextBtn?.addEventListener('click', () => goToSlide(index + 1));

  let autoSlide = setInterval(() => goToSlide(index + 1), 6000);

  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => (autoSlide = setInterval(() => goToSlide(index + 1), 6000)));
}

function smoothScrollLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      const target = targetId && document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeNav();
    });
  });
}

function init() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  yearEl.textContent = new Date().getFullYear();

  navToggle?.addEventListener('click', toggleNav);
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

  pricingButtons.forEach(button => {
    button.addEventListener('click', () => selectPlan(button.dataset.plan));
  });

  form?.addEventListener('submit', handleFormSubmit);

  setupSlider();
  smoothScrollLinks();
}

document.addEventListener('DOMContentLoaded', init);
