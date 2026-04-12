document.addEventListener("DOMContentLoaded", () => {
  // 1. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = 60; // Fixed header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 2. Reveal Animations on Scroll (Intersection Observer)
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.classList.add("animate-up");
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1,
  });

  document.querySelectorAll(".animate-up").forEach((el) => {
    el.style.opacity = "0"; // Initial state
    revealObserver.observe(el);
  });

  // 3. Header background change on scroll (Optional, for better UX)
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      header.style.boxShadow = "none";
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
const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPW77xjNlESQRQPDnYRQZn6oQr1Al5RVpVoc51W2-P-f9ThJNNM6OUbr5UGOvP6uTnzDRZ28YKxhOd/pub?gid=0&single=true&output=csv";

async function initTicker() {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const csvData = await response.text();

    // 윈도우/맥 줄바꿈 차이 해결 (\r\n 또는 \n)
    const rows = csvData.split(/\r?\n/).filter((row) => row.trim() !== "");
    const container = document.querySelector(".ticker-content");

    if (!container) return;

    const fragment = document.createDocumentFragment();

    rows.forEach((row) => {
      // 콤마로 분리
      const cols = row.split(",").map((c) => c.trim());
      if (cols.length < 3) return;

      const [name, status, text] = cols;
      const itemDiv = document.createElement("div");
      itemDiv.className = "ticker-item";

      const isLive = status.toLowerCase() === "live";
      const badgeClass = isLive ? "tag-live" : "tag-done";

      // live일 때만 흰색 점(live-dot) 추가
      const dot = isLive ? '<span class="live-dot"></span>' : "";

      itemDiv.innerHTML = `
                <span class="shop-name">${name}</span>
                <span class="status-badge ${badgeClass}">${dot}${text}</span>
            `;
      fragment.appendChild(itemDiv);
    });

    // 비우고 새로 채우기 (무한 루프 위해 2개 복사)
    container.innerHTML = "";
    container.appendChild(fragment.cloneNode(true));
    container.appendChild(fragment);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    // 에러 시 임시 문구 표시
    document.querySelector(".ticker-content").innerHTML =
      '<div class="ticker-item">실시간 현황 업데이트 중...</div>';
  }
}

// 페이지 로드 시 즉시 실행
window.addEventListener("DOMContentLoaded", initTicker);

// 아이폰 사파리 강제 렌더링 트리거
window.addEventListener("load", () => {
  const track = document.getElementById("tickerTrack");
  if (track) {
    // 0.1초 뒤에 화면을 살짝 흔들어 브라우저가 다시 그리게 만듦
    setTimeout(() => {
      track.style.display = "none";
      track.offsetHeight; // 강제 리플로우 (핵심)
      track.style.display = "flex";
    }, 100);
  }
});

const pricingData = {
  // img: "images/파일명" (확장자 제외)
  15: {
    title: "20 L 이하",
    img: "images/09",
    oldB: "2,870,000",
    newB: "2,370,000",
    h48o: "75,000",
    h48n: "49,000",
    h36o: "85,800",
    h36n: "59,800",
    rental: null,
    save: "26,000",
    daily: "1,633",
  },
  20: {
    title: "20 ~ 40 L",
    img: "images/09",
    oldB: "3,452,000",
    newB: "2,770,000",
    h48o: "106,000",
    h48n: "74,000",
    h36o: "124,000",
    h36n: "92,000",
    rental: {
      r48o: "121,100",
      r48n: "89,100",
      r36o: "142,000",
      r36n: "110,000",
    },
    save: "76,000",
    daily: "2,466",
  },
  25: {
    title: "40 ~ 60 L",
    img: "images/09",
    oldB: "4,390,000",
    newB: "3,470,000",
    h48o: "128,740",
    h48n: "92,740",
    h36o: "152,000",
    h36n: "116,000",
    rental: {
      r48o: "147,100",
      r48n: "111,100",
      r36o: "173,500",
      r36n: "137,500",
    },
    save: "132,260",
    daily: "2,466",
  },
  30: {
    title: "60 ~ 100 L",
    img: "images/10",
    oldB: "9,300,000",
    newB: "7,900,000",
    h48o: "273,388",
    h48n: "223,388",
    h36o: "327,741",
    h36n: "277,741",
    rental: {
      r48o: "282,100",
      r48n: "232,100",
      r36o: "340,400",
      r36n: "290,400",
    },
    save: "151,612",
    daily: "7,446",
  },
  40: {
    title: "100 ~ 150 L",
    img: "images/10",
    oldB: "13,600,000",
    newB: "11,700,000",
    h48o: "378,000",
    h48n: "319,133",
    h36o: "455,200",
    h36n: "399,310",
    rental: {
      r48o: "400,800",
      r48n: "344,300",
      r36o: "487,000",
      r36n: "429,000",
    },
    save: "243,367",
    daily: "10,638",
  },
  50: {
    title: "150 ~ 200 L",
    img: "images/10",
    oldB: "16,800,000",
    newB: "14,400,000",
    h48o: "486,100",
    h48n: "408,100",
    h36o: "584,261",
    h36n: "506,261",
    rental: {
      r48o: "501,500",
      r48n: "423,500",
      r36o: "606,000",
      r36n: "528,000",
    },
    save: "341,900",
    daily: "13,603",
  },
  60: {
    title: "200 ~ 250 L",
    img: "images/10",
    oldB: "20,650,000",
    newB: "17,700,000",
    h48o: "587,623",
    h48n: "501,623",
    h36o: "708,279",
    h36n: "622,279",
    rental: {
      r48o: "606,300",
      r48n: "520,300",
      r36o: "735,000",
      r36n: "649,000",
    },
    save: "435,877",
    daily: "16,720",
  },
};

function updatePrice(val) {
  const d = pricingData[val];
  const card = document.getElementById("price-card");
  const wrap = document.getElementById("pricing-selector-final");

  // 넓이 확장 (다른 섹션과 동일하게)
  wrap.style.maxWidth = "100%";
  card.style.maxWidth = "100%";

  // 버튼 활성화 스타일
  document
    .querySelectorAll(".cap-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("btn-" + val).classList.add("active");

  // 표 노출 및 타이틀 주입
  card.style.display = "block";
  document.getElementById("target-title").innerText =
    `[ ${d.title} ] 상세 조건표`;

  // 이미지 섹션 (사장님 요청 디자인 적용: 200px 높이 제한 및 중앙 정렬)
  const imgWrap = document.getElementById("model-img-wrap");
  if (d.img) {
    // 부모 박스 스타일 강제 지정
    imgWrap.style.width = "100%";
    imgWrap.style.height = "200px"; // 높이 고정
    imgWrap.style.background = "#ffffff"; // 흰색 배경
    imgWrap.style.marginBottom = "20px";
    imgWrap.style.borderRadius = "12px";
    imgWrap.style.overflow = "hidden";
    imgWrap.style.display = "flex";
    imgWrap.style.alignItems = "center";
    imgWrap.style.justifyContent = "center";
    imgWrap.style.padding = "20px";

    imgWrap.innerHTML = `
            <picture style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                <source srcset="${d.img}.webp" type="image/webp">
                <img src="${d.img}.jpg" alt="제품 이미지" 
                    style="max-width:100%; max-height:100%; object-fit:contain; display:block; margin:0 auto;">
            </picture>
        `;
  } else {
    imgWrap.style.display = "none";
  }

  // 데이터 주입 (기존 디자인 유지)
  document.getElementById("old-buy").innerText = d.oldB + " 원";
  document.getElementById("new-buy").innerText = d.newB + " 원";
  document.getElementById("old-h48").innerText = d.h48o;
  document.getElementById("new-h48").innerText = d.h48n + " 원";
  document.getElementById("old-h36").innerText = d.h36o;
  document.getElementById("new-h36").innerText = d.h36n + " 원";

  const rCont = document.getElementById("rental-content");
  if (d.rental) {
    rCont.innerHTML = `
            <div class="row"><span class="term">48개월</span><div class="price-group"><span class="old-price inline">${d.rental.r48o}</span><span class="new-price small">${d.rental.r48n} 원</span></div></div>
            <div class="row dashed"><span class="term">36개월</span><div class="price-group"><span class="old-price inline">${d.rental.r36o}</span><span class="new-price small">${d.rental.r36n} 원</span></div></div>
        `;
  } else {
    rCont.innerHTML = `<p style="text-align:center; color:#64748b; font-size: clamp(calc(14px * 0.85), 5vw, 14px); margin:10px 0;">해당 모델 렌탈 서비스 없음</p>`;
  }

  document.getElementById("save-text").innerText = `월 ~${d.save} 원 절감`;
  document.getElementById("daily-text").innerText = `하루 ${d.daily} 원`;

  // 스크롤
  const targetPosition =
    card.getBoundingClientRect().top + window.pageYOffset - 100;
  window.scrollTo({ top: targetPosition, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const stickyBar = document.querySelector(".sticky-bar");
  const priceCard = document.getElementById("price-card");

  if (stickyBar && priceCard) {
    let isPriceCardVisible = false;

    // 1. 가격표 위치 감시
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isPriceCardVisible = entry.isIntersecting;
          handleStickyBar(); // 상태 바뀔 때마다 실행
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    observer.observe(priceCard);

    // 2. 통합 제어 함수
    const handleStickyBar = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      // 조건: 스크롤이 100px 이상 내려왔고 AND 가격표가 안 보일 때만 노출
      if (scrollY > 100 && !isPriceCardVisible) {
        stickyBar.classList.remove("is-hidden");
      } else {
        // 그 외 모든 상황(맨 위거나 가격표 겹칠 때)에서는 숨김
        stickyBar.classList.add("is-hidden");
      }
    };

    // 스크롤 시마다 체크
    window.addEventListener("scroll", handleStickyBar);

    // 초기 로딩 시점에도 한 번 실행 (혹시 모를 상태 동기화)
    handleStickyBar();
  }
});
