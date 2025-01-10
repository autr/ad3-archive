<script>

	import Sketch from '$ad3_sketch/_Sketch.svelte'
	import { ExplorerTree, ExplorerInspector } from '$ad3_app'
	// import stylesheet from './stylesheet.css?raw'
	import Stylesheet from './_Stylesheet.svelte'
	import css from 'css'
	import { GUI } from '$gui'
	import { Icon } from '$icons'

	import { ICONS } from '$ad3_tools'
	import Listicle from '$ad3_tools/_Listicle.svelte'
	import SelectableItem from '$ad3_tools_explore/_SelectableItem.svelte'
	import Tools from '$ad3_tools/_Tools.svelte'

	import { Tree } from '$ad3_tools_explore'

	import { GetCreatorChain } from '$ad3_libs'

	// #define COMPONENT

	let data = $state({
		object: 'Engine',
		debug: false,
		children: [
			{
				object: 'Scene',
				debug: true,
				children: [
					{
						object: 'Camera',
						debug: false
					},
					{
						object: 'Cylinder'
					}
					// {
					// 	object: 'Point',
					// 	hidden: false
					// },
		// 			{
		// 				object: 'Polyhedra',
		// 				id: 'polyhedra',
		// 				preset: 1,
		// 				debug: false,
		// 				schwarz: {
		// 					x: 1,
		// 					y: 1,
		// 					z: 1
		// 				},
		// 				symbol: {
		// 					x: 2,
		// 					y: 3,
		// 					z: 3
		// 				},
		// 				children: []
		// 			}
				]
			}
		]
	})

	let refs = $state()


</script>



<!-- <Stylesheet /> -->



<div class="www1vw hhh1vh">
	<Sketch 
		bind:refs={refs}
		bind:data={data}>

		<!-- <Tools bind:refs={refs} /> -->
	</Sketch>
</div>
