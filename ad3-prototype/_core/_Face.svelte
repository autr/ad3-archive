<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        FACE                 */
	/*                                        */
	/* ====================================== */

	import FaceProxy from './_backend/_Face.proxy.js'

	// #define COMP3D
	
	const proxy = Proxification( new FaceProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )
	proxy.setCentroidCallback( OnNewCentroid )

	const centroidPosition = $state([0,0,0])
	function OnNewCentroid( x, y, z ) {
		centroidPosition[0] = x
		centroidPosition[1] = y
		centroidPosition[2] = z
	}
	
	SetDefaults({
		points: [],
		isPickable: true,
		isVisible: true,
		isEnabled: true,
		color: [0.6,1,0.6,0.2],
	})

	const flags = $derived({
		isEnabled: Q(data.isEnabled),
		isPickable: Q(data.isPickable),
		isVisible: Q(data.isVisible),
		isBillboard: Q(data.isBillboard),
		isHighlighted: Q(data.isHighlighted)
	})

	const faceConfig = $derived({
		color: Q( data.color ),
		points: Q( data.points )
	})

	$effect( () => { if (!data.inited) proxy.setup( data.uid, faceConfig, flags ).then(() => EnableRefs()) })
	$effect( WhenReady.bind(() => proxy.setFaceConfig( faceConfig ) ))
	$effect( WhenReady.bind(() => proxy.setFlags( flags )))

	// $effect( WhenReady.bind(() => proxy.setPoints(Q(data.points, untrack(() => Q(data.color))))))
	// $effect( WhenReady.bind(() => proxy.setColor(Q(data.color))))

	const transform = getContext('transform')
	$effect( WhenReady.bind(() => proxy.setTransformParent( Q(transform) )))
	
</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}