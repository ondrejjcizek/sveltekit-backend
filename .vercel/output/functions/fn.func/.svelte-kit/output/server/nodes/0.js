

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.KnPkS6rZ.js","_app/immutable/chunks/5.fiZnZ7H9.js","_app/immutable/chunks/index.rYFs_6OB.js"];
export const stylesheets = ["_app/immutable/assets/0.SOw2DfYs.css"];
export const fonts = [];
