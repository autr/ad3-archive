/* ====================================== */
/*                                        */
/*         	     LABEL PROXY              */
/*                                        */
/* ====================================== */

// #define PROXY3D

import ProxyMeshes from './_Proxy.Meshes.js'

const sceneLabelsStore = new Map()

function OnSceneUpdate( scene, label, onBeforeRender ) {

	if (!sceneLabelsStore.has(scene)) {
		sceneLabelsStore.set( scene, new Map() )
		scene.registerBeforeRender( () => onBeforeRender(sceneLabelsStore.get(scene)) )
	}

	sceneLabelsStore.get( scene ).set( label.uid, label )

}

export default class Label extends ProxyMeshes {

	type = 'Label'
	activeMeshRefs = { plane: null }

	setup( uid, pngUrl, width, height ) {

		this.uid = uid

		// this.svgString = svgString

		// width /= 100
		// height /= 100

		const scene = this.$getSceneInstance()

		this.offsetNode = new BB.TransformNode( this.uid + 'Transform' )

		const mesh = new BB.CreatePlane(this.uid, {
			width: width,
			height: height,
			sideOrientation: 2,
			updateable: true
		})

		let texture = new BB.Texture( pngUrl, scene )
		texture.hasAlpha = true
		// texture.updateSamplingMode(BB.Texture.NEAREST_NEAREST)


		const dynamicTexture = new BB.DynamicTexture('DynamicTexture', {width, height}, scene, false);
		dynamicTexture.drawText('FooBar', null, null, 'bold 16px Arial', '#ff0000', null, true)
		dynamicTexture.hasAlpha = true;
		dynamicTexture.updateSamplingMode(BB.Texture.NEAREST_NEAREST)
		// texture = dynamicTexture


		const mat = new BB.StandardMaterial(this.uid + 'Material', scene)
		mat.emissiveTexture = texture
		mat.opacityTexture = texture
		mat.diffuseTexture = texture
		mat.disableLighting = true
		mat.backFaceCulling = false
		mat.useAlphaFromDiffuseTexture = true
		mat.alphaMode = 7
		// mat.usePremultipliedAlpha = true

		this.$ensureWorldMesh()

		mesh.scaling.setAll(0.01)
		mesh.billboardMode = 7
		mesh.material = mat

		mesh.showBoundingBox = false

		this.activeMeshRefs.plane = mesh

		this.$syncAll()

		this.$addSceneCacheCallback( 'updateLabelsPosition', this, labels => {

			const cam = this.$getCamera()

			for (const label of labels.values()) {

				if (label.isDisposing) continue

				const mesh = label.activeMeshRefs.plane
				const target = label.$getLookupItem( label.offsetTarget )?.worldMesh?.position || new Vec3( label.offsetTarget )

				const cameraDistance = BB.Vector3.Distance( mesh.getAbsolutePosition(), cam.instance.position )

				const labelPosition = label.worldMesh.getAbsolutePosition()
				const direction = target.clone().subtract( labelPosition ).normalize()

				// OFFSET

				const offsetScale = cameraDistance / 2
				mesh.position = direction.scale( -label.offsetAmount * offsetScale )

				// mesh.position = new Vec3(2)

				// SCALING

				const multiplier = cam.isOrthographic ? 0.0025 : 0.001
				const cameraScale = cameraDistance * multiplier
				const orthoScale = cam.orthoDistance * multiplier

				// SAY(mesh.position, direction, label.offsetAmount, offsetScale)
				mesh.scaling.setAll( cam.isOrthographic ? orthoScale : cameraScale )

			}
		})

	}

	dispose() {
		this.isDisposing = true
		this.$loopThroughMeshes( thin => thin.dispose ? thin.dispose() : null )
		this.activeMeshRefs = { plane: null }
		this.$getLookup().delete(this.uid)
	}

	setOffset( offsetTarget = new BB.Vec3(0,1,0), offsetAmount = 0 ) {
		this.offsetTarget = offsetTarget
		this.offsetAmount = offsetAmount
		this.$syncOffset()
	}

	$syncOffset() {


	}


}
