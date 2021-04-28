const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '17321528-d41904a4da995a6d119d99cf7';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  toggleSpinner();// spinner func call
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2 ';
    div.innerHTML = ` <img class="img-fluid img-thumbnail hover"  onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
                        <p class = "text-center"><span class = "text-capitalize"> ${image.tags}</span></P>
                        <a target="_blank" class='btn btn-success text-white ' href="${image.webformatURL}"  >View Full Screen</a>
                       
      `;
    gallery.appendChild(div);

  })

}

const getImages = (query) => {
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo`
  toggleSpinner()
  fetch(url)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(error => apiCatchError(error))

}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    selectedImgCounterFunc();
  } else {
    sliders.splice(item, 1);
    selectedImgCounterFunc();
  }
}

// Show Selected Images
const selectedImgCounter = document.getElementById('selected-imgCounter');
const selectedImgCounterFunc = () => {
  selectedImgCounter.innerText = sliders.length;
}


var timer
const createSlider = () => {

  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';

  // hide image area
  imagesArea.style.display = 'none';
  setTimeout(function () { sliderSpinner(); }, 100);
  const duration = document.getElementById('duration').value || 1000;
  if (duration > 0) {
    document.getElementById('duration').value = duration;
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })

    changeSlide(0)
    sliderSpinner()
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
  else {
    getImages(search.value)
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.toggle('d-none')

    changeSlide(0)
    sliderSpinner()
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, 1000);

  }

}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

//keyboard enter button feature search input er 
document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    document.getElementById('search-btn').click();
    selectedImgCounter.innerText = 0;
    document.getElementById('durationError').innerText = "";
  }
});
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  selectedImgCounter.innerText = 0;
  document.getElementById('durationError').innerText = "";
})


//slider btn addEventListener
sliderBtn.addEventListener('click', function () {
  const duration = document.getElementById('duration').value;
  if (duration > 0) {
    createSlider();

  } else {
    document.getElementById('duration').value = 1000;
    document.getElementById('durationError').innerText = `Negative Value Can'not Work! We Fixed Default Value Please Click Again `;

  };
});

//keyboard enter button feature  slider input er
document.getElementById('duration').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    document.getElementById('create-slider').click();
  }
});

const apiCatchError = () => {
  const displayFetchError = document.getElementById('errorMsgDiv');
  const h3 = document.createElement('h3')
  h3.innerHTML = `
   <h3> Something Went wrong, Please Try Again  </h3>
   `
  displayFetchError.appendChild(h3)
  document.getElementById('gallery-container').innerText = ''
  toggleSpinner()
};

// spinner main
const toggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  const galleryContainer = document.getElementById('gallery-container');
  spinner.classList.toggle('d-none')
  galleryContainer.classList.toggle('d-none')
}

// spinner for slider
const sliderSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none')
  const slideSpinner = document.getElementById('slide-loader');
  slideSpinner.classList.toggle('d-none')
}