<script>
	
	/* ====================================== */
	/*                                        */
	/*         	   FACE DETECTOR              */
	/*                                        */
	/* ====================================== */

	import FaceDetectorProxy from './_backend/_FaceDetector.proxy.js'

	// #define COMP3D
	
	const proxy = Proxification( new FaceDetectorProxy() )
	InitialiseUID()

	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )
	// proxy.setFaceDetectorCallback( OnFacesDetected )

	const edges = getContext('edges')
	
	SetDefaults({
		resolution: 1
	})

	const derivedEdges = $derived( (edges || groups.Edge ? Object.values( groups.Edge ) : []).map( item => item.uid ) )

	function OnFacesDetected( faces ) {
		// SAY('WOOOOO FACES', faces)
	}

	globalThis.lookup  = lookup 
	globalThis.groups = groups

	$effect( () => { if (!data.inited) proxy.setup(data).then(() => EnableRefs()) })
	$effect( WhenReady.bind(() => proxy.immediateUpdatePoints( derivedEdges ) ))
	
</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}