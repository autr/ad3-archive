export function BarycentricToEquilateral(width, height, x, y, z) {
	// Ensure the barycentric coordinates sum to 1
	if (x + y + z !== 1) {
		throw new Error("Barycentric coordinates must sum to 1.")
	}

	// Convert barycentric coordinates to Cartesian coordinates
	const pointX = x * 0 + y * width + z * 0 // x * Ax + y * Bx + z * Cx
	const pointY = x * 0 + y * 0 + z * height // x * Ay + y * By + z * Cy

	// Calculate the intersection with the hypotenuse
	// The equation of the hypotenuse is y = -height/width * x + height
	// We find the point on the hypotenuse that is closest to (pointX, pointY)
	const hypotenuseX = (width * pointY + height * pointX) / (height + width)
	const hypotenuseY = -height / width * hypotenuseX + height

	// Return Cartesian coordinates and edges
	return {
		coordinates: [pointX, pointY],
		edges: [
			[[pointX, pointY], [pointX, 0]], // Edge from point to X-axis
			[[pointX, pointY], [0, pointY]], // Edge from point to Y-axis
			[[pointX, pointY], [hypotenuseX, hypotenuseY]] // Edge from point to hypotenuse
		]
	}
}
