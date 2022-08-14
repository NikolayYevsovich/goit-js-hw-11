import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29202682-7a05fadb20439a7af92786b6c';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImages() {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo$orientation=horizontal$safesearch=true&per_page=40&page=${this.page}`
    );
    // console.log(response.data);
    return response.data;
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
