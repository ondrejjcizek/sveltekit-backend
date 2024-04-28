import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.VycoRKo9.js","_app/immutable/chunks/disclose-version.Aca9DWnD.js","_app/immutable/chunks/runtime.VRHDuNB0.js","_app/immutable/chunks/render.5gPqI7IR.js","_app/immutable/chunks/forms.PQSTPx4L.js","_app/immutable/chunks/parse.RrI1B0B4.js","_app/immutable/chunks/singletons.eUn48goy.js","_app/immutable/chunks/5.ZytH4xBu.js","_app/immutable/chunks/lifecycle.3fiFNqfE.js","_app/immutable/chunks/props.XRNuqaq5.js"];
export const stylesheets = [];
export const fonts = [];
