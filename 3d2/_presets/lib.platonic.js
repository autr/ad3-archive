import { 
	TETRA,
	CUB,
	HEXA,
	OCTA ,
	DODECA ,
	ICOSA ,
	HEDRON,
	TRUNCATED,
	RHOMBI ,
	SNUB ,
	GREAT ,
	SMALL
} from '../defs.js'

export default [
	{ 
		formula: [ 3, '|', 2, 3 ],
		formulaInterp: [2,4,9,12,15],
		id: 'tetrahedron',
		names: [ [ TETRA, HEDRON ] ],
		description: '3 triangles meet at each vertex (Tetrahedron)',
		stats: {
			edges: 6,
			vertices: 4,
			faces: { TETRA: 4 }
		},
		symbols: [
			[ 3, 0, 1, 0 ],
			[ 3, 0, 0, 1 ]
		]
	},
	{ 
		formula: [ 3, '|', 2, 4 ],
		formulaInterp: [2],
		id: 'cube',
		names: [ [ CUB ], [ HEXA, HEDRON ] ],
		description: '3 squares meet at each vertex (Cube)',
		stats: {
			edges: 12,
			vertices: 8,
			faces: { CUB: 6 }
		},
		symbols: [
			[ 4, 0, 1, 0 ]
		]
	},
	{ 
		formula: [ 4, '|', 2, 3 ],
		formulaInterp: [4],
		id: 'octahedron',
		names: [ [ OCTA, HEDRON ] ],
		description: '4 triangles meet at each vertex (Octahedron)',
		stats: {
			edges: 12,
			vertices: 6,
			faces: { TETRA: 8 }
		},
		symbols: [
			[ 4, 0, 0, 1 ],
			[ 3, 1, 0, 0 ],
		]
	},
	{ 
		formula: [ 3, '|', 2, 5 ],
		formulaInterp: [2],
		id: 'dodecahedron',
		names: [ [ DODECA, HEDRON ] ],
		description: '3 pentagons meet at each vertex (Dodecahedron)',
		stats: {
			edges: 30,
			vertices: 20,
			faces: { PENTA: 12 }
		},
		symbols: [
			[ 5, 0, 1, 0 ],
		]
	},
	{ 
		formula: [ 5, '|', 2, 3 ],
		formulaInterp: [4],
		id: 'icosahedron',
		names: [ [ ICOSA, HEDRON ] ],
		description: '5 triangles meet at each vertex (Icosahedron)',
		stats: {
			edges: 30,
			vertices: 12,
			faces: { TETRA: 20 }
		},
		symbols: [
			[ 5, 0, 0, 1 ],
		]
	}
]
