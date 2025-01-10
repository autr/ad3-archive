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
	export let name = 'tube'
	export let points = []
	export let diameter = 0.02
	export let tessellation = 32
	export let radiusFunction = null
	export let cap =  0 // NO_CAP, CAP_START, CAP_END, CAP_ALL
	export let arc = 1

	function initMesh() {


		mesh = BB.MeshBuilder.CreateTube( name, {
			path: points,
			radius: diameter,
			tessellation,
			radiusFunction,
			cap,
			arc,
			updatable: true
		}, scene)

		mesh.shape = 'tube'
		mesh.position = new BB.Vector3(0,0,0)

		updateFromSettings()

	}

	function updateFromSettings() {
		if (!mesh || !points) return

	}

	$: updateFromSettings( points, diameter, tessellation, radiusFunction, cap, arc )

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