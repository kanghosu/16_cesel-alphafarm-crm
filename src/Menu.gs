function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("CESeL CRM")
    .addItem("초기 설정", "setupLeadQualityCrm")
    .addSeparator()
    .addItem("웹크롤링DB 초기화", "setupWebLeadDb")
    .addItem("웹DB 시인성 개선", "applyWebLeadDbView")
    .addItem("웹리드 점수화", "scoreWebLeadDb")
    .addItem("서울경기 예상수요 넣기", "seedSeoulGyeonggiDemandLeads")
    .addItem("선택 웹리드 타깃 반영", "promoteSelectedWebLeadsToTargetList")
    .addSeparator()
    .addItem("타깃리스트 점수화", "scoreTargetList")
    .addItem("검증완료 고객DB 반영", "promoteQualifiedTargets")
    .addSeparator()
    .addItem("5/22 접촉기록·고객DB 반영", "upsertMay22ContactAndCustomerData")
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

function setupWebLeadDb() {
  return WebLeadDb.setupWebLeadDb();
}

function scoreWebLeadDb() {
  return WebLeadDb.scoreWebLeadDb();
}

function applyWebLeadDbView() {
  return WebLeadDb.applyWebLeadDbView();
}

function seedSeoulGyeonggiDemandLeads() {
  return WebLeadDb.seedSeoulGyeonggiDemandLeads();
}

function seedResearchBriefWebLeads() {
  return WebLeadDb.seedResearchBriefWebLeads();
}

function promoteSelectedWebLeadsToTargetList() {
  return WebLeadDb.promoteSelectedWebLeadsToTargetList();
}
