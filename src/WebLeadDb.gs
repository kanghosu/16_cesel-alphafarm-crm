var WebLeadDb = (function () {
  var WEB_SHEET = "12_웹크롤링DB";
  var TARGET_SHEET = "08_타깃리스트";
  var WEB_HEADERS = [
    "수집ID",
    "수집일",
    "수집채널",
    "검색쿼리",
    "제품군",
    "업체명",
    "지역",
    "고객유형",
    "웹출처URL",
    "공개 출처",
    "출처 신뢰도",
    "공식 연락채널",
    "담당자",
    "시설/자산 단서",
    "예산/투자 단서",
    "의사결정자 단서",
    "추정 니즈",
    "첫 접촉 포인트",
    "크롤링메모",
    "거래준비도 점수",
    "제품군 확신도",
    "A/B/C 등급",
    "점수 사유",
    "검증상태",
    "고객DB승격가능",
    "승격차단사유",
    "타깃리스트반영",
    "다음액션"
  ];

  var TARGET_HEADERS = [
    "타깃ID",
    "업체명",
    "고객유형",
    "지역",
    "우선제품",
    "담당자",
    "연락처",
    "이메일",
    "출처",
    "우선순위",
    "접촉예정일",
    "접촉상태",
    "메모",
    "시설/자산 단서",
    "예산/투자 단서",
    "의사결정자 단서",
    "탈락질문 결과",
    "거래준비도 점수",
    "점수 사유",
    "A/B/C 등급",
    "검증상태",
    "고객DB승격가능",
    "승격차단사유",
    "승격사유"
  ];

  var RESEARCH_SEED_ROWS = [
    {
      product: "AlphaCafe",
      company: "AK플라자 분당 / 상품본부",
      region: "성남 분당 서현",
      type: "백화점 상품본부·F&B",
      contact: "1661-1114 / F&B팀 공개 채널",
      source: "공식 홈페이지 / 조직현황",
      asset: "백화점, 상품본부, 푸드홀, F&B팀",
      budget: "시즌 디저트, 팝업, 신규 F&B 검토 가능성",
      decision: "Food팀·F&B팀 공개",
      needs: "푸드홀 신규 디저트, 여름철 딸기 수급, 팝업 검토",
      point: "분당권 푸드홀에서 프리미엄 딸기 디저트 제안"
    },
    {
      product: "Alpha Experience Portfolio",
      company: "현대백화점 판교점",
      region: "성남 판교",
      type: "백화점·프리미엄 리테일 공간",
      contact: "1588-3650 / 고객상담실",
      source: "공식 홈페이지 / 공식 블로그",
      asset: "백화점, 라운지, 문화홀, 디저트 팝업 공간",
      budget: "팝업, 공간 차별화, 프리미엄 F&B 기획",
      decision: "고객상담실 경유 식품·공간 제휴 담당 연결 필요",
      needs: "라이브 설치형 팝업, 고객 체류시간, SNS 확산",
      point: "공간 차별화형 팝업/라이브 설치 제안"
    },
    {
      product: "Alpha Experience Portfolio",
      company: "GRAVITY JOSUN 서울 판교",
      region: "성남 판교",
      type: "호텔·라이프스타일 호텔",
      contact: "031-539-4800 / reservation 공개",
      source: "공식 홈페이지",
      asset: "호텔, 레스토랑·바, 미팅 스페이스, 판교역 인접",
      budget: "프리미엄 호텔 공간 차별화 검토 가능성",
      decision: "세일즈 또는 식음 담당자 연결 필요",
      needs: "공용부·레스토랑 인접 공간 차별화, 체험 요소",
      point: "판교 고객에게 보이는 라이브 설치형 딸기 경험 제안"
    },
    {
      product: "Alpha Experience Portfolio",
      company: "더블트리 바이 힐튼 서울 판교",
      region: "성남 판교",
      type: "호텔·MICE",
      contact: "공식 대표 채널 확인 필요",
      source: "공식 홈페이지 / 호텔 정보",
      asset: "호텔, 베이커리 카페, 루프톱 레스토랑, MICE 시설",
      budget: "기업행사·시즌 F&B 차별화 가능성",
      decision: "행사 또는 식음 관련 담당자 연결 필요",
      needs: "로비/라운지 체험형 설치, 기업행사용 스토리텔링",
      point: "공간 차별화와 프리미엄 딸기 경험 제안"
    },
    {
      product: "AlphaCafe",
      company: "코트야드 메리어트 서울 판교 MoMo Cafe",
      region: "성남 판교",
      type: "호텔 레스토랑·이벤트",
      contact: "031-8060-2150 / 이벤트 이메일 공개",
      source: "공식 홈페이지",
      asset: "호텔 F&B, 뷔페/바, 이벤트 채널",
      budget: "호텔 디저트/브런치 시즌 파일럿 가능성",
      decision: "MoMo Cafe 또는 이벤트 담당 연결 필요",
      needs: "여름철 딸기 수급 대안, 호텔 디저트 파일럿",
      point: "베이커리·뷔페용 프리미엄 죽향 파일럿 검증"
    },
    {
      product: "AlphaFarm Core",
      company: "오아시스",
      region: "성남 중원",
      type: "친환경 신선식품 유통사",
      contact: "1577-0098 / oasis@oasis.co.kr",
      source: "공식 홈페이지 / 기업 정보",
      asset: "성남본사, 법인, 신선식품 유통",
      budget: "계약재배·직거래·프리미엄 신선식품 검토",
      decision: "신선식품/제휴 담당 연결 필요",
      needs: "안정공급, 브랜드 차별화, 프리미엄 딸기 SKU",
      point: "실내 안정생산형 프리미엄 죽향 제안"
    },
    {
      product: "40ft HC ContainerFarm",
      company: "성남시농업기술센터",
      region: "성남",
      type: "농업기술센터·실증기관",
      contact: "031-729-4326",
      source: "공식 센터 안내",
      asset: "공공 농업기관, 교육·실증 성격",
      budget: "파일럿, 교육용, 도심형 실증",
      decision: "도시농업·스마트농업 담당 연결 필요",
      needs: "죽향 딸기 컨테이너형 파일럿 실증",
      point: "스마트농업 실증 담당자 확인"
    },
    {
      product: "40ft HC ContainerFarm",
      company: "용인시농업기술센터",
      region: "용인",
      type: "농업기술센터·교육기관",
      contact: "031-6193-1001 / 원예기술팀",
      source: "용인시 공식 조직도",
      asset: "스마트농업 테스트베드 교육장, 원예기술팀",
      budget: "교육·시범사업·재배기술 검증형 파일럿",
      decision: "원예기술팀 또는 스마트농업 담당 연결 필요",
      needs: "저온·저습·공조형 테스트베드 검토",
      point: "죽향 특화 테스트베드 검토"
    },
    {
      product: "AlphaCafe",
      company: "갤러리아 광교",
      region: "수원 광교",
      type: "프리미엄 백화점",
      contact: "031-5174-6228 / 바이어 공개 채널",
      source: "공식 홈페이지 / 백화점 정보",
      asset: "프리미엄 백화점, B1 DELI & DESSERT",
      budget: "프리미엄 딸기 판매, 디저트 협업, 라이브 쇼케이스",
      decision: "델리·농산 담당 바이어 연결 필요",
      needs: "식품관/팝업 공간 연계 제안",
      point: "프리미엄 딸기 판매+디저트 협업"
    },
    {
      product: "AlphaFarm Core",
      company: "CJ프레시웨이",
      region: "서울 마포",
      type: "식자재 유통·푸드서비스 기업",
      contact: "02-2149-6114 / cjfreshway@cj.net",
      source: "공식 홈페이지",
      asset: "본사, 식자재 유통, 전국 유통 인프라",
      budget: "신상품 납품 상담, 프리미엄 B2B 유통",
      decision: "식자재 구매/신상품 납품 담당 연결 필요",
      needs: "프리미엄 딸기 B2B 유통, 호텔/카페 고객사 연계",
      point: "죽향 안정생산 기반 프리미엄 식자재 제안"
    }
  ];

  function setupWebLeadDb() {
    var sheet = getOrCreateSheet_(CrmConfig.getSpreadsheet(), WEB_SHEET);
    ensureHeaders_(sheet, WEB_HEADERS);
    return WEB_SHEET + " setup complete";
  }

  function scoreWebLeadDb() {
    var ss = CrmConfig.getSpreadsheet();
    var sheet = getOrCreateSheet_(ss, WEB_SHEET);
    ensureHeaders_(sheet, WEB_HEADERS);

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return 0;

    var headerMap = getHeaderMap_(values[0]);
    var count = 0;
    for (var rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
      var row = values[rowIndex];
      if (!getCell_(row, headerMap, "업체명")) continue;

      var result = LeadQuality.scoreLead(rowToLead_(row, headerMap));
      var gate = CustomerDbGate.evaluate(rowToPromotionLead_(row, headerMap, result.grade));
      var rowNumber = rowIndex + 1;

      if (!getCell_(row, headerMap, "검증상태")) writeByHeader_(sheet, rowNumber, "검증상태", "미검증");
      writeByHeader_(sheet, rowNumber, "거래준비도 점수", result.readinessScore);
      writeByHeader_(sheet, rowNumber, "제품군 확신도", result.productConfidence);
      writeByHeader_(sheet, rowNumber, "A/B/C 등급", result.grade);
      writeByHeader_(sheet, rowNumber, "점수 사유", result.scoreReason);
      writeByHeader_(sheet, rowNumber, "고객DB승격가능", gate.allowed);
      writeByHeader_(sheet, rowNumber, "승격차단사유", gate.blockReason);
      if (!getCell_(row, headerMap, "다음액션")) {
        writeByHeader_(sheet, rowNumber, "다음액션", "공식 채널/담당자 확인 후 타깃리스트 반영 여부 결정");
      }
      count += 1;
    }
    return count;
  }

  function seedResearchBriefWebLeads() {
    var sheet = getOrCreateSheet_(CrmConfig.getSpreadsheet(), WEB_SHEET);
    ensureHeaders_(sheet, WEB_HEADERS);
    var values = sheet.getDataRange().getValues();
    var headerMap = getHeaderMap_(values[0]);
    var existing = {};
    for (var i = 1; i < values.length; i += 1) {
      var name = getCell_(values[i], headerMap, "업체명");
      if (name) existing[normalizeKey_(name)] = true;
    }

    var added = 0;
    RESEARCH_SEED_ROWS.forEach(function (item) {
      if (existing[normalizeKey_(item.company)]) return;
      var row = new Array(values[0].length).fill("");
      setCell_(row, headerMap, "수집ID", nextWebLeadId_(sheet));
      setCell_(row, headerMap, "수집일", new Date());
      setCell_(row, headerMap, "수집채널", "리서치브리프");
      setCell_(row, headerMap, "검색쿼리", "deep-research-report (9)/(10)");
      setCell_(row, headerMap, "제품군", item.product);
      setCell_(row, headerMap, "업체명", item.company);
      setCell_(row, headerMap, "지역", item.region);
      setCell_(row, headerMap, "고객유형", item.type);
      setCell_(row, headerMap, "공개 출처", item.source);
      setCell_(row, headerMap, "출처 신뢰도", "공식/리서치 확인");
      setCell_(row, headerMap, "공식 연락채널", item.contact);
      setCell_(row, headerMap, "시설/자산 단서", item.asset);
      setCell_(row, headerMap, "예산/투자 단서", item.budget);
      setCell_(row, headerMap, "의사결정자 단서", item.decision);
      setCell_(row, headerMap, "추정 니즈", item.needs);
      setCell_(row, headerMap, "첫 접촉 포인트", item.point);
      setCell_(row, headerMap, "크롤링메모", "첨부 리서치 브리프 기반 후보. 고객DB 직접 입력 금지.");
      setCell_(row, headerMap, "검증상태", "미검증");
      setCell_(row, headerMap, "고객DB승격가능", "N");
      setCell_(row, headerMap, "승격차단사유", "웹/리서치 후보는 회신, 오프라인 접점, 연락처 확보 전까지 고객DB 승격 금지");
      setCell_(row, headerMap, "타깃리스트반영", "");
      setCell_(row, headerMap, "다음액션", "공식 채널 확인 후 전화/메일 후보로 선별");
      sheet.appendRow(row);
      existing[normalizeKey_(item.company)] = true;
      added += 1;
    });
    scoreWebLeadDb();
    return added;
  }

  function promoteSelectedWebLeadsToTargetList() {
    LeadQualityRunner.setupLeadQualityCrm();
    setupWebLeadDb();

    var ss = CrmConfig.getSpreadsheet();
    var web = ss.getSheetByName(WEB_SHEET);
    var target = getOrCreateSheet_(ss, TARGET_SHEET);
    ensureHeaders_(target, TARGET_HEADERS);

    var webValues = web.getDataRange().getValues();
    if (webValues.length < 2) return 0;
    var webMap = getHeaderMap_(webValues[0]);
    var targetValues = target.getDataRange().getValues();
    var targetMap = getHeaderMap_(targetValues[0]);
    var existing = {};
    for (var i = 1; i < targetValues.length; i += 1) {
      var existingName = getCell_(targetValues[i], targetMap, "업체명");
      if (existingName) existing[normalizeKey_(existingName)] = true;
    }

    var moved = 0;
    for (var rowIndex = 1; rowIndex < webValues.length; rowIndex += 1) {
      var webRow = webValues[rowIndex];
      var marker = normalizeText_(getCell_(webRow, webMap, "타깃리스트반영"));
      var company = getCell_(webRow, webMap, "업체명");
      if (!company || existing[normalizeKey_(company)] || (marker !== "y" && marker !== "yes" && marker !== "예")) {
        continue;
      }

      var row = new Array(targetValues[0].length).fill("");
      setCell_(row, targetMap, "타깃ID", nextTargetId_(target));
      setCell_(row, targetMap, "업체명", company);
      setCell_(row, targetMap, "고객유형", getCell_(webRow, webMap, "고객유형"));
      setCell_(row, targetMap, "지역", getCell_(webRow, webMap, "지역"));
      setCell_(row, targetMap, "우선제품", getCell_(webRow, webMap, "제품군"));
      setCell_(row, targetMap, "담당자", getCell_(webRow, webMap, "담당자"));
      setCell_(row, targetMap, "연락처", getCell_(webRow, webMap, "공식 연락채널"));
      setCell_(row, targetMap, "출처", [
        getCell_(webRow, webMap, "공개 출처"),
        getCell_(webRow, webMap, "웹출처URL")
      ].join(" ").trim());
      setCell_(row, targetMap, "우선순위", getCell_(webRow, webMap, "A/B/C 등급"));
      setCell_(row, targetMap, "접촉상태", "미접촉");
      setCell_(row, targetMap, "메모", [
        getCell_(webRow, webMap, "첫 접촉 포인트"),
        getCell_(webRow, webMap, "크롤링메모")
      ].join(" / ").trim());
      setCell_(row, targetMap, "시설/자산 단서", getCell_(webRow, webMap, "시설/자산 단서"));
      setCell_(row, targetMap, "예산/투자 단서", getCell_(webRow, webMap, "예산/투자 단서"));
      setCell_(row, targetMap, "의사결정자 단서", getCell_(webRow, webMap, "의사결정자 단서"));
      setCell_(row, targetMap, "거래준비도 점수", getCell_(webRow, webMap, "거래준비도 점수"));
      setCell_(row, targetMap, "점수 사유", getCell_(webRow, webMap, "점수 사유"));
      setCell_(row, targetMap, "A/B/C 등급", getCell_(webRow, webMap, "A/B/C 등급"));
      setCell_(row, targetMap, "검증상태", getCell_(webRow, webMap, "검증상태") || "미검증");
      setCell_(row, targetMap, "고객DB승격가능", getCell_(webRow, webMap, "고객DB승격가능"));
      setCell_(row, targetMap, "승격차단사유", getCell_(webRow, webMap, "승격차단사유"));
      target.appendRow(row);
      existing[normalizeKey_(company)] = true;
      moved += 1;
    }
    return moved;
  }

  function rowToLead_(row, headerMap) {
    return {
      product: getCell_(row, headerMap, "제품군"),
      companyName: getCell_(row, headerMap, "업체명"),
      customerType: getCell_(row, headerMap, "고객유형"),
      region: getCell_(row, headerMap, "지역"),
      source: [
        getCell_(row, headerMap, "공개 출처"),
        getCell_(row, headerMap, "웹출처URL"),
        getCell_(row, headerMap, "출처 신뢰도")
      ].join(" "),
      contactChannel: getCell_(row, headerMap, "공식 연락채널"),
      decisionSignal: getCell_(row, headerMap, "의사결정자 단서") || getCell_(row, headerMap, "담당자"),
      assetSignal: getCell_(row, headerMap, "시설/자산 단서"),
      budgetSignal: getCell_(row, headerMap, "예산/투자 단서"),
      urgentNeed: getCell_(row, headerMap, "추정 니즈"),
      notes: [
        getCell_(row, headerMap, "첫 접촉 포인트"),
        getCell_(row, headerMap, "크롤링메모")
      ].join(" ")
    };
  }

  function rowToPromotionLead_(row, headerMap, grade) {
    return {
      grade: grade,
      verificationStatus: getCell_(row, headerMap, "검증상태"),
      contactChannel: getCell_(row, headerMap, "공식 연락채널"),
      contactName: getCell_(row, headerMap, "담당자"),
      promotionReason: getCell_(row, headerMap, "승격사유"),
      notes: getCell_(row, headerMap, "크롤링메모")
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

  function nextWebLeadId_(sheet) {
    return "W-" + ("0000" + Math.max(sheet.getLastRow(), 1)).slice(-4);
  }

  function nextTargetId_(sheet) {
    return "T-" + ("0000" + Math.max(sheet.getLastRow(), 1)).slice(-4);
  }

  function normalizeKey_(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function normalizeText_(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "").trim();
  }

  return {
    setupWebLeadDb: setupWebLeadDb,
    scoreWebLeadDb: scoreWebLeadDb,
    seedResearchBriefWebLeads: seedResearchBriefWebLeads,
    promoteSelectedWebLeadsToTargetList: promoteSelectedWebLeadsToTargetList
  };
})();
