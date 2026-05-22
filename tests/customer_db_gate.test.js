const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadCustomerDbGate() {
  const file = path.join(__dirname, "..", "src", "CustomerDbGate.gs");
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { console, globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file });
  return sandbox.CustomerDbGate;
}

const CustomerDbGate = loadCustomerDbGate();

function evaluate(lead) {
  return CustomerDbGate.evaluate(lead);
}

const rawWebLead = evaluate({
  companyName: "A급 웹후보",
  grade: "A",
  sourceType: "웹크롤링",
  verificationStatus: "미검증",
  contactChannel: "대표번호 02-0000-0000",
  source: "공식 홈페이지"
});
assert.strictEqual(rawWebLead.allowed, "N");
assert.match(rawWebLead.reason, /회신|오프라인|연락처 확보/);

const repliedLead = evaluate({
  companyName: "회신온 후보",
  grade: "A",
  sourceType: "웹크롤링",
  verificationStatus: "회신옴",
  email: "buyer@example.com"
});
assert.strictEqual(repliedLead.allowed, "Y");

const offlineLead = evaluate({
  companyName: "오프라인 만난 후보",
  grade: "B",
  verificationStatus: "오프라인접점",
  notes: "전시회 현장 미팅에서 담당자가 후속 연락 요청"
});
assert.strictEqual(offlineLead.allowed, "Y");

const contactWithoutChannel = evaluate({
  companyName: "연락처 표시만 한 후보",
  grade: "A",
  verificationStatus: "연락처확보"
});
assert.strictEqual(contactWithoutChannel.allowed, "N");
assert.match(contactWithoutChannel.reason, /연락처|담당자/);

const contactReceivedLead = evaluate({
  companyName: "연락처 받은 후보",
  grade: "B",
  contactStage: "전화시도",
  promotionEvidence: "연락처확보",
  phone: "010-1234-5678"
});
assert.strictEqual(contactReceivedLead.allowed, "Y");

const mailedButNoEvidence = evaluate({
  companyName: "메일만 보낸 후보",
  grade: "A",
  contactStage: "메일발송",
  promotionEvidence: "없음",
  email: "sent@example.com"
});
assert.strictEqual(mailedButNoEvidence.allowed, "N");
assert.match(mailedButNoEvidence.reason, /승격근거/);

const lowGradeReply = evaluate({
  companyName: "회신은 왔지만 낮은 후보",
  grade: "C",
  verificationStatus: "회신옴",
  email: "low@example.com"
});
assert.strictEqual(lowGradeReply.allowed, "N");
assert.match(lowGradeReply.reason, /A\/B/);

console.log("customer_db_gate.test.js passed");
