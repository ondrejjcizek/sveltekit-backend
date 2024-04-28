import { b as pop, p as push, f as ensure_array_like, h as head, e as escape, g as attr, i as stringify, j as bind_props } from "../../chunks/index3.js";
function Leave($$payload, $$props) {
  push();
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"></path></svg>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const each_array = ensure_array_like(data.todos);
  head($$payload, ($$payload2) => {
    $$payload2.title = "<title>";
    $$payload2.title += `Todos</title>`;
    $$payload2.out += `<meta name="description" content="Create, delete and complete your todos">`;
  });
  $$payload.out += `<div class="absolute right-[24px] top-[24px] flex gap-3 sm:right-[40px] sm:top-[40px]"><span>${escape(`${data.userPayload.firstName} ${data.userPayload.lastName}`)}</span> <a href="/logout" class="transition-colors hover:text-white"><!--[-->`;
  Leave?.($$payload);
  $$payload.out += `<!--]--></a></div> <div class="flex h-full w-full flex-col items-center"><form class="grid w-full items-end gap-6 py-20 sm:flex" method="POST" action="?/create"><label for="title" class="form-control w-full"><div class="label"><span class="label-text">Title</span></div> <input type="text" id="title" name="title" class="input input-bordered w-full"></label> <label for="description" class="form-control w-full"><div class="label"><span class="label-text">Description</span></div> <input type="text" id="description" name="description" class="input input-bordered w-full"></label> <button class="btn btn-neutral">Add Todo</button></form> <ul class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"><!--[-->`;
  for (let $$index = 0; $$index < each_array.length; $$index++) {
    const todo = each_array[$$index];
    $$payload.out += "<!--[-->";
    $$payload.out += `<li${attr("class", `card shadow-xl transition-colors ${stringify(todo.completed ? "bg-green-500" : "bg-base-300")}`, false)}><div class="card-body"><h2${attr("class", `card-title ${stringify(todo.completed && "line-through")}`, false)}>${escape(todo.title)}</h2> <p${attr("class", [todo.completed ? "line-through" : ""].filter(Boolean).join(" "), false)}>${escape(todo.description)}</p> <div class="card-actions justify-end pt-4"><form method="POST" action="?/complete"><input class="hidden" name="id"${attr("value", todo.id, false)}> <button${attr(
      "class",
      `btn ${stringify([
        !todo.completed ? "btn-success" : "",
        todo.completed ? "btn-disabled" : ""
      ].filter(Boolean).join(" "))}`,
      false
    )}>Complete</button></form> <form method="POST" action="?/delete"><input class="hidden" name="id"${attr("value", todo.id, false)}> <button class="btn btn-error">Delete</button></form></div></div></li>`;
    $$payload.out += "<!--]-->";
  }
  $$payload.out += "<!--]-->";
  $$payload.out += `</ul></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
