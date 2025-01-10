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
        formula: [3, '|', 4, 3],
        formulaInterp: 0,
        id: 'triakis-tetrahedron',
        names: [
            [TRIAKIS, TETRA, HEDRON],
            [TRUNCATED, TETRA, HEDRON]
        ],
        description: '3 triangles meet at each vertex (Triakis Tetrahedron)',
        stats: {
            faces: {
                TETRA: 12
            },
            vertices: 4,
            edges: 18,
        }
    },
    {
        formula: [4, '|', 3, 4],
        formulaInterp: 0,
        id: 'rhombic-dodecahedron',
        names: [
            [RHOMBIC, DODECA, HEDRON],
            [CUB, OCTA, HEDRON]
        ],
        description: '4 triangles meet at each vertex (Rhombic Dodecahedron)',
        stats: {
            faces: {
                RHOMB: 12
            },
            vertices: 14,
            edges: 24,
        }
    },
    {
        formula: [5, '|', 3, 5],
        formulaInterp: 0,
        id: 'triakis-octahedron',
        names: [
            [TRIAKIS, OCTA, HEDRON],
            [TRUNCATED, CUB]
        ],
        description: '5 triangles meet at each vertex (Triakis Octahedron)',
        stats: {
            faces: {
                TETRA: 24
            },
            vertices: 6,
            edges: 36,
        }
    },
    {
        formula: [3, 4, '|', 4],
        formulaInterp: 0,
        id: 'tetrakis-hexahedron',
        names: [
            [TETRAKIS, HEXA, HEDRON],
            [TRUNCATED, OCTA, HEDRON]
        ],
        description: '3 squares meet at each vertex (Tetrakis Hexahedron)',
        stats: {
            faces: {
                CUB: 24
            },
            vertices: 8,
            edges: 36,
        }
    },
    {
        formula: [5, '|', 3, 5],
        formulaInterp: 0,
        id: 'pentakis-dodecahedron',
        names: [
            [PENTAKIS, DODECA, HEDRON]
        ],
        description: '5 triangles meet at each vertex (Pentakis Dodecahedron)',
        stats: {
            faces: {
                TETRA: 60
            },
            vertices: 20,
            edges: 90,
        }
    },
    {
        formula: [3, 5, '|', 5],
        formulaInterp: 0,
        id: 'rhombic-triacontahedron',
        names: [
            [RHOMBIC, TRIACONTA, HEDRON],
            [ICOSA, DODECA, HEDRON]
        ],
        description: '3 pentagons meet at each vertex (Rhombic Triacontahedron)',
        stats: {
            faces: {
                PENTA: 30
            },
            vertices: 32,
            edges: 60,
        }
    },
    {
        formula: [2, 3, 5, '|'],
        formulaInterp: 0,
        id: 'disdyakis-dodecahedron',
        names: [
            [DISDYAKIS, DODECA, HEDRON],
            [TRUNCATED, CUB, OCTA, HEDRON]
        ],
        description: '2 triangles, a square, and a pentagon meet at each vertex (Disdyakis Dodecahedron)',
        stats: {
            faces: {
                TETRA: 48,
                CUB: 12
            },
            vertices: 26,
            edges: 72,
        }
    },
    {
        formula: [2, 3, 5, '|'],
        formulaInterp: 0,
        id: 'disdyakis-triacontahedron',
        names: [
            [DISDYAKIS, TRIACONTA, HEDRON],
            [TRUNCATED, ICOSA, DODECA, HEDRON ]
        ],
        description: '2 triangles, a square, and a pentagon meet at each vertex (Disdyakis Triacontahedron)',
        stats: {
            faces: {
                TETRA: 120,
                PENTA: 12
            },
            vertices: 62,
            edges: 180,
        }
    }
]
