<script>
	/* ====================================== */
	/*                                        */
	/*                 SPRING                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	import AUI from '$aui'

	const context = getContext('sketch')

	export let name = 'Spring'
	export let constraint = null
	export let debug = context.getDebug()

	export let meshA = null 
	export let meshB = null 
	export let pivotA = new BB.Vector3(0,0,0)
	export let pivotB = new BB.Vector3(0,0,0)
	export let axisA = new BB.Vector3(1, 1, 1)
	export let axisB = new BB.Vector3(1, 1, 1)

	export let minDistance = 0
	export let maxDistance = 0
	export let stiffness = 100
	export let damping = 1


	onMount( init )
	onDestroy( destroy )

	function getMeshPivot( mesh, pivot ) {
		const matrix = mesh.getWorldMatrix().clone().invert()
		const transformedPivot = BB.Vector3.TransformCoordinates(new BB.Vector3(pivot.x, pivot.y, pivot.z), matrix)
		return transformedPivot
	}

	let requestReference = null

	function init() {

		if (!browser || !meshA || !meshB) return
		const scene = context.getScene()

		destroy()

		if (requestReference) window.cancelAnimationFrame( requestReference )


		requestReference = window.requestAnimationFrame(()=>{

			let meshPivotA = getMeshPivot(meshA, pivotA)
			let meshPivotB = getMeshPivot(meshB, pivotB)

			const settings = {
				meshPivotA,
				meshPivotB,
				axisA,
				axisB,
				minDistance,
				maxDistance,
				stiffness,
				damping,
				scene
			
			}
			constraint = new BB.SpringConstraint( ...Object.values(settings) )
			meshA.physicsBody.addConstraint(meshB.physicsBody, constraint)
			SAY('SPRING', settings)
			if (debug) SAY(`🏀 ✅ ${name}, inited spring constaint`)
		})
	}

	$: init( meshA, meshB, pivotA, pivotB, minDistance, maxDistance, stiffness, damping )

	function destroy() {

		if (constraint) {
			constraint.dispose()
			constraint = null
			if (debug) SAY(`🏀 🚨 ${name}, removed spring constaint`)
		}
	}

</script>