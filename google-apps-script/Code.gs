// Nhận dữ liệu từ form đăng ký và ghi vào Google Sheet.
// Hướng dẫn triển khai: xem google-apps-script/README.md

const SHEET_NAME = "Đăng ký";
const HEADERS = [
  "Thời gian",
  "Họ và tên",
  "Số điện thoại",
  "Trình độ hiện tại",
  "Mục tiêu JLPT",
  "Ghi chú",
  "Nguồn",
  "Đồng ý xử lý dữ liệu",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.fullName || "",
      "'" + (data.phone || ""), // dấu ' giữ số 0 đầu khi Sheet tự đổi sang số
      data.currentLevel || "",
      data.targetJlpt || "",
      data.notes || "",
      data.source || "",
      data.consent === true ? "Đồng ý" : "",
    ]);
    notifyNewLead_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Gửi email báo đăng ký mới. Đặt địa chỉ nhận trong Project Settings → Script properties: NOTIFY_EMAIL.
function notifyNewLead_(data) {
  try {
    const to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
    if (!to) return;
    const body = [
      "Có đăng ký mới từ website.",
      "",
      "Họ tên: " + (data.fullName || ""),
      "Số điện thoại: " + (data.phone || ""),
      "Trình độ hiện tại: " + (data.currentLevel || ""),
      "Mục tiêu JLPT: " + (data.targetJlpt || ""),
      "Ghi chú: " + (data.notes || ""),
      "Nguồn: " + (data.source || "(trực tiếp)"),
      "",
      "Xem Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    ].join("\n");
    MailApp.sendEmail(to, "[Đăng ký mới] " + (data.fullName || "không tên") + " - " + (data.targetJlpt || ""), body);
  } catch (err) {
    // Lỗi gửi email không được làm hỏng việc ghi dữ liệu
    console.error("notify failed: " + err);
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastColumn() < HEADERS.length) {
    // Sheet tạo từ phiên bản cũ: bổ sung tiêu đề cho các cột mới
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
