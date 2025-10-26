/**
 * Class representing a 3x3 matrix
 * The elements are stored in a Float32Array in column-major order
 */
export class Matrix3x3 {
    static identity(): Matrix3x3;
    static fromQuaternion(q: any): Vector3;
    static fromScaling(s: any): Matrix3x3;
    static fromRotationX(theta: any): Vector3;
    static fromRotationY(theta: any): Vector3;
    static fromRotationZ(theta: any): Vector3;
    elements: Float32Array<ArrayBuffer>;
    /**
     * Set the elements of this Matrix3x3
     * The parameters are in row-major order.
     * n11 n12 n13
     * n21 n22 n23
     * n31 n32 n33
     * @param {number} n11
     * @param {number} n12
     * @param {number} n13
     * @param {number} n21
     * @param {number} n22
     * @param {number} n23
     * @param {number} n31
     * @param {number} n32
     * @param {number} n33
     * @returns {Vector3}
     */
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Vector3;
    /**
     * Set this Matrix3x3 to identity
     * 1 0 0
     * 0 1 0
     * 0 0 1
     * @returns {Matrix3x3}
     */
    identity(): Matrix3x3;
    /**
     * Copy the values of anoter Matrix3x3 into this Matrix3x3
     * @param {Matrix3x3} m
     * @returns {Matrix3x3}
     */
    copy(m: Matrix3x3): Matrix3x3;
    /**
     * Create a clone of this Matrix3x3
     * @returns {Matrix3x3}
     */
    clone(): Matrix3x3;
    /**
     * Multiply this Matrix3x3 with another Matrix3x3
     * @param {Matrix3x3} m
     * @returns {Matrix3x3}
     */
    multiply(m: Matrix3x3): Matrix3x3;
    /**
     * Multiply 2 Matrix3x3 and set the result to this Matrix3x3
     * @param {Matrix3x3} a
     * @param {Matrix3x3} b
     * @returns {Matrix3x3}
     */
    multiplyMatrices(a: Matrix3x3, b: Matrix3x3): Matrix3x3;
    /**
     * Transpose this Matrix3x3 (swap off-diagonal elements)
     * @returns {Matrix3x3}
     */
    transpose(): Matrix3x3;
    /**
     * Invert this Matrix3x3
     * @returns {Matrix3x3}
     */
    invert(): Matrix3x3;
    scale(v: any): Matrix3x3;
    rotateX(angle: any): Matrix3x3;
    rotateY(angle: any): Matrix3x3;
    rotateZ(angle: any): Matrix3x3;
    determinant(): number;
    applyToVector3(v: any): any;
    fromQuaternion(q: any): Vector3;
    /**
     * Set this Matrix3x3 from a scaling Vector3
     * s.x   0   0
     *   0 s.y   0
     *   0   0 s.z
     * @param {Vector3} s
     * @returns {Matrix3x3}
     */
    fromScaling(s: Vector3): Matrix3x3;
    fromEuler(x: any, y: any, z: any): Vector3;
    fromNormalMatrix(matrix4x4: any): Matrix3x3;
    toArray(): number[];
    fromArray(arr: any, offset?: number): this;
    equals(m: any, epsilon?: number): boolean;
}
import { Vector3 } from './Vector3.js';
