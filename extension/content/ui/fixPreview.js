/**
 * Console Whisperer - Fix Preview
 * 
 * This module provides a preview of code fixes.
 */

// Fix Preview class
class FixPreview {
  constructor() {
    this.container = null;
    this.isVisible = false;
    this.currentFix = null;
    this.initialize();
  }
  
  initialize() {
    // Create the container
    this.container = document.createElement('div');
    this.container.className = 'console-whisperer-fix-preview';
    this.container.style.display = 'none';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .console-whisperer-fix-preview {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      .console-whisperer-fix-preview-header {
        padding: 16px;
        background-color: #2196f3;
        color: white;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .console-whisperer-fix-preview-content {
        padding: 16px;
        max-height: calc(80vh - 120px);
        overflow-y: auto;
      }
      
      .console-whisperer-fix-preview-code {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-x: auto;
      }
      
      .console-whisperer-fix-preview-diff {
        margin-top: 16px;
      }
      
      .console-whisperer-fix-preview-diff-header {
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .console-whisperer-fix-preview-diff-content {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-x: auto;
      }
      
      .console-whisperer-fix-preview-diff-line {
        display: block;
        line-height: 1.5;
      }
      
      .console-whisperer-fix-preview-diff-removed {
        background-color: #ffebee;
        color: #b71c1c;
      }
      
      .console-whisperer-fix-preview-diff-added {
        background-color: #e8f5e9;
        color: #1b5e20;
      }
      
      .console-whisperer-fix-preview-footer {
        padding: 16px;
        background-color: #f5f5f5;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        border-top: 1px solid #e0e0e0;
      }
      
      .console-whisperer-fix-preview-button {
        padding: 8px 16px;
        background-color: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .console-whisperer-fix-preview-button:hover {
        background-color: #1976d2;
      }
      
      .console-whisperer-fix-preview-button-secondary {
        padding: 8px 16px;
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .console-whisperer-fix-preview-button-secondary:hover {
        background-color: #e0e0e0;
      }
      
      .console-whisperer-fix-preview-close {
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
  
  show(originalCode, fixedCode) {
    this.currentFix = { originalCode, fixedCode };
    this.render();
    this.container.style.display = 'block';
    this.isVisible = true;
  }
  
  hide() {
    this.container.style.display = 'none';
    this.isVisible = false;
  }
  
  render() {
    if (!this.currentFix) return;
    
    const { originalCode, fixedCode } = this.currentFix;
    const diff = this.generateDiff(originalCode, fixedCode);
    
    this.container.innerHTML = `
      <div class="console-whisperer-fix-preview-header">
        <div>Fix Preview</div>
        <button class="console-whisperer-fix-preview-close" id="console-whisperer-fix-preview-close">×</button>
      </div>
      <div class="console-whisperer-fix-preview-content">
        <div class="console-whisperer-fix-preview-diff">
          <div class="console-whisperer-fix-preview-diff-header">Changes:</div>
          <div class="console-whisperer-fix-preview-diff-content">
            ${diff}
          </div>
        </div>
        <div class="console-whisperer-fix-preview-code-header">
          <div class="console-whisperer-fix-preview-diff-header">Fixed Code:</div>
          <div class="console-whisperer-fix-preview-code">
            ${escapeHtml(fixedCode)}
          </div>
        </div>
      </div>
      <div class="console-whisperer-fix-preview-footer">
        <button class="console-whisperer-fix-preview-button-secondary" id="console-whisperer-fix-preview-cancel">Cancel</button>
        <button class="console-whisperer-fix-preview-button" id="console-whisperer-fix-preview-copy">Copy Fixed Code</button>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('console-whisperer-fix-preview-close').addEventListener('click', () => this.hide());
    document.getElementById('console-whisperer-fix-preview-cancel').addEventListener('click', () => this.hide());
    document.getElementById('console-whisperer-fix-preview-copy').addEventListener('click', () => {
      navigator.clipboard.writeText(fixedCode).then(() => {
        alert('Fixed code copied to clipboard!');
        this.hide();
      });
    });
  }
  
  generateDiff(originalCode, fixedCode) {
    // Simple line-by-line diff
    const originalLines = originalCode.split('\n');
    const fixedLines = fixedCode.split('\n');
    
    let diffHtml = '';
    
    // Find the longest common prefix
    let prefixLength = 0;
    while (prefixLength < originalLines.length && 
           prefixLength < fixedLines.length && 
           originalLines[prefixLength] === fixedLines[prefixLength]) {
      prefixLength++;
    }
    
    // Find the longest common suffix
    let originalSuffix = originalLines.length - 1;
    let fixedSuffix = fixedLines.length - 1;
    
    while (originalSuffix >= prefixLength && 
           fixedSuffix >= prefixLength && 
           originalLines[originalSuffix] === fixedLines[fixedSuffix]) {
      originalSuffix--;
      fixedSuffix--;
    }
    
    // Add context before changes (up to 2 lines)
    const contextBefore = Math.max(0, prefixLength - 2);
    for (let i = contextBefore; i < prefixLength; i++) {
      diffHtml += `<span class="console-whisperer-fix-preview-diff-line">${escapeHtml(originalLines[i])}</span>`;
    }
    
    // Add removed lines
    for (let i = prefixLength; i <= originalSuffix; i++) {
      diffHtml += `<span class="console-whisperer-fix-preview-diff-line console-whisperer-fix-preview-diff-removed">- ${escapeHtml(originalLines[i])}</span>`;
    }
    
    // Add added lines
    for (let i = prefixLength; i <= fixedSuffix; i++) {
      diffHtml += `<span class="console-whisperer-fix-preview-diff-line console-whisperer-fix-preview-diff-added">+ ${escapeHtml(fixedLines[i])}</span>`;
    }
    
    // Add context after changes (up to 2 lines)
    const contextAfter = Math.min(originalLines.length, originalSuffix + 3);
    for (let i = originalSuffix + 1; i < contextAfter; i++) {
      diffHtml += `<span class="console-whisperer-fix-preview-diff-line">${escapeHtml(originalLines[i])}</span>`;
    }
    
    return diffHtml;
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

// Export the fix preview
export const fixPreview = new FixPreview();
