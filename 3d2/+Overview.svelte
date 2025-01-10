<script>
	import routes from './routes.json5'

</script>

<div class="flex row-center-center fill cmlr0-5">
	{#each Object.keys(routes) as key}
		{#if key != '/'}
			<a class="button" href="/3d2{key}">{key.substring(1)}</a>
		{/if}
	{/each}
</div>