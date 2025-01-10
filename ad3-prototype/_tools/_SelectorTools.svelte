<script>
	/* ====================================== */
	/*                                        */
	/*         	  SELECTOR TOOLS              */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Icon } from '$icons'
	import { keys } from '$keys'

	import { GetPreciseCoordinate } from '$ad3_libs'
	import { Vec3 } from '$ad3'
	import { ALLTOOLS } from './defs.js'

	import { PolygonContains, PolygonHull, PolygonArea, PolygonLength, PolygonCentroid } from '$ad3_libs'
	globalThis.Polygon = { PolygonContains, PolygonHull, PolygonArea, PolygonLength, PolygonCentroid }

	let {
		refs = $bindable(),
		debug = false
	} = $props()

	SAY('COMPONENT')

	let selector = $state(null)
	const selected = $derived( refs.store.selected )
	const hovered = $derived( refs.store.hovered )
	const lookup = $derived( refs.lookup )
	const groups = $derived( refs.groups )
	const activeTool = $derived( refs.store.activeTool )
	const activeScene = $derived( refs.store.activeScene )
	const activeSceneProxy = $derived( refs.store.activeSceneProxy )
	const cameraData = $derived( refs.store.cameraData )
	const cameraProxy = $derived( refs.store.cameraProxy )

	const pointerSelectors = [ ALLTOOLS.POINTER, ALLTOOLS.SELECTOR_LASSO, ALLTOOLS.SELECTOR_RECT ]
	const isPointerOrSelector = $derived( pointerSelectors.includes(activeTool) )

	let eventsInited = $state.raw(false)

	const pointersPoint = $state({
		object: 'Point',
		id: 'SelectorToolsPointersPoint',
		isPickable: false
	})

	const selectedEdge = $state({
		object: 'Edge',
		id: 'SelectorToolsNextEdge',
		isPickable: false,
		class: 'selector selected-edge'
	})

	const hoveredEdge = $state({
		object: 'Edge',
		id: 'SelectorToolsNearestEdge',
		isPickable: false,
		class: 'selector hovered-edge'
	})

	$effect(() => {
		if (!refs) return
		if (!eventsInited && refs.elements.svgOverlay && activeScene) {

			if (debug) SAY(`🔬 init events`)

			// ------------ EDGES + POINTS ------------

			if (!activeScene.children) refs.store.activeScene.children = []

			refs.store.activeScene.children.push(pointersPoint)
			refs.store.activeScene.children.push(selectedEdge)
			refs.store.activeScene.children.push(hoveredEdge)			

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

			// ------------ ENTER ------------

			keys.addShortcut('delete', ['Etner'], e => {
				e.preventDefault()
				e.stopPropagation()
				refs.store.selected = []
			})

			// ------------ BACKSPACE ------------

			keys.addShortcut('delete', ['Backspace'], e => {
				e.preventDefault()
				e.stopPropagation()
				const objects = [ 'Point', 'Edge' ]
				for (const uid of refs.store.selected) {
					const item = refs.lookup.get(uid)
					
					if (item.object === 'Edge') {
						refs.store.removed[uid] = true
					} else if (item.object === 'Point') {
						refs.store.removed[uid] = true
						refs.lookup.entries().filter( ([ searchUid, searchItem ]) => {
							const { pointA, pointB } = searchItem
							if (searchItem.object !== 'Edge') return
							return (pointA?.uid === uid || pointA === uid || pointB?.uid === uid || pointB === uid)
						}).forEach( ([searchUid]) => {
							refs.store.removed[searchUid] = true
						})
					}
				}
				refs.store.selected = []
			})

			// ------------ ESCAPE ------------

			keys.addShortcut('view', ['Escape'], e => {
				e.preventDefault()
				e.stopPropagation()
				SAY('CLEAR SELECTED')
				refs.store.selected = []
			})


			// ------------ FUN ------------

			keys.addShortcut('fog', ['f'], e => {
				e.preventDefault()
				e.stopPropagation()
				refs.store.fun.fog = !refs.store.fun.fog
			})

			// ------------ CMD + A ------------

			keys.addShortcut('view', ['a'], e => {
				if (e.ctrlKey || e.metaKey) {
					e.preventDefault()
					e.stopPropagation()
					const points = Object.keys(refs.store.grouped?.Point || {})
					const edges = Object.keys(refs.store.grouped?.Edge || {})
					refs.store.selected = [ ...points, ...edges ]
				} else {

				}
			})


			eventsInited = true
		}
	})

	$effect( () => {

	})

	function PointerDoubleEvent({x,y,target,e}) {

		if (!isPointerOrSelector) return

		const parents = refs.store.selected.map( uid => {
			const item = refs.lookup.get(uid)
			return item.creator.uid
		})

		refs.store.selected = parents
	}


	function PointerDownEvent({x,y,target, e}) {

		if (debug) SAY(`🟣 SINGLE`)

		const newUID = refs.store.hovered[refs.store.hovered.length-1]
		const newItem = refs.lookup.get(newUID)

		// ------ CREATE ------

		if (activeTool === ALLTOOLS.CREATE && newItem) {

			refs.store.selected.push( newUID )

		// ------ LASSO / RECT ------

		} else if (activeTool === ALLTOOLS.SELECTOR_LASSO || activeTool === ALLTOOLS.SELECTOR_RECT || activeTool === ALLTOOLS.POINTER) {

			if (newItem && (e.metaKey || e.shiftKey)) {
				SAY('🔵 SINGLE (SHIFT)')
				refs.store.selected.push( newUID )
			} else if (newItem) {
				SAY('🔵 SINGLE (SINGLE)')
				refs.store.selected = [newUID]
			} else {
				SAY('🔵 SINGLE (CLEAR)')
				refs.store.selected = []
			}
		}

		// ------ SELECTOR ------

		if (activeTool === ALLTOOLS.SELECTOR_RECT) {

			selector = {
				origin: { x, y }, x, y,
				width: 0,
				height: 0,
				points: [ [x,y],[x,y],[x,y],[x,y] ]
			} 

		} else if (activeTool === ALLTOOLS.SELECTOR_LASSO) {
			selector = {
				origin: { x, y }, x, y,
				points: [ [x,y] ]
			}
		}

		SetSelectorEdges()
		
	}


	function PointerUpEvent({x,y,e}) {

		if (!isPointerOrSelector) return

		const isSelectorRect = activeTool === ALLTOOLS.SELECTOR_RECT && selector
		const isSelectorLasso = activeTool === ALLTOOLS.SELECTOR_LASSO && selector

		if (isSelectorRect || isSelectorLasso) {

			const distance = Math.abs(selector.origin.x - x) + Math.abs(selector.origin.y - y)

			if (distance < 2) return selector = null

			const selected = (e.metaKey || e.shiftKey) ? refs.store.selected : []

			const pointEls = [ ...new Set(refs.svg.querySelectorAll('circle.point'))]
			const edgeEls = [ ...new Set(refs.svg.querySelectorAll('line.edge'))]

			const points = pointEls.map( circle => {
				return [ 
					Number( circle.getAttribute('cx') ), 
					Number( circle.getAttribute('cy') ) 
				]
			})

			const edges = edgeEls.map( line => {
				return [
					[
						Number( line.getAttribute('x1') ), 
						Number( line.getAttribute('y1') ) 
					],
					[
						Number( line.getAttribute('x2') ), 
						Number( line.getAttribute('y2') ) 
					]
				]
			})

			for (let i = 0; i < points.length; i++) {
				const contains = PolygonContains( selector.points, points[i] )
				if (contains) {
					const uid = pointEls[i].id // IMPORTANT: its not <use>
					SAY(`🟢 SELECT ${uid}`)
					selected.push(uid)
				}
			}
			for (let i = 0; i < edges.length; i++) {
				const containsA = PolygonContains( selector.points, edges[i][0] )
				const containsB = PolygonContains( selector.points, edges[i][1] )
				if (containsA || containsB) {
					const uid = edgeEls[i].id // IMPORTANT: its not  <use>
					SAY(`🟢 SELECT ${uid}`)
					selected.push(uid)
				}
			}

			refs.store.selected = selected

		}

		selector = null

		SetSelectorEdges()
	}



	function FindClosestPoint( x, y, minDistance = 40 ) {

		let closest = null
		let distance = 9999999
		for (const [uid,coord] of Object.entries(refs.store.coordinates)) {
			const dist = Math.abs(x - coord.x) + Math.abs(y - coord.y)
			if (dist < distance) {
				const item = lookup.get(uid)
				if (item?.isPickable && !item.hidden) {
					closest = uid
					distance = dist
				}
			}
		}

		return distance < minDistance ? closest : null
	}

	let lastMoveEvent = null

	function PointerMoveEvent({x,y,e, areaWidth, areaHeight}) {

		lastMoveEvent = { x, y, e, areaWidth, areaHeight }

		// ------ POINTERS POINT ------

		if (cameraProxy) {

			cameraProxy.convert2Dto3D( x, y, areaWidth, areaHeight, new Vec3(0,0,0) ).then( vec => {
				pointersPoint.position.x = vec.x
				pointersPoint.position.y = vec.y
				pointersPoint.position.z = vec.z
			})

		}

		// ------ RECT ------
			
		if (activeTool === ALLTOOLS.SELECTOR_RECT && selector) {

			let width = x - selector.origin.x
			let height = y - selector.origin.y

			if (width < 0) {
				selector.x = selector.origin.x + width
				selector.width = Math.abs(width)
			} else {
				selector.x = selector.origin.x
				selector.width = width
			}

			if (height < 0) {
				selector.y = selector.origin.y + height
				selector.height = Math.abs(height)
			} else {
				selector.y = selector.origin.y
				selector.height = height
			}

			selector.points = [
				[ selector.x, selector.y ],
				[ selector.x + selector.width, selector.y ],
				[ selector.x + selector.width, selector.y + selector.height ],
				[ selector.x, selector.y + selector.height ],
				[ selector.x, selector.y ]
			]

		// ------ LASSO ------

		} else if (activeTool === ALLTOOLS.SELECTOR_LASSO && selector) {
			selector.points.push([x,y])

		// ------ CREATE ------

		} else if (activeTool === ALLTOOLS.CREATE) {

			const closest = FindClosestPoint( x, y, 999999 )
			refs.store.hovered = closest ? [ closest ] : []

		// ------ HOVER ------

		} else {

			refs.engine.findIntersectingMeshMeta( x, y ).then( meta => {
				if (meta.uid) {
					refs.store.hovered = [ meta.uid ]
				} else {
					const closest = FindClosestPoint( x, y, 99999 )
					refs.store.hovered = closest ? [ closest ] : []
				}
			})

		}

		SetSelectorEdges()

	}

	function SetSelectorEdges() {

		const sUID = refs.store.selected[refs.store.selected.length-1]
		const sPoint = refs.lookup.get( sUID )
		if ( sUID && sPoint.object === 'Point' ) {
			if (untrack( () => selectedEdge.pointB ) !== sUID) {
				selectedEdge.pointA = 'SelectorToolsPointersPoint'
				selectedEdge.pointB = sUID
			}
		}

		const hUID = refs.store.hovered[refs.store.hovered.length-1]
		const hPoint = refs.lookup.get( hUID )
		if ( hUID && hPoint.object === 'Point' ) {
			if (untrack( () => hoveredEdge.pointB ) !== hUID) {
				hoveredEdge.pointA = 'SelectorToolsPointersPoint'
				hoveredEdge.pointB = hUID
			}
		}
	}

	function WheelTrigger() {
		if (lastMoveEvent) PointerMoveEvent(lastMoveEvent)
	}

	$effect( () => {
		pointersPoint.hidden = true
		if (activeTool === ALLTOOLS.SELECTOR_LASSO || activeTool === ALLTOOLS.SELECTOR_RECT) {
			hoveredEdge.hidden = true
			selectedEdge.hidden = true
		} else if (activeTool === ALLTOOLS.CREATE) {
			hoveredEdge.hidden = refs.store.hovered.length > 0 ? false : true
			selectedEdge.hidden = refs.store.hovered.length > 0 ? false : true
		} else {
			hoveredEdge.hidden = false
			selectedEdge.hidden = true

		}
	})



</script>

<svelte:window on:wheel={WheelTrigger} on:mousewheel={WheelTrigger}  />

{#if selector?.points && refs?.store?.cameraData }
	<polyline
		class="selector"
		points={ (selector?.points||[]).map(xy => xy.join(',') ).join(' ') } />
{/if}