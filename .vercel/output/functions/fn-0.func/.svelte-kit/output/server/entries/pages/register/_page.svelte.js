import { h as head, b as pop, p as push } from "../../../chunks/index3.js";
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = "<title>";
    $$payload2.title += `Todos - Register</title>`;
    $$payload2.out += `<meta name="description" content="Create, delete and complete your todos">`;
  });
  $$payload.out += `<div class="-mt-16 flex h-screen w-full flex-col items-center justify-center gap-8"><form class="w-full max-w-96 rounded-md p-8 shadow-2xl" method="POST"><h2 class="text-center text-2xl font-semibold">Registration</h2> <div class="divider"></div> <label for="first_name" class="form-control w-full pb-2"><div class="label"><span class="label-text">First Name</span></div> <input type="text" id="first_name" name="first_name" class="input input-bordered w-full"></label> <label for="last_name" class="form-control w-full pb-2"><div class="label"><span class="label-text">Last Name</span></div> <input type="text" id="last_name" name="last_name" class="input input-bordered w-full"></label> <label for="email" class="form-control w-full pb-2"><div class="label"><span class="label-text">Email</span></div> <input type="email" id="email" name="email" class="input input-bordered w-full"></label> <label for="password" class="form-control w-full"><div class="label"><span class="label-text">Password</span></div> <input type="password" id="password" name="password" class="input input-bordered w-full"></label> <div class="flex w-full justify-center pt-8"><button type="submit" class="btn btn-neutral btn-active">Submit</button></div></form> <a class="link-hover link" href="/login">You Have an Account?</a></div>`;
  pop();
}
export {
  _page as default
};
