<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        LINE                  */
	/*                                        */
	/* ====================================== */

	// #define COMP3D

	SetDefaults({
		sides: 6,
		orientation: 'XY',
		radius: 1
	})


	let points = $state([])
	let edges = $state([])

	const proxy = { type: 'Polygon', setDebug: () => {} }

	InitialiseUID()

	setContext('points', points )
	setContext('edges', edges )

	EnableRefs()


	$effect( WhenReady.bind(() => {

		const newPoints = []
		const newEdges = []
		const radius = data.radius
		const fullCircle = 2 * Math.PI
		let lastId = data.uid + 'PolyPoint' + (data.sides - 1)

		for (let i = 0; i < data.sides; i++) {
			const angle = i * fullCircle / data.sides
			const x = radius * Math.cos(angle)
			const y = radius * Math.sin(angle)
			const point = [ 0, 0, 0 ]
			const orient = data.orientation.toLowerCase()

			if (orient[0] === 'x') point[0] = x
			if (orient[0] === 'y') point[1] = x
			if (orient[0] === 'z') point[2] = x
			if (orient[1] === 'x') point[0] = y
			if (orient[1] === 'y') point[1] = y
			if (orient[1] === 'z') point[2] = y

			const id = data.uid + 'PolyPoint' + i
			points[i] = { id, position: point }

			edges[i] = {
				id: data.uid + 'Edge' + newEdges.length,
				pointA: lastId,
				pointB: id
			}

			lastId = id
		}

	}))


</script>

<svelte:options runes={true} />

{#if children && data.inited} 
	{@render children()}
{/if}
