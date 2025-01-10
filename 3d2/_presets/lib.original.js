import { processoptions } from './lib.dom.js'
import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)



export default [
	{
		link: "/poly.html?args=3:5:2&sym=3:4:2&colorstyle=1&rotate&run",
		title: "[3 5 2]"
	},
	{
		link: "/poly.html?args=2:3:4&tri=-1:1:0&tri=1:1:0&tri=1:-1:0&tri=-1:-1:0&colorstyle=1&rotate&run",
		title: "[3 4 2]"
	},
	{
		link: "/poly.html?args=5:3:2&colorstyle=1&rotate&tour=2&run",
		title: "[5 3 2]"
	},
	{
		link: "/poly.html?args=5/4:5/4:5/4&sym=2:3:5&tour=1&colorstyle=1&rotate&run",
		title: "[5/4 5/4 5/4]"
	},
	{
		link: "/poly.html?args=2:5/3:3/2&sym=3:2:4&colorstyle=1&rotate&run",
		title: "[2 5/3 3/2]"
	},
	{
		link: "/poly.html?args=3:5/3:2&sym=3:2:4&colorstyle=1&t=7&rotate&run",
		title: "[3 5/3 2]"
	},
	{
		link: "/poly.html?args=3:5/3:5/2&sym=3:2:4&colorstyle=7&snub&t=7&rotate&texture=images/202.jpg",
		title: "[3 5/3 5/2]"
	},
	{
		link: "/poly.html?args=5/2:3/2:3/2&sym=2:3:3&t=7&snub&colorstyle=1&rotate",
		title: "U72"
	},
	{
		link: "/poly.html?args=2:3:4&colorstyle=1&hide=4&tri=1:0:0&tri=0:1:1&snub&rotate&run",
		title: "Jitterbug transformation"
	},
	{
		link: "/poly.html?args=2:3/2:5/4&sym=2:2:1&hide=3&hide=4&compound&snub&tri=1:0:0&tri=1:0.5:0.5&tri=1:1:1&tri=0.618:1:1&tri=0.5:1:1&tri=0.618:1:1&tri=1:1:1&tri=1:0.5:0.5&run&rotate",
		title: "Verheyen's Vampire"
	},
	{
		link: "/poly.html?args=3:5/3:2&colorstyle=3&z=8&t=7&dual&rotate&run",
		title: "[3 5/3 2]: dual figures"
	},
	{
		link: "/poly.html?args=3:5:2&colorstyle=3&regionstyle=1&dual&snub&rotate&run",
		title: "[3 5 2]: snub dual regions"
	},
	{
		link: "/poly.html?args=3:5:2&colorstyle=7&dual&invert&texture=images/220.jpg&run&rotate",
		title: "[3 5 2]: inverted duals"
	},
	{
		link: "/poly.html?args=2:5/3:5/4&colorstyle=7&hide=3&t=7&texture=images/239.jpg&normal=images/239_norm.jpg&rotate",
		title: "U73"
	},
	{
		link: "/poly.html?args=5/3:3:5/2&sym=2:2:1&colorstyle=1&hemi&hide=3&hide=4&tri=1:1:1&snub&compound&rotate",
		title: "U75: \"Miller's Monster\""
	},
	{
		link: "/poly.html?args=5/3:5/2:3&sym=2:2:1&colorstyle=1&hemi&hide=2&hide=3&t=7&snub&compound&rotate",
		title: "\"Skilling's Figure\""
	},
	{
		link: "/poly.html?args=2:2:37/19&sym=3:4:2&colorstyle=2&tri=1:1:1&snub&compound&rotate",
		title: "[2 2 37/19]: A nice compound"
	},
	{
		link: "/poly.html?args=2:3:5/3&sym=2:3:5&colorstyle=1&stellate&rotate&z=20&t=3",
		title: "Stellation - final only."
	},
	{
		link: "/poly.html?args=2:3:5&explode=80&z=150&colorstyle=1&stellate&rotate&t=3",
		title: "Exploded stellation"
	},
	{
		link: "/poly.html?args=2:3:5&sym=2:5:3&colorstyle=1&rotate&compound&zrotate&run&t=7",
		title: "Compound animation"
	},
	{
		link: "/poly.html?args=5/2:3/2:3/2&sym=2:3:3&snub&colorstyle=4&t=7&z=0.01&tridepth=4&rotate&run&invert",
		title: "!!!"
	},
	{
		link: "/clebsch.html?run",
		title: "The Clebsch Surface"
	},
	{
		link: "/clebsch.html?q=1&radius=1.618&projection=1&colors=3&run",
		title: "A classic view"
	},
	{
		link: "/clebsch.html?cayley&q=2&colors=1&projection=3&run",
		title: "The Cayley Surface"
	},
	{
		link: "/clebsch.html?morph&q=1&colors=2&projection=2&run",
		title: "Morphing cubic."
	},
	{
		link: "/clebsch.html?barth&q=1&colors=0&projection=0&run",
		title: "The Barth Sextic."
	},
	{
		link: "/poly.html?off=off/leo2.off&texture=images/239.jpg&normal=images/239_norm.jpg&z=20&colorstyle=1&rotate",
		title: "Leonardo-style Waterman polyhedron"
	},
	{
		link: "/poly.html?off=off/spiral.off&sym=2:3:5&colorstyle=2&compound&chiral&z=25&rotate",
		title: "Compound of 30 6-armed spirallohedra"
	},
	{
		link: "/poly.html?off=off/weave2.off&nofaces&noedges&novertices&spline&rotate",
		title: "A woven polyhedron"
	},
	{
		link: "/poly.html?off=off/torus.off&sym=2:2:1&compound&noedges&novertices&normal=images/218_norm.jpg&texture=images/218.jpg&z=10&rotate&zrotate",
		title: "Two toruses"
	},
	{
		link: "/poly.html?off=off/basket.off&vertexwidth=0.05&rotate",
		title: "String art"
	},
	{
		link: "/poly.html?off=off/N8-T1s.off&allvertices&alledges&texture=images/202.jpg&vertexwidth=0.03&edgewidth=0.015&rotate&vertexstyle=cylinder",
		title: "Octa-Sphericon Dual"
	},
	{
		link: "/poly.html?off=off/Icosagyrexcavated_Icosahedron.off&z=2&rotate&nofaces&vertexwidth=0.02&edgewidth=0.01",
		title: "Icosagyrexcavated Icosahedron"
	},
	{
		link: "/poly.html?off=off/tet.off&nofaces&function=hoberman&rotate&run",
		title: "Tetrahedron Hoberman linkage"
	},
	{
		link: "/poly.html?off=off/ico.off&nofaces&function=hoberman&rotate&run",
		title: "Icosahedron linkage"
	},
	{
		link: "/poly.html?off=off/tr_icosid.off&function=hoberman&nofaces&off.lambda=1&rotate&z=7&run",
		title: "Truncated icosidodecahedron linkage"
	},
	{
		link: "/poly.html?off=off/cubo.off&function=dipolygonid&allvertices&alledges&z=4&rotate&run",
		title: "Classic cuboctahedral jitterbug"
	},
	{
		link: "/poly.html?off=off/tet.off&function=dipolygonid&allvertices&alledges&rotate&run",
		title: "Dipolygonid tetrahedron"
	},
	{
		link: "/poly.html?off=off/ico.off&function=dipolygonid&allvertices&alledges&rotate&run",
		title: "Dipolygonid icosahedron"
	},
	{
		link: "/poly.html?off=off/rh_icosid.off&function=dipolygonid&z=5&allvertices&alledges&rotate&run",
		title: "Tripolygonid rhombicosidodecahedron"
	},
	{
		link: "/poly.html?off=off/u34.off&function=dipolygonid&alledges&allvertices&rotate&run",
		title: "U34"
	},
	{
		link: "/poly.html?off=off/u36.off&function=dipolygonid&alledges&allvertices&rotate&run",
		title: "U36"
	},
	{
		link: "/poly.html?off=off/u38.off&function=dipolygonid&alledges&allvertices&rotate&run",
		title: "U38"
	},
	{
		link: "/poly.html?off=off/u47.off&function=dipolygonid&alledges&allvertices&rotate&run",
		title: "U47"
	},
	{
		link: "/poly.html?off=off/u54.off&function=dipolygonid&alledges&allvertices&rotate&run",
		title: "U54"
	},
	{
		link: "/poly.html?function=hyper&off,angles=4:3:2:3:2:2&off.quad=1:1:1:1&allvertices&edgewidth=0.05&vertexwidth=0.1&off.w=2.4&z=18&rotate&run",
		title: "Into the 4th dimension"
	},
	{
		link: "/poly.html?function=hyper&off,angles=5:3:2:3:2:2&off.quad=1:0:0:0&allvertices&edgewidth=0.05&vertexwidth=0.1&off.w=8&z=25&rotate",
		title: "The 120-cell"
	},
	{
		link: "/poly.html?function=hyper&off,angles=7:2:2:11:2:2&off.quad=1:1:1:1&allvertices&edgewidth=0.05&vertexwidth=0.1&off.w=10&z=30&rotate&run",
		title: "A duoprism"
	},
	{
		link: "/poly.html?function=zoomer&z=0.2&run",
		title: "Infinite Descent"
	},
	{
		link: "/poly.html?function=zonohedron&off=off/icosid.off&off.k=1&z=1000&rotate",
		title: "zonohedron"
	},
	{
		link: "/poly.html?function=zonohedron&off.n=3&off.k=3&z=300&rotate",
		title: "A star zonohedron"
	},
	{
		link: "/poly.html?function=zonohedron&off.n=50&z=80&sym=2:3:3&compound&rotate",
		title: "Tetrahedral compound of 50-star polar zonohedron"
	},
	{
		link: "/poly.html?function=polygon&off.n=6&off.m=1&run",
		title: "Semiregular polygons"
	},
	{
		link: "/poly.html?function=polygon&off.n=17&off.m=7&run",
		title: "17/7 polygon"
	},
	{
		link: "/poly.html?function=loadbf&z=6&rotate&run",
		title: "Another Jitterbug rendition"
	},
	{
		link: "/poly.html?function=theorem&vertexstyle=icosahedron&z=2&run",
		title: "A nice theorem"
	},
	{
		link: "/poly.html?function=desargues&off.projective=true&vertexstyle=icosahedron&z=4&run",
		title: "Desargues Theorem"
	},
	{
		link: "/poly.html?function=desargues2&z=5&run",
		title: "Desargues Theorem again"
	},
	{
		link: "/poly.html?function=desmic&z=12&rotate&run",
		title: "Desmic tetrahedra"
	},
	{
		link: "/poly.html?function=slerp&z=6&run",
		title: "SLERP"
	},
	{
		link: "/poly.html?function=quat&z=6&run",
		title: "Rotations"
	},
	{
		link: "/poly.html?function=origami&texture=images/221.jpg&novertices&rotate&run",
		title: "Origami"
	},
	{
		link: "/poly.html?args=2:3:3&sym=2:3:3&zrotate&compound&rotate&t=2",
		title: "UC01 - 6 tetrahedra with rotational freedom"
	},
	{
		link: "/poly.html?args=2:3:3&sym=4:2:3&zrotate&compound&rotate&t=2",
		title: "UC02-04 - 12 tetrahedra with rotational freedom"
	},
	{
		link: "/poly.html?args=2:3:3&sym=2:3:5&compound&chiral&rotate&theta=4&t=2",
		title: "UC05 - 5 tetrahedra"
	},
	{
		link: "/poly.html?args=2:3:3&sym=2:3:5&compound&colorstyle=3&rotate&theta=4&tri=0:1:0",
		title: "UC06 - 10 tetrahedra"
	},
	{
		link: "/poly.html?args=4:2:2&sym=4:2:3&compound&colorstyle=5&rotate&zrotate&t=1",
		title: "UC07 - 6 cubes"
	},
	{
		link: "/poly.html?args=3:2:3&sym=3:2:3&compound&t=2&chiral&colorstyle=4&zrotate",
		title: "UC10-12 - 4 (if chiral) or 8 (if not) Octahedra"
	},
	{
		link: "/poly.html?args=3:4:2&sym=3:5:2&compound&tri=0:1:0&colorstyle=5&zrotate&rotate",
		title: "UC13-16 - 10 or 20 octahedra"
	},
	{
		link: "/poly.html?args=3:4:2&sym=3:5:2&compound&tri=0:1:0&colorstyle=0&theta=0.25&rotate",
		title: "UC14 - 20 octahedra"
	},
	{
		link: "/poly.html?args=3:3/2:2&sym=3:5:2&tri=1:1:0&compound&colorstyle=3&rotate&chiral&theta=0.25",
		title: "UC19 - 20 hemihexahedra"
	},
	{
		link: "/poly.html?args=5:2:2&sym=5:3:2&compound&colorstyle=0&rotate&zrotate&t=7&snub",
		title: "UC26"
	},
	{
		link: "/poly.html?args=5/3:2:2&sym=5:3:2&compound&colorstyle=3&rotate&zrotate&t=7&snub",
		title: "UC28"
	},
	{
		link: "/poly.html?args=5/2:2:2&chiral&sym=5:3:2&compound&colorstyle=0&rotate&theta=10&t=8",
		title: "UC36"
	},
	{
		link: "/poly.html?args=5/2:2:2&sym=5:3:2&compound&colorstyle=1&rotate&theta=10&t=8",
		title: "UC37"
	},
	{
		link: "/poly.html?args=6:2:2&sym=3:2:4&theta=6&compound&tri=1:1:0&tridepth=4&colorstyle=5&rotate",
		title: "UC38"
	},
	{
		link: "/poly.html?args=10/3:2:2&sym=5:2:3&compound&t=1&rotate",
		title: "UC41"
	},
	{
		link: "/poly.html?args=2:5:5/2&sym=2:5:3&invert&dual&t=4&colorstyle=3&compound&rotate",
		title: "UC49 - 5 great dodecahedra, as an inverted dual"
	},
	{
		link: "/poly.html?args=2:3/2:3/2&sym=2:3:3&colorstyle=1&tri=1:1:1&snub&compound&rotate",
		title: "UC52"
	},
	{
		link: "/poly.html?args=2:3:5/2&sym=2:3:5&colorstyle=5&tri=0:0:1&compound&rotate",
		title: "UC53"
	},
	{
		link: "/poly.html?args=4/3:2:3&sym=2:3:5&t=3&compound&colorstyle=4&rotate",
		title: "UC58"
	},
	{
		link: "/poly.html?args=4/3:3/2:2&sym=2:3:5&theta=4&hide=2&tri=1:1:1&colorstyle=0&compound&rotate",
		title: "UC66"
	},
	{
		link: "/poly.html?args=4:2:3/2&sym=2:3:5&colorstyle=4&tri=1:0:1&compound&rotate",
		title: "UC67"
	},
	{
		link: "/poly.html?args=2:3:5&sym=2:3:5&compound&snub&tri=1:1:1&colorstyle=1&rotate",
		title: "UC69"
	},
	{
		link: "/poly.html?args=2:5/2:3&sym=2:3:5&compound&snub&tri=1:1:1&colorstyle=1&rotate",
		title: "UC70"
	},
	{
		link: "/poly.html?args=2:5/3:3&sym=2:3:5&compound&snub&tri=1:1:1&colorstyle=1&rotate",
		title: "UC71"
	},
	{
		link: "/poly.html?args=2:5/3:3/2&sym=2:3:5&compound&snub&tri=1:1:1&colorstyle=1&rotate",
		title: "UC72"
	},
	{
		link: "/poly.html?args=2:5:5/2&sym=2:3:5&compound&snub&tri=1:1:1&colorstyle=1&rotate",
		title: "UC73"
	},
	{
		link: "/poly.html?args=2:5:5/3&sym=2:3:5&compound&snub&tri=1:1:1&colorstyle=1&rotate",
		title: "UC74"
	},
	{
		link: "/poly.html?args=3:5:5/3&sym=3:2:5&compound&snub&tri=1:1:1&colorstyle=1&rotate",
		title: "UC75"
	}
].map( ({link,title}) => {
	const preset = { ...processoptions(link), id: title }
	// SAY(`💠 PRESET, ${preset.type}, ${preset.title}`)
	return preset
})