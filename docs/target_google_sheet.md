# Target Google Sheet

## Sheet

- URL: https://docs.google.com/spreadsheets/d/1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk/edit
- Spreadsheet ID: `1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk`

The Apps Script code uses this ID as the default target through `src/Config.gs`. A script property named `TARGET_SPREADSHEET_ID` can override it later.

## Recommended Binding Flow

Use the Google account that owns or can edit the sheet.

```bash
npm install -g @google/clasp
clasp login
clasp create-script --title "CESeL AlphaFarm CRM" --type sheets --parentId "1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk"
clasp push
clasp open
```

If you create the Apps Script project manually from the sheet:

1. Open the sheet.
2. Go to `Extensions > Apps Script`.
3. Copy the generated script ID.
4. Copy `.clasp.json.example` to `.clasp.json`.
5. Replace `PASTE_APPS_SCRIPT_ID_HERE` with the script ID.
6. Run `clasp push`.

## First Run

After pushing:

1. Reload the Google Sheet.
2. Run `CESeL CRM > 초기 설정`.
3. Authorize the script.
4. Run `CESeL CRM > 타깃리스트 점수화`.
5. Run `CESeL CRM > A/B급 고객DB 반영`.

## Access Note

The sheet is not publicly readable by anonymous CSV export. That is fine for operation, but deployment must be done from an authorized Google account.
