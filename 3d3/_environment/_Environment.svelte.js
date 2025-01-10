/* ====================================== */
/*                                        */
/*         	    ENVIRONMENT               */
/*                                        */
/* ====================================== */

import { browser } from '$app/environment'
import Entity from '../_Entity.svelte.js'
import Library from './_Library.svelte.js'

import keys from '$keys'

// #define JAVASCRIPT

export default class Environment extends Entity { // Base.setProps syncs to props definition here

	lib = new Library() // main

	selected = new Library()
	hovered = new Library()
	soloed = new Library()
	muted = new Library()

	constructor( id, debug ) {
		super( id, debug )

		this.inited = true

		SAY('🔰 ENVIRONMENT', this.debug, debug)
	}

	set( object ) {
		this.lib.set( object )
	}
	delete( object ) {
		this.lib.delete( object )
	}


	// updateBoundingBoxes() {

	// 	for (const [id, entity] of this.all.entries()) {
	// 		if (entity.instance) {
	// 			entity.instance.showBoundingBox = this.selected.includes( id )
	// 		}
	// 	}
	// }

	// isSelected( object ) {
	// 	return this.selected.includes(object.id())
	// }

	// select( object ) {
	// 	if (!this.isSelected( object )) this.selected.push( object.id() )
	// }

	// unselect( object ) {
	// 	if (this.selected.length <= 1 ) return 
	// 	this.selected = this.selected.filter( id => id !== object.id() )
	// }

	// toggleSelect( object ) {
	// 	this.isSelected( object ) ? this.unselect( object ) : this.select( object )
	// }

	// handleItemPressed( object ) {

	// 	const isShift = keys.has( keys.SHIFT )
	// 	const isAlt = keys.has( keys.ALT )
	// 	const isPrimary = keys.has( keys.PRIMARY )

	// 	if (!isShift && !isPrimary) {
	// 		this.selected = [ object.id() ]
	// 	} else if (isShift) {
	// 		const startId = this.selected?.[0] || this.id()
	// 		const endId = object.id()
	// 		let capturing = false
	// 		let reverse = false
	// 		this.search(item => {
	// 			const isStart = item.object.id() === startId
	// 			const isEnd = item.object.id() === endId
	// 			if (isEnd && !capturing) reverse = true
	// 			if (isStart || isEnd) capturing = true
	// 			if (capturing) this.select( item.object )
	// 			if ( (isStart && reverse) || (isEnd && !reverse) ) capturing = false
	// 		})

	// 	} else if (isPrimary) {
	// 		this.toggleSelect( object )
	// 	}

	// }

}


