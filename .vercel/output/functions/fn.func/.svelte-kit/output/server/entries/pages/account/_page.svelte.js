import { c as create_ssr_component, e as escape } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-1ox2d3p_START -->${$$result.title = `<title>Todos - Account</title>`, ""}<meta name="description" content="Create, delete and complete your todos"><!-- HEAD_svelte-1ox2d3p_END -->`, ""} <main><h1>Welcome ${escape(data.firstName)}! This is your JWT payload!</h1> <pre>${escape(JSON.stringify(data, null, 2))}</pre></main>`;
});
export {
  Page as default
};
