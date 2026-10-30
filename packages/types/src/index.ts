import { z } from 'zod';
export * from './requirements';
export * from './defects';
export * from './audit';
export * from './code-analysis';
export * from './digital-twin';
export * from './api-testing';
export * from './visual-regression';
export * from './dev-intelligence';
export * from './auth-matrix';
export * from './cicd-gate';

// ==========================================
// 1. SYSTEM ROLES & PERMISSIONS
// ==========================================
export enum OrgRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

// ==========================================
// 2. TESTING MODES & SCOPE
// ==========================================
export enum TestingMode {
  MODE_A_URL_BLACKBOX = 'MODE_A_URL_BLACKBOX',
  MODE_B_SOURCE_WHITEBOX = 'MODE_B_SOURCE_WHITEBOX',
}

export enum TestDepth {
  QUICK = 'QUICK',
  STANDARD = 'STANDARD',
  DEEP = 'DEEP',
}

export enum TestStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  BLOCKED = 'BLOCKED',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum TestRunStatus {
  REQUESTED = 'REQUESTED',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  DISCOVERY = 'DISCOVERY',
  EXECUTING = 'EXECUTING',
  EVIDENCE_COLLECTION = 'EVIDENCE_COLLECTION',
  ANALYSIS = 'ANALYSIS',
  REPORT_GENERATION = 'REPORT_GENERATION',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

export enum ReleaseRisk {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ReleaseRecommendation {
  APPROVED = 'APPROVED',
  APPROVED_WITH_WARNINGS = 'APPROVED_WITH_WARNINGS',
  REQUIRES_FIXES = 'REQUIRES_FIXES',
  BLOCKED = 'BLOCKED',
}

export enum UserPersonaView {
  BEGINNER = 'BEGINNER',
  DEVELOPER = 'DEVELOPER',
  MANAGER = 'MANAGER',
}

// ==========================================
// 3. AI PROVIDER CONTRACTS & ABSTRACTIONS
// ==========================================
export enum AIProviderType {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  ANTHROPIC = 'anthropic',
  LOCAL = 'local',
}

export interface AIProviderConfig {
  provider: AIProviderType;
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  baseUrl?: string;
}

export enum AIConfidence {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

// ==========================================
// 4. ZOD VALIDATION SCHEMAS FOR CONTRACTS
// ==========================================

export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name required'),
  organizationName: z.string().min(2, 'Organization name required'),
});
export type UserRegistrationDTO = z.infer<typeof UserRegistrationSchema>;

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
});
export type UserLoginDTO = z.infer<typeof UserLoginSchema>;

export const CreateProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  targetUrl: z.string().url('A valid target website URL is required'),
  mode: z.nativeEnum(TestingMode).default(TestingMode.MODE_A_URL_BLACKBOX),
  repositoryUrl: z.string().url().optional(),
  branch: z.string().optional(),
});
export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;

export const StartTestRunSchema = z.object({
  projectId: z.string().uuid(),
  depth: z.nativeEnum(TestDepth).default(TestDepth.STANDARD),
  targetUrl: z.string().url().optional(),
  customInstructions: z.string().optional(),
});
export type StartTestRunDTO = z.infer<typeof StartTestRunSchema>;

// Defect Schema conforming to requirement Section 48
export const DefectSchema = z.object({
  defectId: z.string(),
  title: z.string(),
  severity: z.nativeEnum(Severity),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  component: z.string(),
  requirementId: z.string().optional(),
  testId: z.string(),
  url: z.string().url(),
  environment: z.string(),
  stepsToReproduce: z.array(z.string()),
  expectedResult: z.string(),
  actualResult: z.string(),
  evidenceUrls: z.array(z.string()),
  observedCause: z.string(),
  aiHypothesis: z.string(),
  aiConfidence: z.nativeEnum(AIConfidence),
  recommendation: z.string(),
  retestStatus: z.enum(['UNTESTED', 'VERIFIED_FIXED', 'STILL_FAILING']).default('UNTESTED'),
  sourceLocation: z.string().optional(),
});
export type DefectDTO = z.infer<typeof DefectSchema>;

// Deterministic Quality Score Structure (Section 36)
export interface QualityScoreBreakdown {
  overallScore: number; // 0 - 100
  functionalQuality: number;
  reliability: number;
  performance: number;
  accessibility: number;
  apiQuality: number;
  visualStability: number;
  codeQuality?: number; // only in Mode B
  requirementCoverage: number;
  testCoverage: number;
  formulaDescription: string;
}
