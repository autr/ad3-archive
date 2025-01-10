import { browser } from '$app/environment'
import { createEventDispatcher, untrack } from 'svelte'
import { onMount, onDestroy, setContext, getContext } from 'svelte'
import JSON5 from 'json5'

import { CreateLogger } from '$_lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url, {
	prepend: '',
	color: 'darkslategrey'
})

const Parse = obj => JSON.parse(obj, null, '\t')
const Parse5 = obj => JSON5.parse(obj, null, '\t')
const Stringify = obj => JSON.stringify(obj, null, '\t')
const Stringify5 = obj => JSON5.stringify(obj, null, '\t')

import { Vec2, Vec3, Vec4 } from '$ad3/_Vec.js'
// import { Vector2, Vector3, Vector4, Color3, Color4, EngineConstants, MeshConstants } from '$ad3_core_backend_lib'

import LabelNode from '$ad3_sketch/_LabelNode.svelte'
import GraphicNode from '$ad3_sketch/_GraphicNode.svelte'
import GUINode from '$ad3_sketch/_GUINode.svelte'

import { GUI } from '$gui'
import { DEFAULTS } from '$ad3/defs.js'
import { GenerateUID } from '$ad3_libs/index.js'
import { GetCreatorChain } from '$ad3_libs/index.js'
import { Proxification } from '$ad3_core_backend_system'

const lookup = getContext('lookup')
const groups = getContext('groups')
const store = getContext('store')
const elements = getContext('elements')
const getSysParent = getContext('getSysParent')
let sysParent = getSysParent ? getSysParent() : null

setContext('getSysParent', () => data.uid)

let onDestroyCallback = () => {}
let disposing = $state(false)

let {
	data = $bindable({}),
	children
} = $props()

if (!store.engineProxy && data.object !== 'Engine') SAY(`❌ Engine is not initialised yet`)

onDestroy( async () => {
	// SAY('🔴 ->', data.id)
	data.inited = false
	data.disposing = true
	disposing = true
	DisableRefs()
	onDestroyCallback()
	if (proxy.dispose) proxy.dispose()
	if (proxy.immediateDispose) proxy.immediateDispose()
})

function Q( value ) {
	if (typeof value === 'function') return value( data )
	return value
}

function InitialiseUID( objectTypeName ) {
	if (data.id === undefined) data.id = (objectTypeName || proxy.type)
	data.uid = GenerateUID( data.id, lookup )
	data.object = objectTypeName || proxy.type
	lookup.set(data.uid, data)
	if (data.debug) SAY(`🔵 INITED ${data.uid} ${data.object}`)
}


function DisableRefs() {
	if (lookup.get(data.uid)) delete lookup.delete(data.uid)
	if (groups?.[data.object]?.[data.uid]) delete groups[data.object][data.uid]
	if (data.debug) SAY(`🔴 DISABLING ${data.uid}`)

}
function EnableRefs() {
	// SAY(`ENABLING REFS: ${data.uid}`)
	data.inited = true
	data.disposing = false
	disposing = false
	lookup.set( data.uid, data )
	if (!groups[data.object]) groups[data.object] = {}
	groups[data.object][data.uid] = lookup.get( data.uid )
	if (proxy?.setSysParent && proxy?.type !== 'Engine') proxy.setSysParent( sysParent, data.sysParent )
	if (data.debug) SAY(`🟢 ENABLING ${data.uid}`)
}

function SetDefaults( _data ) {
	const all = {
		...DEFAULTS.ALL,
		..._data
	}
	for (const [key,value] of Object.entries(all)) {
		if (data[key] === undefined) data[key] = value
	}
}

function WhenReady() {
	if (!data.inited) return
	this()
}

$effect( WhenReady.bind(() => {
	if (proxy?.setDebug) proxy.setDebug( data.debug )
}))
