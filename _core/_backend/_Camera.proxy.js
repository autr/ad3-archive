/* ====================================== */
/*                                        */
/*         	     CAMERA PROXY             */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { Convert2Dto3D, Convert3Dto2D, SendDataToJunctions } from './lib.core.js'
import { GetConstructorArguments } from '$_lib/lib.meta.js'

import { PolygonContains, PolygonHull, PolygonArea, PolygonLength, PolygonCentroid } from '$ad3_libs'
globalThis.Polygon = { PolygonContains, PolygonHull, PolygonArea, PolygonLength, PolygonCentroid }

function QuatToEuler( quat ) {
	return quat.toEulerAngles()
}

function EulerToQuat( euler ) {
	return BB.Quaternion.FromEulerAngles( euler.x, euler.y, euler.z )
}


function QuaternionToMatrix( quat ) {
	const matrix = new BB.Matrix()
	quat.toRotationMatrix(matrix)
	return matrix
}

function BlendXYZ( first, second, smoothing ) {

	if (first.x !== undefined && second.x !== undefined ) first.x = (first.x * smoothing) + (second.x * (1-smoothing))
	if (first.y !== undefined && second.y !== undefined ) first.y = (first.y * smoothing) + (second.y * (1-smoothing))
	if (first.z !== undefined && second.z !== undefined ) first.z = (first.z * smoothing) + (second.z * (1-smoothing))
}

function BlendSingle( first, second, smoothing ) {

	return (first * smoothing) + (second * (1-smoothing))
}

function CreateArcCamera( uid, position, scene ) {
	const arc = new BB.ArcRotateCamera(
		uid + 'ArcRotate',
		0,
		0,
		0,
		new BB.Vector3(0,0,0),
		scene
	)
	arc.position = new Vec3( position )
	arc.upperBetaLimit = 99999
	return arc
}

function CreateFreeCamera( uid, position, scene ) {

	const free = new BB.UniversalCamera(
		uid + 'UniversalFree',
		new Vec3(position),
		scene
	)
	free.inertia = 0
	return free
}

export default class Camera extends Proxy {

	type = 'Camera'
	cameraType = undefined

	setup( uid, config, debug ) {

		this.uid = uid
		if (!this.instance) {

			if (this.instance) this.instance.dispose()

			const scene = this.$getSceneInstance()

			this.instance = new BB.FreeCamera( 
				uid, 
				new BB.Vector3(0,0,-10),
				scene
			)
			this.arc = CreateArcCamera( uid, config.position, scene )
			this.free = CreateFreeCamera( uid, config.position, scene )

			this.arc.destination = CreateArcCamera( uid, config.position, scene )
			this.free.destination = CreateFreeCamera( uid, config.position, scene )

			this.instance.position = new Vec3( config.position )
			this.instance.minZ = config.minZ
			this.instance.maxZ = config.maxZ
			this.arc.minZ = config.minZ
			this.free.maxZ = config.maxZ
			this.arc.destination.minZ = config.minZ
			this.free.destination.maxZ = config.maxZ

			this.viewSmoothingMin = 0.4
			this.viewSmoothingMax = 0.99
			this.viewSmoothingSpeed = 0.01
			this.viewSmoothing = 0.5
			this.moveSmoothing = 0.8

			this.targetDestination = new Vec3(0,0,0)
			this.targetPosition = this.targetDestination.clone()

			this.arc.setPosition( this.instance.position.clone() )
			this.arc.destination.setPosition( this.instance.position.clone() )

			this.$syncTargetAndAlign(  `setup`, this.targetDestination  )

			this.orthoDistance = Vec3.Distance( this.instance.position, this.targetDestination )


			this.$setupPickPlane()

			scene.registerBeforeRender( this.$tick.bind(this) )

		} else {
			delete config.type
			delete config.id

			for ( const [key, value] of Object.entries( config ) ) {
				if (value !== undefined) {
					if (debug) SAY(`📽️ 🥣 setting ${key}:`)
					this.instance[key] = value
				}
			}
		}

		return this.uid
	}



	setCameraCallback( callback ) {
		if (this.debug) SAY('📮 camera callback set', callback)
		this.callback = callback
	}

	immediateSetCameraTargets( target, align, forceRetarget ) {

		this.forceRetarget = forceRetarget

		if (!target) {
			this.target = null
			this.align = null
			this.$syncTargetAndAlign( 'immediateSetCameraTargets:return' )
			return
		}

		this.target = target
		this.align = align

		this.$syncTargetAndAlign( 'immediateSetCameraTargets:fin' )
	}


	stickSmooth = { 
		accelerate: 0, 
		deccelerate: 0 
	}

	stickRef = { 
		forwardsBackwards: 0,
		sideStrafe: 0,
		upDown: 0,
		riseFall: 0,
		sideStrafe: 0,
		leftRight: 0
	}

	stickValues = { 
		forwardsBackwards: 0,
		sideStrafe: 0,
		upDown: 0,
		riseFall: 0,
		sideStrafe: 0,
		leftRight: 0
	}


	immediateSetStick( stickRef, stickSmooth ) {
		this.stickRef = stickRef
		this.stickSmooth = stickSmooth
	}

	immediateUpdateStick( stickAlt, stickSmooth ) {

		this.stickSmooth = stickSmooth

		const { maximum, accelerate, deccelerate } = this.stickSmooth

		for (const [key,value] of Object.entries(stickAlt)) this.stickValues[key] += value * accelerate
	}

	$tick() {

		this.$syncOrthographicDistance()

		const { maximum, accelerate, deccelerate } = this.stickSmooth

		for (const [ key, value ] of Object.entries(this.stickRef) ) {

			if (value !== 0) {
				this.stickValues[key] += value * accelerate
			} else if (value === 0) {
				this.stickValues[key] *= deccelerate
			}

			if (value > 0 && this.stickValues[key] > Math.abs(maximum)) this.stickValues[key] = Math.abs(maximum)
			if (value < 0 && this.stickValues[key] < -Math.abs(maximum)) this.stickValues[key] = -Math.abs(maximum)
			
		}
		if (this.stickValues.forwardsBackwards) this.immediateUpdateZoom( this.stickValues.forwardsBackwards )
		if (this.stickValues.sideStrafe || this.stickValues.riseFall) this.immediateUpdateMove( this.stickValues.sideStrafe || 0, this.stickValues.riseFall || 0 )


		if (this.stickValues.leftRight || this.stickValues.upDown) this.immediateUpdateView( this.stickValues.leftRight || 0, this.stickValues.upDown || 0 )

		if (this.viewSmoothing > this.viewSmoothingMin) this.viewSmoothing -= this.viewSmoothingSpeed

		// FREE

		BlendXYZ( this.free.rotation, this.free.destination.rotation, this.viewSmoothing )
		BlendXYZ( this.free.position, this.free.destination.position, this.moveSmoothing )

		// ARC

		this.arc.radius = BlendSingle( this.arc.radius, this.arc.destination.radius, this.viewSmoothing)
		this.arc.alpha = BlendSingle( this.arc.alpha, this.arc.destination.alpha, this.viewSmoothing)
		this.arc.beta = BlendSingle( this.arc.beta, this.arc.destination.beta, this.viewSmoothing)

		BlendXYZ( this.targetPosition, this.targetDestination, this.viewSmoothing )

		if (!this.target) { // FREE
			this.$syncToCamera( this.free, this.instance )
		} else {

			this.$syncToCamera( this.arc, this.instance )
		}


	}

	$syncTargetAndAlign( debugOriginMessage, overrideTarget ) {

		const lookup = this.$getLookup()
		const newTargetDestination = this.$getWorldAbsolutePosition( this.target ) || overrideTarget // Vec3
		const alignPos = this.$getWorldAbsolutePosition( this.align )

		const noAlign = this.target === this.align || !alignPos

		if (newTargetDestination) {
			const position = this.instance.position.clone()
			const distance = Vec3.Distance( newTargetDestination, position )
			const direction = (noAlign ? position.subtract( newTargetDestination ) : newTargetDestination.subtract( alignPos )).normalize()
			const newCameraPosition = newTargetDestination[noAlign ? 'add' : 'subtract'](direction.scale(distance))

			if (!this.previousTarget) {

				const forward = this.free.getForwardRay()
				const lookAtMe = forward.origin.add(forward.direction.scale(distance))
				this.targetPosition = lookAtMe

			} else {
				this.arc.position = position
			}

			const isSameTarget = this.previousTarget === this.target
			const isSameAlign = this.previousAlign === this.align

			if (!isSameTarget || !isSameAlign || this.forceRetarget) {

				this.targetDestination = newTargetDestination
				this.arc.setTarget(this.targetPosition)
				this.arc.destination.setPosition( newCameraPosition )
				this.arc.destination.update()
				this.arc.destination.setTarget(this.targetDestination)
			}

			// SAY('WOT?', debugOriginMessage, this.viewSmoothingMax)
			this.viewSmoothing = this.viewSmoothingMax

		} else {

			if (this.previousTarget && this.arc?.position) {

				this.free.position = this.arc.position.clone()
				this.free.destination.position = this.arc.position.clone()
				const previousPosition = this.$getWorldAbsolutePosition( this.previousTarget )

				if (previousPosition) {

					this.free.setTarget( previousPosition )
					this.free.destination.setTarget( previousPosition )
				}
			}

		}

		this.previousTarget = this.target
		this.previousAlign = this.align
	}

	$syncToCamera( from, to ) {

		// SAY(from.name, '->', to.name)

		const { position, rotationQuaternion, globalPosition, rotation } = from
		const absolute = from.absoluteRotation.toEulerAngles()

		to.position.x = globalPosition.x
		to.position.y = globalPosition.y
		to.position.z = globalPosition.z
		to.rotation.x = absolute.x
		to.rotation.y = absolute.y
		to.rotation.z = absolute.z

	}

	destinations = {}

	immediateUpdateZoom( deltaX = 0, deltaY = 0, amount = 0.01 ) {

		const scale = (deltaY + deltaX) * amount

		// SAY('WOOO')

		if (!this.isOrthographic) {

			if (this.target) { // ARC

				this.arc.destination.radius += scale

			} else { // FREE

				const forward = this.free.getDirection(BB.Vector3.Forward())
				this.free.destination.position.addInPlace(forward.scale(-scale))

			}
		}

		this.orthoDistance += scale
		this.orthoDistance = Math.max( this.instance.minZ, Math.min( this.instance.maxZ, this.orthoDistance ) )

	}

	immediateUpdateMove( deltaX = 0, deltaY = 0, isFlat = false, amount = 0.01 ) {

		if (this.target) { // ARC

			this.immediateUpdateView( deltaX, deltaY )

		} else { // FREE

			if (!this.free.positionDestination) this.free.positionDestination = this.free.position.clone()

			let right, up

			if (isFlat) {
				right = new BABYLON.Vector3(1, 0, 0)
				up = new BABYLON.Vector3(0, 1, 0)
			} else {
				right = this.free.getDirection(BABYLON.Vector3.Right())
				up = this.free.getDirection(BABYLON.Vector3.Up())
			}

			this.free.destination.position.addInPlace(up.scale(deltaY * amount))
			this.free.destination.position.addInPlace(right.scale(deltaX * -amount))


		}
	}

	immediateUpdateView( deltaX = 0, deltaY = 0 ) {

		if (this.target) { // ARC

			const amount = 0.001 
			this.arc.destination.alpha += deltaX * amount
			this.arc.destination.beta += deltaY * amount
			const bit = 0.001 // BUGFIX: STOP MESH GLITCH
			this.arc.destination.beta = Math.min(Math.max(bit,this.arc.destination.beta),Math.PI-bit)


		} else { // FREE

			const amount = 0.001 
			this.free.destination.cameraRotation.x += deltaY * amount
			this.free.destination.cameraRotation.y += deltaX * amount
			this.free.destination.update()

		}
	}

	$syncOrthographicDistance() {

		if (!this.isOrthographic) return

		// const target = this.$getLookup().get(this.target)?.position
		// if (target) this.orthoDistance = Vec3.Distance( this.instance.position, target )

		// SAY(this.orthoDistance, 'DIST!', this.orthoDistance)

		const { width, height } = this.$getEngineInstance().getRenderingCanvas()
		const aspectRatio = width / height

		this.instance.orthoTop = this.orthoDistance
		this.instance.orthoBottom = -this.orthoDistance
		this.instance.orthoLeft = -(this.orthoDistance * aspectRatio)
		this.instance.orthoRight = (this.orthoDistance * aspectRatio)
		
		this.instance.minZ = -this.orthoDistance * 10
		this.instance.maxZ = this.orthoDistance * 10
	}

	setOrthographic( isOrthographic ) {

		this.isOrthographic = isOrthographic

		if (isOrthographic) {

			SAY('👁️ ORTHOGRAPHIC')

			this.instance.mode = BB.CameraConstants.ORTHOGRAPHIC_CAMERA
			this.arc.mode = BB.CameraConstants.ORTHOGRAPHIC_CAMERA
			this.arc.destination.mode = BB.CameraConstants.ORTHOGRAPHIC_CAMERA
			this.free.mode = BB.CameraConstants.ORTHOGRAPHIC_CAMERA
			this.free.destination.mode = BB.CameraConstants.ORTHOGRAPHIC_CAMERA

		} else {

			if (this.debug) SAY('👁️ PERSPECTIVE')

			this.instance.mode = BB.CameraConstants.PERSPECTIVE_CAMERA
			this.arc.mode = BB.CameraConstants.PERSPECTIVE_CAMERA
			this.arc.destination.mode = BB.CameraConstants.PERSPECTIVE_CAMERA
			this.free.mode = BB.CameraConstants.PERSPECTIVE_CAMERA
			this.free.destination.mode = BB.CameraConstants.PERSPECTIVE_CAMERA
			
		}
	}

	setUpVector( upVector ) {
		if (!this.instance) return
		upVector = new Vec3(upVector)
		this.instance.upVector.x = upVector.x
		this.instance.upVector.y = upVector.y
		this.instance.upVector.z = upVector.z
	}

	setControlsEnabled( enabled ) {
		if (enabled) this.instance.attachControl( this.$getCanvas(), true )
		if (!enabled) this.instance.detachControl()
		SAY(`🛂 ${this.uid} set controls: ${enabled}`)

	}


	lookAt( position ) {
		if (this.debug) SAY(`${this.uid} 🟣 look at`, this.instance.lookAt)
		const backup = new Vec3( position )
		globalThis._camera = this.instance
		// this.instance.target = this.$findInstance( position, backup )
	}


	////////////////////////////////////////////////////////////////////////////////////////
	////////////                                                                ////////////
	////////////                                                                ////////////
	////////////                            CONTROLS                            ////////////
	////////////                                                                ////////////
	////////////                                                                ////////////
	////////////////////////////////////////////////////////////////////////////////////////



	$project2D( position ) {
		const { areaWidth, areaHeight } = this.cursor2D
		return Convert3Dto2D( new Vec3(position), areaWidth, areaHeight, this.matrix )
	}


	interact = {
		input: {},
		picked: {}
	}

	$toArray( position ) {
		return [ position.x, position.y, position.z ]
	}

	immediateUpdateInteractives( x, y, areaWidth, areaHeight, minDistance = 40 ) { 

		if (!this.instance) return {}

		const interact = this.interact

		interact.areaWidth = areaWidth
		interact.areaHeight = areaHeight

		this.$updateMatrixRefs()

		// PICKED

		const picked = this.$pickIntersectingMesh()

		if (picked.hit) {
			const uid = picked.pickedMesh?.meta?.uid
			const worldPosition = picked.pickedMesh.getAbsolutePosition()
			const canvasPosition = this.$unprojectPosition( position )
			this.interact.picked = { uid, worldPosition, canvasPosition }
		} else {
			this.interact.picked = {}
		}

		const inputCanvasPosition = new Vec2( this.interact.canvasPosition )
		const sortedMeshes = { point: [] } // , Edge: [], Face: [], Line: [], Shape: [] }
		const allowList = Object.keys( sortedMeshes )

		// DISTANCE

		for (const mesh of this.$getSceneInstance().meshes ) {
			const isPickable = mesh.isPickable
			const isEnabled = mesh.isEnabled()
			const type = (mesh?.meta?.object || '').toLowerCase()
			const uid = mesh?.meta?.uid
			if (type && allowList.includes( type ) && isPickable && isEnabled) {

				const worldPosition = mesh.getAbsolutePosition()
				const canvasPosition = this.$projectCanvasFromWorld( worldPosition )
				const distance = Vec2.Distance( inputCanvasPosition, new Vec2( canvasPosition ) )
				sortedMeshes[ type ].push( { uid, worldPosition, canvasPosition, distance } )
			}
		}

		// WEIGHTING

		const distanceWeight = 1
		const depthWeight = 3


		for ( const [ type, meshes ] of Object.entries( sortedMeshes ) ) {

			const closest = meshes.sort( (a,b) => {
				const distanceDifference = a.distance - b.distance
				const depthDifference = a.canvasPosition.z - b.canvasPosition.z
				return (distanceWeight * distanceDifference) + (depthWeight * depthDifference)
			})?.[0] || null

			let isWithinDistance = false
			if (closest) {
				closest.worldPosition = this.$toArray( closest.worldPosition )
				closest.canvasPosition = this.$toArray( closest.canvasPosition )
				isWithinDistance = closest.distance < minDistance
				interact.closest = closest
			}
			if (isWithinDistance) {
				interact[type] = closest
			} else {
				interact[type] = {}
			}


		}


		// CANVAS

		const distance = Vec3.Distance( this.instance.position, new Vec3(interact?.closest?.worldPosition || 0))

		this.pickPlane.position.z = distance

		const ray = this.$getSceneInstance().createPickingRay(x, y, BB.Matrix.Identity(), this.instance, false)
		const hit = this.$getSceneInstance().pickWithRay(ray)

		if (hit.pickedPoint) {
			interact.canvasPosition = this.$toArray( this.$projectCanvasFromWorld( hit.pickedPoint ) )
			interact.worldPosition = this.$toArray( hit.pickedPoint )
		}

		return this.interact
	}

	$setupPickPlane() {


		this.pickPlane = BB.CreatePlane(this.uid + 'PickPlane', {size: 9999}, this.$getSceneInstance())
		this.pickPlane.backFaceCulling = false
		this.pickPlane.parent = this.instance
		this.pickPlane.isVisible = true
		this.pickPlane.visibility = 0
	}

	$projectWorldFromCanvas( position, referencePosition ) {

		const point = new Vec3( position )
		point.z = 0

		let { worldMatrix, viewMatrix, projectionMatrix } = this.matrixRefs

		if (!worldMatrix?.m) worldMatrix = BB.Matrix.FromArray(worldMatrix)
		if (!viewMatrix?.m) viewMatrix = BB.Matrix.FromArray(viewMatrix)
		if (!projectionMatrix?.m) projectionMatrix = BB.Matrix.FromArray(projectionMatrix)

		const { areaWidth, areaHeight } = this.interact

		const worldPos = Vec3.Unproject(
			point,
			areaWidth,
			areaHeight,
			BB.Matrix.Identity(),
			viewMatrix,
			projectionMatrix
		)

		// TO DO HERE

		// move worldPos toward the camera until it is as far away from the camera as referencePosition

		return worldPos
	}


	$projectCanvasFromWorld( position ) {

		position = new Vec3(position)

		let { transformationMatrix } = this.matrixRefs
		if (!transformationMatrix?.m) transformationMatrix = BB.Matrix.FromArray(transformationMatrix)

		const canvasPos = Vec3.Project(
			position,
			BB.Matrix.Identity(),
			transformationMatrix,
			{ x: 0, y: 0, width: this.interact.areaWidth, height: this.interact.areaHeight }
		)

		return canvasPos
	}

	$pickIntersectingMesh( x, y ) {

		const scene = this.$getSceneInstance()
		if (!this.instance || !scene) return 
			
		const picked = scene.pick(
			x, 
			y,
			null, // predicate: function to determine eligible meshes 
			false, // fast check (first intersection, not the closest)
			null, // scene.camera is used by default
			null // optional matrix
		)

		return picked
	}


	$returnMatrixesPositions() {

			// matrix: {
			// 	worldMatrix: this.matrix.worldMatrix.m,
			// 	viewMatrix: this.matrix.viewMatrix.m,
			// 	projectionMatrix: this.matrix.projectionMatrix.m,
			// 	transformationMatrix: this.matrix.transformationMatrix.m,
			// },


		return { 

			cameraPosition: (new Vec3(this.instance.position)).toObject(),
			cursor3D: (new Vec3(this.cursor3D)).toObject(),
			cursorInterpolated: (new Vec3(this.cursorInterpolated)).toObject(),

			meshPicked: this.meshPicked,
			meshDistance: this.meshDistance,
			meshNearest: this.meshNearest,

			meshPickedPosition: (new Vec3(this.meshPickedPosition)).toObject(),
			meshDistancePosition: (new Vec3(this.meshDistancePosition)).toObject(),
			meshNearestPosition: (new Vec3(this.meshNearestPosition)).toObject(),
		}
	}

	$updateMatrixRefs() {

		if (!this.instance) return

		this.matrixRefs = {
			worldMatrix: this.instance.getWorldMatrix(), 
			viewMatrix: this.instance.getViewMatrix(), 
			projectionMatrix: this.instance.getProjectionMatrix(), 
			transformationMatrix: this.instance.getTransformationMatrix(),
		}

		if (isNaN(this.matrixRefs.viewMatrix.m[0])) {
			this.instance.getViewMatrix(true)
			this.matrixRefs.viewMatrix = this.instance.getViewMatrix()
		}

	}

	immediateFindWithinPolygon( polygon ) {

		const selected = []

		for (const item of this.$getLookup().values()) {
			if (item.worldMesh && item.flags?.isVisible && item.flags?.isPickable ) {
				const canvasPos = this.$projectCanvasFromWorld( item.worldMesh.getAbsolutePosition() )
				const contains = PolygonContains( polygon, [ canvasPos.x, canvasPos.y ] )
				if (contains) selected.push(item.uid)
			}
		}

		return selected
	}

}



	// immediateSetCameraTargets( target, align, forceRetarget ) {

	// 	const debug = false
	// 	this.forceRetarget = forceRetarget

	// 	const lookup = this.$getLookup()
	// 	const targetObject = lookup.get( target )
	// 	const alignObject = lookup.get( align )

	// 	// if (this.target) this.$getPointJunctions().removeJunction( this, this.target, 'target', debug )
	// 	// if (this.align) this.$getPointJunctions().removeJunction( this, this.align, 'align', debug )

	// 	if (!target) {
	// 		this.target = null
	// 		this.align = null
	// 		this.$syncTargetAndAlign( 'immediateSetCameraTargets:return' )
	// 		return
	// 	}

	// 	this.target = target
	// 	this.align = align

	// 	const noAlign = target === align || !alignObject

	// 	// if (targetObject) this.$getPointJunctions().setJunction( this, target, 'target', debug )
	// 	// if (alignObject && !noAlign) this.$getPointJunctions().setJunction( this, align, 'align', debug )

	// 	this.$syncTargetAndAlign( 'immediateSetCameraTargets:fin' )
	// }