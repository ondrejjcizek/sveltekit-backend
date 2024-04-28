import * as server from '../entries/pages/test/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/test/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.KiGomgDB.js","_app/immutable/chunks/disclose-version.Aca9DWnD.js","_app/immutable/chunks/runtime.VRHDuNB0.js","_app/immutable/chunks/lifecycle.3fiFNqfE.js","_app/immutable/chunks/forms.PQSTPx4L.js","_app/immutable/chunks/render.5gPqI7IR.js","_app/immutable/chunks/parse.RrI1B0B4.js","_app/immutable/chunks/singletons.eUn48goy.js","_app/immutable/chunks/props.XRNuqaq5.js","_app/immutable/chunks/stores.2M27pz_R.js","_app/immutable/chunks/zod.RqV41N18.js","_app/immutable/chunks/this.mzY0v9VV.js","_app/immutable/chunks/index-client.8J7vhpZm.js"];
export const stylesheets = ["_app/immutable/assets/zod.q7qWwF-i.css"];
export const fonts = [];
