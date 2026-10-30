import { z } from 'zod';

export enum AuthStepType {
  CREDENTIAL_SUBMISSION = 'CREDENTIAL_SUBMISSION',
  PROTECTED_ROUTE_ACCESS = 'PROTECTED_ROUTE_ACCESS',
  BROWSER_BACK_BUTTON = 'BROWSER_BACK_BUTTON',
  PAGE_REFRESH = 'PAGE_REFRESH',
  SESSION_LOGOUT = 'SESSION_LOGOUT',
  POST_LOGOUT_BACK_NAV = 'POST_LOGOUT_BACK_NAV',
  TAMPERED_COOKIE_ATTEMPT = 'TAMPERED_COOKIE_ATTEMPT',
}

export enum StepOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED',
}

export const AuthStateMatrixStepSchema = z.object({
  stepNumber: z.number(),
  stepType: z.nativeEnum(AuthStepType),
  actionDescription: z.string(),
  expectedState: z.string(),
  actualObservedState: z.string(),
  outcome: z.nativeEnum(StepOutcome),
  vulnerabilityDetected: z.boolean(),
  notes: z.string().optional(),
});

export type AuthStateMatrixStep = z.infer<typeof AuthStateMatrixStepSchema>;

export const AuthSessionMatrixResultSchema = z.object({
  url: z.string().url(),
  sessionSecurityScore: z.number().min(0).max(100),
  totalStepsExecuted: z.number(),
  passedSteps: z.number(),
  failedSteps: z.number(),
  steps: z.array(AuthStateMatrixStepSchema),
  securityFindings: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
      recommendation: z.string(),
    })
  ),
  overallVerdict: z.enum(['SECURE_SESSION_LIFECYCLE', 'SESSION_VULNERABILITY_DETECTED']),
});

export type AuthSessionMatrixResult = z.infer<typeof AuthSessionMatrixResultSchema>;
