import Proxy from '$ad3_core_backend/_Proxy.js'
import JSON5 from 'json5'
const Parse = obj => JSON5.parse(obj, null, '\t')
const Stringify = obj => JSON5.stringify(obj, null, '\t')

import { Vec2, Vec3, Vec4 } from '$ad3/_Vec.js'
// import { Vector2, Vector3, Vector4, Color3, Color4, EngineConstants, MeshConstants } from '$ad3_core_backend_lib'

import { CreateLogger } from '$_lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url, {
	prepend: '>>>',
	color: 'stormygray'
})

globalThis.defineComp3DInited = 'defineComp3DInited has been inited'