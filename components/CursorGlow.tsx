'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const onMouseMove = (e: MouseEvent) => {
      position.current.targetX = e.clientX;
      position.current.targetY = e.clientY;
    };

    const onMouseEnter = () => {
      if (dot) dot.style.opacity = '1';
    };

    const onMouseLeave = () => {
      if (dot) dot.style.opacity = '0';
    };

    const animate = () => {
      const pos = position.current;
      pos.x += (pos.targetX - pos.x) * 0.12;
      pos.y += (pos.targetY - pos.y) * 0.12;
      if (dot) {
        dot.style.transform = `translate(${pos.x - 4}px, ${pos.y - 4}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    const interactables = document.querySelectorAll('a, button, .card, .nav-link');
    const onHoverEnter = () => dot.classList.add('cursor-hover');
    const onHoverLeave = () => dot.classList.remove('cursor-hover');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onHoverEnter);
      el.addEventListener('mouseleave', onHoverLeave);
    });

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <div ref={dotRef} className="cursor-glow" />;
}
