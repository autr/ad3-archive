/* ====================================== */
/*                                        */
/*         	   BABYLON INDEX              */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

// export * from './lib.preload.js'

export async function PreloadBabylon( fromOrigin ) {
	const timestamp = new Date()
	return new Promise( async (resolve,reject) => {

		if (globalThis.BB) return resolve( globalThis.BB )

		const BB = await import('./lib.preload.js')
		globalThis.BB = BB

		const elapsed = new Date() - timestamp 
		SAY(`✅ BABYLON PRELOAD: ${elapsed}ms`, fromOrigin || '')
		return resolve( globalThis.BB )
	})
}


export async function LoadBabylonFull( fromOrigin ) {
	const timestamp = new Date()
	return new Promise( async (resolve,reject) => {

		if (globalThis.BB) return resolve( globalThis.BB )

		const BB = await import('./lib.babylon.js')
		globalThis.BB = BB

		const elapsed = new Date() - timestamp 
		SAY(`✅ BABYLON FULL: ${elapsed}ms`, fromOrigin || '')
		return resolve( globalThis.BB )
	})
}

export * from './lib.webgpu.js'
export * from './lib.events.js'