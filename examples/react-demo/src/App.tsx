import { useAccessibility } from '@a11y-toolkit/core';
import { AccessibilityPanel } from '@a11y-toolkit/visual';
import { InteractionEffects, SkipLink, useAccessibilityModes } from '@a11y-toolkit/modes';

function ModeControls() {
  const { activeMode, activateMode, deactivateMode } = useAccessibilityModes();
  return (
    <section aria-label="Accessibility modes">
      <h2>Reading modes</h2>
      <p>Active mode: {activeMode ?? 'None'}</p>
      <button type="button" onClick={() => activateMode('dyslexia')}>Dyslexia mode</button>
      <button type="button" onClick={() => activateMode('adhd')}>ADHD mode</button>
      <button type="button" onClick={() => activateMode('lowVision')}>Low vision mode</button>
      <button type="button" onClick={deactivateMode}>Turn mode off</button>
    </section>
  );
}

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
        <ModeControls />
      </main>
    </>
  );
}
