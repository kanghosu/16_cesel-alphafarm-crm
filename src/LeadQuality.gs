var LeadQuality = (function () {
  var PRODUCT_RULES = {
    "40ft HC ContainerFarm": {
      requiredAny: ["컨테이너", "냉방", "전력", "배수", "실증", "파일럿", "테스트베드"],
      missingReason: "40ft HC 후보는 컨테이너/냉방/전력/배수/실증 목적 중 최소 단서가 필요합니다.",
      fitKeywords: ["컨테이너", "40ft", "hc", "스마트팜", "실증", "파일럿", "교육", "테스트베드"]
    },
    "AlphaFarm Core": {
      requiredAny: ["창고", "건물", "공장", "물류센터", "담보", "시설투자", "법인", "본사"],
      missingReason: "AlphaFarm Core 후보는 창고/건물/담보 가능한 자산 또는 법인성 단서가 필요합니다.",
      fitKeywords: ["core", "식품", "유통", "농업법인", "수직농장", "안정공급", "시설투자", "프리미엄 과채"]
    },
    "AlphaCafe": {
      requiredAny: ["딸기", "케이크", "디저트", "베이커리", "카페", "백화점", "리테일", "푸드홀"],
      missingReason: "AlphaCafe 후보는 딸기 메뉴/프리미엄 디저트/리테일 채널 단서가 필요합니다.",
      fitKeywords: ["alphacafe", "딸기", "케이크", "디저트", "베이커리", "카페", "백화점", "리테일", "푸드홀"]
    },
    "Alpha Experience Portfolio": {
      requiredAny: ["공간", "호텔", "라운지", "쇼룸", "팝업", "로비", "방문객", "체험", "포토존"],
      missingReason: "Experience 후보는 공간 운영권 또는 방문객 경험 니즈 단서가 필요합니다.",
      fitKeywords: ["experience", "공간", "호텔", "라운지", "쇼룸", "팝업", "로비", "브랜딩", "체험", "포토존"]
    },
    "ASEAN Service": {
      requiredAny: ["asean", "싱가포르", "말레이시아", "인도네시아", "해외진출", "수출", "현지", "수출바우처"],
      missingReason: "ASEAN 후보는 해외진출/수출/현지 검증 신호가 필요합니다.",
      fitKeywords: ["asean", "싱가포르", "말레이시아", "인도네시아", "해외", "수출", "현지", "글로벌"]
    }
  };

  var SENSITIVE_KEYWORDS = [
    "가격", "quote", "견적", "roi", "투자비", "수익성", "매출", "마진",
    "회수기간", "payback", "생산량", "외부자료", "자료 발송", "제안서",
    "계약조건"
  ];

  function scoreLead(lead) {
    var normalized = normalizeLead(lead || {});
    var product = normalizeProduct(normalized.product);
    var text = normalized.searchText;
    var holds = getHoldReasons(product, text);
    var components = getScoreComponents(product, text);
    var rawScore = sumComponents(components);
    var approvalRequired = containsAny(text, SENSITIVE_KEYWORDS) ? "Y" : "N";
    var holdReason = holds.concat(approvalRequired === "Y" ? ["가격/ROI/회수기간/생산량/외부자료 등 대표 승인 필요 키워드가 포함되었습니다."] : []);
    var grade = holdReason.length > 0 ? "보류" : gradeScore(rawScore, product);

    return {
      product: product,
      readinessScore: rawScore,
      grade: grade,
      approvalRequired: approvalRequired,
      productConfidence: getProductConfidence(product, text),
      holdReason: holdReason.join(" "),
      disqualificationResult: holdReason.length > 0 ? "보류" : "통과",
      scoreReason: buildScoreReason(components, rawScore, grade),
      components: components
    };
  }

  function applyContactLearning(existingResult, contact) {
    var base = existingResult || {};
    var text = normalizeText((contact && (contact.response || contact.notes || contact.result)) || "");
    var delta = 0;
    var reasons = [];

    if (containsAny(text, ["담당자 연결", "의사결정자", "팀장", "대표", "본부장"])) {
      delta += 8;
      reasons.push("담당자/의사결정자 접근성 가점");
    }
    if (containsAny(text, ["예산", "투자", "검토 가능", "구매", "도입"])) {
      delta += 8;
      reasons.push("예산/투자 검토 가점");
    }
    if (containsAny(text, ["미팅 수락", "미팅 제안 수락", "일정", "방문"])) {
      delta += 8;
      reasons.push("미팅 전환 가점");
    }
    if (containsAny(text, ["예산 없음", "시설 없음", "담당자 불명", "거절", "무료자료만"])) {
      delta -= 15;
      reasons.push("부정 반응 감점");
    }

    var nextScore = clamp((base.readinessScore || 0) + delta, 0, 100);
    var nextGrade = base.grade === "보류" && delta <= 0 ? "보류" : gradeScore(nextScore, base.product || "");
    if (base.grade === "C" && nextGrade === "A") {
      nextGrade = "B";
    }

    return {
      readinessScore: nextScore,
      grade: nextGrade,
      approvalRequired: base.approvalRequired || "N",
      productConfidence: base.productConfidence || "",
      holdReason: base.holdReason || "",
      disqualificationResult: base.disqualificationResult || "",
      scoreReason: [base.scoreReason || "", "접촉 결과 반영: " + (reasons.join(", ") || "변동 없음")].join(" ").trim()
    };
  }

  function normalizeLead(lead) {
    var fields = [
      "product", "customerType", "source", "contactChannel", "decisionSignal",
      "assetSignal", "budgetSignal", "urgentNeed", "notes", "companyName",
      "region", "customerNeed", "firstContactPoint"
    ];
    var parts = [];
    fields.forEach(function (field) {
      if (lead[field] !== undefined && lead[field] !== null) {
        parts.push(String(lead[field]));
      }
    });
    return {
      product: String(lead.product || lead.recommendedProduct || lead["제품군"] || ""),
      searchText: normalizeText(parts.join(" "))
    };
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function normalizeProduct(product) {
    var text = normalizeText(product);
    if (containsAny(text, ["40ft", "container", "컨테이너"])) return "40ft HC ContainerFarm";
    if (containsAny(text, ["experience", "portfolio", "체험", "공간"])) return "Alpha Experience Portfolio";
    if (containsAny(text, ["cafe", "카페", "alphacafe"])) return "AlphaCafe";
    if (containsAny(text, ["asean", "싱가포르", "말레이시아", "인도네시아"])) return "ASEAN Service";
    if (containsAny(text, ["core", "alphafarm", "수직농장"])) return "AlphaFarm Core";
    return product || "확인 필요";
  }

  function getHoldReasons(product, text) {
    var reasons = [];
    if (isUnofficialOnly(text)) {
      reasons.push("공식 출처 없는 개인/비공식 연락처만 확인되었습니다.");
    }
    if (containsAny(text, ["무료자료만", "무료 자료만", "자료만 요청"])) {
      reasons.push("무료 자료만 요청하는 후보입니다.");
    }

    var rule = PRODUCT_RULES[product];
    if (rule && !containsAny(text, rule.requiredAny)) {
      reasons.push(rule.missingReason);
    }

    if (product === "AlphaFarm Core" && containsAny(text, ["토지만", "토지 보유", "부지만"]) &&
      containsAny(text, ["창고 없음", "건물 없음", "담보 불명확"])) {
      reasons.push("Core 투자형 후보이나 창고/건물/담보 가능한 자산 단서가 없습니다.");
    }

    if (product === "40ft HC ContainerFarm" && containsAny(text, ["없음", "미확인", "부지만"]) &&
      !containsAny(text, ["컨테이너 보유", "냉방 보유", "전력 설비", "배수 설비", "테스트베드"])) {
      reasons.push("40ft 후보이나 컨테이너/냉방/전력/배수 인프라가 확인되지 않았습니다.");
    }

    return reasons;
  }

  function getScoreComponents(product, text) {
    return {
      assetFacility: scoreKeywords(text, ["창고", "건물", "공장", "물류센터", "냉장창고", "호텔", "라운지", "쇼룸", "로비", "본점", "백화점", "복수매장", "매장", "교육장", "테스트베드", "법인", "본사", "전력 설비"], 20),
      budgetInvestment: scoreKeywords(text, ["투자", "시설투자", "예산", "구매", "수출바우처", "신규사업", "파일럿", "실증", "프리미엄", "sku", "안정공급", "검토"], 18),
      decisionAccess: scoreKeywords(text, ["대표", "팀장", "본부장", "센터장", "원장", "구매", "신사업", "해외사업", "브랜드총괄", "세일즈팀", "담당"], 14),
      productFit: scoreKeywords(text, (PRODUCT_RULES[product] && PRODUCT_RULES[product].fitKeywords) || [], 18),
      officialContact: scoreKeywords(text, ["대표번호", "공식 문의메일", "공식메일", "문의폼", "고객센터", "직통", "공식 dm"], 12),
      urgentNeed: scoreKeywords(text, ["여름철", "수급", "안정화", "차별화", "현지 테스트", "체험", "검증", "교육", "긴급", "자료 요청", "메뉴", "게시물"], 10),
      sourceTrust: scoreKeywords(text, ["공식 홈페이지", "naver place", "google", "instagram", "dart", "hometax", "koita", "smartfarm", "kotra", "수출바우처", "기업마당", "협회"], 8)
    };
  }

  function scoreKeywords(text, keywords, max) {
    if (!keywords || keywords.length === 0) return 0;
    var hits = 0;
    keywords.forEach(function (keyword) {
      if (text.indexOf(String(keyword).toLowerCase()) !== -1) hits += 1;
    });
    if (hits === 0) return 0;
    if (hits === 1) return Math.ceil(max * 0.55);
    if (hits === 2) return Math.ceil(max * 0.8);
    return max;
  }

  function isUnofficialOnly(text) {
    var unofficial = containsAny(text, ["블로그 댓글", "리뷰", "개인 휴대폰", "개인 연락처", "카카오"]);
    var official = containsAny(text, ["공식", "대표번호", "홈페이지", "naver place", "google", "dart", "kotra"]);
    return unofficial && !official;
  }

  function containsAny(text, keywords) {
    var normalized = normalizeText(text);
    return keywords.some(function (keyword) {
      return normalized.indexOf(String(keyword).toLowerCase()) !== -1;
    });
  }

  function sumComponents(components) {
    var total = 0;
    Object.keys(components).forEach(function (key) {
      total += components[key] || 0;
    });
    return clamp(total, 0, 100);
  }

  function gradeScore(score, product) {
    if (product === "ASEAN Service" && score >= 75) return "B";
    if (product === "40ft HC ContainerFarm" && score >= 75 && score < 85) return "B";
    if (score >= 75) return "A";
    if (score >= 60) return "B";
    if (score >= 45) return "C";
    return "보류";
  }

  function getProductConfidence(product, text) {
    var rule = PRODUCT_RULES[product];
    if (!rule) return "낮음";
    var hits = 0;
    rule.fitKeywords.forEach(function (keyword) {
      if (text.indexOf(String(keyword).toLowerCase()) !== -1) hits += 1;
    });
    if (hits >= 3) return "높음";
    if (hits >= 1) return "중간";
    return "낮음";
  }

  function buildScoreReason(components, score, grade) {
    var labels = {
      assetFacility: "자산/시설",
      budgetInvestment: "예산/투자",
      decisionAccess: "의사결정자",
      productFit: "제품군 적합도",
      officialContact: "공식 연락채널",
      urgentNeed: "긴급 니즈",
      sourceTrust: "출처 신뢰도"
    };
    var parts = Object.keys(components).map(function (key) {
      return labels[key] + " " + components[key];
    });
    return parts.join(", ") + " => " + score + "점 / " + grade;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  return {
    scoreLead: scoreLead,
    applyContactLearning: applyContactLearning,
    normalizeProduct: normalizeProduct
  };
})();
