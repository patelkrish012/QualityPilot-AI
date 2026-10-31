import { z } from 'zod';
import { ReleaseRisk } from './index';
export declare const TwinNodeSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["MODULE", "CODE_FILE", "ENDPOINT", "REQUIREMENT", "TEST_CASE", "DEFECT", "RELEASE"]>;
    label: z.ZodString;
    riskScore: z.ZodNumber;
    status: z.ZodEnum<["HEALTHY", "WARNING", "CRITICAL", "PASS", "FAIL"]>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "CRITICAL" | "WARNING" | "FAIL" | "HEALTHY" | "PASS";
    type: "MODULE" | "CODE_FILE" | "ENDPOINT" | "REQUIREMENT" | "TEST_CASE" | "DEFECT" | "RELEASE";
    label: string;
    riskScore: number;
    metadata: Record<string, any>;
}, {
    id: string;
    status: "CRITICAL" | "WARNING" | "FAIL" | "HEALTHY" | "PASS";
    type: "MODULE" | "CODE_FILE" | "ENDPOINT" | "REQUIREMENT" | "TEST_CASE" | "DEFECT" | "RELEASE";
    label: string;
    riskScore: number;
    metadata?: Record<string, any> | undefined;
}>;
export type TwinNodeDTO = z.infer<typeof TwinNodeSchema>;
export declare const TwinEdgeSchema: z.ZodObject<{
    id: z.ZodString;
    source: z.ZodString;
    target: z.ZodString;
    relationship: z.ZodEnum<["IMPLEMENTS", "EXPOSES", "VERIFIES", "BLOCKS", "AFFECTS"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    target: string;
    source: string;
    relationship: "IMPLEMENTS" | "EXPOSES" | "VERIFIES" | "BLOCKS" | "AFFECTS";
}, {
    id: string;
    target: string;
    source: string;
    relationship: "IMPLEMENTS" | "EXPOSES" | "VERIFIES" | "BLOCKS" | "AFFECTS";
}>;
export type TwinEdgeDTO = z.infer<typeof TwinEdgeSchema>;
export declare const DigitalQualityTwinGraphSchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["MODULE", "CODE_FILE", "ENDPOINT", "REQUIREMENT", "TEST_CASE", "DEFECT", "RELEASE"]>;
        label: z.ZodString;
        riskScore: z.ZodNumber;
        status: z.ZodEnum<["HEALTHY", "WARNING", "CRITICAL", "PASS", "FAIL"]>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status: "CRITICAL" | "WARNING" | "FAIL" | "HEALTHY" | "PASS";
        type: "MODULE" | "CODE_FILE" | "ENDPOINT" | "REQUIREMENT" | "TEST_CASE" | "DEFECT" | "RELEASE";
        label: string;
        riskScore: number;
        metadata: Record<string, any>;
    }, {
        id: string;
        status: "CRITICAL" | "WARNING" | "FAIL" | "HEALTHY" | "PASS";
        type: "MODULE" | "CODE_FILE" | "ENDPOINT" | "REQUIREMENT" | "TEST_CASE" | "DEFECT" | "RELEASE";
        label: string;
        riskScore: number;
        metadata?: Record<string, any> | undefined;
    }>, "many">;
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        target: z.ZodString;
        relationship: z.ZodEnum<["IMPLEMENTS", "EXPOSES", "VERIFIES", "BLOCKS", "AFFECTS"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        target: string;
        source: string;
        relationship: "IMPLEMENTS" | "EXPOSES" | "VERIFIES" | "BLOCKS" | "AFFECTS";
    }, {
        id: string;
        target: string;
        source: string;
        relationship: "IMPLEMENTS" | "EXPOSES" | "VERIFIES" | "BLOCKS" | "AFFECTS";
    }>, "many">;
    highRiskModules: z.ZodArray<z.ZodString, "many">;
    calculatedReleaseRisk: z.ZodNativeEnum<typeof ReleaseRisk>;
}, "strip", z.ZodTypeAny, {
    nodes: {
        id: string;
        status: "CRITICAL" | "WARNING" | "FAIL" | "HEALTHY" | "PASS";
        type: "MODULE" | "CODE_FILE" | "ENDPOINT" | "REQUIREMENT" | "TEST_CASE" | "DEFECT" | "RELEASE";
        label: string;
        riskScore: number;
        metadata: Record<string, any>;
    }[];
    edges: {
        id: string;
        target: string;
        source: string;
        relationship: "IMPLEMENTS" | "EXPOSES" | "VERIFIES" | "BLOCKS" | "AFFECTS";
    }[];
    highRiskModules: string[];
    calculatedReleaseRisk: ReleaseRisk;
}, {
    nodes: {
        id: string;
        status: "CRITICAL" | "WARNING" | "FAIL" | "HEALTHY" | "PASS";
        type: "MODULE" | "CODE_FILE" | "ENDPOINT" | "REQUIREMENT" | "TEST_CASE" | "DEFECT" | "RELEASE";
        label: string;
        riskScore: number;
        metadata?: Record<string, any> | undefined;
    }[];
    edges: {
        id: string;
        target: string;
        source: string;
        relationship: "IMPLEMENTS" | "EXPOSES" | "VERIFIES" | "BLOCKS" | "AFFECTS";
    }[];
    highRiskModules: string[];
    calculatedReleaseRisk: ReleaseRisk;
}>;
export type DigitalQualityTwinGraphDTO = z.infer<typeof DigitalQualityTwinGraphSchema>;
export declare const ImpactAnalysisRequestSchema: z.ZodObject<{
    changedFiles: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    changedFiles: string[];
}, {
    changedFiles: string[];
}>;
export type ImpactAnalysisRequestDTO = z.infer<typeof ImpactAnalysisRequestSchema>;
export declare const ImpactAnalysisResultSchema: z.ZodObject<{
    changedFiles: z.ZodArray<z.ZodString, "many">;
    impactedModules: z.ZodArray<z.ZodString, "many">;
    impactedRequirements: z.ZodArray<z.ZodString, "many">;
    totalTestsAvailable: z.ZodNumber;
    selectedTestsToRun: z.ZodArray<z.ZodObject<{
        testId: z.ZodString;
        title: z.ZodString;
        reason: z.ZodString;
        priority: z.ZodEnum<["CRITICAL", "HIGH", "MEDIUM", "LOW"]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        testId: string;
        reason: string;
    }, {
        title: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        testId: string;
        reason: string;
    }>, "many">;
    skippedTestsCount: z.ZodNumber;
    efficiencyPercentage: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    changedFiles: string[];
    impactedModules: string[];
    impactedRequirements: string[];
    totalTestsAvailable: number;
    selectedTestsToRun: {
        title: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        testId: string;
        reason: string;
    }[];
    skippedTestsCount: number;
    efficiencyPercentage: number;
}, {
    changedFiles: string[];
    impactedModules: string[];
    impactedRequirements: string[];
    totalTestsAvailable: number;
    selectedTestsToRun: {
        title: string;
        priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
        testId: string;
        reason: string;
    }[];
    skippedTestsCount: number;
    efficiencyPercentage: number;
}>;
export type ImpactAnalysisResultDTO = z.infer<typeof ImpactAnalysisResultSchema>;
