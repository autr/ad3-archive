export const POINTER_INTERACTION = `

	import { POINTER_EVENT_TYPES } from '$3d/defs'

	export let momentum = 0.96
	export let autoSpeed = 0
	export let autoVector = new BB.Vector2( (Math.random()*2)-1, (Math.random()*2)-1 ) 

	let requestRef = null
	let momentumX = null
	let momentumY = null

	function init() {

		if (!browser) return
		const scene = context.getScene()
		if (!scene) return

		scene.onPointerObservable.add( info => {

			const type = POINTER_EVENT_TYPES[info.type]
			const { pickInfo } = info
			const { pickedMesh } = pickInfo
			const { movementX, movementY } = info.event
			const buttons = info.event.buttons

			const hasMesh = $_selectedMesh
			const sameButton = (buttons == numButtons)
			const isSameNode = $_selectedNode == getNode()

			if ( type == 'POINTERDOWN' && sameButton) createCandidate( pickedMesh )
			if ( type == 'POINTERMOVE' && hasMesh && isSameNode && sameButton ) applyMovement( movementX, movementY )
			if ( type == 'POINTERUP' && hasMesh ) clearCandidate()
		})
		updateFromSettings()
	}

	function tick() {
		if (!$_selectedMesh && enabled) {

			momentumX *= momentum
			momentumY *= momentum

			applyMovement( momentumX, momentumY )
		}
		if (autoSpeed || momentum > 0 || translateMomentum > 0) window.requestAnimationFrame( tick )
	}

	function updateFromSettings() {
		if (!browser) return 
		if (requestRef) window.cancelAnimationFrame( requestRef )
		if (autoSpeed || momentum > 0) requestRef = window.requestAnimationFrame( tick )
	}

	$: updateFromSettings( autoSpeed, autoVector, momentum )

	let hasControls = false
	
	function createCandidate( mesh ) {
		const nodeRef = getNode()
		if (!nodeRef) return 
		const meshesRef = meshes || nodeRef.getChildMeshes()
		if (meshesRef.indexOf(mesh) != -1) {
			$_selectedMesh = mesh
			$_selectedNode = nodeRef
			const scene = context.getScene()
			hasControls = scene?.activeCamera?.inputs?.attachedToElement
			context.getCamera().detachControl()
		}
	}
	function clearCandidate() {
		$_selectedMesh = null
		$_selectedNode = null
		if (hasControls) context.getCamera().attachControl()
	}

	function destroy() {
		if (requestRef) window.cancelAnimationFrame( requestRef )
	}

	
`

export const INTERACTION = `

	const context = getContext('sketch')
	const dispatch = createEventDispatcher()
	import { _selectedMesh, _selectedNode } from '$3d/store'

	onMount( init )
	onDestroy( destroy )

	export let enabled = true
	export let speed = 0.4
	export let fps = 30

	export let node = null // optional, parent node
	export let meshes = null // optional, meshes to lookup
	
	function getNode() {
		return node || context.getNode()
	}

	
`
