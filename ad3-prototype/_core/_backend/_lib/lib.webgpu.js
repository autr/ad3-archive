/* ====================================== */
/*                                        */
/*         	   BABYLON (ENGINE)           */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

let glslangInited = false
let twgslInited = false

export async function WebGPUConfig( currentlyInsideWorker, debug ) {

	const context = currentlyInsideWorker ? 'WORKER' : 'WINDOW'

	if (!glslangInited) {

		globalThis.glslangWasm = (await import('./wa.glslang.wasm?url')).default
		globalThis.glslang = (await import('./wa.glslang.js')).default
		globalThis.glslangModule =  await globalThis.glslang(globalThis.glslangWasm)
		glslangInited = true

		SAY(`🟩🟩🟩 GLSLANG (${context})`)
	}

	if (!twgslInited) {
		globalThis.twgslWasm = (await import('./wa.twgsl.wasm?url')).default
		globalThis.twgsl = (await import('./wa.twgsl.js')).default
		globalThis.twgslModule =  await globalThis.twgsl(globalThis.twgslWasm)
		twgslInited = true

		SAY(`🟩🟩🟩 TWGSL (${context})`)
	}

	return {
		twgslOptions: { twgsl: globalThis.twgslModule },
        glslangOptions: { glslang: globalThis.glslangModule }
	}

}

export async function CreateEngine( canvas, useWebGPU, currentlyInsideWorker, debug ) {
	
	return new Promise( async (resolve,reject) => {

		try { 
			if (!canvas) throw `❌ no canvas`

			const options = {
				stencil: true,
				antialias: true,
			}

			if ('gpu' in navigator && useWebGPU) {
				SAY(`🌁 FETCH GPU / WASM`)

				const webgpuConfig = await WebGPUConfig( currentlyInsideWorker, debug )
				const engine = new BB.WebGPUEngine( canvas, options)

				SAY(`🌁 INIT GPU / WASM`)

				await engine.initAsync(
					{ ...webgpuConfig.glslangOptions },
					{ ...webgpuConfig.twgslOptions }).catch(err => {
					SAY(`❌ ${err.message}`)
					reject(err)
				})

				SAY(`✅ GLSLANG / TWGSL and WebGPU`)

				resolve( engine )
			} else {
				const engine = new BB.Engine( canvas, true, options)
				resolve(engine)
			}
		} catch(err) {
			reject(err)
		}
	})
}