import { Vec2, Vec3, Vec4 } from '$3d1_points'

export class VecPlus2 extends Vec2 {
	x = $state(0)
	y = $state(0)
}
export class VecPlus3 extends Vec3 {
	x = $state(0)
	y = $state(0)
	z = $state(0)
}
export class VecPlus4 extends Vec4 {
	x = $state(0)
	y = $state(0)
	z = $state(0)
	w = $state(0)
}

export default VecPlus3