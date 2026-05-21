# CESeL AlphaFarm CRM

Google Apps Script based CRM automation for CESeL / AlphaFarm lead scoring, target list qualification, customer DB promotion, and Gmail reply tracking.

## What This Adds

- `08_타깃리스트` lead quality scoring with `거래준비도 점수`
- Product-specific disqualification questions for 40ft HC, AlphaFarm Core, AlphaCafe, Experience, and ASEAN
- A/B-grade promotion from `08_타깃리스트` into `01_고객DB`
- Representative approval flags for price, ROI, payback, production volume, external documents, and proposal requests
- Gmail reply tracking by customer ID or subject token, without automatic email sending

## Local Files

- `src/LeadQuality.gs`: core scoring rules
- `src/LeadQualityRunner.gs`: Google Sheets integration
- `src/Menu.gs`: `CESeL CRM` menu
- `src/GmailTracker.gs`: Gmail reply tracking
- `src/Triggers.gs`: hourly reply tracking trigger
- `schemas/lead_output_schema.json`: OpenAI Structured Outputs schema
- `templates/lead_sourcing_template.csv`: semi-manual lead sourcing template
- `tests/sample_leads.json`: fixed test examples for A/B/C/hold behavior

## Apps Script Setup

Target sheet:

```text
https://docs.google.com/spreadsheets/d/1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk/edit
```

1. Install `clasp` and log in.

```bash
npm install -g @google/clasp
clasp login
```

2. Create the Apps Script project bound to the target sheet.

```bash
clasp create-script --title "CESeL AlphaFarm CRM" --type sheets --parentId "1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk"
```

If you already created the Apps Script project from the sheet UI, copy `.clasp.json.example` to `.clasp.json` and paste the script ID.

3. Push the Apps Script files.

```bash
clasp push
```

4. Open the bound Google Sheet, reload it, and use:

```text
CESeL CRM > 초기 설정
CESeL CRM > 타깃리스트 점수화
CESeL CRM > A/B급 고객DB 반영
```

## Lead Quality Rules

The scoring engine assigns up to 100 points across:

- 자산/시설 보유
- 예산·투자 신호
- 의사결정자 접근성
- 제품군 적합도
- 공식 연락채널
- 긴급 니즈
- 출처 신뢰도

Grades:

- `A`: call today
- `B`: verify and call
- `C`: keep as low-priority prospect
- `보류`: do not promote until risk or missing qualification is resolved

## Test

```bash
npm test
```

The tests cover ten sample leads, Core/40ft asset gates, approval-required keywords, unofficial contact holds, and artifact/schema completeness.

See `docs/target_google_sheet.md` for the sheet-specific deployment notes.

## Korean Runbook

For day-to-day usage, follow:

[docs/how_to_use_ko.md](docs/how_to_use_ko.md)

Typical local development commands:

```bash
npm test
npm run gas:login
npm run gas:create
npm run gas:push
npm run gas:open
```

`@google/clasp` is installed as a local dev dependency, so you do not need a global clasp install.
