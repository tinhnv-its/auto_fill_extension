// Content script chạy trên mọi trang web
(function() {
  // Hàm gọi API
  async function callAPI(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      return null;
    }
  }

  // Hàm điền dữ liệu vào input
  function fillInputs(data) {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="zip"], textarea');
    
    inputs.forEach((input) => {
      if (data && typeof data === 'object') {
        let value = '';
        
        // Map theo type của input
        if (input.type === 'email' && data.email) {
          value = data.email;
        } else if (input.type === 'zip' && data.zip) {
          value = data.zip;
        } else if (input.type === 'tel' && data.phone) {
          value = data.phone;
        } else {
          // Fallback: lấy giá trị đầu tiên
          const keys = Object.keys(data);
          value = keys.length > 0 ? data[keys[0]] : '';
        }
        
        if (value) {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  }

  // Hàm điền dữ liệu theo field mappings
  function fillInputsByMapping(data, fieldMappings) {
    fieldMappings.forEach(mapping => {
      const input = document.getElementById(mapping.inputId);
      if (input && data[mapping.apiField]) {
        input.value = data[mapping.apiField];
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillData' && request.apiUrl) {
      callAPI(request.apiUrl).then(data => {
        if (data) {
          if (request.fieldMappings && request.fieldMappings.length > 0) {
            fillInputsByMapping(data, request.fieldMappings);
          } else {
            fillInputs(data);
          }
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
      });
      return true;
    }
  });

  // Auto trigger khi trang load (tùy chọn)
  window.addEventListener('load', () => {
    // Có thể tự động gọi API với URL mặc định
    // const defaultApiUrl = 'https://jsonplaceholder.typicode.com/users/1';
    // callAPI(defaultApiUrl).then(data => fillInputs(data));
  });
})();