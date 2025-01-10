/* ====================================== */
/*                                        */
/*         	     SHAPE PROXY              */
/*                                        */
/* ====================================== */

// #define PROXY3D

export default class Shape extends Proxy {

	fur = null
	type = 'Material'
	config = {}
	targets = []

	setup( uid, config, debug ) {

		this.uid = uid
		this.config = config

		const oldInstance = this.instance
		const scene = this.$getSceneInstance()

		const stringUID = JSON.stringify(config)

		let existingMaterial = this.$getEngineMaterialCache().get(stringUID)

		if (!existingMaterial) {

			const constructorName = Object.keys( BB ).find( name => {
				if (name.toLowerCase().substring(0,config.type.length) === config.type.toLowerCase()) return name
			})
			if (!constructorName) return SAY(`❌ NO SUCH MATERIAL ${config.type}`)

			if (debug) SAY('🧱 🟣 CREATE', uid, config.type)
			const mat = new BB[constructorName]( this.uid, scene )
			mat.stringUID = stringUID
			mat.originalType = config.type

			for (const [key,value] of Object.entries(config)) {
				const val = Array.isArray(value) ? BB.Color3.FromArray(value) : value
				mat[key] = val
			}

			if (config.type === 'fur') {
				if (debug) SAY(`🧱 🟢 FURTEX`, uid, config.type)
				mat.diffuseTexture = new BB.Texture('babylon/grass.jpg', scene)
				mat.furTexture = BB.FurMaterial.GenerateTexture('furTexture', scene)
				mat.disableLighting = false
				// mat.diffuseColor = new BB.Color3(1,1,0)
				// mat.onCompiled(() => {
				// 	SAY(`🧱 🟢 FUR COMPILED`, uid, config.type)
				// })
			}

			this.$getEngineMaterialCache().set(stringUID, mat)
			this.instance = mat

		} else {
			if (debug) SAY('🧱 🟠 FOUND', uid, config.type)
			this.instance = existingMaterial
		}

		if (oldInstance !== this.instance ) {
			scene.meshes.forEach(mesh => {
				if (mesh.materialUID === uid) {
					if (this.instance.originalType === 'fur' && !mesh.hasBeenFurred) {
						mesh.material = this.instance
						BB.FurMaterial.FurifyMesh(mesh, this.config.furDetail)
						if (debug) SAY(`🧱 🔴 FURIFY |||${mesh?.meta?.uid}|||`, uid, config.type)
						mesh.hasBeenFurred = true
						mesh.material.alpha = config.alpha 
					} else {
						if (debug) SAY(`🧱 🟠 UPDATE |||${mesh?.meta?.uid}|||`, uid, config.type)
						mesh.material = this.instance
						mesh.material.alpha = config.alpha 
					}
				}
			})
		}
	}


}