function upsertInterPurePosLead() {
  var ss = CrmConfig.getSpreadsheet();
  LeadQualityRunner.setupLeadQualityCrm();

  var customerSheet = ss.getSheetByName("01_고객DB");
  var contactSheet = getOrCreateSheetWithHeadersLocal_(ss, "02_접촉기록", CONTACT_RECORD_HEADERS_);
  var pipelineSheet = ss.getSheetByName("05_파이프라인");

  var lead = {
    customerId: "C-0006",
    companyName: "인터퓨어포스(주)",
    brandName: "INTER PURE POS Co., Ltd.",
    businessNumber: "553-86-03164",
    customerType: "협력사 가능성 + 투자 검토 가능성",
    region: "평택 진위 산업단지",
    product: "AlphaFarm Core / 40ft HC",
    contactName: "Jeong myong seok",
    title: "COO",
    phone: "+82 10 9578 5114",
    email: "jstephanus@naver.com",
    route: "명함/대표전달/나주 수직농장 방문",
    problem: "방문 목적과 관심 방향 추가 확인 필요",
    needs: "환경·설비·수처리 계열 회사 가능성, 시설·공조·환경 협력 가능성 확인",
    proposal: "AlphaFarm Core / 40ft HC 도입 가능성과 공조·환경 협력 가능성을 함께 확인",
    interest: "확인필요",
    revenuePotential: "확인필요",
    status: "후속필요",
    approval: "불필요",
    nextAction: "방문 목적·보유 시설·협력 방향 확인",
    risk: "법인 확인 완료. 업종은 환경·설비·수처리 계열 추정이며 실제 방문 목적, 보유 시설, 협력 방향은 미확인.",
    note: "대표님 추가 확인: 인터퓨어포스(553-86-03164) 법인 확인. 단순 토지 보유 리드보다 시설·공조·환경 협력 가능성도 같이 확인.",
    contactAt: new Date(2026, 4, 22, 9, 30),
    contactMethod: "대표보고/정보확인",
    contactPurpose: "법인·업종·협력 가능성 추가 확인",
    customerResponse: "추가 확인 필요",
    meetingProposed: "아니오"
  };

  upsertCustomerLead_(customerSheet, lead, ["인터퓨어포스", "inter pure pos"]);
  upsertContactRecord_(contactSheet, lead);
  updatePipeline_(pipelineSheet, lead);

  return "인터퓨어포스 DB 업데이트 완료: " + lead.customerId + " / " + lead.status;
}

function upsertMay22ContactAndCustomerData() {
  var ss = CrmConfig.getSpreadsheet();
  LeadQualityRunner.setupLeadQualityCrm();

  var customerSheet = ss.getSheetByName("01_고객DB");
  var contactSheet = getOrCreateSheetWithHeadersLocal_(ss, "02_접촉기록", CONTACT_RECORD_HEADERS_);
  var leads = getMay22VerifiedLeads_();
  var results = [];

  leads.forEach(function (lead) {
    var customerRow = upsertCustomerLead_(customerSheet, lead, lead.keywords);
    lead.customerId = String(readByHeaderLocal_(customerSheet, customerRow, "고객ID") || lead.customerId || "");
    upsertContactRecord_(contactSheet, lead);
    updateWebAndTargetStatus_(ss, lead);
    results.push(lead.companyName + "(" + lead.customerId + ")");
  });

  return "5/22 접촉기록·고객DB 반영 완료: " + results.join(", ");
}

var CONTACT_RECORD_HEADERS_ = [
  "접촉ID", "고객ID", "접촉일시", "업체명", "접촉방식", "담당자", "제품군",
  "접촉목적", "고객반응", "핵심메모", "자료요청여부", "미팅제안여부",
  "다음액션", "상태업데이트", "기록자"
];

function getMay22VerifiedLeads_() {
  return [
    {
      companyName: "어밸브",
      brandName: "AIVLE",
      customerType: "협력사/기술협력 가능성 + 정부과제 관련 미팅",
      region: "확인 필요",
      product: "AlphaFarm Core / 시스템 개발 협력 / 정부과제",
      contactName: "박대표",
      title: "대표",
      phone: "",
      email: "",
      route: "김낙순 회장 주선 / 2026-05-19 화상회의",
      problem: "장비 통신·DB 값 화면 연동 가능성 및 정부과제 인수인계 범위 확인 필요",
      needs: "STAPI 등 장비 인터페이스 연결, 월별 현물 입력·정부과제 운영 인수인계 가능성 확인",
      proposal: "5/28 대면 미팅에서 기술협력 범위와 정부과제 역할을 구분해 확인",
      interest: "B",
      revenuePotential: "확인필요",
      status: "미팅예정",
      approval: "불필요",
      nextAction: "5/28 대면 미팅 전 대표님 기준의 역할 범위·자료 발송 가능 범위 확인",
      risk: "영업 리드라기보다 협력·과제 성격이 섞여 있어 역할 범위와 승인 기준 확인 필요.",
      note: "2026-05-19 14:00 어밸브 박대표 화상회의 진행. 2026-05-28 대면 미팅 일정 확인. 가격·ROI·생산량·회수기간은 임의 제공하지 않음.",
      contactAt: new Date(2026, 4, 19, 14, 0),
      contactMethod: "화상회의",
      contactPurpose: "협력 가능성 및 정부과제 관련 미팅",
      customerResponse: "5/28 대면 미팅 일정 확인",
      meetingProposed: "예",
      promotionEvidence: "오프라인접점",
      contactStage: "미팅예정",
      assetSignal: "대표 미팅, 기술협력 가능성, 장비·DB 연동 논의",
      budgetSignal: "정부과제 및 협력 가능성",
      decisionSignal: "대표 직접 미팅",
      sourceTrust: "김낙순 회장 주선",
      keywords: ["어밸브", "aivle", "박대표"]
    },
    {
      companyName: "AK플라자 분당 / 상품본부",
      brandName: "AK Plaza Bundang",
      customerType: "백화점 F&B/푸드홀·디저트 팝업 후보",
      region: "성남 분당 서현",
      product: "AlphaCafe / Alpha Experience Portfolio",
      contactName: "담당 부서 확인 필요",
      title: "",
      phone: "1661-1114",
      email: "",
      route: "AK플라자 분당점 현장 접촉 / 고객지원센터·공식 접수 안내",
      problem: "F&B/푸드홀/디저트 팝업 담당자 연결 필요",
      needs: "프리미엄 죽향 딸기 디저트, 생과·소포장·음료, 라이브 재배 쇼케이스 제안 가능성",
      proposal: "대표 컨펌 후 공식 제안 접수, 대표번호·고객지원센터 통해 담당 부서 연결 재시도",
      interest: "A",
      revenuePotential: "확인필요",
      status: "후속필요",
      approval: "불필요",
      nextAction: "AK플라자 메일 초안 대표 컨펌 후 공식 접수 및 담당 부서 연결 재시도",
      risk: "담당자명은 아직 미확인. 온라인 접수만 완료되면 고객DB 승격 근거가 약해질 수 있어 회신 또는 담당자 확인 필요.",
      note: "2026-05-19 AK플라자 분당점 현장 접촉. 고객지원센터/공식 채널을 통한 온라인 제안 접수 흐름 안내받음. 가격·ROI·생산량·회수기간·외부자료는 미제공.",
      contactAt: new Date(2026, 4, 19, 16, 0),
      contactMethod: "현장방문/접수경로확인",
      contactPurpose: "F&B/푸드홀/디저트 팝업 제안 접수 경로 확인",
      customerResponse: "온라인 제안 접수 또는 대표 채널 접수 안내",
      meetingProposed: "예",
      promotionEvidence: "오프라인접점",
      contactStage: "방문시도",
      assetSignal: "백화점, 상품본부, 푸드홀, F&B 공간",
      budgetSignal: "시즌 디저트, 팝업, 신규 F&B 검토 가능성",
      decisionSignal: "F&B/푸드홀 담당 부서 연결 필요",
      sourceTrust: "현장 접촉 + 공식 고객지원 채널",
      keywords: ["ak플라자", "ak plaza", "분당"]
    },
    {
      customerId: "C-0006",
      companyName: "인터퓨어포스(주)",
      brandName: "INTER PURE POS Co., Ltd.",
      businessNumber: "553-86-03164",
      customerType: "협력사 가능성 + 투자 검토 가능성",
      region: "평택 진위 산업단지",
      product: "AlphaFarm Core / 40ft HC",
      contactName: "Jeong myong seok",
      title: "COO",
      phone: "+82 10 9578 5114",
      email: "jstephanus@naver.com",
      route: "명함/대표전달/나주 수직농장 방문",
      problem: "방문 목적과 관심 방향 추가 확인 필요",
      needs: "환경·설비·수처리 계열 회사 가능성, 시설·공조·환경 협력 가능성 확인",
      proposal: "AlphaFarm Core / 40ft HC 도입 가능성과 공조·환경 협력 가능성을 함께 확인",
      interest: "확인필요",
      revenuePotential: "확인필요",
      status: "후속필요",
      approval: "불필요",
      nextAction: "방문 목적·보유 시설·협력 방향 확인",
      risk: "법인 확인 완료. 업종은 환경·설비·수처리 계열 추정이며 실제 방문 목적, 보유 시설, 협력 방향은 미확인.",
      note: "대표님 추가 확인: 인터퓨어포스(553-86-03164) 법인 확인. 단순 토지 보유 리드보다 시설·공조·환경 협력 가능성도 같이 확인.",
      contactAt: new Date(2026, 4, 22, 9, 30),
      contactMethod: "대표보고/정보확인",
      contactPurpose: "법인·업종·협력 가능성 추가 확인",
      customerResponse: "추가 확인 필요",
      meetingProposed: "아니오",
      promotionEvidence: "연락처확보",
      contactStage: "전화시도",
      assetSignal: "평택 진위 산업단지, 환경·설비·수처리 계열 추정, 시설·공조 협력 가능성",
      budgetSignal: "투자 검토 가능성",
      decisionSignal: "COO 연락처 확보",
      sourceTrust: "법인 확인 + 명함/대표전달",
      keywords: ["인터퓨어포스", "inter pure pos"]
    }
  ];
}

function findCustomerRow_(sheet, customerId, keywords) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;
  var headers = getHeaderMapLocal_(values[0]);
  for (var i = 1; i < values.length; i += 1) {
    var id = String(getCellLocal_(values[i], headers, "고객ID") || "");
    var company = String(getCellLocal_(values[i], headers, "업체명") || "").toLowerCase();
    var brand = String(getCellLocal_(values[i], headers, "법인/브랜드명") || "").toLowerCase();
    if (id === customerId) return i + 1;
    for (var j = 0; j < keywords.length; j += 1) {
      var keyword = String(keywords[j]).toLowerCase();
      if (company.indexOf(keyword) !== -1 || brand.indexOf(keyword) !== -1) return i + 1;
    }
  }
  return null;
}

function appendContactRecord_(sheet, lead) {
  if (!sheet) return;
  upsertContactRecord_(sheet, lead);
}

function upsertCustomerLead_(sheet, lead, keywords) {
  ensureHeadersLocal_(sheet, [
    "고객ID", "등록일", "업체명", "법인/브랜드명", "고객유형", "지역", "제품군",
    "담당자명", "직함", "연락처", "이메일", "접촉경로", "고객문제", "고객니즈",
    "제안방향", "관심가능성", "돈될가능성", "상태", "대표컨펌필요", "마지막접촉일",
    "다음액션", "리스크요약", "DB기록자", "비고", "거래준비도 점수",
    "제품군 확신도", "탈락 사유", "점수 사유"
  ]);

  var customerRow = findCustomerRow_(sheet, lead.customerId, keywords || lead.keywords || [lead.companyName]);
  if (!customerRow) {
    customerRow = sheet.getLastRow() + 1;
    writeByHeaderLocal_(sheet, customerRow, "고객ID", lead.customerId || nextCustomerIdLocal_(sheet));
    writeByHeaderLocal_(sheet, customerRow, "등록일", new Date());
  }

  writeByHeaderLocal_(sheet, customerRow, "업체명", lead.companyName);
  writeByHeaderLocal_(sheet, customerRow, "법인/브랜드명", lead.brandName || "");
  writeByHeaderLocal_(sheet, customerRow, "고객유형", lead.customerType);
  writeByHeaderLocal_(sheet, customerRow, "지역", lead.region);
  writeByHeaderLocal_(sheet, customerRow, "제품군", lead.product);
  writeByHeaderLocal_(sheet, customerRow, "담당자명", lead.contactName);
  writeByHeaderLocal_(sheet, customerRow, "직함", lead.title || "");
  writeByHeaderLocal_(sheet, customerRow, "연락처", lead.phone || "");
  writeByHeaderLocal_(sheet, customerRow, "이메일", lead.email || "");
  writeByHeaderLocal_(sheet, customerRow, "접촉경로", lead.route);
  writeByHeaderLocal_(sheet, customerRow, "고객문제", lead.problem);
  writeByHeaderLocal_(sheet, customerRow, "고객니즈", lead.needs);
  writeByHeaderLocal_(sheet, customerRow, "제안방향", lead.proposal);
  writeByHeaderLocal_(sheet, customerRow, "관심가능성", lead.interest);
  writeByHeaderLocal_(sheet, customerRow, "돈될가능성", lead.revenuePotential);
  writeByHeaderLocal_(sheet, customerRow, "상태", lead.status);
  writeByHeaderLocal_(sheet, customerRow, "대표컨펌필요", lead.approval);
  writeByHeaderLocal_(sheet, customerRow, "마지막접촉일", lead.contactAt || new Date());
  writeByHeaderLocal_(sheet, customerRow, "다음액션", lead.nextAction);
  writeByHeaderLocal_(sheet, customerRow, "리스크요약", lead.risk);
  writeByHeaderLocal_(sheet, customerRow, "DB기록자", "Codex");
  writeByHeaderLocal_(sheet, customerRow, "비고", lead.note);

  var quality = LeadQuality.scoreLead({
    product: lead.product,
    companyName: lead.companyName,
    customerType: lead.customerType,
    region: lead.region,
    source: [lead.route, lead.sourceTrust].join(" "),
    contactChannel: [lead.phone, lead.email, lead.route].join(" "),
    decisionSignal: [lead.decisionSignal, lead.contactName, lead.title].join(" "),
    assetSignal: lead.assetSignal,
    budgetSignal: lead.budgetSignal,
    urgentNeed: [lead.needs, lead.nextAction].join(" "),
    notes: lead.note
  });
  writeByHeaderLocal_(sheet, customerRow, "거래준비도 점수", quality.readinessScore);
  writeByHeaderLocal_(sheet, customerRow, "제품군 확신도", quality.productConfidence);
  writeByHeaderLocal_(sheet, customerRow, "탈락 사유", quality.holdReason);
  writeByHeaderLocal_(sheet, customerRow, "점수 사유", quality.scoreReason);

  return customerRow;
}

function upsertContactRecord_(sheet, lead) {
  if (!sheet) return;
  ensureHeadersLocal_(sheet, CONTACT_RECORD_HEADERS_);
  var existingRow = findContactRow_(sheet, lead);
  var targetRow = existingRow || sheet.getLastRow() + 1;
  if (!existingRow) writeByHeaderLocal_(sheet, targetRow, "접촉ID", nextIdLocal_(sheet, "CT"));
  writeByHeaderLocal_(sheet, targetRow, "고객ID", lead.customerId || "");
  writeByHeaderLocal_(sheet, targetRow, "접촉일시", lead.contactAt || new Date());
  writeByHeaderLocal_(sheet, targetRow, "업체명", lead.companyName);
  writeByHeaderLocal_(sheet, targetRow, "접촉방식", lead.contactMethod || "대표보고/정보확인");
  writeByHeaderLocal_(sheet, targetRow, "담당자", lead.contactName);
  writeByHeaderLocal_(sheet, targetRow, "제품군", lead.product);
  writeByHeaderLocal_(sheet, targetRow, "접촉목적", lead.contactPurpose || "후속 확인");
  writeByHeaderLocal_(sheet, targetRow, "고객반응", lead.customerResponse || "추가 확인 필요");
  writeByHeaderLocal_(sheet, targetRow, "핵심메모", lead.note);
  writeByHeaderLocal_(sheet, targetRow, "자료요청여부", "아니오");
  writeByHeaderLocal_(sheet, targetRow, "미팅제안여부", lead.meetingProposed || "아니오");
  writeByHeaderLocal_(sheet, targetRow, "다음액션", lead.nextAction);
  writeByHeaderLocal_(sheet, targetRow, "상태업데이트", lead.status);
  writeByHeaderLocal_(sheet, targetRow, "기록자", "Codex");
}

function findContactRow_(sheet, lead) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;
  var headers = getHeaderMapLocal_(values[0]);
  var expectedDate = formatContactDateKey_(lead.contactAt || new Date());
  var expectedMethod = String(lead.contactMethod || "대표보고/정보확인");
  var companyKeywords = lead.keywords || [lead.companyName];
  for (var i = 1; i < values.length; i += 1) {
    var row = values[i];
    var company = String(getCellLocal_(row, headers, "업체명") || "").toLowerCase();
    var method = String(getCellLocal_(row, headers, "접촉방식") || "");
    var date = formatContactDateKey_(getCellLocal_(row, headers, "접촉일시"));
    if (date !== expectedDate || method !== expectedMethod) continue;
    for (var j = 0; j < companyKeywords.length; j += 1) {
      var keyword = String(companyKeywords[j] || "").toLowerCase();
      if (keyword && company.indexOf(keyword) !== -1) return i + 1;
    }
  }
  return null;
}

function updateWebAndTargetStatus_(ss, lead) {
  [
    { name: "12_웹크롤링DB", productHeader: "제품군", companyHeader: "업체명" },
    { name: "08_타깃리스트", productHeader: "우선제품", companyHeader: "업체명" }
  ].forEach(function (target) {
    var sheet = ss.getSheetByName(target.name);
    if (!sheet) return;
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return;
    var headers = getHeaderMapLocal_(values[0]);
    for (var i = 1; i < values.length; i += 1) {
      if (!matchesCompanyKeywords_(values[i], headers, target.companyHeader, lead.keywords || [lead.companyName])) continue;
      writeByHeaderLocal_(sheet, i + 1, "접촉단계", lead.contactStage || lead.status);
      writeByHeaderLocal_(sheet, i + 1, "고객DB승격근거", lead.promotionEvidence || "오프라인접점");
      writeByHeaderLocal_(sheet, i + 1, "고객DB승격가능", "Y");
      writeByHeaderLocal_(sheet, i + 1, "승격사유", lead.promotionEvidence || "오프라인접점");
      writeByHeaderLocal_(sheet, i + 1, "승격차단사유", "");
      writeByHeaderLocal_(sheet, i + 1, "다음액션", lead.nextAction);
      writeByHeaderLocal_(sheet, i + 1, "타깃리스트반영", "Y");
      writeByHeaderLocal_(sheet, i + 1, target.productHeader, lead.product);
      return;
    }
  });
}

function matchesCompanyKeywords_(row, headers, companyHeader, keywords) {
  var company = String(getCellLocal_(row, headers, companyHeader) || "").toLowerCase();
  return (keywords || []).some(function (keyword) {
    keyword = String(keyword || "").toLowerCase();
    return keyword && company.indexOf(keyword) !== -1;
  });
}

function formatContactDateKey_(date) {
  if (!date) return "";
  var parsed = date instanceof Date ? date : new Date(date);
  if (isNaN(parsed.getTime())) return String(date);
  return Utilities.formatDate(parsed, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
}

function getOrCreateSheetWithHeadersLocal_(ss, name, headers) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  ensureHeadersLocal_(sheet, headers);
  return sheet;
}

function ensureHeadersLocal_(sheet, headers) {
  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  var existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(String);
  var map = getHeaderMapLocal_(existing);
  var changed = false;
  headers.forEach(function (header) {
    if (map[header] === undefined) {
      existing.push(header);
      map[header] = existing.length - 1;
      changed = true;
    }
  });
  if (changed || sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, existing.length).setValues([existing]);
    sheet.setFrozenRows(1);
  }
}

function readByHeaderLocal_(sheet, row, header) {
  var lastColumn = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var map = getHeaderMapLocal_(headers);
  return map[header] === undefined ? "" : sheet.getRange(row, map[header] + 1).getValue();
}

function nextCustomerIdLocal_(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return "C-0001";
  var headers = getHeaderMapLocal_(values[0]);
  var maxId = 0;
  for (var i = 1; i < values.length; i += 1) {
    var id = String(getCellLocal_(values[i], headers, "고객ID") || "");
    var match = id.match(/^C-(\d+)$/);
    if (match) maxId = Math.max(maxId, Number(match[1]));
  }
  return "C-" + ("0000" + (maxId + 1)).slice(-4);
}

function updatePipeline_(sheet, lead) {
  if (!sheet) return;
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return;
  var headers = getHeaderMapLocal_(values[0]);
  for (var i = 1; i < values.length; i += 1) {
    var id = String(getCellLocal_(values[i], headers, "고객ID") || "");
    var company = String(getCellLocal_(values[i], headers, "업체명") || "").toLowerCase();
    if (id === lead.customerId || company.indexOf("inter pure pos") !== -1 || company.indexOf("인터퓨어포스") !== -1) {
      writeByHeaderLocal_(sheet, i + 1, "업체명", lead.companyName);
      writeByHeaderLocal_(sheet, i + 1, "제품군", lead.product);
      writeByHeaderLocal_(sheet, i + 1, "기회명", "시설·공조·환경 협력 및 AlphaFarm/40ft 가능성 확인");
      writeByHeaderLocal_(sheet, i + 1, "단계", "후속필요");
      writeByHeaderLocal_(sheet, i + 1, "현재장애물", "방문 목적·보유 시설·협력 방향 미확인");
      writeByHeaderLocal_(sheet, i + 1, "대표컨펌필요", "불필요");
      writeByHeaderLocal_(sheet, i + 1, "다음액션", lead.nextAction);
      writeByHeaderLocal_(sheet, i + 1, "담당자", "강호수");
      writeByHeaderLocal_(sheet, i + 1, "비고", lead.note);
      return;
    }
  }
}

function writeByHeaderLocal_(sheet, row, header, value) {
  var lastColumn = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var map = getHeaderMapLocal_(headers);
  if (map[header] === undefined) {
    sheet.getRange(1, lastColumn + 1).setValue(header);
    map[header] = lastColumn;
  }
  sheet.getRange(row, map[header] + 1).setValue(value);
}

function getHeaderMapLocal_(headers) {
  var map = {};
  headers.forEach(function (header, index) {
    if (header !== "" && header !== null && header !== undefined) map[String(header)] = index;
  });
  return map;
}

function getCellLocal_(row, map, header) {
  return map[header] === undefined ? "" : row[map[header]];
}

function setCellLocal_(row, map, header, value) {
  if (map[header] !== undefined) row[map[header]] = value;
}

function nextIdLocal_(sheet, prefix) {
  return prefix + "-" + ("0000" + Math.max(sheet.getLastRow(), 1)).slice(-4);
}
