var ApprovalRules = (function () {
  var KEYWORDS = [
    "가격", "견적", "ROI", "투자비", "회수기간", "수익성", "매출", "마진",
    "생산량", "외부자료", "자료 발송", "제안서", "계약조건", "40ft"
  ];

  function requiresRepresentativeApproval(text) {
    var normalized = String(text || "").toLowerCase();
    return KEYWORDS.some(function (keyword) {
      return normalized.indexOf(String(keyword).toLowerCase()) !== -1;
    }) ? "Y" : "N";
  }

  return {
    requiresRepresentativeApproval: requiresRepresentativeApproval
  };
})();
