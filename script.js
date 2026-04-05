document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = 60; // Fixed header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Reveal Animations on Scroll (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-up').forEach(el => {
        el.style.opacity = '0'; // Initial state
        revealObserver.observe(el);
    });

    // 3. Header background change on scroll (Optional, for better UX)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});


function playVideo(element) {
  element.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/xUemVdPq_58?autoplay=1&rel=0"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowfullscreen
      playsinline>
    </iframe>
  `;
}

// 구글 시트 CSV URL (게시 후 생성된 주소)
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQPW77xjNlESQRQPDnYRQZn6oQr1Al5RVpVoc51W2-P-f9ThJNNM6OUbr5UGOvP6uTnzDRZ28YKxhOd/pub?gid=0&single=true&output=csv';

async function initTicker() {
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const csvData = await response.text();
        
        // 윈도우/맥 줄바꿈 차이 해결 (\r\n 또는 \n)
        const rows = csvData.split(/\r?\n/).filter(row => row.trim() !== '');
        const container = document.querySelector('.ticker-content');
        
        if (!container) return;

        const fragment = document.createDocumentFragment();

        rows.forEach(row => {
            // 콤마로 분리
            const cols = row.split(',').map(c => c.trim());
            if (cols.length < 3) return;

            const [name, status, text] = cols;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'ticker-item';
            
            const isLive = (status.toLowerCase() === 'live');
            const badgeClass = isLive ? 'tag-live' : 'tag-done';
            
            // live일 때만 흰색 점(live-dot) 추가
            const dot = isLive ? '<span class="live-dot"></span>' : '';

            itemDiv.innerHTML = `
                <span class="shop-name">${name}</span>
                <span class="status-badge ${badgeClass}">${dot}${text}</span>
            `;
            fragment.appendChild(itemDiv);
        });

        // 비우고 새로 채우기 (무한 루프 위해 2개 복사)
        container.innerHTML = '';
        container.appendChild(fragment.cloneNode(true));
        container.appendChild(fragment);

    } catch (error) {
        console.error("데이터 로드 실패:", error);
        // 에러 시 임시 문구 표시
        document.querySelector('.ticker-content').innerHTML = 
            '<div class="ticker-item">실시간 현황 업데이트 중...</div>';
    }
}

// 페이지 로드 시 즉시 실행
window.addEventListener('DOMContentLoaded', initTicker);

// 아이폰 사파리 강제 렌더링 트리거
window.addEventListener('load', () => {
    const track = document.getElementById('tickerTrack');
    if (track) {
        // 0.1초 뒤에 화면을 살짝 흔들어 브라우저가 다시 그리게 만듦
        setTimeout(() => {
            track.style.display = 'none';
            track.offsetHeight; // 강제 리플로우 (핵심)
            track.style.display = 'flex';
        }, 100);
    }
});
