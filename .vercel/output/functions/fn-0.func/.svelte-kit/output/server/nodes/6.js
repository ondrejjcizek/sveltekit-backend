import * as server from '../entries/pages/register/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/register/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/register/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.hBYBWI77.js","_app/immutable/chunks/disclose-version.Aca9DWnD.js","_app/immutable/chunks/runtime.VRHDuNB0.js","_app/immutable/chunks/lifecycle.3fiFNqfE.js"];
export const stylesheets = [];
export const fonts = [];
