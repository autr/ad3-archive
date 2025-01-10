<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       ENGINE                 */
	/*                                        */
	/* ====================================== */

	import { CreateElementObserver } from '$ad3_libs'
	import EngineProxy from './_backend/_Engine.proxy.js'

	// #define COMP3D

	const proxy = Proxification( new EngineProxy() )
	InitialiseUID()


	SetDefaults({
		useNullEngine: false,
		useWebGPU: true,
		useWorker: true,
		sceneIndex: 0,
		downscale: 1
	})

	proxy.initialiseEngine( data.uid, data.useWorker, data.debug ).then( () => data.loaded = true )

	store.offscreenSupported = browser ? ('OffscreenCanvas' in window) : false
	store.engineData = data
	store.engineProxy = proxy
	store.faceDetector = []

	function HandleFaceDetector( data ) {
		if (data.debug) SAY(`🥵 FACES ${data.set.length} set ${data.delete.length} delete`)
		for (const {uid,cycle} of data.set) store.faceDetector.push( { id: uid, points: cycle } )
		for (const {uid,cycle} of data.delete) store.faceDetector = store.faceDetector.filter( o => o.id !== uid )
	}

	// proxy.setFaceDetectorCallback( HandleFaceDetector )

	$effect( () => {
		
		if (elements.domCanvas && !data.inited && data.loaded) {

			if (data.debug) SAY(`🟩 ENGINE DATA LOADED`)

			proxy.setupEngineAndCanvas( data.uid, elements.domCanvas, data.downscale, data.useNullEngine, data.useWebGPU, data.useWorker, data.debug )
			.then(EnableRefs)
			.catch(err => {
				SAY(`❌ 🏭 ${data.uid} `, err)
			})

		}
	})

	let framerate = $state( 60 )
	function ProxyEngineCallback( fps ) {
		framerate = Math.round(fps)
	}

	// ------------ INDEX ------------

	$effect( WhenReady.bind(() => {
		proxy.setSceneIndex( data.sceneIndex )
	}))

	let canvasObserver = null

	$effect( () => {
		if (!canvasObserver && proxy && elements.domCanvas && data.inited) {
			if (data.debug) SAY(`👁️ resizing`)
			canvasObserver = CreateElementObserver( elements.domCanvas, (left, top, width, height) => {
				if (data.debug) SAY(`🟠 📐 RESIZE ${width} ${height}`)
				proxy.resize( left, top, width, height, data.downscale )
			})
		}
	})

	const information = $derived({
		offscreenSupported: data.offscreenSupported,
		framerate
	})


</script>

<!-- <GUINode 
	information={information}
	uid={data.uid}>

	<GUI.Input 
		label="sceneIndex"
		bind:value={data.sceneIndex} />
	
</GUINode> -->

<svelte:options runes={true} />

{#if children && data.inited}

	{@render children()}
{/if}

