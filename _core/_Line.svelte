<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        EDGE                 */
	/*                                        */
	/* ====================================== */

	import LineProxy from './_backend/_Line.proxy.js'

	// #define COMP3D
	
	const proxy = Proxification( new LineProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )
	
	SetDefaults({

		points: [],
		physics: 'none', // none, spring, solid

		isPickable: true,
		isVisible: true,
		isEnabled: true,
		isBillboard: false,
		isOccluding: true, 

		// DASHES

		isDashed: false,
		rounded: 0, // rounded
		autoSpeed: 0,
		retraction: 0,
		dashSize: 0.1, 
		dashGap: 0.618, // dashSize, dashGap

		// SHAPE

		radius: 0.03,
		color: [0.8,0.6,0.6,1],
		colors: null,
		offset: 0.5,
		isOnTop: false,

	})


	const lineConfig = $derived({

		points: Q(data.points),
		radius: Q(data.radius),
		color: Q(data.color),
		colors: Q(data.colors),
		offset: Q(data.offset),
		isOnTop: Q(data.isOnTop),

		isDashed: Q(data.isDashed),
		rounded: Q(data.rounded),
		autoSpeed: Q(data.autoSpeed),
		retraction: Q(data.retraction),
		dashSize: Q(data.dashSize),
		dashGap: Q(data.dashGap)

	})

	$effect( () => { if (!data.inited) proxy.setup(data).then(() => EnableRefs() )})

	$effect( WhenReady.bind(() => proxy.setLineShape(lineConfig)))

	const flags = $derived({

		isEnabled: Q(data.isEnabled),
		isPickable: Q(data.isPickable),
		isVisible: Q(data.isVisible),
		isBillboard: Q(data.isBillboard)

	})

	$effect( WhenReady.bind(() => proxy.setFlags( flags )))

	const transform = getContext('transform')
	$effect( WhenReady.bind(() => proxy.setTransformParent( transform?.uid )))

</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}