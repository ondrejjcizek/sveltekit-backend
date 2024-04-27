import { c as create_ssr_component } from "../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<header class="p-6 pb-0 sm:p-10" data-svelte-h="svelte-1pmwfcq"><div class="font-bold">TODOS</div></header> <main class="mx-auto flex w-full max-w-3xl items-center justify-center px-6 sm:px-10">${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  Layout as default
};
