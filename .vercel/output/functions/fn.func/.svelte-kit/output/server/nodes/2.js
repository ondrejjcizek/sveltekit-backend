import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.WYnHAV5o.js","_app/immutable/chunks/5.fiZnZ7H9.js","_app/immutable/chunks/index.rYFs_6OB.js","_app/immutable/chunks/parse.RrI1B0B4.js","_app/immutable/chunks/singletons.0WwMJaGU.js"];
export const stylesheets = [];
export const fonts = [];
