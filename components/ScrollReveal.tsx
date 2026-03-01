'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
            const label = entry.target.querySelector('.section-label');
            if (label) {
              setTimeout(() => label.classList.add('shimmer-ready'), 200);
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    // Staggered reveals for grid children
    document.querySelectorAll('.grid').forEach((group) => {
      const reveals = group.querySelectorAll('.reveal');
      reveals.forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${i * 0.07}s`;
      });
    });

    return () => revealObserver.disconnect();
  }, [pathname]);

  return null;
}
