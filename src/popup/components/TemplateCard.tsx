// src/popup/components/TemplateCard.tsx
import { useState } from 'react';
import type { Template } from '../../shared/types';
import { CATEGORY_CONFIG } from '../../shared/constants';
import { formatRelativeTime, truncateText } from '../../shared/utils';
import { Copy, Edit, Trash2, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onCopy: (content: string) => void;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function TemplateCard({
  template,
  onCopy,
  onEdit,
  onDelete,
  onToggleFavorite,
}: TemplateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryConfig = CATEGORY_CONFIG[template.category];
  const truncatedContent = truncateText(template.content, 150);
  const shouldShowExpand = template.content.length > 150;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 flex-1">{template.title}</h3>
        <button
          onClick={() => onToggleFavorite(template.id)}
          className="flex-shrink-0 text-yellow-500 hover:scale-110 transition"
        >
          {template.isFavorite ? (
            <Star size={18} fill="currentColor" />
          ) : (
            <Star size={18} />
          )}
        </button>
      </div>

      {/* Category Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryConfig.bgColor} ${categoryConfig.color}`}
        >
          <span>{categoryConfig.icon}</span>
          <span>{categoryConfig.label}</span>
        </span>
        <span className="text-xs text-gray-500">
          Used {template.usageCount} times
        </span>
      </div>

      {/* Content Preview */}
      <div className="text-sm text-gray-600">
        <p className="whitespace-pre-wrap">
          {isExpanded ? template.content : truncatedContent}
        </p>
        {shouldShowExpand && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-600 mt-1 inline-flex items-center gap-1 text-xs font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} /> Show less
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Show more
              </>
            )}
          </button>
        )}
      </div>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {formatRelativeTime(template.updatedAt)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopy(template.content)}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
            title="Copy to clipboard"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onEdit(template)}
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition"
            title="Edit template"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
            title="Delete template"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
