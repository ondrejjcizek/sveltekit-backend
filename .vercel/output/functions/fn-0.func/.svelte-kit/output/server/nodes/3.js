import * as server from '../entries/pages/account/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.ELm4eXrS.js","_app/immutable/chunks/disclose-version.Aca9DWnD.js","_app/immutable/chunks/runtime.VRHDuNB0.js","_app/immutable/chunks/render.5gPqI7IR.js","_app/immutable/chunks/lifecycle.3fiFNqfE.js"];
export const stylesheets = [];
export const fonts = [];
