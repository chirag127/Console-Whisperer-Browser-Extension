/**
 * Console Whisperer - Error Overlay
 * 
 * This module provides the UI for displaying error explanations.
 */

// Error Overlay class
class ErrorOverlay {
  constructor() {
    this.container = null;
    this.isVisible = false;
    this.currentError = null;
    this.initialize();
  }
  
  initialize() {
    // Create the container
    this.container = document.createElement('div');
    this.container.className = 'console-whisperer-overlay';
    this.container.style.display = 'none';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .console-whisperer-overlay {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-height: 500px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      .console-whisperer-header {
        padding: 12px 16px;
        background-color: #f44336;
        color: white;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .console-whisperer-content {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .console-whisperer-section {
        margin-bottom: 16px;
      }
      
      .console-whisperer-section-title {
        font-weight: bold;
        margin-bottom: 8px;
        color: #333;
      }
      
      .console-whisperer-error {
        background-color: #ffebee;
        padding: 8px;
        border-radius: 4px;
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .console-whisperer-explanation {
        color: #333;
      }
      
      .console-whisperer-fix {
        background-color: #e8f5e9;
        padding: 8px;
        border-radius: 4px;
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .console-whisperer-links {
        list-style-type: none;
        padding: 0;
      }
      
      .console-whisperer-link {
        margin-bottom: 8px;
      }
      
      .console-whisperer-link a {
        color: #2196f3;
        text-decoration: none;
      }
      
      .console-whisperer-link a:hover {
        text-decoration: underline;
      }
      
      .console-whisperer-footer {
        padding: 12px 16px;
        background-color: #f5f5f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #e0e0e0;
      }
      
      .console-whisperer-button {
        padding: 8px 12px;
        background-color: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .console-whisperer-button:hover {
        background-color: #1976d2;
      }
      
      .console-whisperer-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(this.container);
  }
  
  show(errorData, explanation, fix, links) {
    this.currentError = { errorData, explanation, fix, links };
    this.render();
    this.container.style.display = 'block';
    this.isVisible = true;
  }
  
  hide() {
    this.container.style.display = 'none';
    this.isVisible = false;
  }
  
  render() {
    if (!this.currentError) return;
    
    const { errorData, explanation, fix, links } = this.currentError;
    
    this.container.innerHTML = `
      <div class="console-whisperer-header">
        <div>JavaScript Error Detected</div>
        <button class="console-whisperer-close" id="console-whisperer-close">×</button>
      </div>
      <div class="console-whisperer-content">
        <div class="console-whisperer-section">
          <div class="console-whisperer-section-title">❗ Error</div>
          <div class="console-whisperer-error">${escapeHtml(errorData.message)}</div>
        </div>
        <div class="console-whisperer-section">
          <div class="console-whisperer-section-title">💡 Explanation</div>
          <div class="console-whisperer-explanation">${escapeHtml(explanation)}</div>
        </div>
        ${fix ? `
          <div class="console-whisperer-section">
            <div class="console-whisperer-section-title">🛠 Suggested Fix</div>
            <div class="console-whisperer-fix">${escapeHtml(fix)}</div>
          </div>
        ` : ''}
        ${links && links.length > 0 ? `
          <div class="console-whisperer-section">
            <div class="console-whisperer-section-title">🔗 Helpful Links</div>
            <ul class="console-whisperer-links">
              ${links.map(link => `
                <li class="console-whisperer-link">
                  <a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.title)}</a>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      <div class="console-whisperer-footer">
        ${fix ? `<button class="console-whisperer-button" id="console-whisperer-copy">Copy Fix</button>` : ''}
        <div>Powered by Console Whisperer</div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('console-whisperer-close').addEventListener('click', () => this.hide());
    
    if (fix) {
      document.getElementById('console-whisperer-copy').addEventListener('click', () => {
        navigator.clipboard.writeText(fix).then(() => {
          alert('Fix copied to clipboard!');
        });
      });
    }
  }
}

// Helper function to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Export the overlay
export const errorOverlay = new ErrorOverlay();
