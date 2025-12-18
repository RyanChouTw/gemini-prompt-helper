# Gemini Prompt Helper Chrome Extension

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-yellow.svg)

**Optimize your Gemini prompts and manage reusable templates for better AI results**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing)

</div>

---

## ✨ Features

### 🎯 Prompt Optimization
- **Smart Suggestions**: Get intelligent recommendations to improve your prompts
- **Category Detection**: Automatically detects if you're generating text, images, videos, code, or data
- **Best Practices**: Built-in optimization rules for each category
- **One-Click Apply**: Instantly fill optimized prompts into Gemini

### 📚 Template Library
- **Save & Reuse**: Store your best prompts as reusable templates
- **Organize by Category**: Text, Image, Video, Code, Data, and Custom
- **Tag System**: Add tags for easy searching and filtering
- **Usage Tracking**: See which templates you use most
- **Favorites**: Star your most important templates

### 💾 Save from Web
- **Right-Click Save**: Capture great prompts from Reddit, Twitter, blogs, anywhere!
- **Auto-Fill Dialog**: Title, category, and content pre-filled
- **Source Tracking**: Remember where you found each prompt

### 🔧 Powerful Features
- **Variable Support**: Use `[VARIABLE]` placeholders for dynamic content
- **Import/Export**: Backup and share your template library (JSON)
- **Search & Filter**: Quickly find the template you need
- **Compact View**: Save space with a condensed display option
- **Cross-Device Sync**: Templates sync across your Chrome browsers (via Chrome Storage Sync)

---

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Click "Add to Chrome"
3. Start using!

### Development Install
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/gemini-prompt-helper.git
   cd gemini-prompt-helper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

---

## 📖 Usage

### 1. Optimize Your Prompts on Gemini

1. Go to [gemini.google.com](https://gemini.google.com)
2. Start typing a prompt
3. Click the **✨ Optimize** button that appears
4. Review suggestions and apply the optimized version

### 2. Manage Templates

1. Click the extension icon in your toolbar
2. Browse templates by category
3. Click "Use Template" to apply to Gemini
4. Click "+ New Template" to create your own

### 3. Save Prompts from Anywhere

1. Find a great prompt on any website
2. Select the text
3. Right-click and choose "💾 Save as Prompt Template"
4. Fill in details and save!

### 4. Import/Export Templates

1. Click the extension icon
2. Open Settings (⚙️ icon)
3. Go to "Import/Export" tab
4. Export your templates as JSON
5. Share with team or backup

---

## 💻 Development

### Project Structure

```
gemini-prompt-helper/
├── public/
│   ├── manifest.json           # Extension manifest
│   └── icons/                  # Extension icons
├── src/
│   ├── popup/                  # Main UI (template library)
│   ├── options/                # Settings page
│   ├── content/                # Gemini page integration
│   ├── background/             # Background service worker
│   └── shared/                 # Shared utilities
│       ├── storage.ts          # Chrome Storage wrapper
│       ├── optimizer.ts        # Prompt optimization engine
│       ├── types.ts            # TypeScript types
│       ├── constants.ts        # Constants
│       └── utils.ts            # Utility functions
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Extension**: Manifest V3
- **Storage**: Chrome Storage Sync API

### Development Commands

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

### Key Components

#### Storage Layer (`src/shared/storage.ts`)
- Automatic chunking for large template arrays
- Chrome Storage Sync API wrapper
- CRUD operations for templates

#### Optimizer (`src/shared/optimizer.ts`)
- Category detection algorithm
- Optimization rules for each category
- Suggestion generation

#### Background Worker (`src/background/background.ts`)
- Context menu integration
- Message handling
- Storage initialization

---

## 🎨 Design

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Accent**: Purple (#8B5CF6)
- **Category Colors**:
  - Text: Green (#10B981)
  - Image: Amber (#F59E0B)
  - Video: Red (#EF4444)
  - Code: Indigo (#6366F1)
  - Data: Purple (#8B5CF6)

### Typography
- **Font**: Inter, system-ui
- **Sizes**: 10px - 24px

---

## 📝 Implementation Status

### ✅ Completed
- [x] Project setup and configuration
- [x] TypeScript types and interfaces
- [x] Chrome Storage wrapper with chunking
- [x] Prompt optimization engine
- [x] Utility functions
- [x] Background service worker
- [x] Manifest V3 configuration
- [x] Build system (Vite + Tailwind)

### 🚧 In Progress
- [ ] Popup UI components
- [ ] Content script for Gemini integration
- [ ] Options page
- [ ] Testing and bug fixes

### 📋 Planned
- [ ] Chrome Web Store submission
- [ ] User documentation
- [ ] Tutorial videos
- [ ] Community template marketplace

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ryan Chou**
- Email: ryanchou0210@gmail.com

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📸 Screenshots

### Popup Interface
![Popup](screenshots/popup.png)

### Optimization Modal
![Optimization](screenshots/optimization.png)

### Template Editor
![Editor](screenshots/editor.png)

---

## 🐛 Known Issues

- Content script may need refresh on some Gemini UI updates
- Large template libraries (500+) may experience slight sync delay

---

## 🗺️ Roadmap

### Version 1.1
- [ ] AI-powered optimization (optional Claude API integration)
- [ ] Keyboard shortcuts
- [ ] Multi-language support

### Version 1.2
- [ ] Cloud sync with backend
- [ ] Template analytics
- [ ] Team collaboration features

### Version 2.0
- [ ] Community template marketplace
- [ ] AI model comparison
- [ ] Advanced prompt engineering features

---

<div align="center">

**Made with ❤️ for the AI community**

[Report Bug](https://github.com/yourusername/gemini-prompt-helper/issues) • [Request Feature](https://github.com/yourusername/gemini-prompt-helper/issues) • [Documentation](https://github.com/yourusername/gemini-prompt-helper/wiki)

</div>
