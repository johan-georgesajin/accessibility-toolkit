import type { AccessibilityMode, AccessibilityPreferences } from '@a11y-toolkit/core';

export type ModePreferencePatch = Omit<AccessibilityPreferences, 'version'>;

/**
 * Produces a complete, predictable preference set for a named accessibility mode.
 * Feature behaviour remains in the owning Visual and Reading packages; this only
 * composes their shared preference flags.
 */
export function composeMode(
  mode: AccessibilityMode,
  current: AccessibilityPreferences,
): ModePreferencePatch {
  const base: ModePreferencePatch = {
    visual: { ...current.visual },
    reading: { ...current.reading },
    interaction: { ...current.interaction },
    activeMode: mode,
    custom: { ...current.custom },
  };

  switch (mode) {
    case 'dyslexia':
      return {
        ...base,
        visual: {
          ...base.visual,
          fontFamily: 'opendyslexic',
          letterSpacing: Math.max(base.visual.letterSpacing, 1),
          wordSpacing: Math.max(base.visual.wordSpacing, 2),
        },
        reading: {
          ...base.reading,
          syllableSplitting: true,
          bionicReading: true,
          coloredOverlay: true,
        },
      };
    case 'adhd':
      return {
        ...base,
        reading: { ...base.reading, autoScroll: true, showProgress: true, readingTimer: true },
        interaction: { ...base.interaction, distractionFree: true },
      };
    case 'lowVision':
      return {
        ...base,
        visual: {
          ...base.visual,
          contrast: 'high',
          fontSize: Math.max(base.visual.fontSize, 20),
          zoom: Math.max(base.visual.zoom, 1.25),
          magnifierEnabled: true,
          cursorSize: 'large',
          largeControls: true,
        },
      };
  }
}
