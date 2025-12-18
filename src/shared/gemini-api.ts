// src/shared/gemini-api.ts

export interface GeminiApiResponse {
  success: boolean;
  optimizedPrompt?: string;
  suggestions?: string[];
  missingInfo?: string[];
  error?: string;
}

export class GeminiApiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async optimizePrompt(originalPrompt: string): Promise<GeminiApiResponse> {
    console.log('🎆 GeminiApiService: Starting optimization request');
    
    if (!this.apiKey) {
      console.error('❌ GeminiApiService: No API key provided');
      return {
        success: false,
        error: 'Gemini API key not configured'
      };
    }

    try {
      const optimizationPrompt = this.buildOptimizationPrompt(originalPrompt);
      
      console.log('📝 GeminiApiService: Built optimization prompt:', {
        originalLength: originalPrompt.length,
        promptLength: optimizationPrompt.length,
        originalPreview: originalPrompt.slice(0, 50) + '...'
      });
      
      const requestUrl = `${this.baseUrl}?key=${this.apiKey.slice(0, 8)}***`;
      console.log('🌐 GeminiApiService: Making API request to:', this.baseUrl);
      console.log('📊 GeminiApiService: Request payload preview:', {
        url: requestUrl,
        hasContents: true,
        hasGenerationConfig: true,
        hasSafetySettings: true
      });
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: optimizationPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      console.log('📌 GeminiApiService: Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ GeminiApiService: API request failed:', {
          status: response.status,
          statusText: response.statusText,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          errorBody: errorText
        });
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      console.log('📊 GeminiApiService: Raw API response:', {
        hasCandidates: !!data.candidates,
        candidatesLength: data.candidates?.length || 0,
        hasContent: !!data.candidates?.[0]?.content,
        hasText: !!data.candidates?.[0]?.content?.parts?.[0]?.text,
        responseStructure: Object.keys(data)
      });
      
      if (!data.candidates || !data.candidates[0]) {
        console.error('❌ GeminiApiService: Invalid API response format:', data);
        throw new Error('Invalid API response format - no candidates found');
      }

      if (!data.candidates[0].content?.parts?.[0]?.text) {
        console.error('❌ GeminiApiService: No text in API response:', data.candidates[0]);
        throw new Error('Invalid API response format - no text content found');
      }

      const result = data.candidates[0].content.parts[0].text;
      console.log('📝 GeminiApiService: Extracted result text:', {
        length: result.length,
        preview: result.slice(0, 100) + '...'
      });
      
      return this.parseApiResponse(result);
      
    } catch (error) {
      console.error('💥 GeminiApiService: API call failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        errorType: typeof error
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildOptimizationPrompt(originalPrompt: string): string {
    return `You are a professional prompt optimization assistant. Your task is to improve the user's prompt while maintaining the original language and intent.

Original prompt: "${originalPrompt}"

Optimize this prompt following these rules:
1. Keep the same language as the original (Chinese/English/etc.)
2. Make it clearer, more specific, and better structured
3. When information is missing or unclear, add placeholder suggestions in square brackets [like this] for the user to customize
4. Maintain the user's original intent and goals
5. Make it more actionable and likely to get better results from AI

Provide ONLY the optimized prompt text - no explanations, no JSON, no additional formatting. Just the improved prompt ready to use.

Example:
Original: "寫一篇文章"
Optimized: "請寫一篇關於[主題]的[文章類型，如：說明文/議論文/故事]，字數約[字數]字，目標讀者是[目標讀者群]，語調要[正式/輕鬆/專業]。"

Now optimize the user's prompt:`;
  }

  private parseApiResponse(response: string): GeminiApiResponse {
    try {
      // For the new approach, the response IS the optimized prompt
      let optimizedPrompt = response.trim();
      
      // Only remove markdown code blocks if they seem to wrap the entire content
      // Check if the response starts and ends with markdown code block markers
      if (optimizedPrompt.startsWith('```') && optimizedPrompt.endsWith('```')) {
        // Remove the outer markdown wrapper only
        optimizedPrompt = optimizedPrompt.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
      }
      
      return {
        success: true,
        optimizedPrompt: optimizedPrompt,
        suggestions: [],
        missingInfo: []
      };
    } catch (error) {
      console.error('Failed to process Gemini API response:', error, 'Raw response:', response);
      
      return {
        success: false,
        error: 'Failed to process optimization result'
      };
    }
  }

  static isValidApiKey(apiKey: string): boolean {
    // Basic validation for Gemini API key format (updated for new format)
    return Boolean(apiKey && apiKey.length >= 20 && /^[A-Za-z0-9_-]+$/.test(apiKey));
  }
}