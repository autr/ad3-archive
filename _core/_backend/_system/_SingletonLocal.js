import { LoadBabylonFull } from '$ad3_core_backend_lib/index.js'
import * as Proxies from '$ad3_core_backend/index.js'

import { CreateLogger } from '$_lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url, {
	prepend: '(local)',
	color: 'darkbluegray'
})

export const SingletonLocal = function( isWorker ) {
	const lookup = new Map()
	let engineProxy = null
	let debug = null
	let uid = null


	async function InitialiseEngine( uidInit, useWorker, debugInit ) {

		uid = uidInit
		debug = debugInit

		if (isWorker) {
			const BB = await LoadBabylonFull()
			globalThis.BABYLON = globalThis.BB = BB
		}

		engineProxy = new Proxies.Engine()
		lookup.set( uid, engineProxy )

		return await engineProxy.initialiseEngine( uid, lookup, debug )

	}

	async function SetupEngineAndCanvas( ...args ) {
		if (debug) SAY('🟢 🖼️ SetupEngineCanvas', args)
		return await engineProxy.setupEngineAndCanvas( ...args )
	}

	async function InitialiseWithEngine( type, uid, debug ) {

		if (!Proxies[type]) return SAY(`❌ NO PROXY ${type}`)
		const object = new Proxies[type]()
		lookup.set( uid, object )
		if (debug) SAY('🟢 InitialiseWithEngine', type, uid)
		return await object.initialiseWithEngine( uid, engineProxy, debug )
	}

	async function RunMethod( uid, methodName, untrackArgs, isFromPayload = false ) {
		const object = lookup.get( uid )
		if (!object) return SAY(`❌ NO OBJECT:`, uid, methodName, lookup)
		if (untrackArgs === undefined) SAY(`❌ NO ARGS:`, uid, methodName, untrackArgs, isFromPayload ? 'RunMethodPayloads' : 'Immediate')
		if (!object[methodName]) return SAY(`❌ NO METHOD: ${uid} ${methodName}`, object)
		return object[methodName]( ...untrackArgs )
	}

	async function RunMethodPayloads( payloads ) {
		// SAY('PAYLOAD', payloads)
		for (const {uid, methodName, untrackArgs} of payloads ) RunMethod( uid, methodName, untrackArgs, true )
	}


	async function RunCallbackMethod( uid, methodName, callback ) {
		if (debug) SAY('🟢 CALLBACK', methodName)
		return RunMethod( uid, methodName, [ callback ] )
	}

	return {
		InitialiseEngine,
		InitialiseWithEngine,
		RunMethod,
		RunMethodPayloads,
		SetupEngineAndCanvas,
		RunCallbackMethod
	}
}