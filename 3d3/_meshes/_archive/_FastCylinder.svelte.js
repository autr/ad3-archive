
/* ====================================== */
/*                                        */
/*             FAST CYLINDER              */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import Points from '../_Points.svelte.js'
import Entity from '../_Entity.svelte.js'
import { MeshBuilder, TransformNode, Quaternion, Axis } from '@babylonjs/core'
import { Vec3 } from '$3d1_points'
import MeshTool from './_MeshTool.svelte.js'

// ------ SCHEMA ------

import FastCylinderString from './_FastCylinder.svelte?raw'
import { ExtractSchema } from '$gui_auto/lib.parser.js'
const schema = ExtractSchema( FastCylinderString )

export const STANDARD_HEIGHT = 1

export default class Mesh extends Points {


	mesh = null
	scaling = $state({x: 1, y: 1, z: 1})

	constructor(id) {
		super(id)
		this.schema = schema

		const scene = getContext('scene').getInstance()
		this.instance = new TransformNode( this.id() + '_transforminstance', scene )
		this.instance.position = new Vec3(0,0,0)

		$effect( this.syncMatrix.bind(this) )
		$effect( this.syncRotation.bind(this) )
	}

	syncRotation() {

		// const pointA = this.points[0]
		// const pointB = this.points[1]

		// if (!pointA || !pointB) return

		// const origin = new Vec3(0, 0, 0)
		// const directionToOrigin = origin.subtract(this.instance.position).normalize()
		// const angleToOrigin = Math.atan2(
		// 	directionToOrigin.y - this.instance.position.y,
		// 	directionToOrigin.x - this.instance.position.x
		// )
		// this.mesh.rotation.y = angleToOrigin
		if (this.debug) SAY(`🧪 ROTATION ${this.id()}`)
	}

	syncMatrix() {

		const pointA = this.points[0]
		const pointB = this.points[1]

		if (!pointA || !pointB) return

		const direction = pointB.subtract(pointA).normalize()
		const rotationAxis = Vec3.Cross(Axis.Y, direction)
		const angle = Math.acos(Vec3.Dot(Axis.Y, direction))

		const newHeight = Vec3.Distance(pointA, pointB)
		this.instance.position = pointA.add(pointB).scale(0.5)

		const quaternion = Quaternion.RotationAxis(rotationAxis, angle)
		const euler = quaternion.toEulerAngles()

		this.instance.rotationQuaternion = quaternion
		// this.instance.rotation = euler 
		this.scaling.y = newHeight / STANDARD_HEIGHT

		if (this.debug) SAY(`🧪 MATRIX ${this.id()}`)
	}

	init() {

	}


}






		// if (!this.mesh) return
		// this.mesh.rotation.y = (Math.PI / this.state.sides) * this.state.swivel * 2

