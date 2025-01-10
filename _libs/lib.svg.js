/* ====================================== */
/*                                        */
/*                   SVG                  */
/*                                        */
/* ====================================== */

export function DownloadSVGElement( svgElement ) {

	const box = svgElement.getBoundingClientRect()
	const rules = Object.keys( DEFAULTS.STYLES )

	// svgElement.width = box.width
	// svgElement.height = box.height

	const elements = [
		...new Set(svgElement.querySelectorAll('.edge')),
		...new Set(svgElement.querySelectorAll('.point')),
		...new Set(svgElement.querySelectorAll('.face'))
	]

	elements.forEach( element => {
		const style = getComputedStyle( element )
		for( const rule of rules ) element.style[rule] = style[rule]
	})

	// return

	const serialiser = new XMLSerializer()
	let source = serialiser.serializeToString( svgElement )

	if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
		source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"') }
	if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
		source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"') }

	source = '<?xml version="1.0" standalone="no"?>\r\n' + source

	// const url = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(source)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL( blob )

    const linkElement = document.createElement('a')
	linkElement.href = url
	linkElement.download = `STEMS ${(new Date()).toLocaleString()}.svg`
	linkElement.click()

	elements.forEach( element => {
		for( const rule of rules ) element.style = ''
	})

}