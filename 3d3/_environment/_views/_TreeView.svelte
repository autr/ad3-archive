<script>

	// #define COMPONENT

	import { GUI } from '$gui'

	let {
		object,
		children,
		...props
	} = $props()

</script>


{#if object}

	<GUI 
		id={object.id()}
		bind:value={object.props} 
		debug={false}
		schema={object.schema} />


	{#each Object.entries(object._children) as [id, child]}
		<svelte:self object={child} />
	{/each}
<!-- 
	<pre>
		{Stringify(object.props)}
	</pre>
 -->
{/if}