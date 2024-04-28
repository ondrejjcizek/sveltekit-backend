import { f as fail } from "../../../chunks/index2.js";
import { a as zod } from "../../../chunks/zod.js";
import { s as superValidate } from "../../../chunks/superValidate.js";
import { f as formSchema } from "../../../chunks/schema2.js";
const load = async () => {
  return {
    form: await superValidate(zod(formSchema))
  };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    } else {
      console.log(form);
    }
    return {
      form
    };
  }
};
export {
  actions,
  load
};
