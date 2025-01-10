<script>
	/* ====================================== */
	/*                                        */
	/*                 SPHERE                 */
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
	setContext( 'sketch', { ...context, getParent: () => mesh, getMesh: () => mesh } )
	
	export let position = { x: 0, y: 0, z: 0 }
	export let diameter = 0.1
	export let tessellation = 8
	export let mesh = null
	export let name = 'sphere'
	export let material = null
	export let updatable = true
	export let properties = {}
	export let gui = false
	export let onPointer = null
	export let onInit = null
	export let debug = context.getDebug()
	export let data = {}
	export let tags = ''

	onMount( init )
	onDestroy( destroy )

	let label

	function init() {

		if (!browser) return
		const scene = context.getScene()

		destroy()

		position = new BB.Vector3( position.x, position.y, position.z )

		mesh = BB.MeshBuilder.CreateSphere( name, {
			diameter,
			tessellation,
			updatable
		}, scene)

		mesh.originalTessellation = tessellation
		mesh.originalDiameter = diameter
		mesh.shape = 'sphere'
		mesh.onPointer = onPointer
		mesh.parent = context.getParent ? context.getParent() : null

		updateData()
		updateMaterial()
		updatePositionAndDiameter()

		BB.Tags.EnableFor( mesh )
		mesh.addTags(tags)
		window.mesh = mesh

		if (onInit) onInit( mesh )
		if (debug) SAY('🌏 inited sphere')
	}

	function updateMaterial() {
		if (!mesh) return
		const scene = context.getScene()
		mesh.material = Array.isArray( material ) || !material ? CreateSolidColorMaterial( scene, ...(material || []) ) : material
	}

	$: updateMaterial( material )

	let hasUpdated = false
	function updatePositionAndDiameter() {
		if (!mesh) return
		// if (hasUpdated) return 
		const vecPosition = new BB.Vector3(position.x, position.y, position.z)
		mesh.position = vecPosition
		const neuDiameter = diameter / mesh.originalDiameter
		mesh.scaling = new BB.Vector3(neuDiameter, neuDiameter, neuDiameter)
		// console.log('UPDATE SPHERE')
		hasUpdated = true
	}

	function updateTessellation( tessellation ) {
		if (!mesh) return
		if (mesh.originalTessellation !== tessellation) init()
	}

	function updateProperties() {

		for (const [key,value] of Object.entries(properties)) {
			if (debug) SAY('🪐 setting sphere property', key, value)
			mesh[key] = value
		}

	}

	function updateData() {
		if (!mesh) return
		mesh.data = data
	}

	$: updateData( data )
	$: updateProperties( properties )
	$: updateTessellation( tessellation )
	$: updatePositionAndDiameter( position, diameter )

	function destroy() {
		if (mesh) {
			if (debug) SAY('🪐 removed sphere')
			mesh.dispose()
		}
	}

</script>

{#if gui}
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