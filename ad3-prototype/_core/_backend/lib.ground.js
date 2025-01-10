
// #define JAVASCRIPT

export function CreateGroundGrid(scene, uid = 'floor', size = 1, color = [1,0,0,1], spacing = 1) {

	const ground = new BB.CreateGround(uid, {
		width: size,
		height: size
	}, scene)

	const material = new BB.GridMaterial(uid + 'GridMaterial', scene)

	// material.majorUnitFrequency = size/spacing
	// material.minorUnitVisibility = material.majorUnitFrequency/2
	// material.gridRatio = spacing
	material.mainColor = new BB.Color4( color[0], color[1], color[2], 0 )
	material.lineColor = new BB.Color4( ...color )
    material.backFaceCulling = false
	material.alpha = 0
	material.opacity = 0.999999

	ground.material = material

	return ground
}
