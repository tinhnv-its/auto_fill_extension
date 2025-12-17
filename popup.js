document.addEventListener('DOMContentLoaded', function() {
  const apiUrlInput = document.getElementById('apiUrl');
  const fillBtn = document.getElementById('fillBtn');

  // Load saved API URL
  chrome.storage.sync.get(['apiUrl'], function(result) {
    if (result.apiUrl) {
      apiUrlInput.value = result.apiUrl;
    }
  });

  // Auto save API URL
  apiUrlInput.addEventListener('input', function() {
    chrome.storage.sync.set({ apiUrl: apiUrlInput.value.trim() });
  });

  fillBtn.addEventListener('click', function() {
    const apiUrl = apiUrlInput.value.trim();

    if (!apiUrl) {
      alert('Vui lòng nhập API URL');
      return;
    }

    // Fixed field mappings từ db.json
    const fieldMappings = [
      { apiField: 'username_first', inputId: 'username_first' },
      { apiField: 'username_last', inputId: 'username_last' },
      { apiField: 'zip', inputId: 'zip' },
      { apiField: 'mail', inputId: 'mail' }
    ];

    // Save API URL
    chrome.storage.sync.set({ apiUrl });

    // Trigger fill data
    chrome.runtime.sendMessage({
      action: 'triggerFill',
      apiUrl: apiUrl,
      fieldMappings: fieldMappings
    }, function(response) {
      if (response && response.success) {
        window.close();
      }
    });
  });
});