/**
 * Console Whisperer - UI Templates
 * 
 * This module provides HTML templates for UI components.
 */

// Helper function to escape HTML
export function escapeHtml(str) {
  if (!str) return '';
  
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Error overlay template
export function errorOverlayTemplate(errorData, explanation, fix, links) {
  return `
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
}

// Fix preview template
export function fixPreviewTemplate(originalCode, fixedCode, diff) {
  return `
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
}
