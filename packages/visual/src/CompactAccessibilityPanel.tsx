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

const fonts: ReadonlyArray<{ value: ReadableFont; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'opendyslexic', label: 'OpenDyslexic' },
  { value: 'lexend', label: 'Lexend' },
  { value: 'atkinson-hyperlegible', label: 'Atkinson' },
];

function Card({
  icon,
  title,
  children,
  reset = false,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  reset?: boolean;
}) {
  return (
    <section className={reset ? 'a11y-compact-card a11y-compact-reset' : 'a11y-compact-card'}>
      <span aria-hidden="true" className="a11y-compact-icon">
        {icon}
      </span>
      <strong>{title}</strong>
      {children}
    </section>
  );
}

export function AccessibilityPanel({
  rootElement,
  label = 'Accessibility controls',
}: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [status, setStatus] = useState('Preferences save automatically.');
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    savedProfiles,
    saveProfile,
    loadProfile,
    deleteProfile,
    registerPlugin,
  } = useAccessibility();
  const visual = preferences.visual;
  useEffect(
    () => registerPlugin({ id: 'visual.panel', title: 'Visual controls', track: 'visual' }),
    [registerPlugin],
  );
  const setVisual = (patch: Partial<VisualPreferences>) =>
    updatePreferences({ visual: { ...visual, ...patch } });
  const change = (key: keyof VisualPreferences, amount: number, min: number, max: number) =>
    setVisual({
      [key]: Math.min(max, Math.max(min, Number(visual[key]) + amount)),
    } as Partial<VisualPreferences>);

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
        ◉ Accessibility
      </button>
      {isOpen && (
        <aside id="a11y-accessibility-panel" className="a11y-compact-panel" aria-label={label}>
          <header>
            <span className="a11y-compact-logo" aria-hidden="true">
              ✦
            </span>
            <h2>
              Access<span>One</span>
            </h2>
            <button
              type="button"
              aria-label="Close accessibility controls"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>
          <div className="a11y-compact-grid">
            <Card icon="☼" title="Contrast">
              <select
                aria-label="Contrast"
                value={visual.contrast}
                onChange={(e) =>
                  setVisual({ contrast: e.target.value as VisualPreferences['contrast'] })
                }
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="inverted">Invert</option>
              </select>
            </Card>
            <Card icon="Aᵃ" title="Text Size">
              <div className="a11y-stepper">
                <button
                  onClick={() => change('fontSize', -1, 14, 28)}
                  aria-label="Decrease text size"
                >
                  −
                </button>
                <output>{visual.fontSize}px</output>
                <button
                  onClick={() => change('fontSize', 1, 14, 28)}
                  aria-label="Increase text size"
                >
                  +
                </button>
              </div>
            </Card>
            <Card icon="≡" title="Text Spacing">
              <input
                aria-label="Letter spacing"
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={visual.letterSpacing}
                onChange={(e) => setVisual({ letterSpacing: Number(e.target.value) })}
              />
              <small>{visual.letterSpacing}px letter</small>
            </Card>
            <Card icon="☰" title="Line Height">
              <input
                aria-label="Line height"
                type="range"
                min="1.2"
                max="2.4"
                step="0.1"
                value={visual.lineHeight}
                onChange={(e) => setVisual({ lineHeight: Number(e.target.value) })}
              />
              <small>{visual.lineHeight}</small>
            </Card>
            <Card icon="B" title="Font Family">
              <select
                aria-label="Font family"
                value={visual.fontFamily}
                onChange={(e) => setVisual({ fontFamily: e.target.value as ReadableFont })}
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </Card>
            <Card icon="◐" title="Screen Mode">
              <select
                aria-label="Screen mode"
                value={visual.theme}
                onChange={(e) => setVisual({ theme: e.target.value as VisualPreferences['theme'] })}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Card>
            <Card icon="⌕" title="Zoom">
              <input
                aria-label="Page zoom"
                type="range"
                min="1"
                max="1.5"
                step="0.1"
                value={visual.zoom}
                onChange={(e) => setVisual({ zoom: Number(e.target.value) })}
              />
              <small>{visual.zoom}×</small>
            </Card>
            <Card icon="▣" title="Magnifier">
              <button
                className="a11y-compact-toggle"
                aria-pressed={visual.magnifierEnabled}
                onClick={() => setVisual({ magnifierEnabled: !visual.magnifierEnabled })}
              >
                {visual.magnifierEnabled ? 'On' : 'Off'}
              </button>
            </Card>
            <Card icon="↖" title="Cursor">
              <button
                className="a11y-compact-toggle"
                aria-pressed={visual.cursorSize === 'large'}
                onClick={() =>
                  setVisual({ cursorSize: visual.cursorSize === 'large' ? 'default' : 'large' })
                }
              >
                {visual.cursorSize === 'large' ? 'Large' : 'Default'}
              </button>
            </Card>
            <Card icon="▤" title="Bigger Buttons">
              <button
                className="a11y-compact-toggle"
                aria-pressed={visual.largeControls}
                onClick={() => setVisual({ largeControls: !visual.largeControls })}
              >
                {visual.largeControls ? 'On' : 'Off'}
              </button>
            </Card>
            <Card icon="●" title="Theme Color">
              <input
                className="a11y-compact-color"
                aria-label="Accent color"
                type="color"
                value={visual.accentColor}
                onChange={(e) => setVisual({ accentColor: e.target.value })}
              />
            </Card>
            <Card icon="↻" title="Reset All" reset>
              <button
                className="a11y-compact-reset-button"
                onClick={() => {
                  resetPreferences();
                  setStatus('Preferences reset.');
                }}
              >
                Reset
              </button>
            </Card>
          </div>
          <footer className="a11y-profiles">
            <p aria-live="polite">{status}</p>
            <div>
              <input
                aria-label="New profile name"
                value={profileName}
                placeholder="Profile name"
                onChange={(e) => setProfileName(e.target.value)}
              />
              <button
                onClick={() => {
                  if (profileName.trim()) {
                    saveProfile(profileName);
                    setSelectedProfile(profileName.trim());
                    setProfileName('');
                    setStatus('Profile saved.');
                  }
                }}
              >
                Save profile
              </button>
            </div>
            <div>
              <select
                aria-label="Saved profiles"
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
              >
                <option value="">Saved profiles</option>
                {savedProfiles.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedProfile}
                onClick={() => {
                  loadProfile(selectedProfile);
                  setStatus(`Loaded ${selectedProfile}.`);
                }}
              >
                Load
              </button>
              <button
                disabled={!selectedProfile}
                onClick={() => {
                  deleteProfile(selectedProfile);
                  setSelectedProfile('');
                  setStatus('Profile deleted.');
                }}
              >
                Delete
              </button>
            </div>
          </footer>
        </aside>
      )}
    </>
  );
}
