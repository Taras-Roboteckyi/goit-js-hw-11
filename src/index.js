import API from './pixabayservices';
import LoadMoreBtn from './load-more-btn';

//Підключення бібліотек
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

// Додатковий імпорт стилів

import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    formRefs: document.querySelector('#search-form'),
    galleryRefs: document.querySelector('.gallery'),
    };
    


const loadMoreButton = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
})
const newsApi = new API();



refs.formRefs.addEventListener('submit', handleSubmit);
loadMoreButton.refs.button.addEventListener('click', fetchImagesOnScreen);


//Обробка запиту на кнопку Search

async function handleSubmit(event) {
    event.preventDefault();
      clearMarkup();
    if (event.currentTarget.searchQuery.value.trim() === '') {
        return 
  };
  loadMoreButton.show();
  loadMoreButton.disable();
  newsApi.query = event.currentTarget.searchQuery.value.trim();
  
  newsApi.resetPage();
   
   const images = await fetch();

       //console.log(images)
       if (images.hits.length !== 0) {
          Notify.success(`Hooray! We found ${images.totalHits} images.`, {timeout: 3000})//зелена кнопка
    
       } else {
         loadMoreButton.hide();
         Notify.failure("Sorry, there are no images matching your search query. Please try again.")//червона кнопка
    };
        
       if (images.totalHits <= newsApi.perPage && images.hits.length !== 0) {
         loadMoreButton.hide();
         Notify.info("We're sorry, but you've reached the end of search results.", {timeout: 6000});//синя кнопка
  };
 
 }


 //Обробка запиту на кнопку Load more

async function fetchImagesOnScreen() {
  loadMoreButton.disable();
  
  const imagesOnClickButton = await fetch();
      
    if (imagesOnClickButton.hits.length < newsApi.perPage) {
         loadMoreButton.hide();
         Notify.info("We're sorry, but you've reached the end of search results.", {timeout: 3000});//синя кнопка
  };

       //Прокрутка сторінки
  
       const { height: cardHeight } = document.querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
});

}

//Обробка запиту і додавання зображень

async function fetch() {
  try {
  const images = await newsApi.fetchImages();
     renderImagesList(images.hits)
     loadMoreButton.enable();
  return images
  } catch (error) {
    console.log(error.name);
  }
  
}

//Рендер розмітки однієї карточки

function renderImagesList(images) {
        //console.log(images)
    const markup = images.map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
          
            `<div class="photo-card">
            <a class="gallery-item" href="${largeImageURL}">
              <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" width="200" height="200"/>
               <div class="info">
                  <p class="info-item">
                    <b class="info-text">Likes</b>${likes}
                  </p>
                  <p class="info-item">
                    <b class="info-text">Views</b>${views}
                  </p>
                  <p class="info-item">
                    <b class="info-text">Comments</b>${comments}
                  </p>
                  <p class="info-item">
                    <b class="info-text">Downloads</b>${downloads}
                  </p>
              </div>
              </a>
             </div>`
                      
        ).join('');
        
  refs.galleryRefs.insertAdjacentHTML('beforeend', markup);
          
     // Застосування бібліотеки SimpleLightbox
  
      let gallery = new SimpleLightbox('.gallery a', { captionsData:'alt', captionDelay:250});
      gallery.refresh()
}




//Очистка розмітки 

function clearMarkup() {
    refs.galleryRefs.innerHTML = '';
}



