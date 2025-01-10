/* ====================================== */
/*                                        */
/*         	    REFERENCES                */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

const TIMEOUT = 100

export default class References {

	life = new Map()
	death = new Map()

	grouped = new Map()
	all = new Map()

	#id = null

	timeout = null
	timestamp = null
	tallying = false

	constructor( id, debug ) {
		this.#id = id
		this.debug = debug
	}

	id() { return this.#id }

	get( object ) {
		return this.all.get( typeof object === 'string' ? object : object.id() )
	}
	set( id, object ) {

		const name = object.constructor.name

		if (!this.grouped.has(name)) this.grouped.set(name, new Map())
		if (!this.life.has(name)) this.life.set(name, 0)

		// set references

		this.grouped.get(name).set( id, object )
		this.all.set( id, object )
		this.all = new Map( [...this.all ])
		this.life.set(name, this.life.get(name) + 1 )

		// fin

		if (this.debug) this.say(`📚 set reference: ${name} (${id})`)
		this.printf()

	}
	delete( id ) {


		requestAnimationFrame( () => {
			
			const name = this.all.get(id)?.constructor?.name
			if (!this.death.has(name)) this.death.set(name, 0)

			this.all.delete( id )
			const group = this.grouped.get(name)
			if (group) group.delete( id )
			this.death.set(name, this.death.get(name) + 1 )

			if (this.debug) this.say(`🏴‍☠️ remove reference: ${name} (${id})`)
			this.printf()
		})
	}

	getGroup( object ) {
		return this.grouped.get( object.constructor.name )
	}

	say( message ) {
		SAY(`${typeof this.debug !== 'boolean' ? this.debug : ''}${message}`)
	}

	printf() {

		if (!this.tallying) this.timestamp = new Date()
		this.tallying = true

		if (this.timeout) clearTimeout( this.timeout )

		this.timeout = setTimeout( () => {

			const config = {
				added: {
					emoji: '🐣',
					items: this.life
				},
				removed: {
					emoji: '🏜️',
					items: this.death
				}
			}

			let something = false
			let message = ''

			for (const [type, {emoji, items}] of Object.entries(config)) {

				if (items.size > 0) {

					message += ` ${emoji} ${type}: `

					const tally = []
					for (const [type, count] of items.entries()) tally.push( `${count} ${type}` )

					message += tally.join(', ')
				}

			}

			message = `⏳ ${new Date() - this.timestamp}ms` + message
			message += ''
			this.say(message)

			this.life.clear()
			this.death.clear()
			this.tallying = false

		}, TIMEOUT )
	}
}