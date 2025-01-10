<script>
	/* ====================================== */
	/*                                        */
	/*            BABYLON SKETCH              */
	/*                                        */
	/* ====================================== */

	import * as BB from 'babylonjs'
	import AUI from '$aui'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, setContext } from 'svelte'
	import { _plugins } from './store.js'
	import * as Utils from '$3d_utils'
	import * as utilities from './lib.utils.js'

	// #include essential
	

	import { POINTER_EVENT_TYPES } from './defs'

	// ========== PHYSICS ENGINES ==========

	import * as Cannon from 'cannon-es'
	import * as Ammo from 'ammojs-typed'
	import HavokPhysics from '@babylonjs/havok'
	import { HavokPlugin } from '@babylonjs/core/Physics/v2/Plugins/havokPlugin'

	// QUARTERNION https://www.babylonjs-playground.com/#CGXLT#27
	// DEPTH SHADER https://playground.babylonjs.com/#R6Q40J#2

	// ========== INTERNAL ==========

	export let engine = null // created internally
	export let scene = null // created internally
	export let canvas = null // created internally
	export let camera = null // created internally
	export let status = 0

	// ========== INIT ==========

	export let webgpu = true
	export let debug = false
	export let debugMesh
	export let gui = false
	export let showInspector = false

	// ========== PROPS PHYSICS ==========

	export let physics = null // v2, havok, cannon, ammo, oimu
	export let gravity = new BB.Vector3(0,-9.8,0)
	export let vacuum = 0 // -1 to 1
	export let runPhysics = false

	// ========== PROPS CAMERA ==========

	export let zoom = 4
	export let orthographic = true
	export let mouseWheel = false
	export let controls = {
		angularSensibilityX: 400,
		angularSensibilityY: 400,
		inertia: 0.6,
		panningSensibility: 400,
		panningInertia: 0.6
	}

	// ========== CALLBACKS ==========

	export let onInit = null
	export let onBeforeRender = null
	export let onBeforeDraw = null
	export let onRender = null
	export let onPointer = () => {}

	// ========== REACTIVITY ==========

	onMount( init )
	onDestroy( destroy )

	let colors 
	export function getScene() { return scene }
	export function getEngine() { return engine }
	export function getCanvas() { return canvas }
	export function getCamera() { return camera }
	export function getDebug() { return debug }
	export function getMesh() { return null }
	export const getColors = () => {
		if (!colors) colors = utilities.getColors( scene )
		return colors
	}
	export const findClosestMeshByEvent = (anyEventOrRay, meshes, maxDistance) => utilities.findClosestMeshByEvent( canvas, anyEventOrRay, meshes, maxDistance )
	export const findMeshes = callback => utilities.findMeshes( scene, callback )
	export const findMeshByName = mesh => utilities.findMeshByName( scene, mesh )

	setContext('sketch', {
		getScene,
		getEngine,
		getCanvas,
		getCamera,
		getDebug,
		getMesh,
		...utilities,
		getColors,
		findClosestMeshByEvent,
		findMeshes,
		findMeshByName
	})

	$: init(canvas)
	$: updateCameraSettings( zoom, orthographic, controls )
	$: updateSceneSettings( showInspector )
	$: updatePhysicsSettings( runPhysics, gravity, vacuum )

	// ========== INIT ==========

	async function init() {

		if (!browser || !canvas || status) return

		destroy()
		status = 1

		// --------- ENGINE (WEBGPU) ---------


		window.engine = engine = webgpu ? new BABYLON.WebGPUEngine(canvas) : new BB.Engine(canvas, true)

		if (webgpu) {
			if (debug) SAY('🚨 getting webgpu')
			await engine.initAsync()
			if (debug) SAY('✅ got webgpu')
		}

		// --------- SCENE ---------

		window.scene = scene = new BB.Scene(engine)
		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)
		scene.getEngine().setDepthFunctionToLessOrEqual()

		// --------- EVENTS ---------

		scene.onPointerObservable.add( createPointerEvents )
		canvas.addEventListener( 'pointerleave', createSimulatedLeaveEvent )
		const resizeObserver = new ResizeObserver( handleObserverEntries )
		resizeObserver.observe(canvas)

		if (onBeforeRender) scene.onBeforeRenderObservable.add(()=>sendCallback( onBeforeRender ))
		if (onBeforeDraw) scene.onBeforeDrawObservable.add(()=>sendCallback( onBeforeDraw ))

		window.BB = BB
		window.scene = scene

		// --------- CAMERA ---------

		const alpha = -Math.PI / 2
		const beta = Math.PI / 2.5
		const centroid = new BABYLON.Vector3(0, 0, 0)
		window.camera = camera = new BABYLON.ArcRotateCamera('camera', alpha, beta, zoom, centroid)

		if (debug) updateDebugBox()
		updateCameraSettings()
		updateSceneSettings()
		await updatePhysicsSettings()

		// --------- FINISH ---------

		if (onInit) sendCallback( onInit )
		engine.runRenderLoop(tick)
		if (debug) SAY('🎨 inited sketch')

		status = 2
	}

	function handleObserverEntries( entries ) {
		for (let entry of entries) {
			const { width, height } = entry.contentRect
			if (debug) SAY(`🖼️ sketch size changed, ${width}px x ${height}px`)
			engine.resize()
			updateCameraSettings()
		}
	}

	function createPointerEvents( info ) {
		const type = POINTER_EVENT_TYPES[info.type]
		const { pickInfo } = info
		const { pickedMesh } = pickInfo
		if (pickedMesh?.onPointer) pickedMesh.onPointer( { pickedMesh, eventName: type, ...info } )
		onPointer( { pickedMesh, eventName: type, pickInfo, type } )
	}
	function createSimulatedLeaveEvent( e ) {
		onPointer({
			...e,
			eventName: 'POINTERLEAVE'
		})
		onPointer({
			...e,
			eventName: 'POINTERUP'
		})
	}


	// ========== UPDATE DEBUG BOX ==========

	async function updateDebugBox() {

		if (debug) {
			if (debugMesh) {
				debugMesh.dispose()
				debugMesh = null
			}
		} else {
			if (!debugMesh) {
				debugMesh = BB.MeshBuilder.CreateBox('debugMesh', { size: 2 }, scene)
				debugMesh.material = new BB.StandardMaterial('debugMaterial', scene)
				debugMesh.material.wireframe = true
				debugMesh.material.emissiveColor = new BB.Color3(1,1,1)
			}
		}
	}

	// ========== UPDATE CAMERA SETTINGS ==========

	function updateCameraSettings() {
		if (!camera) return

		camera.radius = zoom

		if (orthographic) {
			camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA

			const aspectRatio = canvas.width / canvas.height
			const halfHeight = zoom / 2.5
			const halfWidth = halfHeight * aspectRatio

			camera.orthoTop = halfHeight
			camera.orthoBottom = -halfHeight
			camera.orthoLeft = -halfWidth
			camera.orthoRight = halfWidth
		} else {
			camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA
		}


		const { minZ, maxZ, fov } = camera 

		// --------- CONTROLS ---------

		if (controls) {
			camera.attachControl(canvas, true)
			if (!mouseWheel) camera.inputs.remove(camera.inputs.attached.mousewheel)
			if (typeof controls == 'object') {
				for (const [key,value] of Object.entries(controls)) {
					camera[key] = value
				}
			}
		}

		if (debug) SAY('🖼️ updated camera', { minZ, maxZ, fov })
	}

	// ========== UPDATE SCENE SETTINGS ==========

	function updateSceneSettings() {
		if (!browser || !scene) return
		scene.debugLayer[showInspector?'show':'hide']()
	}

	// ========== UPDATE PHYSICS SETTINGS ==========

	async function updatePhysicsSettings() {
		if (!browser || !scene) return
		if (physics) physics = physics.toLowerCase()

		if (!$_plugins[physics] && physics) {

			$_plugins[physics] = 1

			if (physics == 'v2' || physics == 'havok') {

				const havokWASM = await HavokPhysics()
				$_plugins[physics] = new HavokPlugin( true, havokWASM )
				SAY(`🦄 loaded HAVOK physics`)

			} else if (physics == 'cannon') {
				$_plugins[physics] = new BB.CannonJSPlugin()
				SAY(`⛷️ ✅ loaded CANNON physics`)

			} else if (physics == 'ammo') {

				const ammo = await Ammo.bind(window)()
				$_plugins[physics] = new BB.AmmoJSPlugin()
				SAY(`⛷️ ✅ loaded AMMO physics`)

			} else {
				SAY(`⛷️ 🚨 no physics engine enabled`)
			}
		}

		if (physics && !scene.getPhysicsEngine() && $_plugins[physics] !== 1 && $_plugins[physics] ) {
			const grav = new BB.Vector3( gravity.x, gravity.y, gravity.z)
			scene.enablePhysics( grav, $_plugins[physics] )
			if (debug) SAY(`⛷️ enabled physics, ${physics}`)
		}

		scene.physicsEnabled = runPhysics
	}

	// ========== TICK ==========

	function tick() {
		if (fps) fps.update()
		if (onRender) sendCallback( onRender )
		scene.render()
	}

	function sendCallback( method ) {
		method({engine,scene,canvas,camera})
	}

	function destroy() {

		if (scene) scene.dispose()
		if (camera) camera.dispose()
		if (canvas) {
			canvas.width = 0
			canvas.height = 0
		}
		if (debug) SAY('🖼️ 🚨 removed sketch')
		if (engine) engine.dispose()
	}



	let fps = null
</script>

<!-- ------ RESIZE ------ -->

<svelte:window 
	on:mouseleave={createSimulatedLeaveEvent}
	on:pointerleave={createSimulatedLeaveEvent}
	on:resize={() => {
		engine.resize()
		updateCameraSettings()
	}} />

<!-- ------ GUI ------ -->

{#if gui && camera}
	<span>FPS</span>
	<div>
		<Utils.FPS 
			class="f2 ICOSA"
			useMilliseconds={false}
			bind:this={fps} />
	</div>
	<span>Inspector</span>
	<AUI bind:value={showInspector}  />
	{#if physics}
		<span>Physics</span>
		<AUI bind:value={runPhysics}  />
		<span>Gravity</span>
		<Utils.Vector3 bind:value={gravity} set:step={0.1} />

	{/if}
	<span>Zoom</span>
	<AUI 
		set:step={0.1}
		bind:value={zoom}  />
	<span>Orthographic</span>
	<AUI 
		bind:value={orthographic}  />
	<span>Clipping Plane</span>
	<span class="flex">
		<AUI bind:value={camera.minZ} class="w6em"  />
		<AUI bind:value={camera.maxZ} class="w6em"  />
	</span>
	<span>Field of View</span>
	<AUI bind:value={camera.fov} set:step={0.01}  />
{/if}

<!-- ------ SLOT ------ -->

{#if scene && status > 1}
	<slot />
{/if}

<style lang="sass">
	.gui
		+flex
		+column(stretch, stretch)
		+abs
		+p(1em)
		+z-index(99)
		+l(0)
		+t(0)
		+maxh(100vh)
		+overflow(auto)
		:global(> *)
			+mb(0.5em)
</style>