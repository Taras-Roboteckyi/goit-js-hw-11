import axios from "axios"

export default class NewsApiService {
     constructor() {
          this.searchName = '';
          this.perPage = 40;
          this.page = 1;
     };

     async fetchImages() {
       //console.log(this)  
     const fetchImages = await axios.get(`https://pixabay.com/api/?key=24371516-b10d2b2a42c8e4a8969a3fdf2&q=${this.searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`)
            
     //console.log(fetchImages.data)
               
      this.incrementPage();
                 
      return fetchImages.data;
        
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