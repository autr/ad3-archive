<script>
	/* ====================================== */
	/*                                        */
	/*              XYZ INTERFACE             */
	/*                                        */
	/* ====================================== */

	import * as BB from 'babylonjs'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'
	// #include essential
	

	import * as Utils from '$3d_utils'
	import * as Meshes from '$3d_meshes'
	import * as Behaviours from '$3d_behaviours'


	import { tween, MapRange } from '$root'

	const context = getContext('sketch')
	setContext( 'sketch', { ...context, getParent: () => node, getNode: () => node } )

	const { BLUE, GREEN, YELLOW, RED, PURPLE, TURQ, PINK, ORANGE, COLORS } = context.getColors()
	
	// ============ DEFAULTS ============

	export let node = null
	export let name = 'xyz'
	export let material = null
	export let gui = true
	export let debug = context.getDebug()
	export let onInit = null


	// ============ PROPERTIES ============

	export let yCount = 3
	export let xCount = 3
	export let zCount = 3

	export let diameter = 0.1

	export let value = new BB.Vector3(0,0,1)
	export let position = new BB.Vector3(0,0,0)
	export let scaling = new BB.Vector3(0,0,0)
	// export let rotation = new BB.Vector3(0,0,0)
	export let speed = 0.01

	// ============ INIT ============

	onMount( init )
	onDestroy( destroy )

	function init() {
		if (!browser) return
		const canvas = context.getCanvas()

		// scene.onPointerObservable.add((info) => {
		// 	if (info.type == BB.PointerEventTypes.POINTERMOVE) onCanvasMove(info.event)
		// 	if (info.type == BB.PointerEventTypes.POINTERUP) onCanvasUp(info.event)
		// })

		// scene.onKeyboardObservable.add((info) => {
		// 	if (info.type == BB.KeyboardEventTypes.KEYDOWN) onKeyboardDown('ArrowDown')
		// 	if (info.type == BB.KeyboardEventTypes.KEYUP) onKeyboardDown('ArrowUp')
		// 	if (info.type == BB.KeyboardEventTypes.KEYLEFT) onKeyboardDown('ArrowLeft')
		// 	if (info.type == BB.KeyboardEventTypes.KEYRIGHT) onKeyboardDown('ArrowRight')
		// })

		document.addEventListener('keydown', e => onKeyboardDown(e.key))
		document.addEventListener('pointermove', e => onCanvasMove(e))
		document.addEventListener('pointerup', e => onCanvasUp(e))
		document.addEventListener('pointerdown', e => onCanvasDown(e))

		if (onInit) onInit( mesh )
		if (debug) SAY('🧭 inited XYZ interface')
	}


	function destroy() {
		if (node) {
			if (debug) SAY('🧭 removed XYZ interface')
			node.dispose()
		}
	}

	// ============ SPHERES ============

	$: spheres = (()=>{

		let out = []
		const xSpacing = 1 / (xCount-1)
		const ySpacing = 1 / (yCount-1)
		const zSpacing = 1 / (zCount-1)

		for (let x = 0; x < yCount; x++ ) {
			for (let y = 0; y < xCount; y++ ) {
				for (let z = 0; z < zCount; z++) {

					out = [ ...out, {
						x,y,z,
						position: new BB.Vector3(
							(x * xSpacing) - (((xCount-1) * xSpacing)/2),
							(y * ySpacing) - (((yCount-1) * ySpacing)/2),
							(z * zSpacing) - (((zCount-1) * zSpacing)/2)
						)
					}]
				}
			}
		}

		return out 
	})( xCount, yCount, zCount )

	let meshes = []
	let hoveredSphere = null

	function onCanvasMove(e) {
		if (isDragging) {
			const distance = BB.Vector2.Distance( new BB.Vector2( e.clientX, e.clientY ), new BB.Vector2( ...isDragging ) )
			if (distance > 4) return hoveredSphere = null
		}
		hoveredSphere = context.findClosestMeshByEvent(e, meshes, 0.5)	
	}


	let currentTween, isDragging

	function onCanvasUp(e) {
		isDragging = false
		if (!hoveredSphere) return
		if (currentTween) currentTween.cancel()
		value.mesh = hoveredSphere
		SAY('CANVAS UP')
		animate()
	}
	
	function onCanvasDown(e) {
		isDragging = [ e.clientX, e.clientY ]
	}
	
	function projectToScreen(mesh) {

		const scene = context.getScene()
		const engine = context.getEngine()
		const width = engine.getRenderWidth()
		const height = engine.getRenderHeight()
		const camera = context.getCamera()
		const position = mesh.getAbsolutePosition()

		const point = BB.Vector3.Project(
			position,
			BB.Matrix.Identity(),
			scene.getTransformMatrix(),
			{ x: 0, y: 0, width, height }
		)
		return point
	}

	const keyAngles = { 'ArrowUp': 270, 'ArrowDown': 90, 'ArrowLeft': 180, 'ArrowRight': 0 }

	function findClosestKeyboard(type) {

		if (!value.mesh) {
			value.mesh = meshes.find(mesh => {
				return mesh.position.x === value.x && mesh.position.y === value.y && mesh.position.z === value.z
			})
		}

		const balance = 1
		const cursor = projectToScreen( value.mesh )

		let maxDistance = 0
		let minDiff = Infinity
		let closestMesh = null

		function getDistanceAndAngle( mesh ) {
			const point = projectToScreen( mesh )
			const distance = Math.sqrt(Math.pow(point.x - cursor.x, 2) + Math.pow(point.y - cursor.y, 2))
			let angle = Math.atan2(point.y - cursor.y, point.x - cursor.x) * 180 / Math.PI
			angle = (angle - keyAngles[type] + 360) % 360
			angle = angle > 180 ? 360 - angle : angle // Ensure angle is within [-180, 180] range
			const angleDiff = Math.abs(angle)
			return { distance, angle, angleDiff }
		}

		for (const mesh of meshes) {
			const { distance } = getDistanceAndAngle( mesh )
			if (distance > maxDistance) maxDistance = distance
		}

		for (const mesh of meshes) {
			if (mesh !== value.mesh) {

				const { distance, angle, angleDiff } = getDistanceAndAngle( mesh )

				let distanceScaled = distance / maxDistance 
				const combinedDiff = distance + angleDiff
				if (combinedDiff < minDiff) {
					minDiff = combinedDiff
					closestMesh = mesh
				}
			}
		}

		return closestMesh
	}


	function onKeyboardDown( type ) {
		if (Object.keys(keyAngles).indexOf(type) == -1) return
		value.mesh = hoveredSphere = findClosestKeyboard( type )
		animate()
	}

	export let isAnimating = false
	function animate() {

		isAnimating = true
		const values = Object.values(value.mesh.data)

		if (value.mesh.data.x == 0 && value.mesh.data.y == 0 && value.mesh.data.z == 0) {
			SAY(`🪼 CHANGE`, values.join(', '))
		} else {

			SAY(`🪼 ANIMATE`, values.join(', '))
			currentTween = tween.easeInOutQuad( 0.06, value.clone(), hoveredSphere.position.clone(), v => {
				value.x = v.x
				value.y = v.y 
				value.z = v.z
			}, v => {
				SAY(`🦀 animate finish`)
				isAnimating = false
			})
		}
	}

	function getCorners( x, y, z ) {
		return [
			x == 0 || x == xCount - 1,
			y == 0 || y == yCount - 1,
			z == 0 || z == zCount - 1,
		].filter( b => b ).length > 2

	}

</script>

<!-- {#if gui}
{/if} -->

{#if node}
	<slot />
{/if}

<svelte:window on:pointerup={onCanvasUp} />

<Utils.TransformNode
	{scaling}
	{position}
	name={`spheresNode`}
	bind:node={node}>
	<Behaviours.TransformBehaviour rotationSpeed={0.6} />
	<Meshes.Box
		size={1} />
	{#each spheres as {position,x,y,z},idx}
		<Meshes.Sphere
			name={`sphere${idx}_x${x}y${y}z${z}`}
			bind:mesh={meshes[idx]}
			material={idx === hoveredSphere?.data?.idx ? YELLOW : getCorners(x,y,z) ? TURQ : BLUE }
			diameter={ idx === hoveredSphere?.data?.idx ? 0.16 : getCorners(x,y,z) ? 0.12 : 0.06 }
			data={{x,y,z,idx}}
			{position}>
		</Meshes.Sphere>
	{/each}

	{#if hoveredSphere?.position}
		<Meshes.CylinderFromPoints
			pointA={hoveredSphere.position}
			pointB={value}
			material={YELLOW} />
	{/if}

	<Meshes.Sphere
		diameter={0.16}
		position={value} />

</Utils.TransformNode>
