/**
 * Class representing a 4x4 matrix
 * The elements are stored in a Float32Array in column-major order
 */
export class Matrix4x4 {
    constructor(n11?: number, n12?: number, n13?: number, n14?: number, n21?: number, n22?: number, n23?: number, n24?: number, n31?: number, n32?: number, n33?: number, n34?: number, n41?: number, n42?: number, n43?: number, n44?: number);
    _scratch: {
        colX: Vector3;
        colY: Vector3;
        colZ: Vector3;
        tmpV: Vector3;
        tmpM: any;
    } | null;
    elements: Float32Array<ArrayBuffer>;
    /**
     * Set the elements of this Matrix4x4
     * The parameters are in row-major order.
     * n11 n12 n13 n14
     * n21 n22 n23 n24
     * n31 n32 n33 n34
     * n41 n42 n43 n44
     * @param {number} n11
     * @param {number} n12
     * @param {number} n13
     * @param {number} n14
     * @param {number} n21
     * @param {number} n22
     * @param {number} n23
     * @param {number} n24
     * @param {number} n31
     * @param {number} n32
     * @param {number} n33
     * @param {number} n34
     * @param {number} n41
     * @param {number} n42
     * @param {number} n43
     * @param {number} n44
     * @returns {Matrix4x4}
     */
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): Matrix4x4;
    copy(m: any): this;
    clone(): Matrix4x4;
    identity(): Matrix4x4;
    /**
     * Multiply this Matrix4x4 by another Matrix4x4
     * this × m
     * @param {Matrix4x4} m
     * @returns {Matrix4x4}
     */
    multiply(m: Matrix4x4): Matrix4x4;
    /**
     * Set this Matrix4x4 to the matrix multiplication of two Matrix4x4s
     * this = a × b
     * @param {Matrix4x4} a
     * @param {Matrix4x4} b
     * @returns {Matrix4x4}
     */
    multiplyMatrices(a: Matrix4x4, b: Matrix4x4): Matrix4x4;
    /**
     *
     * @param {Vector3} position
     * @param {Quaternion} quaternion
     * @param {Vector3} scale
     * @returns {Matrix4x4}
     */
    compose(position: Vector3, quaternion: Quaternion, scale: Vector3): Matrix4x4;
    decompose(position: any, quaternion: any, scale: any): this;
    /**
     * Transpose this Matrix4x4
     * @returns {Matrix4x4}
     */
    transpose(): Matrix4x4;
    /**
     * Calculate the determinant of this Matrix4x4
     * @returns {number}
     */
    determinant(): number;
    /**
     * Invert this Matrix4x4
     * @returns {Matrix4x4}
     */
    invert(): Matrix4x4;
    applyToVector3(v: any): Vector3;
    applyToVector4(v: any): Vector4;
    equals(m: any, epsilon?: number): boolean;
    toArray(): number[];
    translate(v: any): Matrix4x4;
    scale(v: any): Matrix4x4;
    rotateQuaternion(q: any): Matrix4x4;
    lookAt(eye: any, target: any, up: any): Matrix4x4;
    setFromTranslation(v: any): Matrix4x4;
    setFromScaling(v: any): Matrix4x4;
    setFromRotationQuaternion(q: any): Matrix4x4;
    setFromPerspective(fov: any, aspect: any, near: any, far: any): this;
    setFromOrtho(left: any, right: any, bottom: any, top: any, near: any, far: any): Matrix4x4;
    setFromLookAt(eye: any, target: any, up: any): this;
    setFromEuler(x: any, y: any, z: any): Matrix4x4;
}
import { Vector3 } from './Vector3.js';
import { Quaternion } from './Quaternion.js';
import { Vector4 } from './Vector4.js';
