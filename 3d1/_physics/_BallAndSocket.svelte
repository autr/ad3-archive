<script>
	/* ====================================== */
	/*                                        */
	/*            BALL AND SOCKET             */
	/*                                        */
	/* ====================================== */

	import AUI from '$aui'
	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'

	// #include essential
	

	const context = getContext('sketch')
	
	export let name = 'BallAndSocket'
	export let constraint = null
	export let debug = context.getDebug()

	export let meshA = null 
	export let meshB = null 
	export let pivot = null
	export let axisA = new BB.Vector3(1, 1, 1)
	export let axisB = new BB.Vector3(1, 1, 1)


	onMount( init )
	onDestroy( destroy )

	function getMeshPivot( mesh ) {

		const matrix = mesh.getWorldMatrix().clone().invert()
		const transformedPivot = BB.Vector3.TransformCoordinates(new BB.Vector3(pivot.x, pivot.y, pivot.z), matrix)
		return transformedPivot
	}


	let requestInit = null
	function init() {

		const meshARef = context.findMeshByName(meshA) || context.getMesh()
		const meshBRef = context.findMeshByName(meshB) || context.getMesh()
		const noPhysicsBodies = !meshARef?.physicsBody || !meshBRef?.physicsBody
		const sameBody = meshARef == meshBRef

		if (noPhysicsBodies) {
			// SAY(`🚨 no physics`, meshARef.name, !meshARef.physicsBody, meshBRef.name, !meshBRef.physicsBody)
			window.requestAnimationFrame( init )
		} else {
			SAY(`✅ ready`, { sameBody, noPivot: !pivot })
		}

		if (!browser || noPhysicsBodies || sameBody ) return

		if (!pivot) pivot = meshARef.getAbsolutePosition()

		console.log('CREATING')
		const scene = context.getScene()
		if (requestInit) window.cancelAnimationFrame( requestInit )
		requestInit = window.requestAnimationFrame(() => {

			destroy()

			constraint = new BB.BallAndSocketConstraint(
				getMeshPivot(meshARef),
				getMeshPivot(meshBRef),
				axisA,
				axisB,
				scene
			)

			meshARef.physicsBody.addConstraint(meshBRef.physicsBody, constraint)
			SAY(`🦵 ✅ ${name}, inited ball and socket constaint`)
		})
	}


	// $: init( meshA, meshB, pivot )

	function destroy() {

		if (constraint) {
			constraint.dispose()
			constraint = null
			SAY(`🦵 🚨 ${name}, removed ball and socket constaint`)
		}
	}

</script>