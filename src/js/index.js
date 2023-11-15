const previewImage = document.querySelector('.preview-image img'),
filterOptions = document.querySelectorAll('.filter button'),
filterName = document.querySelector('.filter-info .name'),
filterValue = document.querySelector('.filter-info .value'),
filterSlider = document.querySelector('.slider input'),
rotateOptions = document.querySelectorAll('.rotate button'),
fileInput = document.querySelector('.file-input'),
resetFilterButton = document.querySelector('.reset-filters'),
chooseImageButton = document.querySelector('.choose-image'),
saveImageButton = document.querySelector('.save-image');

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
  previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
  previewImage.style.transform = `rotate(${rotate}deg) scale(${flipVertical}, ${flipHorizontal})`
}

const loadImage = () => {
  let file = fileInput.files[0]; // Getting user selected file
  if(!file) return; // return if user hasn't selected file
  previewImage.src = URL.createObjectURL(file); // Passing file url as preview image src
  previewImage.addEventListener('load', () => {
    resetFilterButton.click(); // clicking reset filter button , so the filter value reset if the user select new img
    document.querySelector('.container').classList.remove('disable');
  });
}

filterOptions.forEach(option => {
  option.addEventListener('click', () => { // Adding click event listener to all filter buttons
    document.querySelector('.filter .active').classList.remove('active');
    option.classList.add('active');
    filterName.innerText = option.innerText;

    switch(option.id) {
      case 'Brightness' :
        filterSlider.max = '200';
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`;
        break;
      case 'Saturation' :
        filterSlider.max = '200';
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
        break;
      case 'Inversion' :
        filterSlider.max = '100';
        filterSlider.value = inversion;
        filterValue.innerText = `${inversion}%`;
        break;
      case 'Grayscale' :
        filterSlider.max = '100';
        filterSlider.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
        break;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector('.filter .active'); // getting selected filter button

  switch(selectedFilter.id) {
    case 'Brightness' :
      brightness = filterSlider.value;
      break;
    case 'Saturation' :
      saturation = filterSlider.value;
      break;
    case 'Inversion' :
      inversion = filterSlider.value;
      break;
    case 'Grayscale' :
      grayscale = filterSlider.value;
      break;
  }

  applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener('click', () => { // Adding click event listener to all rotate buttons
    
    switch(option.id) {
      case 'left' :
        rotate -= 90; // if clicked button is left rotate, decrement value byt -90
        break;
      case 'right' :
        rotate += 90; // if clicked button is left rotate, decrement value byt +90
        break;
      case 'vertical' :
        // if flipVertical value is 1, set this value to -1 else set 1 
        flipVertical = flipVertical === 1 ? -1 : 1;
        break;
      case 'horizontal' :
        // if flipHorizontal value is 1, set this value to -1 else set 1 
        flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        break;
    }

    applyFilters();
  })
});

const resetFilter = () => {
  brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
  rotate = 0, flipHorizontal = 1, flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') // canvas.getContext return a drawing context on the canvas
  canvas.width = previewImage.naturalWidth; // setting canvas width to actual image width
  canvas.height = previewImage.naturalHeight; // setting canvas height to actual image height


  // applying user selected filter to canvas filter
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); // translating canvas from center
  if(rotate !== 0) {
    ctx.rotate(rotate * Math.PI / 180);
  }
  ctx.scale(flipHorizontal, flipVertical); // flip canvas, horizontally / vertically
  ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

  const link = document.createElement('a'); // create an element
  link.download = 'image/jpg'; // passing <a> tag download value to image.jpg
  link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url
  link.click(); // clicking <a> tag so the image download
}

fileInput.addEventListener('change', loadImage);
filterSlider.addEventListener('input', updateFilter);
resetFilterButton.addEventListener('click', resetFilter);
saveImageButton.addEventListener('click', saveImage);
chooseImageButton.addEventListener('click', () => fileInput.click());