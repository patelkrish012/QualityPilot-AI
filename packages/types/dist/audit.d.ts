import { z } from 'zod';
export declare const AccessibilityViolationSchema: z.ZodObject<{
    id: z.ZodString;
    impact: z.ZodEnum<["minor", "moderate", "serious", "critical"]>;
    description: z.ZodString;
    helpUrl: z.ZodString;
    nodesAffected: z.ZodNumber;
    targetSelector: z.ZodString;
    failureSummary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    description: string;
    helpUrl: string;
    nodesAffected: number;
    targetSelector: string;
    failureSummary: string;
}, {
    id: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    description: string;
    helpUrl: string;
    nodesAffected: number;
    targetSelector: string;
    failureSummary: string;
}>;
export type AccessibilityViolationDTO = z.infer<typeof AccessibilityViolationSchema>;
export declare const PerformanceMetricsSchema: z.ZodObject<{
    domContentLoadedMs: z.ZodNumber;
    loadTimeMs: z.ZodNumber;
    firstContentfulPaintMs: z.ZodOptional<z.ZodNumber>;
    totalByteSize: z.ZodNumber;
    resourceCount: z.ZodNumber;
    slowResources: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        durationMs: z.ZodNumber;
        transferSize: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        url: string;
        durationMs: number;
        transferSize: number;
    }, {
        url: string;
        durationMs: number;
        transferSize: number;
    }>, "many">;
    coreWebVitalsScore: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    domContentLoadedMs: number;
    loadTimeMs: number;
    totalByteSize: number;
    resourceCount: number;
    slowResources: {
        url: string;
        durationMs: number;
        transferSize: number;
    }[];
    coreWebVitalsScore: number;
    firstContentfulPaintMs?: number | undefined;
}, {
    domContentLoadedMs: number;
    loadTimeMs: number;
    totalByteSize: number;
    resourceCount: number;
    slowResources: {
        url: string;
        durationMs: number;
        transferSize: number;
    }[];
    coreWebVitalsScore: number;
    firstContentfulPaintMs?: number | undefined;
}>;
export type PerformanceMetricsDTO = z.infer<typeof PerformanceMetricsSchema>;
export declare const AuditReportSchema: z.ZodObject<{
    targetUrl: z.ZodString;
    accessibilityScore: z.ZodNumber;
    violations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        impact: z.ZodEnum<["minor", "moderate", "serious", "critical"]>;
        description: z.ZodString;
        helpUrl: z.ZodString;
        nodesAffected: z.ZodNumber;
        targetSelector: z.ZodString;
        failureSummary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        impact: "minor" | "moderate" | "serious" | "critical";
        description: string;
        helpUrl: string;
        nodesAffected: number;
        targetSelector: string;
        failureSummary: string;
    }, {
        id: string;
        impact: "minor" | "moderate" | "serious" | "critical";
        description: string;
        helpUrl: string;
        nodesAffected: number;
        targetSelector: string;
        failureSummary: string;
    }>, "many">;
    performance: z.ZodObject<{
        domContentLoadedMs: z.ZodNumber;
        loadTimeMs: z.ZodNumber;
        firstContentfulPaintMs: z.ZodOptional<z.ZodNumber>;
        totalByteSize: z.ZodNumber;
        resourceCount: z.ZodNumber;
        slowResources: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            durationMs: z.ZodNumber;
            transferSize: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            url: string;
            durationMs: number;
            transferSize: number;
        }, {
            url: string;
            durationMs: number;
            transferSize: number;
        }>, "many">;
        coreWebVitalsScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        domContentLoadedMs: number;
        loadTimeMs: number;
        totalByteSize: number;
        resourceCount: number;
        slowResources: {
            url: string;
            durationMs: number;
            transferSize: number;
        }[];
        coreWebVitalsScore: number;
        firstContentfulPaintMs?: number | undefined;
    }, {
        domContentLoadedMs: number;
        loadTimeMs: number;
        totalByteSize: number;
        resourceCount: number;
        slowResources: {
            url: string;
            durationMs: number;
            transferSize: number;
        }[];
        coreWebVitalsScore: number;
        firstContentfulPaintMs?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    targetUrl: string;
    accessibilityScore: number;
    violations: {
        id: string;
        impact: "minor" | "moderate" | "serious" | "critical";
        description: string;
        helpUrl: string;
        nodesAffected: number;
        targetSelector: string;
        failureSummary: string;
    }[];
    performance: {
        domContentLoadedMs: number;
        loadTimeMs: number;
        totalByteSize: number;
        resourceCount: number;
        slowResources: {
            url: string;
            durationMs: number;
            transferSize: number;
        }[];
        coreWebVitalsScore: number;
        firstContentfulPaintMs?: number | undefined;
    };
}, {
    targetUrl: string;
    accessibilityScore: number;
    violations: {
        id: string;
        impact: "minor" | "moderate" | "serious" | "critical";
        description: string;
        helpUrl: string;
        nodesAffected: number;
        targetSelector: string;
        failureSummary: string;
    }[];
    performance: {
        domContentLoadedMs: number;
        loadTimeMs: number;
        totalByteSize: number;
        resourceCount: number;
        slowResources: {
            url: string;
            durationMs: number;
            transferSize: number;
        }[];
        coreWebVitalsScore: number;
        firstContentfulPaintMs?: number | undefined;
    };
}>;
export type AuditReportDTO = z.infer<typeof AuditReportSchema>;
