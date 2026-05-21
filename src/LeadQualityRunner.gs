var LeadQualityRunner = (function () {
  var TARGET_SHEET = "08_타깃리스트";
  var CUSTOMER_SHEET = "01_고객DB";
  var QUALITY_HEADERS = [
    "시설/자산 단서",
    "예산/투자 단서",
    "의사결정자 단서",
    "탈락질문 결과",
    "거래준비도 점수",
    "점수 사유",
    "A/B/C 등급"
  ];
  var CUSTOMER_QUALITY_HEADERS = [
    "거래준비도 점수",
    "제품군 확신도",
    "탈락 사유",
    "점수 사유"
  ];

  function setupLeadQualityCrm() {
    var ss = CrmConfig.getSpreadsheet();
    var target = getOrCreateSheet_(ss, TARGET_SHEET);
    var customer = getOrCreateSheet_(ss, CUSTOMER_SHEET);

    ensureHeaders_(target, [
      "타깃ID", "업체명", "고객유형", "지역", "우선제품", "담당자", "연락처", "이메일",
      "출처", "우선순위", "접촉예정일", "접촉상태", "메모"
    ].concat(QUALITY_HEADERS));

    ensureHeaders_(customer, [
      "고객ID", "등록일", "업체명", "법인/브랜드명", "고객유형", "지역", "제품군",
      "담당자명", "직함", "연락처", "이메일", "접촉경로", "소개자", "고객문제",
      "고객니즈", "제안방향", "관심가능성", "돈될가능성", "상태", "대표컨펌필요",
      "외부발송자료", "자료승인상태", "마지막접촉일", "다음액션", "다음액션일",
      "리스크요약", "DB기록자", "비고"
    ].concat(CUSTOMER_QUALITY_HEADERS));

    return "Lead quality CRM setup complete";
  }

  function scoreTargetList() {
    var sheet = CrmConfig.getSpreadsheet().getSheetByName(TARGET_SHEET);
    if (!sheet) throw new Error(TARGET_SHEET + " sheet not found");
    ensureHeaders_(sheet, QUALITY_HEADERS);

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return 0;

    var headerMap = getHeaderMap_(values[0]);
    var updates = [];
    for (var rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
      var row = values[rowIndex];
      if (!row[headerMap["업체명"]]) continue;
      var result = LeadQuality.scoreLead(rowToLead_(row, headerMap));
      updates.push({
        row: rowIndex + 1,
        result: result
      });
    }

    updates.forEach(function (item) {
      writeByHeader_(sheet, item.row, "거래준비도 점수", item.result.readinessScore);
      writeByHeader_(sheet, item.row, "점수 사유", item.result.scoreReason);
      writeByHeader_(sheet, item.row, "A/B/C 등급", item.result.grade);
      writeByHeader_(sheet, item.row, "탈락질문 결과", item.result.disqualificationResult);
    });

    return updates.length;
  }

  function promoteQualifiedTargets() {
    var ss = CrmConfig.getSpreadsheet();
    var target = ss.getSheetByName(TARGET_SHEET);
    var customer = ss.getSheetByName(CUSTOMER_SHEET);
    if (!target || !customer) throw new Error("Required sheets are missing. Run initial setup first.");

    var targetValues = target.getDataRange().getValues();
    if (targetValues.length < 2) return 0;

    var targetMap = getHeaderMap_(targetValues[0]);
    var customerValues = customer.getDataRange().getValues();
    var customerMap = getHeaderMap_(customerValues[0]);
    var existingNames = {};
    for (var i = 1; i < customerValues.length; i += 1) {
      var existingName = getCell_(customerValues[i], customerMap, "업체명");
      if (existingName) existingNames[normalizeKey_(existingName)] = true;
    }

    var promoted = 0;
    for (var rowIndex = 1; rowIndex < targetValues.length; rowIndex += 1) {
      var targetRow = targetValues[rowIndex];
      var companyName = getCell_(targetRow, targetMap, "업체명");
      var grade = getCell_(targetRow, targetMap, "A/B/C 등급");
      if (!companyName || existingNames[normalizeKey_(companyName)] || (grade !== "A" && grade !== "B")) {
        continue;
      }

      var lead = rowToLead_(targetRow, targetMap);
      var result = LeadQuality.scoreLead(lead);
      var row = new Array(customerValues[0].length).fill("");
      setCell_(row, customerMap, "고객ID", nextCustomerId_(customer));
      setCell_(row, customerMap, "등록일", new Date());
      setCell_(row, customerMap, "업체명", companyName);
      setCell_(row, customerMap, "고객유형", getCell_(targetRow, targetMap, "고객유형"));
      setCell_(row, customerMap, "지역", getCell_(targetRow, targetMap, "지역"));
      setCell_(row, customerMap, "제품군", getCell_(targetRow, targetMap, "우선제품"));
      setCell_(row, customerMap, "담당자명", getCell_(targetRow, targetMap, "담당자"));
      setCell_(row, customerMap, "연락처", getCell_(targetRow, targetMap, "연락처"));
      setCell_(row, customerMap, "이메일", getCell_(targetRow, targetMap, "이메일"));
      setCell_(row, customerMap, "접촉경로", getCell_(targetRow, targetMap, "출처"));
      setCell_(row, customerMap, "관심가능성", grade);
      setCell_(row, customerMap, "돈될가능성", result.grade);
      setCell_(row, customerMap, "상태", "미접촉");
      setCell_(row, customerMap, "대표컨펌필요", result.approvalRequired === "Y" ? "필요" : "불필요");
      setCell_(row, customerMap, "다음액션", "1차 전화/메일로 니즈 확인");
      setCell_(row, customerMap, "리스크요약", result.holdReason);
      setCell_(row, customerMap, "비고", getCell_(targetRow, targetMap, "메모"));
      setCell_(row, customerMap, "거래준비도 점수", result.readinessScore);
      setCell_(row, customerMap, "제품군 확신도", result.productConfidence);
      setCell_(row, customerMap, "탈락 사유", result.holdReason);
      setCell_(row, customerMap, "점수 사유", result.scoreReason);
      customer.appendRow(row);
      existingNames[normalizeKey_(companyName)] = true;
      promoted += 1;
    }
    return promoted;
  }

  function rowToLead_(row, headerMap) {
    return {
      product: getCell_(row, headerMap, "우선제품") || getCell_(row, headerMap, "제품군"),
      companyName: getCell_(row, headerMap, "업체명"),
      customerType: getCell_(row, headerMap, "고객유형"),
      region: getCell_(row, headerMap, "지역"),
      source: getCell_(row, headerMap, "출처") || getCell_(row, headerMap, "공식 출처"),
      contactChannel: [
        getCell_(row, headerMap, "연락처"),
        getCell_(row, headerMap, "이메일"),
        getCell_(row, headerMap, "공식 연락채널")
      ].join(" "),
      decisionSignal: getCell_(row, headerMap, "의사결정자 단서") || getCell_(row, headerMap, "담당자"),
      assetSignal: getCell_(row, headerMap, "시설/자산 단서"),
      budgetSignal: getCell_(row, headerMap, "예산/투자 단서"),
      urgentNeed: getCell_(row, headerMap, "메모"),
      notes: [
        getCell_(row, headerMap, "메모"),
        getCell_(row, headerMap, "탈락질문 결과")
      ].join(" ")
    };
  }

  function getOrCreateSheet_(ss, name) {
    return ss.getSheetByName(name) || ss.insertSheet(name);
  }

  function ensureHeaders_(sheet, headers) {
    var lastColumn = Math.max(sheet.getLastColumn(), 1);
    var existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(String);
    var existingMap = getHeaderMap_(existing);
    var changed = false;
    headers.forEach(function (header) {
      if (existingMap[header] === undefined) {
        existing.push(header);
        existingMap[header] = existing.length - 1;
        changed = true;
      }
    });
    if (changed || sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, existing.length).setValues([existing]);
      sheet.setFrozenRows(1);
    }
  }

  function getHeaderMap_(headers) {
    var map = {};
    headers.forEach(function (header, index) {
      if (header !== "" && header !== null && header !== undefined) map[String(header)] = index;
    });
    return map;
  }

  function writeByHeader_(sheet, row, header, value) {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headerMap = getHeaderMap_(headers);
    if (headerMap[header] === undefined) {
      ensureHeaders_(sheet, [header]);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      headerMap = getHeaderMap_(headers);
    }
    sheet.getRange(row, headerMap[header] + 1).setValue(value);
  }

  function getCell_(row, headerMap, header) {
    var index = headerMap[header];
    return index === undefined ? "" : row[index];
  }

  function setCell_(row, headerMap, header, value) {
    var index = headerMap[header];
    if (index !== undefined) row[index] = value;
  }

  function nextCustomerId_(sheet) {
    var lastRow = sheet.getLastRow();
    var nextNumber = Math.max(lastRow, 1);
    return "C-" + ("0000" + nextNumber).slice(-4);
  }

  function normalizeKey_(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  return {
    setupLeadQualityCrm: setupLeadQualityCrm,
    scoreTargetList: scoreTargetList,
    promoteQualifiedTargets: promoteQualifiedTargets
  };
})();
