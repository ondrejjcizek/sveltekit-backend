import * as server from '../entries/pages/account/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/account/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.BkA7QB5I.js","_app/immutable/chunks/5.fiZnZ7H9.js","_app/immutable/chunks/index.rYFs_6OB.js"];
export const stylesheets = [];
export const fonts = [];
