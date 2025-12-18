// src/shared/constants.ts

import type { CategoryType, Settings } from './types';

/**
 * Category metadata
 */
export const CATEGORY_CONFIG: Record<CategoryType, {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
}> = {
  all: {
    icon: '🌟',
    label: 'All',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  image: {
    icon: '🎨',
    label: 'Image',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  video: {
    icon: '🎬',
    label: 'Video',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  custom: {
    icon: '⭐',
    label: 'Custom',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
};

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: Settings = {
  floatingButtonEnabled: true,
  buttonPosition: 'bottom-right',
  defaultCategory: 'all',
  autoOptimize: true,
  theme: 'auto',
  compactView: false,
  confirmDelete: true,
};

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  TEMPLATES: 'templates',
  SETTINGS: 'settings',
  METADATA: 'metadata',
} as const;

/**
 * Template limits
 */
export const LIMITS = {
  TITLE_MAX_LENGTH: 100,
  CONTENT_MAX_LENGTH: 5000,
  TAG_MAX_LENGTH: 30,
  MAX_TAGS: 10,
} as const;

/**
 * Chrome Storage limits
 */
export const CHROME_STORAGE_LIMITS = {
  SYNC_QUOTA_BYTES: 102400, // 100KB
  SYNC_ITEM_MAX_SIZE: 8192, // 8KB
  CHUNK_SIZE: 90 * 1024, // 90KB for safety
} as const;

/**
 * Extension metadata
 */
export const EXTENSION_INFO = {
  NAME: 'Gemini Prompt Helper',
  VERSION: '1.0.0',
  SCHEMA_VERSION: '1.0',
} as const;

/**
 * Gemini page selectors (with fallbacks)
 */
export const GEMINI_SELECTORS = {
  INPUT_BOX: [
    'textarea[aria-label*="message"]',
    'textarea[placeholder*="enter"]',
    'div[contenteditable="true"][role="textbox"]',
    '.ql-editor',
  ],
  SEND_BUTTON: [
    'button[aria-label*="send"]',
    'button[type="submit"]',
  ],
} as const;
