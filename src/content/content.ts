// src/content/content.ts

console.log('✨ Gemini Prompt Helper - Content script loaded');

let optimizeButton: HTMLButtonElement | null = null;

// Initialize the extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('Initializing Gemini Prompt Helper...');

  // Watch for the input box to appear
  observeGeminiInput();
}

/**
 * Observe for Gemini input box and add optimize button when found
 */
function observeGeminiInput() {
  let isProcessing = false;
  
  const observer = new MutationObserver(() => {
    // Prevent multiple simultaneous executions
    if (isProcessing) return;
    
    // Skip if button already exists and is in DOM
    if (optimizeButton && document.body.contains(optimizeButton)) {
      return;
    }
    
    isProcessing = true;
    
    try {
      const inputContainer = findInputContainer();
      if (inputContainer) {
        addOptimizeButton(inputContainer);
      }
    } finally {
      isProcessing = false;
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Try immediately in case input already exists
  const inputContainer = findInputContainer();
  if (inputContainer) {
    addOptimizeButton(inputContainer);
  }
}

/**
 * Find the Gemini input container
 */
function findInputContainer(): Element | null {
  // Look for the rich text editor container
  const selectors = [
    'input-area-v2',
    '.text-input-field_textarea-wrapper',
    'input-container',
    'rich-textarea',
    '[contenteditable="true"]',
    'div[role="textbox"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.closest('input-area-v2, input-container, .input-area') || element.parentElement;
    }
  }

  return null;
}

/**
 * Add optimize button near the input box
 */
function addOptimizeButton(container: Element) {
  // Prevent duplicate buttons
  if (optimizeButton && document.body.contains(optimizeButton)) {
    return;
  }

  // Create button
  optimizeButton = document.createElement('button');
  optimizeButton.className = 'gemini-prompt-optimizer-btn';
  optimizeButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6"/>
    </svg>
    <span>Optimize Prompt</span>
  `;
  optimizeButton.title = 'Optimize your prompt with AI';

  optimizeButton.addEventListener('click', handleOptimizeClick);

  // Try to insert button in the specific Angular Material container
  const targetContainer = document.querySelector('[class*="_ngcontent-ng-c"]');
  const matButton = document.querySelector('mat-mdc-button-touch-target');
  
  if (targetContainer && matButton) {
    // Insert button after the mat-mdc-button-touch-target
    matButton.parentElement?.appendChild(optimizeButton);
  } else {
    // Fallback to original logic
    const actionBar = container.querySelector('.action-bar, .input-actions, [class*="button"]');
    if (actionBar) {
      actionBar.appendChild(optimizeButton);
    } else {
      container.appendChild(optimizeButton);
    }
  }
}

/**
 * Handle optimize button click
 */
async function handleOptimizeClick() {
  const inputElement = findInputElement();
  if (!inputElement) {
    alert('Could not find input box');
    return;
  }

  const currentText = getInputText(inputElement);
  if (!currentText.trim()) {
    alert('Please enter some text first');
    return;
  }

  console.log('Optimizing prompt:', currentText);

  // Show loading state
  if (optimizeButton) {
    optimizeButton.disabled = true;
    optimizeButton.textContent = 'Optimizing...';
  }

  try {
    console.log('🚀 Content Script: Sending OPTIMIZE_PROMPT message to background', {
      text: currentText.slice(0, 100) + '...',
      useApi: true
    });
    
    // Send message to background script to optimize (with API by default)
    const response = await chrome.runtime.sendMessage({
      type: 'OPTIMIZE_PROMPT',
      payload: { text: currentText, useApi: true }
    });

    console.log('✅ Content Script: Received response from background', response);

    if (response.success) {
      // Direct replacement - no modal needed
      const optimizedText = response.optimizedText || response.optimizedPrompt || '';
      if (optimizedText && optimizedText !== currentText) {
        console.log('✅ Content Script: Applying optimized prompt directly');
        setInputText(inputElement, optimizedText);
      } else {
        console.warn('⚠️ Content Script: No optimization received or same as original');
      }
    } else {
      // Show error message
      console.warn('❌ Content Script: Optimization failed:', response.error);
      alert('Failed to optimize: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('💥 Content Script: Critical error during optimization:', error);
    alert('Error optimizing prompt. Please try again.');
  } finally {
    // Reset button state
    if (optimizeButton) {
      optimizeButton.disabled = false;
      optimizeButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6"/>
        </svg>
        <span>Optimize Prompt</span>
      `;
    }
  }
}

/**
 * Find the actual input element
 */
function findInputElement(): HTMLElement | null {
  const selectors = [
    'input-area-v2 [contenteditable="true"]',
    '.text-input-field_textarea-wrapper [contenteditable="true"]',
    'input-container [contenteditable="true"]',
    'rich-textarea',
    '[contenteditable="true"]',
    'textarea[aria-label*="message"]',
    'div[role="textbox"]',
    '.text-input-field_textarea-wrapper textarea',
    'input-area-v2 textarea',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      return element;
    }
  }

  return null;
}

/**
 * Get text from input element
 */
function getInputText(element: HTMLElement): string {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    return element.value;
  } else if (element.isContentEditable) {
    return element.textContent || '';
  }
  return '';
}

/**
 * Set text to input element
 */
function setInputText(element: HTMLElement, text: string) {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (element.isContentEditable) {
    element.textContent = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
  element.focus();
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message.type);

  if (message.type === 'APPLY_TEMPLATE') {
    applyTemplateToGemini(message.payload.content);
    sendResponse({ success: true });
  }

  return true;
});

/**
 * Apply template content to Gemini input
 */
function applyTemplateToGemini(content: string) {
  // Try to find Gemini input box
  const selectors = [
    'input-area-v2 [contenteditable="true"]',
    '.text-input-field_textarea-wrapper [contenteditable="true"]',
    'input-container [contenteditable="true"]',
    'textarea[aria-label*="message"]',
    'textarea[placeholder*="enter"]',
    'div[contenteditable="true"][role="textbox"]',
    '.ql-editor',
    '.text-input-field_textarea-wrapper textarea',
    'input-area-v2 textarea',
  ];
  
  let input: HTMLElement | null = null;
  
  for (const selector of selectors) {
    input = document.querySelector(selector) as HTMLElement;
    if (input) break;
  }
  
  if (!input) {
    console.warn('Could not find Gemini input box');
    alert('Could not find Gemini input box. Please make sure you are on Gemini chat page.');
    return;
  }
  
  // Set the content
  if (input instanceof HTMLTextAreaElement) {
    input.value = content;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (input.isContentEditable) {
    input.textContent = content;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  // Focus the input
  input.focus();
  
  console.log('Template applied to Gemini input');
}

// Modal code removed - direct replacement approach used instead

// Export empty object for TypeScript
export {};
