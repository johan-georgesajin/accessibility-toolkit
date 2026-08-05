import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  type AccessibilityPlugin,
  type AccessibilityPreferences,
  type AccessibilityStorage,
  type PreferencePatch,
} from './types';

export const ACCESSIBILITY_STORAGE_KEY = 'a11y-toolkit:prefs';

export interface AccessibilityContextValue {
  preferences: AccessibilityPreferences;
  setPreferences: (preferences: AccessibilityPreferences) => void;
  updatePreferences: (patch: PreferencePatch) => void;
  savePreferences: () => void;
  loadPreferences: () => void;
  resetPreferences: () => void;
  plugins: readonly AccessibilityPlugin[];
  registerPlugin: (plugin: AccessibilityPlugin) => () => void;
}

export interface AccessibilityProviderProps extends PropsWithChildren {
  defaultPreferences?: Partial<AccessibilityPreferences>;
  storage?: AccessibilityStorage | null;
  storageKey?: string;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function browserStorage(): AccessibilityStorage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function mergePreferences(
  defaults: AccessibilityPreferences,
  patch?: Partial<AccessibilityPreferences>,
): AccessibilityPreferences {
  return {
    ...defaults,
    ...patch,
    version: 1,
    visual: { ...defaults.visual, ...patch?.visual },
    reading: { ...defaults.reading, ...patch?.reading },
    custom: { ...defaults.custom, ...patch?.custom },
  };
}

export function AccessibilityProvider({
  children,
  defaultPreferences,
  storage = browserStorage(),
  storageKey = ACCESSIBILITY_STORAGE_KEY,
}: AccessibilityProviderProps) {
  const defaults = useMemo(
    () => mergePreferences(DEFAULT_ACCESSIBILITY_PREFERENCES, defaultPreferences),
    [defaultPreferences],
  );
  const [preferences, setPreferencesState] = useState<AccessibilityPreferences>(() => {
    if (!storage) return defaults;

    try {
      const saved = storage.getItem(storageKey);
      return saved
        ? mergePreferences(defaults, JSON.parse(saved) as AccessibilityPreferences)
        : defaults;
    } catch {
      return defaults;
    }
  });
  const [plugins, setPlugins] = useState<readonly AccessibilityPlugin[]>([]);

  useEffect(() => {
    if (!storage) return;
    storage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences, storage, storageKey]);

  const setPreferences = useCallback((next: AccessibilityPreferences) => {
    setPreferencesState((current) => mergePreferences(current, next));
  }, []);

  const updatePreferences = useCallback((patch: PreferencePatch) => {
    setPreferencesState((current) => mergePreferences(current, patch));
  }, []);

  const savePreferences = useCallback(() => {
    if (!storage) return;
    storage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences, storage, storageKey]);

  const loadPreferences = useCallback(() => {
    if (!storage) return;

    try {
      const saved = storage.getItem(storageKey);
      if (saved) setPreferencesState(mergePreferences(defaults, JSON.parse(saved)));
    } catch {
      // Invalid or unavailable storage must never prevent the host application from rendering.
    }
  }, [defaults, storage, storageKey]);

  const resetPreferences = useCallback(() => {
    setPreferencesState(defaults);
  }, [defaults]);

  const registerPlugin = useCallback((plugin: AccessibilityPlugin) => {
    setPlugins((current) => {
      if (current.some((registered) => registered.id === plugin.id)) {
        throw new Error(`Duplicate accessibility plugin: ${plugin.id}`);
      }
      return [...current, plugin];
    });
    return () =>
      setPlugins((current) => current.filter((registered) => registered.id !== plugin.id));
  }, []);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      preferences,
      setPreferences,
      updatePreferences,
      savePreferences,
      loadPreferences,
      resetPreferences,
      plugins,
      registerPlugin,
    }),
    [
      loadPreferences,
      plugins,
      preferences,
      registerPlugin,
      resetPreferences,
      savePreferences,
      setPreferences,
      updatePreferences,
    ],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used inside AccessibilityProvider.');
  return context;
}
