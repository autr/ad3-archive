
// https://forum.babylonjs.com/t/pbr-fresnel-effect/22800/3

export function CreateMultiColorMaterial() {

	const nodeMaterial = new BB.NodeMaterial("node")
	nodeMaterial.mode = BB.NodeMaterialModes.Material

	// InputBlock
	const position = new BB.InputBlock("position")
	position.visibleInInspector = false
	position.visibleOnFrame = false
	position.target = 1
	position.setAsAttribute("position")

	// TransformBlock
	const WorldPos = new BB.TransformBlock("WorldPos")
	WorldPos.visibleInInspector = false
	WorldPos.visibleOnFrame = false
	WorldPos.target = 1
	WorldPos.complementZ = 0
	WorldPos.complementW = 1

	// InputBlock
	const World = new BB.InputBlock("World")
	World.visibleInInspector = false
	World.visibleOnFrame = false
	World.target = 1
	World.setAsSystemValue(BB.NodeMaterialSystemValues.World)

	// TransformBlock
	const Worldnormal = new BB.TransformBlock("World normal")
	Worldnormal.visibleInInspector = false
	Worldnormal.visibleOnFrame = false
	Worldnormal.target = 1
	Worldnormal.complementZ = 0
	Worldnormal.complementW = 0

	// InputBlock
	const normal = new BB.InputBlock("normal")
	normal.visibleInInspector = false
	normal.visibleOnFrame = false
	normal.target = 1
	normal.setAsAttribute("normal")

	// FresnelBlock
	const Fresnel = new BB.FresnelBlock("Fresnel")
	Fresnel.visibleInInspector = false
	Fresnel.visibleOnFrame = false
	Fresnel.target = 4

	// ViewDirectionBlock
	const Viewdirection = new BB.ViewDirectionBlock("View direction")
	Viewdirection.visibleInInspector = false
	Viewdirection.visibleOnFrame = false
	Viewdirection.target = 4

	// InputBlock
	const cameraPosition = new BB.InputBlock("cameraPosition")
	cameraPosition.visibleInInspector = false
	cameraPosition.visibleOnFrame = false
	cameraPosition.target = 1
	cameraPosition.setAsSystemValue(BB.NodeMaterialSystemValues.CameraPosition)

	// VectorSplitterBlock
	const VectorSplitter = new BB.VectorSplitterBlock("VectorSplitter")
	VectorSplitter.visibleInInspector = false
	VectorSplitter.visibleOnFrame = false
	VectorSplitter.target = 4

	// NegateBlock
	const Negate = new BB.NegateBlock("Negate")
	Negate.visibleInInspector = false
	Negate.visibleOnFrame = false
	Negate.target = 4

	// VectorMergerBlock
	const VectorMerger = new BB.VectorMergerBlock("VectorMerger")
	VectorMerger.visibleInInspector = false
	VectorMerger.visibleOnFrame = false
	VectorMerger.target = 4
	VectorMerger.xSwizzle = "x"
	VectorMerger.ySwizzle = "y"
	VectorMerger.zSwizzle = "z"
	VectorMerger.wSwizzle = "w"

	// InputBlock
	const Float = new BB.InputBlock("Float")
	Float.visibleInInspector = false
	Float.visibleOnFrame = false
	Float.target = 1
	Float.value = 0
	Float.min = 0
	Float.max = 0
	Float.isBoolean = false
	Float.matrixMode = 0
	Float.animationType = BB.AnimatedInputBlockTypes.None
	Float.isConstant = true

	// DotBlock
	const Dot = new BB.DotBlock("Dot")
	Dot.visibleInInspector = false
	Dot.visibleOnFrame = false
	Dot.target = 4

	// MultiplyBlock
	const Multiply = new BB.MultiplyBlock("Multiply")
	Multiply.visibleInInspector = false
	Multiply.visibleOnFrame = false
	Multiply.target = 4

	// FresnelBlock
	const Fresnel1 = new BB.FresnelBlock("Fresnel")
	Fresnel1.visibleInInspector = false
	Fresnel1.visibleOnFrame = false
	Fresnel1.target = 4

	// InputBlock
	const centerBias = new BB.InputBlock("centerBias")
	centerBias.visibleInInspector = true
	centerBias.visibleOnFrame = false
	centerBias.target = 1
	centerBias.value = 0.4
	centerBias.min = 0
	centerBias.max = 0
	centerBias.isBoolean = false
	centerBias.matrixMode = 0
	centerBias.animationType = BB.AnimatedInputBlockTypes.None
	centerBias.isConstant = false

	// InputBlock
	const centerPower = new BB.InputBlock("centerPower")
	centerPower.visibleInInspector = true
	centerPower.visibleOnFrame = false
	centerPower.target = 1
	centerPower.value = 5
	centerPower.min = 0
	centerPower.max = 0
	centerPower.isBoolean = false
	centerPower.matrixMode = 0
	centerPower.animationType = BB.AnimatedInputBlockTypes.None
	centerPower.isConstant = false

	// LerpBlock
	const Lerp = new BB.LerpBlock("Lerp")
	Lerp.visibleInInspector = false
	Lerp.visibleOnFrame = false
	Lerp.target = 4

	// LerpBlock
	const Lerp1 = new BB.LerpBlock("Lerp")
	Lerp1.visibleInInspector = false
	Lerp1.visibleOnFrame = false
	Lerp1.target = 4

	// LerpBlock
	const Lerp2 = new BB.LerpBlock("Lerp")
	Lerp2.visibleInInspector = false
	Lerp2.visibleOnFrame = false
	Lerp2.target = 4


	// InputBlock
	const fresnelTop = new BB.InputBlock("fresnelTop")
	fresnelTop.visibleInInspector = true
	fresnelTop.visibleOnFrame = false
	fresnelTop.target = 1
	fresnelTop.value = new BB.Color3(0.9803921568627451, 0.611764705882353, 0.03137254901960784)
	fresnelTop.isConstant = false

	// InputBlock
	const fresnelBottom = new BB.InputBlock("fresnelBottom")
	fresnelBottom.visibleInInspector = true
	fresnelBottom.visibleOnFrame = false
	fresnelBottom.target = 1
	fresnelBottom.value = new BB.Color3(0.8470588235294118, 0.2, 0.8470588235294118)
	fresnelBottom.isConstant = false

	// DotBlock
	const Dot1 = new BB.DotBlock("Dot")
	Dot1.visibleInInspector = false
	Dot1.visibleOnFrame = false
	Dot1.target = 4

	// InputBlock
	const down = new BB.InputBlock("down")
	down.visibleInInspector = true
	down.visibleOnFrame = false
	down.target = 1
	down.value = new BB.Vector3(0, -1, 0)
	down.isConstant = false

	// InputBlock
	const baseColor = new BB.InputBlock("baseColor")
	baseColor.visibleInInspector = true
	baseColor.visibleOnFrame = false
	baseColor.target = 1
	baseColor.value = new BB.Color3(0.7725490196078432, 0.23529411764705882, 0.10196078431372549)
	baseColor.isConstant = false

	// InputBlock
	const scaleColor = new BB.InputBlock("scaleColor")
	scaleColor.visibleInInspector = true
	scaleColor.visibleOnFrame = false
	scaleColor.target = 1
	scaleColor.value = new BB.Color3(0.9921568627450981, 0.9215686274509803, 0.4196078431372549)
	scaleColor.isConstant = false

	// FragmentOutputBlock
	const FragmentOutput = new BB.FragmentOutputBlock("FragmentOutput")
	FragmentOutput.visibleInInspector = false
	FragmentOutput.visibleOnFrame = false
	FragmentOutput.target = 2
	FragmentOutput.convertToGammaSpace = false
	FragmentOutput.convertToLinearSpace = false
	FragmentOutput.useLogarithmicDepth = false

	// InputBlock
	const edgeBias = new BB.InputBlock("edgeBias")
	edgeBias.visibleInInspector = true
	edgeBias.visibleOnFrame = false
	edgeBias.target = 1
	edgeBias.value = 0.5
	edgeBias.min = 0
	edgeBias.max = 0
	edgeBias.isBoolean = false
	edgeBias.matrixMode = 0
	edgeBias.animationType = BB.AnimatedInputBlockTypes.None
	edgeBias.isConstant = false

	// InputBlock
	const edgePower = new BB.InputBlock("edgePower")
	edgePower.visibleInInspector = true
	edgePower.visibleOnFrame = false
	edgePower.target = 1
	edgePower.value = 3
	edgePower.min = 0
	edgePower.max = 0
	edgePower.isBoolean = false
	edgePower.matrixMode = 0
	edgePower.animationType = BB.AnimatedInputBlockTypes.None
	edgePower.isConstant = false

	// TransformBlock
	const WorldPosViewProjectionTransform = new BB.TransformBlock("WorldPos * ViewProjectionTransform")
	WorldPosViewProjectionTransform.visibleInInspector = false
	WorldPosViewProjectionTransform.visibleOnFrame = false
	WorldPosViewProjectionTransform.target = 1
	WorldPosViewProjectionTransform.complementZ = 0
	WorldPosViewProjectionTransform.complementW = 1

	// InputBlock
	const ViewProjection = new BB.InputBlock("ViewProjection")
	ViewProjection.visibleInInspector = false
	ViewProjection.visibleOnFrame = false
	ViewProjection.target = 1
	ViewProjection.setAsSystemValue(BB.NodeMaterialSystemValues.ViewProjection)

	// VertexOutputBlock
	const VertexOutput = new BB.VertexOutputBlock("VertexOutput")
	VertexOutput.visibleInInspector = false
	VertexOutput.visibleOnFrame = false
	VertexOutput.target = 1

	// Connections
	position.output.connectTo(WorldPos.vector)
	World.output.connectTo(WorldPos.transform)
	WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector)
	ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform)
	WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector)
	fresnelTop.output.connectTo(Lerp2.left)
	fresnelBottom.output.connectTo(Lerp2.right)
	down.output.connectTo(Dot1.left)
	normal.output.connectTo(Worldnormal.vector)
	World.output.connectTo(Worldnormal.transform)
	Worldnormal.xyz.connectTo(Dot1.right)
	Dot1.output.connectTo(Lerp2.gradient)
	Lerp2.output.connectTo(Lerp1.left)
	baseColor.output.connectTo(Lerp1.right)
	Worldnormal.output.connectTo(Fresnel.worldNormal)
	WorldPos.output.connectTo(Viewdirection.worldPosition)
	cameraPosition.output.connectTo(Viewdirection.cameraPosition)
	Viewdirection.output.connectTo(Fresnel.viewDirection)
	edgeBias.output.connectTo(Fresnel.bias)
	edgePower.output.connectTo(Fresnel.power)
	Fresnel.fresnel.connectTo(Lerp1.gradient)
	Lerp1.output.connectTo(Lerp.left)
	scaleColor.output.connectTo(Lerp.right)
	Viewdirection.output.connectTo(VectorSplitter.xyzIn)
	VectorSplitter.z.connectTo(VectorMerger.x)
	Float.output.connectTo(VectorMerger.y)
	VectorSplitter.x.connectTo(Negate.value)
	Negate.output.connectTo(VectorMerger.z)
	VectorMerger.xyz.connectTo(Dot.left)
	Worldnormal.xyz.connectTo(Dot.right)
	Dot.output.connectTo(Multiply.left)
	Worldnormal.output.connectTo(Fresnel1.worldNormal)
	Viewdirection.output.connectTo(Fresnel1.viewDirection)
	centerBias.output.connectTo(Fresnel1.bias)
	centerPower.output.connectTo(Fresnel1.power)
	Fresnel1.fresnel.connectTo(Multiply.right)
	Multiply.output.connectTo(Lerp.gradient)
	Lerp.output.connectTo(FragmentOutput.rgb)

	// Output nodes
	nodeMaterial.addOutputNode(VertexOutput)
	nodeMaterial.addOutputNode(FragmentOutput)
	nodeMaterial.build()

	const assign = { fresnelTop, fresnelBottom, baseColor, scaleColor, edgeBias, edgePower }
	for (const [key,value] of Object.entries(assign)) nodeMaterial[key] = value

	fresnelTop.value = new BB.Color3( Math.random(), Math.random(), Math.random())
	fresnelBottom.value = new BB.Color3( Math.random(), Math.random(), Math.random())
	baseColor.value = new BB.Color3( Math.random(), Math.random(), Math.random())
	scaleColor.value = new BB.Color3( Math.random(), Math.random(), Math.random())

	nodeMaterial.setColors = ( ft, fb, base, scale ) => {

		fresnelTop.value = new BB.Color3( ...ft )
		fresnelBottom.value = new BB.Color3( ...fb )
		baseColor.value = new BB.Color3( ...base )
		scaleColor.value = new BB.Color3( ...scale )
	}

	nodeMaterial.setBiasPower = ( bias = 0.4, power = 5) => {
		edgeBias.value = bias
		edgePower.value = power
	}

	return nodeMaterial

}
