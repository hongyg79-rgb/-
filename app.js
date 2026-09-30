const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");

// 별도 JSON 파일 없이 app.js 내부에 데이터 직접 포함
const chapters = [
  {
    "장": "1",
    "제목": "개요",
    "본문": "본 보고서는 행정안전부 안전정책총괄과가 2026년 상반기 실시한 종합 안전점검 결과를 정리한 자료다.\n\n총 점검 건수는 **450건**이며, 지적사항 **120건** 중 시정 완료율은 **85%**이다. 예산 집행률은 **92%**, 총괄책임자는 **권혁수** 안전정책총괄과장이다."
  },
  {
    "장": "2",
    "제목": "분야별 결과",
    "본문": "분야별 점검은 시설안전·교통안전·재난안전·산업안전 4개 분야로 진행됐다. 분야별 총합은 **450건**과 일치한다.\n\n지적사항 **115건** 중 80% 이상이 1분기 내 시정되었으며, 누적 시정 완료율은 **85%**으로 집계됐다."
  },
  {
    "장": "3",
    "제목": "예산 운용",
    "본문": "상반기 예산 집행률 **90%**은 전년 동기 대비 5%p 상승한 수치다. 총괄 운영은 **권혁수** 과장이 직접 주재했고, 분기별 점검회의 5회를 개최했다."
  },
  {
    "장": "4",
    "제목": "향후 계획",
    "본문": "상반기 실적을 되짚어 보면, 총 점검 건수는 **440건**으로 마감됐고 시정 완료율은 **82%**로 집계됐다.\n\n이를 바탕으로 하반기에는 미시정 과제 해소와 취약 분야 재점검을 중심으로 점검 체계를 보강할 계획이다."
  },
  {
    "장": "5",
    "제목": "결론",
    "본문": "행정안전부 안전정책총괄과는 2026년 상반기 동안 **450건**의 안전점검을 차질 없이 완료했다. 총괄 책임은 **권혁주** 과장이 맡았으며, 향후에도 분기별 점검 체계를 강화한다."
  }
];

// HTML 삽입 방지용
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// JSON 본문의 **강조표시**를 <strong>으로 변환
function renderMarkdownBold(text) {
  const safe = escapeHtml(text);
  return safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function highlight(text, keyword) {
  if (!keyword) return renderMarkdownBold(text);

  const safeText = escapeHtml(text);
  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeKeyword})`, "gi");

  const highlighted = safeText.replace(regex, "<mark>$1</mark>");
  return highlighted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function renderCards(list, keyword = "") {
  cardContainer.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "report-card";

    card.innerHTML = `
      <span class="chapter-badge">제 ${escapeHtml(item.장)}장</span>
      <h2>${highlight(item.제목, keyword)}</h2>
      <p class="body">${highlight(item.본문, keyword)}</p>
    `;

    cardContainer.appendChild(card);
  });

  resultCount.textContent = list.length;
  emptyMessage.hidden = list.length !== 0;
}

function filterChapters() {
  const keyword = searchInput.value.trim();

  if (!keyword) {
    renderCards(chapters);
    return;
  }

  const normalizedKeyword = keyword.toLocaleLowerCase("ko-KR");

  const filtered = chapters.filter((item) => {
    const title = String(item.제목 ?? "").toLocaleLowerCase("ko-KR");
    const body = String(item.본문 ?? "").toLocaleLowerCase("ko-KR");

    // 검색 대상: 제목 + 본문
    return title.includes(normalizedKeyword) || body.includes(normalizedKeyword);
  });

  renderCards(filtered, keyword);
}

searchInput.addEventListener("input", filterChapters);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  renderCards(chapters);
});

// 페이지 로드 시 전체 5개 장 표시
renderCards(chapters);
