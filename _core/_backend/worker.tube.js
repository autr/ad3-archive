import { CreateTubeVertexData } from './lib.tubular.js'

globalThis.onmessage = function (e) {
	let { method, id, options } = e.data
	const data = CreateTubeVertexData( options )
	const { indices, normals, positions, uvs } = data
	globalThis.postMessage( { indices, normals, vertices: positions, uvs } )

}