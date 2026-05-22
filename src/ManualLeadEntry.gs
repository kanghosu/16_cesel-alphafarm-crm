function upsertInterPurePosLead() {
  var ss = CrmConfig.getSpreadsheet();
  LeadQualityRunner.setupLeadQualityCrm();

  var customerSheet = ss.getSheetByName("01_고객DB");
  var contactSheet = ss.getSheetByName("02_접촉기록");
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
    note: "대표님 추가 확인: 인터퓨어포스(553-86-03164) 법인 확인. 단순 토지 보유 리드보다 시설·공조·환경 협력 가능성도 같이 확인."
  };

  var customerRow = findCustomerRow_(customerSheet, lead.customerId, ["인터퓨어포스", "inter pure pos"]);
  if (!customerRow) {
    customerRow = customerSheet.getLastRow() + 1;
    writeByHeaderLocal_(customerSheet, customerRow, "고객ID", lead.customerId);
    writeByHeaderLocal_(customerSheet, customerRow, "등록일", new Date());
  }

  writeByHeaderLocal_(customerSheet, customerRow, "업체명", lead.companyName);
  writeByHeaderLocal_(customerSheet, customerRow, "법인/브랜드명", lead.brandName);
  writeByHeaderLocal_(customerSheet, customerRow, "고객유형", lead.customerType);
  writeByHeaderLocal_(customerSheet, customerRow, "지역", lead.region);
  writeByHeaderLocal_(customerSheet, customerRow, "제품군", lead.product);
  writeByHeaderLocal_(customerSheet, customerRow, "담당자명", lead.contactName);
  writeByHeaderLocal_(customerSheet, customerRow, "직함", lead.title);
  writeByHeaderLocal_(customerSheet, customerRow, "연락처", lead.phone);
  writeByHeaderLocal_(customerSheet, customerRow, "이메일", lead.email);
  writeByHeaderLocal_(customerSheet, customerRow, "접촉경로", lead.route);
  writeByHeaderLocal_(customerSheet, customerRow, "고객문제", lead.problem);
  writeByHeaderLocal_(customerSheet, customerRow, "고객니즈", lead.needs);
  writeByHeaderLocal_(customerSheet, customerRow, "제안방향", lead.proposal);
  writeByHeaderLocal_(customerSheet, customerRow, "관심가능성", lead.interest);
  writeByHeaderLocal_(customerSheet, customerRow, "돈될가능성", lead.revenuePotential);
  writeByHeaderLocal_(customerSheet, customerRow, "상태", lead.status);
  writeByHeaderLocal_(customerSheet, customerRow, "대표컨펌필요", lead.approval);
  writeByHeaderLocal_(customerSheet, customerRow, "다음액션", lead.nextAction);
  writeByHeaderLocal_(customerSheet, customerRow, "리스크요약", lead.risk);
  writeByHeaderLocal_(customerSheet, customerRow, "DB기록자", "Codex");
  writeByHeaderLocal_(customerSheet, customerRow, "비고", lead.note);

  var quality = LeadQuality.scoreLead({
    product: lead.product,
    companyName: lead.companyName,
    customerType: lead.customerType,
    region: lead.region,
    source: lead.route + " 법인 확인",
    contactChannel: lead.phone + " " + lead.email,
    decisionSignal: lead.contactName + " " + lead.title,
    assetSignal: "평택 진위 산업단지, 환경·설비·수처리 계열 추정, 시설·공조 협력 가능성",
    budgetSignal: "투자 검토 가능성",
    urgentNeed: "방문 목적·보유 시설·협력 방향 확인",
    notes: lead.note
  });
  writeByHeaderLocal_(customerSheet, customerRow, "거래준비도 점수", quality.readinessScore);
  writeByHeaderLocal_(customerSheet, customerRow, "제품군 확신도", quality.productConfidence);
  writeByHeaderLocal_(customerSheet, customerRow, "탈락 사유", quality.holdReason);
  writeByHeaderLocal_(customerSheet, customerRow, "점수 사유", quality.scoreReason);

  appendContactRecord_(contactSheet, lead);
  updatePipeline_(pipelineSheet, lead);

  return "인터퓨어포스 DB 업데이트 완료: " + lead.customerId + " / " + lead.status;
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
  var row = new Array(sheet.getLastColumn()).fill("");
  var headers = getHeaderMapLocal_(sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]);
  setCellLocal_(row, headers, "접촉ID", nextIdLocal_(sheet, "CT"));
  setCellLocal_(row, headers, "고객ID", lead.customerId);
  setCellLocal_(row, headers, "접촉일시", new Date());
  setCellLocal_(row, headers, "업체명", lead.companyName);
  setCellLocal_(row, headers, "접촉방식", "대표보고/정보확인");
  setCellLocal_(row, headers, "담당자", lead.contactName);
  setCellLocal_(row, headers, "제품군", lead.product);
  setCellLocal_(row, headers, "접촉목적", "법인·업종·협력 가능성 추가 확인");
  setCellLocal_(row, headers, "고객반응", "추가 확인 필요");
  setCellLocal_(row, headers, "핵심메모", lead.note);
  setCellLocal_(row, headers, "자료요청여부", "아니오");
  setCellLocal_(row, headers, "미팅제안여부", "아니오");
  setCellLocal_(row, headers, "다음액션", lead.nextAction);
  setCellLocal_(row, headers, "상태업데이트", lead.status);
  setCellLocal_(row, headers, "기록자", "Codex");
  sheet.appendRow(row);
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
