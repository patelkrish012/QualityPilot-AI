import { z } from 'zod';
export declare enum AuthStepType {
    CREDENTIAL_SUBMISSION = "CREDENTIAL_SUBMISSION",
    PROTECTED_ROUTE_ACCESS = "PROTECTED_ROUTE_ACCESS",
    BROWSER_BACK_BUTTON = "BROWSER_BACK_BUTTON",
    PAGE_REFRESH = "PAGE_REFRESH",
    SESSION_LOGOUT = "SESSION_LOGOUT",
    POST_LOGOUT_BACK_NAV = "POST_LOGOUT_BACK_NAV",
    TAMPERED_COOKIE_ATTEMPT = "TAMPERED_COOKIE_ATTEMPT"
}
export declare enum StepOutcome {
    PASSED = "PASSED",
    FAILED = "FAILED",
    BLOCKED = "BLOCKED"
}
export declare const AuthStateMatrixStepSchema: z.ZodObject<{
    stepNumber: z.ZodNumber;
    stepType: z.ZodNativeEnum<typeof AuthStepType>;
    actionDescription: z.ZodString;
    expectedState: z.ZodString;
    actualObservedState: z.ZodString;
    outcome: z.ZodNativeEnum<typeof StepOutcome>;
    vulnerabilityDetected: z.ZodBoolean;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    stepNumber: number;
    stepType: AuthStepType;
    actionDescription: string;
    expectedState: string;
    actualObservedState: string;
    outcome: StepOutcome;
    vulnerabilityDetected: boolean;
    notes?: string | undefined;
}, {
    stepNumber: number;
    stepType: AuthStepType;
    actionDescription: string;
    expectedState: string;
    actualObservedState: string;
    outcome: StepOutcome;
    vulnerabilityDetected: boolean;
    notes?: string | undefined;
}>;
export type AuthStateMatrixStep = z.infer<typeof AuthStateMatrixStepSchema>;
export declare const AuthSessionMatrixResultSchema: z.ZodObject<{
    url: z.ZodString;
    sessionSecurityScore: z.ZodNumber;
    totalStepsExecuted: z.ZodNumber;
    passedSteps: z.ZodNumber;
    failedSteps: z.ZodNumber;
    steps: z.ZodArray<z.ZodObject<{
        stepNumber: z.ZodNumber;
        stepType: z.ZodNativeEnum<typeof AuthStepType>;
        actionDescription: z.ZodString;
        expectedState: z.ZodString;
        actualObservedState: z.ZodString;
        outcome: z.ZodNativeEnum<typeof StepOutcome>;
        vulnerabilityDetected: z.ZodBoolean;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        stepNumber: number;
        stepType: AuthStepType;
        actionDescription: string;
        expectedState: string;
        actualObservedState: string;
        outcome: StepOutcome;
        vulnerabilityDetected: boolean;
        notes?: string | undefined;
    }, {
        stepNumber: number;
        stepType: AuthStepType;
        actionDescription: string;
        expectedState: string;
        actualObservedState: string;
        outcome: StepOutcome;
        vulnerabilityDetected: boolean;
        notes?: string | undefined;
    }>, "many">;
    securityFindings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        severity: z.ZodEnum<["CRITICAL", "HIGH", "MEDIUM", "LOW"]>;
        recommendation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        recommendation: string;
    }, {
        id: string;
        title: string;
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        recommendation: string;
    }>, "many">;
    overallVerdict: z.ZodEnum<["SECURE_SESSION_LIFECYCLE", "SESSION_VULNERABILITY_DETECTED"]>;
}, "strip", z.ZodTypeAny, {
    url: string;
    sessionSecurityScore: number;
    totalStepsExecuted: number;
    passedSteps: number;
    failedSteps: number;
    steps: {
        stepNumber: number;
        stepType: AuthStepType;
        actionDescription: string;
        expectedState: string;
        actualObservedState: string;
        outcome: StepOutcome;
        vulnerabilityDetected: boolean;
        notes?: string | undefined;
    }[];
    securityFindings: {
        id: string;
        title: string;
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        recommendation: string;
    }[];
    overallVerdict: "SECURE_SESSION_LIFECYCLE" | "SESSION_VULNERABILITY_DETECTED";
}, {
    url: string;
    sessionSecurityScore: number;
    totalStepsExecuted: number;
    passedSteps: number;
    failedSteps: number;
    steps: {
        stepNumber: number;
        stepType: AuthStepType;
        actionDescription: string;
        expectedState: string;
        actualObservedState: string;
        outcome: StepOutcome;
        vulnerabilityDetected: boolean;
        notes?: string | undefined;
    }[];
    securityFindings: {
        id: string;
        title: string;
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        recommendation: string;
    }[];
    overallVerdict: "SECURE_SESSION_LIFECYCLE" | "SESSION_VULNERABILITY_DETECTED";
}>;
export type AuthSessionMatrixResult = z.infer<typeof AuthSessionMatrixResultSchema>;
