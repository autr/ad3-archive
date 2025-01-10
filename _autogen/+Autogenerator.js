import Template from './_Template.svelte?raw'

// #define JAVASCRIPT
// #define SVELTEKIT

import path from 'path'
import fs from 'fs-extra'

export async function POST({ request, url, fetch, params}) {

	
	if (!import.meta.env.DEV) return new Response( 'PROD' )
	if (!dev) return new Response( 'PROD' )
	if (building) return new Response( 'BUILD' )

	const data = await request.json()

	const outputs = []
	let indexContents = ''
	const outputIndexPath = `./src/ad3/_autogen/_output/index.js`


	for (const [id,{names,location}] of Object.entries(data)) {

		indexContents += `export const ${id} = {}\n`

		for (const name of names) {

			if (name === 'Multiple') {

				const multiples = [ 'Edges', 'Points', 'Lines', 'Faces' ]

				for (const multi of multiples) {
					const multiOutputPath = `./src/ad3/_autogen/_output/_${multi}Auto.svelte`
					const multiOutputContents = Template.replace('ReplaceObjectType', name).replace('ReplaceMultipleType', multi.toLowerCase())
					await fs.outputFileSync( path.resolve(multiOutputPath), multiOutputContents )
					indexContents += `import { default as ${multi} } from './_${multi}Auto.svelte'\n`
					indexContents += `${id}.${multi} = ${multi}\n`
				}
				

			} else {

				const outputPath = `./src/ad3/_autogen/_output/_${name}Auto.svelte`
				const outputContents = Template.replace('ReplaceObjectType', name)
				
				await fs.outputFileSync( path.resolve(outputPath), outputContents )

				outputs.push( outputPath )
				indexContents += `import { default as ${name} } from './_${name}Auto.svelte'\n`
				indexContents += `${id}.${name} = ${name}\n`
			}
		}
	}

	await fs.outputFileSync( path.resolve(outputIndexPath), indexContents )

	outputs.push( outputIndexPath )
	

	return new Response( outputs.join('\n') )
}
