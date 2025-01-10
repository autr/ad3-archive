/* ====================================== */
/*                                        */
/*         	  BABYLON (PRELOAD)           */
/*                                        */
/* ====================================== */

export { Axis } from '@babylonjs/core/Maths/math.axis.js'
export { Color3, Color4 } from '@babylonjs/core/Maths/math.color.js'
export { Curve3, BezierCurve, Angle, Arc2, Path2, Path3D } from '@babylonjs/core/Maths/math.path.js'
export { Space } from '@babylonjs/core/Maths/math.axis.js'
export { Tools } from '@babylonjs/core/Misc/tools.js'
export { 
	Vector2, 
	Vector3, 
	Vector4,
	TmpVectors,
	Quaternion,
	Matrix } from '@babylonjs/core/Maths/math.vector.js'

export * as EngineConstants from '@babylonjs/core/Engines/constants.js'

export const MeshConstants = {
	FRONTSIDE: 0,
	BACKSIDE: 1,
	DOUBLESIDE: 2,
	DEFAULTSIDE: 0,
	NO_CAP: 0,
	CAP_START: 1,
	CAP_END: 2,
	CAP_ALL: 3,
	NO_FLIP: 0,
	FLIP_TILE: 1,
	ROTATE_TILE: 2,
	FLIP_ROW: 3,
	ROTATE_ROW: 4,
	FLIP_N_ROTATE_TILE: 5,
	FLIP_N_ROTATE_ROW: 6,
	CENTER: 0,
	LEFT: 1,
	RIGHT: 2,
	TOP: 3,
	BOTTOM: 4,
	INSTANCEDMESH_SORT_TRANSPARENT: false
}

export const CameraConstants = {
	PERSPECTIVE_CAMERA: 0,
	ORTHOGRAPHIC_CAMERA: 1,
	FOVMODE_VERTICAL_FIXED: 0,
	FOVMODE_HORIZONTAL_FIXED: 1,
	RIG_MODE_NONE: 0,
	RIG_MODE_STEREOSCOPIC_ANAGLYPH: 10,
	RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL: 11,
	RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED: 12,
	RIG_MODE_STEREOSCOPIC_OVERUNDER: 13,
	RIG_MODE_STEREOSCOPIC_INTERLACED: 14,
	RIG_MODE_VR: 20,
	RIG_MODE_CUSTOM: 22
}