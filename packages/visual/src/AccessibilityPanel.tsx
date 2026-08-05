import { useEffect, useState } from 'react';
import { useAccessibility } from '@a11y-toolkit/core';
import type { ReadableFont, VisualPreferences } from '@a11y-toolkit/core';
import { AccessibilityMagnifier } from './AccessibilityMagnifier';
import {
  AccessibilityVisualEffects,
  type AccessibilityVisualEffectsProps,
} from './AccessibilityVisualEffects';

export interface AccessibilityPanelProps extends AccessibilityVisualEffectsProps {
  label?: string;
}

const FONTS: ReadonlyArray<{ value: ReadableFont; label: string }> = [
  { value: 'system', label: 'System default' },
  { value: 'opendyslexic', label: 'OpenDyslexic' },
  { value: 'lexend', label: 'Lexend' },
  { value: 'atkinson-hyperlegible', label: 'Atkinson Hyperlegible' },
];

function RangeControl({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="a11y-control">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id}>{`${value}${unit}`}</output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function ToggleControl({
  label,
  description,
  pressed,
  onClick,
}: {
  label: string;
  description: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button className="a11y-toggle" type="button" aria-pressed={pressed} onClick={onClick}>
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span aria-hidden="true" className="a11y-switch" />
    </button>
  );
}

/** Keyboard-accessible floating visual accessibility controls. */
export function AccessibilityPanel({
  rootElement,
  label = 'Accessibility controls',
}: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    savePreferences,
    loadPreferences,
    registerPlugin,
  } = useAccessibility();
  const visual = preferences.visual;

  useEffect(
    () => registerPlugin({ id: 'visual.panel', title: 'Visual controls', track: 'visual' }),
    [registerPlugin],
  );

  const updateVisual = (patch: Partial<VisualPreferences>) => {
    updatePreferences({ visual: { ...visual, ...patch } });
  };

  return (
    <>
      <AccessibilityVisualEffects rootElement={rootElement} />
      {visual.magnifierEnabled && <AccessibilityMagnifier />}
      <button
        className="a11y-launcher"
        type="button"
        aria-expanded={isOpen}
        aria-controls="a11y-accessibility-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">◉</span>
        Accessibility
      </button>
      {isOpen && (
        <aside id="a11y-accessibility-panel" className="a11y-panel" aria-label={label}>
          <header className="a11y-panel-header">
            <div>
              <p>Display preferences</p>
              <h2>{label}</h2>
            </div>
            <button
              type="button"
              className="a11y-icon-button"
              aria-label="Close accessibility controls"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>

          <section aria-labelledby="a11y-reading-heading">
            <h3 id="a11y-reading-heading">Reading</h3>
            <RangeControl
              id="a11y-font-size"
              label="Text size"
              value={visual.fontSize}
              min={14}
              max={28}
              step={1}
              unit="px"
              onChange={(fontSize) => updateVisual({ fontSize })}
            />
            <RangeControl
              id="a11y-line-height"
              label="Line height"
              value={visual.lineHeight}
              min={1.2}
              max={2.4}
              step={0.1}
              unit=""
              onChange={(lineHeight) => updateVisual({ lineHeight })}
            />
            <RangeControl
              id="a11y-letter-spacing"
              label="Letter spacing"
              value={visual.letterSpacing}
              min={0}
              max={6}
              step={0.5}
              unit="px"
              onChange={(letterSpacing) => updateVisual({ letterSpacing })}
            />
            <RangeControl
              id="a11y-word-spacing"
              label="Word spacing"
              value={visual.wordSpacing}
              min={0}
              max={12}
              step={1}
              unit="px"
              onChange={(wordSpacing) => updateVisual({ wordSpacing })}
            />
            <label className="a11y-select" htmlFor="a11y-font-family">
              <span>Readable font</span>
              <select
                id="a11y-font-family"
                value={visual.fontFamily}
                onChange={(event) =>
                  updateVisual({ fontFamily: event.target.value as ReadableFont })
                }
              >
                {FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section aria-labelledby="a11y-colors-heading">
            <h3 id="a11y-colors-heading">Colors and theme</h3>
            <label className="a11y-select" htmlFor="a11y-contrast">
              <span>Contrast</span>
              <select
                id="a11y-contrast"
                value={visual.contrast}
                onChange={(event) =>
                  updateVisual({ contrast: event.target.value as VisualPreferences['contrast'] })
                }
              >
                <option value="normal">Normal</option>
                <option value="high">High contrast</option>
                <option value="inverted">Inverted</option>
              </select>
            </label>
            <label className="a11y-select" htmlFor="a11y-theme">
              <span>Theme</span>
              <select
                id="a11y-theme"
                value={visual.theme}
                onChange={(event) =>
                  updateVisual({ theme: event.target.value as VisualPreferences['theme'] })
                }
              >
                <option value="system">Use device setting</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="a11y-color" htmlFor="a11y-accent-color">
              <span>Accent color</span>
              <input
                id="a11y-accent-color"
                type="color"
                value={visual.accentColor}
                onChange={(event) => updateVisual({ accentColor: event.target.value })}
              />
            </label>
          </section>

          <section aria-labelledby="a11y-visibility-heading">
            <h3 id="a11y-visibility-heading">Visibility and controls</h3>
            <RangeControl
              id="a11y-zoom"
              label="Page zoom"
              value={visual.zoom}
              min={1}
              max={1.5}
              step={0.1}
              unit="×"
              onChange={(zoom) => updateVisual({ zoom })}
            />
            <ToggleControl
              label="Text magnifier"
              description="Follow the pointer over text"
              pressed={visual.magnifierEnabled}
              onClick={() => updateVisual({ magnifierEnabled: !visual.magnifierEnabled })}
            />
            <ToggleControl
              label="Large cursor"
              description="Increase pointer visibility"
              pressed={visual.cursorSize === 'large'}
              onClick={() =>
                updateVisual({ cursorSize: visual.cursorSize === 'large' ? 'default' : 'large' })
              }
            />
            <ToggleControl
              label="Bigger buttons"
              description="Use 48px touch targets"
              pressed={visual.largeControls}
              onClick={() => updateVisual({ largeControls: !visual.largeControls })}
            />
          </section>

          <footer className="a11y-panel-footer">
            <p aria-live="polite">Preferences save automatically.</p>
            <div>
              <button type="button" onClick={loadPreferences}>
                Load saved
              </button>
              <button type="button" onClick={savePreferences}>
                Save now
              </button>
              <button type="button" className="a11y-reset" onClick={resetPreferences}>
                Reset
              </button>
            </div>
          </footer>
        </aside>
      )}
    </>
  );
}
