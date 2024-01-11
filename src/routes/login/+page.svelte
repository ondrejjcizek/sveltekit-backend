<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const account = document.querySelector('.Account');
		account?.classList.add('hidden');
	});
</script>

<div class="flex flex-col items-center gap-8 w-full">
	<form class="shadow-2xl w-full max-w-96 p-8 rounded-md" method="POST">
		<h2 class="text-center text-2xl font-semibold">Login</h2>
		<div class="divider"></div>
		<label for="email" class="form-control w-full pb-2">
			<div class="label">
				<span class="label-text">Email</span>
			</div>
			<input type="email" id="email" name="email" class="input input-bordered w-full" />
		</label>
		<label for="password" class="form-control w-full">
			<div class="label">
				<span class="label-text">Password</span>
			</div>
			<input type="password" id="password" name="password" class="input input-bordered w-full" />
		</label>
		<div class="w-full flex justify-center pt-8">
			<button type="submit" class="btn btn-active btn-neutral">Submit</button>
		</div>
	</form>
	<a class="link link-hover" href="/register">Don't Have an Account?</a>
</div>
