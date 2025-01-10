<script>

	import Sketch from '$ad3_sketch/_Sketch.svelte'
	import Stylesheet from './_Stylesheet.svelte'
	import css from 'css'
	import { GUI } from '$gui'
	import { Icon } from '$icons'

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
				gui: true,
				debug: false,
				children: [
					{
						object: 'Camera',
						debug: false
					},
					// {
					// 	object: 'Point',
					// 	hidden: false
					// },
					// {
					// 	object: 'Polyhedra',
					// 	id: 'polyhedra',
					// 	preset: 1,
					// 	debug: false,
					// 	schwarz: {
					// 		x: 1,
					// 		y: 1,
					// 		z: 1
					// 	},
					// 	symbol: {
					// 		x: 2,
					// 		y: 3,
					// 		z: 3
					// 	},
					// 	children: []
					// }
				]
			}
		]
	})

	let refs = $state()


</script>



<!-- <Stylesheet /> -->


<div class="row-s-s hhh1vh bg normal" style:--width="140px">
	<div class="explorer www8">

		{#if refs}
		{/if}
	</div>

	<main class="grow col-s-s rel cno-basis cgrow hhh1vh bl bg4">
		<Tools bind:refs={refs} />
		<Sketch 
			bind:refs={refs}
			bind:data={data} />

	</main>

</div>


<style lang="sass" global>


</style>
