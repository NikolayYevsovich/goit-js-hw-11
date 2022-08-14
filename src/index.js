import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import PixabayApiService from './pixaby-api-service';

const refs = {
  formEl: document.querySelector('.search-form'),
  searchButtonEl: document.querySelector('.search-button'),
  loadMoreButtonEl: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};
refs.loadMoreButtonEl.disabled = true;
let lightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const pixabayApiService = new PixabayApiService();

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreButtonEl.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  pixabayApiService.query = event.currentTarget.elements.searchQuery.value;
  if (pixabayApiService.query === '') {
    Notiflix.Notify.info('Please fill in the search field');
    return;
  }
  pixabayApiService.resetPage();
  try {
    const imagesArr = await pixabayApiService.fetchImages();
    console.log(imagesArr);
    if (imagesArr.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (imagesArr.hits.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${imagesArr.length} images.`);
    }
    clearMarkup();
    renderImages(imagesArr.hits);
    lightbox.refresh();
    refs.loadMoreButtonEl.disabled = false;
    pixabayApiService.incrementPege();
  } catch (error) {
    Notiflix.Report.failure(`${error.message}`);
  }
}

async function onLoadMore() {
  try {
    const imagesArr = await pixabayApiService.fetchImages();
    renderImages(imagesArr.hits);
    lightbox.refresh();
    const nextPageImages = imagesArr.hits.length;
    if (nextPageImages < 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreButtonEl.classList.add('hide');
    }

    pixabayApiService.incrementPege();
  } catch (error) {
    Notiflix.Report.failure(`${error.message}`);
  }
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
  <a href="${largeImageURL}"><img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes<br /><span class="stats">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views<br /><span class="stats">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments<br /><span class="stats">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads<br /><span class="stats">${downloads}</span></b>
    </p>
  </div>
</div>`;
}

function generateImagesMarkup(imagesArray) {
  return imagesArray.reduce((acc, image) => acc + createImageCard(image), '');
}

function renderImages(imagesArray) {
  const searchResult = generateImagesMarkup(imagesArray);
  refs.galleryEl.insertAdjacentHTML('beforeend', searchResult);
}

function clearMarkup() {
  refs.galleryEl.innerHTML = '';
}
