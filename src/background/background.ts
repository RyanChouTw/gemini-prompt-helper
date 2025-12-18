// src/background/background.ts

import { ChromeStorage } from '../shared/storage';
import { GeminiApiService } from '../shared/gemini-api';
import type { Template } from '../shared/types';

console.log('Gemini Prompt Helper - Background service worker loaded');

// Initialize storage on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // Initialize storage with defaults
    await ChromeStorage.initialize();
    
    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }
});

// Create context menu for saving templates from web pages
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-as-template',
    title: '💾 Save as Prompt Template',
    contexts: ['selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-as-template' && info.selectionText) {
    // Send message to content script to show save dialog
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'SHOW_SAVE_DIALOG',
        payload: {
          content: info.selectionText,
          sourceUrl: info.pageUrl,
        },
      });
    }
  }
});

// Handle messages from popup, options, or content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('📨 Background: Received message:', message.type, 'from:', _sender.tab ? `tab ${_sender.tab.id}` : 'extension');
  
  // Handle async operations
  (async () => {
    try {
      switch (message.type) {
        case 'GET_TEMPLATES': {
          const templates = await ChromeStorage.getTemplates();
          sendResponse({ templates });
          break;
        }
        
        case 'SAVE_TEMPLATE': {
          const template: Template = message.payload;
          await ChromeStorage.addTemplate(template);
          sendResponse({ success: true, template });
          break;
        }
        
        case 'UPDATE_TEMPLATE': {
          const template: Template = message.payload;
          await ChromeStorage.updateTemplate(template);
          sendResponse({ success: true, template });
          break;
        }
        
        case 'DELETE_TEMPLATE': {
          const { id } = message.payload;
          await ChromeStorage.deleteTemplate(id);
          sendResponse({ success: true });
          break;
        }
        
        case 'INCREMENT_USAGE': {
          const { id } = message.payload;
          await ChromeStorage.incrementUsage(id);
          sendResponse({ success: true });
          break;
        }
        
        case 'TOGGLE_FAVORITE': {
          const { id } = message.payload;
          await ChromeStorage.toggleFavorite(id);
          sendResponse({ success: true });
          break;
        }
        
        case 'OPTIMIZE_PROMPT': {
          console.log('🎆 Background: Processing OPTIMIZE_PROMPT request');
          const { text, useApi } = message.payload;
          
          console.log('📋 Background: Request details:', {
            textLength: text?.length || 0,
            textPreview: text?.slice(0, 50) + '...',
            useApi,
            messageType: message.type
          });
          
          // Use Gemini API for optimization
          console.log('🌐 Background: Using Gemini API for optimization');
          const settings = await ChromeStorage.getSettings();
          
          console.log('🔑 Background: API Key status:', {
            hasApiKey: !!settings.geminiApiKey,
            apiKeyLength: settings.geminiApiKey?.length || 0
          });
          
          if (!settings.geminiApiKey) {
            console.error('❌ Background: No API key configured');
            sendResponse({
              success: false,
              error: 'Gemini API key not configured. Please add your API key in extension options.'
            });
            break;
          }
          
          console.log('🤖 Background: Creating GeminiApiService and calling API...');
          const apiService = new GeminiApiService(settings.geminiApiKey);
          const apiResult = await apiService.optimizePrompt(text);
          
          console.log('📊 Background: API result:', {
            success: apiResult.success,
            error: apiResult.error,
            hasOptimizedPrompt: !!apiResult.optimizedPrompt,
            suggestionsCount: apiResult.suggestions?.length || 0,
            missingInfoCount: apiResult.missingInfo?.length || 0
          });
          
          if (apiResult.success) {
            sendResponse({
              success: true,
              optimizedText: apiResult.optimizedPrompt,
              suggestions: apiResult.suggestions?.map(s => ({ 
                type: 'specificity' as const,
                title: 'API Suggestion',
                description: s,
                priority: 'medium' as const
              })) || [],
              missingInfo: apiResult.missingInfo
            });
          } else {
            sendResponse({
              success: false,
              error: apiResult.error || 'API optimization failed'
            });
          }
          break;
        }
        
        case 'GET_SETTINGS': {
          const settings = await ChromeStorage.getSettings();
          sendResponse({ settings });
          break;
        }
        
        case 'UPDATE_SETTINGS': {
          await ChromeStorage.updateSettings(message.payload);
          const settings = await ChromeStorage.getSettings();
          sendResponse({ success: true, settings });
          break;
        }
        
        default:
          console.warn('Unknown message type:', message.type);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Background message handler error:', error);
      sendResponse({ success: false, error: String(error) });
    }
  })();
  
  // Return true to indicate async response
  return true;
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
  // Popup will open automatically due to manifest configuration
});

// Export empty object to satisfy module requirements
export {};
