
import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)

const DEBUG = false

let Geometry = {}

const Vector = {
	dot: function(u,v) {
		if (!v) v = u;
		let w = 0;
		for (let i = 0; i < u.length && i < v.length; i++) {
			w += u[i]*v[i];
		}
		return w;
	},
	cross: function(u,v) {
		let w = [];
		w[0] = u[1]*v[2]-u[2]*v[1];
		w[1] = u[2]*v[0]-u[0]*v[2];
		w[2] = u[0]*v[1]-u[1]*v[0];
		return w;
	},
	triple: function(u,v,w) {
		return this.dot(u,this.cross(v,w));
	},
	length: function(u) {
		return Math.sqrt(Vector.dot(u,u));
	},
	dist: function(u,v) {
		let s = 0;
		for (let i = 0; i < u.length; i++) {
			let t = u[i]-v[i];
			s += t*t;
		}
		return Math.sqrt(s);
	},
	taxi: function(u,v) {
		let s = 0;
		for (let i = 0; i < u.length || i < v.length; i++) {
			s += Math.abs((u[i] || 0) - (v[i] || 0));
		}
		return s;
	},
	add: function(u,v) {
		let w = [];
		for (let i = 0; i < u.length || i < v.length; i++) {
			w[i] = (u[i] || 0) + (v[i] || 0);
		}
		return w;
	},
	add3: function(u,v,w) { 
		return Vector.add(u,Vector.add(v,w));
	},
	add4: function(u,v,w,x) { 
		return Vector.add(Vector.add(u,v),Vector.add(w,x));
	},
	sub: function(u,v) {
		let w = [];
		for (let i = 0; i < u.length || i < v.length; i++) {
			w[i] = (u[i] || 0) - (v[i] || 0);
		}
		return w;
	},
	mul: function(u,x) {
		let w = [];
		for (let i = 0; i < u.length; i++) {
			w[i] = u[i]*x;
		}
		return w;
	},
	div: function(u,x) {
		return Vector.mul(u,1/x);
	},
	negate: function(u) {
		return Vector.mul(u,-1);
	},
	normalize: function(u) {
		return Vector.div(u,Vector.length(u));
	},
	mid: function(u,v) {
		let w = new Array(u.length);
		for (let i = 0; i < u.length; i++) {
			w[i] = (u[i]+v[i])/2;
		}
		return w;
	},
	interp: function(u,v,k) {
		let w = new Array(u.length);
		for (let i = 0; i < u.length; i++) {
			w[i] = k*u[i]+(1-k)*v[i];
		}
		return w;
	},
	copy: function(u) {
		let w = [];
		for (let i = 0; i < u.length; i++) {
			w[i] = u[i];
		}
		return w;
	},
	set: function(u,v) {
		console.assert(u.length == 0 || u.length == v.length,
					   "Incompatible array lengths");
		for (let i = 0; i < v.length; i++) {
			u[i] = v[i];
		}
	},
	approxeq: function(u,v,eps) {
		//console.assert(eps);
		//console.assert(u.length == v.length, "Incompatible array lengths");
		for (let i = 0; i < u.length; i++) {
			if (Math.abs(u[i] - v[i]) > eps) return false;
		}
		return true;
	},
	eq: function(u,v) {
		console.assert(u.length == v.length,
					   "Incompatible array lengths");
		for (let i = 0; i < u.length; i++) {
			if (u[i] != v[i]) return false;
		}
		return true;
	},
	// Rotate about z-axis (for compounds)
	zrot: function(p,theta) {
		return [Math.cos(theta)*p[0] + Math.sin(theta)*p[1],
				-Math.sin(theta)*p[0] + Math.cos(theta)*p[1],
				p[2]];
	},
	// Rotate about y-axis (for compounds)
	yrot: function(p,theta) {
		return [Math.cos(theta)*p[0] + Math.sin(theta)*p[2],
				p[1],
				-Math.sin(theta)*p[0] + Math.cos(theta)*p[2]]
	},
	intersection: function(p,q,r) {
		let P = Vector.cross(q,r);
		let Q = Vector.cross(r,p);
		let R = Vector.cross(p,q);
		let k = Vector.dot(p,P);
		if (Math.abs(k) < 1e-4) return null;
		let A = Vector.dot(p,p);
		let B = Vector.dot(q,q);
		let C = Vector.dot(r,r);
		// Maybe use a 4-vector here?
		let s = Vector.div(Vector.applybary([A,B,C],P,Q,R),k);
		return s;
	},
	reflect: function(p,q,r) {
		// Reflect r in the plane of p and q (and the origin)
		let n = Vector.normalize(Vector.cross(p,q));
		return Vector.sub(r, Vector.mul(n,2*Vector.dot(n,r)));
	},
	planereflect: function(n,p) {
		// Reflect r in the (hyper)plane (through origin) with normal n
		return Vector.sub(p, Vector.mul(n,2*Vector.dot(p,n)));
	},
	reflectionmatrix: function(p,q) {
		let v0 = reflect(p,q,[1,0,0]);
		let v1 = reflect(p,q,[0,1,0]);
		let v2 = reflect(p,q,[0,0,1]);
		return [v0,v1,v2];
	},
	// "barycentric" here just means interpreting
	// coordinates [a,b,c] as the weighted sum of aA+bB+cC
	// where A,B,C are the vertices of some triangle.
	// "trilinear" means defining a point by its distance
	// from 3 different planes, or equivalently, by the dot product
	// with 3 different vectors.
	// if p,q,r is a (spherical) triangle, then P = q x r, Q = r x p, R = p x q
	// are normals to its sides
	tri2bary: function(tri,p,q,r) {
		let P = Vector.cross(q,r);
		let Q = Vector.cross(r,p);
		let R = Vector.cross(p,q);
		let bary = [Vector.length(P)*tri[0],
					Vector.length(Q)*tri[1],
					Vector.length(R)*tri[2]];
		let s = Vector.applybary(bary,p,q,r);
		return Vector.div(bary,Vector.length(s));
	},
	getbary: function(p,q,r,s) {
		let P = Vector.cross(q,r);
		let Q = Vector.cross(r,p);
		let R = Vector.cross(p,q);
		let k = Vector.dot(p,P); // Triple product (p,q,r)
		let A = Vector.dot(s,P);
		let B = Vector.dot(s,Q);
		let C = Vector.dot(s,R);
		return [A/k,B/k,C/k];
	},
	applybary: function(bary,p,q,r) {
		return [bary[0]*p[0]+bary[1]*q[0]+bary[2]*r[0],
				bary[0]*p[1]+bary[1]*q[1]+bary[2]*r[1],
				bary[0]*p[2]+bary[1]*q[2]+bary[2]*r[2]];
	},
	// Invert relative to an origin-centred sphere.
	invert: function(p,r2) {
		// return kp where kpp = r2
		let k = Vector.dot(p,p)/r2;
		//return [p[0],p[1],p[2],k];
		return Vector.div(p,k);
	},
	vprint: function(a) {
		if (a.length != undefined) {
			let s = "[";
			for (let i = 0; i < a.length; i++) {
				s += " " + Vector.vprint(a[i]);
			}
			s += " ]";
			return s;
		} else {
			// Neither toPrecision nor toFixed do what I
			// want, so we shall do this:
			if (a != Math.round(a)) {
				a = Math.round(a*1000)/1000;
			}
			return a.toString();
		}
	}
}

// Manage sets of points, ordered on first coordinate with
// reasonably efficient equality (up to epsilon).

var PointSet = {}

// Simple set equality, mainly to check correctness of the more
// efficient setequal1.
// There are various pathological cases since approxeq isn't an
// equivalence relation, but I don't think they arise much in
// our application.

function setequal0(s,t,eps) {
	console.assert(s.length == t.length, "Incompatible set lengths");
	for (let i = 0; i < s.length; i++) {
		let found = false;
		for (let j = 0; j < t.length; j++) {
			if (Vector.approxeq(s[i],t[j],eps)) {
				found = true;
				break;
			}
		}
		if (!found) return false;
	}
	return true;
}

function setequal1(s,t,eps) {
	for (let i = 0, j = 0; i < s.length; i++) {
		while(j < s.length && t[j][0] + eps < s[i][0]) j++;
		if (j == t.length) return false;
		for (let k = j; ; k++) {
			if (k == t.length) return false;
			if (s[i][0] + eps < t[k][0]) return false;
			if (Vector.approxeq(s[i],t[k],eps)) break;
		}
	}
	return true;
}

PointSet.equal = function(s,t,eps) {
	let res = setequal1(s,t,eps)
	return res;
}

// Add an element to a set if it's not already there.
// Don't assume set is ordered at this point.

PointSet.add = function(a,s,eps) {
	for (let i = 0; i < s.length; i++) {
		if (Vector.approxeq(a,s[i],eps)) return false;
	}
	s.push(a);
	return true;
}

PointSet.sort = function(s) {
	s.sort(function(u,v) { return u[0] - v[0]; });
}

// Now for some serious 3D vector geometry...

function makeSymmetry(angles) {
	// Spherical triangle cosine rule
	function cosine (A,B,C)
	{
		let acos = Math.acos, cos = Math.cos, sin = Math.sin;
		let a = acos((cos(A) + cos(B)*cos(C))/(sin(B)*sin(C)));
		let b = acos((cos(B) + cos(C)*cos(A))/(sin(C)*sin(A)));
		let c = acos((cos(C) + cos(A)*cos(B))/(sin(A)*sin(B)));
		if (isNaN(a) || isNaN(b) || isNaN(c)) return null;
		else return [a,b,c];
	}

	// Set p,q,r to the vertices of a spherical triangle with
	// sides subtending angles a,b,c.
	function triangle1(a,b,c)
	{
		let p = [0,0,1];
		let q = [0, Math.sin(c), Math.cos(c)];
		let rz = Math.cos(b);
		let ry = (Math.cos(a)-q[2]*rz)/q[1];
		let t = 1-rz*rz-ry*ry;
		if (t < 0) t = 0; // Clamp to avoid rounding problems
		let r = [Math.sqrt(t),ry,rz];
		// This used to reverse q and r to get a +ve OpenGL triangle to start
		// with, but that mucks up the tri coordinates, and anyway the complicated
		// stuff needs drawing both sides.
		return [p,q,r];
	}

	let a = angles[0], b = angles[1], c = angles[2];
	let A = Math.PI/a, B = Math.PI/b, C = Math.PI/c;
	let t = cosine(A,B,C);
	if (!t) return null;
	return triangle1(t[0],t[1],t[2]);
}

// Find bary coords of point whose 3 reflections form an equilateral triangle.
// Fairly standard application of 2-dimensional Newton-Raphson.
function getsnub(p,q,r) {
	// Solve f(a,b,c) = g(a,b,c) = h(a,b,c)
	// Here f,g,h are distances to 3 sides of triangle. a,b,c are bary coords
	// In fact, we can set a+b+c = 1, so only 2 variables really.
	// Have a vector quantity: [f-g,h-g], which we want to set to [0,0].
	// f(x+dx) = f(x) + F(dx)
	// ie. f(x) + F(dx) = 0 => dx = -inv(F)(f(x))
	function jacobian(f,a,b,eps) {
		// f(a+eps) = f(a-eps) + 2*eps*f'(a) => f'(a) =  (f(a+eps)-f(a-eps))/(2*eps)
		var s0 = f(a+eps,b);
		var s1 = f(a-eps,b);
		var s2 = f(a,b+eps);
		var s3 = f(a,b-eps);
		// df[0]/da df[0]/db
		// df[1]/da df[1]/db
		return [ (s0[0]-s1[0])/(2*eps), (s2[0]-s3[0])/(2*eps),
				 (s0[1]-s1[1])/(2*eps), (s2[1]-s3[1])/(2*eps) ];
	}
	function inv(m) {
		var a = m[0], b = m[1], c = m[2], d = m[3];
		var det = a*d - b*c;
		return [d/det,-b/det,-c/det,a/det];
	}
	function mapply(m,s) {
		var a = m[0], b = m[1], c = m[2], d = m[3];
		var x = s[0], y = s[1];
		return [a*x+b*y,c*x+d*y];
	}
	function refine(f,s) {
		var a = s[0], b = s[1];
		// 0 = f(a+dx) = f(a)+A(dx)
		// f(a) = -A(dx)
		// dx = -inv(A)(f(a))
		var m = inv(jacobian(f,a,b,1e-6));
		var s = f(a,b);
		var dx = mapply(m,s);
		return [a-dx[0],b-dx[1]];
	}
	function f(a,b) {
		var s = Vector.applybary([a,b,1-a-b],p,q,r);
		var p0 = Vector.reflect(q,r,s);
		var q0 = Vector.reflect(r,p,s);
		var r0 = Vector.reflect(p,q,s);
		var d0 = Vector.dist(p0,q0);
		var d1 = Vector.dist(q0,r0);
		var d2 = Vector.dist(r0,p0);
		return [d1-d0,d2-d1];
	}
	// Middle of the triangle
	var s = [1/3,1/3];
	// 6 iterations is more than enough
	for (var i = 0; i < 6; i++) {
		s = refine(f,s);
		//console.log(" -- " + s);
	}
	var t = f.apply(null,s);
	var check = Math.abs(t[0]) + Math.abs(t[1]);
	// Did we find a solution?
	if (check > 1e-6) console.log("Snubification failure: " + t);
	return [s[0],s[1],1-s[0]-s[1]];
}

function Schwarz(angles) {
	var t = makeSymmetry(angles);
	if (!t) return null;
	// p,q,r are the points of the initialSchwarz triangle
	var p = t[0], q = t[1], r = t[2];
	// P,Q,R are the barycentric coordinates of reflections of p,q,r.
	var P = Vector.getbary(p,q,r,Vector.reflect(q,r,p));
	var Q = Vector.getbary(p,q,r,Vector.reflect(r,p,q));
	var R = Vector.getbary(p,q,r,Vector.reflect(p,q,r));
	this.p = p; this.q = q; this.r = r; 
	this.P = P; this.Q = Q; this.R = R; 

	var points = [p,q,r];
	var regions = [[0,1,2,0]];
	var polygons = [[],[],[]];
	var adjacent = [];
	function getpoint(p) {
		var eps = 1e-4;
		for (var i = 0; i < points.length; i++) {
			if (Vector.approxeq(points[i],p,eps)) {
				return i;
			}
		}
		points.push(p)
		return points.length-1;
	}
	function getregion(t) {
		for (var i = 0; i < regions.length; i++) {
			if (Vector.eq(regions[i],t)) return i;
		}
		regions.push(t)
		return regions.length-1;
	}
	// We generate points in order so add to list only if greater
	// than the current last element (or if the list is empty).
	function addfacepoint(polygons,point,triangle)
	{
		if (!polygons[point]) polygons[point] = []
		polygons[point].push(triangle);
	}
	function sortpolygons(ppolygons,triangles,q,r)
	{
		function swap(a,i,j) {
			var t = a[i];
			a[i] = a[j];
			a[j] = t;
		}
		ppolygons.map(function(regions) {
			if (regions) {
				// Find first +ve element and move to front
				for (var i = 0; i < regions.length; i++) {
					if (triangles[regions[i]][3] == 0) {
						swap(regions,0,i);
						break;
					}
				}
				var nextp = q; // Swap q and r to go round other way
				for (var i = 0; i < regions.length-1; i++) {
					// Try to swap points[i+1] with a later point that shares two
					// vertexes with points[i]
					for (var j = i+2; j < regions.length; j++) {
						if (triangles[regions[i]][nextp] == triangles[regions[j]][nextp]) {
							swap(regions,i+1,j);
							break;
						}
					}
					nextp = q+r-nextp;
				}
			}
		});
	}

	for (var i = 0; i != regions.length; i++) {
		if (regions.length > 1000) {
			console.log(`❌ Schwarz`, regions.length)
			break
			return {}
		}
		var t = regions[i]
		var ttype = t[3]
		var px = points[t[0]]
		var qx = points[t[1]]
		var rx = points[t[2]]
		// face i is part of the p-face associated with p, etc
		addfacepoint(polygons[0],t[0],i)
		addfacepoint(polygons[1],t[1],i)
		addfacepoint(polygons[2],t[2],i)
		var pi = getpoint(Vector.applybary(P,px,qx,rx))
		var qi = getpoint(Vector.applybary(Q,px,qx,rx))
		var ri = getpoint(Vector.applybary(R,px,qx,rx))
		var t1 = getregion([pi,t[1],t[2],1-ttype])
		var t2 = getregion([t[0],qi,t[2],1-ttype])
		var t3 = getregion([t[0],t[1],ri,1-ttype])
		adjacent[i] = [t1,t2,t3]
	}
	sortpolygons(polygons[0],regions,1,2);
	sortpolygons(polygons[1],regions,2,0);
	sortpolygons(polygons[2],regions,0,1);
	this.points = points;
	this.regions = regions;
	this.adjacent = adjacent;
	this.polygons = polygons;
	this.snuba = getsnub(p,q,r);
}
Schwarz.makeSymmetry = makeSymmetry;
Schwarz.prototype.describe = function (verbose) {

	var points = this.points;
	var regions = this.regions;
	var adjacent = this.adjacent;
	if (DEBUG) SAY(`🌞 ${points?.length} POINTS, ${regions?.length} REGIONS`)
	if (!verbose) return;
	var ppolygons = this.polygons?.[0];
	var qpolygons = this.polygons?.[1];
	var rpolygons = this.polygons?.[2];
	if (DEBUG) SAY(`🌞 ${ppolygons?.length} PFACES, ${qpolygons?.length} QFACES, ${rpolygons?.length} RFACES`)
}
Schwarz.prototype.tri2bary = function(tri) {
	return Vector.tri2bary(tri,this.p,this.q,this.r);
}
Schwarz.prototype.applybary = function(bary,region) {
	var points = this.points;
	var regions = this.regions;
	var p = points[regions[region][0]];
	var q = points[regions[region][1]];
	var r = points[regions[region][2]];
	return Vector.applybary(bary,p,q,r);
}

// Compute the distances of the Schwarz triangle vertices from the origin.
// It's just the dot product with the region point (which is at distance 1).
// Since we use barycentric coords, we just calculate for region 0.
Schwarz.prototype.makefacedata = function(bary)
{
	var points = this.points;
	var regions = this.regions;
	var p = points[0], q = points[1], r = points[2];
	var s = Vector.applybary(bary,p,q,r);
	var s0 = Vector.reflect(q,r,s);
	var s1 = Vector.reflect(r,p,s);
	var s2 = Vector.reflect(p,q,s);
	// Take triple product of both kinds of face triangle.
	// If both are zero, then face is degenerate.
	// FIXME: please explain this
	// TBD: If one is zero, we can omit that sector in drawing face
	var t0 = Math.abs(Vector.triple(p,s,s1)) + Math.abs(Vector.triple(p,s,s2));
	var t1 = Math.abs(Vector.triple(q,s,s0)) + Math.abs(Vector.triple(q,s,s2));
	var t2 = Math.abs(Vector.triple(r,s,s0)) + Math.abs(Vector.triple(r,s,s1));
	var eps = 1e-4;
	// Map of regions to the corresponding points
	var regionpoints = [];
	for (var i = 0; i < regions.length; i++) {
		var region = regions[i];
		regionpoints[i] = Vector.applybary(bary,
										   points[region[0]],
										   points[region[1]],
										   points[region[2]]);
	}
	// Compute barycentric coords of centre of snub triangle.
	// ie. the centre of s0,s1,s2. The centre here means the face
	// normal (so polar reciprocation will work).
	var norm = Vector.cross(Vector.sub(s1,s0),Vector.sub(s2,s0));
	var normlen = Vector.length(norm);
	if (normlen < eps) {
		// If the triangle is degenerate, the calculation fails.
		if (0) {
			// A suitable approximation
			var newbary = [bary[0],bary[1],bary[2]];
			if (Math.abs(newbary[0] < eps)) newbary[0] = eps;
			else if (Math.abs(newbary[1] < eps)) newbary[1] = eps;
			else if (Math.abs(newbary[2] < eps)) newbary[2] = eps;
			var ns = Vector.applybary(newbary,p,q,r);
			var ns0 = Vector.reflect(q,r,ns);
			var ns1 = Vector.reflect(r,p,ns);
			var ns2 = Vector.reflect(p,q,ns);
			norm = Vector.cross(Vector.sub(ns1,ns0),Vector.sub(ns2,ns0));
		} else {
			var tmp;
			// But this is better
			// So, if the snub triangle is degenerate (because the face
			// point is in the corner of the Schwarz triangle), then we want
			// the limit, which turns out to be the mid point of
			// line from the face point in the opposite side.
			if (Math.abs(bary[0] > eps)) tmp = s0;
			else if (Math.abs(bary[1] > eps)) tmp = s1;
			else if (Math.abs(bary[2] > eps)) tmp = s2;
			else tmp = s0;
			norm = Vector.mid(s,tmp);
		}
		normlen = Vector.length(norm);
	}
	norm = Vector.div(norm,normlen);
	// Set the height correctly (to be on the s0,s1,s2 plane)
	norm = Vector.mul(norm,Vector.dot(s0,norm));
	var snubcentre = Vector.getbary(p,q,r,norm);

	// Taking the middle edge seems to give good results
	var snubsphere = Math.max(Vector.dot(Vector.mid(s0,s1)),
							  Math.min(Vector.dot(Vector.mid(s1,s2)),
									   Vector.dot(Vector.mid(s2,s0))));
	// Coords of the edge centres of the polyhedron
	var e0 = Vector.mid(s,s0);
	var e1 = Vector.mid(s,s1);
	var e2 = Vector.mid(s,s2);
	var midsphere = Math.min(Vector.dot(e0,e0),
							 Vector.dot(e1,e1),
							 Vector.dot(e2,e2));
	var edgecentres = [Vector.getbary(p,q,r,e2),
					   Vector.getbary(p,q,r,e0),
					   Vector.getbary(p,q,r,e1)];
	return {
		facedistances: [Vector.dot(p,s), Vector.dot(q,s), Vector.dot(r,s)],
		polygons: [t0 > eps,t1 > eps,t2 > eps], // TBD: think of a better name
		regionpoints: regionpoints,
		snubcentre: snubcentre,
		edgecentres: edgecentres,
		snubsphere: snubsphere,
		midsphere: midsphere,
	};
}

// Maybe use a "map over all polygons" function
// TBD: include snub polygons as well if required
Schwarz.prototype.makefacelines = function(facedata,hideface,centre,type,i,radius) {
	//TBD: Also add snub polygons
	// Go through every face, compute lines of intersection with face of given type.
	// 
	var points = this.points;
	var regions = this.regions;
	var regionpoints = facedata.regionpoints;
	var facelines = [];
	radius = radius || 1e4;
	for (var type1 = 0; type1 < 3; type1++) {
		if (!facedata.polygons[type1] || hideface[type1]) continue;
		var polygons1 = this.polygons[type1];
		var rcentre1 = facedata.facedistances[type1];
		for (var j = 0; j < polygons1.length; j++) {
			// Intersect given face with every other face to get a line
			if ((type != type1 || i != j) && polygons1[j]) {
				var p1 = Vector.mul(points[j],rcentre1);
				var end1 = null, end2 = null, llength = null;
				for (var type2 = 0; type2 < 3; type2++) {
					if (!facedata.polygons[type2] || hideface[type2]) continue;
					// Now intersect that line with the other polygons to get
					// the points of intersection. Find the end points of
					// the segment (up to the given radius).
					var polygons2 = this.polygons[type2];
					var rcentre2 = facedata.facedistances[type2];
					for (var k = 0; k < polygons2.length; k++) {
						if ((type2 != type || k != i) &&
							(type2 != type1 || k != j) &&
							polygons2[k]) {
							var p2 = Vector.mul(points[k],rcentre2);
							var s = Vector.intersection(centre,p1,p2);
							if (s != null && Vector.length(s) < radius+1e-4) {
								if (!end1) end1 = s;
								else if (!end2) {
									end2 = s;
									llength = Vector.dist(end1,end2);
								} else {
									// eg: end1 ... end2 ... s
									var llen1 = Vector.dist(s,end1);
									var llen2 = Vector.dist(s,end2);
									if (llen1 > llen2) {
										if (llen1 > llength) { 
											end2 = s; llength = llen1; 
										}
									} else if (llen2 > llength) {
										end1 = s; llength = llen2;
									}
								}
							}
						}
					}
					if (llength) {
						facelines.push([end1,end2,[i,j,k]]);
					}
				}
			}
		}
	}
	return facelines;
}

Schwarz.prototype.stellate = function(facedata,hideface,radius) {
	var points = this.points;
	var regions = this.regions;
	facedata.facelines = [];
	for (var type = 0; type < 3; type++) {
		if (facedata.polygons[type] && !hideface[type]) {
			var polygons = this.polygons[type];
			for (var i = 0; i < polygons.length; i++) {
				if (polygons[i]) break;  // Find a face
			}
			var rcentre = facedata.facedistances[type];
			var centre = Vector.mul(points[i],rcentre);
			var facelines = this.makefacelines(facedata,hideface,centre,type,i,radius);
			// Now change to barycentric coords
			// polygons[i] is the list of regions in the face
			// use coords based on first region
			var p = points[regions[polygons[i][0]][0]];
			var q = points[regions[polygons[i][0]][1]];
			var r = points[regions[polygons[i][0]][2]];
			for (i = 0; i < facelines.length; i++) {
				var end1 = facelines[i][0];
				var end2 = facelines[i][1];
				var bary1 = Vector.getbary(p,q,r,end1);
				var bary2 = Vector.getbary(p,q,r,end2);
				facelines[i][0] = bary1;
				facelines[i][1] = bary2;
			}
			facedata.facelines[type] = facelines;
		}
	}
}

// Maybe move these to Vector?
function applyop(trans,s,P,Q,R) {
	for (var i = 0; i < trans.length; i++) {
		var t = trans[i];
		if (t == 'P') s = Vector.planereflect(P,s);
		else if (t == 'Q') s = Vector.planereflect(Q,s);
		else if (t == 'R') s = Vector.planereflect(R,s);
		else console.log ("Bad operation: " + trans);
	}
	return s;
}

function makematrix(trans,P,Q,R) {
	var m0 = applyop(trans,[1,0,0],P,Q,R);
	var m1 = applyop(trans,[0,1,0],P,Q,R);
	var m2 = applyop(trans,[0,0,1],P,Q,R);
	return [ [ m0[0],m1[0],m2[0] ],
			 [ m0[1],m1[1],m2[1] ],
			 [ m0[2],m1[2],m2[2] ] ];
}

// Apply single operation trans over 'set' s (an array)
// Returns new array
function mapply(trans,s,P,Q,R) {
	var res = new Array(s.length);
	for (var i = 0; i < s.length; i++) {
		res[i] = applyop(trans,s[i],P,Q,R);
	}
	return res;
}

function applymatrix(m,u) {
	return [Vector.dot(m[0],u),
			Vector.dot(m[1],u),
			Vector.dot(m[2],u)];
}

function test() {
	var triangles = [
		[5,3,2],
		[3,3,5/2],
		[5,5,3/2],
		[5,5/2,2],
		[5,3,5/3],
		[5/2,5/2,5/2],
		[5,3,3/2],
		[5,5,5/4],
		[3,5/2,2],
		[5,5/2,3/2],
		[5,2,5/3],
		[3,5/2,5/3],
		[5,3,5/4],
		[5,2,3/2],
		[3,2,5/3],
		[5/2,5/2,3/2],
		[3,3,5/4],
		[3,5/2,5/4],
		[5/2,2,3/2],
		[5/2,5/3,5/3],
		[3,5/3,3/2],
		[3,2,5/4],
		[5/2,2,5/4],
		[5/2,3/2,3/2],
		[2,5/3,3/2],
		[5/3,5/3,3/2],
		[2,5/3,5/4],
		[2,3/2,5/4],
		[5/3,3/2,5/4],
		[3/2,3/2,5/4],
		[3/2,5/4,5/4],
		[5/4,5/4,5/4],
	];
	for (var i = 0; i < triangles.length; i++) {
		console.log((i+1) + ":")
		console.log(triangles[i])
		var a = triangles[i][0];
		var b = triangles[i][1];
		var c = triangles[i][2];
		var schwarz = new Schwarz([a,b,c]);
		console.log(schwarz.snuba)
		var schwarz = new Schwarz([a,c,b]);
		console.log(schwarz.snuba)
		var schwarz = new Schwarz([b,a,c]);
		console.log(schwarz.snuba)
		var schwarz = new Schwarz([b,c,a]);
		console.log(schwarz.snuba)
		var schwarz = new Schwarz([c,a,b]);
		console.log(schwarz.snuba)
		var schwarz = new Schwarz([c,b,a]);
		console.log(schwarz.snuba)
	}
}

// Get determinant of 4x4 matrix m
function determinant4(m) {
	console.assert(m.length == 16);
	var m00 = m[0],  m01 = m[1],  m02 = m[2],  m03 = m[3];
	var m10 = m[4],  m11 = m[5],  m12 = m[6],  m13 = m[7];
	var m20 = m[8],  m21 = m[9],  m22 = m[10], m23 = m[11];
	var m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
	var value =
		m03*m12*m21*m30 - m02*m13*m21*m30 - m03*m11*m22*m30 + m01*m13*m22*m30+
		m02*m11*m23*m30 - m01*m12*m23*m30 - m03*m12*m20*m31 + m02*m13*m20*m31+
		m03*m10*m22*m31 - m00*m13*m22*m31 - m02*m10*m23*m31 + m00*m12*m23*m31+
		m03*m11*m20*m32 - m01*m13*m20*m32 - m03*m10*m21*m32 + m00*m13*m21*m32+
		m01*m10*m23*m32 - m00*m11*m23*m32 - m02*m11*m20*m33 + m01*m12*m20*m33+
		m02*m10*m21*m33 - m00*m12*m21*m33 - m01*m10*m22*m33 + m00*m11*m22*m33;
	return value;
}

// Invert a 4x4 matrix m
function invert4(m) {
	console.assert(m.length == 16);
	var m00 = m[0],  m01 = m[1],  m02 = m[2],  m03 = m[3];
	var m10 = m[4],  m11 = m[5],  m12 = m[6],  m13 = m[7];
	var m20 = m[8],  m21 = m[9],  m22 = m[10], m23 = m[11];
	var m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
	var n00 = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
	var n01 = m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33;
	var n02 = m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33;
	var n03 = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;
	var n10 = m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33;
	var n11 = m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33;
	var n12 = m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33;
	var n13 = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
	var n20 = m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33;
	var n21 = m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33;
	var n22 = m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33;
	var n23 = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;
	var n30 = m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32;
	var n31 = m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32;
	var n32 = m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32;
	var n33 = m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22;
	var n = [n00,n01,n02,n03, n10,n11,n12,n13, n20,n21,n22,n23, n30,n31,n32,n33]
	var d = determinant4(m);
	for (var i = 0; i < n.length; i++) n[i] /= d;
	return n;
}

// Apply a 4x4 matrix m to a 4-vector v
function apply4(m,v) {
	console.assert(m.length == 16);
	console.assert(v.length == 4);
	return [m[0]*v[0]  + m[1] *v[1] + m[2] * v[2]+m[3] *v[3],
			m[4]*v[0]  + m[5] *v[1] + m[6] * v[2]+m[7] *v[3],
			m[8]*v[0]  + m[9] *v[1] + m[10]* v[2]+m[11]*v[3],
			m[12]*v[0] + m[13]*v[1] + m[14]* v[2]+m[15]*v[3]];
}

// set up the external symbols

Geometry.Vector = Vector;
Geometry.PointSet = PointSet;
Geometry.Schwarz = Schwarz;
Geometry.makematrix = makematrix;
Geometry.mapply = mapply;
Geometry.invert4 = invert4;
Geometry.apply4 = apply4;
Geometry.test = test;

export default Geometry