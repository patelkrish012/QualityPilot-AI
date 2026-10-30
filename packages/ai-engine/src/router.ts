import { AIConfidence, AIProviderType } from '@qualitypilot/types';
import { IAIProvider, AIAnalysisRequest, AIAnalysisResponse } from './provider.interface';

export class AIProviderRouter {
  private providers: Map<AIProviderType, IAIProvider> = new Map();
  private primaryType: AIProviderType = AIProviderType.GEMINI;
  private fallbackType?: AIProviderType = AIProviderType.OPENAI;

  public registerProvider(provider: IAIProvider) {
    this.providers.set(provider.providerType, provider);
  }

  public setPrimaryProvider(type: AIProviderType) {
    this.primaryType = type;
  }

  public setFallbackProvider(type?: AIProviderType) {
    this.fallbackType = type;
  }

  public async getActiveProvider(): Promise<IAIProvider> {
    const primary = this.providers.get(this.primaryType);
    if (primary && (await primary.isAvailable())) {
      return primary;
    }

    if (this.fallbackType) {
      const fallback = this.providers.get(this.fallbackType);
      if (fallback && (await fallback.isAvailable())) {
        return fallback;
      }
    }

    // Return any available registered provider
    for (const [_, provider] of this.providers) {
      if (await provider.isAvailable()) {
        return provider;
      }
    }

    throw new Error('No functional AI provider configured or available.');
  }

  public async analyzeStructured<T>(
    request: AIAnalysisRequest,
    validator: (json: any) => T,
  ): Promise<AIAnalysisResponse<T>> {
    const provider = await this.getActiveProvider();
    return provider.analyzeStructured<T>(request, validator);
  }
}
