document.addEventListener('DOMContentLoaded', function() {
  const apiUrlInput = document.getElementById('apiUrl');
  const fillBtn = document.getElementById('fillBtn');
  const addFieldBtn = document.getElementById('addFieldBtn');
  const fieldContainer = document.getElementById('fieldContainer');

  // Load saved data
  chrome.storage.sync.get(['apiUrl', 'fieldMappings'], function(result) {
    if (result.apiUrl) {
      apiUrlInput.value = result.apiUrl;
    }
    if (result.fieldMappings) {
      result.fieldMappings.forEach(mapping => addFieldRow(mapping.apiField, mapping.inputId));
    }
  });

  function addFieldRow(apiField = '', inputId = '') {
    const row = document.createElement('div');
    row.className = 'field-row';
    row.innerHTML = `
      <input type="text" placeholder="Thuộc tính trong API" value="${apiField}">
      <input type="text" placeholder="ID trong html" value="${inputId}">
      <button class="remove-btn">X</button>
    `;
    
    row.querySelector('.remove-btn').addEventListener('click', () => row.remove());
    fieldContainer.appendChild(row);
  }

  addFieldBtn.addEventListener('click', () => addFieldRow());

  fillBtn.addEventListener('click', function() {
    const apiUrl = apiUrlInput.value.trim();
    const fieldMappings = [];
    
    fieldContainer.querySelectorAll('.field-row').forEach(row => {
      const inputs = row.querySelectorAll('input');
      const apiField = inputs[0].value.trim();
      const inputId = inputs[1].value.trim();
      if (apiField && inputId) {
        fieldMappings.push({ apiField, inputId });
      }
    });

    if (!apiUrl) {
      alert('Vui lòng nhập API URL');
      return;
    }

    // Save data
    chrome.storage.sync.set({ apiUrl, fieldMappings });

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