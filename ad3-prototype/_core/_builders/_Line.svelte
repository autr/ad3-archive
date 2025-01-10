<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        LINE                  */
	/*                                        */
	/* ====================================== */

	import LocalProxy from './_Line.proxy.js'
	import SchemaString from './_Line.svelte?raw'
	import { PATTERNS, ORIENTATION } from './defs.js'

	// #define COMP3D

	function RandomPoints( amount, min = -1, max = 1 ) {
		let array = []
		for (let i = 0; i < amount; i++ ) array.push( (new Vec3()).randomise( -1, 1) )
		return array
	}

	SetDefaults({
		...DEFAULTS.MESH,

		color: new Vec3(1,1,1),
		points: RandomPoints( 8, -2, 2),
		dasharray: new Vec2Proxy(0.1,0.5),
		animate: 0.2,
		radius: 0.2,
		startArrow: new Vec2Proxy(0,0), // length, width
		endArrow: new Vec2Proxy(0,0), // length, width
		
	})


	const pointsLookup = $derived(data.points.map( point => {
		if (typeof point === 'string') return {
			uid: lookup[point]?.data?.uid,
			x: lookup[point]?.data?.position?.x,
			y: lookup[point]?.data?.position?.y,
			z: lookup[point]?.data?.position?.z,
		}
		return (new Vec3(point)).toObject() 
	}).filter( point => point ))

	$effect( () => {

		const config = {
			points: pointsLookup,
			dasharray: data.dasharray.toObject ? data.dasharray.toObject() : data.dasharray,
			radius: data.radius,
			updatable: data.updatable,
			startArrow: data.startArrow.toObject ? data.startArrow.toObject() : data.startArrow,
			endArrow: data.endArrow.toObject ? data.endArrow.toObject() : data.endArrow,
		}

		proxy.setup( data.uid, config, data.debug ).then( () => {
			EnableRefs()
		})
	})

	$effect( WhenReady.bind(() => proxy.updateColorMaterial( data.color.toObject() )))

</script>

<svelte:options runes={true} />

{#snippet Objects()}{/snippet}
{#snippet Overlay()}{/snippet}

// #define BABYLON_DOM