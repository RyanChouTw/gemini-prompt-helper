// src/shared/types.ts

/**
 * Template Category Types
 */
export type CategoryType = 
  | 'all'        // All types of prompts
  | 'image'      // Image generation prompts
  | 'video'      // Video generation prompts
  | 'custom';    // User-defined category

/**
 * Template Variable for dynamic content
 */
export interface TemplateVariable {
  name: string;           // e.g., "SUBJECT"
  label: string;          // e.g., "Main Subject"
  defaultValue?: string;  // Optional default
  required: boolean;      // Is this variable required?
}

/**
 * Main Template Model
 */
export interface Template {
  id: string;                    // UUID v4
  title: string;                 // Max 100 chars
  category: CategoryType;        // Template category
  content: string;               // Prompt content (max 5000 chars)
  tags: string[];                // Max 10 tags, each max 30 chars
  variables: TemplateVariable[]; // Dynamic placeholders
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  usageCount: number;            // Track how often used
  isFavorite: boolean;           // User favorite flag
  source?: string;               // Optional: URL where saved from
}

/**
 * Category Statistics
 */
export interface CategoryStats {
  category: CategoryType;
  count: number;
  lastUsed?: string;
}

/**
 * Extension Settings
 */
export interface Settings {
  // Floating button settings
  floatingButtonEnabled: boolean;
  buttonPosition: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  
  // Default behavior
  defaultCategory: CategoryType;
  autoOptimize: boolean;          // Auto-show optimization suggestions
  
  // UI preferences
  theme: 'light' | 'dark' | 'auto';
  compactView: boolean;
  
  // Confirmations
  confirmDelete: boolean;
  
  // Gemini API Configuration
  geminiApiKey?: string;          // User's Gemini API key
}

/**
 * Chrome Storage Schema
 */
export interface StorageSchema {
  templates: Template[];          // Array of all templates
  settings: Settings;             // User settings
  metadata: {
    version: string;              // Data schema version
    lastBackup?: string;          // Last export timestamp
    installDate: string;          // Extension install date
  };
}

/**
 * Optimization Suggestion
 */
export interface OptimizationSuggestion {
  type: 'structure' | 'clarity' | 'specificity' | 'format';
  title: string;
  description: string;
  example?: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Optimization Result
 */
export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  suggestions: OptimizationSuggestion[];
  detectedCategory: CategoryType;
  improvements: string[];         // List of improvements made
  missingInfo?: string[];         // Questions for user to provide more info
  confidence?: number;            // API confidence score (0-1)
}

/**
 * Export/Import Format
 */
export interface ExportData {
  version: string;                // Export format version
  exportDate: string;             // ISO 8601 timestamp
  templates: Template[];
  settings?: Settings;            // Optional settings export
  metadata: {
    totalTemplates: number;
    categories: CategoryStats[];
  };
}

/**
 * Message Types for Chrome messaging
 */
export type MessageType =
  | { type: 'GET_TEMPLATES'; payload?: undefined }
  | { type: 'SAVE_TEMPLATE'; payload: Template }
  | { type: 'DELETE_TEMPLATE'; payload: { id: string } }
  | { type: 'UPDATE_TEMPLATE'; payload: Template }
  | { type: 'APPLY_TEMPLATE'; payload: { content: string } }
  | { type: 'OPTIMIZE_PROMPT'; payload: { text: string; useApi?: boolean } }
  | { type: 'GET_SETTINGS'; payload?: undefined }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> };

export type MessageResponse<T extends MessageType['type']> = 
  T extends 'GET_TEMPLATES' ? { templates: Template[] } :
  T extends 'SAVE_TEMPLATE' ? { success: boolean; template?: Template } :
  T extends 'DELETE_TEMPLATE' ? { success: boolean } :
  T extends 'UPDATE_TEMPLATE' ? { success: boolean; template?: Template } :
  T extends 'APPLY_TEMPLATE' ? { success: boolean } :
  T extends 'OPTIMIZE_PROMPT' ? { success: boolean; optimizedText?: string; suggestions?: OptimizationSuggestion[]; missingInfo?: string[]; error?: string } :
  T extends 'GET_SETTINGS' ? { settings: Settings } :
  T extends 'UPDATE_SETTINGS' ? { success: boolean; settings?: Settings } :
  never;
