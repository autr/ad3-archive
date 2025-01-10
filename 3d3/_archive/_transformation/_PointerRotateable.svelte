<script>

	/* ====================================== */
	/*                                        */
	/*           POINTER ROTATEABLE           */
	/*                                        */
	/* ====================================== */

	// #define BABYLON
	// #define COMPONENT
	// #define INTERACTION
	// #define POINTER_INTERACTION

	export let numButtons = 1

	function applyMovement(deltaX, deltaY) {
		const nodeRef = node || context.getNode()
		if (!nodeRef || !enabled) return 
			
		const spd = speed / 100 

		const scene = context.getScene()
		const camera = scene.activeCamera
		if (!camera) return

		const forwardVector = camera.getTarget().subtract(camera.position).normalize()
		const rightVector = BB.Vector3.Cross(camera.upVector, forwardVector).normalize()

		const x = (autoVector.x * autoSpeed) + deltaX
		const y = (autoVector.y * autoSpeed) + deltaY

		const upRotation = BB.Quaternion.RotationAxis(camera.upVector, -x * spd)
		const rightRotation = BB.Quaternion.RotationAxis(rightVector, -y * spd)
		const combinedRotation = upRotation.multiply(rightRotation)

		// QUATERNION 

		const sourceQuat = nodeRef.rotationQuaternion ? nodeRef.rotationQuaternion.clone() : BB.Quaternion.FromEulerAngles( nodeRef.rotation.x, nodeRef.rotation.y, nodeRef.rotation.z )
		const destQuat = combinedRotation.multiply(sourceQuat)

		// nodeRef.rotationQuaternion = destQuat

		// ROTATION

		const ref = nodeRef.rotation.clone()
		destQuat.toEulerAnglesToRef( ref )

		nodeRef.rotation.x = ref.x
		nodeRef.rotation.y = ref.y
		nodeRef.rotation.z = ref.z

		momentumX = deltaX
		momentumY = deltaY

	}

</script>

<svelte:window 
	on:mouseup={clearCandidate} 
	on:pointerup={clearCandidate} />
