<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Todos - Account</title>
	<meta name="description" content="Create, delete and complete your todos" />
</svelte:head>

<main>
	<h1>Welcome {data.firstName}! This is your JWT payload!</h1>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</main>
