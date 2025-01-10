<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       CAMERA                 */
	/*                                        */
	/* ====================================== */

	import CameraProxy from './_backend/_Camera.proxy.js'
	import { GetPreciseCoordinate } from '$ad3_libs/index.js'
	import { CAMERA_TYPES } from '$ad3'
	import { keys } from '$keys'

	// #define COMP3D

	const proxy = Proxification( new CameraProxy() )

	InitialiseUID()

	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )

	SetDefaults( {

		position: [0,0,-4],

		interaxial: false,
		sidebyside: true,

		minZ: 0,
		maxZ: 1000,

		target: null,
		alignTarget: null,

		isOrthographic: true,
		interact: {},

	})

	setContext('camera', data)
	setContext('cameraData', data)
	setContext('cameraProxy', proxy)


	////////////////////////////////////////////////////////////////////////////////////////
	////////////                                                                ////////////
	////////////                                                                ////////////
	////////////                             CAMERA                             ////////////
	////////////                                                                ////////////
	////////////                                                                ////////////
	////////////////////////////////////////////////////////////////////////////////////////


	$effect( () => {

		const untrackPosition = untrack(() => data.position )
		const untrackTarget =  untrack(() => data.target )

		proxy.setup( data.uid, {
			id: data.uid,
			position: untrackPosition,
			// target: untrackTarget,
			interaxial: data.interaxial,
			sidebyside: data.sidebyside,
			alpha: untrack(() => data.alpha),
			radius: untrack(() => data.radius),
			beta: untrack(() => data.beta),
			minZ: data.minZ,
			maxZ: data.maxZ
		}, data.debug ).then( () => {
			
			store.cameraData = data
			store.cameraProxy = proxy

			// UpdateInteractives()
			EnableRefs()

			proxy.setOrthographic( data.isOrthographic )

		})

	})


	$effect( WhenReady.bind(() => proxy.setOrthographic( data.isOrthographic )))
	$effect( WhenReady.bind(() => {
		proxy.setControlsEnabled( data.controls )
	}))

	let prevTarget = null
	let prevAlign = null
	$effect( WhenReady.bind(() => {
		proxy.immediateSetCameraTargets( data.target, data.alignTarget, data.forceRetarget )
		data.forceRetarget = false
		prevTarget = data.target
		prevAlign = data.alignTarget
	}))



</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}

