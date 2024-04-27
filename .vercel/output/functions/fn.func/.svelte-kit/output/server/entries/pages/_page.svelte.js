import { c as create_ssr_component, e as escape, v as validate_component, d as each, m as missing_component, f as add_classes, h as add_attribute } from "../../chunks/ssr.js";
const Leave = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"></path></svg>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-1ux7tjd_START -->${$$result.title = `<title>Todos</title>`, ""}<meta name="description" content="Create, delete and complete your todos"><!-- HEAD_svelte-1ux7tjd_END -->`, ""} <div class="absolute right-[24px] top-[24px] flex gap-3 sm:right-[40px] sm:top-[40px]"><span>${escape(`${data.userPayload.firstName} ${data.userPayload.lastName}`)}</span> <a href="/logout" class="transition-colors hover:text-white">${validate_component(Leave || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</a></div> <div class="flex h-full w-full flex-col items-center"><form class="grid w-full items-end gap-6 py-20 sm:flex" method="POST" action="?/create" data-svelte-h="svelte-1aelawr"><label for="title" class="form-control w-full"><div class="label"><span class="label-text">Title</span></div> <input type="text" id="title" name="title" class="input input-bordered w-full"></label> <label for="description" class="form-control w-full"><div class="label"><span class="label-text">Description</span></div> <input type="text" id="description" name="description" class="input input-bordered w-full"></label> <button class="btn btn-neutral">Add Todo</button></form> <ul class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">${each(data.todos, (todo) => {
    return `<li class="${"card shadow-xl transition-colors " + escape(todo.completed ? "bg-green-500" : "bg-base-300", true)}"><div class="card-body"><h2 class="${"card-title " + escape(todo.completed && "line-through", true)}">${escape(todo.title)}</h2> <p${add_classes((todo.completed ? "line-through" : "").trim())}>${escape(todo.description)}</p> <div class="card-actions justify-end pt-4"><form method="POST" action="?/complete"><input class="hidden" name="id"${add_attribute("value", todo.id, 0)}> <button class="${[
      "btn",
      (!todo.completed ? "btn-success" : "") + " " + (todo.completed ? "btn-disabled" : "")
    ].join(" ").trim()}" data-svelte-h="svelte-9dytgh">Complete</button></form> <form method="POST" action="?/delete"><input class="hidden" name="id"${add_attribute("value", todo.id, 0)}> <button class="btn btn-error" data-svelte-h="svelte-14xe8rt">Delete</button></form> </div></div> </li>`;
  })}</ul></div>`;
});
export {
  Page as default
};
