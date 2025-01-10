<script>
	/* ====================================== */
	/*                                        */
	/*                MESH BOX                */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	// #define MESH
	// #define AUI

	
	import { CreateGridMaterial } from '$3d1_materials'

	const defaultMaterial = CreateGridMaterial( 0.5, new BB.Color4(0,0,0,0), null )

	export let name = 'box'
	export let position = { x: 0, y: 0, z: 0 }
	export let size = 2
	export let width = undefined
	export let height = undefined
	export let depth = undefined

	function getDimensions() {
		return {
			x: width == undefined ? size : width,
			y: height == undefined ? size : height,
			z: depth == undefined ? size : depth
		}
	}

	function initMesh() {

		position = new BB.Vector3( position.x, position.y, position.z )
		const dimensions = getDimensions()
		mesh = BB.MeshBuilder.CreateBox( name, {
			width: dimensions.x,
			height: dimensions.y,
			depth: dimensions.z
		}, scene)

		mesh.originalDimensions = { ...dimensions }
		mesh.shape = 'box'
		mesh.parent = context.getParent ? context.getParent() : null

		updatePositionAndDiameter()
	}

	function updatePositionAndDiameter() {
		if (!mesh) return
		const vecPosition = new BB.Vector3(position.x, position.y, position.z)
		mesh.position = vecPosition
		const dimensions = getDimensions()
		mesh.scaling = new BB.Vector3(
			dimensions.x / mesh.originalDimensions.x,
			dimensions.y / mesh.originalDimensions.y,
			dimensions.z / mesh.originalDimensions.z
		)
	}

	$: updatePositionAndDiameter( position, width, height, depth, size )

</script>

{#if gui}
	<span>Position</span>
	<Utils.Vector3 bind:value={position} />
{/if}
{#if mesh}
	<slot />
{/if}
