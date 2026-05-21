var CrmConfig = (function () {
  var DEFAULT_SPREADSHEET_ID = "1kVbvt5ksr-Kw5T-8FfAOmEYqKRTLyah8Gc4ThvhRBtk";

  function getSpreadsheetId() {
    try {
      var stored = PropertiesService.getScriptProperties().getProperty("TARGET_SPREADSHEET_ID");
      return stored || DEFAULT_SPREADSHEET_ID;
    } catch (error) {
      return DEFAULT_SPREADSHEET_ID;
    }
  }

  function getSpreadsheet() {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
    return SpreadsheetApp.openById(getSpreadsheetId());
  }

  return {
    getSpreadsheetId: getSpreadsheetId,
    getSpreadsheet: getSpreadsheet
  };
})();
