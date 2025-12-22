# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Gemini Prompt Helper is a Chrome Extension (Manifest V3) built with React 18 + TypeScript that helps users optimize their Gemini prompts and manage reusable templates. The extension integrates with gemini.google.com to provide prompt optimization and template management features.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot module replacement
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Type checking without emitting files
npm run type-check

# Preview production build
npm run preview
```

## Architecture Overview

### Extension Components
- **Popup UI** (`src/popup/`) - Main extension interface for template management
- **Content Script** (`src/content/`) - Injected into Gemini pages for optimization features  
- **Background Service Worker** (`src/background/`) - Handles context menus and messaging
- **Options Page** (`src/options/`) - Settings and configuration
- **Shared Utilities** (`src/shared/`) - Common code used across components

### Key Files and Their Purpose
- `src/shared/storage.ts` - Chrome Storage API wrapper with automatic chunking for large template arrays
- `src/shared/optimizer.ts` - Prompt optimization engine with category detection and rule-based suggestions
- `src/shared/types.ts` - TypeScript type definitions for the entire application
- `src/shared/constants.ts` - Application constants and configuration
- `vite.config.ts` - Vite configuration with web extension plugin
- `public/manifest.json` - Chrome Extension manifest file

### Data Architecture
Templates are stored using Chrome Storage Sync API with automatic chunking when data exceeds Chrome's 100KB limit per item. The storage system supports:
- Template CRUD operations with usage tracking
- Cross-device synchronization via Chrome Storage Sync
- Import/export functionality for backup and sharing
- Automatic chunking for large template collections

### Prompt Optimization System
The optimizer uses rule-based analysis to:
- Detect prompt categories (image, video, general content)
- Generate specific suggestions based on category
- Provide structured templates for different content types
- Maintain priority-ordered improvement recommendations

## Development Notes

### Chrome Extension Structure
This is a Manifest V3 extension with these key permissions:
- `storage` - For saving templates and settings
- `contextMenus` - For right-click save functionality
- `activeTab` - For reading selected text

### Technology Stack
- **Framework**: React 18 with TypeScript 5.3+
- **Build Tool**: Vite 5 with vite-plugin-web-extension
- **Styling**: Tailwind CSS
- **Storage**: Chrome Storage Sync API
- **Target**: Chrome browsers with Gemini page integration

### Important Patterns
- All Chrome API calls are wrapped in the `ChromeStorage` class
- Message passing between components uses typed message interfaces
- Template variables support dynamic placeholders with `[VARIABLE]` syntax
- Storage operations include error handling and fallback mechanisms

### Testing the Extension
After building, load the `dist/` folder as an unpacked extension in Chrome:
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" 
4. Select the `dist/` folder

### Code Organization
- Keep shared utilities in `src/shared/`
- UI components specific to popup go in `src/popup/components/`
- Content script logic stays in `src/content/`
- Background worker code in `src/background/`