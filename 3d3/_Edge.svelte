<script>
	/* ====================================== */
	/*                                        */
	/*         	        EDGE                  */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Vec3 } from '$3d1_points'

	import Edge from './_Edge.svelte.js'

	import Tube from '../_meshes/_Tube.svelte'
	
	let {

		id = 'edgelord',
		debug = false, /** @gui */
		points = [],
		children,
		...props
	} = $props()

	$effect(() => edge.syncState({
		debug,
		points
	}))

	const edge = new Edge( id, debug )

	onDestroy( edge.dispose.bind(edge) )
</script>

<svelte:options runes={true} />

{#if children}
	{@render children()}
{/if}