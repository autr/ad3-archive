<script>
	
	/* ====================================== */
	/*                                        */
	/*         	    SHAPE LOADER              */
	/*                                        */
	/* ====================================== */

	import LoaderProxy from './_backend/_Loader.proxy.js'

	// #define COMP3D
	
	const proxy = Proxification( new LoaderProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )
	
	SetDefaults({
		file: null,
		scaling: 0.1,
		onLoaded: () => {}
	})

	$effect( () => { if (!data.inited) proxy.setup(data).then(() => EnableRefs()) })

</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}