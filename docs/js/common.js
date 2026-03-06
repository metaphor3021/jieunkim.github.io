document.addEventListener('DOMContentLoaded', () => {
    // 페이지 페이드 인 효과 - 초기에는 fade-in 클래스로 투명하게 시작
    document.querySelector('.layout').classList.add('fade-in');
    
    // 약간의 지연 후 fade-in 클래스 제거하여 페이드 인
    setTimeout(() => {
        document.querySelector('.layout').classList.remove('fade-in');
    }, 50);
    
    includeHTML('#header', '/views/components/header.html')
        .then(() => {
            setActiveLink('.header-nav a[href]');
            setupPageTransition();
        })
        .catch(err => console.error('헤더 include 실패:', err));
    includeHTML('#menu', '/views/components/menu.html')
        .then(() => {
            initMobileMenu(); // 삽입 완료 후 이벤트 연결
            setActiveLink('.menu a[href]');
            setupPageTransition();
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
        menu.style.top = headerHeight + "px";
        menu.style.height = `calc(100vh - ${headerHeight}px)`;
    }

    window.addEventListener("load", setMenuPosition);
    window.addEventListener("resize", setMenuPosition);

    toggleBtn.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');

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

function setupPageTransition() {
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href*=".html"]');
    
    internalLinks.forEach(link => {
        // 새 탭 열기 링크는 제외
        if (link.onclick && link.onclick.toString().includes('openNewTab')) {
            return;
        }
        
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // 현재 페이지와의 이동이 아닐 때만 처리
            if (href && !href.includes('#')) {
                e.preventDefault();
                
                // 메뉴가 열려있으면 닫기
                const menu = document.querySelector('.menu-overlay');
                if (menu && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // 페이드 아웃 후 페이지 이동
                document.querySelector('.layout').classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
}

