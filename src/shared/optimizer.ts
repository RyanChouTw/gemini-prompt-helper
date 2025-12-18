// src/shared/optimizer.ts

import type { CategoryType, OptimizationResult, OptimizationSuggestion } from './types';

/**
 * Optimization rule interface
 */
interface OptimizationRule {
  id: string;
  name: string;
  check: (prompt: string) => boolean;
  suggestion: string;
  template: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Keywords for category detection
 */
const CATEGORY_KEYWORDS: Record<CategoryType, string[]> = {
  image: [
    'image', 'picture', 'photo', 'illustration', 'drawing', 'generate', 
    'create', 'design', 'render', 'visualize', 'photorealistic', 'cartoon',
    'painting', 'sketch', 'artwork', 'portrait', 'landscape'
  ],
  video: [
    'video', 'animation', 'clip', 'footage', 'scene', 'camera', 
    'transition', 'sequence', 'duration', 'film', 'movie', 'motion'
  ],
  all: [],  // Default category
  custom: [] // User-defined
};

/**
 * Optimization rules by category
 */
const OPTIMIZATION_RULES: Record<CategoryType, OptimizationRule[]> = {
  all: [
    {
      id: 'general-format',
      name: 'Specify Format',
      check: (p) => !/(format|structure|style|tone)/i.test(p),
      suggestion: 'Add desired format and tone',
      template: 'Format: [SPECIFY] | Tone: [SPECIFY]',
      priority: 'high'
    },
    {
      id: 'general-context',
      name: 'Add Context',
      check: (p) => p.split(' ').length < 8,
      suggestion: 'Provide more context and specific requirements',
      template: 'Context: [PROVIDE BACKGROUND] | Requirements: [SPECIFY]',
      priority: 'medium'
    }
  ],
  
  image: [
    {
      id: 'image-subject',
      name: 'Describe Subject',
      check: (p) => p.split(' ').length < 5,
      suggestion: 'Add detailed subject description',
      template: 'Subject: [DETAILED DESCRIPTION]',
      priority: 'high'
    },
    {
      id: 'image-style',
      name: 'Specify Art Style',
      check: (p) => !/(style|photorealistic|cartoon|painting|illustration|artwork|realistic|artistic)/i.test(p),
      suggestion: 'Define art style (photorealistic, cartoon, etc.)',
      template: 'Style: [PHOTOREALISTIC/CARTOON/PAINTING/etc.]',
      priority: 'high'
    },
    {
      id: 'image-lighting',
      name: 'Lighting Details',
      check: (p) => !/(light|lighting|bright|dark|shadow|illuminate|sunlight|studio)/i.test(p),
      suggestion: 'Describe lighting (natural, studio, dramatic, etc.)',
      template: 'Lighting: [SPECIFY]',
      priority: 'medium'
    },
    {
      id: 'image-composition',
      name: 'Composition',
      check: (p) => !/(angle|perspective|view|framing|composition|centered|close-up|wide)/i.test(p),
      suggestion: 'Define framing and perspective',
      template: 'Composition: [FRAMING, ANGLE, PERSPECTIVE]',
      priority: 'medium'
    },
    {
      id: 'image-quality',
      name: 'Quality Specs',
      check: (p) => !/(4k|hd|quality|resolution|detail|high detail)/i.test(p),
      suggestion: 'Add quality requirements (4K, high detail, etc.)',
      template: 'Quality: [4K, HIGH DETAIL, etc.]',
      priority: 'low'
    }
  ],
  
  video: [
    {
      id: 'video-duration',
      name: 'Specify Duration',
      check: (p) => !/(second|minute|duration|length|long|short|time)/i.test(p),
      suggestion: 'Define video length',
      template: 'Duration: [X seconds/minutes]',
      priority: 'high'
    },
    {
      id: 'video-opening',
      name: 'Opening Scene',
      check: (p) => !/(start|begin|opening|first|intro|introduction)/i.test(p),
      suggestion: 'Describe first scene in detail',
      template: 'Opening: [SCENE DESCRIPTION]',
      priority: 'high'
    },
    {
      id: 'video-sequence',
      name: 'Scene Sequence',
      check: (p) => !/(scene|sequence|then|next|after|flow)/i.test(p),
      suggestion: 'Break down scene by scene',
      template: 'Sequence: [SCENE 1, SCENE 2, ...]',
      priority: 'medium'
    },
    {
      id: 'video-camera',
      name: 'Camera Work',
      check: (p) => !/(camera|angle|movement|pan|zoom|shot|perspective)/i.test(p),
      suggestion: 'Specify camera movements and angles',
      template: 'Camera: [MOVEMENTS, ANGLES]',
      priority: 'medium'
    },
    {
      id: 'video-audio',
      name: 'Audio Style',
      check: (p) => !/(audio|music|sound|soundtrack|background)/i.test(p),
      suggestion: 'Describe background music or sound',
      template: 'Audio: [MUSIC STYLE, SOUND EFFECTS]',
      priority: 'low'
    }
  ],
  
  custom: [] // No specific rules for custom category
};

/**
 * Detect category based on keywords
 */
export function detectCategory(prompt: string): CategoryType {
  const lower = prompt.toLowerCase();
  
  const scores: Record<CategoryType, number> = {
    all: 0,
    image: 0,
    video: 0,
    custom: 0
  };
  
  // Count keyword matches for each category
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lower.includes(keyword)) {
        scores[category as CategoryType] += 1;
      }
    });
  });
  
  // Find category with highest score
  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore === 0) return 'all'; // Default to 'all'
  
  const detectedCategory = Object.keys(scores).find(
    key => scores[key as CategoryType] === maxScore
  ) as CategoryType;
  
  return detectedCategory;
}

/**
 * Generate optimization suggestions
 */
function generateSuggestions(
  prompt: string,
  category: CategoryType
): OptimizationSuggestion[] {
  const rules = OPTIMIZATION_RULES[category];
  const suggestions: OptimizationSuggestion[] = [];
  
  rules.forEach(rule => {
    if (rule.check(prompt)) {
      suggestions.push({
        type: 'specificity',
        title: rule.name,
        description: rule.suggestion,
        example: rule.template,
        priority: rule.priority
      });
    }
  });
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return suggestions;
}

// Continued in next file...

/**
 * Build optimized prompt based on category
 */
function buildOptimizedPrompt(
  original: string,
  category: CategoryType
): string {
  const lines: string[] = [];
  
  // Add category-specific structure
  switch (category) {
    case 'image':
      lines.push('Generate a detailed image with the following specifications:');
      lines.push('');
      lines.push(`Subject: ${original}`);
      lines.push('Style: [Specify: photorealistic/cartoon/painting/etc.]');
      lines.push('Composition: [Specify: framing, angle, perspective]');
      lines.push('Lighting: [Specify: natural/studio/dramatic/etc.]');
      lines.push('Colors: [Specify: color palette and mood]');
      lines.push('Quality: 4K resolution, high detail');
      break;
      
    case 'video':
      lines.push('Create a video with the following specifications:');
      lines.push('');
      lines.push(`Concept: ${original}`);
      lines.push('Duration: [Specify length in seconds/minutes]');
      lines.push('Opening: [Describe first scene]');
      lines.push('Sequence: [Scene breakdown]');
      lines.push('Camera: [Movement and angles]');
      lines.push('Audio: [Background music style]');
      break;
      
    case 'all':
    case 'custom':
    default:
      lines.push('Task with the following specifications:');
      lines.push('');
      lines.push(`Request: ${original}`);
      lines.push('Format: [Specify desired output format]');
      lines.push('Tone: [Specify: formal/casual/professional/etc.]');
      lines.push('Requirements: [Add specific requirements or constraints]');
      lines.push('Context: [Provide relevant background information]');
      break;
  }
  
  return lines.join('\n');
}

/**
 * List improvements made
 */
function listImprovements(category: CategoryType): string[] {
  const improvements: Record<CategoryType, string[]> = {
    all: [
      'Added structured format specification',
      'Included tone and context guidance',
      'Specified requirements and constraints',
      'Improved clarity and specificity'
    ],
    image: [
      'Added detailed subject description',
      'Specified art style',
      'Included lighting and composition details',
      'Added quality specifications'
    ],
    video: [
      'Added duration specification',
      'Included scene breakdown structure',
      'Specified camera work',
      'Added audio requirements'
    ],
    custom: [
      'Applied general optimization principles',
      'Enhanced structure and clarity'
    ]
  };
  
  return improvements[category] || [];
}

/**
 * Main optimization function
 */
export function optimizePrompt(
  prompt: string,
  categoryHint?: CategoryType
): OptimizationResult {
  // Step 1: Detect category
  const detectedCategory = categoryHint || detectCategory(prompt);
  
  // Step 2: Generate suggestions
  const suggestions = generateSuggestions(prompt, detectedCategory);
  
  // Step 3: Build optimized prompt
  const optimizedPrompt = buildOptimizedPrompt(prompt, detectedCategory);
  
  // Step 4: List improvements
  const improvements = listImprovements(detectedCategory);
  
  return {
    originalPrompt: prompt,
    optimizedPrompt,
    suggestions,
    detectedCategory,
    improvements
  };
}
