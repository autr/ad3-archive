<script>
	/* ====================================== */
	/*                                        */
	/*             MESH SPHERE                */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	// #define MESH
	// #define AUI
	
	
	import { CreateSolidColorMaterial } from '$3d1_materials'
	
	const defaultMaterial = CreateSolidColorMaterial()
	export let name = 'sphere'
	export let position = { x: 0, y: 0, z: 0 }
	export let diameter = 0.1
	export let tessellation = 8

	function initMesh() {

		position = new BB.Vector3( position.x, position.y, position.z )
		mesh = BB.MeshBuilder.CreateSphere( name, {
			diameter,
			tessellation,
			updatable: true
		}, scene)
		mesh.originalTessellation = tessellation
		mesh.originalDiameter = diameter
		mesh.shape = 'sphere'
		updatePositionAndDiameter()
	}

	function updatePositionAndDiameter() {
		if (!mesh) return
		const vecPosition = new BB.Vector3(position.x, position.y, position.z)
		mesh.position = vecPosition
		const neuDiameter = diameter / mesh.originalDiameter
		mesh.scaling = new BB.Vector3(neuDiameter, neuDiameter, neuDiameter)
	}

	function updateTessellation( tessellation ) {
		if (!mesh) return
		if (mesh.originalTessellation !== tessellation) init()
	}

	$: updateTessellation( tessellation )
	$: updatePositionAndDiameter( position, diameter )

</script>

{#if gui}
	<h3>Sphere</h3>
	<span>Position</span>
	<Utils.Vector3 bind:value={position} />
	<span>Diameter</span>
	<AUI bind:value={diameter} set:step={0.01} />
	<span>Tessellation</span>
	<AUI bind:value={tessellation} />
{/if}
{#if mesh}
	<slot />
{/if}