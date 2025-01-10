/* ====================================== */
/*                                        */
/*         	      FACE PROXY              */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { CreateMultiColorMaterial } from '$ad3_core_backend_shaders'

const loaders = {}

function SplitPath(str) {
	const lastSlashIndex = str.lastIndexOf('/')
	const path = str.substring(0, lastSlashIndex) + '/'
	const filename = str.substring(lastSlashIndex + 1)
	return { path, filename }
}

export default class Loader extends Proxy {

	type = 'Loader'
	activeMeshRefs = { meshes: [] }
	material = null

	setup( data ) {

		return new Promise( async (resolve,reject) => {
			this.uid = data.uid

			let loader = null

			if (!this.node) this.node = new BB.TransformNode()
			if (!this.material) this.material = CreateMultiColorMaterial()
			// this.node.scaling = new Vec3(1)

			const { file } = data
			const { path, filename } = SplitPath( file )

			if (Object.keys(loaders).length === 0) {
				loaders.gltf = new BB.GLTFFileLoader()
				loaders.obj = new BB.OBJFileLoader()
				loaders.splat = new BB.SPLATFileLoader()
				loaders.stl = new BB.STLFileLoader()
			}

			if (file.endsWith('gltf')) loader = loaders.gltf
			if (file.endsWith('obj')) loader = loaders.obj
			if (file.endsWith('splat')) loader = loaders.splat
			if (file.endsWith('stl')) loader = loaders.stl

			if (!loader) return SAY(`❌ NO LOADER FOR ${file}`)

			const response = await fetch( file )
			const fileContents = await response.text()

			const vertexData = new BB.VertexData()
			loader.DO_NOT_ALTER_FILE_COORDINATES = false
			loader.importMesh( filename, this.$getSceneInstance(), fileContents, '', this.activeMeshRefs.meshes )

			for (const mesh of this.activeMeshRefs.meshes) {
				mesh.material = this.material
				mesh.computeWorldMatrix(true)
			}

			resolve(uid)
		})
	}

	setColors( ft, fb, base, scale ) {
		this.material.setColors( ft, fb, base, scale )
	}
	setBiasPower( bias, power ) {
		this.material.setBiasPower( bias, power )
	}



}

