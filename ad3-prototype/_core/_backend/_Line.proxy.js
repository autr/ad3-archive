/* ====================================== */
/*                                        */
/*         	      LINE PROXY              */
/*                                        */
/* ====================================== */

// #define PROXY3D


import ProxyMeshes from './_Proxy.Meshes.js'

export default class Line extends ProxyMeshes {

	type = 'Line'
	activeMeshRefs = { line: null }
	arrowRefs = {}

	setup( data ) {
		return new Promise((resolve,reject) => {
			this.uid = data.uid


			this.$addSceneCacheCallback( 'syncLinePoints', this, lines => {

				for (const line of lines.values()) {

					if (line.lineConfig) {

						let recreateLine = false

						for (const pointUid of line.lineConfig.points ) {
							const point = this.$getLookupItem( pointUid )
							if (point.flagDirty) recreateLine = true
						}

						if (recreateLine) line.$syncLineShape()
					}

				}
			}, 'registerAfterRender' )


			resolve(this.uid)
		})
	}

	dispose() {
		this.isDisposing = true
		this.$loopThroughMeshes( thin => thin.dispose )
		this.activeMeshRefs = { segment: null, segments: [], arrowA: null, arrowB: null }
		this.$getLookup().delete(this.uid)
	}

	$syncLineShape() {

		if (this.isDisposing) return

		const lineConfig = this.lineConfig

		if (!lineConfig) return

		// SAY( "LINE SHAPE", lineConfig )

		if (this.activeMeshRefs.line) {
			this.activeMeshRefs.line.dispose()
			this.activeMeshRefs.line = null
		}

		const material = this.$createColorMaterial( lineConfig.color )
		const points = lineConfig.points.map( point => {
			return this.$getWorldMesh( point ).position
		})

		// SAY('POINTS', points)

		const mesh = BB.CreateLines(this.uid, {
			points,
			// dashSize: lineConfig.dashSize,
			// gapSize: lineConfig.dashGap,
			// dashNb: 200,
			// material,
			// color: new BB.Color3(1,0,0),
			updatable: false
		}, this.$getSceneInstance() )

		const r = lineConfig.color[0]
		const g = lineConfig.color[1]
		const b = lineConfig.color[2]

		mesh.color = new BB.Color3(r,g,b)

		// SAY( "MESH", mesh )

		this.activeMeshRefs.line = mesh

		this.$syncFlags()
	}

	setLineShape( lineConfig ) {
		this.lineConfig = lineConfig
	}

	setFlags( flags ) {
		this.flags = flags
		this.$syncFlags()
	}


}
