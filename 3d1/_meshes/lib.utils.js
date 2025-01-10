import * as BB from 'babylonjs'

export function AddNormalsLines(scene, mesh, size = 1, color = new BB.Color3(1, 1, 0) ) {
    const normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind)
    const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)
    let lines = []
    for (let i = 0; i < normals.length; i += 3) {
        const v1 = BABYLON.Vector3.FromArray(positions, i)
        const n = BABYLON.Vector3.FromArray(normals, i).normalize().scale(size)
        const v2 = v1.add(n)
        lines.push([v1, v2])
    }
    // console.log({normals, positions, size, color, scene, mesh, lines})
    const normalLines = BABYLON.MeshBuilder.CreateLineSystem('normalLines', {lines: lines}, scene)
    normalLines.color = color
    normalLines.parent = mesh
    return normalLines
}