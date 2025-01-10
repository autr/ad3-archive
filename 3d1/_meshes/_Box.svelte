<script>
	/* ====================================== */
	/*                                        */
	/*                    BOX                 */
	/*                                        */
	/* ====================================== */

	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'

	// #include essential
	

	import AUI from '$aui'
	import * as Utils from '$3d_utils'
	import { CreateSolidColorMaterial, CreateGridMaterial } from '$3d_materials'

	const context = getContext('sketch')
	setContext( 'sketch', { ...context, getParent: () => mesh, getMesh: () => mesh } )

	export let position = { x: 0, y: 0, z: 0 }
	export let mesh = null
	export let name = 'sphere' // this is a comment
	export let material = null /** @slider { min: 0, max: 1, step: 0.00002, hello: 'world' } */
	export let updatable = true
	export let properties = {}
	export let gui = false
	export let onPointer = null /** this is another comment */
	export let onInit = null
	export let debug = context.getDebug()
	export let data = {}

	export let size = 2
	export let width = undefined
	export let height = undefined
	export let depth = undefined

	onMount( init )
	onDestroy( destroy )

	let label

	function getDimensions() {
		return {
			x: width == undefined ? size : width,
			y: height == undefined ? size : height,
			z: depth == undefined ? size : depth
		}
	}

	function init() {

		if (!browser) return
		const scene = context.getScene()

		destroy()

		position = new BB.Vector3( position.x, position.y, position.z )

		const dimensions = getDimensions()

		mesh = BB.MeshBuilder.CreateBox( name, {
			width: dimensions.x,
			height: dimensions.y,
			depth: dimensions.z
		}, scene)

		mesh.originalDimensions = { ...dimensions }
		mesh.shape = 'box'
		mesh.onPointer = onPointer
		mesh.parent = context.getParent ? context.getParent() : null

		updateData()
		updateMaterial()
		updatePositionAndDiameter()

		if (onInit) onInit( mesh )
		if (debug) SAY('🌏 ✅ inited sphere')
	}

	function updateMaterial() {
		if (!mesh) return
		const scene = context.getScene()
		mesh.material = material || CreateGridMaterial( 0.5, new BB.Color4(0,0,0,0), null, scene )
	}

	$: updateMaterial( material )

	let hasUpdated = false
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
		hasUpdated = true
	}


	function updateProperties() {

		for (const [key,value] of Object.entries(properties)) {
			if (debug) SAY('🌏 setting sphere property', key, value)
			mesh[key] = value
		}

	}

	function updateData() {
		if (!mesh) return
		mesh.data = data
	}

	$: updateData( data )
	$: updateProperties( properties )
	$: updatePositionAndDiameter( position, width, height, depth, size )

	function destroy() {
		if (mesh) {
			if (debug) SAY('🌏 removed sphere')
			mesh.dispose()
		}
	}

</script>

{#if gui}
	<span>Position</span>
	<Utils.Vector3 bind:value={position} />
{/if}
{#if mesh}
	<slot />
{/if}
