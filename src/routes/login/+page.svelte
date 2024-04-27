<script lang="ts">
	import type { PageData } from './$types.js';
	export let data: PageData;
	import LoginForm from './login-form.svelte';
</script>

<LoginForm data={data.form} />
