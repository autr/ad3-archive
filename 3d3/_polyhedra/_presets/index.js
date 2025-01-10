import { default as platonic } from './lib.platonic.js'
import { default as archimedean } from './lib.archimedean.js'
import { default as catalan } from './lib.catalan.js'

class Preset {
	config = {}
	constructor( config ) {
		this.config = config
	}

	descriptor() {
		const { group, id, symbols } = this.config
		return `[${group}] ${id} (${symbols})`
	}
}

class Presets {

	presets = new Map()

	constructor(struct) {
		for (const [group, list] of Object.entries(struct)) {

			list.forEach( (preset,index) => {
				preset.group = group
				preset.index = index
				this.add( preset )
			})
		}
	}

	add(config) {
		const { id } = config
		this.presets.set( id, new Preset( config ) )
	}

	descriptors() {
		return Array.from( this.presets ).map( ([id,preset]) => preset.descriptor() )
	}

	options() {
		let options = {}
		for (const [id,preset] of this.presets.entries()) options[id] = preset.descriptor()
	}
}

const presets = new Presets( { platonic, archimedean, catalan } )

export default presets
