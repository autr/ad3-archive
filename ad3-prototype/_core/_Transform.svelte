<script>
	
	/* ====================================== */
	/*                                        */
	/*         	   TRANSFORM NODE             */
	/*                                        */
	/* ====================================== */

	import TransformProxy from './_backend/_Transform.proxy.js'

	// #define COMP3D
	
	const proxy = Proxification( new TransformProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )
	
	SetDefaults({
		position: [0,0,0],
		rotation: [0,0,0],
		scaling: [1,1,1],
		pointA: null,
		pointB: null
	})

	setContext('transform', data)
	setContext('transformProxy', proxy)
	setContext('parent', data.uid)

	$effect( () => {
		if (data.inited) return
		proxy.setup( data).then( () => {
			EnableRefs()
		})
	})

	$effect( WhenReady.bind(() => proxy.setPosition(data.position) ))
	$effect( WhenReady.bind(() => proxy.setRotation(data.rotation) ))
	$effect( WhenReady.bind(() => proxy.setScaling(data.scaling) ))

</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}