<script>
	/* ====================================== */
	/*                                        */
	/*         	    CREATE TOOLS              */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Icon } from '$icons'
	import { keys } from '$keys'

	import { GetPreciseCoordinate } from '$ad3_libs'
	import { ALLTOOLS } from './defs.js'

	import { Edge } from '$ad3_core'

	import { PolygonContains, PolygonHull, PolygonArea, PolygonLength, PolygonCentroid } from '$ad3_libs'
	globalThis.Polygon = { PolygonContains, PolygonHull, PolygonArea, PolygonLength, PolygonCentroid }

	let {
		refs = $bindable(),
		debug = false
	} = $props()

	let eventsInited = $state.raw(false)

	$effect(() => {
		if (!refs) return
		if (!eventsInited && refs.elements.svgOverlay) {

			if (debug) SAY(`🔬 init events`)

			// ------------ POINTER EVENTS ------------

			refs.elements.svgOverlay.addEventListener('pointerdown', e => {
				PointerDownEvent( GetPreciseCoordinate(e, refs.elements.svgOverlay) ) 
			})
			refs.elements.svgOverlay.addEventListener('pointerup', e => {
				PointerUpEvent( GetPreciseCoordinate(e, refs.elements.svgOverlay) )
			})
			refs.elements.svgOverlay.addEventListener('dblclick', e => {
				PointerDoubleEvent( GetPreciseCoordinate(e, refs.elements.svgOverlay) )
			})
			refs.elements.svgOverlay.addEventListener('pointermove', e => {
				PointerMoveEvent( GetPreciseCoordinate(e, refs.elements.svgOverlay) )
			})


			keys.addShortcut('writeToGroup', ['Enter'], e => {
				e.preventDefault()
				e.stopPropagation()
				points = []
			})

			eventsInited = true
		}
	})

	let timeout = null
	let inited = false

	$effect( () => {
		const { cameraData, activeScene } = refs.store
		if (!refs || !activeScene || inited) return

		if (timeout) clearTimeout(timeout)
		timeout = setTimeout( () => {

			SAY('🟡 CREATE GROUP', activeScene?.children)
			if (!activeScene?.children) refs.store.activeScene.children = []
			const group = { object: 'Group', id: 'initialGroup', children: [] }

			// group.children.push({object: 'Point'})
			// group.children.push({object: 'Point'})
			// group.children.push({object: 'Point'})
			// group.children.push({object: 'Point'})
			// group.children.push({object: 'Point'})
			// group.children.push({object: 'Point'})
			// group.children.push({object: 'Edge'})

			refs.store.activeScene.children.push( group )
			refs.store.activeObject = refs.store.activeScene.children[refs.store.activeScene.children.length-1]

		}, 100)
		inited = true
	})


	const activeTool = $derived( refs.store.activeTool )
	let points = $state([])

	$effect( () => {
		if (refs.store.activeTool === ALLTOOLS.CREATE) {
			refs.store.selected = []
		}
	})

	const hovered = $derived( refs.store.hovered )
	const selected = $derived( refs.store.selected )

	function PointerDownEvent({x,y,target, e}) {
		if (refs.store.activeTool === ALLTOOLS.CREATE && refs.store.activeObject) {

			const selectedUID = hovered[0]

			if (selectedUID) {
				const item = refs.lookup.get(selectedUID)

				if (item && item.object === 'Point') {

					SAY('🔵 YOINK', selected.length, selected.length%2)
					refs.store.selected.push( item.uid )

					if (selected.length > 1) {
						const pointA = selected[selected.length-2]
						const pointB = selected[selected.length-1]

						refs.lookup.get(pointA).removed = false
						refs.lookup.get(pointB).removed = false

						SAY(`🟠 AB`, pointA, pointB, selected)

						if ( !refs.store.activeObject.children ) refs.store.activeObject.children = []

						// CREATE EDGE

						const edgeID = refs.store.activeObject.uid + pointA + pointB + 'Edge'
						refs.store.activeObject.children.push({
							object: 'Edge',
							id: edgeID,
							pointA,
							pointB,
							class: 'created'
						})

						refs.store.selected.push(edgeID)

					}
				}
			}
		}
	}

	function PointerDoubleEvent({x,y,target,e}) {

	}


	function PointerUpEvent({x,y,e}) {

	}
	function PointerMoveEvent({x,y,e}) {

	}

	const finder = $state({
		object: 'Edge',
		id: 'CreateToolEdge'
	})

	$effect( () => {
		// if (!refs || !refs.store.activeScene) return
		// if (!refs.store.activeScene.children) refs.store.activeScene.children = []
		// if (!refs.store.activeScene.children.includes(finder)) {
		// 	refs.store.activeScene.children.push(finder)
		// }
	})


</script>

