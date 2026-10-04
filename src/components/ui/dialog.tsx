'use client';

import { AlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode, RefObject } from 'react';
import type { Accent } from '@/content/accent';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { Button } from './button';

const backdrop = 'fixed inset-0 z-50 bg-[rgb(23_27_34/0.45)]';
const viewport = 'fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6';
const popup =
  'relative flex max-h-[min(88dvh,46rem)] w-full flex-col overflow-hidden rounded-t-sheet border-2 border-line bg-surface shadow-float outline-none max-sm:border-b-0 sm:max-w-xl sm:rounded-sheet';

function usePopupMotion() {
  const calm = useCalmMotion();
  return {
    initial: { opacity: 0, y: calm ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: calm ? 0 : 20 },
    transition: calm ? { duration: 0.12 } : transition.slow,
  };
}

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: transition.base };

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean, details: Dialog.Root.ChangeEventDetails) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  handle?: Dialog.Handle<unknown>;
  triggerId?: string | null;
  finalFocus?: RefObject<HTMLElement | null>;
  /** Accentkleur binnen het venster (het venster staat buiten de pagina-context). */
  accent?: Accent;
  className?: string;
};

/**
 * Dialoogvenster op Base UI Dialog met Motion.
 * Base UI regelt focusvangst, Escape, buitenklik en de terugkeer van focus naar de opener;
 * Motion animeert in- en uitgaan (inclusief opacity, zodat Base UI het einde herkent).
 */
export function Sheet({ open, onOpenChange, title, description, children, footer, handle, triggerId, finalFocus, accent, className }: SheetProps) {
  const motionProps = usePopupMotion();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} handle={handle} triggerId={triggerId}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal keepMounted>
            <Dialog.Backdrop className={backdrop} render={<motion.div {...fade} />} />
            <Dialog.Viewport className={viewport}>
              <Dialog.Popup data-accent={accent} className={cn(popup, className)} finalFocus={finalFocus} render={<motion.div {...motionProps} />}>
                <div className="flex items-start gap-4 border-b-2 border-line px-6 pt-6 pb-4">
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="font-display text-title font-extrabold">{title}</Dialog.Title>
                    {description && <Dialog.Description className="mt-1 text-small text-ink-muted">{description}</Dialog.Description>}
                  </div>
                  <Dialog.Close
                    aria-label="Sluiten"
                    className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-control text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
                  >
                    <X aria-hidden className="size-5" strokeWidth={2.5} />
                  </Dialog.Close>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>
                {footer && <div className="border-t-2 border-line px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

type ConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
};

/** Bevestiging voor onomkeerbare acties, op Base UI AlertDialog. */
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm }: ConfirmProps) {
  const motionProps = usePopupMotion();
  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <AnimatePresence>
        {open && (
          <AlertDialog.Portal keepMounted>
            <AlertDialog.Backdrop className={backdrop} render={<motion.div {...fade} />} />
            <AlertDialog.Viewport className={viewport}>
              <AlertDialog.Popup className={cn(popup, 'sm:max-w-md')} render={<motion.div {...motionProps} />}>
                <div className="px-6 pt-6">
                  <AlertDialog.Title className="font-display text-title font-extrabold">{title}</AlertDialog.Title>
                  <AlertDialog.Description className="mt-2 text-body text-ink-soft">{description}</AlertDialog.Description>
                </div>
                <div className="flex flex-col-reverse gap-3 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
                  <AlertDialog.Close render={<Button variant="secondary" />}>Annuleren</AlertDialog.Close>
                  <Button
                    variant="danger"
                    onClick={() => {
                      onConfirm();
                      onOpenChange(false);
                    }}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </AlertDialog.Popup>
            </AlertDialog.Viewport>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}
