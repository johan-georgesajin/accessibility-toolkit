import { useCallback, useEffect, useRef } from 'react';
import { useAccessibility } from '@a11y-toolkit/core';
import type { AccessibilityMode, AccessibilityPreferences } from '@a11y-toolkit/core';
import { composeMode } from './presets';

export function useAccessibilityModes() {
  const { preferences, updatePreferences } = useAccessibility();
  const originalPreferences = useRef<AccessibilityPreferences | null>(null);

  // A manual reset clears the active mode, so the next activation starts fresh.
  useEffect(() => {
    if (preferences.activeMode === null) originalPreferences.current = null;
  }, [preferences.activeMode]);

  const activateMode = useCallback(
    (mode: AccessibilityMode) => {
      const baseline = originalPreferences.current ?? preferences;
      originalPreferences.current = baseline;
      updatePreferences(composeMode(mode, baseline));
    },
    [preferences, updatePreferences],
  );
  const deactivateMode = useCallback(
    () => {
      const baseline = originalPreferences.current;
      originalPreferences.current = null;
      if (!baseline) {
        updatePreferences({ activeMode: null });
        return;
      }
      updatePreferences({
        visual: baseline.visual,
        reading: baseline.reading,
        interaction: baseline.interaction,
        activeMode: null,
        custom: baseline.custom,
      });
    },
    [updatePreferences],
  );

  return { activeMode: preferences.activeMode, activateMode, deactivateMode };
}
