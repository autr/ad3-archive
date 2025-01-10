/* ====================================== */
/*                                        */
/*          GREASED LINE PROXY            */
/*                                        */
/* ====================================== */

// #define PROXY3D

function GetTotalDistance(vectorArray) {
	let totalDistance = 0

	for (let i = 0; i < vectorArray.length - 1; i++) {
		totalDistance += Vec3.Distance(vectorArray[i], vectorArray[i + 1])
	}

	return totalDistance
}

export default class GreasedLine extends Proxy {

	type = 'GreasedLine'
	inited = false

	setup( uid, config, debug ) {

		return new Promise((resolve,reject) => {

 
 			const points = config.points.map( point => new Vec3(point) )

 			const totalDistance = GetTotalDistance( points )
			const useDash = (config.dasharray.x && config.dasharray.y !== 0) ? true : false

			const widths = []
			for (let i = 0; i < points.length; i++)  {
				widths.push( config.radius )
				widths.push( config.radius )
			}

			this.instance = new CreateGreasedLine( uid, {
				points,
				widths,
				updatable: config.updatable
			},{
				useDash: true,
				dashCount: totalDistance / config.dasharray.x,
				dashRatio: config.dasharray.y,
				materialType: GreasedLineMeshMaterialType.MATERIAL_TYPE_STANDARD,
				color: Color3.Yellow(),
				disableLighting: true
			})

			this.instance.greasedLineMaterial.color = null

			// if (!this.inited) {
			// 	this.tick()
			// 	this.inited = true
			// }
			resolve()
		})
	}

	tick() {


		requestAnimationFrame( tick.bind(this) )
	}

	setGreasedMaterialColor( color ) {
		this.instance.greasedLineMaterial.color = new Color3( color.x, color.y, color.z )
	}


}