<script>
	/* ====================================== */
	/*                                        */
	/*         	        NODE                  */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import Node from './_Node.svelte.js'
	let {

		position = { x: 0, y: 0, z: 0 }, /** @gui */
		rotation = { x: 0, y: 0, z: 0 }, /** @gui */
		id = 'node',
		children,
		updatable = true, /** @gui */
		...props
	} = $props()

	$effect(() => node.syncState({

		position,
		rotation,
		updatable
	}))

	const node = new Node( id )
	onDestroy( node.dispose.bind( node ) )
</script>

<svelte:options runes={true} />

{#if children}
	{@render children()}
{/if}
