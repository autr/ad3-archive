<script>
	/* ====================================== */
	/*                                        */
	/*         	        TUBE                  */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import Tube from './_Tube.svelte.js'
	import { Vec3 } from '$3d1_points'
	

	const RANDOM = 8

	let {

		debug = false,

		position = 0, /** @gui oneOf: [ $points ] */
		rotation = 0, /** @gui oneOf: [ $points ] */

		points = [], // getRandomPoints( RANDOM ),
		radius = 0.2, /** @gui step: 0.01 */
		sides = 6, /** @gui */
		corners = 7, /** @gui min: 0, max: 32 */

		threaded = false, /** @gui */

		cap = 'cap', /** @gui oneOf: [ none, cap, close, round ] */

		flat = true, /** @gui */

		updatable = true, /** @gui */
		faces = 'double', /** @gui oneOf: [ front, back, double ] */

		id = 'tube',

		material = 'material', /** @gui oneOf: $materials */
		children,
		...props
	} = $props()

	function getRandomPoints( amount ) {
		let array = []
		for (let i = 0; i < amount; i++ ) array.push( (new Vec3()).randomise( -1, 1) )
		return array
	}

	$effect(() => tube.state.debug = debug)
	$effect(() => tube.state.position = position)
	$effect(() => tube.state.rotation = rotation)
	$effect(() => tube.state.points = points)
	$effect(() => tube.state.radius = radius)
	$effect(() => tube.state.sides = sides)
	$effect(() => tube.state.corners = corners)
	$effect(() => tube.state.cap = cap)
	$effect(() => tube.state.flat = flat)
	$effect(() => tube.state.updatable = updatable)
	$effect(() => tube.state.faces = faces)
	$effect(() => tube.state.material = material)
	
	const tube = new Tube( id, debug )
	onDestroy( tube.dispose.bind(tube) )
</script>

<svelte:options runes={true} />


{#if children}
	{@render children()}
{/if}