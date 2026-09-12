export type Severity = "error" | "warning";

export interface AccessibilityIssue {
  rule: string;
  severity: Severity;
  message: string;
  element: string;
  suggestion: string;
}