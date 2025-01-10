<script>

	/* ====================================== */
	/*                                        */
	/*         	        POINT                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { TransformNode, Vector3, Scene, NullEngine, Mesh } from '@babylonjs/core'
	import Object from '../_engine/_Object.svelte.js'

	let {
		id,
		children,
		...props
	} = $props()

	const schema = {

	}

	let canvas = document.createElement('canvas')

	const engine = new NullEngine( canvas, true )
	const scene = new Scene(engine)


	const vec3 = new Vector3(1,1,1)
	const node = new TransformNode('babylonnode', scene)
	const mesh = new Mesh('mesh')
	node.position = vec3
	mesh.position = vec3
	mesh.setParent(node)

	let targetRef = null

	const refs = getContext('references')
	let pointee = $derived.by(() => {
		return refs.get(props.target)
		})

	function logOut() {
	}

	function random() {
		vec3.x = parseInt( Math.random() * 100 )
		// vec3 = new Vector3(parseInt( Math.random() * 100 ),1,1)
		// node.position.x = parseInt( Math.random() * 100 )
		console.log( 'MESH', mesh.position.x )
		console.log( 'ABS', mesh.getAbsolutePosition() )
		console.log( 'NODE', node.position.x )
		console.log( 'VEC3', vec3.x )
	}

</script>

<svelte:options runes={true} />


<button class="button" on:click={logOut} >LOG OUT</button>
<button class="button" on:click={random} >RANDOM</button>

{console.log('>>>>>>>>>>> pointee.x holy shit', pointee, pointee?.props?.x, node, node.position)}