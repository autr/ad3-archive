<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        SCENE                 */
	/*                                        */
	/* ====================================== */

	import SceneProxy from './_backend/_Scene.proxy.js'

	// #define COMP3D

	const proxy = Proxification( new SceneProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )

	SetDefaults({

		color: [1,1,1,0],

		useGround: false,
		groundSize: 40,
		groundGridCount: 40,
		groundColor: [0.7,0.7,0.7],
		groundPosition: [0,-4,0],

		useFog: false,
		fogStart: 0,
		fogEnd: 20,
		fogColor: [1,1,1]
	})

	$effect( () => {
		if (!data.inited && !data.disposing) {
			proxy.setup( data, data.debug ).then( () => {
				EnableRefs()
				store.activeScene = data
			})
		}
	})

	$effect( WhenReady.bind(() => proxy.setFog( { 
		useFog: Q(data.useFog), 
		fogStart: Q(data.fogStart), 
		fogEnd: Q(data.fogEnd), 
		fogColor: Q(data.fogColor) 
	})))

	$effect( WhenReady.bind(() => proxy.setGround( { 
		useGround: Q(data.useGround), 
		groundSize: Q(data.groundSize),
		groundGridCount: Q(data.groundGridCount), 
		groundColor: Q(data.groundColor),
		groundPosition: Q(data.groundPosition)
	})))


</script>

{#if children && data.inited}
	{@render children()}
{/if}

<!-- <GUINode uid={data.uid}>

	<GUI.Input
		label="inspector"
		bind:value={data.inspector} />
</GUINode> -->