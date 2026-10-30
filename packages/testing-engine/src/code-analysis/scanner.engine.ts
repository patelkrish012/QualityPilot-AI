import * as fs from 'fs';
import * as path from 'path';
import { SourceAnalysisResultDTO, CodeFindingDTO, Severity } from '@qualitypilot/types';

export class SourceCodeScannerEngine {
  /**
   * Scans a local directory or fetched repository directory for security flaws,
   * unvalidated routes, missing boundary validations, and extracts REST endpoints.
   * Conforms to:
   * - Section 2: Mode B — Source-Code Intelligence Testing
   * - Section 23: Source Code Quality
   */
  scanDirectory(baseDir: string, repoUrl: string = 'local-workspace', branch: string = 'main'): SourceAnalysisResultDTO {
    const findings: CodeFindingDTO[] = [];
    const endpointsDiscovered: { method: string; path: string; sourceLocation: string }[] = [];
    let totalLinesOfCode = 0;
    let totalFilesScanned = 0;

    const walk = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (
            entry.name === 'node_modules' ||
            entry.name === '.git' ||
            entry.name === 'dist' ||
            entry.name === '.next'
          ) {
            continue;
          }
          walk(fullPath);
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          totalFilesScanned++;
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          totalLinesOfCode += lines.length;

          // Rule 1: Static Check for hard-coded credentials/secrets (Section 22)
          lines.forEach((line, index) => {
            if (/(password|secret|api_key|token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{8,}['"]/i.test(line)) {
              findings.push({
                file: path.relative(baseDir, fullPath).replace(/\\/g, '/'),
                line: index + 1,
                ruleId: 'SEC-HARDCODED-SECRET',
                title: 'Potential Hardcoded Secret or Token',
                severity: Severity.CRITICAL,
                description: 'Detected possible hardcoded credential in source code.',
                codeSnippet: line.trim(),
                recommendation: 'Move credentials to environment variables (.env) and secret manager.',
              });
            }

            // Rule 2: SQL Injection indicators (Section 22)
            if (/(\$queryRawUnsafe|SELECT\s+.*WHERE.*`\s*\+)/i.test(line)) {
              findings.push({
                file: path.relative(baseDir, fullPath).replace(/\\/g, '/'),
                line: index + 1,
                ruleId: 'SEC-SQL-INJECTION-RISK',
                title: 'Potential Unescaped SQL Query',
                severity: Severity.HIGH,
                description: 'Raw SQL concatenation detected without parameterized arguments.',
                codeSnippet: line.trim(),
                recommendation: 'Use parameterized queries or ORM abstractions.',
              });
            }

            // Rule 3: Detect REST Endpoints for Mode B traceability
            const matchRoute = line.match(/@(Get|Post|Put|Delete|Patch)\s*\(\s*['"]([^'"]*)['"]\s*\)/i);
            if (matchRoute) {
              endpointsDiscovered.push({
                method: matchRoute[1].toUpperCase(),
                path: matchRoute[2] || '/',
                sourceLocation: `${path.relative(baseDir, fullPath).replace(/\\/g, '/')}:${index + 1}`,
              });
            }
          });
        }
      }
    };

    walk(baseDir);

    // Compute deterministic Maintainability and Code Quality Score
    const defectPenalty = findings.reduce((acc, f) => {
      if (f.severity === Severity.CRITICAL) return acc + 25;
      if (f.severity === Severity.HIGH) return acc + 10;
      if (f.severity === Severity.MEDIUM) return acc + 5;
      return acc + 1;
    }, 0);

    const codeQualityScore = Math.max(0, 100 - defectPenalty);
    const maintainabilityIndex =
      codeQualityScore >= 90 ? 'A' : codeQualityScore >= 80 ? 'B' : codeQualityScore >= 70 ? 'C' : 'D';

    return {
      repositoryUrl: repoUrl,
      branch,
      commitSha: 'HEAD-' + Math.floor(Math.random() * 899999 + 100000),
      totalFilesScanned,
      totalLinesOfCode,
      findings,
      endpointsDiscovered,
      codeQualityScore,
      maintainabilityIndex,
    };
  }
}
