import { browser } from '$app/environment'
import { MapRange } from '$_lib'
// import { PointerEventTypes } from '@babylonjs/core'
import { 

	// MULTIMEDIA

	VideoTexture,

	// SKETCHES

	WebGPUEngine,
	Engine,
	Scene,
	ArcRotateCamera,

	// COLORS

	Color4,
	Color3,

	// MATERIALS

	Material,
	StandardMaterial,
	GridMaterial,
	DynamicTexture,

	// VECTORS

	Vector2,
	Vector3, 
	Vector4,
	Quaternion,
	Axis,
	Matrix,
	Space,

	// INTERACTION

	TransformNode,
	PointerEventTypes,
	ActionManager,
	Action,

	// EASE

	EasingFunction,
	CircleEase,
	BackEase,
	BounceEase,
	CubicEase,
	ElasticEase,
	ExponentialEase,
	PowerEase,
	QuadraticEase,
	QuarticEase,
	QuinticEase,
	SineEase,
	BezierCurveEase,

	// MESHES

	MeshBuilder, 
	Mesh,
	VertexData,
	VertexBuffer,
	Exporter,

	// PHYSICS

	PhysicsJoint,
	PhysicsImpostor } from '@babylonjs/core'

Vector3.prototype.toObject = function() {
  return { x: this.x, y: this.y, z: this.z }
}

Vector3.prototype.randomise = function( min = 0, max = 1 ) {
	this.x = MapRange( Math.random(), 0, 1, min, max )
	this.y = MapRange( Math.random(), 0, 1, min, max )
	this.z = MapRange( Math.random(), 0, 1, min, max )
}
Vector4.prototype.toObject = function() {
  return { x: this.x, y: this.y, z: this.z, w: this.w }
}
Quaternion.prototype.toObject = function() {
  return { x: this.x, y: this.y, z: this.z, w: this.w }
}

TransformNode.prototype.getRotationQuaternion = function() {
  if (this.rotationQuaternion) {
    return this.rotationQuaternion
  } else {
    return Quaternion.FromEulerAngles(
      this.rotation.x, this.rotation.y, this.rotation.z
    )
  }
}

TransformNode.prototype.getLookAtRotation = function (targetPoint, yawCor = 0, pitchCor = 0, rollCor = 0, space = Space.LOCAL) {
	return this.getLookAt( targetPoint, 'rotation', yawCor, pitchCor, rollCor, space )
}

TransformNode.prototype.getLookAtQuaternion = function (targetPoint, yawCor = 0, pitchCor = 0, rollCor = 0, space = Space.LOCAL) {
	return this.getLookAt( targetPoint, 'quaternion', yawCor, pitchCor, rollCor, space)
}

TransformNode.prototype.getLookAt = function(targetPoint, type = 'rotation', yawCor = 0, pitchCor = 0, rollCor = 0, space = Space.LOCAL) {
	const dv = TransformNode._LookAtVectorCache
    const pos = space === Space.LOCAL ? this.position.clone() : this.getAbsolutePosition().clone()
    targetPoint.subtractToRef(pos, dv)
    return this.getRotationReference(dv, type, yawCor, pitchCor, rollCor)
}
TransformNode.prototype.getRotationReference = function(localAxis, type = 'rotation', yawCor = 0, pitchCor = 0, rollCor = 0) {
	const yaw = -Math.atan2(localAxis.z, localAxis.x) + Math.PI / 2
    const len = Math.sqrt(localAxis.x * localAxis.x + localAxis.z * localAxis.z)
    const pitch = -Math.atan2(localAxis.y, len)
    if (type.toLowerCase().includes('quaternion')) {
    	let rotationQuaternion = (this.rotationQuaternion ? this.rotationQuaternion : this.getRotationQuaternion()).clone()
        Quaternion.RotationYawPitchRollToRef(yaw + yawCor, pitch + pitchCor, rollCor, rotationQuaternion)
        return rotationQuaternion
    } else {
    	let rotation = this.rotation.clone()
        rotation.x = pitch + pitchCor
        rotation.y = yaw + yawCor
        rotation.z = rollCor
        return rotation
    }
}

export const BB = { 

	// MULTIMEDIA

	VideoTexture,
	
	// SKETCHES

	WebGPUEngine,
	Engine,
	Scene,
	ArcRotateCamera,

	// COLORS

	Color4,
	Color3,

	// MATERIALS

	Material,
	StandardMaterial,
	GridMaterial,
	DynamicTexture,

	// VECTORS

	Vector2,
	Vector3, 
	Vector4,
	Quaternion,
	Axis,
	Matrix,
	Space,

	// INTERACTION

	TransformNode,
	PointerEventTypes,
	ActionManager,
	Action,
	
	// EASE

	EasingFunction,
	CircleEase,
	BackEase,
	BounceEase,
	CubicEase,
	ElasticEase,
	ExponentialEase,
	PowerEase,
	QuadraticEase,
	QuarticEase,
	QuinticEase,
	SineEase,
	BezierCurveEase,


	// MESHES

	MeshBuilder, 
	Mesh,
	VertexData,
	VertexBuffer,
	Exporter,

	// PHYSICS

	PhysicsJoint,
	PhysicsImpostor }

if (browser) window.BB = BB
