/**
 * Class representing a vector in 3D space
 */
export class Vector3 {
  /**
   * Create a Vector3
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(x = 0, y = 0, z = 0) {
    this.elements = new Float32Array([x, y, z]);
  }

  get x() {
    return this.elements[0];
  }
  get y() {
    return this.elements[1];
  }
  get z() {
    return this.elements[2];
  }

  set x(v) {
    this.elements[0] = v;
  }
  set y(v) {
    this.elements[1] = v;
  }
  set z(v) {
    this.elements[2] = v;
  }

  /**
   * Set the x, y, z values
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns
   */
  set(x, y, z) {
    this.elements[0] = x;
    this.elements[1] = y;
    this.elements[2] = z;
    return this;
  }

  /**
   * Copy the value of another Vector3 into this Vector3
   * @param {Vector3} v
   * @returns {Vector3}
   */
  copy(v) {
    this.elements.set(v.elements);
    return this;
  }

  /**
   * Create a clone of this Vector3
   * @returns {Vector3}
   */
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Add another Vector3 to this Vector3
   * a + b
   * @param {Vector3} v
   * @returns {Vector3}
   */
  add(v) {
    this.elements[0] += v.elements[0];
    this.elements[1] += v.elements[1];
    this.elements[2] += v.elements[2];
    return this;
  }

  /**
   * Subtract another Vector3 from this Vector3
   * a - b
   * @param {Vector3} v
   * @returns {Vector3}
   */
  sub(v) {
    this.elements[0] -= v.elements[0];
    this.elements[1] -= v.elements[1];
    this.elements[2] -= v.elements[2];
    return this;
  }

  /**
   * Scale (multiply) this Vector3 by a factor
   * s * v
   * @param {Vector3} s
   * @returns {Vector3}
   */
  multiplyScalar(s) {
    this.elements[0] *= s;
    this.elements[1] *= s;
    this.elements[2] *= s;
    return this;
  }

  /**
   * Scale (divide) this Vector3 by a factor
   * 1/s * v
   * @param {Vector3} s
   * @returns {Vector3}
   */
  divideScalar(s) {
    const inv = 1 / s;
    this.elements[0] *= inv;
    this.elements[1] *= inv;
    this.elements[2] *= inv;
    return this;
  }

  /**
   * Calculate the dot product of this Vector3 and another Vector3
   * a ⋅ b
   * @param {Vector3} v
   * @returns {number}
   */
  dot(v) {
    const e = this.elements;
    const f = v.elements;
    return e[0] * f[0] + e[1] * f[1] + e[2] * f[2];
  }

  /**
   * Multiply (cross product) this Vector3 by another Vector3
   * a × b
   * @param {Vector3} v
   * @returns {Vector3}
   */
  cross(v) {
    const ax = this.x,
      ay = this.y,
      az = this.z;
    const bx = v.x,
      by = v.y,
      bz = v.z;
    this.elements[0] = ay * bz - az * by;
    this.elements[1] = az * bx - ax * bz;
    this.elements[2] = ax * by - ay * bx;
    return this;
  }

  /**
   * Calculate the length squared of this Vector3
   * @returns {number}
   */
  lengthSq() {
    const e = this.elements;
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
  }

  /**
   * Calculate the length of this Vector3
   * @returns {number}
   */
  length() {
    return Math.sqrt(this.lengthSq());
  }

  /**
   * Normalize this Vector3
   * [0, 0, 0] remains unchanged.
   * @returns {Vector3}
   */
  normalize() {
    const len = this.length();
    if (len > 0) this.divideScalar(len);
    return this;
  }

  /**
   * Calculate the distance from this Vector3 to another Vector3
   * @param {Vector3} v
   * @returns {number}
   */
  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  }

  /**
   * Calculate the distance squared from this Vector3 to another Vector3
   * @param {Vector3} v
   * @returns {number}
   */
  distanceToSquared(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * Negate this Vector3
   * @returns {Vector3}
   */
  negate() {
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    this.elements[2] = -this.elements[2];
    return this;
  }

  /**
   * Transform this Vector3 using a Matrix4x4
   * @param {Matrix4x4} m
   * @returns {Vector3}
   */
  applyMatrix4(m) {
    const e = m.elements;
    const x = this.x,
      y = this.y,
      z = this.z;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    return this;
  }

  /**
   * Determine whether a Vector3 is equal to this Vector3, down to a given precision epsilon.
   * @param {Vector3} v
   * @param {number} epsilon (optional, default = 1e-6)
   * @returns {boolean}
   */
  equals(v, epsilon = 1e-6) {
    return (
      Math.abs(this.x - v.x) < epsilon &&
      Math.abs(this.y - v.y) < epsilon &&
      Math.abs(this.z - v.z) < epsilon
    );
  }

  /**
   * Create an Array that contains the x, y, and z values as elements
   * @returns {Array<number>}
   */
  toArray() {
    return [this.x, this.y, this.z];
  }

  /**
   * Set this Vector3 from values in an array at a given offset
   * @param {Array<number>} arr
   * @param {number} offset (optional, default = 0)
   * @returns
   */
  fromArray(arr, offset = 0) {
    this.elements[0] = arr[offset];
    this.elements[1] = arr[offset + 1];
    this.elements[2] = arr[offset + 2];
    return this;
  }

  /**
   * Create a [0, 0, 0] Vector3
   * @returns {Vector3}
   */
  static zero() {
    return new Vector3(0, 0, 0);
  }

  /**
   * Create a [1, 1, 1] Vector3
   * @returns {Vector3}
   */
  static one() {
    return new Vector3(1, 1, 1);
  }

  /**
   * Create a [1, 0, 0] Vector3
   * @returns {Vector3}
   */
  static right() {
    return new Vector3(1, 0, 0);
  }

  /**
   * Create a [-1, 0, 0] Vector3
   * @returns {Vector3}
   */
  static left() {
    return new Vector3(-1, 0, 0);
  }

  /**
   * Create a [0, 0, 1] Vector3
   * @returns {Vector3}
   */
  static up() {
    return new Vector3(0, 0, 1);
  }

  /**
   * Create a [0, 0, -1] Vector3
   * @returns {Vector3}
   */
  static down() {
    return new Vector3(0, 0, -1);
  }

  /**
   * Create a [0, 1, 0] Vector3
   * @returns {Vector3}
   */
  static forward() {
    return new Vector3(0, 1, 0);
  }

  /**
   * Create a [0, -1, 0] Vector3
   * @returns {Vector3}
   */
  static backward() {
    return new Vector3(0, -1, 0);
  }
}
