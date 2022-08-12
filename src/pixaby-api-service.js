export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '29202682-7a05fadb20439a7af92786b6c';
    console.log(this);
    return fetch(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo$orientation=horizontal$safesearch=true&per_page=40&page=${this.page}`
    )
      .then(response => response.json())
      .then(response => {
        this.incrementPege();
        return response.hits;
      });
  }
  incrementPege() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
// https://pixabay.com/api/?key=29202682-7a05fadb20439a7af92786b6c&q=cat&image_type=photo$orientation=horizontal$safesearch=true&per_page=40&page=1
