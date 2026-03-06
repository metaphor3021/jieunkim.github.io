document.addEventListener('DOMContentLoaded', () => {

initScrollFade();

    includeHTML('#header', '/views/components/header.html')
        .then(() => {
            setActiveLink('.header-nav a[href]');
            initHeaderAutoHide();
        })
        .catch(err => console.error('헤더 include 실패:', err));

    includeHTML('#menu', '/views/components/menu.html')
        .then(() => {
            initMobileMenu();
            setActiveLink('.menu a[href]');
        })
        .catch(err => console.error('메뉴 include 실패:', err));

    

    // 우클릭 비활성화
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // 드래그 비활성화
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

});


function initPageTransition() {

    const layout = document.querySelector('.layout');
    if (!layout) return;

    /* -------------------
       초기 상태 숨김
    ------------------- */

    layout.classList.add("fade-in");



    /* -------------------
       링크 클릭 전환
    ------------------- */

    document.addEventListener("click", (e) => {

        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");

        if (!href) return;
        if (href.startsWith("#")) return;
        if (href.startsWith("http")) return;
        if (href.startsWith("mailto")) return;
        if (href.startsWith("tel")) return;
        if (link.target === "_blank") return;

        e.preventDefault();


        /* 메뉴 닫기 */

        const menu = document.querySelector('.menu-overlay');

        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }


        /* 페이드 아웃 */

        layout.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = href;
        }, 500);

    });


    /* -------------------
       뒤로가기 캐시 해결
    ------------------- */

    window.addEventListener("pageshow", (event) => {

        if (event.persisted) {
            layout.classList.remove("fade-out");
            layout.classList.remove("fade-in");
        }

    });

}


function openNewTab(event, url) {
    window.open(url, '_blank'); // 새 탭에서 열기
}

function includeHTML(selector, filePath) {
    return fetch(filePath)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch ' + filePath);
            return res.text();
        })
        .then(html => {
            const container = document.querySelector(selector);
            if (!container) throw new Error('No container for ' + selector);
            container.innerHTML = html;
        });
}

function initMobileMenu() {
    const header = document.querySelector('.header');
    const menu = document.querySelector('.menu-overlay');
    const toggleBtn = document.querySelector('.menu-toggle');

    if (!toggleBtn || !menu) {
        console.warn('Mobile menu 요소를 찾을 수 없음');
        return;
    }

    function setMenuPosition() {
        const headerHeight = header.offsetHeight;
        menu.style.paddingTop = headerHeight + 20 + "px"; // 헤더 높이 + 여백
    }

    window.addEventListener("load", setMenuPosition);
    window.addEventListener("resize", setMenuPosition);

    toggleBtn.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');

        // 스크롤 잠금
        document.body.style.overflow = isActive ? "hidden" : "";

        toggleBtn.textContent = isActive ? "✕" : "☰";
    });
}

function setActiveLink(selector) {
    const currentPage = window.location.pathname.split('/').pop(); // 현재 파일명
    const links = document.querySelectorAll(selector);

    links.forEach(link => {
        const hrefPage = link.getAttribute('href')?.split('/').pop();
        let isActive = hrefPage === currentPage;
        if (currentPage.startsWith('project') && hrefPage === 'works.html') {
            isActive = true;
        }
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initScrollFade() {

    const elements = document.querySelectorAll(".scroll-fade");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.15
    });

    elements.forEach(el => observer.observe(el));
}

function initHeaderAutoHide() {
    const header = document.querySelector(".header");
    if (!header) return;

    let lastScroll = window.pageYOffset;

    window.addEventListener("scroll", () => {

        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 80) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }

        lastScroll = currentScroll;

    });
}