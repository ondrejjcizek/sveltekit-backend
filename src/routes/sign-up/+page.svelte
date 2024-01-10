<form class="shadow-2xl w-[400px] p-8 rounded-md" method="POST">
	<h2 class="text-center text-2xl font-semibold border-b-2 pb-8 mb-8">Registration</h2>
	<label for="first_name" class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">First Name</span>
		</div>
		<input
			type="text"
			id="first_name"
			name="first_name"
			class="input input-bordered w-full max-w-xs"
		/>
	</label>
	<label for="last_name" class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Last Name</span>
		</div>
		<input
			type="text"
			id="last_name"
			name="last_name"
			class="input input-bordered w-full max-w-xs"
		/>
	</label>
	<label for="email" class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Email</span>
		</div>
		<input type="email" id="email" name="email" class="input input-bordered w-full max-w-xs" />
	</label>
	<label for="password" class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Password</span>
		</div>
		<input
			type="password"
			id="password"
			name="password"
			class="input input-bordered w-full max-w-xs"
		/>
	</label>
	<div class="w-full flex justify-center pt-8">
		<button type="submit" class="btn btn-active btn-neutral">Submit</button>
	</div>
</form>
