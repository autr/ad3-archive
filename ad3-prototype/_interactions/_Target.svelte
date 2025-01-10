<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       TARGET                 */
	/*                                        */
	/* ====================================== */

	import TargetProxy from './_backend/_Target.proxy.js'

	// #define COMP3D
	
	const proxy = Proxification( new TargetProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )
	
	SetDefaults({

		color: [1,0,0,1],
		innerRadius: 0.5,
		outerRadius: 0.8

	})

	$effect( () => { if (!data.inited) proxy.setup(data).then(() => EnableRefs()) })
	$effect( WhenReady.bind(() => proxy.setPoints(Q(data.points, untrack(() => Q(data.color))))))
	$effect( WhenReady.bind(() => proxy.setEnabledPickableVisible( Q(data.isEnabled), Q(data.isPickable), Q(data.isVisible) )))
	$effect( WhenReady.bind(() => proxy.setColor(Q(data.color))))

</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}