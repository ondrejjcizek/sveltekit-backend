<script lang="ts">
	import '../app.css';
	import Leave from '$lib/icons/Leave.svelte';

	export let data;
</script>

<header class="flex place-content-between p-6">
	<div class="font-bold">TODOS</div>
	<div class="Account gap-3 hidden">
		<span>{`${data.firstName} ${data.lastName}`}</span>
		<a href="/logout" class="hover:text-white transition-colors">
			<svelte:component this={Leave} />
		</a>
	</div>
</header>
<main class="w-full h-screen flex items-center justify-center">
	<slot />
</main>
