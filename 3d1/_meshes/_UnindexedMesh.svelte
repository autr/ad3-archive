<script>
	/* ====================================== */
	/*                                        */
	/*             UNINDEXED MESH             */
	/*                                        */
	/* ====================================== */

	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'
	import { CreateSolidColorMaterial } from '$3d_materials'
	import { AddNormalsLines } from './lib.utils.js'

	// #include essential
	

	const context = getContext('sketch')
	setContext( 'sketch', { ...context, getParent: () => mesh, getMesh: () => mesh } )

	const COLORS = context.getColors()
	export let scaling = new BB.Vector3( 1, 1, 1 )
	export let mesh = null
	export let vertices = []
	export let name = 'unindexedMesh'
	export let material = null
	export let gui = true
	export let onPointer = null
	export let onInit = null
	export let debug = context.getDebug()
	export let properties = {}
	export let visible = true

	onMount( init )
	onDestroy( destroy )

	function init() {

		if (!browser) return
		const scene = context.getScene()

		destroy()

		mesh = new BB.Mesh( name, scene )
		mesh._unIndexed = true
		mesh.isVisible = true
		mesh.onPointer = onPointer
		mesh.parent = context.getParent ? context.getParent() : null
		mesh.visibility = 0

		updateMaterial()
		updateProperties()
		updateVertices()
		updateScaling()

		if (onInit) onInit( mesh )
		if (debug) SAY('🩻 ✅ inited unindexed mesh')
	}

	function updateScaling() {
		if (!mesh) return
		mesh.scaling = new BB.Vector3( scaling.x, scaling.y, scaling.z )
	}

	function updateMaterial() {
		if (!mesh) return
		mesh.material = material || CreateSolidColorMaterial( scene, 1, 0, 0, 0)
		mesh.visibility = material?.emissiveColor?.a !== undefined ? material?.emissiveColor?.a : 1 // TODO!!!!
	}


	function updateVertices() {
		if (!mesh) return
		const vertexCount = mesh?.geometry ? mesh.geometry.getVerticesData(BABYLON.VertexBuffer.PositionKind).length : null
		if (vertexCount !== vertices.length) {
			const scene = context.getScene()
			const vertexData = new BB.VertexData()
			let indices = []
			let normals = []
			BB.VertexData.ComputeNormals( vertices, indices, normals )
			vertexData.positions = vertices
			vertexData.indices = indices
			vertexData.normals = normals
			vertexData.applyToMesh( mesh, true )
			mesh.computeWorldMatrix(true)
			mesh.createNormals(true)
			AddNormalsLines( scene, mesh, 3 )
			if (debug) SAY('🩻 resetting vertices')
		} else {
			mesh.updateVerticesData(BB.VertexBuffer.PositionKind, vertices, true)
			if (debug) SAY('🩻 updating vertices')
		}

	}

	function updateProperties() {
		if (!mesh) return
		for (const [key,value] of Object.entries(properties)) {
			if (debug) SAY('🩻 setting unindexed mesh property', key, value)
			mesh[key] = value
		}

	}

	$: updateScaling( scaling )
	$: updateMaterial( material )
	$: updateVertices( vertices )
	$: updateProperties( properties )

	function destroy() {
		if (mesh) {
			if (debug) SAY('🩻 removed custom mesh')
			mesh.dispose()
		}
	}

</script>