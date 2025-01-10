<script>

	/* ====================================== */
	/*                                        */
	/*         	     ALIGN VIEW               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { A } from '$ad3_autogen'
	import { Shape, Point, Edge, Transform } from '$ad3_core'

	let {
		data = $bindable({})
	} = $props()


	SetDefaults({
		enabled: true
	})

	const store = getContext('store')

	store.alignViewData = data

	const cam = getContext('camera')
	const controls = getContext('controls')
	const proxy = getContext('cameraProxy')

	const eventState = getContext('eventState')

	const edge = $state({})
	
	eventState.onDown( (state, camera, controls, modifiers) => {

		if (!data.enabled) return

		if (state.isAirPressed) {
		} else if (state.isPointPressed) {
			cursorEdge.pointA = cam.interact.point.uid
			cursorTarget.position = cursorEdge.pointA
			cursorSelected.isVisible = true
			cursorSelected.position = cursorEdge.pointA
		}
		cursorEdge.isVisible = false
	})

	eventState.onMove( (state, camera, controls, modifiers) => {

		if (!data.enabled) return

		if (cursorEdge.pointA) {
			cursorEdge.isVisible = true
			cursorPoint.position = cam.interact.worldPosition
		}
		const isUnique = cam.interact?.point?.uid !== cursorEdge.pointA && cam.interact?.point?.uid
		cursorEdge.pointB = isUnique ? cam.interact.point.uid : 'CursorPoint'

		cursorTarget.position = cursorEdge.pointB

		cursorTarget.isVisible = cursorTarget.position !== 'CursorPoint'
	})

	eventState.onClick( (state, camera, controls, modifiers) => {

		if (!data.enabled) return

		if (cursorEdge.pointA) {


			camera.target = cursorEdge.pointA
			camera.alignTarget = null
			cursorEdge.pointA = null
			cursorEdge.pointB = null
			cursorEdge.isVisible = false
		} else {

			camera.target = null
			camera.alignTarget = null
			cursorEdge.pointA = null
			cursorEdge.pointB = null
			cursorEdge.isVisible = false
			cursorSelected.isVisible = false
		}
	})
	eventState.onEndDrag( (state, camera, controls, modifiers) => {

		if (!data.enabled) return

		const isBothSame = cursorEdge.pointA === cursorEdge.pointB
		const isCursorPoint = cursorEdge.pointB === 'CursorPoint'

		cam.alignTarget = isBothSame || isCursorPoint ? null : cursorEdge.pointB
		if (cam.alignTarget) cam.target = cursorEdge.pointA
		cursorEdge.pointA = null
		cursorEdge.pointB = null
		cursorEdge.isVisible = false
		cursorTarget.isVisible = false
	})


	$effect( () => {
		cursorPoint.position = cam.interact.worldPosition
	})

	let cursorPoint = $state({ 
		id: 'CursorPoint',
		radius: 0.1 , 
		isOnTop: true,
		isPickable: false, 
		isVisible: false,
		...(data.point || {})
	})

	let cursorEdge = $state({
		id: 'CursorEdge',
		pointA: null,
		pointB: null,
		isArrowB: true,
		retraction: 0.1,
		width: 0.068,
		radius: 0.05,
		arrowWidth: 0.1,
		isDashed: true,
		isOnTop: true,
		dashSize: 0.1,
		isOccluding: false,
		isVisible: false,
		isPickable: false,
		autoSpeed: 0.05,
		color: [0.2,0.2,0.6,0.8],
		...(data.edge || {})
	})
	let cursorTarget = $state({
		id: 'CursorTarget',
		position: 'CursorPoint',
		isOnTop: true,
		size: [0.1,0.05],
		...(data.target || {})
	})
	let cursorSelected = $state({
		id: 'CursorSelected',
		position: null,
		isVisible: false,
		isOnTop: true,
		isOccluding: false,
		size: [0.1,0.05,64],
		color: [0.6,1,0.6],
		...(data.selected || {})
	})

</script>



{#if controls?.inited}

	<Point bind:data={cursorPoint} />
	<Edge bind:data={cursorEdge} />
	<Shape bind:data={cursorTarget} />
	<Shape bind:data={cursorSelected} />

	
{/if}





