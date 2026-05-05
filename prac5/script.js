const slides = [
  {
    image: 'img.jpg',
    title: 'Chocolate Delight',
    text: 'Soft, rich, and simple.'
  },
  {
    image: 'img1.jpg',
    title: 'Vanilla Dream',
    text: 'Light and sweet for any celebration.'
  },
  {
    image: 'img.jpg',
    title: 'Berry Celebration',
    text: 'Fresh, colorful, and homemade.'
  }
];

let currentSlide = 0;

const sliderImage = document.getElementById('sliderImage');
const slideTitle = document.getElementById('slideTitle');
const slideText = document.getElementById('slideText');
const prevButton = document.querySelector('.slider-btn.prev');
const nextButton = document.querySelector('.slider-btn.next');

function showSlide(index) {
  const slide = slides[index];
  sliderImage.src = slide.image;
  sliderImage.alt = slide.title;
  slideTitle.textContent = slide.title;
  slideText.textContent = slide.text;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

prevButton.addEventListener('click', previousSlide);
nextButton.addEventListener('click', nextSlide);

showSlide(currentSlide);
setInterval(nextSlide, 4000);