/* ====================================== */
/*                                        */
/*         	   VERTICES TOOL              */
/*                                        */
/* ====================================== */


export default class VerticesTool {

	vertices = []
	sides = 0
	constructor( mesh, sides ) {
		this.sides = sides + 1
		this.vertices = mesh.getVerticesData(VertexBuffer.PositionKind)
		this.mesh = mesh
	}
	getVertex( idx ) {
		return this.vertices[idx * 3]
	}
	getTotalVertices() {
		return this.vertices.length / 3
	}
	getTotalPolygons() {
		const totalVertices = this.getTotalVertices()
		return totalVertices / this.sides
	}
	getPolygon( idx ) {
		const from = idx * this.sides * 3
		const to = from + (3 * this.sides)
		return this.vertices.slice( from, to )
	}
	setPolygon( idx, vertices ) {
		const from = idx * this.sides * 3
		const to = from + (3 * this.sides)
		let ii = 0
		for (let i = from; i < to; i++) {
			this.vertices[i] = vertices[ii]
			ii += 1
		}
	}
	writeToMesh() {
		this.mesh.updateVerticesData(VertexBuffer.PositionKind, this.vertices)
	}

}
