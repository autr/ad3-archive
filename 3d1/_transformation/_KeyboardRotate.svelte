<script>
  import Engine from '$3d2/_engine/_Engine.svelte';
  import Scene from '$3d2/_scene/_Scene.svelte';

	// #define BASIC
	// #define BABYLON
	// #define INTERACTION
	
	import { tween, MapRange } from '$root'

	$: dihedral = 4
	$: adjustments = {
		a: [ 'x', (2 * Math.PI) / dihedral],
		d: [ 'x', (2 * Math.PI) / -dihedral],
		w: [ 'y', (2 * Math.PI) / dihedral],
		s: [ 'y', (2 * Math.PI) / -dihedral],
		q: [ 'z', (2 * Math.PI) / dihedral],
		e: [ 'z', (2 * Math.PI) / -dihedral]
	}

	let destQuat = null

	function init() {

	}

	function destroy() {

	}

	function onKeydown(e) {

		const type = e.type
		const adjustment = adjustments[e.key]
		const nodeRef = getNode()

		if (adjustment && enabled && nodeRef) {

			const key = adjustment[0]
			const amount = adjustment[1]

			const forwardVector = camera.getTarget().subtract(camera.position).normalize()
			const rightVector = BABYLON.Vector3.Cross(camera.upVector, forwardVector).normalize()
			const upVector = BABYLON.Vector3.Cross(forwardVector, rightVector).normalize()

			const x = key === 'x' ? amount : 0
			const y = key === 'y' ? amount : 0
			const z = key === 'z' ? amount : 0

			const upRotation = BABYLON.Quaternion.RotationAxis(upVector, -x)
			const rightRotation = BABYLON.Quaternion.RotationAxis(rightVector, -y)
			const forwardRotation = BABYLON.Quaternion.RotationAxis(forwardVector, -z)

			const combinedRotation = forwardRotation.multiply(rightRotation).multiply(upRotation)


			// QUATERNION 

			let sourceQuat = nodeRef.rotationQuaternion ? nodeRef.rotationQuaternion.clone() : BB.Quaternion.FromEulerAngles( nodeRef.rotation.x, nodeRef.rotation.y, nodeRef.rotation.z )

			if (sourceQuat.x !== destQuat?.x || sourceQuat.y !== destQuat?.y || sourceQuat.z !== destQuat?.z || sourceQuat.w !== destQuat?.w ) {
				if (destQuat) sourceQuat = destQuat.clone()
			}

			destQuat = combinedRotation.multiply(sourceQuat)

			// nodeRefRef.rotationQuaternion = BB.Quaternion.Slerp(sourceQuat, destQuat, 0.9)
			// nodeRefRef.rotationQuaternion = destQuat

			// ROTATION

			// const ref = nodeRef.rotation.clone()
			// destQuat.toEulerAnglesToRef( ref )

			const animation = new BABYLON.Animation(
				'rotationAnimation',
				'rotationQuaternion',
				fps,
				BABYLON.Animation.ANIMATIONTYPE_QUATERNION,
				BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
			)

			const keys = [
				{
					frame: 0,
					value: sourceQuat.clone()
				},
				{
					frame: fps * speed,
					value: destQuat.clone()
				}
			]

			animation.setKeys(keys)
			animation.setEasingFunction(BB.EasingFunction.EaseInOutCubic())
			
			nodeRef.animations = [animation]

			const animationGroup = new BABYLON.AnimationGroup('rotationAnimationGroup')
			animationGroup.addTargetedAnimation(animation, nodeRef)
			animationGroup.play()


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
		}

	}

</script>


<svelte:window on:keydown={onKeydown} />