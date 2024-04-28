import { z } from "zod";
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);
const formSchema = z.object({
  username: z.string().min(1, { message: "Toto pole nesmí byt prázdné" }).max(20, { message: "Nikdo nemá tak dlouhé jméno" }),
  password: z.string().regex(passwordValidation, {
    message: "Heslo nesplňuje požadavky"
  })
});
export {
  formSchema as f
};
