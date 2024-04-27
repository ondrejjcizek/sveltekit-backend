<script lang="ts">
	import type { PageData } from './$types.js';
	export let data: PageData;
	import TestForm from './test-form.svelte';
</script>

<TestForm data={data.form} />
