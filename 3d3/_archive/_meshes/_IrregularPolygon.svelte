<script>
	/* ====================================== */
	/*                                        */
	/*            IRREGULAR POLYGON           */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	// #define MESH
	// #define AUI

	import earcut from 'earcut'

	const COLORS = context.getColors()

	import * as vectors from '$3d/lib.vectors.js'

	const defaultMaterial = COLORS.RED
	export let name = 'irregularPolygon'
	export let shape = []
	export let position = { x: 0, y: 0, z: 0 }
	export let rotation = { x: 0, y: 0, z: 0 }
	export let extrude = 0

	function initMesh() {

		shape = shape.map( point => {
			return new BB.Vector3( point.x,point.y,point.z )
		})
		const centerPoint = vectors.getCenterFromPoints( shape )

		if (extrude > 0) {


			const normal = shape[2]
			  .subtract(shape[0])
			  .cross(shape[1].subtract(shape[0]))
			  .normalize()

			const projectedShape = shape.map(point =>
			  point.subtract(normal.scale(BB.Vector3.Dot(point, normal)))
			)

			const extrudeDirection = centerPoint.subtract(new BABYLON.Vector3(0, 0, extrude))

			mesh = new BB.MeshBuilder.ExtrudeShape(name, {
			  shape: projectedShape,
			  path: [
			    new BB.Vector3(0,0,0),
			    new BB.Vector3(0,0,0.1),
			  ],
			  cap: 4
			})

			mesh.position.copyFrom(centerPoint)
		} else {

			const points = shape.map( point => {
				return point.clone().subtract( centerPoint )
			})
			let centerArray = []
			for (let i = 0; i < shape.length; i++) centerArray.push( new BB.Vector3(0, 0, 0) )
			mesh = BB.MeshBuilder.CreateRibbon( name, {
				pathArray: [ points, centerArray ],
				closeArray: true,
				closePath: true,
				updatable: true
			}, scene, earcut)

			mesh.position = centerPoint // new BB.Vector3( centerPoint.x + position.x, centerPoint.y + position.y, centerPoint.z + position.z )

		}


		mesh.data = { ...mesh.data, centerPoint, points: shape }
		mesh.shape = 'irregularPolygon'
		mesh.parent = context.getParent ? context.getParent() : null

	}

	function updateShape() {
		if (!mesh) return
		init()
	}

	$: updateShape( shape )

</script>
<!-- 
{#if gui}
{/if} -->

{#if mesh}
	<slot />
{/if}
