<script>
	/* ====================================== */
	/*                                        */
	/*       WYTHOFF POLYHEDRA GENERATOR      */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	
	import { Names } from '$3d2_views'

	// #define BABYLON
	
	import { VectorGUI } from '$3d1_debug'
	import AUI from '$aui'

	import Wythoff from './lib.wythoff.js'
	import { postprocessWythoff } from './lib.postprocess.js'
	import { findMeshByKeyboard, findPresetBySchwarzFormula } from './lib.navigation.js'

	import { tween, MapRange } from '$root'

	import Box from '$3d1_meshes/_Box.svelte'
	import Sphere from '$3d1_meshes/_Sphere.svelte'
	import CylinderFromPoints from '$3d1_meshes/_CylinderFromPoints.svelte'
	import Arc from '$root/svg/_Arc.svelte'
	import { TransformNode } from '$3d1_transformation'
	import { PointerRotateable, PointerMoveable } from '$3d1_transformation'


	const context = getContext('sketch')
	const COLORS = context.getColors()
	setContext( 'sketch', { ...context, getParent: () => node, getNode: () => node } )

	// ============ GENERIC ============

	export let node = null
	export let name = 'wythoff'
	export let debug = context.getDebug()
	export let gui = true

	// ============ ALGORITHM ============

	export let wythoff = null
	export let triangle = new BB.Vector3( 1, 1, 1 ) // can be a number or a Vector3
	export let generator = 3 // 
	export let explode = 0

	export let snub = false
	export let stellate = 0

	// ============ PROPERTIES ============

	export let yCount = 3
	export let xCount = 3
	export let zCount = 3

	export let minimum = new BB.Vector3(0,0,0)
	export let maximum = new BB.Vector3(1,1,1)

	export let value = new BB.Vector3(0,0,1)
	export let position = new BB.Vector3(0,0,0)
	export let scaling = new BB.Vector3(1,1,1)

	export let data = null
	export let speed = 0.06

	// ============ INIT ============

	onMount(init)

	let sphereMeshes = []
	let hoveredSphere = null
	let selectedSphere = null
	let currentTween

	let isDragging = false
	let isAnimating = false
	let isSwitching = false

	function init() {
		if (!browser) return 

		wythoff = new Wythoff( debug )
		update( settings )
	}

	// ============ UPDATE ============

	function update( settings ) {
		if (!wythoff) return
		wythoff.updateSettings( settings )
		data = wythoff.update()
		data = postprocessWythoff( data )
		data = { ...data, isDragging, isAnimating, isSwitching, generator, triangle, explode, snub, stellate }
		window.data = data
	}

	$: update( settings )
	$: settings = { triangle, generator, explode, snub, stellate, debug }

	// ============ EVENTS ============

	const on = {
		pointermove: e => {
			if (isDragging) {
				const distance = BB.Vector2.Distance( new BB.Vector2( e.clientX, e.clientY ), new BB.Vector2( ...isDragging ) )
				if (distance > 4) return hoveredSphere = null
			}
			hoveredSphere = context.findClosestMeshByEvent(e, sphereMeshes, 0.5)	
		},
		pointerup: e => {
			isDragging = false
			if (!hoveredSphere) return
			if (currentTween) currentTween.cancel()
			selectedSphere = hoveredSphere
			animate()
		},
		pointerdown: e => {
			isDragging = [ e.clientX, e.clientY ]
		},
		keydown: e => {
			const type = e.type
			const nextMesh = findMeshByKeyboard( context.getScene(), type, selectedSphere, sphereMeshes )
			if (nextMesh) {
				selectedSphere = nextMesh
				hoveredSphere = nextMesh
				animate()
			}
		}
	}

	function animate() {

		isAnimating = true
		const source = triangle.clone()
		const destination = selectedSphere.data.xyz.toObject ? selectedSphere.data.xyz.toObject() : selectedSphere.data.xyz

		if (debug) SAY(`🪼 ANIMATE`, destination)
		if (destination.x == 0 && destination.y == 0 && destination.z == 0) {

			let newGen = generator + 1
			if (newGen > 5) newGen = 3

				generator = newGen
				currentTween = tween.easeInOutQuad( speed*2, source, destination, v => {
				isSwitching = new BB.Vector3(v.x,v.y,v.z)
			}, v => {

				currentTween = tween.easeInOutQuad( speed*2, destination, source, v => {
					isSwitching = new BB.Vector3(v.x,v.y,v.z)
				}, v => {
					if (debug) SAY(`🦀 SWITCH, finish`)
					isAnimating = false 
					isSwitching = false
					generator = newGen
				})
			})
		} else {
			currentTween = tween.easeInOutQuad( speed, source, destination, v => {
				triangle.x = v.x
				triangle.y = v.y 
				triangle.z = v.z
			}, v => {
				if (debug) SAY(`🦀 ANIMATE, finish`)
				isAnimating = false
			})
		}
	}


	const countMinimum = new BB.Vector3(0,0,0)
	$: countMaximum = new BB.Vector3(xCount-1,yCount-1,zCount-1)
	const visualMinimum = new BB.Vector3(-0.5,-0.5,-0.5)
	const visualMaximum = new BB.Vector3(0.5,0.5,0.5)

	$: spheres = (()=>{

		let out = []
		const xSpacing = 1 / (xCount-1)
		const ySpacing = 1 / (yCount-1)
		const zSpacing = 1 / (zCount-1)
		let idx = 0


		for (let x = 0; x < yCount; x++ ) {
			for (let y = 0; y < xCount; y++ ) {
				for (let z = 0; z < zCount; z++) {

					const isCorner = [
						x == 0 || x == xCount - 1,
						y == 0 || y == yCount - 1,
						z == 0 || z == zCount - 1,
					].filter( b => b ).length > 2

					const isBlank = x == 0 && y == 0 && z == 0


					const xyz = MapRange(
						{x,y,z},
						countMinimum.toObject(),
						countMaximum.toObject(),
						minimum.toObject(),
						maximum.toObject()) // this is the value we want to set
					const normalised = MapRange(
						xyz,
						minimum.toObject(),
						maximum.toObject(),
						visualMinimum.toObject(),
						visualMaximum.toObject() // this is canvas position
					)
					out = [ ...out, {
						xyz,
						isCorner,
						idx,
						material: isCorner ? isBlank ? COLORS.WHITE : COLORS[generator] : COLORS[generator+1],
						diameter: isCorner ? isBlank ? 0.12 : 0.12 : 0.06,
						normalised
					}]
					idx += 1
				}
			}
		}

		return out 
	})( xCount, yCount, zCount )

	function onInterpolateChange(e ) {
		const value = e.detail
		triangle = interpolateSymbol( tours[1], value).multiply( new BB.Vector3(1,1,1))
	}

	const tours = [
			[ [-1, 0.5, 1] ], // can be set from query params
			[ [1,0,0],[1,1,0],[0,1,0],[0,1,1],[0,0,1],[1,0,1],[1,0,0],
			  [1,1,1],[1,1,0],[0,1,0],[1,1,1],[0,1,1],[0,0,1],[1,1,1],[1,0,1] ],
			[
				[-1,1,0],[0,1,0],[1,0,0],[1,-1,0],
				[-1,0,1],[0,0,1],[1,0,0],[1,0,-1],
				[0,-1,1],[0,0,1],[0,1,0],[0,1,-1],
				[1,-1,-1],[1,0,0],[0,1,1],[-1,1,1],
				[-1,1,-1],[0,1,0],[1,0,1],[1,-1,1],
				[-1,-1,1],[0,0,1],[1,1,0],[1,1,-1],
			], 
		]

	function interpolateSymbol(points, value) {

		let t = (value / 1) % points.length
		const s = t%1
		t = Math.floor(t)
		const start = points[t]
		const end = points[(t+1)%points.length]
		let res = []
		for (let i = 0; i < 3; i++) res[i] = (1-s)*start[i] + s*end[i]
		return new BB.Vector3( ...res )
	}


	$: matchedPreset = findPresetBySchwarzFormula( triangle, generator, snub )
	$: visualPosition = isSwitching ? isSwitching.toObject() : triangle.toObject()
	$: trianglePosition = MapRange( visualPosition, minimum.toObject(), maximum.toObject(), visualMinimum.toObject(), visualMaximum.toObject() )
</script>

<svelte:window 
	on:pointerup={on.pointerup}
	on:pointermove={on.pointermove}
	on:pointerdown={on.pointerdown}
	on:keydown={on.keydown} />

<div class="abs l50pc b2 f3" style="transform: translate(-50%,0%)">
	<Names value={matchedPreset?.names || []} />
</div>

{#if gui}
	<h3>Wythoff</h3>
	<Names value={matchedPreset?.names || []} />
	<span>Frequency</span>
	<AUI.Numbox bind:value={generator} set:min={2} set:max={5} set:step={0.001} />
<!-- 	<span>Interpolate</span>
	<AUI.Slider set:min={0} set:max={15} set:step={0.001} on:change={onInterpolateChange} /> -->
	<span>Triangle</span>
	<VectorGUI bind:value={triangle} />
	<span>Explode</span>
	<AUI.Numbox bind:value={explode} set:min={0} set:max={1} set:step={0.001} />
	<span>Stellate</span>
	<AUI.Toggle bind:value={stellate} />
	<span>Snub</span>
	<AUI.Toggle bind:value={snub} />

{/if}


{#if node}
	<slot />
{/if}

<TransformNode
	{scaling}
	{position}
	name={`liminalNode`}
	bind:node={node}>
	<PointerRotateable 
		rotationSpeed={0.6} />
	<Box
		name={'liminalBox'}
		size={1} />
	{#each spheres as sphere}
		<Sphere
			name={`liminalSphere${sphere.idx}`}
			bind:mesh={sphereMeshes[sphere.idx]}
			material={ sphere.idx === hoveredSphere?.data?.idx ? COLORS.ORANGE : sphere.material }
			diameter={ sphere.idx === hoveredSphere?.data?.idx ? 0.16 : sphere.diameter }
			data={sphere}
			position={sphere.normalised}>
		</Sphere>
	{/each}

	{#if hoveredSphere?.position}
		<CylinderFromPoints
			name={`liminalHover`}
			pointA={hoveredSphere.position}
			pointB={trianglePosition}
			material={COLORS.ORANGE} />
	{/if}

	<Sphere
		name={`liminalPosition`}
		diameter={0.16}
		position={trianglePosition} />

</TransformNode>
