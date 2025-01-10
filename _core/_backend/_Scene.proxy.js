/* ====================================== */
/*                                        */
/*         	      SCENE PROXY             */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { CreateGroundGrid } from './lib.ground.js'

export default class Scene extends Proxy {

	instance = null
	type = 'Scene'

	activeMeshRefs = { ground: null }

	setup( data, debug ) {
		return new Promise((resolve,reject) => {


			this.uid = data.uid
			const engine = this.$getEngine()

			if (!engine.instance) return SAY(`❌ NO ENGINE`)
			const scene = new BB.Scene( engine.instance )
			// scene.createDefaultLight(true) // replaceExisting

			// const hdrTexture = new BB.CreateFromPrefilteredData('/babylon/sky3.env', scene)

			// scene.createDefaultEnvironment({
			// 	environmentTexture: '/babylon/sky3.env'
			// })
			// hdrTexture.onLoadObservable.addOnce(() => {
			// 	const skybox = scene.createDefaultSkybox(hdrTexture, true, 10000, 0.3, false)
			// 	if (!skybox) SAY('❌ Skybox not created')
			// 	scene.clearColor = new BB.Color4(224 / 255, 235 / 255, 235 / 255, 1)
			// })
			// SAY(hdrTexture)
			// scene.createDefaultSkybox() //(hdrTexture, true, 10000)
			
			scene.clearColor = new BB.Color4(...data.color)
			// scene.clearColor = new BB.Color4(0,1,0, 0)  // new BB.Color4(...data.color)


			
			// scene.clearColor = new BB.Color3(26/255,38/255,38/255)


			// scene.ambientColor = new BB.Color3(0, 0, 0)



			// const glow = new BB.GlowLayer('glow', scene)
			// glow.intensity = 0

			const lightA = new BB.HemisphericLight('lightA', new BB.Vector3(0, 10, 0), scene)
			lightA.intensity = 1
			lightA.diffuse = new BB.Color3( 0.9, 1, 1 )
			lightA.specular = new BB.Color3( 1, 0.9, 1 )
			lightA.groundColor = new BB.Color3( 1, 0.9, 1 )

			// this.shadows.push( new BB.ShadowGenerator(1024, lightA ) )

			const lightB = new BB.PointLight('lightB', new BB.Vector3(10, 10, 0), scene)
			lightB.intensity = 1.2

			scene.shadows = []
			scene.shadows.push( new BB.ShadowGenerator(1024, lightB ) )

			// const lightC = new BB.PointLight('lightC', new BB.Vector3(-10, 10, 0), scene)
			// lightC.intensity = 1.2

			// const lightD = new BB.PointLight('lightD', new BB.Vector3(0, 10, 10), scene)
			// lightD.intensity = 1.2


			this.instance = scene
			this.$getEngineInstance().setDepthFunctionToLessOrEqual()

			// if (this.fog) this.$syncFog()
			// if (this.ground) this.$syncGround()

			// for (const shadow of scene.shadows) {
			// 	shadow.usePoissonSampling = true
			// 	shadow.transparencyShadow = true
			// }

			resolve()

		})
	}

	$syncFog() {

		// this.instance.fogDensity = 0.01
		return

		const { useFog, fogStart, fogEnd } = this.fog || {}

		this.instance.fogMode = useFog ? 3 : 0 // linear = 3, none = 0 SceneInstance.FOGMODE_LINEAR
		this.instance.fogStart = fogStart
		this.instance.fogEnd = fogEnd

		this.instance.clearColor = useFog ? new BB.Color3( ...this.fog.fogColor ) : new BB.Color4( 0, 0, 0, 0 )
		this.instance.fogColor = useFog ? new BB.Color3( ...this.fog.fogColor ) :  new BB.Color4( 0, 0, 0, 0 )
	}

	$syncGround() {

		return 
		
		this.ground = BB.CreateGround(this.uid + 'Ground', {
			width: 20,
			height: 20,
			updatable: true
		}, this.instance)
		this.ground.position.y = -2

		return 

		const { useGround, groundSize, groundColor, groundGridCount, groundPosition } = this.ground

		let { ground } = this.activeMeshRefs

		if (ground?.groundSize !== groundSize && ground) {
			ground.dispose()
			ground = null
		}
		if (!ground) {
			ground = CreateGroundGrid( this.$getSceneInstance(), this.uid, groundSize )
			ground.position.y = -4
			ground.groundSize = groundSize

			this.activeMeshRefs.ground = ground
		}
		ground.position = new Vec3(groundPosition)
		ground.isPickable = false
		ground.setEnabled( useGround )
		ground.isVisible = useGround
		ground.receiveShadows = true

		const { material } = this.activeMeshRefs.ground

		material.minorUnitVisibility = 0
		// material.majorUnitFrequency = groundSize / 4 // groundSize/groundGridCount
		material.gridRatio = 1 / (groundGridCount/4)
		material.markAsDirty(BB.Material.MarkAllDirtyFlag)

		material.mainColor = new BB.Color4( groundColor[0], groundColor[1], groundColor[2], 0 )
		material.lineColor = new BB.Color4( ...groundColor )



	}

	setFog( fog ) {
		this.fog = fog
		this.$syncFog()
	}
	setGround( ground ) {
		this.ground = ground
		this.$syncGround()
	}

}