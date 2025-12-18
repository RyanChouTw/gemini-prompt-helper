// src/popup/Popup.tsx
import { useState, useEffect } from 'react';
import { ChromeStorage } from '../shared/storage';
import type { Template, CategoryType } from '../shared/types';
import { CATEGORY_CONFIG } from '../shared/constants';
import TemplateCard from './components/TemplateCard';
import TemplateEditor from './components/TemplateEditor';
import { Search, Plus, Settings } from 'lucide-react';

export default function Popup() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await ChromeStorage.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = category === 'all' || t.category === category;
    const matchesSearch =
      searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleSaveTemplate = async (template: Template) => {
    try {
      if (editingTemplate) {
        // Update existing
        await ChromeStorage.updateTemplate(template);
      } else {
        // Add new
        await ChromeStorage.addTemplate(template);
      }
      await loadTemplates();
      setShowEditor(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await ChromeStorage.deleteTemplate(id);
      await loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await ChromeStorage.toggleFavorite(id);
      await loadTemplates();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleCopyTemplate = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      
      // Also try to apply to Gemini if on Gemini page
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url?.includes('gemini.google.com')) {
        // Send message to content script
        chrome.tabs.sendMessage(tab.id!, {
          type: 'APPLY_TEMPLATE',
          payload: { content },
        });
        alert('Template copied and applied to Gemini!');
      } else {
        alert('Template copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy template');
    }
  };

  const categoryStats = templates.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<CategoryType, number>);
  
  // Add total count for 'all' category
  categoryStats['all'] = templates.length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            ✨ Gemini Prompt Helper
          </h1>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Settings"
          >
            <Settings size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </header>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-2 py-2">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setCategory(key as CategoryType)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
                category === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {config.icon} {config.label} ({categoryStats[key as CategoryType] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
            <p className="text-sm text-gray-500 mt-2">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || category !== 'all' ? 'No templates found' : 'No templates yet'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || category !== 'all'
                ? 'Try adjusting your search or category filter'
                : 'Create your first template to get started'}
            </p>
            {!searchQuery && category === 'all' && (
              <button
                onClick={handleNewTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Plus size={18} />
                Create Template
              </button>
            )}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onCopy={handleCopyTemplate}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleNewTemplate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
        >
          <Plus size={18} />
          New Template
        </button>
      </footer>

      {/* Template Editor Modal */}
      {showEditor && (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onClose={() => {
            setShowEditor(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
}
