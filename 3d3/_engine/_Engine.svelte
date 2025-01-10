<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       ENGINE                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import ObjectSvelte from './_Object.svelte.js'
	import Worker from './worker.js?worker'
	import References from '../_References.js'
	import { MOUSE_FIELDS } from './defs.js'
	import { CreateObserver, GetDimensions } from './lib.dimensions.js'
	import EngineString from './_Engine.svelte?raw'


	let {
		id = 'engine',
		scene = 0, /** @gui oneOf: [ $Scene ] */
		debug = false, /** @gui */
		children,
		...props
	} = $props()


	const references = new References( 'local', debug ? '////// ' : false )

	setContext('references', references)

	export class Engine extends ObjectSvelte {
		selected = $state([])
		hovered = $state([])
		soloed = $state([])
		muted = $state([])
	}
	const engine = new Engine( id, props.debug ? true : false, getContext('parent'), references )

	engine.setSchema(EngineString)
	
	setContext('parent', engine)
	setContext('engine', engine)

	window.engine = engine

	const workspace = getContext('workspace')
	if (workspace) workspace.addEngine( engine )

	function onCanvasResize( left, top, width, height ) {

		engine.worker.postMessage({
			type: 'resize',
			rect: engine.element.getBoundingClientRect()
		})
	}

	let initTimeout = null

	function setupEngine() {

		engine.say('👁️ offscreen 👄 canvas 👁️')
		if (engine.element && !engine.inited) {

			if (initTimeout) clearTimeout( initTimeout )

			engine.dimensions = GetDimensions( engine.element )
			engine.element.width = engine.dimensions.width
			engine.element.height = engine.dimensions.height
			engine.observer = CreateObserver( engine.element, onCanvasResize )
			engine.offscreen = engine.element.transferControlToOffscreen()
			engine.worker.postMessage({
				action: 'configure',
				id: 'engine',
				type: '3d',
				data: [ engine.offscreen, engine.dimensions.width, engine.dimensions.height ]
			}, [engine.offscreen])

			engine.send('init')
		}
	}

	$effect( setupEngine )
	$effect( () => engine.setDebug( debug ) )

	engine.offscreen = (browser ? ('OffscreenCanvas' in window) : false) && props.offscreen
	engine.worker = new Worker()
	engine.worker.onerror = e => engine.say(`❌ thread error`)
	engine.worker.onmessage = e => {


		const { id, action, constructor, data, type } = e.data

		if (type === '3d') {

			const ref = engine.getReference( id )

			if (!ref) return engine.say(`‼️ no ${constructor} (${id}) reference`)
			if (!ref[action]) return engine.say(`‼️ no ${constructor} (${id}) method`)

			ref[action](...data)

			// engine.say(`🎆 ${id}.${action}(${data.length||''})`)
			// engine.say(`🌠 ${constructor} (${id}) ${action}`)
		} else {

			// engine.say(`🌐 simulation:`, e.data)

			switch (e.data.type) {
				case 'event':
					bindEvent(e.data)
					break;
				case 'canvasMethod':
					engine.element[e.data.method](...e.data.args)
					break;
				case 'canvasStyle':
					engine.element.style[e.data.name] = e.data.value
					break;
			}
		}

	}


	function bindEvent(data) {

		let target

		switch (data.targetName) {
			case 'window':
				target = window
				break;
			case 'canvas':
				target = engine.element
				break;
			case 'document':
				target = document
				break;
		}

		if (!target) {
			console.error('unknown target: ' + data.targetName)
			return
		}


		target.addEventListener(data.eventName, function (e) {

			const eventClone = cloneEvent(e) // we can`t pass original event to the worker

			engine.worker.postMessage({
				type: 'event',
				targetName: data.targetName,
				eventName: data.eventName,
				eventClone: eventClone,
			})

		}, data.opt)

	}

	function cloneEvent(event) {

		event.preventDefault()

		const eventClone = {}

		for (let field of MOUSE_FIELDS) {
			eventClone[field] = event[field]
		}
		return eventClone
	}


</script>

<svelte:options runes={true} />

<div class="row-s-s">
	<div class="engine">
		{#if engine.inited}
			{@render children()}
		{/if}
	</div>
	<div class="canvas rel minh1vh b grow">
		<canvas bind:this={engine.element}></canvas>
	</div>
</div>
