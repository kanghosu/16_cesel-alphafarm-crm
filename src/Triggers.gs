function installCrmTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var existingHandlers = {};
  triggers.forEach(function (trigger) {
    existingHandlers[trigger.getHandlerFunction()] = true;
  });

  if (!existingHandlers.checkGmailReplies) {
    ScriptApp.newTrigger("checkGmailReplies")
      .timeBased()
      .everyHours(1)
      .create();
  }

  return "CRM triggers installed";
}
