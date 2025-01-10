<script>

	import Sketch from '$ad3_sketch/_Sketch.svelte'
	import Helper from '$ad3_sketch/_Helper.svelte'
	import Engine from '$ad3_core/_Engine.svelte'
	import Scene from '$ad3_core/_Scene.svelte'
	import Camera from '$ad3_core/_Camera.svelte'

	import * as csstree from 'css-tree'
	import testSheetString from './test.css?raw'

	// #define COMPONENT

	let data = $state({
		// object: 'Engine',
		// debug: false,
		// children: [
		// 	{
		// 		object: 'Scene',
		// 		gui: true,
		// 		debug: false,
		// 		children: [
		// 			{
		// 				object: 'Camera',
		// 				debug: false
		// 			},
		// 			// {
		// 			// 	object: 'Point',
		// 			// 	hidden: false
		// 			// },
		// 			// {
		// 			// 	object: 'Polyhedra',
		// 			// 	id: 'polyhedra',
		// 			// 	preset: 1,
		// 			// 	debug: false,
		// 			// 	schwarz: {
		// 			// 		x: 1,
		// 			// 		y: 1,
		// 			// 		z: 1
		// 			// 	},
		// 			// 	symbol: {
		// 			// 		x: 2,
		// 			// 		y: 3,
		// 			// 		z: 3
		// 			// 	},
		// 			// 	children: []
		// 			// }
		// 		]
		// 	}
		// ]
	})


	globalThis.csstree = csstree
	globalThis.testSheetString = testSheetString

	function ParseStyles() {


		const ast = csstree.parse(testSheetString)

		console.log(ast, testSheetString)
		let stylesMap = new Map()

		csstree.walk(ast, {
			visit: 'Rule',
			enter: (ruleNode) => {

				let conditions = {}
				let styles = {}

				csstree.walk(ruleNode.prelude, {
					enter: (node) => {
						const id = node.type.replace('Selector','').toLowerCase()
						if (id === 'combinator') {
							if (!conditions.parents) conditions.parents = []
							conditions.parents.push({
								combinator: csstree.generate(node)
							})
						} else if (id !== '' && id !== 'list') {
							if (!conditions.parents) {
								if (!conditions[id]) conditions[id] = []
								conditions[id].push(csstree.generate(node))
							} else {
								const parent = conditions.parents[conditions.parents.length-1]
								if (!parent[id]) parent[id] = []
								parent[id].push(csstree.generate(node))
							}
						}
					}
				})

				csstree.walk(ruleNode.block, {
					visit: 'Declaration',
					enter: (node, item, list) => {
						if (!node?.property) return SAY(`❌ no property`, node)
						if (!node?.value) return SAY(`❌ no value`, node)
						styles[node.property] =  node.value
					}
				})

				stylesMap.set(conditions, styles)
				
				SAY(`✅`, conditions, styles)
			}
		})


		// let classString = 'myClass anotherClass test'
		// let classes = classString.split(' ')
		// let finalStyles = {}
		// for(let i = 0; i < classes.length; i++) {
		// 	let styles = stylesMap.get('.' + classes[i])
		// 	if (styles) Object.assign(finalStyles, styles)
		// }

		// console.log(finalStyles)
	}

	$effect( ParseStyles )

</script>



<main class="grow col-s-s rel cno-basis cgrow hhh1vh bl bg4">
	<Sketch 
		bind:data={data}>
	</Sketch>

</main>

