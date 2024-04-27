<script lang="ts">
	import type { PageData } from './$types.js';
	import TestForm from './test-form.svelte';
	export let data: PageData;
</script>

<TestForm data={data.form} />
