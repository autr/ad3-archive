<script>
	import routes from './routes.json5'
	import Box from '$3d1_meshes/_Box.svelte?raw'
	import MyBox from '$3d1_meshes/_Box.svelte'

</script>

<div class="flex row-center-center fill cmlr0-5">
	{#each Object.keys(routes) as key}
		{#if key != '/'}
			<a class="button" href="/3d{key}">{key.substring(1)}</a>
		{/if}
	{/each}
</div>
