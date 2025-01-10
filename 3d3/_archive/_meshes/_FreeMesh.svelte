<script>
	/* ====================================== */
	/*                                        */
	/*             UNINDEXED MESH             */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define BABYLON
	// #define MESH
	// #define AUI

	import { CreateSolidColorMaterial } from '$3d1_materials'
	import { VectorGUI } from '$3d1_debug'

	export let vertices = []
	export let uvs = null
	export let indices = null
	export let normals = null

	export let deform = false

	onMount( init )
	onDestroy( destroy )
	export let name = 'mesh'

	function initMesh() {

		mesh = new BB.Mesh( name, scene )
		// mesh._unIndexed = true
		updateVertices()
	}

	let centerPoint = new BB.Vector3(0,0,0)
	let rotationAmplitude = new BB.Vector3(0,0,0)
	let locationAmplification = new BB.Vector3(0,0,0)
	let maximumAmp = 1

	function randomise() {
		centerPoint.randomise(0, maximumAmp)
		rotationAmplitude.randomise(0, maximumAmp)
		locationAmplification.randomise(0, maximumAmp)
		updateVertices()
	}

	function twistVertices() {
		if (!mesh) return
		const vertices = mesh.geometry.getVerticesData(BABYLON.VertexBuffer.PositionKind);
		for (let i = 0; i < vertices.length; i += 3) {
			let x = vertices[i];
			let y = vertices[i + 1];
			let z = vertices[i + 2];
			
			const relativeX = x - centerPoint.x;
			const relativeY = y - centerPoint.y;
			const relativeZ = z - centerPoint.z;
			
			const amplificationX = locationAmplification.x * (relativeY + 1);
			const amplificationY = locationAmplification.y * (relativeZ + 1);
			const amplificationZ = locationAmplification.z * (relativeX + 1);
			
			const rotationX = Math.sin(relativeY * rotationAmplitude.x) * amplificationX;
			const rotationY = Math.sin(relativeZ * rotationAmplitude.y) * amplificationY;
			const rotationZ = Math.sin(relativeX * rotationAmplitude.z) * amplificationZ;
			
			x += rotationX;
			y += rotationY;
			z += rotationZ;
			
			vertices[i] = x;
			vertices[i + 1] = y;
			vertices[i + 2] = z;
		}
		
		mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertices, true);
	}

	function warpVertices() {
		const vertices = mesh.geometry.getVerticesData(BABYLON.VertexBuffer.PositionKind)
		for (let i = 0; i < vertices.length; i+=3) {
			let x = vertices[i]
			let y = vertices[i+1]
			let z = vertices[i+2]

			y += Math.sin( x * 12 ) * 0
			z += Math.sin( x * 7 ) * 0.4
			x += Math.sin( y * 7 ) * 0.4
			// console.log(x,y,z)

			vertices[i] = x
			vertices[i+1] = y
			vertices[i+2] = z
		}
		mesh.updateVerticesData(BB.VertexBuffer.PositionKind, vertices, true)
	}

	function generateIndices() {
		let arr = []
		for (let i = 0; i < vertices.length / 3; i++) arr.push(i)
		return arr
	}

	function invertWindingOrder(indices) {
	    const newIndices = []
	    for (let i = 0; i < indices.length; i += 3) {
	        newIndices.push(indices[i])     // first index remains the same
	        newIndices.push(indices[i + 2]) // swap second and third indices
	        newIndices.push(indices[i + 1])
	    }
	    return newIndices
	}

	function updateVertices() {
		if (!mesh) return;
		const vertexCount = mesh.geometry ? mesh.geometry.getVerticesData(BABYLON.VertexBuffer.PositionKind).length : null;
		if (vertexCount !== vertices.length) {

			const scene = context.getScene()
			const vertexData = new BABYLON.VertexData()
			vertexData.positions = vertices || []
			vertexData.indices = invertWindingOrder( indices || generateIndices() )
			vertexData.normals = normals || []
			if (vertexData.normals.length <= 0) BB.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);
			vertexData.uvs = uvs || generateSphericalTextureCoordinates(vertexData.positions, vertexData.indices)

			console.log(vertexData)
			vertexData.applyToMesh(mesh, true)
			mesh.computeWorldMatrix(true)
			if (debug) SAY('🩻 resetting vertices')
		}
		if (subdivide) mesh.increaseVertices(subdivide)
		// warpVertices()
		if (deform) twistVertices();
	}


	function generateSphericalTextureCoordinates(vertices) {
		const textureCoordinates = [];
		
		for (let i = 0; i < vertices.length/3; i++) {
			const x = vertices[i * 3];
			const y = vertices[i * 3 + 1];
			const z = vertices[i * 3 + 2];
			
			const vertex = new BABYLON.Vector3(x, y, z);
			
			// Convert the cartesian coordinates (x, y, z) to spherical coordinates (r, theta, phi)
			// r is the radius, theta is the longitude, and phi is the latitude
			const r = Math.sqrt(x*x + y*y + z*z);
			// We don't really need 'r' for UVs, but it would be used to normalize the points onto a unit sphere if necessary.

			// Calculate theta and phi
			const theta = Math.atan2(z, x);
			const phi = Math.acos(y / r);

			// Map theta and phi to UV coordinates (u, v)
			// u varies between 0 and 1 when theta varies between -PI and +PI
			const u = 0.5 + theta / (2 * Math.PI);
			// v varies between 0 and 1 when phi varies between 0 and PI
			const v = 1 - phi / Math.PI;

			// Push the calculated UVs into the array
			textureCoordinates.push(u, v);
		}

		return textureCoordinates;
	}

	function basicTextureCoordinates(vertices, indices) {
		const textureCoordinates = [];
		for (let i = 0; i < indices.length; i += 3) {
			const index1 = indices[i];
			const index2 = indices[i + 1];
			const index3 = indices[i + 2];

			const p1 = new BABYLON.Vector3(vertices[index1 * 3], vertices[index1 * 3 + 1], vertices[index1 * 3 + 2]);
			const p2 = new BABYLON.Vector3(vertices[index2 * 3], vertices[index2 * 3 + 1], vertices[index2 * 3 + 2]);
			const p3 = new BABYLON.Vector3(vertices[index3 * 3], vertices[index3 * 3 + 1], vertices[index3 * 3 + 2]);

			const u = p2.subtract(p1);
			const v = p3.subtract(p1);
			const normal = BABYLON.Vector3.Cross(u, v).normalize();

			const textureScale = 1 / (2 * Math.PI);

			const uAngle = Math.atan2(u.z, u.x);
			const vAngle = Math.asin(normal.y);

			const uNormalized = uAngle / (2 * Math.PI);
			const vNormalized = (vAngle + Math.PI / 2) / Math.PI;

			const faceTextureCoordinates = [
				uNormalized, vNormalized,
				uNormalized + 1, vNormalized,
				uNormalized, vNormalized + 1
				// Add additional texture coordinates for other UV channels if needed
			];
			textureCoordinates.push(...faceTextureCoordinates);
		}

		return textureCoordinates;
	}
	$: updateVertices( vertices, centerPoint, rotationAmplitude, locationAmplification )
</script>

{#if deform}
	<div class="p1 cmb1 bg z-index99 flex column maxw18em">
		<button on:click={randomise}>Randomise</button>
		<AUI.Slider bind:value={maximumAmp} set:min={0} set:max={10} />
		<VectorGUI bind:value={centerPoint}/>
		<VectorGUI bind:value={rotationAmplitude}/>
		<VectorGUI bind:value={locationAmplification}/>
	</div>
{/if}