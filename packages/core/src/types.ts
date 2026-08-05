export type AccessibilityMode = 'dyslexia' | 'adhd' | 'lowVision';

export type ContrastMode = 'normal' | 'high' | 'inverted';
export type ThemeMode = 'system' | 'light' | 'dark';
export type ReadableFont = 'system' | 'opendyslexic' | 'lexend' | 'atkinson-hyperlegible';

export interface VisualPreferences {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  contrast: ContrastMode;
  theme: ThemeMode;
  fontFamily: ReadableFont;
  accentColor: string;
  zoom: number;
  magnifierEnabled: boolean;
  cursorSize: 'default' | 'large';
  largeControls: boolean;
}

/** Reserved for Track 2. Fields will remain optional until Track 2 defines defaults. */
export interface ReadingPreferences {
  ttsEnabled?: boolean;
  readingLevel?: 'default' | 'simplified';
}

export interface AccessibilityPreferences {
  version: 1;
  visual: VisualPreferences;
  reading: ReadingPreferences;
  activeMode: AccessibilityMode | null;
  custom: Record<string, unknown>;
}

export const DEFAULT_VISUAL_PREFERENCES: VisualPreferences = {
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
  contrast: 'normal',
  theme: 'system',
  fontFamily: 'system',
  accentColor: '#2563eb',
  zoom: 1,
  magnifierEnabled: false,
  cursorSize: 'default',
  largeControls: false,
};

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  version: 1,
  visual: DEFAULT_VISUAL_PREFERENCES,
  reading: {},
  activeMode: null,
  custom: {},
};

export interface AccessibilityPlugin {
  id: string;
  title: string;
  description?: string;
  track: 'visual' | 'reading' | 'modes' | 'devtools' | 'custom';
}

export interface AccessibilityStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

export type PreferencePatch = Partial<Omit<AccessibilityPreferences, 'version'>>;
