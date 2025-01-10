/* ====================================== */
/*                                        */
/*         	       LIBRARY                */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

const TIMEOUT = 100

export default class Library {

	life = $state(new Map())
	death = $state(new Map())

	grouped = $state(new Map())
	all = $state.raw(new Map())

	#id = null

	reference = null
	timestamp = null
	tallying = false

	constructor( id, debug ) {
		this.#id = id
		this.debug = debug
	}

	id() { return this.#id }

	set( object ) {

		// class name and id

		const name = object.constructor.name
		const id = object.id()

		// create groups

		if (!this.grouped.has(name)) this.grouped.set(name, new Map())
		if (!this.life.has(name)) this.life.set(name, 0)

		// set references

		this.grouped.get(name).set( id, object )
		this.all.set( id, object )
		this.all = new Map( [...this.all ])
		this.life.set(name, this.life.get(name) + 1 )

		// fin

		if (this.debug) SAY(`📚 SET: ${name} (${id})`)
		this.printf()

		object.library = this
		SAY("ADDED ", object.id())
	}
	delete( object ) {
		const name = object.constructor.name
		const id = object.id()

		if (!this.death.has(name)) this.death.set(name, 0)

		this.grouped.get(name).delete( id )
		this.all.delete( id )
		this.death.set(name, this.death.get(name) + 1 )

		if (this.debug) SAY(`🏴‍☠️ REMOVE: ${name} (${id})`)
		this.printf()
	}

	getGroup( object ) {
		return this.grouped.get( object.constructor.name )
	}
	get( object ) {
		return this.all.get( typeof object === 'string' ? object : object.id() )
	}


	printf() {

		if (!this.tallying) this.timestamp = new Date()
		this.tallying = true

		if (this.reference) clearTimeout( this.reference )

		this.reference = setTimeout( () => {

			const config = {
				LIFE: {
					emoji: '🐣',
					items: this.life
				},
				DEATH: {
					emoji: '🏜️',
					items: this.death
				}
			}

			let something = false
			let message = ''

			for (const [type, {emoji, items}] of Object.entries(config)) {

				if (items.size > 0) {

					message += ` ${emoji} `

					const tally = []
					for (const [type, count] of items.entries()) tally.push( `${count} ${type}` )

					message += tally.join(', ')
				}

			}

			message = `--- ⏳ TIME ${new Date() - this.timestamp}ms` + message
			message += ' ---'

			SAY(message)

			this.life.clear()
			this.death.clear()
			this.tallying = false

		}, TIMEOUT )
	}
}