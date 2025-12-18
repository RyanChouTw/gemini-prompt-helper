// src/popup/components/TemplateEditor.tsx
import { useState, useEffect } from 'react';
import type { Template, CategoryType } from '../../shared/types';
import { generateId, validateTemplate, extractVariables } from '../../shared/utils';
import { CATEGORY_CONFIG, LIMITS } from '../../shared/constants';
import { X } from 'lucide-react';

interface TemplateEditorProps {
  template: Template | null;
  onSave: (template: Template) => void;
  onClose: () => void;
}

export default function TemplateEditor({ template, onSave, onClose }: TemplateEditorProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('all');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setCategory(template.category);
      setContent(template.content);
      setTags(template.tags.join(', '));
      setIsFavorite(template.isFavorite);
    }
  }, [template]);

  const handleSave = () => {
    const validation = validateTemplate({ title, content, tags: tags.split(',').map(t => t.trim()).filter(Boolean) });
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const variables = extractVariables(content);
    const templateData: Template = {
      id: template?.id || generateId(),
      title: title.trim(),
      category,
      content: content.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, LIMITS.MAX_TAGS),
      variables: variables.map(v => ({
        name: v,
        label: v.replace(/_/g, ' '),
        required: true,
      })),
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: template?.usageCount || 0,
      isFavorite,
    };

    onSave(templateData);
  };

  const detectedVariables = extractVariables(content);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-800 mb-1">Please fix these errors:</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Professional Blog Post"
              maxLength={LIMITS.TITLE_MAX_LENGTH}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/{LIMITS.TITLE_MAX_LENGTH} characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your prompt template here... Use [VARIABLE] for dynamic content."
              rows={10}
              maxLength={LIMITS.CONTENT_MAX_LENGTH}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length}/{LIMITS.CONTENT_MAX_LENGTH} characters
            </p>
            {detectedVariables.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs font-medium text-blue-800 mb-1">
                  Detected variables:
                </p>
                <div className="flex flex-wrap gap-1">
                  {detectedVariables.map((v) => (
                    <span
                      key={v}
                      className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono"
                    >
                      [{v}]
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., marketing, blog, content"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max {LIMITS.MAX_TAGS} tags, each max {LIMITS.TAG_MAX_LENGTH} characters
            </p>
          </div>

          {/* Favorite */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Add to favorites
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  );
}
