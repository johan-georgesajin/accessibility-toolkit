import { useCallback, useEffect } from 'react';
import { useAccessibility } from '@a11y-toolkit/core';
import type { AccessibilityMode } from '@a11y-toolkit/core';
import { composeMode } from './presets';

export function useAccessibilityModes() {
  const { preferences, updatePreferences, registerPlugin } = useAccessibility();

  useEffect(
    () => registerPlugin({ id: 'modes.composer', title: 'Accessibility modes', track: 'modes' }),
    [registerPlugin],
  );

  const activateMode = useCallback(
    (mode: AccessibilityMode) => updatePreferences(composeMode(mode, preferences)),
    [preferences, updatePreferences],
  );
  const deactivateMode = useCallback(
    () => updatePreferences({ activeMode: null }),
    [updatePreferences],
  );

  return { activeMode: preferences.activeMode, activateMode, deactivateMode };
}
