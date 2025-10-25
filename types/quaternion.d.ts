/**
 * Class representing a quaternion
 */
export class Quaternion {
    /**
     *
     * @param {Quaternion} a
     * @param {Quaternion} b
     * @param {Quaternion} out
     */
    static multiplyQuaternions(a: Quaternion, b: Quaternion, out?: Quaternion): void;
    /**
     * Create a new identity Quaternion
     * @returns {Quaternion}
     */
    static identity(): Quaternion;
    /**
     * Create a new rotation Quaternion defined by an axis vector and an angle
     * The axis vector is expected to be normalized
     * @param {Vector3} axis
     * @param {number} angle in radians
     * @returns {Quaternion}
     */
    static fromAxisAngle(axis: Vector3, angle: number): Quaternion;
    /**
     * Create a new rotation Quaternion from Euler angles
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Quaternion}
     */
    static fromEuler(x: number, y: number, z: number): Quaternion;
    /**
     * Create a quaternion
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     */
    constructor(x?: number, y?: number, z?: number, w?: number);
    elements: Float32Array<ArrayBuffer>;
    _onChange: any;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set z(v: number);
    get z(): number;
    set w(v: number);
    get w(): number;
    /**
     * Set the x, y, z, w values
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     * @returns {Quaternion}
     */
    set(x: number, y: number, z: number, w: number): Quaternion;
    onChange(callback: any): this;
    /**
     * Copy the value of another Quaternion into this Quaternion
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    copy(q: Quaternion): Quaternion;
    /**
     * Create a clone of this Quaternion
     * @returns {Quaternion}
     */
    clone(): Quaternion;
    /**
     * Set this Quaternion to identity [0, 0, 0, 1]
     * @returns {Quaternion}
     */
    identity(): Quaternion;
    /**
     * Conjugate this Quaternion (negate the imaginary vector [x, y, z])
     * @returns {Quaternion}
     */
    conjugate(): Quaternion;
    negate(): this;
    /**
     * Calculate the length squared of this Quaternion
     * @returns {number}
     */
    lengthSq(): number;
    /**
     * Calculate the length of this Quaternion
     * @returns {number}
     */
    length(): number;
    /**
     * Dot product of this Quaternion and another Quaternion
     * @param {Quaternion} q
     * @returns {number}
     */
    dot(q: Quaternion): number;
    /**
     * Normalize this Quaternion
     * [0, 0, 0, 0] remains unchanged
     * @returns {Quaternion}
     */
    normalize(): Quaternion;
    /**
     * Invert this Quaternion
     * [0, 0, 0, 0] remains unchanged
     * @returns {Quaternion}
     */
    invert(): Quaternion;
    /**
     * Multiply this Quaternion by another Quaternion
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    multiply(q: Quaternion): Quaternion;
    /**
     * Set this Quaternion to the result of the multiplication of two Quaternions
     * @param {Quaternion} a
     * @param {Quaternion} b
     * @returns {Quaternion}
     */
    multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion;
    /**
     * Rotate a Vector3 by the rotation defined by this Quaternion
     * The Quaternion is expected to be normalized
     * @param {Vector3} v
     * @returns {Vector3}
     */
    rotateVector3(v: Vector3): Vector3;
    /**
     * Interpolates this Quaternion with shortest, constant-angular-velocity rotation to another Quaternion
     * SLERP: spherical linear interpolation
     * Both Quaternions must be normalized
     * @param {Quaternion} qb The other Quaternion (normalized)
     * @param {number} t Ratio (0..1)
     * @returns {Quaternion}
     */
    slerp(qb: Quaternion, t: number): Quaternion;
    /**
     * Set this Quaternion to a rotation Quaternion defined by an axis vector and an angle
     * The axis vector is expected to be normalized
     * @param {Vector3} axis
     * @param {number} angle in radians
     * @returns {Quaternion}
     */
    setFromAxisAngle(axis: Vector3, angle: number): Quaternion;
    toAxisAngle(): {
        axis: Vector3;
        angle: number;
    };
    /**
     * Set quaternion from intrinsic XYZ Euler rotation (rotate around local X, then Y, then Z).
     * @param {number} x rotation around X (radians)
     * @param {number} y rotation around Y (radians)
     * @param {number} z rotation around Z (radians)
     * @returns {Quaternion}
     */
    setFromEuler(x: number, y: number, z: number): Quaternion;
    setFromRotationMatrix(m: any): Quaternion;
    toArray(): number[];
    setFromArray(arr: any, offset?: number): this;
    equals(q: any, epsilon?: number): boolean;
}
import { Vector3 } from './vector3.js';
