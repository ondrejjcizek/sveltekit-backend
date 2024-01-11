<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const account = document.querySelector('.Account');
		account?.classList.add('flex');
		account?.classList.remove('hidden');
	});
</script>

<h1>Todos List</h1>
