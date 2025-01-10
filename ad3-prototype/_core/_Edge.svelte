<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        EDGE                 */
	/*                                        */
	/* ====================================== */

	import EdgeProxy from './_backend/_Edge.proxy.js'

	// #define COMP3D
	
	const proxy = Proxification( new EdgeProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )
	
	SetDefaults({
		pointA: null,
		pointB: null,

		physics: 'none', // none, spring, solid

		isPickable: true,
		isVisible: true,
		isEnabled: true,
		isBillboard: false,
		isOccluding: true, 
		isHighlighted: false,

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

		// ARROW

		isArrowA: false,
		isArrowB: false,
		arrowSize: 0.1,
		arrowWidth: 0.1,

		// EXTERNAL

		shape: null,
		shapeA: null,
		shapeB: null,
	})

	const externalShape = $derived( lookup.get(data.shape)?.inited ? Q(data.shape) : false )

	const shapeConfig = $derived({
		width: Q(data.radius), 
		color: Q(data.color),
		isOnTop: Q(data.isOnTop),
		rounded: Q(data.rounded)  
	},)

	const dashConfig = $derived({
		isDashed: Q(data.isDashed),
		dashSize: Q(data.dashSize),
		dashGap: Q(data.dashGap),
		retraction: Q(data.retraction),
		offset: Q(data.offset)
	})

	const arrowConfig = $derived({
		isArrowA: Q(data.isArrowA),
		isArrowB: Q(data.isArrowB),
		arrowSize: Q(data.arrowSize),
		arrowWidth: Q(data.arrowWidth)
	})

	const flags = $derived({
		isEnabled: Q(data.isEnabled),
		isPickable: Q(data.isPickable),
		isVisible: Q(data.isVisible),
		isBillboard: Q(data.isBillboard),
		isHighlighted: Q(data.isHighlighted)
	})

	$effect( () => { if (!data.inited) proxy.setup(data,shapeConfig,dashConfig).then(() => EnableRefs() )})
	$effect( WhenReady.bind(() => proxy.setAllShapes( { ...externalShape }, { ...shapeConfig }, { ...dashConfig }, { ...arrowConfig }, untrack(() => flags ) )))

	// $effect( WhenReady.bind(() => proxy.setPosition( Q(data.position) )))
	// $effect( WhenReady.bind(() => proxy.setScaling( Q(data.radius)/2 || Q(data.scaling) )))
	// $effect( WhenReady.bind(() => proxy.setRotation( Q(data.rotation) )))

	$effect( WhenReady.bind(() => proxy.setAB(Q(data.pointA),Q(data.pointB))))
	$effect( WhenReady.bind(() => proxy.setFlags( flags )))

	const transform = getContext('transform')
	$effect( WhenReady.bind(() => proxy.setTransformParent( transform?.uid )))

</script>

<svelte:options runes={true} />


<!-- <GraphicNode uid={data.uid}>
	<line
		id={data.uid}
		class="{data.object.toLowerCase()} {data.uid} {data.class}"
		x1="{line2D.pointA.x || 0}"
		y1="{line2D.pointA.y || 0}"
		x2="{line2D.pointB.x || 0}"
		y2="{line2D.pointB.y || 0}"
		stroke-width={shape.radius * store.ORTHOGRAPHIC_MULTIPLIER * Math.max((1-zIndex),0)}
		class:-hidden={isHidden}
		class:-removed={isRemoved}
		class:-hovered={isHovered}
		class:-selected={isSelected} />
</GraphicNode>
 -->
<!-- <Material bind:data={material} /> -->
<!-- <Shape bind:data={shape} /> -->

<!-- <LabelNode
	uid={data.uid}
	show={isSelected && activeTool === 'pointer'}
	title={data.creator.uid}
	text={data.uid}
	coordinate={midpoint}
	zIndex={midpoint.z * 5 * zMultiplier}
	canvas={store.domCanvas} /> -->

{#if children && data.inited}
	{@render children()}
{/if}