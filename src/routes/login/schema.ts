import { z } from 'zod';

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const formSchema = z.object({
	email: z.string().email({ message: 'E-mail není ve správném formátu' }),
	password: z.string().regex(passwordValidation, {
		message: 'Heslo nesplňuje požadavky'
	})
});

export type FormSchema = typeof formSchema;
