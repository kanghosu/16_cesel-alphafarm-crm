var CustomerDbGate = (function () {
  var VERIFIED_STATUSES = [
    "회신옴",
    "답장옴",
    "회신",
    "오프라인접점",
    "오프라인 접점",
    "오프라인",
    "연락처확보",
    "연락처 확보",
    "담당자확인",
    "담당자 확인"
  ];
  var VERIFIED_EVIDENCE = [
    "회신",
    "오프라인접점",
    "오프라인 접점",
    "연락처확보",
    "연락처 확보",
    "담당자확인",
    "담당자 확인"
  ];

  function evaluate(lead) {
    var normalized = normalizeLead_(lead || {});
    if (normalized.grade !== "A" && normalized.grade !== "B") {
      return buildResult_("N", "A/B 등급만 고객DB 승격 대상입니다.");
    }

    if (!isVerifiedEvidence_(normalized.evidence) && !isVerifiedStatus_(normalized.status)) {
      return buildResult_("N", "고객DB 승격근거를 회신, 오프라인접점, 연락처확보, 담당자확인 중 하나로 선택해야 합니다.");
    }

    if ((isContactOnlyStatus_(normalized.status) || isContactOnlyStatus_(normalized.evidence)) && !hasContactEvidence_(normalized)) {
      return buildResult_("N", "연락처확보/담당자확인 근거는 연락처, 이메일, 담당자명 중 하나가 필요합니다.");
    }

    return buildResult_("Y", "검증 상태가 확인되어 고객DB 승격 가능합니다.");
  }

  function canPromote(lead) {
    return evaluate(lead).allowed === "Y";
  }

  function normalizeLead_(lead) {
    return {
      grade: firstText_([
        lead.grade,
        lead.leadGrade,
        lead["A/B/C 등급"],
        lead["lead_grade"],
        lead["등급"]
      ]),
      status: firstText_([
        lead.verificationStatus,
        lead["검증상태"],
        lead.contactStage,
        lead["접촉단계"],
        lead.contactStatus,
        lead["접촉상태"],
        lead.status,
        lead["상태"]
      ]),
      evidence: firstText_([
        lead.promotionEvidence,
        lead["고객DB승격근거"],
        lead["승격근거"],
        lead.verificationEvidence,
        lead["검증근거"]
      ]),
      contactText: [
        lead.contactChannel,
        lead["공식 연락채널"],
        lead["공식 전화번호"],
        lead["공식 이메일"],
        lead["연락채널 메모"],
        lead["공개연락채널"],
        lead.phone,
        lead["연락처"],
        lead.email,
        lead["이메일"],
        lead.contactName,
        lead["담당자"],
        lead["담당자명"]
      ].join(" "),
      notes: [
        lead.notes,
        lead["메모"],
        lead.promotionReason,
        lead["승격사유"],
        lead.offlineEvidence,
        lead["오프라인 접점"],
        lead.source,
        lead["출처"]
      ].join(" ")
    };
  }

  function firstText_(values) {
    for (var i = 0; i < values.length; i += 1) {
      if (values[i] !== undefined && values[i] !== null && String(values[i]).trim() !== "") {
        return String(values[i]).trim();
      }
    }
    return "";
  }

  function isVerifiedStatus_(status) {
    var normalized = normalizeText_(status);
    return VERIFIED_STATUSES.some(function (item) {
      return normalized.indexOf(normalizeText_(item)) !== -1;
    });
  }

  function isVerifiedEvidence_(evidence) {
    var normalized = normalizeText_(evidence);
    return VERIFIED_EVIDENCE.some(function (item) {
      return normalized.indexOf(normalizeText_(item)) !== -1;
    });
  }

  function isContactOnlyStatus_(status) {
    var normalized = normalizeText_(status);
    return normalized.indexOf("연락처") !== -1 || normalized.indexOf("담당자") !== -1;
  }

  function hasContactEvidence_(lead) {
    return normalizeText_(lead.contactText).length > 0;
  }

  function normalizeText_(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function buildResult_(allowed, reason) {
    return {
      allowed: allowed,
      reason: reason,
      customerDbEligible: allowed,
      blockReason: allowed === "Y" ? "" : reason
    };
  }

  return {
    evaluate: evaluate,
    canPromote: canPromote
  };
})();
