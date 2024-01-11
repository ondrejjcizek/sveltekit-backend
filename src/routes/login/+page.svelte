<svelte:head>
	<title>Todos - Login</title>
	<meta name="description" content="Create, delete and complete your todos" />
</svelte:head>

<div class="-mt-16 flex h-screen w-full flex-col items-center justify-center gap-8">
	<form class="w-full max-w-96 rounded-md p-8 shadow-2xl" method="POST">
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
		<div class="flex w-full justify-center pt-8">
			<button type="submit" class="btn btn-neutral btn-active">Submit</button>
		</div>
	</form>
	<a class="link-hover link" href="/register">Don't Have an Account?</a>
</div>
