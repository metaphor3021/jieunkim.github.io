document.addEventListener('DOMContentLoaded', () => {
  includeHTML('#header', '../components/header.html')
    .then(() => {
      setActiveLink('.top-nav a[href]');
    });

  includeHTML('#sidebar', '../components/sidebar.html')
    .then(() => {
      setActiveLink('.sidebar a[href]');
    })
    .catch(err => console.error('사이드바 include 실패:', err));

  includeHTML('#menu', '../components/menu.html')
    .then(() => {
      initMobileMenu();
      setActiveLink('.menu a[href]');
    })
    .catch(err => console.error('메뉴 include 실패:', err));
});


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
    const menuButton = document.querySelector('#header .menu-button');
    const menu = document.querySelector('#menu .menu');
    const menuOverlay = document.querySelector('#menu .menu-overlay');
    const menuClose = document.querySelector('#menu .menu-close');

    if (!menuButton || !menu || !menuOverlay || !menuClose) {
        console.warn('Mobile menu 요소를 찾을 수 없음');
        return;
    }

    function openMenu() {
        menu.classList.add('active');
        menuOverlay.classList.add('active'); // <- 이 부분 추가
    }

    function closeMenu() {
        menu.classList.remove('active');
        menuOverlay.classList.remove('active'); // <- 이 부분 추가
    }

    menuButton.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
}

function setActiveLink(selector) {
    const currentPage = window.location.pathname.split('/').pop(); // 현재 파일명
    const links = document.querySelectorAll(selector);

    links.forEach(link => {
        const hrefPage = link.getAttribute('href')?.split('/').pop();
        if (hrefPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
