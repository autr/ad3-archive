<script>

	/* ====================================== */
	/*                                        */
	/*          TRANSFORM BEHAVIOUR           */
	/*                                        */
	/* ====================================== */

	import { POINTER_EVENT_TYPES } from '$3d/defs'
	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'

	// #include essential
	

	const context = getContext('sketch')

	onMount( init )

	export let node = null
	export let meshes = null

	export let rotationSpeed = 0.4
	export let rotateMomentum = 0.98
	export let translateMomentum = 0.98

	export let enabled = true

	export let autoRotateSpeed = 0
	export let autoRotateVector = new BB.Vector2( (Math.random()*2)-1, (Math.random()*2)-1 ) 

	let candidate = null
	let requestRef = null

	let momRotateX = null
	let momRotateY = null

	let momTranslateX = null
	let momTranslateY = null

	function applyRotation2(y, x) {

		const nodeRef = node || context.getNode()
		if (!nodeRef || !enabled) return 
		const deltaX = x * -0.01
		const deltaY = y * -0.01
		const quat = new BB.Quaternion.RotationYawPitchRoll(deltaY, deltaX, 0)
		if (!nodeRef.rotationQuaternion) {
			nodeRef.rotationQuaternion = BB.Quaternion.FromEulerAngles(
				nodeRef.rotation.x, nodeRef.rotation.y, nodeRef.rotation.z
			)
		}

		nodeRef.rotationQuaternion = nodeRef.rotationQuaternion.multiply(quat)
	}


	function applyRotation(deltaX, deltaY) {
		const nodeRef = node || context.getNode()
		if (!nodeRef || !enabled) return 

		const speed = rotationSpeed / 100 

		const scene = context.getScene()
		const camera = scene.activeCamera
		if (!camera) return

		const forwardVector = camera.getTarget().subtract(camera.position).normalize()
		const rightVector = BB.Vector3.Cross(camera.upVector, forwardVector).normalize()

		const x = (autoRotateVector.x * autoRotateSpeed) + deltaX
		const y = (autoRotateVector.y * autoRotateSpeed) + deltaY

		const upRotation = BB.Quaternion.RotationAxis(camera.upVector, -x * speed)
		const rightRotation = BB.Quaternion.RotationAxis(rightVector, -y * speed)
		const combinedRotation = upRotation.multiply(rightRotation)

		if (!nodeRef.rotationQuaternion) {
			nodeRef.rotationQuaternion = BB.Quaternion.FromEulerAngles(
				nodeRef.rotation.x, nodeRef.rotation.y, nodeRef.rotation.z
			)
		}
		nodeRef.rotationQuaternion = combinedRotation.multiply(nodeRef.rotationQuaternion)
		momRotateX = deltaX
		momRotateY = deltaY
	}

	function applyTranslation(deltaX, deltaY) {
		const nodeRef = node || context.getNode()
		if (!nodeRef || !enabled) return 

		const scene = context.getScene()
		const camera = scene.activeCamera
		if (!camera) return

		const movementSpeed = 0.004

		const forwardVector = camera.getTarget().subtract(camera.position).normalize()
		const rightVector = BB.Vector3.Cross(camera.upVector, forwardVector).normalize()

		const rightMovement = rightVector.scale(deltaX * movementSpeed)
		const upMovement = camera.upVector.scale(-deltaY * movementSpeed)

		nodeRef.position.addInPlace(rightMovement)
		nodeRef.position.addInPlace(upMovement)
		momTranslateX = deltaX
		momTranslateY = deltaY
	}



	function init() {

		if (!browser) return
		const scene = context.getScene()
		if (!scene) return

		scene.onPointerObservable.add( info => {

			const type = POINTER_EVENT_TYPES[info.type]
			const { pickInfo } = info
			const { pickedMesh } = pickInfo
			const { movementX, movementY } = info.event
			const buttons = info.event.buttons

			if (type == 'POINTERDOWN') createCandidate( pickedMesh )
			if ( type == 'POINTERMOVE' && candidate && buttons == 1 ) applyRotation( movementX, movementY )
			if ( type == 'POINTERMOVE' && candidate && buttons == 2 ) applyTranslation( movementX, movementY )
			if ( type == 'POINTERUP' && candidate ) clearCandidate()
		})
		updateAutoRotate()

	}

	function tick() {
		if (!candidate && enabled) {

			momRotateX *= rotateMomentum
			momRotateY *= rotateMomentum

			momTranslateX *= rotateMomentum
			momTranslateY *= rotateMomentum

			applyRotation( momRotateX, momRotateY )
			applyTranslation( momTranslateX, momTranslateY )
		}
		if (autoRotateSpeed || rotateMomentum > 0 || translateMomentum > 0) window.requestAnimationFrame( tick )
	}

	function updateAutoRotate() {
		if (!browser) return 
		if (requestRef) window.cancelAnimationFrame( requestRef )
		if (autoRotateSpeed || rotateMomentum > 0 || translateMomentum > 0) requestRef = window.requestAnimationFrame( tick )
	}

	$: updateAutoRotate( autoRotateSpeed, autoRotateVector, rotateMomentum, translateMomentum )

	let hasControls = false
	function createCandidate( mesh ) {
		const nodeRef = node || context.getNode()
		if (!nodeRef) return 
		const meshesRef = meshes || nodeRef.getChildMeshes()
		if (meshesRef.indexOf(mesh) != -1) {
			candidate = mesh
			const scene = context.getScene()
			hasControls = scene?.activeCamera?.inputs?.attachedToElement
			context.getCamera().detachControl()
		}
	}
	function clearCandidate() {

		candidate = null
		if (hasControls) context.getCamera().attachControl()
	}


</script>

<svelte:window on:mouseup={clearCandidate} on:pointerup={clearCandidate} />
