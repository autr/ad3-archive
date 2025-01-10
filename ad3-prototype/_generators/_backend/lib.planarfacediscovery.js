/**
 * This code is adapted from the Geometric Tools Library
 *
 * "Constructing a Cycle Basis for a Planar Graph"
 *
 * https://www.geometrictools.com/
 *
 * You can find the original listing here
 * https://www.geometrictools.com/GTE/Mathematics/MinimalCycleBasis.h
 *
 * And the paper explaining the method can be found here
 * https://www.geometrictools.com/Documentation/MinimalCycleBasis.pdf
 *
 * Thank you to David Eberly and the Geometric Tools team for a
 * wonderful algorithm
 */
class CycleTree {
    constructor(cycle, children) {
        this.cycle = cycle;
        this.children = children;
    }
    isEmpty() {
        return this.cycle.length === 0 && this.children.length === 0;
    }
    toJSON() {
        return JSON.parse(JSON.stringify({
            cycle: [...this.cycle],
            children: this.children.map((c) => c.toJSON()),
        }));
    }
}
class Vertex {
    constructor(name, position) {
        this.name = name;
        this.position = position;
        this.visited = 0;
        this.adjacent = new Set();
    }
}
var DiscoveryResultType;
(function (DiscoveryResultType) {
    DiscoveryResultType["ERROR"] = "ERROR";
    DiscoveryResultType["RESULT"] = "RESULT";
})(DiscoveryResultType || (DiscoveryResultType = {}));
var DiscoveryErrorCode;
(function (DiscoveryErrorCode) {
    DiscoveryErrorCode["INVALID_COORDINATE_SYSTEM"] = "INVALID_COORDINATE_SYSTEM";
    DiscoveryErrorCode["EDGE_ENDPOINT_OUT_OF_BOUNDS"] = "EDGE_ENDPOINT_OUT_OF_BOUNDS";
    DiscoveryErrorCode["VERTICES_HAVE_SAME_POSITION"] = "VERTICES_HAVE_SAME_POSITION";
    DiscoveryErrorCode["DUPLICATE_EDGE_FOUND"] = "DUPLICATE_EDGE_FOUND";
    DiscoveryErrorCode["GRAPH_EMPTY"] = "GRAPH_EMPTY";
})(DiscoveryErrorCode || (DiscoveryErrorCode = {}));
class PlanarFaceTree {
    constructor() {
        this.vertexStore = [];
    }
    discover(positions, edges) {
        const forest = [];
        const validationError = PlanarFaceTree.validateInputs(positions, edges);
        if (validationError) {
            return validationError;
        }
        /**
         * Build vertex objects only for the vertices that are
         * involved in the passed edges
         */
        const unique = new Map();
        edges.forEach((edge) => {
            for (let i = 0; i < 2; i++) {
                const name = edge[i];
                if (!unique.has(name)) {
                    const vertex = new Vertex(name, positions[name]);
                    unique.set(name, vertex);
                }
            }
        });
        Array.from(unique.entries()).forEach(([_, vertex]) => {
            this.vertexStore.push(vertex);
        });
        /**
         * If the edges that we are given are directed
         * this step will create an adjacency matrix which
         * is undirected. It uses a set so even if
         * we end up passing an undirected set of edges
         * it will still be fine and avoid duplicates
         */
        edges.forEach((edge) => {
            const iter0 = unique.get(edge[0]);
            const iter1 = unique.get(edge[1]);
            if (iter0 && iter1) {
                iter0.adjacent.add(iter1);
                iter1.adjacent.add(iter0);
            }
        });
        /**
         * get the connected components of the graph
         *
         * visited values are
         *
         * 0 -> unvisited (initial)
         * 1 -> discovered
         * 2 -> finished
         */
        const components = [];
        this.vertexStore.forEach((vInitial) => {
            if (vInitial.visited === 0) {
                components.push({ value: [] });
                PlanarFaceTree.depthFirstSearch(vInitial, components[components.length - 1]);
            }
        });
        /**
         * we must reset the visited values because we will be doing another
         * depth first search later
         */
        this.vertexStore.forEach((vertex) => {
            vertex.visited = 0;
        });
        components.forEach((component) => {
            forest.push(this.extractBasis(component));
        });
        return {
            type: DiscoveryResultType.RESULT,
            forest: forest.filter((t) => !t.isEmpty()),
        };
    }
    static validateInputs(positions, edges) {
        if (positions.length === 0 || edges.length === 0) {
            return {
                type: DiscoveryResultType.ERROR,
                reason: DiscoveryErrorCode.GRAPH_EMPTY,
            };
        }
        const posKeys = new Set();
        for (let j = 0; j < positions.length; j++) {
            const position = positions[j];
            const key = `${position[0]}->${position[1]}`;
            if (posKeys.has(key)) {
                return {
                    type: DiscoveryResultType.ERROR,
                    reason: DiscoveryErrorCode.VERTICES_HAVE_SAME_POSITION,
                };
            }
            posKeys.add(key);
            if (position[0] < 0 || position[1] < 0) {
                return {
                    type: DiscoveryResultType.ERROR,
                    reason: DiscoveryErrorCode.INVALID_COORDINATE_SYSTEM,
                };
            }
        }
        const edgeKeys = new Set();
        const maxNodeValue = positions.length - 1;
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const key = `${edge[0]}->${edge[1]}`;
            if (edgeKeys.has(key)) {
                return {
                    type: DiscoveryResultType.ERROR,
                    reason: DiscoveryErrorCode.DUPLICATE_EDGE_FOUND,
                };
            }
            edgeKeys.add(key);
            if (edge[0] < 0 ||
                edge[0] > maxNodeValue ||
                edge[1] < 0 ||
                edge[1] > maxNodeValue) {
                return {
                    type: DiscoveryResultType.ERROR,
                    reason: DiscoveryErrorCode.EDGE_ENDPOINT_OUT_OF_BOUNDS,
                };
            }
        }
        return null;
    }
    static depthFirstSearch(vInitial, component) {
        const vStack = [];
        vStack.push(vInitial);
        while (vStack.length > 0) {
            const vertex = vStack[vStack.length - 1];
            vertex.visited = 1;
            let i = 0;
            const adjacents = Array.from(vertex.adjacent.values());
            for (let j = 0; j < adjacents.length; j++) {
                const adjacent = adjacents[i];
                if (adjacent && adjacent.visited === 0) {
                    vStack.push(adjacent);
                    break;
                }
                ++i;
            }
            if (i === vertex.adjacent.size) {
                vertex.visited = 2;
                component.value.push(vertex);
                vStack.pop();
            }
        }
    }
    static extractCycle(closedWalk) {
        const numVertices = closedWalk.value.length;
        const cycle = [];
        for (let i = 0; i < numVertices; ++i) {
            cycle[i] = closedWalk.value[i].name;
        }
        let v0 = closedWalk.value[0];
        let v1 = closedWalk.value[1];
        let vBranch = v0.adjacent.size > 2 ? v0 : null;
        v0.adjacent.delete(v1);
        v1.adjacent.delete(v0);
        while (v1 !== vBranch && v1.adjacent.size === 1) {
            const adj = Array.from(v1.adjacent)[0];
            v1.adjacent.delete(adj);
            adj.adjacent.delete(v1);
            v1 = adj;
        }
        if (v1 !== v0) {
            vBranch = v1;
            while (v0 !== vBranch && v0.adjacent.size === 1) {
                v1 = Array.from(v0.adjacent)[0];
                v0.adjacent.delete(v1);
                v1.adjacent.delete(v0);
                v0 = v1;
            }
        }
        return cycle;
    }
    extractBasis(component) {
        const tree = new CycleTree([], []);
        while (component.value.length > 0) {
            this.removeFilaments(component);
            if (component.value.length > 0) {
                tree.children.push(this.extractCycleFromComponent(component));
            }
        }
        /**
         * If we have only one child and no cycle, then there is no point in
         * the intermediate tree, so just copy its properties to the parent
         *
         * Worth noting that in reality the parent "tree" will never have a
         * cycle set
         */
        if (tree.cycle.length === 0 && tree.children.length === 1) {
            const child = tree.children[tree.children.length - 1];
            tree.cycle = child.cycle;
            tree.children = child.children;
        }
        return tree;
    }
    removeFilaments(component) {
        /**
         * Finding filaments begins with finding vertices which only attach to
         * one other vertex.
         *
         * If you think about it these are like orphan vertices, we can
         * guarantee that these vertices are not part of any cycle since
         * then they would connect to >= 2 vertices
         *
         * So they must be part of a filament
         */
        const endpoints = [];
        component.value.forEach((vertex) => {
            if (vertex.adjacent.size === 1) {
                endpoints.push(vertex);
            }
        });
        if (endpoints.length > 0) {
            endpoints.forEach((v) => {
                if (v.adjacent.size === 1) {
                    let vertex = v;
                    while (vertex.adjacent.size === 1) {
                        /**
                         * Here we traverse along the filament and delete each
                         * vertex along the way
                         *                                 v4
                         *                               /
                         *  v0 <---> v1 <---> v2 <---> v3
                         *                              \
                         *                                v5
                         *
                         * i.e we keep deleting from v0 until v3
                         */
                        const adjacent = Array.from(vertex.adjacent.values())[0];
                        /**
                         * Delete the edge in both directions since we assume
                         * an undirected graph
                         */
                        adjacent.adjacent.delete(vertex);
                        vertex.adjacent.delete(adjacent);
                        vertex = adjacent;
                    }
                }
            });
            /**
             * either the component is empty at this point (it was all filaments)
             * or it has no filaments and >= 1 cycle.
             *
             * Above all we have removed is verices
             */
            const remaining = [];
            // TODO .filter
            component.value.forEach((vertex) => {
                if (vertex.adjacent.size > 0) {
                    remaining.push(vertex);
                }
            });
            component.value = remaining;
        }
    }
    extractCycleFromComponent(component) {
        /**
         * Find left most vertex of component, ie. the one
         * with the least x value
         */
        let minVertex = component.value[0];
        component.value.forEach((vertex) => {
            /**
             * if x values match then choose the vertex with
             * least y value
             */
            if (vertex.position[0] === minVertex.position[0]) {
                if (vertex.position[1] < minVertex.position[1]) {
                    minVertex = vertex;
                }
            }
            if (vertex.position[0] < minVertex.position[0]) {
                minVertex = vertex;
            }
        });
        /**
         * Traverse the closed walk, duplicating the start vertex
         * as the end vertex
         */
        const closedWalk = { value: [] };
        let vCurr = minVertex;
        const vStart = vCurr;
        closedWalk.value.push(vStart);
        let vAdj = this.getClockwiseMost(null, vStart);
        while (vAdj !== vStart) {
            closedWalk.value.push(vAdj);
            const vNext = this.getCounterClockwiseMost(vCurr, vAdj);
            vCurr = vAdj;
            vAdj = vNext;
        }
        closedWalk.value.push(vStart);
        const tree = this.extractCycleFromClosedWalk(closedWalk);
        /**
         * Cycle removal may also leave orphan vertexes, vertexes with
         * no adjacent vertices. We need to remove these
         */
        const remaining = [];
        component.value.forEach((vertex) => {
            if (vertex.adjacent.size > 0) {
                remaining.push(vertex);
            }
        });
        component.value = remaining;
        return tree;
    }
    extractCycleFromClosedWalk(closedWalk) {
        const tree = new CycleTree([], []);
        const duplicates = new Map();
        const detachments = new Set();
        let numClosedWalk = closedWalk.value.length;
        for (let i = 1; i < numClosedWalk - 1; ++i) {
            const diter = duplicates.get(closedWalk.value[i]) || null;
            if (diter === null) {
                duplicates.set(closedWalk.value[i], i);
                continue;
            }
            const iMin = diter;
            const iMax = i;
            detachments.add(iMin);
            for (let j = iMin + 1; j < iMax; ++j) {
                const vertex = closedWalk.value[j];
                duplicates.delete(vertex);
                detachments.delete(j);
            }
            // TODO - Could be a problem here if my iterator understandinng is wrong
            const startDeletionAt = iMin + 1;
            const endDeletionAt = iMax + 1;
            const deleteCount = endDeletionAt - startDeletionAt;
            closedWalk.value.splice(startDeletionAt, deleteCount);
            numClosedWalk = closedWalk.value.length;
            i = iMin;
        }
        if (numClosedWalk > 3) {
            detachments.add(0);
            detachments.forEach((i) => {
                const original = closedWalk.value[i];
                const maxVertex = closedWalk.value[i + 1];
                const minVertex = i > 0
                    ? closedWalk.value[i - 1]
                    : closedWalk.value[numClosedWalk - 2];
                const dMin = [0, 0];
                const dMax = [0, 0];
                for (let j = 0; j < 2; ++j) {
                    dMin[j] = minVertex.position[j] - original.position[j];
                    dMax[j] = maxVertex.position[j] - original.position[j];
                }
                const isConvex = dMax[0] * dMin[1] >= dMax[1] * dMin[0];
                const inWedge = new Set();
                const adjacent = original.adjacent;
                adjacent.forEach((vertex) => {
                    if (vertex.name === minVertex.name ||
                        vertex.name === maxVertex.name) {
                        return;
                    }
                    const dVer = [0, 0];
                    for (let j = 0; j < 2; ++j) {
                        dVer[j] = vertex.position[j] - original.position[j];
                    }
                    let containsVertex = false;
                    if (isConvex) {
                        containsVertex =
                            dVer[0] * dMin[1] > dVer[1] * dMin[0] &&
                                dVer[0] * dMax[1] < dVer[1] * dMax[0];
                    }
                    else {
                        containsVertex =
                            dVer[0] * dMin[1] > dVer[1] * dMin[0] ||
                                dVer[0] * dMax[1] < dVer[1] * dMax[0];
                    }
                    if (containsVertex) {
                        inWedge.add(vertex);
                    }
                });
                if (inWedge.size > 0) {
                    const clone = new Vertex(original.name, [
                        ...original.position,
                    ]);
                    this.vertexStore.push(clone);
                    inWedge.forEach((vertex) => {
                        original.adjacent.delete(vertex);
                        vertex.adjacent.delete(original);
                        clone.adjacent.add(vertex);
                        vertex.adjacent.add(clone);
                    });
                    const component = {
                        value: [],
                    };
                    PlanarFaceTree.depthFirstSearch(clone, component);
                    tree.children.push(this.extractBasis(component));
                }
            });
            tree.cycle = PlanarFaceTree.extractCycle(closedWalk);
        }
        else {
            const original = closedWalk.value[0];
            const adjacent = closedWalk.value[1];
            const clone = new Vertex(original.name, [...original.position]);
            this.vertexStore.push(clone);
            original.adjacent.delete(adjacent);
            adjacent.adjacent.delete(original);
            clone.adjacent.add(adjacent);
            adjacent.adjacent.add(clone);
            const component = { value: [] };
            PlanarFaceTree.depthFirstSearch(clone, component);
            tree.children.push(this.extractBasis(component));
            if (tree.cycle.length === 0 && tree.children.length === 1) {
                const child = tree.children[tree.children.length - 1];
                tree.cycle = child.cycle;
                tree.children = child.children;
            }
        }
        return tree;
    }
    getClockwiseMost(vPrev, vCurr) {
        let vNext = null;
        let vCurrConvex = false;
        const dCurr = [0, 0];
        let dNext = [0, 0];
        if (vPrev) {
            dCurr[0] = vCurr.position[0] - vPrev.position[0];
            dCurr[1] = vCurr.position[1] - vPrev.position[1];
        }
        else {
            dCurr[0] = 0;
            dCurr[1] = -1;
        }
        vCurr.adjacent.forEach((vAdj) => {
            if (vAdj === vPrev) {
                return;
            }
            const dAdj = [
                vAdj.position[0] - vCurr.position[0],
                vAdj.position[1] - vCurr.position[1],
            ];
            if (!vNext) {
                vNext = vAdj;
                dNext = dAdj;
                vCurrConvex = dNext[0] * dCurr[1] <= dNext[1] * dCurr[0];
                return;
            }
            if (vCurrConvex) {
                if (dCurr[0] * dAdj[1] < dCurr[1] * dAdj[0] ||
                    dNext[0] * dAdj[1] < dNext[1] * dAdj[0]) {
                    vNext = vAdj;
                    dNext = dAdj;
                    vCurrConvex = dNext[0] * dCurr[1] <= dNext[1] * dCurr[0];
                }
            }
            else {
                if (dCurr[0] * dAdj[1] < dCurr[1] * dAdj[0] &&
                    dNext[0] * dAdj[1] < dNext[1] * dAdj[0]) {
                    vNext = vAdj;
                    dNext = dAdj;
                    vCurrConvex = dNext[0] * dCurr[1] < dNext[1] * dCurr[0];
                }
            }
        });
        return vNext;
    }
    getCounterClockwiseMost(vPrev, vCurr) {
        let vNext = null;
        let vCurrConvex = false;
        const dCurr = [0, 0];
        let dNext = [0, 0];
        if (vPrev) {
            dCurr[0] = vCurr.position[0] - vPrev.position[0];
            dCurr[1] = vCurr.position[1] - vPrev.position[1];
        }
        else {
            dCurr[0] = 0;
            dCurr[1] = -1;
        }
        vCurr.adjacent.forEach((vAdj) => {
            if (vAdj === vPrev) {
                return;
            }
            const dAdj = [
                vAdj.position[0] - vCurr.position[0],
                vAdj.position[1] - vCurr.position[1],
            ];
            if (!vNext) {
                vNext = vAdj;
                dNext = dAdj;
                vCurrConvex = dNext[0] * dCurr[1] <= dNext[1] * dCurr[0];
                return;
            }
            if (vCurrConvex) {
                if (dCurr[0] * dAdj[1] > dCurr[1] * dAdj[0] &&
                    dNext[0] * dAdj[1] > dNext[1] * dAdj[0]) {
                    vNext = vAdj;
                    dNext = dAdj;
                    vCurrConvex = dNext[0] * dCurr[1] <= dNext[1] * dCurr[0];
                }
            }
            else {
                if (dCurr[0] * dAdj[1] > dCurr[1] * dAdj[0] ||
                    dNext[0] * dAdj[1] > dNext[1] * dAdj[0]) {
                    vNext = vAdj;
                    dNext = dAdj;
                    vCurrConvex = dNext[0] * dCurr[1] <= dNext[1] * dCurr[0];
                }
            }
        });
        return vNext;
    }
}

var WindingOrder;
(function (WindingOrder) {
    WindingOrder["CW"] = "CW";
    WindingOrder["CCW"] = "CCW";
    WindingOrder["COLINEAR"] = "CL";
})(WindingOrder || (WindingOrder = {}));
/**
 * We expect the path of polygon to be a sequence of
 * nodes that ends with the starting node
 *
 * e.g. 4 3 6 7 4
 */
const getPointPath = (nodes, edges) => {
    const pts = edges.slice(0, edges.length - 1);
    return pts.map((p) => nodes[p]);
};
const getLinePath = (points) => {
    return points.reduce((acc, pt, ix, arr) => {
        return [...acc, [pt, arr[ix + 1] ? arr[ix + 1] : arr[0]]];
    }, []);
};
/**
 * Y up and X toward the left coordinate system
 */
const determineWindingOrder = (points) => {
    const res = points.reduce((acc, [x1, y1], ix) => {
        const [x2, y2] = points[ix + 1] ? points[ix + 1] : points[0];
        return acc + (x2 - x1) * (y2 + y1);
    }, 0);
    if (res === 0) {
        return WindingOrder.COLINEAR;
    }
    return res > 0 ? WindingOrder.CW : WindingOrder.CCW;
};
const getMaxX = (pos) => {
    let max = -1;
    pos.forEach((p) => {
        if (p[0] > max) {
            max = p[0];
        }
    });
    return max;
};
const pointLiesOnPolygonBoundary = (point, polygon) => {
    for (let i = 0; i < polygon.length; i++) {
        const [from, to] = polygon[i];
        const winding = determineWindingOrder([from, to, point]);
        if (winding === 'CL' && onSegment(from, point, to)) {
            return true;
        }
    }
    return false;
};
const allPointsLieOnBoundary = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        const aPt = a[i];
        const isOnBoundary = pointLiesOnPolygonBoundary(aPt, b);
        if (!isOnBoundary) {
            return false;
        }
    }
    return true;
};
/**
 * Is A inside B
 */
const isInside = (nodes, p, polygon) => {
    const extreme = [getMaxX(polygon) + 10, p[1]];
    let count = 0, i = 0;
    do {
        const next = (i + 1) % polygon.length;
        // Check if the line segment from 'p' to
        // 'extreme' intersects with the line
        // segment from 'polygon[i]' to 'polygon[next]'
        if (intersect(polygon[i], polygon[next], p, extreme)) {
            // If the point 'p' is colinear with line
            // segment 'i-next', then check if it lies
            // on segment. If it lies, return true, otherwise false
            if (determineWindingOrder([polygon[i], p, polygon[next]]) ==
                WindingOrder.COLINEAR) {
                return onSegment(polygon[i], p, polygon[next]);
            }
            count++;
        }
        i = next;
    } while (i != 0);
    // Return true if count is odd, false otherwise
    return count % 2 == 1;
};
const getPolygonArea = (nodes, polygon) => {
    const pointPath = getPointPath(nodes, polygon.edges);
    const windingOrder = determineWindingOrder(pointPath);
    const linePath = getLinePath(pointPath);
    return irregularPolygonArea(linePath, windingOrder) || 0;
};
const areaUnderLineSegment = ([[x1, y1], [x2, y2]]) => {
    const averageHeight = (y1 + y2) / 2;
    const width = x2 - x1;
    const area = averageHeight * width;
    return area;
};
const irregularPolygonArea = (lineSegments, windingOrder) => {
    if (windingOrder === WindingOrder.COLINEAR) {
        return 0;
    }
    return lineSegments.reduce((acc, seg) => {
        switch (windingOrder) {
            case WindingOrder.CW:
                return acc + areaUnderLineSegment(seg);
            case WindingOrder.CCW:
                return acc - areaUnderLineSegment(seg);
        }
    }, 0);
};
function onSegment(p, q, r) {
    if (q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1])) {
        return true;
    }
    return false;
}
const intersect = (p1, q1, p2, q2) => {
    const o1 = determineWindingOrder([p1, q1, p2]);
    const o2 = determineWindingOrder([p1, q1, q2]);
    const o3 = determineWindingOrder([p2, q2, p1]);
    const o4 = determineWindingOrder([p2, q2, q1]);
    /**
     * Given the line p1 -> q1, if both points of p2 -> q2 are on the same side
     * of the line p1 -> q1 then the winding order of
     *  p1 -> q1 -> p2
     *  p1 -> q1 -> q2
     * will be the same, hence they wont intersect
     *
     * The cases o1 and o2 cover the cases where p1q1 is horizontal and p2q2 vertical
     * The cases o3 and o4 cover the cases where p1q1 is vertical and p2q2 horizontal
     */
    if (o1 !== o2 && o3 !== o4) {
        return true;
    }
    // Special Cases
    // p1, q1 and p2 are collinear and
    // p2 lies on segment p1q1
    if (o1 === WindingOrder.COLINEAR && onSegment(p1, p2, q1)) {
        return true;
    }
    // p1, q1 and p2 are collinear and
    // q2 lies on segment p1q1
    if (o2 === WindingOrder.COLINEAR && onSegment(p1, q2, q1)) {
        return true;
    }
    // p2, q2 and p1 are collinear and
    // p1 lies on segment p2q2
    if (o3 === WindingOrder.COLINEAR && onSegment(p2, p1, q2)) {
        return true;
    }
    // p2, q2 and q1 are collinear and
    // q1 lies on segment p2q2
    if (o4 === WindingOrder.COLINEAR && onSegment(p2, q1, q2)) {
        return true;
    }
    // Doesn't fall in any of the above cases
    return false;
};

var AreaTreeType;
(function (AreaTreeType) {
    AreaTreeType["CHILD"] = "CHILD";
    AreaTreeType["ROOT"] = "ROOT";
})(AreaTreeType || (AreaTreeType = {}));
const isChildArea = (childPolygon, parent, polygons, nodes) => {
    const parentPointPath = getPointPath(nodes, polygons[parent.polygonIndex].edges);
    const currentPolygonPointPath = getPointPath(nodes, childPolygon.edges);
    const pointOnCurrentPolygon = currentPolygonPointPath[0];
    const currentInsideParent = isInside(nodes, pointOnCurrentPolygon, parentPointPath);
    const currentLiesCompletelyOnBoundaryOfParent = allPointsLieOnBoundary(currentPolygonPointPath, getLinePath(parentPointPath));
    /**
     * If the polygon exists completely on the boundary of the parent shape then
     * it will be accounted for separately by the planar face discovery so we need
     * to exclude it from here
     */
    return currentInsideParent && !currentLiesCompletelyOnBoundaryOfParent;
};
const traverseAreas = (nodes, polygons, parent = { type: AreaTreeType.ROOT, children: [] }, pointer = 0) => {
    for (let i = pointer; i < polygons.length; i++) {
        const p = polygons[i];
        if (p.visited) {
            continue;
        }
        const isRoot = parent.type === AreaTreeType.ROOT;
        if (isRoot || isChildArea(p, parent, polygons, nodes)) {
            const newTree = {
                type: AreaTreeType.CHILD,
                area: {
                    total: p.area,
                    withoutChildren: p.area,
                },
                polygonIndex: i,
                polygon: p.edges,
                children: [],
            };
            p.visited = true;
            parent.children.push(newTree);
            if (parent.type === AreaTreeType.CHILD) {
                parent.area.withoutChildren =
                    parent.area.withoutChildren - p.area;
            }
            if (polygons[i + 1]) {
                traverseAreas(nodes, polygons, newTree, i + 1);
            }
        }
    }
    return parent;
};
const buildNestingTree = (nodes, polygons) => {
    const inputPolygons = polygons
        .map((p, ix) => (Object.assign(Object.assign({}, p), { id: ix, visited: false, area: getPolygonArea(nodes, p) })))
        .sort((a, b) => b.area - a.area);
    return traverseAreas(nodes, inputPolygons);
};
const getCyclesFromCycleForest = (forest, result = []) => {
    forest.forEach((tree) => {
        result.push(tree.cycle);
        getCyclesFromCycleForest(tree.children, result);
    });
    return result.filter((arr) => !!arr.length);
};
const getAreaTree = (nodes, edges) => {
    const solver = new PlanarFaceTree();
    const faces = solver.discover(nodes, edges);
    if (faces.type === 'ERROR') {
        throw new Error(faces.reason);
    }
    const flattenedFaces = getCyclesFromCycleForest(faces.forest, []);
    return buildNestingTree(nodes, flattenedFaces.map((f) => ({ edges: f })));
};

export { AreaTreeType, CycleTree, DiscoveryErrorCode, DiscoveryResultType, PlanarFaceTree, getAreaTree };
//# sourceMappingURL=bundle.js.map
