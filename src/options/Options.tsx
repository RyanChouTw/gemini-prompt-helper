// src/options/Options.tsx
import { useState, useEffect } from 'react';
import { ChromeStorage } from '../shared/storage';
import { downloadJson, parseJsonFile } from '../shared/utils';
import type { Settings, Template, ExportData } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/constants';
import { Download, Upload, Trash2, ExternalLink, Key, Eye, EyeOff } from 'lucide-react';

export default function Options() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unchecked'>('unchecked');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [loadedSettings, loadedTemplates] = await Promise.all([
      ChromeStorage.getSettings(),
      ChromeStorage.getTemplates(),
    ]);
    setSettings(loadedSettings);
    setTemplates(loadedTemplates);
  };

  const handleSaveSettings = async () => {
    try {
      // Validate API key if provided
      if (settings.geminiApiKey) {
        const { GeminiApiService } = await import('../shared/gemini-api');
        if (!GeminiApiService.isValidApiKey(settings.geminiApiKey)) {
          setApiKeyStatus('invalid');
          alert('Please enter a valid Gemini API key');
          return;
        }
        setApiKeyStatus('valid');
      }
      
      await ChromeStorage.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleExport = async () => {
    try {
      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        templates,
        settings,
        metadata: {
          totalTemplates: templates.length,
          categories: [],
        },
      };

      const filename = `gemini-prompt-helper-${new Date().toISOString().split('T')[0]}.json`;
      downloadJson(exportData, filename);
      
      await ChromeStorage.updateLastBackup();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export templates');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseJsonFile(file);
      
      if (!data.templates || !Array.isArray(data.templates)) {
        throw new Error('Invalid export file format');
      }

      // Merge mode: add new templates
      const existingIds = new Set(templates.map(t => t.id));
      const newTemplates = data.templates.filter((t: Template) => !existingIds.has(t.id));
      
      const allTemplates = [...templates, ...newTemplates];
      await ChromeStorage.saveTemplates(allTemplates);
      
      await loadData();
      alert(`Successfully imported ${newTemplates.length} new templates!`);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import templates. Please check the file format.');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL templates? This action cannot be undone!')) {
      return;
    }

    try {
      await ChromeStorage.saveTemplates([]);
      await loadData();
      alert('All templates deleted');
    } catch (error) {
      console.error('Failed to delete templates:', error);
      alert('Failed to delete templates');
    }
  };

  const categoryStats = templates.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✨ Gemini Prompt Helper Settings
          </h1>
          <p className="text-gray-600">
            Manage your templates and configure extension settings
          </p>
        </header>

        {/* API Configuration */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <Key size={20} className="inline mr-2" />
            Gemini API Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.geminiApiKey || ''}
                  onChange={(e) => {
                    setSettings({ ...settings, geminiApiKey: e.target.value });
                    setApiKeyStatus('unchecked');
                  }}
                  placeholder="Enter your Gemini API key..."
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Get your API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
              {apiKeyStatus === 'invalid' && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ Invalid API key format
                </p>
              )}
              {apiKeyStatus === 'valid' && (
                <p className="text-sm text-green-600 mt-1">
                  ✅ Valid API key format
                </p>
              )}
            </div>
            
          </div>
        </section>

        {/* General Settings */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.confirmDelete}
                onChange={(e) =>
                  setSettings({ ...settings, confirmDelete: e.target.checked })
                }
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Confirm before deleting templates
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compactView}
                onChange={(e) =>
                  setSettings({ ...settings, compactView: e.target.checked })
                }
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Use compact view for template cards
              </span>
            </label>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Save Settings
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">✓ Settings saved!</span>
            )}
          </div>
        </section>

        {/* Template Management */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Management</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                <p className="text-xs text-gray-600">Total Templates</p>
              </div>
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category}>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600 capitalize">{category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Import/Export */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Import / Export</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Export Templates</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download all your templates as a JSON file for backup or sharing
              </p>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Download size={18} />
                Export All Templates
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Import Templates</h3>
              <p className="text-sm text-gray-600 mb-3">
                Import templates from a JSON file (will merge with existing templates)
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer">
                <Upload size={18} />
                Choose File to Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-3">
                Permanently delete all templates. This action cannot be undone!
              </p>
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={18} />
                Delete All Templates
              </button>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gemini Prompt Helper</h3>
                <p className="text-sm text-gray-600">Version 1.0.0</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Optimize your Gemini prompts and manage reusable templates for better AI results.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href="https://github.com/yourusername/gemini-prompt-helper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <ExternalLink size={14} />
                GitHub
              </a>
              <a
                href="https://github.com/yourusername/gemini-prompt-helper/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <ExternalLink size={14} />
                Report Issue
              </a>
            </div>
          </div>
        </section>

        <footer className="text-center text-sm text-gray-500 mt-8">
          Made with ❤️ by Ryan Chou
        </footer>
      </div>
    </div>
  );
}
