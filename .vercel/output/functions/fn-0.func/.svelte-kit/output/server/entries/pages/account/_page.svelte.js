import { h as head, e as escape, j as bind_props, b as pop, p as push } from "../../../chunks/index3.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  head($$payload, ($$payload2) => {
    $$payload2.title = "<title>";
    $$payload2.title += `Todos - Account</title>`;
    $$payload2.out += `<meta name="description" content="Create, delete and complete your todos">`;
  });
  $$payload.out += `<main><h1>Welcome ${escape(data.firstName)}! This is your JWT payload!</h1> <pre>${escape(JSON.stringify(data, null, 2))}</pre></main>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
