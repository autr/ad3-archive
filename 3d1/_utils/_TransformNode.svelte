<script>
	/* ====================================== */
	/*                                        */
	/*             TRANSFORM NODE             */
	/*                                        */
	/* ====================================== */

	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'

	// #include essential
	

	import AUI from '$aui'
	import * as Utils from '$3d_utils'
	import { CreateSolidColorMaterial } from '$3d_materials'
	
	const context = getContext('sketch')
	setContext( 'sketch', { ...context, getParent: () => node, getNode: () => node } )
	
	export let position = { x: 0, y: 0, z: 0 }
	export let rotation = { x: 0, y: 0, z: 0 }
	export let scaling = { x: 1, y: 1, z: 1 }

	export let autoRotateVector = new BB.Vector3( Math.random(), Math.random(), Math.random() )
	export let autoRotateSpeed = 0

	export let name = 'sphere'
	export let gui = false
	export let onPointer = null
	export let onInit = null
	export let node = null
	export let debug = context.getDebug()

	onMount( init )
	onDestroy( destroy )

	function init() {

		if (!browser) return
		const scene = context.getScene()

		node = new BB.TransformNode(name, scene)
		node.onPointer = onPointer
		// node.parent = context.getParent ? context.getParent() : null

		updatePositionAndRotation()

		window.requestAnimationFrame( tick )

		if (onInit) onInit( node )
		if (debug) SAY('🌏 inited transform node')
	}

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

	function updatePositionAndRotation() {
		if (!node) return
		node.position = new BB.Vector3(position.x, position.y, position.z)
		node.rotation = new BB.Vector3(rotation.x, rotation.y, rotation.z)
		node.scaling = new BB.Vector3(scaling?.x || scaling, scaling?.y || scaling, scaling?.z || scaling)
	}

	$: updatePositionAndRotation( position, rotation, scaling )

	function destroy() {
		if (node) {
			node.dispose()
			if (debug) SAY('🍄 removed node')
		}
	}

	let allScaling = 1

	function updateAllScaling() {
		if (!node) return
		node.scaling = new BB.Vector3(allScaling,allScaling,allScaling)
	}

	$: updateAllScaling( allScaling )
</script>

{#if gui}
	<span>Position</span>
	<Utils.Vector3 bind:value={position} />
	<span>Rotation</span>
	<Utils.Vector3 bind:value={rotation} />
	<span>Scaling</span>
	<Utils.Vector3 bind:value={scaling} />
	<AUI.Numbox bind:value={allScaling} set:step={0.001} />
	<span>Auto Rotate</span>
	<AUI.Slider bind:value={autoRotateSpeed} set:step={0.01} set:min={0} set:max={1} />
{/if}
{#if node}
	<slot />
{/if}