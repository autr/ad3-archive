<script>
	
	/* ====================================== */
	/*                                        */
	/*         	         TUBE                 */
	/*                                        */
	/* ====================================== */

	import TubeProxy from './_Tube.proxy.js'

	// #define COMP3D

	const proxy = Proxification( new TubeProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )

	proxy.setMidpointCallback(  endpointConfig => {
		if (data.onUpdate) data.onUpdate( endpointConfig )
	})

	function RandomisePoints( amount ) {
		const randomPoints = []
		for (let i = 0; i < amount; i++ ) randomPoints.push( (new Vec3()).randomise( -1, 1).toArray() )
		return randomPoints
	}

	const path = getContext('path')

	SetDefaults({

		path: [],

		radius: 0.05,
		resolution: 6, // aka "sides"
		cornerResolution: 32, // aka "corners"
		capEnds: 0, // 0 = none, 1 = cap, 2 = close, 3 = round
		isOnTop: false,

		onUpdate: () => {},

		interpolate: 1,
		interpolateLastPoint: 1,
		color: [1,0.7,0.5,1]
	})

	$effect( () => {
		if (data.inited) return
		proxy.setup(data).then( res => EnableRefs() )
	})
	$effect( WhenReady.bind( () => proxy.updateTube({
		path: Q(data.path) || path,
		radius: Q( data.radius ),
		isOnTop: Q(data.isOnTop),
		resolution: Q( data.resolution ),
		cornerResolution: Q( data.cornerResolution ),
		capEnds: Q( data.capEnds ),
		color: Q(data.color),
		interpolate: Q(data.interpolate),
		interpolateLastPoint: Q(data.interpolateLastPoint)
	})))

	
</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}