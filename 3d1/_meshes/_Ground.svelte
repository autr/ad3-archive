<script>
	/* ====================================== */
	/*                                        */
	/*                 GROUND                 */
	/*                                        */
	/* ====================================== */

	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'
	// #include essential
	

	// ================================== TODO, 3D DEFAULTS!

	import * as BB from 'babylonjs'
	import AUI from '$aui'
	import * as Utils from '$3d_utils'
	import { CreateSolidColorMaterial, CreateGridMaterial } from '$3d_materials'

	const context = getContext('sketch')
	
	export let name = 'ground'
	export let gui = true
	export let onInit = null
	export let debug = context.getDebug()
	
	onMount( init )
	onDestroy( destroy )

	setContext( 'sketch', { ...context, getParent: () => mesh, getMesh: () => mesh } )

	// ================================== TODO, MESH DEFAULTS!

	export let mesh = null
	export let material = null
	export let updatable = true
	export let properties = {}
	export let onPointer = null
	export let position = { x: 0, y: 0, z: 0 }

	// ================================== ACTUAL UNIQUE CODE

	export let width = 1
	export let height = 1
	export let subdivisions = 1


	function init() {

		if (!browser) return
		const scene = context.getScene()

		destroy()

		position = new BB.Vector3( position.x, position.y, position.z )

		mesh = BB.MeshBuilder.CreateGround( name, {
			width,
			height,
			subdivisions,
			updatable
		}, scene)

		mesh.originalWidth = width
		mesh.originalHeight = height
		mesh.originalSubdivisions = subdivisions
		mesh.shape = 'box'
		mesh.onPointer = onPointer
		mesh.isPickable = false
		mesh.parent = context.getParent ? context.getParent() : null

		updateMaterial()
		updatePositionAndDimensions()
		
		if (onInit) onInit( mesh )
		if (debug) SAY('🌍 ✅ inited ground')
	}

	function updateMaterial() {
		if (!mesh) return
		mesh.material = material || CreateGridMaterial()
	}

	$: updateMaterial( material )

	function updatePositionAndDimensions() {
		if (!mesh) return
		mesh.position = new BB.Vector3(position?.x || 0, position?.y || 0, position?.z || 0)
		const neuWidth = width / mesh.originalWidth
		const neuHeight = height / mesh.originalHeight
		mesh.scaling = new BB.Vector3(neuWidth, 1, neuHeight)
	}

	function updateProperties() {

		for (const [key,value] of Object.entries(properties)) {
			if (debug) SAY('🌍 setting ground property', key, value)
			mesh[key] = value
		}

	}

	$: updateProperties( properties )
	$: updatePositionAndDimensions( position, width, height )

	function destroy() {
		if (mesh) {
			if (mesh.physicsImpostor) mesh.physicsImpostor.dispose()
			mesh.dispose()
			if (debug) SAY('🌍 removed ground')
		}
	}

</script>

{#if gui}
	<span>Position</span>
	<Vector3 bind:value={position} />
	<span>Width</span>
	<AUI bind:value={width} set:step={0.1} />
	<span>Height</span>
	<AUI bind:value={height} set:step={0.1} />
	<span>Subdivisions</span>
	<AUI bind:value={subdivisions} />
{/if}
<slot />
