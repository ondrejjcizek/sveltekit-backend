<script>
	export let data;
</script>

<main>
	<h1>welcome {data.firstName}! This is your JWT payload!</h1>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</main>
