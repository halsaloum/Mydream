/**
 * Onderscheidt "binnen de app naar een pagina gegaan" van "pagina geladen of ververst".
 * De Providers markeren het opstarten na de eerste render. Een component die in die eerste
 * render meekomt (direct openen of verversen) ziet `false`; later geopende schermen `true`.
 */
let booted = false;

export function markBooted() {
  booted = true;
}

export function isBooted(): boolean {
  return booted;
}
