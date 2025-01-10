
// #define JAVASCRIPT

import { Vec3, Vec4 } from '$ad3'


export function CycleDetectionDFS( points, edges ) {

	const graph = {}
	points.forEach(uid => graph[uid] = [])

	edges.forEach(([edgeUid, pointAUid, pointBUid]) => {
		graph[pointAUid].push(pointBUid);
		graph[pointBUid].push(pointAUid);
	})

	const visited = new Set()
	const stack = []
	const cycles = []

	function DFS(node, parent) {
		if (visited.has(node)) {
			const cycleStartIndex = stack.indexOf(node)
			if (cycleStartIndex !== -1) cycles.push(stack.slice(cycleStartIndex))
			return
		}

		visited.add(node)
		stack.push(node)

		for (const neighbor of graph[node]) if (neighbor !== parent) DFS(neighbor, node)

		stack.pop()
	}

	for (const node of points) if (!visited.has(node)) DFS(node, null)

	return cycles
}

export function SendDataToJunctions( object ) {

	const pointJunctions = object.$getPointJunctions().get( object.uid )
	if (pointJunctions) {
		const lookup = object.$getLookup()
		for (const [uid,note] of pointJunctions) {
			if (debug) SAY(`🟢 SEND ${object.uid} -> ${uid}`)
			const obj = lookup.get(uid)
			if (obj.$triggerFromJunction) obj.$triggerFromJunction( object.uid, note )
		}
	}
}

export function GetAmbiguousVec3( name, value, lookup ) {

	let found = null
	if (typeof value === 'string') {
		const item = lookup.get(value)
		// found = item.activeMeshRefs.point.getAbsolutePosition()
		// found = item
		found = item?.instance?.[name] || item?.[name] || item?.instance
	} else {
		found = new Vec3( value )
	}
	if (found) return found
}

export function GenerateTransformNodes( object ) {

	if (!object.positionNode) object.positionNode = new BB.TransformNode( object.uid + 'PositionNode' )
	if (!object.rotateNode) object.rotateNode = new BB.TransformNode( object.uid + 'RotateNode' )
	if (!object.scaleNode) object.scaleNode = new BB.TransformNode( object.uid + 'ScaleNode' )

	// object.positionNode.parent = object.scaleNode
	object.scaleNode.parent = object.rotateNode
}

export function LoopThroughMeshes( object, itemCallback, debug ) {

	if (!object.activeMeshRefs) return
	let i = 0
	for ( const [key,value] of Object.entries(object.activeMeshRefs) ) {
		if (Array.isArray(value)) {
			for ( const item of value ) {
				if (item) {
					itemCallback( item )
				} else {
					if (debug) SAY(`🚨 MISS ${object.uid} -> ${key}`)
				}
			}
		} else {
			if (value) {
				itemCallback( value )
			} else {
				if (debug) SAY(`🚨 MISS ${object.uid} -> ${key} -> ${i}`)
			}
		}
		i += 1
	}
}

export function SyncEnabledPickableVisible( object, debug ) {

	const enabled = object.isEnabled
	const pickable = object.isPickable
	const visible = object.isVisible
	const billboard = object.isBillboard

	if (object.debug) SAY(`🌏 ${object.type} ${object.uid} ->`, { enabled, pickable, visible })

	LoopThroughMeshes( object, item => {
		if (item.isEnabled() !== object.isEnabled) item.setEnabled( object.isEnabled )
		item.isPickable = object.isPickable
		item.isVisible = object.isVisible
		item.billboardMode = billboard ? BB.Mesh.BILLBOARDMODE_ALL : 0
	})

}

export function SetPosition( object, position ) {
	if (object.debug) SAY(`⚪️ new position ${object.uid}`)
	position = GetAmbiguousVec3( 'position', position, object.$getLookup() ).clone()
	if (!object.position) {
		object.position = position.clone()
	} else {
		object.position.x = position.x
		object.position.y = position.y
		object.position.z = position.z
	}
}

export function	SetScaling( object, scaling ) {
	if (object.debug) SAY(`⚪️ new scaling ${object.uid}`)
	scaling = GetAmbiguousVec3( 'scaling', scaling, object.$getLookup() )
	object.scaling = scaling.clone()
}

export function	SetRotation( object, rotation ) {
	if (object.debug) SAY(`⚪️ new rotation ${object.uid}`)
	rotation = GetAmbiguousVec3( 'rotation', rotation, object.$getLookup() )
	object.rotation = rotation.clone()
}

export function GenerateCachedSegment( object, width, color, rounded ) {

	color = (new Vec4( color )).toArray()
	width *= 10
	const r = color[0]
	const g = color[1]
	const b = color[2]
	const a = color[3]

	const name = 'Line' + (rounded ? 'Dotted' + rounded : '') + [r,g,b,a,width].join('')
	const cache = object.$getEngineMeshCache()
	let mesh = cache.get(name)

	if (!mesh) {

		const count = (rounded || 0) + 2
		const dist = 1 / count
		const points = []
		const widths = []

		for (let i = 0; i <= count; i ++ ) {
			const pos = (dist * i) - 0.5
			points.push( new Vec3(0, pos, 0) )
			const angle = (Math.PI * (i / count))
			let cosWidth = Math.cos(angle + (Math.PI*1.5)) * width
			if (!rounded) cosWidth = width
			widths.push( cosWidth )
			widths.push( cosWidth )
		}

		mesh = new BB.CreateGreasedLine( name, {
			points,
			widths,
		}, {
			materialType: BB.GreasedLineMeshMaterialType.MATERIAL_TYPE_STANDARD,
			color: new BB.Color4(r, g, b, a),
			colorMode: BB.GreasedLineMeshColorMode.COLOR_MODE_SET,
			useColors: false
		}, object.$getSceneInstance())

		// MATERIAL_TYPE_STANDARD = 0,
		// MATERIAL_TYPE_PBR = 1,
		// MATERIAL_TYPE_SIMPLE = 2

		mesh.material.disableLighting = true
		mesh.material.alpha = a
		mesh.thinInstanceEnablePicking = true
		mesh.isPickable = false
		mesh.isVisible = false

		// MESH COLOR

		// mesh.registerInstancedBuffer('color', 4)
		// mesh.registerInstancedBuffer('alpha', 1)
		// mesh.registerInstancedBuffer('visibility', 1)

		// mesh.instancedBuffers.color = new BB.Vector4(1,0,0,1)
		// mesh.instancedBuffers.alpha = 1
		// mesh.instancedBuffers.visibility = 1

		cache.set(name, mesh)
	}
	return name
}

export function GeneratePlainColorMaterial( object, r, g, b ) {

	const name = `R${r}G${g}B${b}`
	let material = object.$getEngineMaterialCache().get(name)

	if (!material) {
		material = new BB.StandardMaterial( name, object.$getSceneInstance() )
		material.emissiveColor = new BB.Color3( r,g,b )
		material.disableLighting = true
		material.backFaceCulling = false
		object.$getEngineMaterialCache().set( name, material )
	}
	return material 
}

export function GenerateCachedDiscOrSphere( object, color, resolution, radius, useSphere ) {

	color = (new Vec4( color )).toArray()
	const r = color[0]
	const g = color[1]
	const b = color[2]
	const a = color[3]

	
	const nameSphere = 'Sphere' + [r,g,b,a].join('') + resolution
	const nameDisc = 'Disc' + [r,g,b,a].join('') + resolution

	const cache = object.$getEngineMeshCache()
	const meshSphere = cache.get(nameSphere)
	const meshDisc = cache.get(nameDisc)
	const other = useSphere ? meshDisc : meshSphere

	let mesh = useSphere ? meshSphere : meshDisc
	let name = useSphere ? nameSphere : nameDisc

	if (other) {
		other.isVisible = false
		other.isPickable = false
	}

	if (!mesh) {


		if (useSphere) {

			mesh = new BB.CreateSphere( name, {
				diameterX: 2,
				diameterY: 2,
				diameterZ: 2,
				segments: resolution,
				sideOrientation: 2
			}, object.$getSceneInstance())
		} else {

			mesh = new BB.CreateDisc( name, {
				radius: 1,
				tessellation: resolution,
				sideOrientation: 2
			}, object.$getSceneInstance())
		}

		mesh.makeGeometryUnique()
		mesh.material = GeneratePlainColorMaterial( object, r, g, b )
		mesh.material.alpha = a
		mesh.thinInstanceEnablePicking = true
		mesh.billboardMode = 7
		mesh.backFaceCulling = false

		mesh.isPickable = false
		mesh.isVisible = false
		mesh.setEnabled( false )

		cache.set(name, mesh)
	}

	return name

}

export function GenerateCachedExternal( object, uid, appendName ) {

	// NAME = OBJECT + UID + APPEND
		
	const mesh = object.$getLookup().get(uid)?.mesh

	if (!mesh) return SAY(`🚨 GenerateCachedExternal ${object.uid} -> ${uid}`)

	const name = object.uid + uid + 'Thin' + (appendName||'')
	const cache = object.$getEngineMeshCache()
	let thin = cache.get( name )
	if (!thin) {
		thin = mesh.createInstance( name )
		thin.isVisible = false 
		thin.thinInstanceEnablePicking = true
		thin.isPickable = false
		thin.meta = { uid: object.uid, object: object.type }
		cache.set( name, thin )
		if (object.debug) SAY(`🟢 GenerateCachedExternal ${object.uid} -> ${uid} -> ${name}`)
	}

	return name
}

export function Convert2Dto3D(point, areaWidth, areaHeight, matrixes) {

	if (!point) return
	const normalizedPoint = new Vec3(point)

	let { worldMatrix, viewMatrix, projectionMatrix } = matrixes

	if (!worldMatrix?.m) worldMatrix = BB.Matrix.FromArray(worldMatrix)
	if (!viewMatrix?.m) viewMatrix = BB.Matrix.FromArray(viewMatrix)
	if (!projectionMatrix?.m) projectionMatrix = BB.Matrix.FromArray(projectionMatrix)

	const unprojectedPoint = Vec3.Unproject(
		normalizedPoint,
		areaWidth,
		areaHeight,
		BB.Matrix.Identity(),
		viewMatrix,
		projectionMatrix
	)

	return (new Vec3(unprojectedPoint)).toObject()
}

export function Convert3Dto2D(point, width, height, matrixes) {

	if (!point) return
	const normalizedPoint = new Vec3(point)

	let { transformationMatrix } = matrixes
	if (!transformationMatrix?.m) transformationMatrix = BB.Matrix.FromArray(transformationMatrix)

	const projectPoint = Vec3.Project(
		normalizedPoint,
		BB.Matrix.Identity(),
		transformationMatrix,
		{ x: 0, y: 0, width, height }
	)

	return (new Vec3(projectPoint)).toObject()

}



export function Convert3Dto2D2(point, width, height, matrixes) {
	if (!point) return
	point = new Vec3(point.x, point.y, point.z)

	let { projectionMatrix, transformationMatrix } = matrixes

	if (!projectionMatrix?.m) projectionMatrix = BB.Matrix.FromArray(projectionMatrix)
	if (!transformationMatrix?.m) transformationMatrix = BB.Matrix.FromArray(transformationMatrix)
	let transformed = Vec3.TransformCoordinates(point, transformationMatrix)

	const r = new Vec3(
		((transformed.x * 0.5 + 0.5) * width),
		((1.0 - transformed.y * 0.5 - 0.5) * height),
		transformed.z
	)

	return r
}


export function Convert2Dto3DWithRef(point, areaWidth, areaHeight, matrixes, cameraPosition, referencePosition ) {

	point = new Vec3(point)
	referencePosition = new Vec3( referencePosition )
	cameraPosition = new Vec3( cameraPosition )

	let { worldMatrix, viewMatrix, projectionMatrix } = matrixes
	
	if (!worldMatrix?.m) worldMatrix = BB.Matrix.FromArray(worldMatrix)
	if (!viewMatrix?.m) viewMatrix = BB.Matrix.FromArray(viewMatrix)
	if (!projectionMatrix?.m) projectionMatrix = BB.Matrix.FromArray(projectionMatrix)


	const unprojectedPoint = Vec3.Unproject(
		point,
		areaWidth,
		areaHeight,
		worldMatrix || BB.Matrix.Identity(),
		viewMatrix,
		projectionMatrix
	)

	const forward = Vec3.TransformNormal(new Vec3(0, 0, -1), worldMatrix)
	const direction = unprojectedPoint.subtract(cameraPosition).normalize()
	const scalar = Vec3.Dot(forward, referencePosition.subtract(cameraPosition)) / Vec3.Dot(forward, direction)
	const point3D = cameraPosition.clone().add(direction.scale(scalar))

	return point3D
}
