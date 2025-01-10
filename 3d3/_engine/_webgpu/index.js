// #define JAVASCRIPT

import { WebGPUEngine, Engine } from '@babylonjs/core'

const GL_LOCAL = './glslang.wasm?url'
const TW_LOCAL = './twgsl.wasm?url'
const GL_STATIC = '/babylon/glslang.wasm?url'
const TW_STATIC = '/babylon/twgsl.wasm?url'

export let staticWebGPU = null
export let engine = null


const IF_WORKER = (self instanceof WorkerGlobalScope)

const say = (...message) => {
	SAY('~ ~ [thread] ~ ~', ...message)
}

export async function FetchWebGPUWASM( debug ) {
	if (staticWebGPU) return staticWebGPU 

	let glJS = await import ('./glslang.js')
	let glUrl = await import( './twgsl.js' )

	let glModule = await glslang( GL_STATIC )
	let twModule = await twgsl( TW_STATIC )

	staticWebGPU = {
		glslangOptions: {
			glslang: glModule,
		},
		twgslOptions: {
			twgsl: twModule,
		}
	}

	if (debug) say(`👔 WASM`)
	return staticWebGPU
}


export async function CreateEngine( canvas, debug ) {
	
	return new Promise( async (resolve,reject) => {


		if (engine) return resolve(engine)

		try { 
			if (!canvas) throw `❌ no canvas`
			if ('gpu' in navigator) {
				if (debug) say(`🌁 attempting WebGPU components`)

				const webgpuConfig = await FetchWebGPUWASM( debug )

				engine = new WebGPUEngine( canvas )

				await engine.initAsync(
					{ ...webgpuConfig.glslangOptions },
					{ ...webgpuConfig.twgslOptions }).catch(err => reject(err))

				if (debug) say(`✅ loaded GLSLANG / TWGSL and WebGPU`)
				resolve( engine )
			} else {
				if (debug) say(`🏞️ falling back to WebGL`)
				engine = new Engine( canvas, true)
				resolve(engine)
			}
		} catch(err) {
			reject(err)
		}
	})
}