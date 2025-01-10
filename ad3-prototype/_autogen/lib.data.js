// #define JAVASCRIPT
// #define SVELTEKIT

const overrideDebug = false

export function OnDestroy(liveData, parentData) {
	const index = parentData.children.indexOf(liveData)
	if (index > -1) {
		parentData.children.splice(index, 1)
	}
}

export function InitialiseData( data, inputData, parentData ) {

	const debug = overrideDebug

	if (debug) SAY(`🌝 InitialiseData ${parentData.uid} ->`, inputData.id || inputData.uid || data.uid || '')
	if (!parentData.children) parentData.children = []
	parentData.children.push(data)
	// SAY(`🟢 <${data.object} />`)
	return parentData.children[parentData.children.length-1]
}

export function ShouldRenderChildren( data, store, children, inputData, parentData ) {

	const debug = overrideDebug

	const notEngine = data.object !== 'Engine'
	const notScene = data.object !== 'Scene'
	const hasEngineProxy = store.engineProxy ? true : false
	const isInited = data.inited ? true : false
	const hasChildrenHTML = children ? true : false
	const isReady = (notEngine || (hasEngineProxy && isInited)) && children
	if (debug) SAY('🌝 ShouldRenderChildren ->', data.object, isReady ? '🟢' : '🔴', '\n', 
		Stringify({ notEngine, notScene, hasEngineProxy, isInited, hasChildrenHTML }))
	return isReady
}


export function SetParentReference( parentUid, data, inputData ) {
	const debug = overrideDebug
	if (debug) SAY(`🌝 SetParentReference ${parentUid} ->`, inputData.id || data.uid || '')
	data.parent = parentUid
}

export function ProcessData( data, inputData ) {
	
	for (const [key,value] of Object.entries(inputData)) {
		if (untrack( () => data[key] ) !== value && !key.includes('$')) {
			data[key] = value
		}
	}
	data.attributes = { ...inputData }
}
