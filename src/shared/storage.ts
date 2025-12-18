// src/shared/storage.ts

import type { Template, Settings } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEYS, CHROME_STORAGE_LIMITS, EXTENSION_INFO } from './constants';

/**
 * Chrome Storage API Wrapper with automatic chunking support
 */
export class ChromeStorage {
  /**
   * Initialize storage with default values
   */
  static async initialize(): Promise<void> {
    try {
      const data = await chrome.storage.sync.get(null);
      
      // Initialize metadata if not exists
      if (!data[STORAGE_KEYS.METADATA]) {
        await chrome.storage.sync.set({
          [STORAGE_KEYS.METADATA]: {
            version: EXTENSION_INFO.SCHEMA_VERSION,
            installDate: new Date().toISOString(),
          },
        });
      }
      
      // Initialize settings if not exists
      if (!data[STORAGE_KEYS.SETTINGS]) {
        await chrome.storage.sync.set({
          [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS,
        });
      }
      
      // Initialize templates if not exists
      if (!data[STORAGE_KEYS.TEMPLATES]) {
        await chrome.storage.sync.set({
          [STORAGE_KEYS.TEMPLATES]: [],
        });
      }
    } catch (error) {
      console.error('Storage initialization error:', error);
      throw error;
    }
  }

  /**
   * Get all templates with automatic chunk reconstruction
   */
  static async getTemplates(): Promise<Template[]> {
    try {
      const data = await chrome.storage.sync.get(null);
      
      // Check if templates are not chunked
      if (data[STORAGE_KEYS.TEMPLATES]) {
        return data[STORAGE_KEYS.TEMPLATES];
      }
      
      // Check if templates are chunked
      if (data.templates_count) {
        const chunks: string[] = [];
        
        for (let i = 0; i < data.templates_count; i++) {
          const chunk = data[`templates_chunk_${i}`];
          if (chunk) {
            chunks.push(chunk);
          }
        }
        
        if (chunks.length > 0) {
          const json = chunks.join('');
          return JSON.parse(json);
        }
      }
      
      return [];
    } catch (error) {
      console.error('Get templates error:', error);
      return [];
    }
  }

  /**
   * Save templates with automatic chunking if needed
   */
  static async saveTemplates(templates: Template[]): Promise<void> {
    try {
      const json = JSON.stringify(templates);
      const size = new Blob([json]).size;
      
      // Clear any existing chunks first
      await this.clearTemplateChunks();
      
      if (size < CHROME_STORAGE_LIMITS.CHUNK_SIZE) {
        // No chunking needed
        await chrome.storage.sync.set({
          [STORAGE_KEYS.TEMPLATES]: templates,
        });
      } else {
        // Need to chunk
        const chunks: string[] = [];
        let offset = 0;
        
        while (offset < json.length) {
          chunks.push(json.slice(offset, offset + CHROME_STORAGE_LIMITS.CHUNK_SIZE));
          offset += CHROME_STORAGE_LIMITS.CHUNK_SIZE;
        }
        
        // Save chunks
        const chunkData: Record<string, any> = {
          templates_count: chunks.length,
        };
        
        chunks.forEach((chunk, index) => {
          chunkData[`templates_chunk_${index}`] = chunk;
        });
        
        await chrome.storage.sync.set(chunkData);
      }
    } catch (error) {
      console.error('Save templates error:', error);
      throw error;
    }
  }

  /**
   * Clear template chunks from storage
   */
  private static async clearTemplateChunks(): Promise<void> {
    const data = await chrome.storage.sync.get(null);
    const keysToRemove: string[] = [STORAGE_KEYS.TEMPLATES];
    
    // Find all chunk keys
    Object.keys(data).forEach(key => {
      if (key.startsWith('templates_chunk_') || key === 'templates_count') {
        keysToRemove.push(key);
      }
    });
    
    if (keysToRemove.length > 0) {
      await chrome.storage.sync.remove(keysToRemove);
    }
  }

  /**
   * Get a single template by ID
   */
  static async getTemplate(id: string): Promise<Template | null> {
    const templates = await this.getTemplates();
    return templates.find(t => t.id === id) || null;
  }

  /**
   * Add a new template
   */
  static async addTemplate(template: Template): Promise<void> {
    const templates = await this.getTemplates();
    templates.push(template);
    await this.saveTemplates(templates);
  }

  /**
   * Update an existing template
   */
  static async updateTemplate(updatedTemplate: Template): Promise<void> {
    const templates = await this.getTemplates();
    const index = templates.findIndex(t => t.id === updatedTemplate.id);
    
    if (index !== -1) {
      templates[index] = updatedTemplate;
      await this.saveTemplates(templates);
    } else {
      throw new Error('Template not found');
    }
  }

  /**
   * Delete a template by ID
   */
  static async deleteTemplate(id: string): Promise<void> {
    const templates = await this.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    await this.saveTemplates(filtered);
  }

  /**
   * Increment usage count for a template
   */
  static async incrementUsage(id: string): Promise<void> {
    const templates = await this.getTemplates();
    const template = templates.find(t => t.id === id);
    
    if (template) {
      template.usageCount += 1;
      template.updatedAt = new Date().toISOString();
      await this.saveTemplates(templates);
    }
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(id: string): Promise<void> {
    const templates = await this.getTemplates();
    const template = templates.find(t => t.id === id);
    
    if (template) {
      template.isFavorite = !template.isFavorite;
      template.updatedAt = new Date().toISOString();
      await this.saveTemplates(templates);
    }
  }

  /**
   * Get settings
   */
  static async getSettings(): Promise<Settings> {
    try {
      const data = await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS);
      return data[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Get settings error:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Update settings
   */
  static async updateSettings(settings: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await chrome.storage.sync.set({
        [STORAGE_KEYS.SETTINGS]: updatedSettings,
      });
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  /**
   * Get storage metadata
   */
  static async getMetadata() {
    try {
      const data = await chrome.storage.sync.get(STORAGE_KEYS.METADATA);
      return data[STORAGE_KEYS.METADATA] || null;
    } catch (error) {
      console.error('Get metadata error:', error);
      return null;
    }
  }

  /**
   * Update last backup timestamp
   */
  static async updateLastBackup(): Promise<void> {
    const metadata = await this.getMetadata();
    if (metadata) {
      metadata.lastBackup = new Date().toISOString();
      await chrome.storage.sync.set({
        [STORAGE_KEYS.METADATA]: metadata,
      });
    }
  }

  /**
   * Clear all data (use with caution!)
   */
  static async clearAll(): Promise<void> {
    await chrome.storage.sync.clear();
    await this.initialize();
  }

  /**
   * Listen to storage changes
   */
  static onChanged(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        callback(changes);
      }
    });
  }
}
