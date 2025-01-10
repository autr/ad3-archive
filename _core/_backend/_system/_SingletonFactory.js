
// #define JAVASCRIPT

class SingletonFactory {
	items = new Map()
	payloads = new Map()

	enabled = false

	constructor() {
		this.tick = this.tick.bind(this)
	}

	create( uid, singleton, isWorker ) {

		const type = singleton

		this.items.set( uid, {
			singleton,
			payloads: new Map(),
			isWorker
		})

		SAY(`✅`, uid, isWorker ? '🦾 WORKER' : '💪 LOCAL')

		if (!this.enabled) {
			this.enabled = true
			this.tick()
		}

		return this.items.get(uid)
	}

	tick() {

		for (const [ key, { payloads, singleton }] of this.items.entries()) {
			const loads = Array.from( payloads.values() )
			if (loads.length > 0 ) singleton.RunMethodPayloads( loads )
			payloads.clear()
		}
		requestAnimationFrame( this.tick )
	}

	terminate( uid ) {

		// for (const singleton of Object.values(globalThis.items) ) singleton.worker.terminate()
	}

	// setPayload( uid)

	getByProxy( proxy ) {

		if (!proxy?.engineWorkerUid) return SAY(`❌ no engineWorkerUid reference:`, proxy.uid, proxy.type)
		return this.getByUid(proxy?.engineWorkerUid)
	}
	getByUid( uid ) {
		const item = this.items.get(uid)
		if (!item) return SAY(`❌ no worker with uid ${uid}:`)
		return item
	}
}

export const factory = new SingletonFactory()
