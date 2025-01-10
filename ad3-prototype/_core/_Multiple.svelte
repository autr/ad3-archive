<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        GROUP                 */
	/*                                        */
	/* ====================================== */

	import { Edge, Point, Face } from './index.js'
	import { A } from '$ad3_autogen'

	// #define COMP3D

	const points = getContext('points')
	const edges = getContext('edges')
	const lines = getContext('lines')
	const faces = getContext('faces')

	const components = {
		points: Point,
		edges: Edge,
		faces: Face
	}

	const input = { points, edges, lines, faces }

	SetDefaults({
		multipleType: 'none',
		children: [],
		attributes: {},
		filter: (item, idx) => true
	})

	const proxy = { type: 'Multiple', setDebug: () => {} }

	InitialiseUID()
	EnableRefs()

	$effect( WhenReady.bind(() => {
		for (let i = 0; i < input[data.multipleType].length; i++) {
			const item = untrack( () => input[data.multipleType][i] )
			for (const [key,value] of Object.entries(data.attributes)) item[key] = value
		}
	}))

</script>

<svelte:options runes={true} />

{#each input[data.multipleType] as item, idx}
	{#if data.filter(item || {}, idx) && (data.isEnabled || data.inited) }
		<svelte:component
			this={components[data.multipleType]}  
			data={item} />
	{/if}
{/each}
