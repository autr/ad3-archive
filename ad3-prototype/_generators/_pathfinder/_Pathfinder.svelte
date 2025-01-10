<script>
	/* ====================================== */
	/*                                        */
	/*         	      PATHFINDER              */
	/*                                        */
	/* ====================================== */

	import PathfinderProxy from './_Pathfinder.proxy.js'
	
	// #define COMP3D

	const proxy = Proxification( new PathfinderProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug )//.then( () => data.loaded = true )

	proxy.setPathfinderCallback( OnPathfinderSolve )

	function OnPathfinderSolve( res ) {
		path.splice(0,path.length)
		for (const point of res.path) path.push( point )

		if (data.onUpdate) data.onUpdate(res)
	}

	SetDefaults({
		edges: [],
		points: [],
		trigger: null,
		noRepeats: false,
		onUpdate: () => {}
	})

	const edges = getContext('edges')
	const points = getContext('points')
	let path = $state([])
	setContext('path', path)

	let timeout = null

	$effect( () => { if (!data.inited) proxy.setup( untrack(() => data ) ).then(() => EnableRefs() ) })

	function SolvePathfinder() {

		const filteredEdges = (edges || Q(data.edges)).filter( edge => edge.isEnabled )

		const sendEdges = filteredEdges.map( edge => {

			const item = {
				uid: edge.uid,
				pointA: edge.pointA,
				pointB: edge.pointB
			}
			return item

		})

		proxy.solvePath( sendEdges, Q(data.noRepeats), data.trigger )
	}

	$effect( WhenReady.bind( () => SolvePathfinder() ))

</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}