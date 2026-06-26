const SHEET_NAME = 'Sheet1';

function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (action === 'save') {
    sheet.appendRow([
      e.parameter.id, e.parameter.plate, e.parameter.model,
      e.parameter.name, e.parameter.phone, e.parameter.date,
      e.parameter.price, e.parameter.content, e.parameter.note,
      e.parameter.revisit, e.parameter.paymethod
    ]);
    return ok();
  }

  if (action === 'update') {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(e.parameter.id)) {
        const row = i + 1;
        sheet.getRange(row, 1, 1, 11).setValues([[
          e.parameter.id, e.parameter.plate, e.parameter.model,
          e.parameter.name, e.parameter.phone, e.parameter.date,
          e.parameter.price, e.parameter.content, e.parameter.note,
          e.parameter.revisit, e.parameter.paymethod
        ]]);
        return ok();
      }
    }
    return err('not found');
  }

  if (action === 'delete') {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(e.parameter.id)) {
        sheet.deleteRow(i + 1);
        return ok();
      }
    }
    return err('not found');
  }

  // list
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map((row, i) => {
    const obj = { _row: i + 2 };
    headers.forEach((h, j) => obj[h] = row[j]);
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function ok() {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
function err(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'error', msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
