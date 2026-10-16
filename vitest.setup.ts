import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

const isDom = typeof window !== 'undefined';

if (isDom) {
  const { cleanup } = await import('@testing-library/react');
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  // jsdom mist deze browser-API's; Motion, Base UI en de effecten verwachten ze.
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }

  if (!('ResizeObserver' in window)) {
    class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.assign(window, { ResizeObserver: ResizeObserverStub });
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}
