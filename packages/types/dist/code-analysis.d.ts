import { z } from 'zod';
import { Severity } from './index';
export declare const RepositoryConnectSchema: z.ZodObject<{
    projectId: z.ZodString;
    repoUrl: z.ZodString;
    branch: z.ZodDefault<z.ZodString>;
    authToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch: string;
    projectId: string;
    repoUrl: string;
    authToken?: string | undefined;
}, {
    projectId: string;
    repoUrl: string;
    branch?: string | undefined;
    authToken?: string | undefined;
}>;
export type RepositoryConnectDTO = z.infer<typeof RepositoryConnectSchema>;
export declare const CodeFindingSchema: z.ZodObject<{
    file: z.ZodString;
    line: z.ZodNumber;
    column: z.ZodOptional<z.ZodNumber>;
    ruleId: z.ZodString;
    title: z.ZodString;
    severity: z.ZodNativeEnum<typeof Severity>;
    description: z.ZodString;
    codeSnippet: z.ZodString;
    recommendation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    severity: Severity;
    recommendation: string;
    file: string;
    line: number;
    ruleId: string;
    codeSnippet: string;
    column?: number | undefined;
}, {
    description: string;
    title: string;
    severity: Severity;
    recommendation: string;
    file: string;
    line: number;
    ruleId: string;
    codeSnippet: string;
    column?: number | undefined;
}>;
export type CodeFindingDTO = z.infer<typeof CodeFindingSchema>;
export declare const SourceAnalysisResultSchema: z.ZodObject<{
    repositoryUrl: z.ZodString;
    branch: z.ZodString;
    commitSha: z.ZodString;
    totalFilesScanned: z.ZodNumber;
    totalLinesOfCode: z.ZodNumber;
    findings: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodNumber;
        column: z.ZodOptional<z.ZodNumber>;
        ruleId: z.ZodString;
        title: z.ZodString;
        severity: z.ZodNativeEnum<typeof Severity>;
        description: z.ZodString;
        codeSnippet: z.ZodString;
        recommendation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        severity: Severity;
        recommendation: string;
        file: string;
        line: number;
        ruleId: string;
        codeSnippet: string;
        column?: number | undefined;
    }, {
        description: string;
        title: string;
        severity: Severity;
        recommendation: string;
        file: string;
        line: number;
        ruleId: string;
        codeSnippet: string;
        column?: number | undefined;
    }>, "many">;
    endpointsDiscovered: z.ZodArray<z.ZodObject<{
        method: z.ZodString;
        path: z.ZodString;
        sourceLocation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        method: string;
        path: string;
        sourceLocation: string;
    }, {
        method: string;
        path: string;
        sourceLocation: string;
    }>, "many">;
    codeQualityScore: z.ZodNumber;
    maintainabilityIndex: z.ZodEnum<["A", "B", "C", "D", "F"]>;
}, "strip", z.ZodTypeAny, {
    commitSha: string;
    branch: string;
    repositoryUrl: string;
    totalFilesScanned: number;
    totalLinesOfCode: number;
    findings: {
        description: string;
        title: string;
        severity: Severity;
        recommendation: string;
        file: string;
        line: number;
        ruleId: string;
        codeSnippet: string;
        column?: number | undefined;
    }[];
    endpointsDiscovered: {
        method: string;
        path: string;
        sourceLocation: string;
    }[];
    codeQualityScore: number;
    maintainabilityIndex: "A" | "B" | "C" | "D" | "F";
}, {
    commitSha: string;
    branch: string;
    repositoryUrl: string;
    totalFilesScanned: number;
    totalLinesOfCode: number;
    findings: {
        description: string;
        title: string;
        severity: Severity;
        recommendation: string;
        file: string;
        line: number;
        ruleId: string;
        codeSnippet: string;
        column?: number | undefined;
    }[];
    endpointsDiscovered: {
        method: string;
        path: string;
        sourceLocation: string;
    }[];
    codeQualityScore: number;
    maintainabilityIndex: "A" | "B" | "C" | "D" | "F";
}>;
export type SourceAnalysisResultDTO = z.infer<typeof SourceAnalysisResultSchema>;
