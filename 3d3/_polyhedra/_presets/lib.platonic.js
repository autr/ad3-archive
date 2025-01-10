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
		id: 'tetrahedron',
		names: [ [ TETRA, HEDRON ] ],
		description: '3 triangles meet at each vertex (Tetrahedron)',
		symbols: [
			[ 3, 0, 1, 0 ],
			[ 3, 0, 0, 1 ]
		]
	},
	{ 
		formula: [ 3, '|', 2, 4 ],
		id: 'cube',
		names: [ [ CUB ], [ HEXA, HEDRON ] ],
		description: '3 squares meet at each vertex (Cube)',
		symbols: [
			[ 4, 0, 1, 0 ]
		]
	},
	{ 
		formula: [ 4, '|', 2, 3 ],
		id: 'octahedron',
		names: [ [ OCTA, HEDRON ] ],
		description: '4 triangles meet at each vertex (Octahedron)',
		symbols: [
			[ 4, 0, 0, 1 ],
			[ 3, 1, 0, 0 ],
		]
	},
	{ 
		formula: [ 3, '|', 2, 5 ],
		id: 'dodecahedron',
		names: [ [ DODECA, HEDRON ] ],
		description: '3 pentagons meet at each vertex (Dodecahedron)',
		symbols: [
			[ 5, 0, 1, 0 ],
		]
	},
	{ 
		formula: [ 5, '|', 2, 3 ],
		id: 'icosahedron',
		names: [ [ ICOSA, HEDRON ] ],
		description: '5 triangles meet at each vertex (Icosahedron)',
		symbols: [
			[ 5, 0, 0, 1 ],
		]
	}
]
