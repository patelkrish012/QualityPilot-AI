import { AIConfidence, AIProviderType } from '@qualitypilot/types';

export interface AIAnalysisRequest {
  task: 'REQUIREMENT_ANALYSIS' | 'TEST_GENERATION' | 'FAILURE_HYPOTHESIS' | 'REPORT_SUMMARY';
  prompt: string;
  contextData?: Record<string, any>;
  temperature?: number;
}

export interface AIAnalysisResponse<T = any> {
  provider: AIProviderType;
  model: string;
  data: T;
  rawText: string;
  confidence: AIConfidence;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAIProvider {
  readonly providerType: AIProviderType;
  isAvailable(): Promise<boolean>;
  generateText(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string>;
  analyzeStructured<T>(request: AIAnalysisRequest, schemaValidator: (json: any) => T): Promise<AIAnalysisResponse<T>>;
}
