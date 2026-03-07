document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('main-wrapper');
    const filteredWorks = works.filter(work => work.showOnMain);
    filteredWorks.sort((a, b) => a.orderOnMain - b.orderOnMain);

    // build slider structure
    wrapper.innerHTML = '';
    const slider = document.createElement('div');
    slider.className = 'project-slider';

    filteredWorks.forEach(work => {
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        slide.innerHTML = `
            
            <div class="thumbnail">
                <img src="/assets/images/${work.mainThumbnail}" alt="${work.title}">
                <div class="overlay">${work.title}
                    <br>
                    <br>
                    <a href="/views/works/${work.link}" style="font-size:14px; font-weight:500;">
                    ➜ VIEW WORK
                    </a>
                </div>
                
            </div>
            
        `;
        slider.appendChild(slide);
    });

    wrapper.appendChild(slider);

    // 네비게이션 레이어
    const navLayer = document.createElement('div');
    navLayer.className = 'slide-nav-layer';

    navLayer.innerHTML = `
        <div class="slide-prev"></div>
        <div class="slide-next"></div>
    `;

    wrapper.appendChild(navLayer);

    // click events
    navLayer.querySelector('.slide-prev').addEventListener('click', goToPrev);
    navLayer.querySelector('.slide-next').addEventListener('click', goToNext);


    // progress navigation
    const progressNav = document.createElement('div');
    progressNav.className = 'progress-nav';
    const fills = [];
    const slideCount = slider.children.length;
    for (let i = 0; i < slideCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'progress-bar';

        const fill = document.createElement('div');
        fill.className = 'progress-fill';

        bar.appendChild(fill);
        progressNav.appendChild(bar);
        fills.push(fill);

        // click navigation
        bar.addEventListener('click', () => {
            currentIndex = i;
            startTimer();
        });
    }
    wrapper.appendChild(progressNav);

    initScrollFade();

    // slide control
    let currentIndex = 0;
    function updateSlides() {
        Array.from(slider.children).forEach((s, idx) => {
            s.classList.toggle('active', idx === currentIndex);
        });

        // progress reset instantly
        fills.forEach(f => {
            f.style.transition = 'none';
            f.style.width = '0';
        });

        // force reflow so browser applies reset immediately
        void wrapper.offsetWidth;

        // start current progress animation
        const currentFill = fills[currentIndex];
        currentFill.style.transition = `width ${intervalDelay}ms linear`;
        currentFill.style.width = '100%';
    }

    const intervalDelay = 5000;
    let intervalId;
    function startTimer() {
        clearInterval(intervalId);
        updateSlides();
        intervalId = setInterval(() => {
            goToNext();
        }, intervalDelay);
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % slideCount;
        startTimer();
    }
    function goToPrev() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        startTimer();
    }

    // initial
    startTimer();

    // swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });
    wrapper.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            if (dx < 0) goToNext();
            else goToPrev();
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('works-wrapper');
    const filteredWorks = works.filter(work => work.show);
    filteredWorks.sort((a, b) => a.id - b.id);
    filteredWorks.forEach(work => {
        const html = `
        <div class="work-container scroll-fade" style="--aspect-ratio: ${work.aspectRatio};">
            <a href="/views/works/${work.link}" style="text-decoration: none;">
                <div class="thumbnail">
                    <img src="/assets/images/${work.thumbnail}" alt="${work.title}">
                </div>
                <div class="project-title">${work.title}</div>
                <div class="project-details">${work.material}, ${work.year}</div>
            </a>
        </div>
        `;
        wrapper.innerHTML += html;
    });

    initScrollFade();
})




    // // view all slide
    // const viewSlide = document.createElement('div');
    // viewSlide.className = 'project-slide';
    // viewSlide.innerHTML = `
    //     <a href="/views/works.html" class="slide-link" style="text-decoration:none; display:flex; justify-content:center; align-items:center; width:100%; height:100%;">
    //         <div class="overlay" style="background:transparent;color:#fff;">View all works →</div>
    //     </a>
    // `;
    // slider.appendChild(viewSlide);