import { 
    TRIAKIS,
    TETRAKIS,
    DISDYAKIS,
    TRIACONTA,
    PENTAKIS,
    RHOMBIC,

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

export default [
    {
        math: [3, '|', 4, 3],
        id: 'triakis-tetrahedron',
        names: [
            [TRIAKIS, TETRA, HEDRON],
            [TRUNCATED, TETRA, HEDRON]
        ],
        description: '3 triangles meet at each vertex (Triakis Tetrahedron)',
    },
    {
        math: [4, '|', 3, 4],
        id: 'rhombic-dodecahedron',
        names: [
            [RHOMBIC, DODECA, HEDRON],
            [CUB, OCTA, HEDRON]
        ],
        description: '4 triangles meet at each vertex (Rhombic Dodecahedron)',
    },
    {
        math: [5, '|', 3, 5],
        id: 'triakis-octahedron',
        names: [
            [TRIAKIS, OCTA, HEDRON],
            [TRUNCATED, CUB]
        ],
        description: '5 triangles meet at each vertex (Triakis Octahedron)',
    },
    {
        math: [3, 4, '|', 4],
        id: 'tetrakis-hexahedron',
        names: [
            [TETRAKIS, HEXA, HEDRON],
            [TRUNCATED, OCTA, HEDRON]
        ],
        description: '3 squares meet at each vertex (Tetrakis Hexahedron)',
    },
    {
        math: [5, '|', 3, 5],
        id: 'pentakis-dodecahedron',
        names: [
            [PENTAKIS, DODECA, HEDRON]
        ],
        description: '5 triangles meet at each vertex (Pentakis Dodecahedron)',
    },
    {
        math: [3, 5, '|', 5],
        id: 'rhombic-triacontahedron',
        names: [
            [RHOMBIC, TRIACONTA, HEDRON],
            [ICOSA, DODECA, HEDRON]
        ],
        description: '3 pentagons meet at each vertex (Rhombic Triacontahedron)',
    },
    {
        math: [2, 3, 5, '|'],
        id: 'disdyakis-dodecahedron',
        names: [
            [DISDYAKIS, DODECA, HEDRON],
            [TRUNCATED, CUB, OCTA, HEDRON]
        ],
        description: '2 triangles, a square, and a pentagon meet at each vertex (Disdyakis Dodecahedron)',
    },
    {
        math: [2, 3, 5, '|'],
        id: 'disdyakis-triacontahedron',
        names: [
            [DISDYAKIS, TRIACONTA, HEDRON],
            [TRUNCATED, ICOSA, DODECA, HEDRON ]
        ],
        description: '2 triangles, a square, and a pentagon meet at each vertex (Disdyakis Triacontahedron)',
    }
]
