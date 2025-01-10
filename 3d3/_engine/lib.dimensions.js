
export function GetDimensions( element ) {

	let { left, top, width, height } = element.getBoundingClientRect()

	let offsets = {
		left: [ 'borderLeftWidth', 'paddingLeft' ],
		top: [ 'borderTopWidth', 'paddingTop' ],
		width: [ 'borderLeftWidth', 'paddingLeft', 'borderRightWidth', 'paddingRight' ],
		height: [ 'borderTopWidth', 'paddingTop', 'borderBottomWidth', 'paddingBottom' ]
	}

	const computed = getComputedStyle( element )

	for (let [name, keys] of Object.entries( offsets ) ) {
		offsets[name] = keys.map( name => {
			return parseFloat( computed[name] )
		}).reduce( (accumulator, value) => {
			return accumulator + value
		})
	}

	left += offsets.left
	top += offsets.top
	width -= offsets.width
	height -= offsets.height

	return { left, top, width, height }
}

export function CreateObserver( element, dimensionsCallback ) {


	const observer = new ResizeObserver(entries => {

		for (let entry of entries) {
			const { left, top, width, height } = GetDimensions( element )
			dimensionsCallback( left, top, width, height )

		}
	})

	observer.observe( element )

	return observer
}


