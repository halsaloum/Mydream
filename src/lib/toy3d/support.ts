/**
 * Of de 3D er mag komen. Los van three.js, zodat een apparaat zonder (vlotte) WebGL die grote
 * bibliotheek niet eens hoeft te downloaden.
 */

/** Zo heet WebGL zonder grafische kaart: de processor tekent alles zelf, en dat is te traag. */
const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;
let usable: boolean | undefined;

/**
 * Kan dit apparaat de 3D vlot tekenen? Zonder WebGL, of met WebGL zonder grafische kaart (dan
 * zou elk beeldje de hele pagina even stilzetten), staat de 2D-versie er. Met
 * `localStorage['pennig:3d'] = 'altijd'` komt de 3D er toch, bv. voor tests en schermafbeeldingen.
 */
export function webglAvailable(): boolean {
  if (usable !== undefined) return usable;
  let always = false;
  try {
    always = window.localStorage.getItem('pennig:3d') === 'altijd';
  } catch {
    // Geen opslag: dan beslist het apparaat.
  }
  try {
    const canvas = document.createElement('canvas');
    const attributes: WebGLContextAttributes = { failIfMajorPerformanceCaveat: !always };
    const gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext('webgl2', attributes) ?? canvas.getContext('webgl', attributes);
    if (!gl) return (usable = false);
    let name = String(gl.getParameter(gl.RENDERER));
    if (!SOFTWARE.test(name)) {
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      if (info) name = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return (usable = always || !SOFTWARE.test(name));
  } catch {
    return (usable = false);
  }
}
