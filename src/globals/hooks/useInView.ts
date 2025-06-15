import { useState, useRef, useCallback } from 'react';

export function useInView<T extends Element = HTMLDivElement>(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver>(null);

  const targetRef = useCallback((node: T | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => setIsInView(entry.isIntersecting),
        { threshold }
      );
      observerRef.current.observe(node);
    }
  }, [threshold]);

  return [targetRef, isInView] as const;
}
