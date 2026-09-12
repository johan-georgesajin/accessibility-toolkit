import type { AccessibilityIssue } from "./types";

function hasAccessibleName(element: Element): boolean {
  return Boolean(
    element.textContent?.trim() ||
      element.getAttribute("aria-label")?.trim() ||
      element.getAttribute("aria-labelledby")?.trim(),
  );
}

export function scanAccessibility(
  root: ParentNode = document,
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Rule 1: Images must have an alt attribute.
  root.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("alt")) {
      issues.push({
        rule: "image-alt",
        severity: "error",
        message: "Image is missing alternative text.",
        element: "<img>",
        suggestion: 'Add an alt attribute, for example: alt="Company logo".',
      });
    }
  });

  // Rule 2: Buttons need an accessible name.
  root.querySelectorAll("button").forEach((button) => {
    if (!hasAccessibleName(button)) {
      issues.push({
        rule: "button-name",
        severity: "error",
        message: "Button has no accessible name.",
        element: "<button>",
        suggestion: "Add visible text or an aria-label attribute.",
      });
    }
  });

  // Rule 3: Links need readable text or an aria-label.
  root.querySelectorAll("a").forEach((link) => {
    if (!hasAccessibleName(link)) {
      issues.push({
        rule: "link-name",
        severity: "error",
        message: "Link has no accessible name.",
        element: "<a>",
        suggestion: "Add descriptive link text or an aria-label attribute.",
      });
    }
  });

  // Rule 4: Do not skip heading levels, such as h1 to h3.
  let previousLevel = 0;

  root.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    const currentLevel = Number(heading.tagName.slice(1));

    if (previousLevel !== 0 && currentLevel > previousLevel + 1) {
      issues.push({
        rule: "heading-order",
        severity: "warning",
        message: `Heading order skips from h${previousLevel} to h${currentLevel}.`,
        element: `<${heading.tagName.toLowerCase()}>`,
        suggestion: "Use heading levels in order without skipping levels.",
      });
    }

    previousLevel = currentLevel;
  });

  return issues;
}