<script>
	/* ====================================== */
	/*                                        */
	/*              MESH GROUND               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	// #define MESH
	// #define AUI

	import { CreateGridMaterial } from '$3d1_materials'
	import { VectorGUI } from '$3d1_debug'

	const defaultMaterial = CreateGridMaterial()
	export let name = 'ground'
	export let width = 1
	export let height = 1
	export let subdivisions = 1
	export let position = { x: 0, y: 0, z: 0 }
	export let rotation = { x: 0, y: 0, z: 0 }

	function initMesh() {

		position = new BB.Vector3( position.x, position.y, position.z )
		mesh = BB.MeshBuilder.CreateGround( name, {
			width,
			height,
			subdivisions,
			updatable: true
		}, scene)

		mesh.originalWidth = width
		mesh.originalHeight = height
		mesh.originalSubdivisions = subdivisions
		mesh.shape = 'box'
		mesh.isPickable = isPickable
		mesh.parent = context.getParent ? context.getParent() : null

		updatePositionAndDimensions()
	}

	function updatePositionAndDimensions() {
		if (!mesh) return
		mesh.position = new BB.Vector3(position?.x || 0, position?.y || 0, position?.z || 0)
		mesh.rotation = new BB.Vector3(rotation?.x || 0, rotation?.y || 0, rotation?.z || 0)

		const neuWidth = width / mesh.originalWidth
		const neuHeight = height / mesh.originalHeight
		mesh.scaling = new BB.Vector3(neuWidth, 1, neuHeight)
	}

	$: updatePositionAndDimensions( position, width, height )

</script>

{#if gui}
	<h3>Ground</h3>
	<span>Position</span>
	<VectorGUI bind:value={position} />
	<span>Width</span>
	<AUI bind:value={width} set:step={0.1} />
	<span>Height</span>
	<AUI bind:value={height} set:step={0.1} />
	<span>Subdivisions</span>
	<AUI bind:value={subdivisions} />
{/if}
<slot />
