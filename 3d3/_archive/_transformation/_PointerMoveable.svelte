<script>

	/* ====================================== */
	/*                                        */
	/*            POINTER MOVEABLE            */
	/*                                        */
	/* ====================================== */

	// #define BABYLON
	// #define COMPONENT
	// #define INTERACTION
	// #define POINTER_INTERACTION

	export let numButtons = 2

	function applyMovement(deltaX, deltaY) {
		
		const nodeRef = node || context.getNode()
		if (!nodeRef || !enabled) return 

		const scene = context.getScene()
		const camera = scene.activeCamera
		if (!camera) return

		const movementSpeed = speed / 100

		const forwardVector = camera.getTarget().subtract(camera.position).normalize()
		const rightVector = BB.Vector3.Cross(camera.upVector, forwardVector).normalize()

		const rightMovement = rightVector.scale(deltaX * movementSpeed)
		const upMovement = camera.upVector.scale(-deltaY * movementSpeed)

		nodeRef.position.addInPlace(rightMovement)
		nodeRef.position.addInPlace(upMovement)

		momentumX = deltaX
		momentumY = deltaY
	}


</script>








