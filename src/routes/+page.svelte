<script lang="ts">
	import type { PageData } from './$types';
	import Leave from '$lib/icons/Leave.svelte';
	import { enhance } from '$app/forms';
	import { fly, slide } from 'svelte/transition';

	export let data: PageData;
</script>

<svelte:head>
	<title>Todos</title>
	<meta name="description" content="Create, delete and complete your todos" />
</svelte:head>

<div class="absolute right-[24px] top-[24px] flex gap-3 sm:right-[40px] sm:top-[40px]">
	<span>{`${data.userPayload.firstName} ${data.userPayload.lastName}`}</span>
	<a href="/logout" class="transition-colors hover:text-white">
		<svelte:component this={Leave} />
	</a>
</div>

<div class="flex h-full w-full flex-col items-center">
	<form
		class="grid w-full items-end gap-6 py-20 sm:flex"
		method="POST"
		action="?/create"
		use:enhance
	>
		<label for="title" class="form-control w-full">
			<div class="label">
				<span class="label-text">Title</span>
			</div>
			<input type="text" id="title" name="title" class="input input-bordered w-full" />
		</label>
		<label for="description" class="form-control w-full">
			<div class="label">
				<span class="label-text">Description</span>
			</div>
			<input type="text" id="description" name="description" class="input input-bordered w-full" />
		</label>
		<button class="btn btn-neutral">Add Todo</button>
	</form>
	<ul class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
		{#each data.todos as todo (todo.id)}
			<li
				class="card shadow-xl transition-colors {todo.completed ? 'bg-green-500' : 'bg-base-300'}"
				in:fly={{ y: 20 }}
				out:slide
			>
				<div class="card-body">
					<h2 class="card-title {todo.completed && 'line-through'}">{todo.title}</h2>
					<p class:line-through={todo.completed}>{todo.description}</p>
					<div class="card-actions justify-end pt-4">
						<form
							method="POST"
							action="?/complete"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.status === 200) {
										// update the todo to be completed
										const todoIdx = data.todos.findIndex((t) => t.id === todo.id);
										data.todos[todoIdx].completed = true;
									}
								};
							}}
						>
							<input class="hidden" name="id" value={todo.id} />
							<button
								class="btn"
								class:btn-success={!todo.completed}
								class:btn-disabled={todo.completed}>Complete</button
							>
						</form>
						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.status === 200) {
										data.todos = data.todos.filter((t) => t.id !== todo.id);
									}
								};
							}}
						>
							<input class="hidden" name="id" value={todo.id} />
							<button class="btn btn-error">Delete</button>
						</form>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
