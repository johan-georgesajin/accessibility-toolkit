import { useEffect, useState } from 'react';

interface LensState {
  x: number;
  y: number;
  text: string;
}

/** A pointer-following lens for readable text. Rendered only while magnification is enabled. */
export function AccessibilityMagnifier() {
  const [lens, setLens] = useState<LensState | null>(null);

  useEffect(() => {
    const updateLens = (event: PointerEvent) => {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const text = target?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) ?? '';
      setLens({ x: event.clientX, y: event.clientY, text });
    };

    const hideLens = () => setLens(null);
    window.addEventListener('pointermove', updateLens, { passive: true });
    window.addEventListener('blur', hideLens);
    return () => {
      window.removeEventListener('pointermove', updateLens);
      window.removeEventListener('blur', hideLens);
    };
  }, []);

  if (!lens) return null;

  return (
    <div
      aria-hidden="true"
      className="a11y-magnifier"
      style={{ left: lens.x + 18, top: lens.y + 18 }}
    >
      <span>{lens.text || 'Move over text to magnify it'}</span>
    </div>
  );
}
