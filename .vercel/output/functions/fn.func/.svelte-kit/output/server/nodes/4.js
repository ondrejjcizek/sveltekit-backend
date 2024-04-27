import * as server from '../entries/pages/login/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/login/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/login/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.e53_1ir0.js","_app/immutable/chunks/5.fiZnZ7H9.js","_app/immutable/chunks/index.rYFs_6OB.js"];
export const stylesheets = [];
export const fonts = [];
