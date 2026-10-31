import { z } from 'zod';
import { Severity, AIConfidence } from './index';
export declare const DefectAnalysisRequestSchema: z.ZodObject<{
    testId: z.ZodString;
    testTitle: z.ZodString;
    targetUrl: z.ZodString;
    observedFact: z.ZodString;
    errorMessage: z.ZodOptional<z.ZodString>;
    consoleErrors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    statusCode: z.ZodOptional<z.ZodNumber>;
    sourceSnippet: z.ZodOptional<z.ZodString>;
    screenshotUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    targetUrl: string;
    testId: string;
    testTitle: string;
    observedFact: string;
    consoleErrors: string[];
    errorMessage?: string | undefined;
    statusCode?: number | undefined;
    sourceSnippet?: string | undefined;
    screenshotUrl?: string | undefined;
}, {
    targetUrl: string;
    testId: string;
    testTitle: string;
    observedFact: string;
    errorMessage?: string | undefined;
    consoleErrors?: string[] | undefined;
    statusCode?: number | undefined;
    sourceSnippet?: string | undefined;
    screenshotUrl?: string | undefined;
}>;
export type DefectAnalysisRequestDTO = z.infer<typeof DefectAnalysisRequestSchema>;
export declare const SuggestedCodePatchSchema: z.ZodObject<{
    targetFile: z.ZodString;
    explanation: z.ZodString;
    riskLevel: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    diff: z.ZodString;
    testsToRerun: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    targetFile: string;
    explanation: string;
    riskLevel: "HIGH" | "MEDIUM" | "LOW";
    diff: string;
    testsToRerun: string[];
}, {
    targetFile: string;
    explanation: string;
    riskLevel: "HIGH" | "MEDIUM" | "LOW";
    diff: string;
    testsToRerun: string[];
}>;
export type SuggestedCodePatchDTO = z.infer<typeof SuggestedCodePatchSchema>;
export declare const ComprehensiveDefectSchema: z.ZodObject<{
    defectId: z.ZodString;
    title: z.ZodString;
    severity: z.ZodNativeEnum<typeof Severity>;
    priority: z.ZodEnum<["CRITICAL", "HIGH", "MEDIUM", "LOW"]>;
    component: z.ZodString;
    url: z.ZodString;
    observedFact: z.ZodString;
    aiHypothesis: z.ZodString;
    aiConfidence: z.ZodNativeEnum<typeof AIConfidence>;
    businessImpact: z.ZodString;
    suggestedPatch: z.ZodOptional<z.ZodObject<{
        targetFile: z.ZodString;
        explanation: z.ZodString;
        riskLevel: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
        diff: z.ZodString;
        testsToRerun: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        targetFile: string;
        explanation: string;
        riskLevel: "HIGH" | "MEDIUM" | "LOW";
        diff: string;
        testsToRerun: string[];
    }, {
        targetFile: string;
        explanation: string;
        riskLevel: "HIGH" | "MEDIUM" | "LOW";
        diff: string;
        testsToRerun: string[];
    }>>;
    retestVerification: z.ZodObject<{
        beforeFixStatus: z.ZodDefault<z.ZodString>;
        afterFixStatus: z.ZodDefault<z.ZodString>;
        regressionStatus: z.ZodDefault<z.ZodString>;
        isVerified: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        beforeFixStatus: string;
        afterFixStatus: string;
        regressionStatus: string;
        isVerified: boolean;
    }, {
        beforeFixStatus?: string | undefined;
        afterFixStatus?: string | undefined;
        regressionStatus?: string | undefined;
        isVerified?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    url: string;
    title: string;
    severity: Severity;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    observedFact: string;
    defectId: string;
    component: string;
    aiHypothesis: string;
    aiConfidence: AIConfidence;
    businessImpact: string;
    retestVerification: {
        beforeFixStatus: string;
        afterFixStatus: string;
        regressionStatus: string;
        isVerified: boolean;
    };
    suggestedPatch?: {
        targetFile: string;
        explanation: string;
        riskLevel: "HIGH" | "MEDIUM" | "LOW";
        diff: string;
        testsToRerun: string[];
    } | undefined;
}, {
    url: string;
    title: string;
    severity: Severity;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    observedFact: string;
    defectId: string;
    component: string;
    aiHypothesis: string;
    aiConfidence: AIConfidence;
    businessImpact: string;
    retestVerification: {
        beforeFixStatus?: string | undefined;
        afterFixStatus?: string | undefined;
        regressionStatus?: string | undefined;
        isVerified?: boolean | undefined;
    };
    suggestedPatch?: {
        targetFile: string;
        explanation: string;
        riskLevel: "HIGH" | "MEDIUM" | "LOW";
        diff: string;
        testsToRerun: string[];
    } | undefined;
}>;
export type ComprehensiveDefectDTO = z.infer<typeof ComprehensiveDefectSchema>;
