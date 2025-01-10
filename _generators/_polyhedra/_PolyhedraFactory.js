import PolyhedraWorker from './worker.polyhedra.js?worker'

// #define JAVASCRIPT

const RESOLUTION = 100

export class PolyhedraFactory {

	worker = null
	cache = new Map()
	callbacks = new Map()
	counters = new Map()

	onWorkerMessage( e ) {
		const { uid, index, callbackUid } = e.data
		const callback = this.callbacks.get( callbackUid )
		if (!callback) return SAY(`❌ NO CALLBACK FOR ${callbackUid}`)

		this.cache.set( callback.cacheUid, e )
		this.callbacks.delete( callbackUid )

		callback.resolve( e )
	}

	onWorkerError( err ) {
		SAY(`❌ ERROR (CANCELLING ALL)`, err)
		for (const { reject } of Object.values(this.callbacks) ) reject(null)
		this.callbacks.clear()
	}

	requestPolyhedra( uid, data ) {

		return new Promise((resolve,reject) => {

			data.formula = data.formula.map( num => parseInt(Math.round(num * RESOLUTION))/RESOLUTION )

			const cacheUid = Stringify( data )
			const cacheItem = this.cache.get( cacheUid )

			if (cacheItem) return resolve( cacheItem )

			if (!uid) {
				SAY(`❌ MUST HAVE UID`)
				return reject(null)
			}

			if (!this.worker) {
				this.worker = new PolyhedraWorker()
				this.worker.onmessage = this.onWorkerMessage.bind(this)
				this.worker.onerror = this.onWorkerError.bind(this)
			}

			if (!this.counters.has(uid)) this.counters.set(uid, 0)

			const index = this.counters.get(uid) + 1
			this.counters.set( uid, index )

			const callbackUid = uid + '_' + index

			this.callbacks.set( callbackUid, { resolve, reject, cacheUid } )
			this.worker.postMessage( { ...data, uid, index, callbackUid } )
		})
	}
}

export const polyhedraFactory = new PolyhedraFactory()