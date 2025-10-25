import { Matrix4x4 } from './matrix4x4.js';
import { Vector3 } from './vector3.js';

/**
 * Class representing a quaternion
 */
export class Quaternion {
  /**
   * Create a quaternion
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.elements = new Float32Array([x, y, z, w]);
    this._onChange = null;
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
  get w() {
    return this.elements[3];
  }

  set x(v) {
    this.elements[0] = v;
    this._onChange?.();
  }
  set y(v) {
    this.elements[1] = v;
    this._onChange?.();
  }
  set z(v) {
    this.elements[2] = v;
    this._onChange?.();
  }
  set w(v) {
    this.elements[3] = v;
    this._onChange?.();
  }

  /**
   * Set the x, y, z, w values
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Quaternion}
   */
  set(x, y, z, w) {
    const e = this.elements;
    e[0] = x;
    e[1] = y;
    e[2] = z;
    e[3] = w;
    this._onChange?.();
    return this;
  }

  /**
   * Set the onChange callback for this Quaternion
   * @param {function} callback
   * @returns {Quaternion}
   */
  onChange(callback) {
    this._onChange = callback;
    return this;
  }

  /**
   * Copy the value of another Quaternion into this Quaternion
   * @param {Quaternion} q
   * @returns {Quaternion}
   */
  copy(q) {
    this.elements.set(q.elements);
    this._onChange?.();
    return this;
  }

  /**
   * Create a clone of this Quaternion
   * @returns {Quaternion}
   */
  clone() {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  /**
   * Set this Quaternion to identity [0, 0, 0, 1]
   * @returns {Quaternion}
   */
  identity() {
    return this.set(0, 0, 0, 1);
  }

  /**
   * Conjugate this Quaternion (negate the imaginary vector [x, y, z])
   * @returns {Quaternion}
   */
  conjugate() {
    const e = this.elements;
    e[0] = -e[0];
    e[1] = -e[1];
    e[2] = -e[2];
    this._onChange?.();
    return this;
  }

  /**
   * Negate this Quaternion
   * @returns {Quaternion}
   */
  negate() {
    const e = this.elements;
    e[0] = -e[0];
    e[1] = -e[1];
    e[2] = -e[2];
    e[3] = -e[3];
    this._onChange?.();
    return this;
  }

  /**
   * Calculate the length squared of this Quaternion
   * @returns {number}
   */
  lengthSq() {
    const e = this.elements;
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3];
  }

  /**
   * Calculate the length of this Quaternion
   * @returns {number}
   */
  length() {
    return Math.sqrt(this.lengthSq());
  }

  /**
   * Dot product of this Quaternion and another Quaternion
   * @param {Quaternion} q
   * @returns {number}
   */
  dot(q) {
    const te = this.elements,
      qe = q.elements;
    return te[0] * qe[0] + te[1] * qe[1] + te[2] * qe[2] + te[3] * qe[3];
  }

  /**
   * Normalize this Quaternion
   * [0, 0, 0, 0] remains unchanged
   * @returns {Quaternion}
   */
  normalize() {
    const len = this.length();
    if (len > 0) {
      const inv = 1 / len;
      const e = this.elements;
      e[0] *= inv;
      e[1] *= inv;
      e[2] *= inv;
      e[3] *= inv;
      this._onChange?.();
    }
    return this;
  }

  /**
   * Invert this Quaternion
   * [0, 0, 0, 0] remains unchanged
   * @returns {Quaternion}
   */
  invert() {
    const e = this.elements;
    const lengthSq = this.lengthSq();
    if (lengthSq > 0) {
      const inv = 1 / lengthSq;
      e[0] = -e[0] * inv;
      e[1] = -e[1] * inv;
      e[2] = -e[2] * inv;
      e[3] = e[3] * inv;
      this._onChange?.();
    }
    return this;
  }

  /**
   * Multiply this Quaternion by another Quaternion
   * @param {Quaternion} q
   * @returns {Quaternion}
   */
  multiply(q) {
    const ae = this.elements;
    const be = q.elements;

    const ax = ae[0],
      ay = ae[1],
      az = ae[2],
      aw = ae[3];
    const bx = be[0],
      by = be[1],
      bz = be[2],
      bw = be[3];

    ae[0] = aw * bx + ax * bw + ay * bz - az * by;
    ae[1] = aw * by - ax * bz + ay * bw + az * bx;
    ae[2] = aw * bz + ax * by - ay * bx + az * bw;
    ae[3] = aw * bw - ax * bx - ay * by - az * bz;
    this._onChange?.();
    return this;
  }

  /**
   * Set this Quaternion to the result of the multiplication of two Quaternions
   * @param {Quaternion} a
   * @param {Quaternion} b
   * @returns {Quaternion}
   */
  multiplyQuaternions(a, b) {
    // this = a * b
    const ae = a.elements;
    const be = b.elements;
    const e = this.elements;

    const ax = ae[0],
      ay = ae[1],
      az = ae[2],
      aw = ae[3];
    const bx = be[0],
      by = be[1],
      bz = be[2],
      bw = be[3];

    e[0] = aw * bx + ax * bw + ay * bz - az * by;
    e[1] = aw * by - ax * bz + ay * bw + az * bx;
    e[2] = aw * bz + ax * by - ay * bx + az * bw;
    e[3] = aw * bw - ax * bx - ay * by - az * bz;
    this._onChange?.();
    return this;
  }

  /**
   * Rotate a Vector3 by the rotation defined by this Quaternion
   * The Quaternion is expected to be normalized
   * @param {Vector3} v
   * @returns {Vector3}
   */
  rotateVector3(v) {
    const x = v.x,
      y = v.y,
      z = v.z;
    const qx = this.x,
      qy = this.y,
      qz = this.z,
      qw = this.w;

    // calculate quat * vector
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    v.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    v.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    v.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return v;
  }

  /**
   * Interpolates this Quaternion with shortest, constant-angular-velocity rotation to another Quaternion
   * SLERP: spherical linear interpolation
   * Both Quaternions must be normalized
   * @param {Quaternion} qb The other Quaternion (normalized)
   * @param {number} t Ratio (0..1)
   * @returns {Quaternion}
   */
  slerp(qb, t) {
    const qa = this;
    const e = qa.elements;
    const eb = qb.elements;

    let cosHalfTheta =
      e[0] * eb[0] + e[1] * eb[1] + e[2] * eb[2] + e[3] * eb[3];

    let bx = eb[0],
      by = eb[1],
      bz = eb[2],
      bw = eb[3];
    if (cosHalfTheta < 0) {
      cosHalfTheta = -cosHalfTheta;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }

    if (cosHalfTheta >= 1.0) return this;

    const halfTheta = Math.acos(cosHalfTheta);
    const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
      e[0] = e[0] * (1 - t) + bx * t;
      e[1] = e[1] * (1 - t) + by * t;
      e[2] = e[2] * (1 - t) + bz * t;
      e[3] = e[3] * (1 - t) + bw * t;
      this._onChange?.();
      return this.normalize();
    }

    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    e[0] = e[0] * ratioA + bx * ratioB;
    e[1] = e[1] * ratioA + by * ratioB;
    e[2] = e[2] * ratioA + bz * ratioB;
    e[3] = e[3] * ratioA + bw * ratioB;
    this._onChange?.();
    return this;
  }

  /**
   * Set this Quaternion to a rotation Quaternion defined by an axis vector and an angle
   * The axis vector is expected to be normalized
   * @param {Vector3} axis
   * @param {number} angle in radians
   * @returns {Quaternion}
   */
  setFromAxisAngle(axis, angle) {
    const half = angle * 0.5;
    const s = Math.sin(half);
    this.set(axis.x * s, axis.y * s, axis.z * s, Math.cos(half));
    return this.normalize();
  }

  /**
   * Extracts axis and angle from this Quaternion
   * @returns {object} {axis: Vector3, angle: number}
   */
  toAxisAngle() {
    if (this.w > 1) this.normalize();
    const angle = 2 * Math.acos(this.w);
    const s = Math.sqrt(1 - this.w * this.w);
    if (s < 0.001) return { axis: new Vector3(1, 0, 0), angle };
    return { axis: new Vector3(this.x / s, this.y / s, this.z / s), angle };
  }

  /**
   * Set quaternion from intrinsic XYZ Euler rotation (rotate around local X, then Y, then Z).
   * @param {number} x rotation around X (radians)
   * @param {number} y rotation around Y (radians)
   * @param {number} z rotation around Z (radians)
   * @returns {Quaternion}
   */
  setFromEuler(x, y, z) {
    const c1 = Math.cos(x / 2),
      c2 = Math.cos(y / 2),
      c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2),
      s2 = Math.sin(y / 2),
      s3 = Math.sin(z / 2);

    this.set(
      s1 * c2 * c3 + c1 * s2 * s3,
      c1 * s2 * c3 - s1 * c2 * s3,
      c1 * c2 * s3 + s1 * s2 * c3,
      c1 * c2 * c3 - s1 * s2 * s3
    );
    return this.normalize();
  }

  /**
   * Sets this Quaternion from a rotation Matrix4x4
   * @param {Matrix4x4} m
   * @returns {Quaternion}
   */
  setFromRotationMatrix(m) {
    const te = m.elements;
    const m11 = te[0],
      m12 = te[4],
      m13 = te[8];
    const m21 = te[1],
      m22 = te[5],
      m23 = te[9];
    const m31 = te[2],
      m32 = te[6],
      m33 = te[10];

    const trace = m11 + m22 + m33;
    let s;

    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1.0);
      this.w = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
      this.w = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
    } else if (m22 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
      this.w = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
    } else {
      s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
      this.w = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
    }

    return this.normalize();
  }

  /**
   * Returns the x, y, z, w values in an array
   * @returns {Quaternion}
   */
  toArray() {
    return Array.from(this.elements);
  }

  /**
   * Sets this Quaternion from 4 subsequent elements of an array starting at an offset which defaults to 0
   * @param {Array} arr
   * @param {number} offset
   * @returns {Quaternion}
   */
  setFromArray(arr, offset = 0) {
    const e = this.elements;
    e[0] = arr[offset];
    e[1] = arr[offset + 1];
    e[2] = arr[offset + 2];
    e[3] = arr[offset + 3];
    this._onChange?.();
    return this;
  }

  /**
   * Compares two Quaternions for equality down to a certain precision
   * @param {Quaternion} q
   * @param {number} epsilon
   * @returns {boolean}
   */
  equals(q, epsilon = 1e-6) {
    const e = this.elements,
      f = q.elements;
    return (
      Math.abs(e[0] - f[0]) < epsilon &&
      Math.abs(e[1] - f[1]) < epsilon &&
      Math.abs(e[2] - f[2]) < epsilon &&
      Math.abs(e[3] - f[3]) < epsilon
    );
  }

  /**
   * Create a new identity Quaternion
   * @returns {Quaternion}
   */
  static identity() {
    return new Quaternion(0, 0, 0, 1);
  }

  /**
   * Create a new rotation Quaternion defined by an axis vector and an angle
   * The axis vector is expected to be normalized
   * @param {Vector3} axis
   * @param {number} angle in radians
   * @returns {Quaternion}
   */
  static fromAxisAngle(axis, angle) {
    return new Quaternion().setFromAxisAngle(axis, angle);
  }

  /**
   * Create a new rotation Quaternion from Euler angles
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Quaternion}
   */
  static fromEuler(x, y, z) {
    return new Quaternion().setFromEuler(x, y, z);
  }
}
