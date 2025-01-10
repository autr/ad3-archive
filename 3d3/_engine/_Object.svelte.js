/* ====================================== */
/*                                        */
/*         	    OBJECT SVELTE             */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { UniqueId } from './lib.lifecycle.js'
import ObjectJavascript from './_Object.js'
import { SetPropertyFromString, GetPropertyFromString } from '$root/lib.essential.js'
import { Vec3 } from '$3d1_points'


class Tree {
	parent = $state({})
	children = $state({})
	constructor ( parent ) {
		this.parent = parent
	}

}

export default class ObjectSvelte extends ObjectJavascript {

	inited = $state(false)
	props = $state({})
	
	_children = $state({})

	tree = $derived.by( () => {
		const properties = {}
		for (const id of Object.keys( this._children ) ) properties[id] = this._children[id].tree
		return {
			type: 'object',
			properties
		}
	})

	schema = $derived.by( () => {
		return this._schema
	})

	setChild( child ) {
		super.setChild( child )
		this._children = { ...this._children, [child.id()]: child }
	}


	setParentChild( parent ) {

		if (parent) {
			parent = this.getReference( parent )
			if (this.debug) this.say(`👪 set parent ${parent.id()} -> ${this.id()}`)
			this.parent = parent
			this.parent.children[ this.id() ] = this
		}
	}

	setDebug( bool ) {
		this.debug = bool
		this.send( 'setDebug', this.debug )
	}

	sync( key, value, effectCallback ) {


		SetPropertyFromString( key, value, this.props )

		const isFunction = typeof effectCallback === 'function'
		const isCustom = typeof effectCallback === 'string'
		const id = effectCallback?.name || effectCallback || ''

		this.say(`🚀 configure ${key} sync: ${id}`)

		return () => {
			const prop = GetPropertyFromString( key, this.props)
			if (!this.inited || prop === undefined) return
			this.say(`🫐 ${isFunction ? '[function]' : isCustom ? '[custom]' : '[sync]'} ${id}: ${key}`, prop)
			if (isFunction) return effectCallback( prop )
			if (isCustom) return this.send( effectCallback, prop )
			this.send( 'sync', key, prop )
		}
	}

	sendVector( key, value ) {
		this.send( 'syncVector', key, Vec3.Create( value ).toObject() )
	}

	say( message ) {
		if (this.debug) SAY(`////// ${this.type()}`, message)
	}

	alert( ...message ) {
		SAY(`////// ${this.type()} 🚨`, ...message)
	}
	getScene() {
		let i = 0
		let nominate = this
		while( nominate?.parent ) {
			nominate = nominate.parent
			if (nominate.type() === 'Scene') return nominate
			i += 1
		}
		this.say(`❌ could not find scene (${i} travelled)`)
		return null
	}

	getSendContext() {
		const engine = this.getEngine()
		return engine ? engine.worker : null
	}

	dispose() {
		super.dispose()
		this.send( 'dispose' )
	}

}

