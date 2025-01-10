import { CreateTubeVertexData, ConvertOptions } from './lib.tubular.js'

self.onmessage = function (e) {
	let { method, id, options } = e.data

	options = ConvertOptions( options )
	const data = CreateTubeVertexData( options )
	const { indices, normals, positions, uvs } = data
	self.postMessage( { indices, normals, vertices: positions, uvs } )

}