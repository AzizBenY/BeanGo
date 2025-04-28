let list = document.querySelectorAll('.carousel .list .item');
let carousel = document.querySelector('.carousel');
let next = document.getElementById('next');
let prev = document.getElementById('prev');

let mockup = document.querySelector('.mockup');

let count = list.length;
let active = 0;
let leftMockup = 0;
let left_each_item = 100 / (list.length - 1);


next.onclick = () => {
    active = active >= count - 1 ? 0 : active + 1;
    leftMockup = leftMockup + left_each_item;
    carousel.classList.remove('right');
    changeCarousel();
}
prev.onclick = () => {
    active = active <= 0 ? count - 1 : active - 1;
    leftMockup = leftMockup - left_each_item;
    carousel.classList.add('right');
    changeCarousel();
}
function changeCarousel() {
    // find item has class hidden to remove it
    let hidden_old = document.querySelector('.item.hidden');
    if(hidden_old) hidden_old.classList.remove('hidden');

    // find item old active to remove it and add class hidden
    let active_old = document.querySelector('.item.active');
    active_old.classList.remove('active');
    active_old.classList.add('hidden');
    // add class active in position active new
    list[active].classList.add('active');
    // change mockup background
    mockup.style.setProperty('--left', leftMockup + '%');

    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=> {next.click()}, 3000);
}


// auto run 3s
//let refreshInterval = setInterval(()=> {next.click()}, 5000);

document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelectorAll('.carousel .list .item');
    const carousel = document.querySelector('.carousel');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const categoryItems = document.querySelectorAll('.category-item');

    let activeIndex = 0;
    const colors = ['#EB5282', '#C5764C', '#5A1428', '#78A3C0'];

    function changeSlide(index) {
        // Remove active class from current slide
        list[activeIndex].classList.remove('active');
        if (list[activeIndex].classList.contains('hidden')) {
            list[activeIndex].classList.remove('hidden');
        }

        // Update active index
        activeIndex = index;
        if (activeIndex >= list.length) activeIndex = 0;
        if (activeIndex < 0) activeIndex = list.length - 1;

        // Add active class to new slide
        list[activeIndex].classList.add('active');

        // Update category menu
        categoryItems.forEach((item, i) => {
            if (i === activeIndex) {
                item.classList.add('active');
                item.style.background = colors[activeIndex];
                item.querySelector('span').style.color = 'white';
            } else {
                item.classList.remove('active');
                item.style.background = 'white';
                item.querySelector('span').style.color = colors[i];
            }
        });
    }

    // Next button click
    nextBtn.addEventListener('click', () => {
        changeSlide(activeIndex + 1);
    });

    // Previous button click
    prevBtn.addEventListener('click', () => {
        changeSlide(activeIndex - 1);
    });

    // Category menu click
    categoryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (activeIndex !== index) {
                changeSlide(index);
            }
        });

        // Set initial colors
        if (index === activeIndex) {
            item.style.background = colors[activeIndex];
            item.querySelector('span').style.color = 'white';
        } else {
            item.querySelector('span').style.color = colors[index];
        }

        // Hover effect
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.background = `${colors[index]}22`;
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.background = 'white';
            }
        });
    });
});
