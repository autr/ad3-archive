/* ====================================== */
/*                                        */
/*                TRAVERSE                */
/*                                        */
/* ====================================== */

import { SetPropertyFromString } from '$_lib'

export function GetCreatorChain( item, list = [] ) {
	if (item?.creator?.uid) {
		list.push( item.creator.uid )
		GetCreatorChain( item.creator, list )
	}
	return list
}

export function BuildTreeFromLookup( lookup ) {
	const tree = {}
	for (const [ uid, item ] of lookup.entries() ) {
		const chain = GetCreatorChain( item, [ uid ] )
		let currentNode = tree
		for (const id of chain.reverse()) {
			currentNode[id] = currentNode[id] || {}
			currentNode = currentNode[id]
		}
	}
	return tree
}