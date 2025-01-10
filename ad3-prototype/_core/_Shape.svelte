<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       SHAPE                 */
	/*                                        */
	/* ====================================== */

	import ShapeProxy from './_backend/_Shape.proxy.js'
	import { PATTERNS, ORIENTATION } from '$ad3'

	// #define COMP3D
	
	const proxy = Proxification( new ShapeProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )

	const shapeDefaults = {
		type: 'Torus',
		size: [2,0.01,180],
		radius: 0.1,
		
		points: [],

		isPickable: false,
		isVisible: true,
		isEnabled: true,
		isBillboard: true,
		isOnTop: false,

		rotation: [0,90,90],

		color: [1,0.6,0.6],

		arc: 1, // all circular (sphere,disc,cylinder)
		sides: 4, // all
		enclose: true, // cylinder
		wrap: false, // tiled box
		tile: 1, // tiled box, tiled ground
		visibility: 1,
		pattern: 'none', // not implemented yet!
		slice: 1, // sphere only
		dasharray: false,


		position: [0,0,0]

	}

	SetDefaults({
		...DEFAULTS.MESH,
		...shapeDefaults
	})
	// data.debug = true

	let hardStop = 0


	let isBuilding = false

	let shapeConfig = $derived({
		type: Q(data.type),
		size: Q(data.size),
		radius: Q(data.radius),
		points: Q(data.points),
		color: Q(data.color),
		arc: Q(data.arc), 
		sides: Q(data.sides),
		enclose: Q(data.enclose),
		wrap: Q(data.wrap),
		tile: Q(data.tile), 
		visibility: Q(data.visibility),
		pattern: Q(data.pattern),
		slice: Q(data.slice),
		dasharray: Q(data.dasharray),
		rotation: Q(data.rotation),
	})

	$effect( () => {
		if (data.inited) return
		proxy.setup( data.uid, untrack( () => shapeConfig ), untrack( () => flags ) ).then( () => {
			EnableRefs()
		})
	})

	const flags = $derived({
		isEnabled: Q(data.isEnabled),
		isPickable: Q(data.isPickable),
		isVisible: Q(data.isVisible),
		isBillboard: Q(data.isBillboard),
		isHighlighted: Q(data.isHighlighted)
	})

	$effect( WhenReady.bind(() => proxy.setFlags( flags )))
	$effect( WhenReady.bind(() => proxy.setShapeConfig( shapeConfig )))

	const transform = getContext('transform')
	// $effect( WhenReady.bind(() => proxy.setShapeTransformParent( transform?.uid )))
	$effect( WhenReady.bind(() => proxy.setShapePosition( data.position )))


</script>

<svelte:options runes={true} />
