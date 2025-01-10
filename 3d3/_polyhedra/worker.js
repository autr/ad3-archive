
import Wythoff from './_generator/lib.wythoff.js'

const wythoff = new Wythoff()

self.onmessage = (event) => {

	const { id, state, debug } = event.data 

	wythoff.syncSettings( state )
	const data = wythoff.generatePolyhedron(id, debug )

	self.postMessage( data )
}