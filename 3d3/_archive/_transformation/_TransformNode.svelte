<script>
	/* ====================================== */
	/*                                        */
	/*             TRANSFORM NODE             */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	import AUI from '$aui'

	import { VectorGUI } from '$3d1_debug'
	import { CreateSolidColorMaterial } from '$3d1_materials'
	
	const context = getContext('sketch')
	setContext( 'sketch', { ...context, getParent: () => node, getNode: () => node } )


	export let position = {}
	export let rotation = {}
	export let scaling = {}
	export let rotationQuaternion = {}

	export let autoRotateVector = new BB.Vector3( Math.random(), Math.random(), Math.random() )
	export let autoRotateSpeed = 0

	export let name = 'sphere'
	export let gui = false
	export let onPointer = null
	export let onInit = null
	export let node = null
	export let debug = context.getDebug()
	export let parent = null

	onMount( init )
	onDestroy( destroy )

	let ref = {}

	function init() {

		if (!browser) return
		const scene = context.getScene()

		node = new BB.TransformNode(name, scene)
		node.onPointer = onPointer

		updatePRS()
		node.parent = parent ? parent : null

		window.requestAnimationFrame( tick )

		if (onInit) onInit( node )
		if (debug) SAY('🌏 inited transform node')
	}

	function updatePRS() {
		if (!node) return
		node.position.x = position.x || 0
		node.position.y = position.y || 0
		node.position.z = position.z || 0

		node.rotation.x = rotation.x || 0
		node.rotation.y = rotation.y || 0
		node.rotation.z = rotation.z || 0

		node.scaling.x = scaling.x || scaling || 1
		node.scaling.y = scaling.y || scaling || 1
		node.scaling.z = scaling.z || scaling || 1

		ref.position = position = node.position
		ref.rotation = rotation = node.rotation
		ref.scaling = scaling = node.scaling

	}

	$: updatePRS( position, rotation, scaling )

	function tick() {
		if (autoRotateSpeed > 0) {

			node.addRotation(
				autoRotateVector.x * autoRotateSpeed * 0.01,
				autoRotateVector.y * autoRotateSpeed * 0.01,
				autoRotateVector.z * autoRotateSpeed * 0.01
			)
		}
		window.requestAnimationFrame( tick )
	}

	function destroy() {
		if (node) {
			node.dispose()
			if (debug) SAY('🍄 removed node')
		}
	}


	$: (() => {
		if (!node?.rotation) return
		// console.log('ROTATION UPDATED', node?.name, node?.rotation, node.rotation === ref.rotation )
	})( node?.rotation )
	$: (() => {
		if (!node?.rotationQuaternion) return
		// console.log('QUATERNION UPDATED', node?.name, node?.rotationQuaternion)
	})( node?.rotationQuaternion )
</script>

{#if gui}
	<h3>Transform</h3>
	{#if node}
		<span>Rotation</span>
		<VectorGUI bind:value={node.rotation} />
		{node.rotation.x}
		<!-- <span>Quaternion</span>
		<VectorGUI bind:value={node.rotationQuaternion} /> -->
		<span>Position</span>
		<VectorGUI bind:value={node.position} />
		<span>Scaling</span>
		<VectorGUI bind:value={node.scaling} />
	{/if}
	<span>Auto Rotate</span>
	<AUI.Slider bind:value={autoRotateSpeed} set:step={0.01} set:min={0} set:max={1} />
{/if}
{#if node}
	<slot />
{/if}