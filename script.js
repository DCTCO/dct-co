const HEADER_HEIGHT = 60;
const YOUTUBE_EMBED_BASE_URL = "https://www.youtube.com/embed/";
const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPW77xjNlESQRQPDnYRQZn6oQr1Al5RVpVoc51W2-P-f9ThJNNM6OUbr5UGOvP6uTnzDRZ28YKxhOd/pub?gid=0&single=true&output=csv";

const reportConfigs = {
  15: { oldCost: 75000, monthlyPay: 49000 },
  20: { oldCost: 150000, monthlyPay: 74000 },
  25: { oldCost: 225000, monthlyPay: 92740 },
  30: { oldCost: 375000, monthlyPay: 223388 },
  40: { oldCost: 562500, monthlyPay: 319133 },
  50: { oldCost: 750000, monthlyPay: 408100 },
  60: { oldCost: 937500, monthlyPay: 501623 },
};

const pricingData = {
  15: {
    title: "20 L 이하",
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

function disableContextMenu() {
  document.body.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const offsetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        HEADER_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });
}

function initRevealAnimations() {
  const animatedElements = document.querySelectorAll(".animate-up");
  if (!animatedElements.length) return;

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";
        entry.target.classList.add("animate-up");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    revealObserver.observe(element);
  });
}

function initHeaderShadow() {
  const header = document.querySelector("header");
  if (!header) return;

  const handleScroll = () => {
    header.style.boxShadow =
      window.scrollY > 20 ? "0 2px 10px rgba(0,0,0,0.1)" : "none";
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

function buildVideoEmbed(videoId) {
  return `
    <iframe
      src="${YOUTUBE_EMBED_BASE_URL}${videoId}?autoplay=1&rel=0"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowfullscreen
      playsinline>
    </iframe>
  `;
}

function playVideo(element, videoId = "xUemVdPq_58") {
  element.innerHTML = buildVideoEmbed(videoId);
}

function initVideoPlayers() {
  document.querySelectorAll(".video-wrapper[data-youtube-id]").forEach((el) => {
    el.addEventListener("click", () => {
      playVideo(el, el.dataset.youtubeId);
    });
  });
}

function buildTickerItem(name, status, text) {
  const item = document.createElement("div");
  const isLive = status.toLowerCase() === "live";
  const badgeClass = isLive ? "tag-live" : "tag-done";

  item.className = "ticker-item";
  item.innerHTML = `
    <span class="shop-name">${name}</span>
    <span class="status-badge ${badgeClass}">${
      isLive ? '<span class="live-dot"></span>' : ""
    }${text}</span>
  `;

  return item;
}

function renderTickerMessage(container, message) {
  container.innerHTML = `<div class="ticker-item">${message}</div>`;
}

async function initTicker() {
  const container = document.querySelector(".ticker-content");
  if (!container) return;

  if (window.location.protocol === "file:") {
    renderTickerMessage(
      container,
      "실시간 현황은 브라우저 배포 환경에서 자동 연결됩니다.",
    );
    return;
  }

  try {
    const response = await fetch(GOOGLE_SHEET_URL, {
      mode: "cors",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const csvData = await response.text();
    const rows = csvData.split(/\r?\n/).filter((row) => row.trim() !== "");
    const fragment = document.createDocumentFragment();

    rows.forEach((row) => {
      const columns = row.split(",").map((column) => column.trim());
      if (columns.length < 3) return;

      const [name, status, text] = columns;
      fragment.appendChild(buildTickerItem(name, status, text));
    });

    container.innerHTML = "";
    container.appendChild(fragment.cloneNode(true));
    container.appendChild(fragment);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    renderTickerMessage(container, "실시간 현황 업데이트 중...");
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.innerText = value;
  }
}

function updateReportSummary(reportConfig, title) {
  const reportTitle = document.getElementById("ace-display-title");
  if (!reportTitle || !reportConfig) return;

  const netProfit = reportConfig.oldCost - reportConfig.monthlyPay;
  const yearlyProfit = netProfit * 12;

  reportTitle.innerText = `${title} 한 달 사용시`;
  setText("ace-old-cost", `${reportConfig.oldCost.toLocaleString()} 원`);
  setText("ace-machine-cost", `${reportConfig.monthlyPay.toLocaleString()} 원`);
  setText("ace-net-profit", `${netProfit.toLocaleString()} 원`);
  setText("ace-yearly-profit", yearlyProfit.toLocaleString());
}

function renderModelImage(wrapper, imagePath) {
  if (!wrapper) return;

  if (!imagePath) {
    wrapper.style.display = "none";
    return;
  }

  wrapper.style.width = "100%";
  wrapper.style.height = "200px";
  wrapper.style.background = "#ffffff";
  wrapper.style.marginBottom = "20px";
  wrapper.style.borderRadius = "12px";
  wrapper.style.overflow = "hidden";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.padding = "20px";

  wrapper.innerHTML = `
    <picture style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
      <source srcset="${imagePath}.webp" type="image/webp">
      <img
        src="${imagePath}.jpg"
        alt="제품 이미지"
        style="max-width:100%; max-height:100%; object-fit:contain; display:block; margin:0 auto;"
      >
    </picture>
  `;
}

function renderRentalContent(rental) {
  if (!rental) {
    return '<p style="text-align:center; color:#64748b; font-size: clamp(calc(14px * 0.85), 5vw, 14px); margin:10px 0;">해당 모델 렌탈 서비스 없음</p>';
  }

  return `
    <div class="row"><span class="term">48개월</span><div class="price-group"><span class="old-price inline">${rental.r48o}</span><span class="new-price small">${rental.r48n} 원</span></div></div>
    <div class="row dashed"><span class="term">36개월</span><div class="price-group"><span class="old-price inline">${rental.r36o}</span><span class="new-price small">${rental.r36n} 원</span></div></div>
  `;
}

function scrollToPriceCard(card) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const targetPosition =
        card.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });
}

function updatePrice(value) {
  const pricing = pricingData[value];
  const report = reportConfigs[value];
  const card = document.getElementById("price-card");
  const wrapper = document.getElementById("pricing-selector-final");
  const rentalContent = document.getElementById("rental-content");

  if (!pricing || !report || !card || !wrapper || !rentalContent) return;

  wrapper.style.maxWidth = "100%";
  card.style.maxWidth = "100%";

  document.querySelectorAll(".cap-btn").forEach((button) => {
    button.classList.remove("active");
  });

  document.getElementById(`btn-${value}`)?.classList.add("active");

  card.style.display = "block";
  setText("target-title", `[ ${pricing.title} ] 가격 할인 지원가`);

  updateReportSummary(report, pricing.title);
  renderModelImage(document.getElementById("model-img-wrap"), pricing.img);

  setText("old-buy", `${pricing.oldB} 원`);
  setText("new-buy", `${pricing.newB} 원`);
  setText("old-h48", pricing.h48o);
  setText("new-h48", `${pricing.h48n} 원`);
  setText("old-h36", pricing.h36o);
  setText("new-h36", `${pricing.h36n} 원`);
  setText("save-text", `월 ~${pricing.save} 원 절감`);
  setText("daily-text", `하루 ${pricing.daily} 원`);

  rentalContent.innerHTML = renderRentalContent(pricing.rental);
  scrollToPriceCard(card);
}

function initPricing() {
  const buttons = document.querySelectorAll(".cap-btn");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const capacity =
      button.dataset.capacity || button.id.replace("btn-", "").trim();

    button.removeAttribute("onclick");
    button.addEventListener("click", () => {
      updatePrice(capacity);
    });
  });
}

function initStickyBar() {
  const stickyBar = document.querySelector(".sticky-bar");
  const priceCard = document.getElementById("price-card");
  if (!stickyBar || !priceCard) return;

  let isPriceCardVisible = false;

  const handleStickyBar = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 2000 && !isPriceCardVisible) {
      stickyBar.classList.remove("is-hidden");
    } else {
      stickyBar.classList.add("is-hidden");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isPriceCardVisible = entry.isIntersecting;
        handleStickyBar();
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  observer.observe(priceCard);
  window.addEventListener("scroll", handleStickyBar);
  handleStickyBar();
}

function initApp() {
  disableContextMenu();
  initSmoothScroll();
  initRevealAnimations();
  initHeaderShadow();
  initVideoPlayers();
  initTicker();
  initPricing();
  initStickyBar();
}

window.playVideo = playVideo;
window.updatePrice = updatePrice;

document.addEventListener("DOMContentLoaded", initApp);
