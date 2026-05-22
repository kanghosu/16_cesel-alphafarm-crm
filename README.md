# CESeL AlphaFarm CRM

Google Apps Script based CRM automation for CESeL / AlphaFarm lead scoring, target list qualification, customer DB promotion, and Gmail reply tracking.

## What This Adds

- `08_타깃리스트` lead quality scoring with `거래준비도 점수`
- `12_웹크롤링DB` for web/research leads that must not enter the real customer DB directly
- Product-specific disqualification questions for 40ft HC, AlphaFarm Core, AlphaCafe, Experience, and ASEAN
- Verified-only promotion from `08_타깃리스트` into `01_고객DB`
- Representative approval flags for price, ROI, payback, production volume, external documents, and proposal requests
- Gmail reply tracking by customer ID or subject token, without automatic email sending

## Local Files

- `src/LeadQuality.gs`: core scoring rules
- `src/CustomerDbGate.gs`: verified-only customer DB promotion gate
- `src/LeadQualityRunner.gs`: Google Sheets integration
- `src/WebLeadDb.gs`: separate web crawling/research lead DB
- `src/Menu.gs`: `CESeL CRM` menu
- `src/GmailTracker.gs`: Gmail reply tracking
- `src/Triggers.gs`: hourly reply tracking trigger
- `schemas/lead_output_schema.json`: OpenAI Structured Outputs schema
- `templates/lead_sourcing_template.csv`: semi-manual lead sourcing template
- `templates/web_crawling_db_template.csv`: web/research lead DB template
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

2. Open the target sheet and create or open its bound Apps Script project.

```text
Extensions > Apps Script
```

Copy the Apps Script ID from `Project Settings`, then copy `.clasp.json.example` to `.clasp.json` and paste the script ID.

Do not use `clasp create-script --type sheets` for this existing sheet; it can create a new spreadsheet instead of binding to the current one.

3. Push the Apps Script files.

```bash
clasp push
```

4. Open the bound Google Sheet, reload it, and use:

```text
CESeL CRM > 초기 설정
CESeL CRM > 웹크롤링DB 초기화
CESeL CRM > 웹DB 시인성 개선
CESeL CRM > 웹리드 점수화
CESeL CRM > 서울경기 예상수요 넣기
CESeL CRM > 선택 웹리드 타깃 반영
CESeL CRM > 타깃리스트 점수화
CESeL CRM > 검증완료 고객DB 반영
```

## Lead Quality Rules

The scoring engine assigns up to 100 points across:

- 자산/시설 보유
- 예산·투자 신호
- 의사결정자 접근성
- 제품군 적합도
- 공식 전화번호
- 공식 이메일
- 연락채널 메모
- 긴급 니즈
- 출처 신뢰도

Grades:

- `A`: call today
- `B`: verify and call
- `C`: keep as low-priority prospect
- `보류`: do not promote until risk or missing qualification is resolved

## DB Separation Rule

`12_웹크롤링DB` stores raw web, search, and research candidates. These rows can be scored and optionally copied to `08_타깃리스트`, but they are not real customers yet.

For readability, `12_웹크롤링DB` separates `접촉단계` from `고객DB승격근거`.

- `접촉단계`: 미접촉, 온라인접수, 메일발송, 전화시도, 방문시도, 회신옴, 미팅예정, 미팅완료, 부적합
- `고객DB승격근거`: 없음, 회신, 오프라인접점, 연락처확보, 담당자확인

`01_고객DB` is reserved for leads with `고객DB승격근거` of reply, offline contact, received contact details, or confirmed 담당자 access. The `검증완료 고객DB 반영` menu checks this gate before appending rows.

## Test

```bash
npm test
```

The tests cover ten sample leads, Core/40ft asset gates, approval-required keywords, unofficial contact holds, customer DB promotion gates, and artifact/schema completeness.

See `docs/target_google_sheet.md` for the sheet-specific deployment notes.

## Korean Runbook

For day-to-day usage, follow:

[docs/how_to_use_ko.md](docs/how_to_use_ko.md)

Typical local development commands:

```bash
npm test
npm run gas:login
copy .clasp.json.example .clasp.json
npm run gas:push
npm run gas:open
```

`@google/clasp` is installed as a local dev dependency, so you do not need a global clasp install.
