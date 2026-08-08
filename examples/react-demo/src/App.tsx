import { useAccessibility } from '@a11y-toolkit/core';
import { AccessibilityPanel } from '@a11y-toolkit/visual';
import { InteractionEffects, SkipLink } from '@a11y-toolkit/modes';

export function App() {
  const { preferences } = useAccessibility();

  return (
    <>
      <SkipLink targetId="main-content" />
      <InteractionEffects contentSelector="#main-content" />
      <AccessibilityPanel />
      <main id="main-content" tabIndex={-1}>
        <p className="eyebrow">Track 1 demo</p>
        <h1>A11y Toolkit</h1>
        <p>
          Open the floating accessibility button to adjust this page. Every control updates the shared
          provider, changes documented CSS variables, and saves automatically.
        </p>
        <dl>
        <div>
          <dt>Storage schema</dt>
          <dd>v{preferences.version}</dd>
        </div>
        <div>
          <dt>Visual font size</dt>
          <dd>{preferences.visual.fontSize}px</dd>
        </div>
        <div>
          <dt>Theme</dt>
          <dd>{preferences.visual.theme}</dd>
        </div>
        </dl>
      </main>
      <aside className="demo-distraction" aria-label="Supplementary content">
        <strong>Supplementary content</strong>
        <p>This card is intentionally dimmed by ADHD mode so the reading area stays in focus.</p>
      </aside>
    </>
  );
}
