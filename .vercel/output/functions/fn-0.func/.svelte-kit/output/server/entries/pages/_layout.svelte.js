import { c as slot, b as pop, p as push } from "../../chunks/index3.js";
function _layout($$payload, $$props) {
  push();
  $$payload.out += `<header class="absolute left-0 right-0 top-0 z-10 flex h-20 items-center justify-center"><div class="font-bold">WEIRD PROJECT</div></header> <main class="grid min-h-screen place-items-center"><!--[-->`;
  slot($$payload, $$props.children, {}, null);
  $$payload.out += `<!--]--></main>`;
  pop();
}
export {
  _layout as default
};
