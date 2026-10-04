'use client';

import { Toast } from '@base-ui/react/toast';
import { Tooltip } from '@base-ui/react/tooltip';
import { MotionConfig } from 'motion/react';
import { useEffect, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { toastManager, notify } from '@/lib/toast';
import { transition } from '@/lib/motion';
import { useHydrated, useStoreHydration } from '@/state/hydration';
import { useSettings } from '@/state/settings';
import { storageNotices } from '@/state/storage';

export function Providers({ children }: { children: ReactNode }) {
  useStoreHydration();
  const hydrated = useHydrated();
  const motion = useSettings((state) => state.motion);

  useEffect(() => {
    if (!hydrated) return;
    if (motion === 'calm') document.documentElement.dataset.motion = 'calm';
    else delete document.documentElement.dataset.motion;
  }, [hydrated, motion]);

  useEffect(
    () =>
      storageNotices.subscribe(() =>
        notify(
          'Opgeslagen gegevens hersteld',
          'Een deel van je opgeslagen gegevens was beschadigd en is teruggezet. Er staat een reservekopie in je browser.',
        ),
      ),
    [],
  );

  return (
    <MotionConfig reducedMotion={motion === 'calm' ? 'always' : 'user'} transition={transition.base}>
      <Toast.Provider toastManager={toastManager} limit={3}>
        <Tooltip.Provider delay={450}>
          {children}
          <Toaster />
        </Tooltip.Provider>
      </Toast.Provider>
    </MotionConfig>
  );
}
