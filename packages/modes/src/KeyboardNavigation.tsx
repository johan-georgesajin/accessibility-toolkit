import { useEffect, useRef } from 'react';
import type { PropsWithChildren, RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** A visible-on-focus link that lets keyboard users bypass repeated navigation. */
export function SkipLink({ targetId, children = 'Skip to main content' }: { targetId: string } & PropsWithChildren) {
  return (
    <a data-a11y-toolkit-ui className="a11y-skip-link" href={`#${targetId}`}>
      {children}
    </a>
  );
}

/** Keeps Tab focus within an open modal or accessibility panel. */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => !element.hasAttribute('hidden'),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKeyDown);
    return () => container.removeEventListener('keydown', onKeyDown);
  }, [active, containerRef]);
}

/** Convenience ref for focusable panel containers. */
export function useFocusTrapRef(active: boolean) {
  const ref = useRef<HTMLElement>(null);
  useFocusTrap(ref, active);
  return ref;
}
