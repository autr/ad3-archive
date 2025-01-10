<script>

	/* ====================================== */
	/*                                        */
	/*          CYLINDER FROM POINTS          */
	/*                                        */
	/* ====================================== */


	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'

	// #include essential
	

	import { CreateSolidColorMaterial } from '$3d_materials'
	import * as Utils from '$3d_utils'

	import AUI from '$aui'

	const context = getContext('sketch')
	setContext( 'sketch', { ...context, getParent: () => mesh, getMesh: () => mesh } )


	// #include svelte
	// #include 3d
	// #include meshes
	
	export let pointA = { x: -1, y: 0, z: 0}
	export let pointB = { x: 1, y: 0, z: 0}
	export let diameter = 0.02
	export let tessellation = 8

	export let name = 'cylinder'

	export let wireframe = false
	export let mesh = null
	export let material = null
	export let updatable = true
	export let gui = false
	export let debug = context.getDebug()
	export let data = {}
	export let onInit = null
	export let onPointer = null


	onMount( init )
	onDestroy( destroy )

	let internal = {}

	function init() {

		if (!browser) return
		const scene = context.getScene()

		destroy()

		pointA = new BB.Vector3( pointA.x, pointA.y, pointA.z )
		pointB = new BB.Vector3( pointB.x, pointB.y, pointB.z )

		const height = BB.Vector3.Distance(pointA, pointB)

		if (!height) SAY(`❌ initial height is zero (will cause problems)`, height)

		mesh = BB.MeshBuilder.CreateCylinder( name, {
			height,
			diameter,
			tessellation,
			updatable
		}, scene)


		mesh.originalHeight = height
		mesh.originalDiameter = diameter
		mesh.originalTesselation = tessellation
		mesh.shape = 'cylinder'
		mesh.onPointer = onPointer
		mesh.position = new BB.Vector3(0,0,0)
		mesh.parent = context.getParent ? context.getParent() : null

		const bright = 1

		updateData()
		updateMaterial()
		updateFromPoints()
		
		if (onInit) onInit( mesh )
		if (debug) SAY('🥖 ✅ inited cylinder from points')

	}

	function updateMaterial() {
		if (!mesh) return
		mesh.material = material || CreateSolidColorMaterial()
	}

	$: updateMaterial( material )

	let hasUpdated = false

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

		hasUpdated = true
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

	function updateData() {
		if (!mesh) return
		mesh.data = data
	}
	$: updateData( data )
	$: updateFromPoints( pointA, pointB )
	$: updateDiameter( diameter )
	$: updateTesselation( tessellation )

	function destroy() {
		if (mesh) mesh.dispose()
		if (debug) SAY('🥖 removed cylinder from points')
	}


</script>

{#if gui}
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