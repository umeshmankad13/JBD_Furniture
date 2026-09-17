import { useEffect, useRef } from 'react';

export function useScrollAnimation(className = 'animate-fade-in-up', threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.classList.add(className);
        }
      });
    };

    const observer = new window.IntersectionObserver(handleIntersect, { threshold });
    observer.observe(node);

    return () => observer.disconnect();
  }, [className, threshold]);

  return ref;
} 