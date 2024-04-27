

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.d3FHW21Y.js","_app/immutable/chunks/5.fiZnZ7H9.js","_app/immutable/chunks/index.rYFs_6OB.js","_app/immutable/chunks/singletons.0WwMJaGU.js"];
export const stylesheets = [];
export const fonts = [];
