globalThis.$state = v => v

import Wythoff from './_generator/lib.wythoff.js'
const wythoff = new Wythoff()

globalThis.onmessage = (event) => {

	wythoff.syncSettings( event.data  )
	globalThis.postMessage(  wythoff.generatePolyhedron() )

}
