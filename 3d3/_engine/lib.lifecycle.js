/* ====================================== */
/*                                        */
/*         	     LIFECYCLE                */
/*                                        */
/* ====================================== */

export function UniqueId( id, references = new Map ) {
	let uid = id
	let idx = 1
	while ( references.has(uid) ) {
		idx += 1
		uid = id + idx
	}
	return uid
}
