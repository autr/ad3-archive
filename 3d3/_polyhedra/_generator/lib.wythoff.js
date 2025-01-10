/* ====================================== */
/*                                        */
/*            WYTHOFF WORKER              */
/*                                        */
/* ====================================== */

import { props } from '$root'
import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)

import schemaSettings from './schema.settings.js'
import schemaOffload from './schema.offload.js'

import Geometry from './lib.geometry.js'
import { Vec2, Vec3, Vec4 } from '$3d1_points'

const functionNames = [] // TODO

// ================== UPDATE ================== 

Wythoff.prototype.generatePolyhedron = function (calledFrom, debug) {

	const $ = this

	$.DEBUG = debug
	$.data.points = []
	$.data.edges = []
	$.data.numPoints = 0
	$.data.numFaces = 0
	$.polygonLookup = {}

	if ($.DEBUG) SAY('✨ [update]', calledFrom, $.getStats())


	if (!$.data.vertices) $.data.vertices = []
	if (!$.data.polygons) $.data.polygons = []
	$.data.triangle = $.settings.triangle


	const externalDrawMethod = function(doSetup, message) {
		if ($.DEBUG && doSetup) SAY('✨ [externalDrawMethod]', { doSetup })
		if (doSetup) $.setup()
		$.drawFaces()
		// $.drawregions()
	}

	$.drawCompound( externalDrawMethod )
	$.generateMeshData()

	let ifact = $.settings.ifact
	ifact += $.settings.invertInc
	if (ifact > 1) ifact = 1;
	if (ifact < 0) ifact = 0;
	if (ifact != $.settings.ifact) {
		$.settings.ifact = ifact
	}

	let duplicates = {}
	let lookup = {}

	const filteredVertices = $.data.vertices.filter( (vertex,idx) => {
		const str = JSON.stringify(vertex)
		const exists = duplicates[str]
		const isUndef = exists === undefined
		if (isUndef) duplicates[str] = idx
		lookup[idx] = Object.keys(duplicates).indexOf(str)
		return isUndef
	})

	const filteredEdges = [ ...new Set($.data.edges.map( pair => {
		return [
			lookup[pair[0]],
			lookup[pair[1]]
		].sort( (a,b) => a - b).join(':')
	})) ].map( pair => pair.split(':').map(chr=>parseInt(chr)) )

	const filteredPoints = [ ...new Set( $.data.points.map( idx => {
		return lookup[idx]
	})) ]

	const justVertices = filteredVertices.map( (v,idx) => idx )


	const filteredFaces = Object.values($.polygonLookup).map( polygon => {
		return polygon.map( idx => lookup[idx] )
	})

	$.data.vertices = filteredVertices
	$.data.edges = filteredEdges
	$.data.points = filteredPoints
	$.data.faces = filteredFaces

	return $.data

}



// ====== MAIN ======

function Wythoff( DEBUG = false, initSettings = {}, initOffload = {} ) {

	const $ = this 

	$.DEBUG = DEBUG
	if ($.DEBUG) SAY(`✨ [constructor]`, {initSettings, initOffload} )
	$.schema = {
		settings: schemaSettings,
		offload: schemaOffload
	}
	$.data = {}

	$.settings = { ...props.schemaToValues( $.schema.settings ), ...initSettings }
	$.offload = { ...props.schemaToValues( $.schema.offload ), ...initOffload }

	return $
}

Wythoff.prototype.syncSettings = function( external ) {
	const $ = this 

	$.settings.triangle = [external.schwarz.x,external.schwarz.y,external.schwarz.z]
	$.settings.symbol = [2,3,external.frequency] 
	$.settings.explode = external.explode
	$.settings.snub = external.snub
	$.settings.stellate = external.stellate

	SAY(`🍋 [syncSettings]`, external, $.settings)

}

Wythoff.prototype.getStats = function() {
	let str = ''
	for (const [key,value] of Object.entries(this.data)) {
		str += `${key}=${value?.length || value}\n`
	}
	return '' // str
}

// ================== SETUP ================== 

Wythoff.prototype.setup = function() {

	const $ = this 
	const { debug } = $.settings

	if ($.DEBUG) SAY(`✨ [setup] ${$.settings.symbol}`, $.getStats())

	// -------------- SCHWARZ --------------

	const strAngles = JSON.stringify($.settings.symbol)


	if ($.DEBUG) SAY(`🌴 [setup: new symbol!]`, strAngles, $.getStats())
	$.schwarz = new (Geometry.Schwarz)($.settings.symbol)
	const sym = Geometry.Schwarz.makeSymmetry($.settings.symmetry);
	if (!sym) {
		if ($.DEBUG) SAY(`❌ makeSymmetry failed for ${$.settings.symmetry}`, $.getStats())
		return
	} else {
		$.symmetry = [Geometry.Vector.normalize(Geometry.Vector.cross(sym[1],sym[2])),
						 Geometry.Vector.normalize(Geometry.Vector.cross(sym[2],sym[0])),
						 Geometry.Vector.normalize(Geometry.Vector.cross(sym[0],sym[1]))];
	}
	requestAnimationFrame( () => {
		$.schwarz.describe(true)
	})


	console.assert($.pointset == null)
	console.assert($.data.transmat == null)

	// -------------- BARY --------------

	if (!$.settings.snub) {

		$.bary = $.schwarz.tri2bary($.data.triangle)

	} else {

		// ------ BARY COORDINATE, TO MAP 1,1,1 to SNUB POINT ------

		const initBary = [$.data.triangle[0]*$.schwarz.snuba[0],
					$.data.triangle[1]*$.schwarz.snuba[1],
					$.data.triangle[2]*$.schwarz.snuba[2]];

		// ------ SCALE TO SPHERE ------

		const schwarzBary = $.schwarz.applybary(initBary,0);
		$.bary = Geometry.Vector.div(initBary,Geometry.Vector.length(schwarzBary))
	}

	// -------------- FACES --------------

	$.data.facedata = $.schwarz.makefacedata($.bary)

	if ($.settings.compound) {

		const regionpoints = $.data.facedata.regionpoints
		let pointset = []

		for (var i = 0; i < regionpoints.length; i++) {
			if (!$.settings.snub || $.schwarz.regions[i][3] == 0) {
				Geometry.PointSet.add(regionpoints[i],pointset,1e-6)
			}
		}
		Geometry.PointSet.sort(pointset)
		$.pointset = pointset
	}

	// -------------- SPHERES --------------

	if ($.settings.snub) {
		$.midsphere = $.data.facedata.snubsphere
	} else {
		$.midsphere = $.data.facedata.midsphere
	}

	// -------------- STELLATE --------------

	if ($.settings.stellate > 0) {
		$.schwarz.stellate($.data.facedata, $.settings.hideFaces, $.settings.stellate);
	}
}

// ================== GENERATE MESH ================== 

Wythoff.prototype.generateMeshData = function() {

	const $ = this
	if ($.DEBUG) SAY(`✨ [generateMeshData]`, $.getStats())

	const needsReset = !$.data.vertexarray || $.data.vertexarray.length < $.data.numFaces*3*3

	$.data.vertexarray = new Float32Array($.data.numFaces*3*3)
	$.data.uvarray = new Float32Array($.data.numFaces*3*2)
	$.data.indicesarray = new Float32Array($.data.numFaces*3)

	for (var i = 0; i < $.data.numFaces; i++) {

		const face = $.data.polygons[i]

		for (var j = 0; j < 3; j++) {

			const vertexIndex = i * 3 + j
			const idx = face.vlist[j]
			const vertex = $.data.vertices[idx]
			$.data.vertexarray[i*3*3+j*3+0] = vertex.x
			$.data.vertexarray[i*3*3+j*3+1] = vertex.y
			$.data.vertexarray[i*3*3+j*3+2] = vertex.z

			const uvs = face.uvs[j]
			$.data.uvarray[i*3*2+j*2+0] = uvs.x
			$.data.uvarray[i*3*2+j*2+1] = uvs.y

			$.data.indicesarray[vertexIndex] = vertexIndex

		}
	}

}

// ================== INTERPOLATE SYMBOL ================== 

Wythoff.prototype.interpolateSymbol = function(points, interpolation) {

	const $ = this

	if ($.DEBUG) SAY('✨ [interpolateSymbol]', $.getStats())

	const value = Math.min( Math.max(0,interpolation), schemaSettings.interpolate.max)
	let t = (value / schemaSettings.interpolate.max * points.length) % points.length
	const s = t%1
	t = Math.floor(t)
	const start = points[t]
	const end = points[(t+1)%points.length]
	let res = []
	for (let i = 0; i < 3; i++) res[i] = (1-s)*start[i] + s*end[i]
	return res
}

// ================== DRAW FACES ==================

Wythoff.prototype.drawFaces = function() {

	const $ = this

	if ($.DEBUG) SAY('✨ [drawFaces]', $.getStats())

	const points = $.schwarz.points;
	const regions = $.schwarz.regions;
	const regionpoints = $.data.facedata.regionpoints

	const uvs = [{ x: 0, y: 0 },
			   { x: 1, y: 0 },
			   { x: 0, y: 1 }]

	for (let faceType = 0; faceType < 3; faceType++) {

		if (!$.data.facedata.polygons[faceType] || $.settings.hideFaces[faceType]) continue
		const facepoints = $.schwarz.polygons[faceType]

		if ($.settings.stellate > 0) {

			if ($.DEBUG) SAY('🌴 [drawFaces:stellate]', $.getStats())

			for (let i = 0; i < facepoints.length; i++) {

				const plist = facepoints[i]

				if (plist) {
					const centre = Geometry.Vector.mul(points[i],$.data.facedata.facedistances[faceType])                    
					const facelines = $.data.facedata.facelines[faceType];
					if (!facelines) continue;
					for (let j = 0; j < facelines.length; j++) {
						const p1 = $.schwarz.applybary(facelines[j][0],plist[0])
						const p2 = $.schwarz.applybary(facelines[j][1],plist[0])

						if ($.DEBUG) SAY('🚚 [drawTriangle] A)')
						$.drawTriangle(centre,p1,p2,uvs,centre,faceType,i,$.settings.triangleDepth)
					}
				}
			}
		} else {

			if ($.DEBUG) SAY('🌱 [drawFaces:!stellate]', $.getStats())

			$.doretroflex = true

			for (let i = 0; i < facepoints.length; i++) {

				const fpoints = facepoints[i]

				if (fpoints && (!$.settings.snub || fpoints.length > 4)) {

					const centre = Geometry.Vector.mul(points[i],$.data.facedata.facedistances[faceType])
					const inc = $.settings.snub ? 2 : 1;
					let plist = []

					for (var j = 0; j < fpoints.length; j+=inc) {
						plist.push(regionpoints[fpoints[j]])
					}

					$.drawFace(centre,plist,faceType,i)

				}
			}
		}
	}
	if ($.settings.snub && !$.settings.stellate && !$.settings.hideFaces[3] && $.data.facedata.snubcentre) {

		if ($.DEBUG) SAY(`☘️ [drawFaces: draw snub triangle for ve]`, $.getStats())

		for (let i = 0; i < regions.length; i++) {
			const t = regions[i]
			if (t[3] == 1) {
				const centre = $.schwarz.applybary($.data.facedata.snubcentre, i)
				const plist = [regionpoints[$.schwarz.adjacent[i][0]],
							 regionpoints[$.schwarz.adjacent[i][1]],
							 regionpoints[$.schwarz.adjacent[i][2]]]

				$.drawFace(centre,plist,3,i)
			}
		}
	}
}

// ================== DRAW FACE ================== 


Wythoff.prototype.drawFace = function(centre,plist,faceType,index,parity) {

	const $ = this

	if ($.DEBUG) SAY('✨ [drawFace]', $.getStats())


	function mod(i,n) {
		i %= n
		if (i < 0) i += n
		return i
	}

	const Vector = Geometry.Vector

	if ($.DEBUG) SAY('🥣 [drawFace]', $.getStats())

	if ($.settings.hemi) {

		const uvs = [{x: 0,y: 0}, {x: 1,y: 0}, {x: 0,y: 1}]

		for (let i = 0; i < plist.length; i++) {
			const p1 = plist[i]
			const p2 = plist[(i+1)%plist.length]
			if (Geometry.Vector.taxi(p1,p2) > 1e-4) {
				if ($.DEBUG) SAY('🎃 [drawTriangle] B)')
				$.drawTriangle([0,0,0],p1,p2,uvs,centre,4,index,$.settings.triangleDepth)
			}
		}
	}

	let faceUVs = []

	let uAxis = null
	for (var i = 0; i < plist.length; i++) {
		if (Geometry.Vector.taxi(plist[i],centre) > 1e-4) {
			uAxis = Geometry.Vector.normalize(Geometry.Vector.sub(plist[i],centre))
			break
		}
	}
	if (!uAxis) uAxis = [1,0,0]

	let vAxis = Geometry.Vector.normalize(Geometry.Vector.cross(centre,uAxis))

	if (parity) vAxis = Geometry.Vector.negate(vAxis) // TODO: turn this into settings option?

	for (let i = 0; i < plist.length; i++) {
		const p = plist[i]
		const u = 0.5 + Geometry.Vector.dot(Geometry.Vector.sub(p,centre),uAxis)
		const v = 0.5 + Geometry.Vector.dot(Geometry.Vector.sub(p,centre),vAxis)
		faceUVs.push({x: u, y: v}) // TODO Vector2
	}

	const uvCenter = { x: 0.5, y: 0.5 }

	if (plist.length == 3) {

		if ($.DEBUG) SAY(`🔹 [drawFace: plist === 3]`, $.getStats())
		if ($.DEBUG) SAY('🉑 [drawTriangle] C)')
		$.drawTriangle(plist[0],plist[1],plist[2],faceUVs,centre,faceType,index,$.settings.triangleDepth)

	} else {

		if ($.doretroflex && faceType < 4 && plist.length > 4) {

			if ($.DEBUG) SAY(`🥣 [drawFace: doretroflex && faceType < 4]`, $.getStats())
			let neuPlist = []
			let neuFaceUVs = []
			for (let i = 0; i < plist.length; i++) {

				const p0 = plist[mod(i-1,plist.length)] // previous vertex
				const p1 = plist[i]
				const p2 = plist[mod(i+1,plist.length)] // edge vertices

				const c = Vector.mid(p1,p2) // edge centre
				const e = Vector.sub(p2,p1) // edge vector
				const v = Vector.sub(p1,p0) // previous edge

				const tmp = Vector.dot(v,e)
				if (Math.abs(tmp) < 1e-4) break // avoid divide by zero & infinities

				const k = -Vector.dot(p0,e)/tmp
				const q = Vector.add(p0,Vector.mul(v,k)) // intersection with centre line
				const c0 = Vector.sub(c,centre)
				const q0 = Vector.sub(q,centre)

				const efact = Vector.dot(q0,c0)/Vector.dot(c0,c0)

				if (0 < efact && efact < 1) {
					const u = 0.5 + Vector.dot(Vector.sub(q,centre),uAxis)
					const v = 0.5 + Vector.dot(Vector.sub(q,centre),vAxis)
					const neuUV = new Vec2(u,v)
					neuFaceUVs.push(neuUV)
					const uvs = [neuUV,faceUVs[i],faceUVs[(i+1)%plist.length]]
					neuPlist.push(q)

					if ($.DEBUG) SAY('📙 [drawTriangle] D)')
					$.drawTriangle(q,p1,p2,uvs,centre,faceType,index,$.settings.triangleDepth)
				}
			}
			if (neuPlist.length > 0) {
				plist = neuPlist
				faceUVs = neuFaceUVs
			} else {
				$.doretroflex = false
			}
		}
		console.assert(faceUVs.length == 0 || faceUVs.length == plist.length)


		for (let i = 0; i < plist.length; i++) {
			const p1 = plist[i]
			const p2 = plist[(i+1)%plist.length]
			const uvs = [uvCenter,faceUVs[i],faceUVs[(i+1)%plist.length]]
			if (Vector.taxi(p1,p2) > 1e-4) { // don't draw if degenerate
				if ($.DEBUG) SAY('✴️ [drawTriangle] E)', index)

				$.drawTriangle(centre,p1,p2,uvs,centre,faceType,index,$.settings.triangleDepth)
			}
		}
	}
}

// ================== DRAW TRIANGLE ================== 

Wythoff.prototype.drawTriangle = function(p,q,r,uvs,offset,faceType,i,n) {

	const $ = this
	if ($.DEBUG) SAY('✨ [drawTriangle]', $.getStats())

	if (n == 0) {

		if ($.DEBUG) SAY('👛 [drawTriangle: n == 0]', $.getStats())

		const faceFact = ($.compound/*+faceType*/)*0.0001 // reduce z-fighting

		const index0 = $.drawPoint(p,offset,faceFact)
		const index1 = $.drawPoint(q,offset,faceFact)
		const index2 = $.drawPoint(r,offset,faceFact)

		if (!$.polygonLookup[i]) $.polygonLookup[i] = []
		$.polygonLookup[i].push(index2)

		if ($.data.numFaces == $.data.polygons.length) {
			$.data.polygons.push({ vlist: [0,0,0], uvs: [{x:0,y:0},{x:0,y:0},{x:0,y:0}] })
			$.needclone = true
		}

		const face = $.data.polygons[$.data.numFaces]
		face.vlist[0] = index0
		face.vlist[1] = index1
		face.vlist[2] = index2

		face.uvs[0] = { ...uvs[0] }
		face.uvs[1] = { ...uvs[1] }
		face.uvs[2] = { ...uvs[2] }

		$.data.numFaces++

		$.data.points.push( index2 )
		$.data.edges.push( [ index1, index2 ].sort( (a,b) => a - b) )


	} else {

		if ($.DEBUG) SAY('🎀 [drawTriangle]', $.getStats())

		const ttt = 0.5 // vary ttt for slightly tacky rotating effect

		const p1 = Geometry.Vector.interp(p,q,ttt)
		const q1 = Geometry.Vector.interp(q,r,ttt)
		const r1 = Geometry.Vector.interp(r,p,ttt)

		const k = 3

		if (k != 0) $.drawTriangle(p,p1,r1,uvs,offset,faceType,i,n-1)
		if (k != 1) $.drawTriangle(p1,q,q1,uvs,offset,faceType,i,n-1)
		if (k != 2) $.drawTriangle(r1,q1,r,uvs,offset,faceType,i,n-1)
		if (k != 3) $.drawTriangle(p1,q1,r1,uvs,offset,faceType,i,n-1)
	}
}

// ================== DRAW POINT ================== 

Wythoff.prototype.drawPoint = function(p,offset,faceFact) {

	const $ = this

	const ifact = $.settings.ifact
	let w = p[3] || 1 // homogeneous coords

	if ($.settings.normalize) w = Geometry.Vector.length(p)

	if (ifact != 0) {
		const k = w*Geometry.Vector.dot(p,p)/$.midsphere
		const w0 = (1-ifact)*w+ifact*k
		w = w0
	}

	let x = p[0]/w
	let y = p[1]/w
	let z = p[2]/w

	// console.log('HELLO', x, y, z, p, w)
	var explode = $.settings.explode

	if (offset) {
		if (explode != 0) {
			x += explode*offset[0]
			y += explode*offset[1]
			z += explode*offset[2]
		}
	}
	if (faceFact) {
		x *= (1+faceFact)
		y *= (1+faceFact)
		z *= (1+faceFact)
	}
	if ($.data.transmat) {
		const m = $.data.transmat
		var x1 = m[0][0]*x + m[0][1]*y + m[0][2]*z
		var y1 = m[1][0]*x + m[1][1]*y + m[1][2]*z
		var z1 = m[2][0]*x + m[2][1]*y + m[2][2]*z
		x = x1
		y = y1
		z = z1
	}

	if ($.data.numPoints == $.data.vertices.length) {
		$.data.vertices.push({x:0,y:0,z:0})
	}

	let u = $.data.vertices[$.data.numPoints]
	u.x = x
	u.y = y
	u.z = z

	return $.data.numPoints++
}

// ================== DRAW COMPOUND ================== 

Wythoff.prototype.drawCompound = function( externalDrawMethod ) {

	const $ = this

	if ($.DEBUG) SAY(`✨ [drawCompound]`, $.getStats())


	$.data.compound = 0
	$.data.transmat = null
	$.data.pointset = null

	externalDrawMethod( true, '' )

	if ($.settings.compound) {

		console.assert($.data.pointset,'no pointset defined for compounding')

		const ip = Geometry.Vector.zrot($.symmetry[0], $.settings.theta)
		const iq = Geometry.Vector.zrot($.symmetry[1], $.settings.theta)
		const ir = Geometry.Vector.zrot($.symmetry[2], $.settings.theta)
		const pointsets = [{trans: "", pointset: $.data.pointset}]

		$.data.compound = 1

		for (var pindex = 0, count = 0; pindex != pointsets.length && count < 400; pindex++, count++) {

			const entry = pointsets[pindex];
			const ops = $.settings.chiral ? ['PQ','QR','RP'] : ['P','Q','R']

			for (var i = 0; i < ops.length; i++) {

				console.log(entry.pointset, $.data.pointset)
				const neuSet = Geometry.mapply(ops[i],entry.pointset,ip,iq,ir)
				Geometry.PointSet.sort(neuSet)

				let seen = false
				const parity = (entry.trans.length + ops[i].length)%2

				for (var j = 0; j < pointsets.length; j++) {

					if ($.settings.snub && pointsets[j].trans.length%2 != parity) continue

					if (Geometry.PointSet.equal(neuSet,pointsets[j].pointset,1e-4)) {
						seen = true
						break
					}
				}
				if (!seen) {
					const newTransmat = entry.trans + ops[i];
					$.data.transmat = Geometry.makematrix(newTransmat,ip,iq,ir)
					
					if ($.DEBUG) SAY(`🌴 TRANSMAT DRAW`, $.getStats())

					$.drawFaces()
					// $.drawregions()

					pointsets.push({trans: newTransmat, pointset: neuSet})
					$.data.compound++
				}
			}
		}
	}

}

export default Wythoff