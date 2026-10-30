import { IAIProvider, AIAnalysisRequest, AIAnalysisResponse } from './provider.interface';
import { AIConfidence, AIProviderType } from '@qualitypilot/types';

export class OpenAIProvider implements IAIProvider {
  readonly providerType = AIProviderType.OPENAI;
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.model = model;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey && this.apiKey.length > 5;
  }

  async generateText(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is missing.');
    }

    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const payload = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.2,
      max_tokens: options?.maxTokens ?? 2048,
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  }

  async analyzeStructured<T>(
    request: AIAnalysisRequest,
    schemaValidator: (json: any) => T,
  ): Promise<AIAnalysisResponse<T>> {
    const prompt = `You are QualityPilot AI. Output strict JSON only.
Task: ${request.task}
Context: ${JSON.stringify(request.contextData || {})}
Prompt: ${request.prompt}`;

    let rawText = '';
    if (await this.isAvailable()) {
      rawText = await this.generateText(prompt, { temperature: request.temperature });
    } else {
      rawText = JSON.stringify({
        hypothesis: 'OpenAI fallback deterministic evaluation',
        recommendation: 'Verify input parameters and constraints',
      });
    }

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
}
