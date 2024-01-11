<div class="flex flex-col items-center gap-8 w-full">
	<form class="shadow-2xl w-full max-w-96 p-8 rounded-md" method="POST">
		<h2 class="text-center text-2xl font-semibold">Registration</h2>
		<div class="divider"></div>
		<label for="first_name" class="form-control w-full pb-2">
			<div class="label">
				<span class="label-text">First Name</span>
			</div>
			<input type="text" id="first_name" name="first_name" class="input input-bordered w-full" />
		</label>
		<label for="last_name" class="form-control w-full pb-2">
			<div class="label">
				<span class="label-text">Last Name</span>
			</div>
			<input type="text" id="last_name" name="last_name" class="input input-bordered w-full" />
		</label>
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
	<a class="link link-hover" href="/login">You Have an Account?</a>
</div>
