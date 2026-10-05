import { Toast } from '@base-ui/react/toast';

/** Eén toastbeheerder voor de hele app, ook bruikbaar buiten React (bijv. bij hersteld opslaan). */
export const toastManager = Toast.createToastManager();

/** `timeout: 0` laat de melding staan tot je hem wegklikt. */
export function notify(title: string, description?: string, action?: { label: string; onClick: () => void }, timeout?: number) {
  toastManager.add({
    title,
    description,
    timeout: timeout ?? (action ? 7000 : 4500),
    ...(action ? { actionProps: { children: action.label, onClick: action.onClick } } : {}),
  });
}
