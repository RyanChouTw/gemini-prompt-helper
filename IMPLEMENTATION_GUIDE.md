# Gemini Prompt Helper - Implementation Guide

## ✅ 已產生的檔案

### 專案配置
- ✅ package.json
- ✅ tsconfig.json
- ✅ tsconfig.node.json
- ✅ vite.config.ts
- ✅ tailwind.config.js
- ✅ postcss.config.js
- ✅ public/manifest.json

### Shared Utilities (完整)
- ✅ src/shared/types.ts - TypeScript 類型定義
- ✅ src/shared/constants.ts - 常數定義
- ✅ src/shared/storage.ts - Chrome Storage 封裝
- ✅ src/shared/utils.ts - 工具函式
- ✅ src/shared/optimizer.ts - Prompt 優化引擎

### Background Worker
- ✅ src/background/background.ts - Service Worker 完整實作

## 📝 待實作的檔案清單

由於檔案數量龐大（30+ 個 React 元件），以下是完整的檔案結構和實作指南。
您可以根據範本自行完成，或使用 AI 輔助逐步實作。

### Popup (主要UI - 12個檔案)

```
src/popup/
├── index.html          # HTML 入口
├── index.tsx           # React 入口
├── Popup.tsx           # 主元件
├── popup.css           # Tailwind 樣式
├── components/
│   ├── TemplateList.tsx      # 範本列表
│   ├── TemplateCard.tsx      # 範本卡片
│   ├── TemplateEditor.tsx    # 編輯器 Modal
│   ├── SearchBar.tsx         # 搜尋列
│   ├── CategoryFilter.tsx    # 分類篩選
│   ├── EmptyState.tsx        # 空狀態
│   └── VariableInput.tsx     # 變數輸入
└── hooks/
    ├── useTemplates.ts       # 範本 CRUD hooks
    ├── useSearch.ts          # 搜尋 hooks
    └── useSettings.ts        # 設定 hooks
```

### Content Script (Gemini 頁面整合 - 6個檔案)

```
src/content/
├── content.ts          # 主要 content script
├── content.css         # 注入樣式
├── components/
│   ├── FloatingButton.tsx    # 浮動優化按鈕
│   ├── OptimizationModal.tsx # 優化建議 Modal
│   └── TemplateQuickPick.tsx # 快速選擇範本
└── dom/
    ├── geminiDetector.ts     # 偵測 Gemini 輸入框
    └── domInjector.ts        # DOM 注入工具
```

### Options Page (設定頁面 - 8個檔案)

```
src/options/
├── index.html          # HTML 入口
├── index.tsx           # React 入口
├── Options.tsx         # 主元件
├── options.css         # 樣式
└── components/
    ├── GeneralSettings.tsx   # 一般設定
    ├── TemplateManagement.tsx # 範本管理
    ├── ImportExport.tsx      # 匯入/匯出
    └── AboutSection.tsx      # 關於頁面
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
cd gemini-prompt-helper
npm install
```

### 2. 開發模式

```bash
npm run dev
```

### 3. 在 Chrome 中載入

1. 開啟 Chrome
2. 前往 `chrome://extensions/`
3. 啟用「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選擇 `dist/` 資料夾

### 4. 建置生產版本

```bash
npm run build
```

## 📚 實作參考

### Popup.tsx 範例結構

```typescript
import { useState, useEffect } from 'react';
import { ChromeStorage } from '@/shared/storage';
import type { Template, CategoryType } from '@/shared/types';
import { CATEGORY_CONFIG } from '@/shared/constants';

export default function Popup() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [category, setCategory] = useState<CategoryType>('text');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = async () => {
    const data = await ChromeStorage.getTemplates();
    setTemplates(data);
  };
  
  const filteredTemplates = templates.filter(t => 
    t.category === category &&
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="w-[400px] h-[600px] flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <h1>✨ Gemini Prompt Helper</h1>
        <input 
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mt-2 px-3 py-2 border rounded"
        />
      </header>
      
      {/* Category Tabs */}
      <div className="flex gap-2 p-2 border-b overflow-x-auto">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setCategory(key as CategoryType)}
            className={`px-3 py-2 rounded ${
              category === key ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>
      
      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id} 
            template={template}
            onUse={handleUseTemplate}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
          />
        ))}
      </div>
      
      {/* Footer */}
      <footer className="p-4 border-t flex gap-2">
        <button className="flex-1 bg-blue-500 text-white">
          + New Template
        </button>
        <button className="px-4 border">
          📥 Import
        </button>
      </footer>
    </div>
  );
}
```

### Content Script 範例

```typescript
// src/content/content.ts

import { GEMINI_SELECTORS } from '../shared/constants';
import { waitForElement } from '../shared/utils';

console.log('Gemini Prompt Helper - Content script loaded');

// Wait for Gemini input box
waitForElement(GEMINI_SELECTORS.INPUT_BOX[0])
  .then((inputBox) => {
    console.log('Found Gemini input box');
    
    // Inject floating button
    injectFloatingButton(inputBox);
  })
  .catch((error) => {
    console.error('Failed to find Gemini input:', error);
  });

function injectFloatingButton(inputBox: HTMLElement) {
  // Create and inject button
  const button = document.createElement('button');
  button.textContent = '✨ Optimize';
  button.className = 'gemini-prompt-helper-button';
  
  // Position near input box
  const rect = inputBox.getBoundingClientRect();
  button.style.position = 'fixed';
  button.style.top = `${rect.top - 40}px`;
  button.style.left = `${rect.right - 120}px`;
  button.style.zIndex = '9999';
  
  button.addEventListener('click', handleOptimizeClick);
  
  document.body.appendChild(button);
}

async function handleOptimizeClick() {
  // Get prompt from input
  // Send to background for optimization
  // Show modal with results
}
```

## ⚡ 加速開發建議

### 選項 1: 使用 AI 輔助
讓 AI (如 Claude/ChatGPT) 逐個產生剩餘元件。
提示範例: "根據 IMPLEMENTATION_GUIDE.md，產生 TemplateCard.tsx 元件"

### 選項 2: 使用現有範本
參考 `/home/claude/fullstack-agent/references/chrome_extension_template.md`

### 選項 3: 簡化版本
先實作核心功能（儲存、列表、套用），UI 可以簡化。

## 🎯 MVP 最小可行功能

如果時間有限，優先實作：

1. ✅ Popup - 顯示範本列表（已有結構）
2. ✅ 儲存範本到 Chrome Storage（已完成）
3. ✅ 從 Popup 選擇並套用範本
4. Content Script - 注入 Gemini 頁面（基礎版）

進階功能可以後續添加：
- 優化建議 Modal
- 右鍵選單儲存
- 匯入/匯出
- 變數替換
