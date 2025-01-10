import { 
	TETRA,
	CUB,
	HEXA,
	PENTA,
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


export const CUBOCTAHEDRON = { 
	id: 'cuboctahedron',
	math: [ 2, '|', 3, 4 ],
	names: [
		[ CUB, OCTA, HEDRON ]
	],
	description: '3 squares and a triangle meet at each vertex (Cuboctahedron)',
	formulas: [
		[ 2, 3, 4, 1, 0, 0],
	]
}
export const ICOSADODECAHEDRON = { 
	id: 'icosadodecahedron',
	math: [ 2, '|', 3, 5 ],
	names: [
		[ ICOSA, DODECA, HEDRON ]
	],
	description: '3 triangles and 2 pentagons meet at each vertex (Icosidodecahedron)',
	formulas: [
		[ 2, 3, 5, 1, 0, 0 ]
	]
}
export const TRUNCATEDTETRAHEDRON = { 
	id: 'truncatedtetrahedron',
	math: [ 2, 3, '|', 3 ],
	names: [
		[ TRUNCATED, TETRA, HEDRON ]
	],
	description: '3 triangles meet at each vertex (Truncated tetrahedron)',
	formulas: [
		[ 2, 3, 3, 1, 0, 1 ],
		[ 2, 3, 3, 1, 1, 0 ],
	]
}
export const TRUNCATEDOCTAHEDRON = { 
	id: 'truncatedoctahedron',
	math: [ 2, 4, '|', 3 ],
	names: [
		[ TRUNCATED, OCTA, HEDRON ]
	],
	description: '2 triangles and 2 squares meet at each vertex (Truncated octahedron)',
	formulas: [
		[2, 3, 3, 1, 1, 1],
		[2, 3, 4, 1, 0, 1]
	]
}
export const TRUNCATEDCUBE = { 
	id: 'truncatedcube',
	math: [ 2, 3, '|', 4 ],
	names: [
		[ TRUNCATED, CUB ]
	],
	description: '3 triangles and a square meet at each vertex (Truncated cube)',
	formulas: [
		[ 2, 3, 4, 1, 1, 0 ]
	]
}
export const TRUNCATEDICOSAHEDRON = { 
	id: 'truncatedicosahedron',
	math: [ 2, 5, '|', 3 ],
	names: [
		[ TRUNCATED, ICOSA, HEDRON ]
	],
	description: '2 triangles and 2 pentagons meet at each vertex (Truncated icosahedron)',
	formulas: [
		[ 2, 3, 5, 1, 0, 1 ]
	]
}
export const TRUNCATEDDODECAHEDRON = {
	id: 'truncateddodecahedron', 
	math: [ 2, 3, '|', 5 ],
	names: [
		[ TRUNCATED, DODECA, HEDRON ]
	],
	description: '3 triangles and a pentagon meet at each vertex (Truncated dodecahedron)',
	formulas: [
		[ 2, 3, 5, 1, 1, 0 ]
	]
}
export const SMALLRHOMBICUBOCTAHEDRON = { 
	id: 'smallrhombicuboctahedron',
	math: [ 3, 4, '|', 2 ],
	names: [
		[ SMALL, RHOMBI, CUB, OCTA, HEDRON ],
		[ RHOMBI, CUB, OCTA, HEDRON ],
	],
	description: '2 squares, a triangle and a rectangle meet at each vertex (Rhombicuboctahedron)',
	formulas: [
		[ 2, 3, 4, 0, 1, 1 ]
	]
}
export const SMALLRHOMBIICOSADODECAHEDRON = { 
	id: 'smallrhombiicosadodecahedron',
	math: [ 3, 5, '|', 2 ],
	names: [
		[ SMALL, RHOMBI, ICOSA, DODECA, HEDRON ],
		[ RHOMBI, ICOSA, DODECA, HEDRON ],
	],
	description: '2 pentagons, a triangle, and a rectangle meet at each vertex (Rhombicosidodecahedron)',
	formulas: [
		[ 2, 3, 5, 0, 1, 1 ]
	]
}
export const GREATRHOMBICUBOCTAHEDRON = { 
	id: 'greatrhombicuboctahedron',
	math: [ 2, 3, 4, '|' ],
	names: [
		[ GREAT, RHOMBI, CUB, OCTA, HEDRON ],
		[ TRUNCATED, CUB, OCTA, HEDRON ],
	],
	description: '2 triangles, a square, and a hexagon meet at each vertex (Truncated cuboctahedron)',
	formulas: [
		[ 2, 3, 4, 1, 1, 1 ]
	]
}
export const GREATRHOMBIICOSADODECAHEDRON = { 
	id: 'greatrhombiicosadodecahedron',
	math: [ 2, 3, 5, '|' ],
	names: [
		[ GREAT, RHOMBI, ICOSA, DODECA, HEDRON ],
		[ TRUNCATED, ICOSA, DODECA, HEDRON ],
	],
	description: '2 triangles, a pentagon, and a decagon meet at each vertex (Truncated icosidodecahedron)',
	formulas: [
		[ 2, 3, 5, 1, 1, 1 ]
	]
}
export const SNUBCUBE = { 
	id: 'snubcube',
	math: [ '|', 2, 3, 4 ],
	names: [
		[ SNUB, CUB ],
		[ SNUB, CUB, OCTA, HEDRON ],
	],
	description: 'Snub form (Snub cube)',
	formulas: [ 
		[ 2, 3, 4, 0, 1, 1 ]
	],
	snub: true
}
export const SNUBDODECAHEDRON = { 
	id: 'snubdodecahedron',
	math: [ '|', 2, 3, 5 ],
	names: [
		[ SNUB, DODECA, HEDRON ],
		[ SNUB, ICOSA, DODECA, HEDRON ]
	],
	description: 'Snub form (Snub dodecahedron)',
	formulas: [ 
		[ 2, 3, 5, 1, 1, 1 ] 
	],
	snub: true
}