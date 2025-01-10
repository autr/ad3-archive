

export function GetAllBackends() {


	return new Promise( ( resolve, reject) => {

		const modules = new Map()
		const list = import.meta.glob([ 
			'../_meshes/_*.js', 
			'../_cameras/_*.js', 
			'../_scene/_*.js', 
			'../_points/_*.js' 
		])
		
		for (const path in list) {
			list[path]().then( mod => {
				const id = path.split('/').slice(-1)[0].split('.')[0].substring(1)
				modules.set( id, mod.default )
				if (modules.size >= Object.keys(list).length) {
					resolve( modules )
				}
			})
		}
	})
}