import { z } from 'zod';

export const ApiEndpointTestSchema = z.object({
  id: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string(),
  expectedStatus: z.number(),
  actualStatus: z.number(),
  responseTimeMs: z.number(),
  isSchemaValid: z.boolean(),
  headersChecked: z.record(z.string()).default({}),
  passed: z.boolean(),
  failureReason: z.string().optional(),
});
export type ApiEndpointTestDTO = z.infer<typeof ApiEndpointTestSchema>;

export const ApiTestSuiteResultSchema = z.object({
  targetBaseUrl: z.string().url(),
  totalEndpointsTested: z.number(),
  passedEndpoints: z.number(),
  failedEndpoints: z.number(),
  averageLatencyMs: z.number(),
  apiQualityScore: z.number().min(0).max(100),
  endpointResults: z.array(ApiEndpointTestSchema),
});
export type ApiTestSuiteResultDTO = z.infer<typeof ApiTestSuiteResultSchema>;
