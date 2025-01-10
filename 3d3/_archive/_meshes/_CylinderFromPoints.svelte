<script>

	/* ====================================== */
	/*                                        */
	/*          CYLINDER FROM POINTS          */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	// #define MESH
	// #define AUI

	import { CreateSolidColorMaterial } from '$3d1_materials'
	

	const defaultMaterial = CreateSolidColorMaterial()
	export let name = 'cylinder'
	export let pointA = { x: -1, y: 0, z: 0}
	export let pointB = { x: 1, y: 0, z: 0}
	export let diameter = 0.02
	export let tessellation = 8

	function initMesh() {

		pointA = new BB.Vector3( pointA.x, pointA.y, pointA.z )
		pointB = new BB.Vector3( pointB.x, pointB.y, pointB.z )

		const height = BB.Vector3.Distance(pointA, pointB)
		if (!height) SAY(`❌ initial height is zero (will cause problems)`, height)

		mesh = BB.MeshBuilder.CreateCylinder( name, {
			height,
			diameter,
			tessellation,
			updatable: true
		}, scene)

		mesh.originalHeight = height
		mesh.originalDiameter = diameter
		mesh.originalTesselation = tessellation
		mesh.shape = 'cylinder'
		mesh.position = new BB.Vector3(0,0,0)

		updateFromPoints()

	}

	function updateFromPoints() {
		if (!mesh || !pointA || !pointB) return

		const vecPointA = new BB.Vector3(pointA.x, pointA.y, pointA.z)
		const vecPointB = new BB.Vector3(pointB.x, pointB.y, pointB.z)

		const direction = vecPointB.subtract(vecPointA).normalize()
		const rotationAxis = BB.Vector3.Cross(BB.Axis.Y, direction)
		const angle = Math.acos(BB.Vector3.Dot(BB.Axis.Y, direction))

		const newHeight = BB.Vector3.Distance(vecPointA, vecPointB)
		mesh.position = vecPointA.add(vecPointB).scale(0.5)
		mesh.rotationQuaternion = BB.Quaternion.RotationAxis(rotationAxis, angle)
		mesh.scaling.y = newHeight / mesh.originalHeight
	}

	function updateDiameter() {
		if (!mesh) return
		const neuDiameter = diameter / mesh.originalDiameter
		mesh.scaling.z = neuDiameter
		mesh.scaling.x = neuDiameter
	}

	function updateTesselation() {
		if (!mesh) return
		if (mesh.originalTesselation !== tessellation) init()
	}

	$: updateFromPoints( pointA, pointB )
	$: updateDiameter( diameter )
	$: updateTesselation( tessellation )

</script>

{#if gui}
	<h3>Cylinder</h3>
	<span>Diameter</span>
	<AUI bind:value={diameter} set:step={0.01} />
	<span>Tesselation</span>
	<AUI bind:value={tessellation} set:step={1} />
	<span>Point A</span>
	<Utils.Vector3 bind:value={pointA} />
	<span>Point B</span>
	<Utils.Vector3 bind:value={pointB} />
{/if}
{#if mesh}
	<slot />
{/if}