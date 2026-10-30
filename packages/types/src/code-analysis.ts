import { z } from 'zod';
import { Severity } from './index';

export const RepositoryConnectSchema = z.object({
  projectId: z.string().uuid(),
  repoUrl: z.string().url('A valid repository URL is required'),
  branch: z.string().default('main'),
  authToken: z.string().optional(),
});
export type RepositoryConnectDTO = z.infer<typeof RepositoryConnectSchema>;

export const CodeFindingSchema = z.object({
  file: z.string(),
  line: z.number(),
  column: z.number().optional(),
  ruleId: z.string(),
  title: z.string(),
  severity: z.nativeEnum(Severity),
  description: z.string(),
  codeSnippet: z.string(),
  recommendation: z.string(),
});
export type CodeFindingDTO = z.infer<typeof CodeFindingSchema>;

export const SourceAnalysisResultSchema = z.object({
  repositoryUrl: z.string(),
  branch: z.string(),
  commitSha: z.string(),
  totalFilesScanned: z.number(),
  totalLinesOfCode: z.number(),
  findings: z.array(CodeFindingSchema),
  endpointsDiscovered: z.array(
    z.object({
      method: z.string(),
      path: z.string(),
      sourceLocation: z.string(),
    }),
  ),
  codeQualityScore: z.number(), // 0 - 100
  maintainabilityIndex: z.enum(['A', 'B', 'C', 'D', 'F']),
});
export type SourceAnalysisResultDTO = z.infer<typeof SourceAnalysisResultSchema>;
