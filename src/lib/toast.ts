import { Toast } from '@base-ui/react/toast';

/** Eén toastbeheerder voor de hele app, ook bruikbaar buiten React (bijv. bij hersteld opslaan). */
export const toastManager = Toast.createToastManager();

export function notify(title: string, description?: string, action?: { label: string; onClick: () => void }) {
  toastManager.add({
    title,
    description,
    timeout: action ? 7000 : 4500,
    ...(action ? { actionProps: { children: action.label, onClick: action.onClick } } : {}),
  });
}
