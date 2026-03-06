document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('main-wrapper');
    const filteredWorks = works.filter(work => work.showOnMain);
    filteredWorks.sort((a, b) => a.orderOnMain - b.orderOnMain);
    filteredWorks.forEach(work => {
        const html = `
        <div class="main-container scroll-fade">
            <a href="/views/projects/${work.link}" class="main-link" style="text-decoration: none;">
                <div class="thumbnail">
                    <img src="/assets/images/${work.mainThumbnail}" alt="${work.title}">
                </div>
                <div class="main-descript">${work.title}, ${work.material}, ${work.year}</div>
            </a>
        </div>
        `;
        wrapper.innerHTML += html;
    });
    
    // "View all works" 링크를 최 하단에 추가
    const viewAllLink = `
        <div class="main-container scroll-fade">
            <a href="/views/works.html" class="main-link">
                <div class="main-descript">View all works →</div>
            </a>
        </div>
    `;
    wrapper.innerHTML += viewAllLink;

        
    initScrollFade();
});


document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('works-wrapper');
    const filteredWorks = works.filter(work => work.show);
    filteredWorks.sort((a, b) => a.id - b.id);
    filteredWorks.forEach(work => {
        const html = `
        <div class="work-container scroll-fade" style="--aspect-ratio: ${work.aspectRatio};">
            <a href="/views/projects/${work.link}" style="text-decoration: none;">
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