# 🚀 Quick Start Guide - MVP Version

## ✅ What's Included in MVP

This MVP (Minimum Viable Product) version includes:

### Core Features ✨
- ✅ **Template Library** - Store and manage prompt templates
- ✅ **Category System** - Organize by Text, Image, Video, Code, Data, Custom
- ✅ **Search & Filter** - Find templates quickly
- ✅ **Create/Edit/Delete** - Full CRUD operations
- ✅ **Tags & Favorites** - Organize templates your way
- ✅ **Copy to Clipboard** - One-click copy
- ✅ **Auto-Apply to Gemini** - Automatically fill Gemini input (when on Gemini page)
- ✅ **Import/Export** - Backup and share templates (JSON format)
- ✅ **Settings Page** - Configure extension behavior

### What's NOT Included Yet 🚧
- ❌ Floating optimize button on Gemini
- ❌ Optimization suggestions modal
- ❌ Right-click context menu save
- ❌ Variable substitution UI
- ❌ Advanced Gemini integration

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd gemini-prompt-helper
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This will create a `dist/` folder with the compiled extension.

### 3. Load in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **"Developer mode"** (top right toggle)
4. Click **"Load unpacked"**
5. Select the `dist/` folder
6. Done! 🎉

---

## 🎯 How to Use

### Creating Your First Template

1. **Click the extension icon** in your Chrome toolbar
2. Click **"+ New Template"**
3. Fill in the details:
   - **Title**: e.g., "Professional Blog Post"
   - **Category**: Select appropriate category
   - **Content**: Write your prompt template
   - **Tags**: Add tags for easy searching (optional)
4. Click **"Create Template"**

### Using Templates

**Method 1: Copy to Clipboard**
1. Browse your templates
2. Click the **Copy icon** (📋) on any template
3. Paste wherever you need it

**Method 2: Auto-Apply to Gemini** (Recommended)
1. **Open Gemini** in a tab ([gemini.google.com](https://gemini.google.com))
2. **Open the extension** (click the icon)
3. Click the **Copy icon** on any template
4. The template will be **automatically filled** into Gemini input!
5. Press Enter to send

### Searching Templates

1. Use the search bar at the top
2. Search by title, content, or tags
3. Filter by category using the tabs

### Managing Templates

- **Edit**: Click the edit icon (✏️)
- **Delete**: Click the trash icon (🗑️) 
- **Favorite**: Click the star (⭐)

### Import/Export

**Export (Backup):**
1. Click extension icon → **Settings icon** (⚙️)
2. Scroll to **"Import / Export"**
3. Click **"Export All Templates"**
4. A JSON file will be downloaded

**Import (Restore):**
1. Go to Settings page
2. Click **"Choose File to Import"**
3. Select your JSON export file
4. Templates will be merged with existing ones

---

## 💡 Tips & Tricks

### Use Variables in Templates

You can use variables in your templates:

```
Write a blog post about [TOPIC] for [AUDIENCE].

Style: [STYLE]
Length: [LENGTH] words
```

**Note:** In MVP, you'll need to manually replace `[VARIABLE]` with actual values.
The full version will have a UI for this!

### Organize with Tags

Use tags to organize templates:
- `#urgent` - Important templates
- `#work` - Work-related
- `#personal` - Personal use
- `#tested` - Verified prompts

### Best Practices

1. **Be Descriptive** - Use clear titles
2. **Add Examples** - Include example outputs in content
3. **Use Categories** - Helps with organization
4. **Export Regularly** - Backup your templates
5. **Favorite Often Used** - Star your go-to templates

---

## 🐛 Troubleshooting

### Extension Not Working?

**Problem**: Templates not loading
**Solution**: 
1. Check Chrome DevTools Console (F12)
2. Look for errors
3. Try reloading the extension

**Problem**: Can't apply to Gemini
**Solution**:
1. Make sure you're on `gemini.google.com`
2. Refresh the Gemini page
3. Try manually copying if auto-apply fails

**Problem**: Import failed
**Solution**:
1. Check JSON file format
2. Make sure it's an export from this extension
3. Try exporting first to see correct format

### Development Mode

If you want to develop/modify:

```bash
# Start development server (auto-rebuild)
npm run dev

# The extension will auto-update in Chrome!
```

---

## 🎨 Customization

### Adding More Templates

You can share template collections! Just export and share the JSON file.

### Modifying Categories

Edit `src/shared/constants.ts` to add/modify categories.

---

## 📊 Project Structure

```
gemini-prompt-helper/
├── src/
│   ├── popup/           # Main UI
│   │   ├── Popup.tsx
│   │   └── components/
│   │       ├── TemplateCard.tsx
│   │       └── TemplateEditor.tsx
│   ├── options/         # Settings page
│   │   └── Options.tsx
│   ├── content/         # Gemini page integration
│   │   └── content.ts
│   ├── background/      # Background worker
│   │   └── background.ts
│   └── shared/          # Utilities (COMPLETE)
│       ├── storage.ts   # Chrome Storage wrapper
│       ├── optimizer.ts # Prompt optimizer
│       ├── types.ts     # TypeScript types
│       ├── constants.ts # Constants
│       └── utils.ts     # Helper functions
├── public/
│   └── manifest.json    # Extension configuration
└── package.json
```

---

## 🚀 Next Steps

Want to add more features? Check out:

1. **IMPLEMENTATION_GUIDE.md** - Full feature roadmap
2. **Architecture docs** - Technical details
3. **GitHub Issues** - Feature requests

---

## 🤝 Contributing

Want to improve the MVP?

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 License

MIT License - Feel free to use and modify!

---

## ❤️ Support

If you find this helpful:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 📢 Share with others

---

**Happy Prompting! ✨**

Need help? Check the README.md or open an issue on GitHub.
