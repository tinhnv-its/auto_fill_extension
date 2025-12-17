// Background script để xử lý logic chung
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Hàm để trigger fill data từ popup hoặc context menu
function triggerFillData(apiUrl, fieldMappings) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'fillData',
      apiUrl: apiUrl,
      fieldMappings: fieldMappings
    }, (response) => {
      if (response && response.success) {
        console.log('Data filled successfully');
      } else {
        console.log('Failed to fill data');
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'triggerFill') {
    triggerFillData(request.apiUrl, request.fieldMappings);
    sendResponse({ success: true });
  }
});