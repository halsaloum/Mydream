'use client';

import { Toast } from '@base-ui/react/toast';
import { X } from 'lucide-react';

/** Meldingen onderaan het scherm (Base UI Toast); F6 springt naar de meldingen. */
export function Toaster() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-[80] mx-auto w-auto sm:right-6 sm:bottom-6 sm:left-auto sm:w-[24rem]">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="absolute right-0 bottom-0 left-0 z-[calc(1000-var(--toast-index))] origin-bottom rounded-tile border-2 border-line bg-surface shadow-float transition-[transform,opacity] duration-300 ease-[var(--ease-out-soft)] [transform:translateY(calc(var(--toast-index)*-0.75rem))_scale(calc(1-var(--toast-index)*0.05))] data-[ending-style]:opacity-0 data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(120%)] data-[ending-style]:[transform:translateY(120%)] data-[expanded]:[transform:translateY(var(--toast-offset-y))]"
    >
      <Toast.Content className="flex items-start gap-3 p-4 data-[behind]:opacity-0 data-[expanded]:opacity-100">
        <div className="min-w-0 flex-1">
          <Toast.Title className="font-display text-body font-bold text-ink" />
          <Toast.Description className="mt-0.5 text-small text-ink-muted" />
        </div>
        <Toast.Action className="min-h-11 shrink-0 rounded-control border-2 border-line bg-surface px-3 font-display text-small font-bold text-ink hover:border-line-strong" />
        <Toast.Close aria-label="Melding sluiten" className="-m-1 grid size-11 shrink-0 place-items-center rounded-control text-ink-muted hover:bg-ink/[0.06] hover:text-ink">
          <X aria-hidden className="size-4" strokeWidth={2.75} />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
