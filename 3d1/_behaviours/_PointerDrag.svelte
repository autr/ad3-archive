<script>
	/* ====================================== */
	/*                                        */
	/*             POINTER DRAG               */
	/*                                        */
	/* ====================================== */

	import AUI from '$aui'
	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'

	// #include essential
	

	export let name = "PointerDrag"
	export let behaviour = null
	export let mesh = null
	export let debug = false
	export let useObjectOrientation = false
	export let updateDragPlane = false
	export let dragAxis = null
	export let disablePreStep = false

	const context = getContext('sketch')

	onMount( init )
	onDestroy( destroy )


	function init() {

		if (!browser) return
		const scene = context.getScene()
		const candidateMesh = mesh ? mesh : context.getMesh ? context.getMesh() : null
		if (!candidateMesh || !scene) return 

		mesh = candidateMesh
		behaviour = new BB.PointerDragBehavior({})
		window.behaviour = behaviour
		window.mesh = mesh
		// pointerDragBehavior.onDragEndObservable.add(() => {
		// 	block?.physicsBody?.setLinearVelocity(new BB.Vector3(0, 0, 0));
		// })
		mesh.addBehavior(behaviour)
		updateSettings()
		if (debug) SAY(`👉 ✅ ${name}, inited pointer drag behaviour`)
	}

	function updateSettings() {
		if (!behaviour || !mesh) return 
		if (mesh?.physicsBody) mesh.physicsBody.disablePreStep = disablePreStep
		behaviour.useObjectOrientationForDragging = useObjectOrientation
		behaviour.updateDragPlane = updateDragPlane

		if (dragAxis) {
			SAY('DRAG AXIS!!!')
		}
	}

	$: updateSettings( updateDragPlane, useObjectOrientation )

	$: init( mesh )

	function destroy() {

		if (behaviour) {
			mesh.removeBehavior( behaviour )
			behaviour = null
			if (debug) SAY(`👉 🚨 ${name}, removed pointer drag behaviour`)
		}
	}

</script>