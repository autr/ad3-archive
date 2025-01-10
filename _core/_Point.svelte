<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        POINT                 */
	/*                                        */
	/* ====================================== */

	import PointProxy from './_backend/_Point.proxy.js'
	import { MapRange } from '$_lib/lib.utils.js'

	// #define COMP3D

	const proxy = Proxification( new PointProxy() )

	InitialiseUID()

	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug )//.then( () => data.loaded = true )

	SetDefaults({

		position: [ Math.random(), Math.random(), Math.random() ],
		rotation: [0,0,0],
		radius: MapRange( Math.random(), 0, 1, 0.02, 0.08), // disc
		scaling: 1,

		isPickable: true,
		isVisible: true,
		isEnabled: true,
		isBillboard: true,
		isHighlighted: false,

		color: [Math.random(),Math.random(),Math.random(),1],
		resolution: 8, // disc
		useSphere: true,
		isOnTop: false

	})

	setContext('point', data)

	// SETUP

	$effect( () => { if (!data.inited) proxy.setup(data).then(() => EnableRefs() )})

	const externalShape = $derived( lookup.get(data.shape)?.inited ? Q(data.shape) : false )
	$effect( WhenReady.bind(() => proxy.setShape(externalShape, {
		color: Q(data.color), 
		resolution: Q(data.resolution),
		useSphere: Q(data.useSphere),
		isOnTop: Q(data.isOnTop)
	})))

	$effect( WhenReady.bind(() => proxy.setPosition( Q(data.position) )))
	$effect( WhenReady.bind(() => proxy.setScaling( Q(data.scaling) )))
	$effect( WhenReady.bind(() => proxy.setRadius( Q(data.radius) )))
	$effect( WhenReady.bind(() => proxy.setRotation( Q(data.rotation) )))

	const flags = $derived({
		isEnabled: Q(data.isEnabled),
		isPickable: Q(data.isPickable),
		isVisible: Q(data.isVisible),
		isBillboard: Q(data.isBillboard),
		isHighlighted: Q(data.isHighlighted)
	})
	
	$effect( WhenReady.bind(() => proxy.setFlags( flags )))

	const transform = getContext('transform')
	$effect( WhenReady.bind(() => proxy.setTransformParent( transform?.uid )))
</script>

<svelte:options runes={true} />
<!-- 
<GraphicNode uid={data.uid}>
		<circle
			id={data.uid}
			class="{data.object.toLowerCase()} {data.uid} {data.class}"
			style={data.style}
			class:-hovered={isHovered}
			class:-selected={isSelected}
			class:-connected={isConnected}
			class:-removed={isRemoved}
			class:-unconnected={!isConnected}
			class:-hidden={isHidden}
			cx={coordinate.x || 0}
			cy={coordinate.y || 0}
			z-index={coordinate.z}
			r={((shape.size*2) * store.ORTHOGRAPHIC_MULTIPLIER * zMultiplier)||0} />
</GraphicNode> -->

<!-- <GUINode 
	information={information}
	uid={data.uid}>

	<div class="col-s-s cmb-2">
		<GUI.Input
			label="position"
			bind:value={data.position} />
		
	</div>

</GUINode> -->

		
<!-- <LabelNode
	uid={data.uid}
	show={isSelected && activeTool === 'pointer' && data.isPickable}
	title={data.creator.uid}
	text={data.uid}
	coordinate={coordinate}
	zIndex={coordinate.z * 5 * zMultiplier}
	canvas={store.domCanvas} /> -->

<!-- <Material bind:data={material} /> -->
<!-- <Shape bind:data={shape} /> -->

{#if children && data.inited}
	{@render children()}
{/if}


