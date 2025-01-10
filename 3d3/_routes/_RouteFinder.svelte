<script>
	/* ====================================== */
	/*                                        */
	/*         	    ROUTE-FINDER              */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Vec3 } from '$3d1_points'

	import RouteFinder from './_RouteFinder.svelte.js'

	import Tube from '../_meshes/_Tube.svelte'
	
	let {

		id = 'route',
		debug = false, /** @gui */
		repeats = false, /** @gui */
		children,
		...props
	} = $props()

	$effect(() => route.syncState({
		debug,

	}))


	const route = new RouteFinder( id, debug )

	onDestroy( route.dispose.bind(route) )
</script>

<svelte:options runes={true} />

{#if children}
	{@render children()}
{/if}