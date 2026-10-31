import { z } from 'zod';
export declare enum AuthorType {
    HUMAN = "HUMAN",
    AI_ASSISTED = "AI_ASSISTED",
    COLLABORATIVE_MIXED = "COLLABORATIVE_MIXED"
}
export declare enum GitRiskLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export declare const GitCommitAnalysisSchema: z.ZodObject<{
    commitHash: z.ZodString;
    authorName: z.ZodString;
    authorEmail: z.ZodString;
    message: z.ZodString;
    timestamp: z.ZodString;
    stats: z.ZodObject<{
        filesChanged: z.ZodNumber;
        insertions: z.ZodNumber;
        deletions: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        filesChanged: number;
        insertions: number;
        deletions: number;
    }, {
        filesChanged: number;
        insertions: number;
        deletions: number;
    }>;
    aiAuthorshipIndicators: z.ZodObject<{
        estimatedType: z.ZodNativeEnum<typeof AuthorType>;
        confidencePercentage: z.ZodNumber;
        evidenceFactors: z.ZodArray<z.ZodString, "many">;
        disclaimer: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        estimatedType: AuthorType;
        confidencePercentage: number;
        evidenceFactors: string[];
        disclaimer: string;
    }, {
        estimatedType: AuthorType;
        confidencePercentage: number;
        evidenceFactors: string[];
        disclaimer?: string | undefined;
    }>;
    qualityRisk: z.ZodObject<{
        riskLevel: z.ZodNativeEnum<typeof GitRiskLevel>;
        hallucinatedApiSignaturesDetected: z.ZodBoolean;
        missingErrorHandling: z.ZodBoolean;
        missingUnitTests: z.ZodBoolean;
        suspiciousBoilerplateDetected: z.ZodBoolean;
        flags: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        riskLevel: GitRiskLevel;
        hallucinatedApiSignaturesDetected: boolean;
        missingErrorHandling: boolean;
        missingUnitTests: boolean;
        suspiciousBoilerplateDetected: boolean;
        flags: string[];
    }, {
        riskLevel: GitRiskLevel;
        hallucinatedApiSignaturesDetected: boolean;
        missingErrorHandling: boolean;
        missingUnitTests: boolean;
        suspiciousBoilerplateDetected: boolean;
        flags: string[];
    }>;
    reviewerRecommendations: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    message: string;
    commitHash: string;
    authorName: string;
    authorEmail: string;
    timestamp: string;
    stats: {
        filesChanged: number;
        insertions: number;
        deletions: number;
    };
    aiAuthorshipIndicators: {
        estimatedType: AuthorType;
        confidencePercentage: number;
        evidenceFactors: string[];
        disclaimer: string;
    };
    qualityRisk: {
        riskLevel: GitRiskLevel;
        hallucinatedApiSignaturesDetected: boolean;
        missingErrorHandling: boolean;
        missingUnitTests: boolean;
        suspiciousBoilerplateDetected: boolean;
        flags: string[];
    };
    reviewerRecommendations: string[];
}, {
    message: string;
    commitHash: string;
    authorName: string;
    authorEmail: string;
    timestamp: string;
    stats: {
        filesChanged: number;
        insertions: number;
        deletions: number;
    };
    aiAuthorshipIndicators: {
        estimatedType: AuthorType;
        confidencePercentage: number;
        evidenceFactors: string[];
        disclaimer?: string | undefined;
    };
    qualityRisk: {
        riskLevel: GitRiskLevel;
        hallucinatedApiSignaturesDetected: boolean;
        missingErrorHandling: boolean;
        missingUnitTests: boolean;
        suspiciousBoilerplateDetected: boolean;
        flags: string[];
    };
    reviewerRecommendations: string[];
}>;
export type GitCommitAnalysis = z.infer<typeof GitCommitAnalysisSchema>;
export declare const PullRequestReviewInputSchema: z.ZodObject<{
    prNumber: z.ZodOptional<z.ZodNumber>;
    title: z.ZodString;
    description: z.ZodString;
    changedFiles: z.ZodArray<z.ZodObject<{
        filename: z.ZodString;
        status: z.ZodEnum<["added", "modified", "removed", "renamed"]>;
        additions: z.ZodNumber;
        deletions: z.ZodNumber;
        patch: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "added" | "modified" | "removed" | "renamed";
        deletions: number;
        filename: string;
        additions: number;
        patch?: string | undefined;
    }, {
        status: "added" | "modified" | "removed" | "renamed";
        deletions: number;
        filename: string;
        additions: number;
        patch?: string | undefined;
    }>, "many">;
    commitMessages: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    changedFiles: {
        status: "added" | "modified" | "removed" | "renamed";
        deletions: number;
        filename: string;
        additions: number;
        patch?: string | undefined;
    }[];
    commitMessages: string[];
    prNumber?: number | undefined;
}, {
    description: string;
    title: string;
    changedFiles: {
        status: "added" | "modified" | "removed" | "renamed";
        deletions: number;
        filename: string;
        additions: number;
        patch?: string | undefined;
    }[];
    prNumber?: number | undefined;
    commitMessages?: string[] | undefined;
}>;
export type PullRequestReviewInput = z.infer<typeof PullRequestReviewInputSchema>;
export declare const PullRequestReviewResultSchema: z.ZodObject<{
    summary: z.ZodString;
    overallRiskLevel: z.ZodNativeEnum<typeof GitRiskLevel>;
    estimatedAuthorshipDistribution: z.ZodObject<{
        humanPercentage: z.ZodNumber;
        aiAssistedPercentage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        humanPercentage: number;
        aiAssistedPercentage: number;
    }, {
        humanPercentage: number;
        aiAssistedPercentage: number;
    }>;
    automatedChecklist: z.ZodArray<z.ZodObject<{
        category: z.ZodString;
        passed: z.ZodBoolean;
        details: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        passed: boolean;
        category: string;
        details: string;
    }, {
        passed: boolean;
        category: string;
        details: string;
    }>, "many">;
    criticalReviewFindings: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        finding: z.ZodString;
        suggestedFix: z.ZodOptional<z.ZodString>;
        severity: z.ZodEnum<["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]>;
    }, "strip", z.ZodTypeAny, {
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
        file: string;
        finding: string;
        line?: number | undefined;
        suggestedFix?: string | undefined;
    }, {
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
        file: string;
        finding: string;
        line?: number | undefined;
        suggestedFix?: string | undefined;
    }>, "many">;
    mergeApprovalRecommendation: z.ZodEnum<["READY_TO_MERGE", "REQUIRES_MANUAL_REVIEW", "BLOCK_MERGE"]>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    overallRiskLevel: GitRiskLevel;
    estimatedAuthorshipDistribution: {
        humanPercentage: number;
        aiAssistedPercentage: number;
    };
    automatedChecklist: {
        passed: boolean;
        category: string;
        details: string;
    }[];
    criticalReviewFindings: {
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
        file: string;
        finding: string;
        line?: number | undefined;
        suggestedFix?: string | undefined;
    }[];
    mergeApprovalRecommendation: "READY_TO_MERGE" | "REQUIRES_MANUAL_REVIEW" | "BLOCK_MERGE";
}, {
    summary: string;
    overallRiskLevel: GitRiskLevel;
    estimatedAuthorshipDistribution: {
        humanPercentage: number;
        aiAssistedPercentage: number;
    };
    automatedChecklist: {
        passed: boolean;
        category: string;
        details: string;
    }[];
    criticalReviewFindings: {
        severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
        file: string;
        finding: string;
        line?: number | undefined;
        suggestedFix?: string | undefined;
    }[];
    mergeApprovalRecommendation: "READY_TO_MERGE" | "REQUIRES_MANUAL_REVIEW" | "BLOCK_MERGE";
}>;
export type PullRequestReviewResult = z.infer<typeof PullRequestReviewResultSchema>;
