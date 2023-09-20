function sendSlackMessages() {
  const url = "hide webhook";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("test");
  const data = sheet.getDataRange().getValues(); // Get all post-drop data

  const usernameToUserId = {
    "Brian Habana": "U039CSVDJSF",
    "Lauryn Lawton": "U03TAH03MAB",
    "Aissa Craig": "U02HAQ9ED17",
    // Add more mappings as needed
  };

  const today = new Date(); // Get the current date

  data.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      return; // Skip the header row
    }

    const username = row[7];
    if (!username) {
      return; // Skip if username is empty
    }

    const slackUserId = usernameToUserId[username];
    const hyperlink = "<https://docs.google.com/spreadsheets/d/1BfZIShAzcRXpVgaxFspHacsX_UvBucZk-XMHWFEcfx4/edit#gid=630373918|could you please clean?>";
    const column20Value = row[19];
    const column21Value = row[20];
    const column22Value = row[21];
    const column1Value = row[0];
    const column2Value = row[1];

    if (isPostDropPlannedConditionMet(column20Value, column21Value, column22Value, slackUserId, today)) {
      const message = createPostDropPlannedMessage(slackUserId, column1Value, column2Value, hyperlink);
      sendMessage(url, message);
    }

    if (isRevisedPostDropConditionMet(column21Value, column22Value, slackUserId, today)) {
      const message = createRevisedPostDropMessage(slackUserId, column1Value, column2Value, hyperlink);
      sendMessage(url, message);
    }
  });
}

function isPostDropPlannedConditionMet(column20Value, column21Value, column22Value, slackUserId, today) {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  return (
    column20Value instanceof Date &&
    column20Value < todayMidnight &&
    !areDatesEqual(column20Value, todayMidnight) && // Exclude today
    column21Value === "" &&
    column22Value === "" &&
    slackUserId
  );
}

function isRevisedPostDropConditionMet(column21Value, column22Value, slackUserId, today) {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  return (
    column21Value instanceof Date &&
    column21Value < todayMidnight &&
    !areDatesEqual(column21Value, todayMidnight) && // Exclude today
    column22Value === "" &&
    slackUserId
  );
}

function areDatesEqual(date1, date2) {
  // Compare two dates for equality (excluding time)
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function createPostDropPlannedMessage(slackUserId, column1Value, column2Value, hyperlink) {
  // Customize the message for post drop planned in the past
  return {
    text: `FOREIGN CONTAMINENT! <@${slackUserId}>! :Robot_Face: You have a post drop planned in the past (${column1Value} - ep ${column2Value}) with no revised date ${hyperlink}`,
    link_names: 1
  };
}

function createRevisedPostDropMessage(slackUserId, column1Value, column2Value, hyperlink) {
  // Customize the message for revised post drop in the past
  return {
    text: `FOREIGN CONTAMINENT! <@${slackUserId}>! :Robot_Face: You have a revised post drop date in the past (${column1Value} - ep ${column2Value}) with no post drop actual date ${hyperlink}`,
    link_names: 1
  };
}

function sendMessage(url, payload) {
  const params = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const sendMsg = UrlFetchApp.fetch(url, params);
  const respCode = sendMsg.getResponseCode();
  Logger.log(sendMsg);
  Logger.log(respCode);
}


