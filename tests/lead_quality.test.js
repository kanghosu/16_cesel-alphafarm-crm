const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadLeadQuality() {
  const file = path.join(__dirname, "..", "src", "LeadQuality.gs");
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { console, globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file });
  return sandbox.LeadQuality;
}

const LeadQuality = loadLeadQuality();

function score(lead) {
  return LeadQuality.scoreLead(lead);
}

function assertGrade(name, lead, expectedGrade) {
  const result = score(lead);
  assert.strictEqual(
    result.grade,
    expectedGrade,
    `${name}: expected ${expectedGrade}, got ${result.grade} (${JSON.stringify(result)})`
  );
  return result;
}

const sampleLeads = [
  {
    name: "A AlphaCafe premium bakery",
    lead: {
      product: "AlphaCafe",
      customerType: "프리미엄 베이커리",
      source: "공식 홈페이지 / Naver Place",
      contactChannel: "대표번호 02-1111-2222 / 공식 문의메일",
      decisionSignal: "브랜드총괄 및 본점 확인",
      assetSignal: "본점, 백화점 입점, 복수매장",
      budgetSignal: "프리미엄 딸기 케이크 시즌 SKU 운영",
      urgentNeed: "여름철 딸기 수급 안정화 필요",
      notes: "딸기케이크, 프리미엄 디저트, 리테일 채널",
    },
    grade: "A",
  },
  {
    name: "A Core with asset and investment signal",
    lead: {
      product: "AlphaFarm Core",
      customerType: "식품 유통법인",
      source: "공식 홈페이지 / DART",
      contactChannel: "대표번호 / 구매상담 공식메일",
      decisionSignal: "구매팀장, 신사업 담당",
      assetSignal: "창고 보유, 물류센터, 법인 본사",
      budgetSignal: "시설투자, 신규사업 검토",
      urgentNeed: "프리미엄 과채 안정공급 필요",
      notes: "창고, 건물, 투자, 유통망",
    },
    grade: "A",
  },
  {
    name: "B Experience with weaker budget signal",
    lead: {
      product: "Alpha Experience Portfolio",
      customerType: "호텔 라운지",
      source: "공식 홈페이지",
      contactChannel: "대표번호",
      decisionSignal: "세일즈팀 연결 가능",
      assetSignal: "호텔 로비, 라운지 공간 운영",
      budgetSignal: "",
      urgentNeed: "공간 차별화와 F&B 연계",
      notes: "방문객 경험, 포토존",
    },
    grade: "B",
  },
  {
    name: "B ASEAN official export intent",
    lead: {
      product: "ASEAN Service",
      customerType: "베이커리 브랜드",
      source: "KOTRA / 공식 홈페이지",
      contactChannel: "공식 해외사업 문의메일",
      decisionSignal: "해외사업팀",
      assetSignal: "법인 본사",
      budgetSignal: "수출바우처, 해외진출 검토",
      urgentNeed: "싱가포르 현지 테스트",
      notes: "ASEAN, 수출, 현지검증",
    },
    grade: "B",
  },
  {
    name: "C social-only cafe lead",
    lead: {
      product: "AlphaCafe",
      customerType: "카페",
      source: "Instagram",
      contactChannel: "공식 DM",
      decisionSignal: "",
      assetSignal: "단일 매장",
      budgetSignal: "",
      urgentNeed: "딸기 음료 게시물",
      notes: "카페, 딸기 메뉴",
    },
    grade: "C",
  },
  {
    name: "Hold unofficial contact only",
    lead: {
      product: "AlphaCafe",
      customerType: "베이커리",
      source: "블로그 댓글",
      contactChannel: "개인 휴대폰",
      decisionSignal: "",
      assetSignal: "",
      budgetSignal: "",
      urgentNeed: "자료 요청",
      notes: "비공식 연락처",
    },
    grade: "보류",
  },
  {
    name: "Hold Core land-only prospect",
    lead: {
      product: "AlphaFarm Core",
      customerType: "투자형 고객",
      source: "소개",
      contactChannel: "대표번호",
      decisionSignal: "대표",
      assetSignal: "토지 보유",
      budgetSignal: "투자 문의",
      urgentNeed: "가격 문의",
      notes: "창고 없음, 건물 없음, 담보 불명확",
    },
    grade: "보류",
  },
  {
    name: "Hold 40ft without infrastructure",
    lead: {
      product: "40ft HC ContainerFarm",
      customerType: "교육기관",
      source: "공식 홈페이지",
      contactChannel: "대표번호",
      decisionSignal: "교육 담당",
      assetSignal: "부지만 있음",
      budgetSignal: "교육 검토",
      urgentNeed: "생산량 문의",
      notes: "컨테이너 없음, 냉방장비 없음, 전력 미확인, 배수 미확인",
    },
    grade: "보류",
  },
  {
    name: "Hold price roi first request requires approval",
    lead: {
      product: "AlphaFarm Core",
      customerType: "식품기업",
      source: "공식 홈페이지",
      contactChannel: "대표번호",
      decisionSignal: "대표",
      assetSignal: "창고 보유",
      budgetSignal: "ROI, 가격, 회수기간 자료 요청",
      urgentNeed: "수익성 검토",
      notes: "생산량, 외부자료 발송 요청",
    },
    grade: "보류",
  },
  {
    name: "B 40ft verified public center",
    lead: {
      product: "40ft HC ContainerFarm",
      customerType: "농업기술센터",
      source: "공식 홈페이지",
      contactChannel: "대표번호",
      decisionSignal: "원예기술팀",
      assetSignal: "교육장, 스마트팜 테스트베드, 전력 설비",
      budgetSignal: "실증, 교육 파일럿",
      urgentNeed: "스마트농업 교육",
      notes: "실증, 파일럿, 교육",
    },
    grade: "B",
  },
];

for (const item of sampleLeads) {
  assertGrade(item.name, item.lead, item.grade);
}

const approvalResult = score(sampleLeads[8].lead);
assert.strictEqual(approvalResult.approvalRequired, "Y");
assert.match(approvalResult.holdReason, /가격|ROI|회수기간|생산량|외부자료/);

const coreWithoutAssets = score(sampleLeads[6].lead);
assert.notStrictEqual(coreWithoutAssets.grade, "A");
assert.strictEqual(coreWithoutAssets.grade, "보류");
assert.match(coreWithoutAssets.holdReason, /자산|창고|건물|담보/);

const fortyWithoutInfra = score(sampleLeads[7].lead);
assert.notStrictEqual(fortyWithoutInfra.grade, "A");
assert.strictEqual(fortyWithoutInfra.grade, "보류");
assert.match(fortyWithoutInfra.holdReason, /컨테이너|냉방|전력|배수|실증/);

const followUp = LeadQuality.applyContactLearning(
  { readinessScore: 58, grade: "C", scoreReason: "기본 점수" },
  { response: "담당자 연결 성공, 예산 검토 가능, 미팅 제안 수락" }
);
assert.ok(followUp.readinessScore > 58);
assert.strictEqual(followUp.grade, "B");
assert.match(followUp.scoreReason, /접촉 결과 반영/);

console.log("lead_quality.test.js passed");
