import { SETTINGS_KEY } from '@/state/settings-key';

/** Draait vóór de eerste weergave: zet rustige beweging aan als de leerling dat heeft gekozen. */
export const MOTION_SCRIPT = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)})||'null');if(s&&s.state&&s.state.motion==='calm')document.documentElement.dataset.motion='calm'}catch(e){}`;
