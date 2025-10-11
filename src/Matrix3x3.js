// src/Matrix3x3.js
import { Vector3 } from './Vector3.js';
import { Quaternion } from './Quaternion.js';

export class Matrix3x3 {
  constructor() {
    this.elements = new Float32Array(9);
    this.identity();
  }

  // --- Core setup ---
  /**
   * The parameters are in row-major order.
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
  set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
    // store column-major: e[col*3 + row]
    const e = this.elements;
    e[0] = n11;
    e[3] = n12;
    e[6] = n13;
    e[1] = n21;
    e[4] = n22;
    e[7] = n23;
    e[2] = n31;
    e[5] = n32;
    e[8] = n33;
    return this;
  }

  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  copy(m) {
    this.elements.set(m.elements);
    return this;
  }

  clone() {
    const m = new Matrix3x3();
    m.copy(this);
    return m;
  }

  // --- Basic arithmetic ---
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }

  multiplyMatrices(a, b) {
    const ae = a.elements,
      be = b.elements,
      te = this.elements;

    const a11 = ae[0],
      a12 = ae[3],
      a13 = ae[6];
    const a21 = ae[1],
      a22 = ae[4],
      a23 = ae[7];
    const a31 = ae[2],
      a32 = ae[5],
      a33 = ae[8];

    const b11 = be[0],
      b12 = be[3],
      b13 = be[6];
    const b21 = be[1],
      b22 = be[4],
      b23 = be[7];
    const b31 = be[2],
      b32 = be[5],
      b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  transpose() {
    const e = this.elements;
    let tmp;

    // swap off-diagonal elements
    tmp = e[1];
    e[1] = e[3];
    e[3] = tmp; // e[1]=m10, e[3]=m01
    tmp = e[2];
    e[2] = e[6];
    e[6] = tmp; // e[2]=m20, e[6]=m02
    tmp = e[5];
    e[5] = e[7];
    e[7] = tmp; // e[5]=m21, e[7]=m12

    return this;
  }

  invert() {
    const e = this.elements;
    const a00 = e[0],
      a01 = e[1],
      a02 = e[2];
    const a10 = e[3],
      a11 = e[4],
      a12 = e[5];
    const a20 = e[6],
      a21 = e[7],
      a22 = e[8];

    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;

    let det = a00 * b01 + a01 * b11 + a02 * b21;

    if (Math.abs(det) < 1e-10) return this.identity();

    det = 1.0 / det;

    e[0] = b01 * det;
    e[1] = (-a22 * a01 + a02 * a21) * det;
    e[2] = (a12 * a01 - a02 * a11) * det;
    e[3] = b11 * det;
    e[4] = (a22 * a00 - a02 * a20) * det;
    e[5] = (-a12 * a00 + a02 * a10) * det;
    e[6] = b21 * det;
    e[7] = (-a21 * a00 + a01 * a20) * det;
    e[8] = (a11 * a00 - a01 * a10) * det;

    return this;
  }

  determinant() {
    const e = this.elements;
    return (
      e[0] * (e[4] * e[8] - e[5] * e[7]) -
      e[1] * (e[3] * e[8] - e[5] * e[6]) +
      e[2] * (e[3] * e[7] - e[4] * e[6])
    );
  }

  // --- Apply to vector ---
  applyToVector3(v) {
    const e = this.elements;
    const x = v.x,
      y = v.y,
      z = v.z;

    v.x = e[0] * x + e[3] * y + e[6] * z;
    v.y = e[1] * x + e[4] * y + e[7] * z;
    v.z = e[2] * x + e[5] * y + e[8] * z;

    return v;
  }

  // --- Conversions ---
  fromQuaternion(q) {
    const x = q.x,
      y = q.y,
      z = q.z,
      w = q.w;
    const x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    const xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    const yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    const wx = w * x2,
      wy = w * y2,
      wz = w * z2;

    return this.set(
      1 - (yy + zz),
      xy - wz,
      xz + wy,
      xy + wz,
      1 - (xx + zz),
      yz - wx,
      xz - wy,
      yz + wx,
      1 - (xx + yy)
    );
  }

  fromScaling(s) {
    return this.set(s.x, 0, 0, 0, s.y, 0, 0, 0, s.z);
  }

  fromNormalMatrix(matrix4x4) {
    // matrix4x4 is assumed to be column-major
    const me = matrix4x4.elements;
    const out = this.elements;

    out[0] = me[0];
    out[3] = me[4];
    out[6] = me[8];
    out[1] = me[1];
    out[4] = me[5];
    out[7] = me[9];
    out[2] = me[2];
    out[5] = me[6];
    out[8] = me[10];

    return this.invert().transpose();
  }

  toArray() {
    return Array.from(this.elements);
  }

  fromArray(arr, offset = 0) {
    for (let i = 0; i < 9; i++) this.elements[i] = arr[offset + i];
    return this;
  }

  equals(m, epsilon = 1e-5) {
    const e = this.elements;
    const f = m.elements;
    for (let i = 0; i < 9; i++) {
      if (Math.abs(e[i] - f[i]) > epsilon) return false;
    }
    return true;
  }

  // --- Static helpers ---
  static identity() {
    return new Matrix3x3();
  }
  static fromQuaternion(q) {
    return new Matrix3x3().fromQuaternion(q);
  }
  static fromScaling(s) {
    return new Matrix3x3().fromScaling(s);
  }
}
