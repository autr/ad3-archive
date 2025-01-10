/* ====================================== */
/*                                        */
/*         	   WORKER ENGINE              */
/*                                        */
/* ====================================== */

import References from '../_References.js'
import Engine from './_Engine.js'

class HTMLElement {} // dummy for window
class HTMLDivElement {} // dummy for window

const DEBUG = false

self.references = new References( 'worker', DEBUG ? '~ ~ ~ [thread] ' : false )
self.engine = new Engine( 'engine', DEBUG, null, self.references )
self.onmessage = engine.onMessage.bind(self.engine)
self.onerror = engine.onError.bind(self.engine)

self.canvas = null
self.box = {
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	x: 0,
	y: 0,
	height: 0,
	width: 0,
}

self.handlers = new Map()
self.canvas

self.bindHandler = (targetName, eventName, fn, opt) => {

	const handlerId = targetName + eventName;

	self.handlers.set(handlerId, fn)

	self.postMessage({
		type: 'event',
		targetName: targetName,
		eventName: eventName,
		opt: opt
	})
}

self.handleEvent = (event) => {

	const handlerId = event.targetName + event.eventName;

	event.eventClone.preventDefault = noop;

	// Cameras/Inputs/freeCameraMouseInput.ts:79
	event.eventClone.target = self.canvas

	// Just in case
	if (!handlers.has(handlerId)) {
		throw new Error('Unknown handlerId: ' + handlerId)
	}

	self.handlers.get(handlerId)(event.eventClone)

}

function noop() {}

self.window = {
	addEventListener: function (event, fn, opt) {
		self.bindHandler('window', event, fn, opt)
	},
	removeEventListener: function (event, fn, opt) {},
	setTimeout: self.setTimeout.bind(self),
	PointerEvent: true
}

self.document = {
	addEventListener: function (event, fn, opt) {
		self.bindHandler('document', event, fn, opt)
	},
	removeEventListener: function (event, fn, opt) {},
	// Uses to detect wheel event like at src/Inputs/scene.inputManager.ts:797
	createElement: function () {
		return { onwheel: true }
	},
	elementFromPoint: function() {

	},
	defaultView: self.window
}


self.configureCanvas = (_canvas, width, height) => {

	_canvas.clientWidth = width
	_canvas.clientHeight = height

	_canvas.width = width
	_canvas.height = height

	self.box.right = self.box.width = width
	self.box.bottom = self.box.height = height

	_canvas.setAttribute = function (name, value) {
		postMessage({
			type: 'canvasMethod',
			method: 'setAttribute',
			args: [name, value],
		})
	}

	_canvas.addEventListener = function (event, fn, opt) {
		bindHandler('canvas', event, fn, opt);
	}

	_canvas.getBoundingClientRect = function () {
		return box
	}

	_canvas.focus = function () {
		self.postMessage({
			type: 'canvasMethod',
			method: 'focus',
			args: [],
		})
	}

	// noinspection JSUnusedGlobalSymbols
	const style = {
		set touchAction(value) {
			postMessage({
				type: 'canvasStyle',
				name: 'touchAction',
				value: value,
			})
		}
	}

	Object.defineProperty(_canvas, 'style', {get() {return style}})

	return _canvas
}