/**
 * Class representing a vector in 3D space
 */
export class Vector3 {
    /**
     * Create a [0, 0, 0] Vector3
     * @returns {Vector3}
     */
    static zero(): Vector3;
    /**
     * Create a [1, 1, 1] Vector3
     * @returns {Vector3}
     */
    static one(): Vector3;
    /**
     * Create a [1, 0, 0] Vector3
     * @returns {Vector3}
     */
    static right(): Vector3;
    /**
     * Create a [-1, 0, 0] Vector3
     * @returns {Vector3}
     */
    static left(): Vector3;
    /**
     * Create a [0, 0, 1] Vector3
     * @returns {Vector3}
     */
    static up(): Vector3;
    /**
     * Create a [0, 0, -1] Vector3
     * @returns {Vector3}
     */
    static down(): Vector3;
    /**
     * Create a [0, 1, 0] Vector3
     * @returns {Vector3}
     */
    static forward(): Vector3;
    /**
     * Create a [0, -1, 0] Vector3
     * @returns {Vector3}
     */
    static backward(): Vector3;
    /**
     * Create a Vector3
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x?: number, y?: number, z?: number);
    elements: Float32Array<ArrayBuffer>;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set z(v: number);
    get z(): number;
    /**
     * Set the x, y, z values
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns
     */
    set(x: number, y: number, z: number): this;
    /**
     * Copy the value of another Vector3 into this Vector3
     * @param {Vector3} v
     * @returns {Vector3}
     */
    copy(v: Vector3): Vector3;
    /**
     * Create a clone of this Vector3
     * @returns {Vector3}
     */
    clone(): Vector3;
    /**
     * Add another Vector3 to this Vector3
     * a + b
     * @param {Vector3} v
     * @returns {Vector3}
     */
    add(v: Vector3): Vector3;
    /**
     * Add another scaled Vector3 to this Vector3
     * @param {Vector3} v
     * @param {number} s
     * @returns {Vector3}
     */
    addScaledVector(v: Vector3, s: number): Vector3;
    /**
     * Subtract another Vector3 from this Vector3
     * a - b
     * @param {Vector3} v
     * @returns {Vector3}
     */
    sub(v: Vector3): Vector3;
    /**
     * Scale (multiply) this Vector3 by a factor
     * s * v
     * @param {Vector3} s
     * @returns {Vector3}
     */
    multiplyScalar(s: Vector3): Vector3;
    multiplyComponents(v: any): this;
    /**
     * Scale (divide) this Vector3 by a factor
     * 1/s * v
     * @param {Vector3} s
     * @returns {Vector3}
     * @throws {RangeError} when trying to divide by zero
     */
    divideScalar(s: Vector3): Vector3;
    abs(): this;
    /**
     * Calculate the dot product of this Vector3 and another Vector3
     * a ⋅ b
     * @param {Vector3} v
     * @returns {number}
     */
    dot(v: Vector3): number;
    /**
     * Multiply (cross product) this Vector3 by another Vector3
     * a × b
     * @param {Vector3} v
     * @returns {Vector3}
     */
    cross(v: Vector3): Vector3;
    /**
     * Set this Vector3 to the cross product of two Vector3s.
     * @param {Vector3} a
     * @param {Vector3} b
     * @returns {Vector3}
     */
    crossProduct(a: Vector3, b: Vector3): Vector3;
    /**
     * Calculate the length squared of this Vector3
     * @returns {number}
     */
    lengthSq(): number;
    /**
     * Calculate the length of this Vector3
     * @returns {number}
     */
    length(): number;
    /**
     * Normalize this Vector3
     * [0, 0, 0] remains unchanged.
     * @returns {Vector3}
     */
    normalize(): Vector3;
    /**
     * Calculate the distance from this Vector3 to another Vector3
     * @param {Vector3} v
     * @returns {number}
     */
    distanceTo(v: Vector3): number;
    /**
     * Calculate the distance squared from this Vector3 to another Vector3
     * @param {Vector3} v
     * @returns {number}
     */
    distanceToSquared(v: Vector3): number;
    /**
     * Negate this Vector3
     * @returns {Vector3}
     */
    negate(): Vector3;
    /**
     * Transform this Vector3 using a Matrix4x4
     * @param {Matrix4x4} m
     * @param {boolean} divideW divide by w (optional, default = false)
     * @returns {Vector3}
     */
    applyMatrix4(m: Matrix4x4, divideW?: boolean): Vector3;
    /**
     * Determine whether a Vector3 is equal to this Vector3, down to a given precision epsilon.
     * @param {Vector3} v
     * @param {number} epsilon (optional, default = 1e-6)
     * @returns {boolean}
     */
    equals(v: Vector3, epsilon?: number): boolean;
    /**
     * Create an Array that contains the x, y, and z values as elements
     * @returns {Array<number>}
     */
    toArray(): Array<number>;
    /**
     * Set this Vector3 from values in an array at a given offset
     * @param {Array<number>} arr
     * @param {number} offset (optional, default = 0)
     * @returns
     */
    setFromArray(arr: Array<number>, offset?: number): this;
}
