/* ====================================== */
/*                                        */
/*         	   ENGINE BACKEND             */
/*                                        */
/* ====================================== */

// #define WORKER

import Object from './_Object.js'
import { CreateEngine } from './_webgpu'
import References from '../_References.js'
import { GetAllBackends } from './lib.loader.js'

let MODULES_INITED = false
self.modules = new Map()

GetAllBackends().then( mods => {
	self.modules = mods
	MODULES_INITED = true
	// SAY(`🎒 ${mods.size} backends are loaded`)
})

export default class Engine extends Object {

	index = 0 // scene index

	rect = {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		x: 0,
		y: 0,
		height: 0,
		width: 0,
	}

	resizeRequest = null

	configure( _canvas, width, height ) {


		self.canvas = self.configureCanvas( _canvas, width, height )
		this.canvas = self.canvas
		this.say(`🛠️ offscreen canvas configured: ${width} / ${height}`)

	}

	setActiveScene( id ) {

		let index = id
		const scenes = this.instance.scenes

		if (typeof id !== 'number') {
			const item = scenes.find( scene => scene.name === id )
			index = Math.max( scenes.indexOf( item ), 0 )
		}

		this.say(`🎭 setting scene to ${id} / ${index}`)
		this.index = index
		
	}

	render() {
		const scene = this.getScene()
		if (scene && scene?.cameras?.length > 0) {
			scene.render()
			this.noScene = false
		} else if (!this.notifiedNoScene) {
			if (this.debug && !this.noScene) this.say(`🚨 no camera to render in scene`)
			this.noScene = true
		}
	}

	init( useNullEngine, useWebGPU ) {
		if (!globalThis?.navigator) {
			this.instance = new NullEngine()
			this.instance.runRenderLoop( this.render.bind(this) )
			resolve(this.id())
			this.say(`🏭 null engine`)
			this.send('onInited')
		} else {

			CreateEngine( self.canvas, useWebGPU, this.debug ).then( result => {
				this.instance = result
				this.instance.runRenderLoop(this.render.bind(this))
				this.say(`🏭 webgpu / webgl engine`)
				this.send('onInited')
			}).catch( err => {
				SAY(`❌ GLSLANG / TWGSL`, err.message, err)
			})
		}
	}

	onMessage( e ) {


		if (e.data.type === '3d') {

			const { action, id, constructor, data, type } = e.data

			const isCreating = action === 'create'
			const isDisposing = action === 'dipose'

			if (isCreating || isDisposing) {
				const mod = self.modules.get(constructor)
				if (!mod) {
					SAY(`❌ no [${constructor}:${id}] module exists`)
				} else if (isCreating) {
					const args = [id, ...data, self.references]
					this.say(`🔵 [${constructor}] ${id}:`, args.join(', '))
					new mod( ...args )
				}
			} else {
				const ref = this.getReference(id)

				if (!ref) {
					SAY(`❌ no [${constructor}:${id}] object to call`)
				} else if (!ref[action]) {
					SAY(`❌ no [${constructor}:${id}:${action}] method to call `)
				} else {
					this.say(`🎆 ${id}.${action}(${data.length||''})`, {args: data})
					ref[action](...data)
				}
			}
		} else {

			// this.say(`🌐 worker simulation`, e.data.eventName)
			switch (e.data.type) {
				case 'event':
					self.handleEvent(e.data)
					break;
				case 'resize':
					this.onResize(e.data.rect)
					break;
				case 'init':
					self.init(e.data)
					break;
			}
		}

	}


	onResize = (origin) => {

		if (!this.instance) return
		if (this.resizeRequest) clearTimeout( this.resizeRequest )

		this.resizeRequest = setTimeout( () => {

			self.box.top = origin.top
			self.box.left = origin.left
			self.box.right = origin.right
			self.box.bottom = origin.bottom
			self.box.x = origin.x
			self.box.y = origin.y
			self.box.height = origin.height
			self.box.width = origin.width

			self.canvas.clientWidth = self.box.width
			self.canvas.clientHeight = self.box.height

			self.canvas.width = self.box.width
			self.canvas.height = self.box.height

			this.instance.resize( true )
			this.say(`📐 resize: ${ self.canvas.width} / ${self.canvas.height}`)
		}, 100)

	}

	onError( error ) {
		SAY(`❌ onError ${error}`)
	}

	// resize( width, height ) {
	// 	if (!self.canvas) return
	// 	self.canvas.width = width 
	// 	self.canvas.height = height 
	// 	this.instance.resize( width, height )
	// 	this.say('📐 RESIZE')
	// }
}


