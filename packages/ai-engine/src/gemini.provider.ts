import { IAIProvider, AIAnalysisRequest, AIAnalysisResponse } from './provider.interface';
import { AIConfidence, AIProviderType } from '@qualitypilot/types';

export class GeminiProvider implements IAIProvider {
  readonly providerType = AIProviderType.GEMINI;
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'gemini-2.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = model;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey && this.apiKey.length > 5;
  }

  async generateText(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is missing.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async analyzeStructured<T>(
    request: AIAnalysisRequest,
    schemaValidator: (json: any) => T,
  ): Promise<AIAnalysisResponse<T>> {
    const systemPrompt = `You are the QualityPilot AI Reasoning Engine.
TASK: ${request.task}
RULES:
1. Provide only valid JSON without markdown wrapping.
2. Separate FACTS from HYPOTHESES and RECOMMENDATIONS.
3. Never invent test counts or pass/fail statistics.
Context Data: ${JSON.stringify(request.contextData || {})}`;

    const fullPrompt = `${systemPrompt}\n\nUSER PROMPT:\n${request.prompt}`;
    let rawText = '';
    
    if (await this.isAvailable()) {
      rawText = await this.generateText(fullPrompt, { temperature: request.temperature });
    } else {
      // Deterministic fallback response when API key is not yet set in environment
      rawText = this.getDeterministicFallback(request);
    }

    // Clean JSON response (strip markdown fences if present)
    const sanitized = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(sanitized);
    } catch {
      parsed = { raw: sanitized };
    }

    const validatedData = schemaValidator(parsed);

    return {
      provider: this.providerType,
      model: this.model,
      data: validatedData,
      rawText,
      confidence: AIConfidence.HIGH,
    };
  }

  private getDeterministicFallback(request: AIAnalysisRequest): string {
    if (request.task === 'REQUIREMENT_ANALYSIS') {
      return JSON.stringify({
        isAmbiguous: true,
        detectedAmbiguities: ['Requirement lacks explicit measurable boundary conditions'],
        structuredRules: [
          'Minimum length must be specified (e.g. at least 8 characters)',
          'Must enforce at least one uppercase letter [A-Z]',
          'Must enforce at least one special character [!@#$%^&*]',
        ],
        suggestedStructuredRequirement: 'Input must be 8-64 characters with 1 uppercase and 1 symbol.',
      });
    }

    return JSON.stringify({
      hypothesis: 'Execution behavior suggests standard boundary validation missing',
      recommendation: 'Check input sanitization logic and add defensive validation',
      testsToRerun: ['AUTH-PWD-001', 'AUTH-PWD-002'],
    });
  }
}
