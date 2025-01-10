

export function CreateTargetTorus(scene, uid = 'TargetTorus', innerRadius = 0.5, outerRadius = 1, color = [1,0,0,1], tesselation = 36) {


	if (outerRadius <= innerRadius) {
		SAY('Outer radius must be greater than inner radius.');
		return null;
	}

	const billboard = new BB.MeshBuilder.CreateTorus(uid, {
		diameter: outerRadius * 2,
		thickness: outerRadius - innerRadius,
		tessellation
	}, scene)

	const material = new BB.StandardMaterial(uid + 'Material', scene)
	material.diffuseColor = new BB.Color3.FromHexString(color)
	material.specularColor = new BB.Color3(0, 0, 0)
	billboard.material = material

	billboard.billboardMode = BB.Mesh.BILLBOARDMODE_ALL

	return billboard
}
