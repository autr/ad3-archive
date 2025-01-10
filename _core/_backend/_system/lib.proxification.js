/* ====================================== */
/*                                        */
/*         	   PROXIFICATION              */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT
// #define SVELTEKIT

import * as comlink from 'comlink'

import { SingletonLocal } from './_SingletonLocal.js'
import SingletonWorker from './_SingletonWorker.js?worker'
import { factory } from './_SingletonFactory.js'

// useWorker
// useWebGPU


const DEBUG_SPEED = false
const OFFSCREEN = true

export function UntrackDeproxifyArguments( arg ) {

	if (Array.isArray(arg)) return [ ...untrack( () => arg ) ].map( a => UntrackDeproxifyArguments(a) )
	if (arg instanceof Object && !arg?.tagName) {
		let o = {}
		for (const [key, value] of Object.entries( untrack( () => arg )) ) o[key] = UntrackDeproxifyArguments(value)
		return o
	}
	return untrack( () => arg )
}

let isLoadingBabylon = false
					
export function Proxification( object ) {

	// ------ PROPS 2 LEVELS ------

	let proto = Object.getPrototypeOf( object )
	let props = Object.getOwnPropertyNames(proto)
	proto = Object.getPrototypeOf( proto )
	props = props.concat(Object.getOwnPropertyNames(proto))
	proto = Object.getPrototypeOf( proto )
	props = props.concat(Object.getOwnPropertyNames(proto))

	for (const prop of props) {

		const isFunction = typeof object[prop] === 'function'
		const isConstructor = prop !== 'constructor'
		const isNotPrivate = prop[0] !== '$'

		if (isFunction && isConstructor && isNotPrivate) {

			const original = object[prop]

			object[prop] = async (...rawArgs) => {

				return new Promise( async (resolve,reject) => {

					const debug = false
					const untrackArgs = UntrackDeproxifyArguments( rawArgs )

					// ------------ WORKER ------------

					if (OFFSCREEN) {

						if (prop === 'initialiseEngine') {

							// ------ CREATE WORKER ------

							const uid = untrackArgs[0]
							const useWorker = untrackArgs[1]
							const debug = untrackArgs[2]


							const singleton = useWorker ? comlink.wrap( new SingletonWorker() ) : new SingletonLocal()

							factory.create( uid, singleton, useWorker )

							// ------ SET UID ------

							if (debug) SAY(`🌞 🏭 InitialiseEngine`, uid)

							object.engineWorkerUid = uid
							object.uid = uid

							return factory.getByUid(uid).singleton.InitialiseEngine( uid, useWorker, debug )
							.then(resolve)
							.catch(err => {
								SAY(`❌ initialiseEngine / InitialiseEngine`, {err,untrackArgs})
								reject(err)
							})


						} else if (prop === 'initialiseWithEngine') {

							// ------ CREATE OBJECT ------

							const uid = untrackArgs[0]
							const engineProxy = untrackArgs[1]
							const debug = untrackArgs[2]
							const type = object.type

							if (!engineProxy) SAY(`❌ no engineProxy`, uid, engineProxy, type)

							// ------ SET UID ------

							untrackArgs[1] = engineProxy.engineWorkerUid
							object.engineWorkerUid = engineProxy.engineWorkerUid
							object.uid = uid

							if (debug) SAY(`🌞 InitialiseWithEngine`, uid, type)

							return factory.getByProxy(object).singleton.InitialiseWithEngine( type, uid, debug )
							.then(resolve)
							.catch(err => {
								SAY(`❌ initialiseWithEngine / InitialiseWithEngine`, {err,untrackArgs})
								reject(err)
							})
						} else if (prop === 'setupEngineAndCanvas') {

							if (debug) SAY(`🌞 🖼️ SetupEngineAndCanvas`)

							const canvas = untrackArgs[1]
							const item = factory.getByProxy(object)

							if (item.isWorker) {
								SAY(`🛩️ TRANSFER OFFSCREEN`)
								let offscreen = document.createElement('canvas')

								offscreen.setAttribute( 'id', canvas.id + '-offscreen')
								offscreen.setAttribute( 'width', canvas.offsetWidth )
								offscreen.setAttribute( 'height', canvas.offsetHeight )
								canvas.parentNode.appendChild( offscreen )
								offscreen = offscreen.transferControlToOffscreen()
								untrackArgs[1] = comlink.transfer(offscreen, [offscreen])
							}

							return item.singleton.SetupEngineAndCanvas( ...untrackArgs )
							.then(resolve)
							.catch(err => {
								SAY(`❌ setup / Engine / SetupEngineAndCanvas`, {err, untrackArgs})
								reject(err)
							})
						} else if ( prop.includes('Callback')) {
							const item = factory.getByProxy(object)
							const callback = item.isWorker ? comlink.proxy( rawArgs[0] ) : rawArgs[0]
							SAY(`🤘 ENABLING CALLBACK:`, prop)
							return item.singleton.RunCallbackMethod( object.uid, prop, callback )
						} else {

							if (prop === 'setDebug') object.debug = untrackArgs[0]
							if (object.debug) SAY(`⚪️ ${object.type} ${object.uid} -> ${prop}`)

							const payload = { uid: object.uid, methodName: prop, untrackArgs }

							if (prop.includes('immediate')) {

								if (DEBUG_SPEED) SAY('IMMEDIATE ----->', (new Date()).getTime()% 10000, prop)
								return factory.getByProxy(object).singleton.RunMethod( payload.uid, payload.methodName, payload.untrackArgs )
								.then(resolve)
								.catch(err => {
									SAY(`❌ RunMethod: ${prop}`, {err, untrackArgs})
									reject(err)
								})

							} else {
								if (DEBUG_SPEED) SAY('PAYLOAD ----->', (new Date()).getTime()% 10000, prop)
								factory.getByUid( object.engineWorkerUid ).payloads.set( object.uid + '.' + prop, payload )
								return resolve()
							}
							
						}
					} else {

						// ------------ STANDARD ------------

						const res = original.call( object, ...untrackArgs )
						return resolve(res)
					}
				})
			}
		}
	}

	return object
}

