<script>

	// #define COMPONENT
	// #define BABYLON
	// #define INTERACTION
	
	import { tween, MapRange } from '$root'
  import { x0 } from '$root/global/_color/lib.colorspaces';



	let destQuat = null
	let animGroup = null

	function init() {
		if (browser) window.requestAnimationFrame( tick )
	}

	function destroy() {

	}

	function tick() {

		if (destinationQuat) {

			const nodeRef = getNode()
			const sourceQuat = getQuaternionFromObject( nodeRef )
			const interpolatedRotation = BABYLON.Quaternion.Slerp(sourceQuat, destinationQuat, 0.1)
			nodeRef.rotationQuaternion = interpolatedRotation
		}

		window.requestAnimationFrame( tick )
	}

	function getQuaternionFromObject( o ) {
		return o.rotationQuaternion ? o.rotationQuaternion.clone() : BB.Quaternion.FromEulerAngles( o.rotation.x, o.rotation.y, o.rotation.z )
	}

	let destinationQuat = null
	let timeoutRef = null

	$: dihedral = 2
	$: adjustments = {
		a: [ 'x', Math.PI / dihedral],
		d: [ 'x', Math.PI / -dihedral],
		w: [ 'y', Math.PI / dihedral],
		s: [ 'y', Math.PI / -dihedral],
		q: [ 'z', Math.PI / dihedral],
		e: [ 'z', Math.PI / -dihedral]
	}


	function roundToDihedral(value) {
		const rounded = Math.round(value / (Math.PI / dihedral)) * (Math.PI / dihedral)
		return rounded
	}

	function onKeydown(e) {

		const type = e.type
		const adjustment = adjustments[e.key]
		const nodeRef = getNode()

		if (adjustment && enabled && nodeRef) {

			const key = adjustment[0]
			const amount = adjustment[1]

			const x = key === 'x' ? amount : 0
			const y = key === 'y' ? amount : 0
			const z = key === 'z' ? amount : 0

			const forwardVector = camera.getTarget().subtract(camera.position).normalize()
			const rightVector = BABYLON.Vector3.Cross(camera.upVector, forwardVector).normalize()
			const upVector = BABYLON.Vector3.Cross(forwardVector, rightVector).normalize()

			const upRotation = BABYLON.Quaternion.RotationAxis(upVector, x)
			const rightRotation = BABYLON.Quaternion.RotationAxis(rightVector, y)
			const forwardRotation = BABYLON.Quaternion.RotationAxis(forwardVector, z)
			const combinedRotation = forwardRotation.multiply(rightRotation).multiply(upRotation)

			const sourceQuat = getQuaternionFromObject( nodeRef )
			if (!destinationQuat) destinationQuat = sourceQuat.clone()

			const sourceEuler = sourceQuat.toEulerAngles()
			const newEuler = new BABYLON.Vector3( 
				roundToDihedral( sourceEuler.x ), 
				roundToDihedral( sourceEuler.y ), 
				roundToDihedral( sourceEuler.z ) 
			)

			destinationQuat = BABYLON.Quaternion.FromEulerAngles(newEuler.x, newEuler.y, newEuler.z)
			destinationQuat = combinedRotation.multiply(destinationQuat)

		}

	}


			// const sourceRot = new BB.Vector3()
			// sourceQuat.toEulerAnglesToRef( sourceRot )
			// const destRot = new BB.Vector3()
			// destQuat.toEulerAnglesToRef( destRot )

			// const animation = new BABYLON.Animation(
			// 	'rotationAnimation',
			// 	'rotationQuaternion',
			// 	fps,
			// 	BABYLON.Animation.ANIMATIONTYPE_QUATERNION,
			// 	BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
			// )

			// const keys = [
			// 	{
			// 		frame: 0,
			// 		value: sourceQuat.clone()
			// 	},
			// 	{
			// 		frame: fps * speed,
			// 		value: destQuat.clone()
			// 	}
			// ]

			// const easing = new BB.QuadraticEase()
			// easing.setEasingMode(BB.EasingFunction.EASINGMODE_EASEINOUT)
			// animation.setKeys(keys)
			// animation.setEasingFunction( easing )
			// nodeRef.animations = [ animation ]

			// if (animGroup) {
			// 	animGroup.stop()
			// 	animGroup.dispose()
			// } else {

			// }

			// animGroup = new BABYLON.AnimationGroup('rotationAnimationGroup')
			// animGroup.addTargetedAnimation(animation, nodeRef)
			// animGroup.play()

			// tween.easeInOutQuad( 0.06, sourceQuat.toObject(), destQuat.toObject(), v => {
			// 	// const quat = new BB.Quaternion( v.x, v.y, v.z, v.w )
			// 	// quat.toEulerAnglesToRef( nodeRef.rotation )

			// 	nodeRef.rotationQuaternion = new BB.Quaternion( v.x, v.y, v.z, v.w )
			// }, v => {
			// 	SAY(`🥭 ANIM`)
			// 	// const rot = Number( getWorldRotation( nodeRef ).z )
			// 	// nodeRef.rotation.z = 0.3333
			// 	// nodeRef.rotation.z -= mesh.rotation.z
			// })


</script>


<svelte:window on:keydown={onKeydown} />