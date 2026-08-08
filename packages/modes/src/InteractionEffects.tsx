import { useEffect } from 'react';
import { useAccessibility } from '@a11y-toolkit/core';

export interface InteractionEffectsProps {
  /** Main reading area. It stays prominent while distraction-free mode is active. */
  contentSelector?: string;
}

/** Applies Track 3's page-level interaction effects without owning any feature state. */
export function InteractionEffects({ contentSelector = 'main' }: InteractionEffectsProps) {
  const { preferences } = useAccessibility();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const content = document.querySelector<HTMLElement>(contentSelector);
    const enabled = Boolean(preferences.interaction.distractionFree);
    root.dataset.a11yDistractionFree = String(enabled);
    content?.toggleAttribute('data-a11y-focus-content', enabled);
    const siblings = content ? Array.from(content.parentElement?.children ?? []) : [];
    siblings.forEach((element) => {
      if (element === content || element.hasAttribute('data-a11y-toolkit-ui')) return;
      element.toggleAttribute('data-a11y-dimmed', enabled);
    });
    return () => {
      delete root.dataset.a11yDistractionFree;
      content?.removeAttribute('data-a11y-focus-content');
      siblings.forEach((element) => element.removeAttribute('data-a11y-dimmed'));
    };
  }, [contentSelector, preferences.interaction.distractionFree]);

  useEffect(() => {
    if (!preferences.reading.autoScroll || typeof window === 'undefined') return;
    const interval = window.setInterval(() => {
      const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (remaining > 0) window.scrollBy({ top: Math.min(18, remaining), behavior: 'smooth' });
    }, 900);
    return () => window.clearInterval(interval);
  }, [preferences.reading.autoScroll]);

  return null;
}
