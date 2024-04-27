import { z } from 'zod';

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const formSchema = z.object({
	username: z
		.string()
		.min(1, { message: 'Toto pole nesmí byt prázdné' })
		.max(20, { message: 'Nikdo nemá tak dlouhé jméno' }),
	password: z.string().regex(passwordValidation, {
		message: 'Heslo nesplňuje požadavky'
	})
});

export type FormSchema = typeof formSchema;
