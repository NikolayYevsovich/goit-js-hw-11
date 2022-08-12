import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiService from './pixaby-api-service';

const refs = {
  formEl: document.querySelector('.search-form'),
  searchButtonEl: document.querySelector('.search-button'),
  loadMoreButtonEl: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

const pixabayApiService = new PixabayApiService();

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreButtonEl.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  pixabayApiService.query = event.currentTarget.elements.searchQuery.value;
  pixabayApiService.resetPage();
  pixabayApiService.fetchImages().then(hits => renderImages(hits));
}

function onLoadMore() {
  pixabayApiService.fetchImages().then(hits => renderImages(hits));
}

function createImageCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}"><img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes<br><span class="stats">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views<br><span class="stats">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments<br><span class="stats">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads<br><span class="stats">${downloads}</span></b>
    </p>
  </div>
</div>
`;
}

function generateImagesMarkup(imagesArray) {
  return imagesArray.reduce((acc, image) => acc + createImageCard(image), '');
}

function renderImages(imagesArray) {
  const searchResult = generateImagesMarkup(imagesArray);
  refs.galleryEl.insertAdjacentHTML('beforeend', searchResult);
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
