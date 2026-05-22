# Target Google Sheet

## Sheet

- URL: https://docs.google.com/spreadsheets/d/1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk/edit
- Spreadsheet ID: `1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk`

The Apps Script code uses this ID as the default target through `src/Config.gs`. A script property named `TARGET_SPREADSHEET_ID` can override it later.

## Recommended Binding Flow

Use the Google account that owns or can edit the sheet.

Do not use `clasp create-script --type sheets` for this existing sheet. It can create a new spreadsheet instead of binding to the existing one.

Use the manual bound-script flow:

1. Open the sheet.
2. Go to `Extensions > Apps Script`.
3. Copy the generated script ID.
4. Copy `.clasp.json.example` to `.clasp.json`.
5. Replace `PASTE_APPS_SCRIPT_ID_HERE` with the script ID.
6. Run `npm run gas:push`.

PowerShell shortcut:

```powershell
npm run gas:login
Copy-Item .clasp.json.example .clasp.json
notepad .clasp.json
npm run gas:push
npm run gas:open
```

## First Run

After pushing:

1. Reload the Google Sheet.
2. Run `CESeL CRM > 초기 설정`.
3. Authorize the script.
4. Run `CESeL CRM > 타깃리스트 점수화`.
5. Run `CESeL CRM > 검증완료 고객DB 반영`.

For web crawling or research candidates, first run `CESeL CRM > 웹크롤링DB 초기화` and keep them in `12_웹크롤링DB`. The real `01_고객DB` should only contain candidates with reply, offline contact, received contact details, or confirmed 담당자 access.

## Access Note

The sheet is not publicly readable by anonymous CSV export. That is fine for operation, but deployment must be done from an authorized Google account.
