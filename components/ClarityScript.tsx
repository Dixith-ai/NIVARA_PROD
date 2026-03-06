'use client';

import { useEffect } from 'react';

export default function ClarityScript() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        (function (c: Window & typeof globalThis, l: Document, a: string, r: string, i: string) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (c as any)[a] = (c as any)[a] || function (...args: unknown[]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ((c as any)[a].q = (c as any)[a].q || []).push(args);
            };
            const t = l.createElement(r) as HTMLScriptElement;
            t.async = true;
            t.src = 'https://www.clarity.ms/tag/' + i;
            const y = l.getElementsByTagName(r)[0];
            y.parentNode?.insertBefore(t, y);
        })(window, document, 'clarity', 'script', 'vpkyg52pt3');
    }, []);

    return null;
}
