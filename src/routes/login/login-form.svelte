<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex flex-col gap-10">
	<form method="POST" class="flexflex-col min-w-80 gap-2" use:enhance>
		<Card.Root class="w-full max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">Přihlášení</Card.Title>
				<!-- <Card.Description>Enter your email below to login to your account.</Card.Description> -->
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>E-mail</Form.Label>
						<Input type="text" {...attrs} bind:value={$formData.username} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Heslo</Form.Label>
						<Input type="password" {...attrs} bind:value={$formData.password} />
						<!-- <Form.Description
							>Heslo musí obsahovat 8 znaků, velké písmeno, číslo a speciální symbol.</Form.Description
						> -->
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full">Přihlásit</Form.Button>
			</Card.Footer>
		</Card.Root>
	</form>
	<SuperDebug data={$formData} />
</div>
