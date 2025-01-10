<script>

	// #define COMPONENT

	import { GetPreciseCoordinate } from '$ad3_libs/index.js'

	const cam = getContext('cameraData')
	const proxy = getContext('cameraProxy')
	const store = getContext('store')
	const lookup = getContext('lookup')
	const elements = getContext('elements')

	let {
		children,
		data = $bindable({})
	} = $props()

	SetDefaults({
		enabled: true,
		debug: false,
		isTrackpad: true,
		isFlat: true
	})

	store.controlsData = data

	const isTrackpadPreferred = Parse( window.localStorage.getItem('isTrackpadPreferred') )
	if (data.enabled === undefined) data.enabled = true
	if (data.isTrackpad === undefined) data.isTrackpad = typeof isTrackpadPreferred === 'boolean' ? isTrackpadPreferred : true

	$effect( () => {
		window.localStorage.setItem('isTrackpadPreferred', data.isTrackpad ? true : false )
	})

	setContext('controls', data)

	const callbacks = new Map()
	const send = {}

	function CreateListenerMethod( name ) {

		if (!callbacks.get(name)) {
			callbacks.set(name, [])
			send[name] = () => {
				for (const callback of callbacks.get(name)) {
					callback(eventState, cam, data, modifiers) // state, camera, controls, modifiers
				}
				if (data[name]) data[name](eventState, cam, data, modifiers) // state, camera, controls, modifiers
			}
		}
		return ( callback ) => callbacks.get(name).push( callback )
	}

	const eventState = $state({
		inited: false,
		pressOrigin: null,
		isAirPressed: false,
		isPointPressed: false,
		isDragging: false,
		isContextMenuPressed: false,
		minInvalidPress: 3,

		onDown: CreateListenerMethod( 'onDown' ),
		onUp: CreateListenerMethod( 'onUp' ),
		onMove: CreateListenerMethod( 'onMove' ),
		onClick: CreateListenerMethod( 'onClick' ),
		onDblClick: CreateListenerMethod( 'onDblClick' ),
		onWheel: CreateListenerMethod( 'onWheel' ),
		onEndDrag: CreateListenerMethod( 'onEndDrag' ),
		onKeyDown: CreateListenerMethod( 'onKeyDown' ),
		onKeyUp: CreateListenerMethod( 'onKeyUp' )
	})

	setContext('eventState', eventState)

	function PossiblyDisableWheel( e ) {

		if (!elements.canvasWrapper) return true
		if (!elements.canvasWrapper.contains(e.target)) return true

		FocusCanvasWrapper()
		e.preventDefault()
		e.stopPropagation()
	}

	function UpdateInteractives( e ) {

		const { x, y, areaWidth, areaHeight } = GetPreciseCoordinate(e, elements.canvasWrapper)
		return proxy.immediateUpdateInteractives( x, y, areaWidth, areaHeight ).then( interact => {
			cam.interact = { ...interact }
		})
	}

	// ------ CURSOR 2D / 3D ------

	function OnPointerMove(e) {

		if (!elements.canvasWrapper) return
		const speedUp = 2
		const { x, y } = GetPreciseCoordinate(e, elements.canvasWrapper)

		if (eventState.isAirPressed) {
			buffer.deltaX += (eventState.downOrigin.x - x) * speedUp
			buffer.deltaY += (eventState.downOrigin.y - y) * speedUp
			eventState.downOrigin = { x, y }

			if (data.enabled) {
				if (untrack( () => eventState.isContextMenuPressed)) {
					proxy.immediateUpdateMove( -buffer.deltaX, -buffer.deltaY, data.isFlat )
				} else {
					proxy.immediateUpdateView( buffer.deltaX, buffer.deltaY )
				}
			}

			buffer.deltaX = 0
			buffer.deltaY = 0
			eventState.isDragging = true
		} else {
			eventState.isDragging = false
		}
		send.onMove()

		UpdateInteractives(e)
	}


	function OnPointerDown(e) {

		FocusCanvasWrapper()

		if (e.button === 2) {
			e.preventDefault()
			e.stopPropagation()
		}

		UpdateInteractives(e).then( res => {

			const { x, y } = GetPreciseCoordinate(e, elements.canvasWrapper)
			eventState.pressOrigin = { x, y }

			if (!untrack( () => cam.interact.point?.uid ) || e.button === 2) {
				if (data.debug) SAY('🔵 AIR PRESSED')
				eventState.downOrigin = { x, y }
				eventState.isPointPressed = false
				eventState.isAirPressed = true
			} else {
				if (data.debug) SAY('🟢 DISTANCE PRESSED')
				eventState.isAirPressed = false
				eventState.isPointPressed = true
			}
			send.onDown()

		})
	}

	let lastClickTimestamp = 0

	function OnPointerUp(e) {

		FocusCanvasWrapper()
		UpdateInteractives(e).then( res => {

			eventState.isAirPressed = false
			eventState.isPointPressed = false

			const { x, y } = GetPreciseCoordinate(e, elements.canvasWrapper)
			const distance = Vec2.Distance( new Vec2(x, y), new Vec2(eventState.pressOrigin)) 
			
			eventState.isDragging = false

			if (distance < eventState.minInvalidPress) {

				const elapsed = (new Date()) - lastClickTimestamp

				send.onClick()
				if (elapsed < 300) send.onDblClick()

				lastClickTimestamp = new Date()
			} else {
				send.onEndDrag()
			}

			send.onUp()


		})
	}


	function FocusCanvasWrapper() {

		if (!data.enabled) return

		elements.canvasWrapper.focus()
	}

	const modifiers = $state({})

	const buffer = {
		deltaX: 0,
		deltaY: 0
	}

	const keyCodeLookup = {
		MetaLeft: 'isSuper',
		MetaRight: 'isSuper',
		AltLeft: 'isAlt',
		AltRight: 'isAlt',
		ControlLeft: 'isControl',
		ControlRight: 'isControl',
		ArrowRight: 'isRight',
		ArrowUp: 'isUp',
		ArrowDown: 'isDown',
		ArrowLeft: 'isLeft',
		KeyA: 'isA',
		KeyW: 'isW',
		KeyD: 'isD',
		KeyS: 'isS',
		KeyQ: 'isQ',
		KeyE: 'isE',
	}

	function OnKeyDown(e) {

		const id = keyCodeLookup[e.code]
		modifiers[id] = true

		if (id) SyncStick()

		send.onKeyDown()
	}

	function OnKeyUp(e) {

		const id = keyCodeLookup[e.code]
		modifiers[id] = false

		if (id) SyncStick()

		send.onKeyUp()

	}

	function OnWheel(e) {

		FocusCanvasWrapper()
		if (PossiblyDisableWheel(e)) return

		UpdateInteractives( e )

		send.onWheel()

		if (!data.enabled) return

		const isControl = e.ctrlKey || modifiers.isControl
		const isAlt = e.isAltKey || modifiers.isAlt
		const isMouse = !untrack(() => data.isTrackpad)

		if (isControl || isMouse) {

			const pinchSpeed = isControl && !isMouse ? 3 : 1
			proxy.immediateUpdateZoom( e.deltaX  * pinchSpeed, e.deltaY  * pinchSpeed )
		} else if (isAlt) {
			proxy.immediateUpdateMove( e.deltaX, e.deltaY, data.isFlat )
		} else {
			proxy.immediateUpdateView( e.deltaX, e.deltaY )
		}


	}

	const stick = { 
		forwardsBackwards: 0, 
		sideStrafe: 0,
		riseFall: 0, 
		leftRight: 0, 
		upDown: 0
	}

	const smooth = {
		accelerate: 5, 
		deccelerate: 0.5,
		maximum: 15
	}

	function SyncStick() {


		const speed = 20

		if (modifiers.isW) stick.forwardsBackwards = -1
		if (modifiers.isS) stick.forwardsBackwards = 1
			
		if (modifiers.isA) stick.sideStrafe = 1
		if (modifiers.isD) stick.sideStrafe = -1

		if (modifiers.isE) stick.riseFall = 1
		if (modifiers.isQ) stick.riseFall = -1

		if (modifiers.isLeft) stick.leftRight = -1
		if (modifiers.isRight) stick.leftRight = 1

		if (modifiers.isUp) stick.upDown = -1
		if (modifiers.isDown) stick.upDown = 1

		if (data.enabled) proxy.immediateSetStick( stick, smooth )

		for (const key of Object.keys(stick)) stick[key] = 0
	}

	$effect( () => {

		if (!cam || !proxy) return SAY(`🚨 controls must be within a camera`)

		if (elements.canvasWrapper && !eventState.inited) {

			// ADD EVENT LISTENER

			window.addEventListener( 'pointermove', OnPointerMove)
			elements.canvasWrapper.addEventListener( 'pointerdown', OnPointerDown, { passive: false } )
			elements.canvasWrapper.addEventListener( 'contextmenu', e => {
				FocusCanvasWrapper()
				if (e.button !== 2) return
				eventState.isContextMenuPressed = true
				e.preventDefault()
				e.stopPropagation()
			})
			elements.canvasWrapper.addEventListener('mouseup', e => (eventState.isContextMenuPressed = false))
			window.addEventListener('pointerup', e => (eventState.isContextMenuPressed = false))
			elements.canvasWrapper.addEventListener( 'pointerup', OnPointerUp)

			elements.canvasWrapper.addEventListener('wheel', OnWheel, { passive: false } )
			elements.canvasWrapper.addEventListener('mousewheel', PossiblyDisableWheel )

			window.addEventListener('keydown', OnKeyDown, { passive: false } )
			window.addEventListener('keyup', OnKeyUp, { passive: false } )

			eventState.inited = true
			data.inited = true

		} else {
			SAY(`🚨 no elements canvasWrapper`)
		}
	})

</script>


{#if children && data.inited}
	{@render children()}
{/if}
