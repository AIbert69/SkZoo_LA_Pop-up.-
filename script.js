const images = window.SKZOO_GALLERY;
let currentIndex = 0;

function cardTemplate(item, size = 'small') {
  return `
    <button class="card ${size} image-button" data-open-id="${item.id}" aria-label="Open ${item.title}">
      <img src="${item.thumb}" alt="${item.title}" loading="lazy" />
      <span class="card-caption">
        <span class="badge">${item.category} · ${item.ratio}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </span>
    </button>
  `;
}

function renderSection(category, selector) {
  const target = document.querySelector(selector);
  const list = images.filter(item => item.category === category);
  target.innerHTML = list.map((item, index) => {
    const size = category === 'Wide Renders' ? (index % 5 === 0 ? 'large' : index % 5 === 1 ? 'medium' : 'small') : 'small';
    return cardTemplate(item, size);
  }).join('');
}

function renderContact(filter = 'All') {
  const target = document.getElementById('contactGrid');
  const list = filter === 'All' ? images : images.filter(item => item.category === filter);
  target.innerHTML = list.map(item => `
    <button class="contact-card image-button" data-open-id="${item.id}" aria-label="Open ${item.title}">
      <img src="${item.thumb}" alt="${item.title}" loading="lazy" />
      <div>
        <h3>${item.title}</h3>
        <p>${item.category} · ${item.ratio}</p>
      </div>
    </button>
  `).join('');
}

function openLightbox(id) {
  const item = images.find(image => image.id === Number(id));
  if (!item) return;
  currentIndex = images.indexOf(item);
  document.getElementById('lightboxImage').src = item.src;
  document.getElementById('lightboxImage').alt = item.title;
  document.getElementById('lightboxCategory').textContent = `${item.category} · ${item.ratio} · ${item.width} × ${item.height}`;
  document.getElementById('lightboxTitle').textContent = item.title;
  document.getElementById('lightboxDesc').textContent = item.description;
  document.getElementById('downloadImage').href = item.src;
  document.getElementById('downloadImage').download = item.src.split('/').pop();
  document.getElementById('lightbox').classList.add('open');
  document.getElementById('lightbox').setAttribute('aria-hidden','false');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.getElementById('lightbox').setAttribute('aria-hidden','true');
  const lightboxImage = document.getElementById('lightboxImage');
  lightboxImage.removeAttribute('src');
  lightboxImage.alt = '';
}

function moveLightbox(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  openLightbox(images[currentIndex].id);
}

renderSection('Wide Renders', '[data-category="Wide Renders"]');
renderSection('Detail Shots', '[data-category="Detail Shots"]');
renderContact();

document.addEventListener('click', event => {
  const imageButton = event.target.closest('[data-open-id]');
  if (imageButton) openLightbox(imageButton.dataset.openId);
  if (event.target.id === 'closeLightbox' || event.target.id === 'lightbox') closeLightbox();
  if (event.target.id === 'prevImage') moveLightbox(-1);
  if (event.target.id === 'nextImage') moveLightbox(1);
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    document.querySelectorAll('.filter').forEach(button => button.classList.remove('active'));
    filter.classList.add('active');
    renderContact(filter.dataset.filter);
  }
});

document.addEventListener('keydown', event => {
  const lightboxOpen = document.getElementById('lightbox').classList.contains('open');
  if (!lightboxOpen) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});
