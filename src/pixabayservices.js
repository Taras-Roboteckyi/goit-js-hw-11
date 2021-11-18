import axios from "axios"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import LoadMoreBtn from './load-more-btn';

const loadMoreButton = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
})

export default class NewsApiService {
     constructor() {
          this.searchName = '';
          this.perPage = 40;
          this.page = 1;
     };

     fetchImages() {
       //console.log(this)  
     return axios.get(`https://pixabay.com/api/?key=24371516-b10d2b2a42c8e4a8969a3fdf2&q=${this.searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`)
            .then((response) => {
                 console.log(response)
               
                 if (response.data.hits.length === 0) {
                   Notify.failure("Sorry, there are no images matching your search query. Please try again.")
                     
                 };

                 if (response.data.totalHits <= this.perPage) {
                       loadMoreButton.hide();
                  Notify.info("We're sorry, but you've reached the end of search results.");
                 };

                 this.incrementPage();
                 
                 return response.data;
        })
     };

     incrementPage() {
           this.page += 1;
     };

     resetPage() {
          this.page = 1;
     };

     get query() {
          return this.searchName;
     };

      set query(newQuery) {
          this.searchName = newQuery;
     }

}