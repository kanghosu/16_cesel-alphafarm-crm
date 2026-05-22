function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("CESeL CRM")
    .addItem("초기 설정", "setupLeadQualityCrm")
    .addSeparator()
    .addItem("타깃리스트 점수화", "scoreTargetList")
    .addItem("A/B급 고객DB 반영", "promoteQualifiedTargets")
    .addSeparator()
    .addItem("인터퓨어포스 업데이트", "upsertInterPurePosLead")
    .addSeparator()
    .addItem("Gmail 답장 확인", "checkGmailReplies")
    .addItem("트리거 설치", "installCrmTriggers")
    .addToUi();
}

function setupLeadQualityCrm() {
  return LeadQualityRunner.setupLeadQualityCrm();
}

function scoreTargetList() {
  return LeadQualityRunner.scoreTargetList();
}

function promoteQualifiedTargets() {
  return LeadQualityRunner.promoteQualifiedTargets();
}
