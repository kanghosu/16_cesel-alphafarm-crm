const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const schema = readJson("schemas/lead_output_schema.json");
const requiredFields = [
  "facility_asset_signal",
  "budget_investment_signal",
  "decision_maker_signal",
  "disqualification_result",
  "readiness_score",
  "score_reason",
  "lead_grade",
  "product_confidence",
  "disqualification_reason",
  "source_type",
  "verification_status",
  "customer_db_eligible",
  "customer_db_block_reason"
];

for (const field of requiredFields) {
  assert.ok(schema.required.includes(field), `${field} must be required`);
  assert.ok(schema.properties[field], `${field} must have schema property`);
}
assert.deepStrictEqual(schema.properties.lead_grade.enum, ["A", "B", "C", "보류"]);
assert.deepStrictEqual(schema.properties.approval_required.enum, ["Y", "N"]);

const samples = readJson("tests/sample_leads.json");
assert.strictEqual(samples.length, 10);
assert.ok(samples.some((lead) => lead.expected_grade === "A"));
assert.ok(samples.some((lead) => lead.expected_grade === "B"));
assert.ok(samples.some((lead) => lead.expected_grade === "C"));
assert.ok(samples.some((lead) => lead.expected_grade === "보류"));

const csv = readText("templates/lead_sourcing_template.csv");
for (const header of [
  "시설/자산 단서",
  "예산/투자 단서",
  "의사결정자 단서",
  "탈락질문 결과",
  "거래준비도 점수",
  "점수 사유",
  "A/B/C 등급"
]) {
  assert.ok(csv.split(/\r?\n/)[0].includes(header), `${header} missing from template header`);
}

const webCsv = readText("templates/web_crawling_db_template.csv");
for (const header of [
  "수집ID",
  "수집채널",
  "웹출처URL",
  "검증상태",
  "고객DB승격가능",
  "승격차단사유",
  "타깃리스트반영"
]) {
  assert.ok(webCsv.split(/\r?\n/)[0].includes(header), `${header} missing from web crawling template header`);
}

const webDbCode = readText("src/WebLeadDb.gs");
assert.ok(webDbCode.includes("12_웹크롤링DB"));
assert.ok(webDbCode.includes("CustomerDbGate.evaluate"));

const manifest = readJson("appsscript.json");
assert.strictEqual(manifest.runtimeVersion, "V8");
assert.ok(manifest.oauthScopes.includes("https://www.googleapis.com/auth/spreadsheets.currentonly"));
assert.ok(manifest.oauthScopes.includes("https://www.googleapis.com/auth/gmail.readonly"));

const readme = readText("README.md");
assert.ok(readme.includes("12_웹크롤링DB"));
assert.ok(readme.includes("검증완료 고객DB 반영"));

console.log("project_artifacts.test.js passed");
