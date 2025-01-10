/* ====================================== */
/*                                        */
/*         	    OBJECT INITIAL            */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { UniqueId } from './lib.lifecycle.js'
import { ExtractSchema } from '$gui/lib.parser.js'
import { Vec3 } from '$3d1_points'
import { SetPropertyFromString, GetPropertyFromString } from '$root/lib.essential.js'

export default class ObjectJavascript {

	#id = undefined
	id() { return this.#id }

	#type = undefined
	type() { return this.#type }

	debug = false
	parent = null
	instance = null
	_schema = null

	children = {}
	adjustmentsStore = {} // for refreshing

	setPositionTarget( target ) {

	}

	setDebug( bool ) {
		this.debug = bool
		if (this.references) this.references.debug = bool
	}
	setSchema( _schema ) {
		this._schema = typeof _schema === 'string' ? ExtractSchema( _schema ) : _schema
	}

	sync(key,value) {

		this.say(`set ${key}: ${value}`)
		SetPropertyFromString( key, value, this.instance )
		this.adjustmentsStore[key,value]
	}

	syncProps() {
		for (const [key,value] of Object.entries(this.adjustmentsStore)) sync(key,value)
	}


	getInstance() {
		return this.instance
	}

	getTarget( id, backup ) {

		if (!id && !backup) {
			return
		} else if (typeof id !== 'string') {
			this.say(`🚨 target is a vector`)
			return Vec3.Create(id)
		} else {

			const ref = this.getReference( id )
			if (!ref && backup) {
				this.say(`target ref not found, using backup`)
				return Vec3.Create(id)
			} else if (ref.type() === 'Point') {
				return ref
			} else if ( ref.position ) {
				return this.getTarget( ref.position, backup )
				return Vec3.Create( backup )
			} else {
				this.say(`not target ref or vector`)
				return null
			}
		}
	}

	getReference( id ) {
		return this.references.get( id )
	}
	setReference( id, object ) {
		return this.references.set( id, object )
	}
	deleteReference( id ) {
		return this.references.delete( id )
	}

	getEngine() {
		return this.references ? this.references.get('engine') : null
	}


	getCanvas() {
		return this.getEngine().canvas
	}
	getEngineWidth() {
		return this.getEngine().canvas.clientWidth
	}
	getEngineHeight() {
		return this.getEngine().canvas.clientHeight
	}
	getScene() {
		const engine = this.getEngine()
		const { index } = engine
		const scene = engine?.instance?.scenes?.[index]
		return scene
	}

	getSendContext() {
		return self
	}

	say( ...message ) {
		if (this.debug) SAY(`~ ~ ~ ${this.type()}`, ...message)
	}
	alert( ...message ) {
		SAY(`~ ~ ~ ${this.type()} 🚨`, ...message)
	}

	syncToWorkspace() {}

	setChild( child ) {
		this.children = { ...this.children, [child.id()]: child }
	}
	setParent( parent ) {
		this.parent = parent
	}

	constructor( id, debug, parent, references ) {

		this.debug = debug
		this.#type = this.constructor.name
		this.#id = references ? UniqueId( id || this.constructor.name.toLowerCase(), references.all ) : id

		this.references = references
		
		if (!references) {
			SAY(`no references`)
		} else {
			this.setReference( this.id(), this )
		}



		if (parent) {
			parent = this.getReference( parent )
			this.setParent( parent )
			this.parent.setChild( this )
			if (this.debug) this.say(`👪 set parent ${parent.id()} -> ${this.id()}`)
		} else {
			this.alert(`no parent for ${this.type()} ${this.id()}`)
		}

		this.syncToWorkspace()

		if (this.debug) this.say(`🟢 -> [${this.type()}] ${this.id()}`)

	}

	send( action, ...data ) {
		const context = this.getSendContext()
		if (!context) return this.say(`🚨 no context for sending from: ${this.id()}`)

		// convert any weird types

		data = data.map( item => {
			return data?.toObject ? data.toObject() : (typeof item === 'object' && !Array.isArray(item)) ? { ...item } : item
		})
		try {
			const message = { action, id: this.id(), constructor: this.type(), data, type: '3d' }
			context.postMessage( message )
		} catch(err) {
			SAY(`❌ ❌ ❌ error posting message: ${action} ${err.message}`, data)
			console.error(err)
		}
	}

	
	searchIterator( callback, loop = {}, depth = 0 ) {

		// just pass a callback, and get back: { object, depth, index }

		if (!loop.object) loop.object = this
		if (!loop.index) loop.index = 0

		callback( { ...loop, depth } )

		for ( const child of Object.values(loop.object.children || {})) {
			loop.index += 1
			loop.object = child
			this.search( callback, loop, depth + 1 )
		}
	}

	onInited() {
		SAY(`✅ ${this.id()} inited`)
		this.inited = true
	}


	getAllChildren() {
		let list = Object.values(this.children)
		for (const item of list) list = [ ...list, ...item.getAllChildren() ]
		return children
	}


	dispose() {

		for (const [key,child] of Object.entries(this.children)) {
			this.say(`🍄 🍄 🍄 ----> deletes ${key}`)
			child.dispose()
		}
		// if (this.children.size === 0) this.say(`🥀 has no child elements to delete`)
		if (this.debug) this.say(`🔴 <- [${this.type()}] ${this.id()}`)
		const actions = [ 'terminate', 'destroy', 'dispose', 'remove' ]
		for (const action of actions) {
			if (this?.instance?.[action]) {
				this.instance[action]()
				this.say(`🚩 ${this.id()} instance: ${action}`)
			}
		}
		if (this.parent) delete this.parent.children[ this.id() ]
		this.deleteReference( this.id() )

	}




}