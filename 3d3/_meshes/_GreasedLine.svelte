<script>
	/* ====================================== */
	/*                                        */
	/*         	   GREASED LINE               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import GreasedLine from './_GreasedLine.svelte.js'
	import { Vec3 } from '$3d1_points'
	

	const RANDOM = 8

	let {

		debug = false,

		position = 0, /** @gui oneOf: [ $points ] */
		rotation = 0, /** @gui oneOf: [ $points ] */

		points = getRandomPoints( RANDOM ),


		radius = [ 0.2 ],
		colors = [ new Color4( 1, 1, 0, 1) ],
		colorDistribution = 'even', /** @gui oneOf: [ none, even, repeat, start, end ] */
		radiusDistribution = 'even', /** @gui oneOf: [ none, even, repeat, start, end ] */


		updatable = true, /** @gui */
		faces = 'double', /** @gui oneOf: [ front, back, double ] */

		id = 'greasedline',

		material = 'material', /** @gui oneOf: $materials */
		children,
		...props
	} = $props()

	function getRandomPoints( amount ) {
		let array = []
		for (let i = 0; i < amount; i++ ) array.push( (new Vec3()).randomise( -1, 1) )
		return array
	}

	$effect(() => line.syncState({
		debug,

		position,
		rotation,

		points,
		radius,



		updatable,
		faces,
		material

	}))
	const line = new GreasedLine( id, debug )
	onDestroy( line.dispose.bind(line) )
</script>

<svelte:options runes={true} />


{#if children}
	{@render children()}
{/if}