<script>

	import {OBJExport, STLExport} from 'babylonjs-serializers'

	// #define COMPONENT

	export let gui = false
	export let filename = 'polyhedra'
	export let meshes = null
	export let fetchMeshes = null
	
	export let filter = mesh => {
		const isExporting = mesh?.data?.export
		return isExporting
	}

	const context = getContext('sketch')

	export function getExportingMeshes() {

		if (fetchMeshes) return fetchMeshes()
		const meshesRef = meshes ? meshes : context.getScene().meshes.filter( mesh => mesh?.data?.export || mesh?.data?.exporting )
		return meshesRef.map( mesh => mesh.clone() )
	}

	export function downloadFile( data, exportFilename = 'UNNAMED.txt' ) {

		const blob = new Blob([data], { type: 'text/plain' })
		const link = document.createElement('a')
		link.href = window.URL.createObjectURL(blob)
		link.download = exportFilename
		link.click()

		getExportingMeshes().forEach( mesh => mesh.dispose() )
	}


	export function downloadOBJ() {

		const meshesRef = getExportingMeshes()
		const data = OBJExport.OBJ(meshesRef, false, '', true)

		downloadFile( data, filename + (new Date()).toUTCString() + '.obj'  )

		for (const mesh of meshesRef) mesh.dispose()

	}

	export function downloadSTL() {

		const meshesRef = getExportingMeshes()
		const data =  STLExport.CreateSTL( 
			meshesRef, // meshesRef
			false , // triggers the automatic download of the file.
			'', // filename
			true, // changes the STL to a binary type
			true, // little endian, toggle for binary type exporter
			false, // do not bake transforms, toggle if meshesRef transforms should be baked or not
			true, // toggle to export instanced Meshes. Enabling support for instanced meshesRef will override doNoBakeTransform as true
			true // toggle to export each mesh as an independent mesh. By default, all the meshesRef are combined into one mesh. This property has no effect when exporting in binary format
		)
		downloadFile( data, filename + (new Date()).toUTCString() + '.stl' )
		for (const mesh of meshesRef) mesh.dispose()

	}
</script>



{#if gui}
	<h3>Export</h3>
	<div>
		<button on:click={downloadOBJ}>
			Download OBJ
		</button>
		<button on:click={downloadSTL}>
			Download STL
		</button>
	</div>
{/if}