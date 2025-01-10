/* ====================================== */
/*                                        */
/*               COMPONENT                */
/*                                        */
/* ====================================== */


import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)
import { createEventDispatcher, untrack } from 'svelte'


export default class DOM {

	element = $state()
	dimensions = $state({})
	debug = $state(false)

	getDimensions() { return this.dimensions }
	getWidth() { return this.dimensions.width }
	getHeight() { return this.dimensions.height }

	constructor() {

		$effect(() => this.#createObserver( this.element ))

	}

	#setDimensions( left, top, width, height ) {
		this.dimensions = { left, top, width, height }
	}

	#createObserver() {

		if (!this.element || this.observer) return

		this.observer = new ResizeObserver(entries => {

			if (!this.element) {
				delete this.observer
				return
			}
			for (let entry of entries) {
				let { left, top, width, height } = this.element.getBoundingClientRect()

				let offsets = {
					left: [ 'borderLeftWidth', 'paddingLeft' ],
					top: [ 'borderTopWidth', 'paddingTop' ],
					width: [ 'borderLeftWidth', 'paddingLeft', 'borderRightWidth', 'paddingRight' ],
					height: [ 'borderTopWidth', 'paddingTop', 'borderBottomWidth', 'paddingBottom' ]
				}

				const computed = getComputedStyle( this.element )

				for (let [name, keys] of Object.entries( offsets ) ) {
					offsets[name] = keys.map( name => {
						return parseFloat( computed[name] )
					}).reduce( (accumulator, value) => {
						return accumulator + value
					})
				}

				left += offsets.left
				top += offsets.top
				width -= offsets.width
				height -= offsets.height

				this.#setDimensions( left, top, width, height )

				if (this.debug) SAY(`📐 element set to ${parseInt(width)} x ${parseInt(height)}`)
			}
		})

		this.observer.observe( this.element )
	}

}