const carouselItems = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');
const totalItems = carouselItems.length;
const accordions = document.querySelectorAll('.accordion');
let images = document.querySelectorAll('.image-thumb');
let currentIndex = 0;
let lightboxIndex = 0;
let isImageLoaded = false;
let imagesIndex = []; 
let isImageChanging = false;

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxDescription = document.getElementById('lightbox-description');
const closeBtn = document.getElementById('close-btn');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

//carousel pics
function updateCarousel() {
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

setInterval(() => {
    nextSlide();
}, 5000); 

//accordion logic
accordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
        const panel = accordion.nextElementSibling;

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            document.querySelectorAll('.panel').forEach((p) => {
                p.style.maxHeight = null;
            });
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
    });
});


images.forEach(image => {
    image.addEventListener('click', function() {
        const description = this.getAttribute('data-description');
        lightbox.style.display = 'flex'; 
        lightboxImage.src = this.src; 
        lightboxDescription.textContent = this.alt ? `Description: ${this.alt}` : '';

        if (description) {
            lightboxDescription.textContent = description; 
            lightboxDescription.style.display = 'block'; 
            lightbox.style.flexDirection = 'row'; 
        } else {
            lightboxDescription.style.display = 'none'; 
            lightbox.style.flexDirection = 'column';
        }
    });
});




// lightbox
function showLightbox(selectedImageIndex) {
    const selectedImage = imagesIndex[selectedImageIndex];
    
    if (!selectedImage) {
        console.error("selectedImage is undefined. index:", selectedImageIndex);
        return;
    }

    lightbox.style.display = 'flex'; 
    lightboxImage.src = selectedImage.src;
    lightboxIndex = selectedImageIndex; 

    const description = selectedImage.getAttribute('data-description');
    if (description) {
        lightboxDescription.textContent = description; 
        lightboxDescription.style.display = 'block'; 
        lightbox.style.flexDirection = 'row'; 
    } else {
        lightboxDescription.style.display = 'none'; 
        lightbox.style.flexDirection = 'column'; 
    }
}

function closeLightbox() {
    lightbox.style.display = 'none'; 
}

function changeImage(direction) {
    lightboxIndex += direction;

    if (lightboxIndex < 0) {
        lightboxIndex = imagesIndex.length - 1;
    } else if (lightboxIndex >= imagesIndex.length) {
        lightboxIndex = 0;
    }

    showLightbox(lightboxIndex);
}

document.querySelectorAll('.panel').forEach((container) => {
    const imagesInSection = Array.from(container.querySelectorAll('.image-thumb'));

    imagesInSection.forEach((image, selectedImageIndex) => {
        image.addEventListener('click', () => {
            imagesIndex = imagesInSection;  
            lightboxIndex = selectedImageIndex;  
            showLightbox(lightboxIndex); 
        });
    });
});

closeBtn.addEventListener('click', closeLightbox); 
leftArrow.addEventListener('click', () => changeImage(-1)); 
rightArrow.addEventListener('click', () => changeImage(1)); 

lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});


//Audio
document.addEventListener('DOMContentLoaded', () => {
    const playButtons = document.querySelectorAll('.play-btn');
    let currentAudio = null;
    let currentButton = null;

    playButtons.forEach((button) => {
        const audioSrc = button.getAttribute('data-audio');
        const audio = new Audio(audioSrc);
        const progressBar = button.nextElementSibling;
        const icon = button.querySelector('i');
        const timeDisplay = button.nextElementSibling.nextElementSibling; 

        audio.addEventListener('loadedmetadata', () => {
            const duration = formatTime(audio.duration);
            timeDisplay.textContent = `00:00 / ${duration}`; 
        });

        button.addEventListener('click', () => {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentButton.querySelector('i').className = 'fas fa-play';
            }

            if (audio.paused) {
                audio.play();
                icon.className = 'fas fa-pause';
                currentAudio = audio;
                currentButton = button;
            } else {
                audio.pause();
                icon.className = 'fas fa-play';
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                progressBar.value = (audio.currentTime / audio.duration) * 100;
                
                // update time
                const currentTime = formatTime(audio.currentTime);
                const duration = formatTime(audio.duration);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        });

        progressBar.addEventListener('input', () => {
            if (audio.duration) {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
            }
        });

        audio.addEventListener('ended', () => {
            icon.className = 'fas fa-play';
            progressBar.value = 0;
            timeDisplay.textContent = '00:00 / 00:00'; 
            currentAudio = null;
            currentButton = null;
        });
    });

    // clean time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
});
