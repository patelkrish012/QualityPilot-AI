import { Injectable } from '@nestjs/common';
import { StructuredRequirementDTO, TestMatrixGenerationDTO } from '@qualitypilot/types';

@Injectable()
export class RequirementIntelligenceEngine {
  /**
   * Analyzes natural language requirements for ambiguities and missing criteria.
   * Dynamically tailors structured validation rules and edge cases to the input domain.
   */
  analyzeRequirement(text: string = '', code: string = 'REQ-001'): StructuredRequirementDTO {
    const raw = (text || '').trim();
    const lower = raw.toLowerCase();
    const ambiguities: string[] = [];

    // 1. Ambiguity detection: Subjective/unmeasurable terms
    const subjectiveWords = ['strong', 'secure', 'fast', 'quick', 'user-friendly', 'good', 'reliable', 'appropriate', 'simple', 'robust'];
    const matchedSubjective = subjectiveWords.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower));
    if (matchedSubjective.length > 0) {
      ambiguities.push(`Uses subjective descriptor(s) ("${matchedSubjective.join('", "')}") without concrete boundary limits.`);
    }

    // 2. Missing measurable thresholds or sizes
    if (!/\d+/.test(raw) && !lower.includes('limit') && !lower.includes('size') && !lower.includes('length')) {
      ambiguities.push('Missing explicit numerical boundaries (e.g. min/max length, size limit, or SLA timing).');
    }

    // 3. Missing error / edge-case handling criteria
    if (!lower.includes('error') && !lower.includes('fail') && !lower.includes('invalid') && !lower.includes('reject')) {
      ambiguities.push('Missing failure handling definition: does not specify system behavior when validation fails.');
    }

    const isAmbiguous = ambiguities.length > 0;

    // Detect domain
    let domain: 'AUTH' | 'UPLOAD' | 'PAYMENT' | 'SEARCH' | 'GENERIC' = 'GENERIC';
    if (lower.includes('password') || lower.includes('login') || lower.includes('auth') || lower.includes('credential')) {
      domain = 'AUTH';
    } else if (lower.includes('upload') || lower.includes('file') || lower.includes('image') || lower.includes('document') || lower.includes('pdf')) {
      domain = 'UPLOAD';
    } else if (lower.includes('pay') || lower.includes('checkout') || lower.includes('card') || lower.includes('stripe') || lower.includes('price')) {
      domain = 'PAYMENT';
    } else if (lower.includes('search') || lower.includes('filter') || lower.includes('query')) {
      domain = 'SEARCH';
    }

    let structuredRules: Array<{ ruleText: string; isMeasurable: boolean; category: 'VALIDATION' | 'SECURITY' | 'EDGE_CASE' | 'ACCESSIBILITY' }> = [];
    let suggestedClearRequirement = raw;

    if (domain === 'AUTH') {
      structuredRules = [
        { ruleText: 'Must enforce minimum length boundary (e.g. at least 8 characters).', isMeasurable: true, category: 'VALIDATION' },
        { ruleText: 'Must require character complexity (uppercase, lowercase, number, symbol).', isMeasurable: true, category: 'SECURITY' },
        { ruleText: 'Must safely trim leading/trailing whitespace without silent truncation.', isMeasurable: true, category: 'EDGE_CASE' },
        { ruleText: 'Must render accessible error alert if validation criteria are not met.', isMeasurable: true, category: 'ACCESSIBILITY' },
      ];
      suggestedClearRequirement = `${raw || 'Password'} must be 8-64 characters and contain at least 1 uppercase letter, 1 number, and 1 symbol.`;
    } else if (domain === 'UPLOAD') {
      structuredRules = [
        { ruleText: 'Must validate explicit MIME type / file extensions (e.g. PDF, PNG, JPG only).', isMeasurable: true, category: 'VALIDATION' },
        { ruleText: 'Must enforce maximum file size limit (e.g. max 10MB per file).', isMeasurable: true, category: 'SECURITY' },
        { ruleText: 'Must reject zero-byte empty files and corrupted binary payloads.', isMeasurable: true, category: 'EDGE_CASE' },
        { ruleText: 'Must display upload progress indicator and dismissible error toasts.', isMeasurable: true, category: 'ACCESSIBILITY' },
      ];
      suggestedClearRequirement = `${raw}. Accepted formats: PDF and PNG (max 10MB). Show inline validation error for unsupported files.`;
    } else if (domain === 'PAYMENT') {
      structuredRules = [
        { ruleText: 'Must enforce positive non-zero numeric amount formatted to 2 decimal places.', isMeasurable: true, category: 'VALIDATION' },
        { ruleText: 'Must use idempotency keys to prevent duplicate checkout charges.', isMeasurable: true, category: 'SECURITY' },
        { ruleText: 'Must gracefully handle card decline, insufficient funds, and network timeout.', isMeasurable: true, category: 'EDGE_CASE' },
        { ruleText: 'Must clearly communicate transaction status with screen-reader accessible alerts.', isMeasurable: true, category: 'ACCESSIBILITY' },
      ];
      suggestedClearRequirement = `${raw}. Amount must be positive decimal. Enforce idempotency header and handle network retry safely.`;
    } else if (domain === 'SEARCH') {
      structuredRules = [
        { ruleText: 'Must sanitize search query against SQL injection and script injection.', isMeasurable: true, category: 'SECURITY' },
        { ruleText: 'Must handle empty query gracefully by returning default sorted list or empty state.', isMeasurable: true, category: 'EDGE_CASE' },
        { ruleText: 'Must enforce max search query length (e.g. max 100 characters).', isMeasurable: true, category: 'VALIDATION' },
        { ruleText: 'Must announce search result count to screen readers using ARIA live regions.', isMeasurable: true, category: 'ACCESSIBILITY' },
      ];
      suggestedClearRequirement = `${raw}. Max query length 100 characters. Sanitize input and announce total matched results via ARIA live.`;
    } else {
      structuredRules = [
        { ruleText: 'Must define explicit format constraints and mandatory field validation.', isMeasurable: true, category: 'VALIDATION' },
        { ruleText: 'Must sanitize and escape user inputs to prevent injection attacks.', isMeasurable: true, category: 'SECURITY' },
        { ruleText: 'Must safely handle boundary edge cases: empty strings, max lengths, and special characters.', isMeasurable: true, category: 'EDGE_CASE' },
        { ruleText: 'Must display clear, actionable feedback when validation constraints are violated.', isMeasurable: true, category: 'ACCESSIBILITY' },
      ];
      suggestedClearRequirement = `${raw}. Specify boundary thresholds, allowed character sets, and exact failure responses.`;
    }

    return {
      code,
      title: raw.length > 50 ? raw.substring(0, 47) + '...' : (raw || 'Unspecified Requirement'),
      isAmbiguous,
      detectedAmbiguities: ambiguities,
      structuredRules,
      suggestedClearRequirement,
    };
  }

  /**
   * Generates risk-driven test matrix dynamically based on requirement code and context.
   */
  generateTestMatrix(reqCode: string = 'REQ-001', rawText?: string): TestMatrixGenerationDTO {
    const text = (rawText || '').toLowerCase();
    const isUpload = text.includes('upload') || text.includes('file');
    const isPayment = text.includes('pay') || text.includes('checkout');

    let testCases: any[] = [];

    if (isUpload) {
      testCases = [
        {
          identifier: `${reqCode}-001`,
          title: 'Valid file upload within size limit',
          category: 'Positive',
          priority: 'CRITICAL',
          testData: { file: 'sample_document.pdf (2.4MB)' },
          steps: [
            { stepNumber: 1, action: 'ATTACH', target: 'input[type="file"]', value: 'sample.pdf', expectedResult: 'File selected' },
            { stepNumber: 2, action: 'CLICK', target: 'button.upload', expectedResult: 'Upload 200 OK' },
          ],
        },
        {
          identifier: `${reqCode}-002`,
          title: 'Unsupported file extension rejection',
          category: 'Negative',
          priority: 'CRITICAL',
          testData: { file: 'script.exe' },
          steps: [
            { stepNumber: 1, action: 'ATTACH', target: 'input[type="file"]', value: 'script.exe', expectedResult: 'Validation error: Unsupported format' },
          ],
        },
        {
          identifier: `${reqCode}-003`,
          title: 'File exceeding maximum size boundary',
          category: 'Boundary',
          priority: 'HIGH',
          testData: { file: 'large_payload.pdf (15MB)' },
          steps: [
            { stepNumber: 1, action: 'ATTACH', target: 'input[type="file"]', value: 'large.pdf', expectedResult: 'Rejected: File exceeds 10MB limit' },
          ],
        },
        {
          identifier: `${reqCode}-004`,
          title: 'Zero-byte empty file edge case',
          category: 'EdgeCase',
          priority: 'MEDIUM',
          testData: { file: 'empty.pdf (0 bytes)' },
          steps: [
            { stepNumber: 1, action: 'ATTACH', target: 'input[type="file"]', value: 'empty.pdf', expectedResult: 'Rejected: File cannot be empty' },
          ],
        },
      ];
    } else if (isPayment) {
      testCases = [
        {
          identifier: `${reqCode}-001`,
          title: 'Valid purchase with conforming payment payload',
          category: 'Positive',
          priority: 'CRITICAL',
          testData: { amount: '$49.99' },
          steps: [
            { stepNumber: 1, action: 'SUBMIT', target: 'form.checkout', value: '49.99', expectedResult: 'Charge authorized 200 OK' },
          ],
        },
        {
          identifier: `${reqCode}-002`,
          title: 'Negative or zero amount rejection',
          category: 'Negative',
          priority: 'CRITICAL',
          testData: { amount: '-$5.00' },
          steps: [
            { stepNumber: 1, action: 'SUBMIT', target: 'form.checkout', value: '-5.00', expectedResult: 'Rejected: Amount must be greater than zero' },
          ],
        },
        {
          identifier: `${reqCode}-003`,
          title: 'Duplicate rapid-click idempotency protection',
          category: 'EdgeCase',
          priority: 'HIGH',
          testData: { doubleClick: true },
          steps: [
            { stepNumber: 1, action: 'DOUBLE_CLICK', target: 'button.pay', expectedResult: 'Single transaction processed; button disabled' },
          ],
        },
      ];
    } else {
      testCases = [
        {
          identifier: `${reqCode}-001`,
          title: 'Conforming input satisfying all constraints',
          category: 'Positive',
          priority: 'CRITICAL',
          testData: { input: 'ValidConformingInput' },
          steps: [
            { stepNumber: 1, action: 'INPUT', target: 'input[name="target"]', value: 'ValidConformingInput', expectedResult: 'Input accepted' },
            { stepNumber: 2, action: 'SUBMIT', target: 'button[type="submit"]', expectedResult: 'Success 200 OK' },
          ],
        },
        {
          identifier: `${reqCode}-002`,
          title: 'Empty input submission rejection',
          category: 'Negative',
          priority: 'CRITICAL',
          testData: { input: '' },
          steps: [
            { stepNumber: 1, action: 'SUBMIT', target: 'button[type="submit"]', expectedResult: 'Rejected: Field required' },
          ],
        },
        {
          identifier: `${reqCode}-003`,
          title: 'Boundary maximum character limit violation',
          category: 'Boundary',
          priority: 'HIGH',
          testData: { input: 'A'.repeat(256) },
          steps: [
            { stepNumber: 1, action: 'INPUT', target: 'input[name="target"]', value: 'A'.repeat(256), expectedResult: 'Truncated or rejected by boundary rule' },
          ],
        },
        {
          identifier: `${reqCode}-004`,
          title: 'Whitespace padding and special character edge case',
          category: 'EdgeCase',
          priority: 'MEDIUM',
          testData: { input: '   <script>alert(1)</script>   ' },
          steps: [
            { stepNumber: 1, action: 'INPUT', target: 'input[name="target"]', value: '   <script>alert(1)</script>   ', expectedResult: 'Safely sanitized without XSS execution' },
          ],
        },
      ];
    }

    return {
      requirementCode: reqCode,
      totalGenerated: testCases.length,
      testCases,
    };
  }
}
