function checkGmailReplies() {
  var ss = CrmConfig.getSpreadsheet();
  var sheet = ss.getSheetByName("03_메일링관리");
  if (!sheet || sheet.getLastRow() < 2) return 0;

  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var map = {};
  headers.forEach(function (header, index) {
    map[String(header)] = index;
  });

  var ownEmail = Session.getActiveUser().getEmail();
  var updated = 0;
  for (var i = 1; i < values.length; i += 1) {
    var row = values[i];
    var customerId = row[map["고객ID"]];
    var title = row[map["제목"]];
    var sentAt = row[map["발송일"]];
    if (!customerId && !title) continue;

    var queryToken = customerId ? String(customerId) : String(title).match(/\[[^\]]+\]/);
    if (!queryToken) continue;
    var threads = GmailApp.search('subject:"' + queryToken + '"');
    var latestReply = findLatestExternalReply_(threads, ownEmail, sentAt);
    if (!latestReply) continue;

    writeMailingValue_(sheet, map, i + 1, "회신여부", "예");
    writeMailingValue_(sheet, map, i + 1, "회신일", latestReply.date);
    writeMailingValue_(sheet, map, i + 1, "후속액션", "회신 내용 확인 후 다음 액션 결정");
    if (ApprovalRules.requiresRepresentativeApproval(latestReply.subject + " " + latestReply.snippet) === "Y") {
      writeMailingValue_(sheet, map, i + 1, "비고", "대표 승인 필요 키워드 포함 가능성");
    }
    updated += 1;
  }
  return updated;
}

function findLatestExternalReply_(threads, ownEmail, sentAt) {
  var sentDate = sentAt ? new Date(sentAt) : null;
  var latest = null;
  threads.forEach(function (thread) {
    thread.getMessages().forEach(function (message) {
      var from = message.getFrom();
      var date = message.getDate();
      if (sentDate && date <= sentDate) return;
      if (ownEmail && from.indexOf(ownEmail) !== -1) return;
      if (!latest || date > latest.date) {
        latest = {
          date: date,
          subject: message.getSubject(),
          snippet: message.getPlainBody().slice(0, 500)
        };
      }
    });
  });
  return latest;
}

function writeMailingValue_(sheet, map, row, header, value) {
  if (map[header] === undefined) return;
  sheet.getRange(row, map[header] + 1).setValue(value);
}
