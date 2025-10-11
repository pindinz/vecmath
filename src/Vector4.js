// src/Vector4.js
export class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.elements = new Float32Array([x, y, z, w]);
  }

  // --- Accessors ---
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
  }
  set y(v) {
    this.elements[1] = v;
  }
  set z(v) {
    this.elements[2] = v;
  }
  set w(v) {
    this.elements[3] = v;
  }

  // --- Basic operations ---
  set(x, y, z, w) {
    const e = this.elements;
    e[0] = x;
    e[1] = y;
    e[2] = z;
    e[3] = w;
    return this;
  }

  copy(v) {
    this.elements.set(v.elements);
    return this;
  }

  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  add(v) {
    const e = this.elements,
      f = v.elements;
    e[0] += f[0];
    e[1] += f[1];
    e[2] += f[2];
    e[3] += f[3];
    return this;
  }

  sub(v) {
    const e = this.elements,
      f = v.elements;
    e[0] -= f[0];
    e[1] -= f[1];
    e[2] -= f[2];
    e[3] -= f[3];
    return this;
  }

  multiplyScalar(s) {
    const e = this.elements;
    e[0] *= s;
    e[1] *= s;
    e[2] *= s;
    e[3] *= s;
    return this;
  }

  divideScalar(s) {
    const inv = 1 / s;
    const e = this.elements;
    e[0] *= inv;
    e[1] *= inv;
    e[2] *= inv;
    e[3] *= inv;
    return this;
  }

  // --- Dot product ---
  dot(v) {
    const e = this.elements,
      f = v.elements;
    return e[0] * f[0] + e[1] * f[1] + e[2] * f[2] + e[3] * f[3];
  }

  // --- Length operations ---
  lengthSq() {
    const e = this.elements;
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3];
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    const len = this.length();
    if (len > 0) this.divideScalar(len);
    return this;
  }

  negate() {
    const e = this.elements;
    e[0] = -e[0];
    e[1] = -e[1];
    e[2] = -e[2];
    e[3] = -e[3];
    return this;
  }

  applyMatrix4(m) {
    const e = m.elements;
    const x = this.x,
      y = this.y,
      z = this.z,
      w = this.w;
    this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
    return this;
  }

  // --- Utilities ---
  equals(v, epsilon = 1e-6) {
    const e = this.elements,
      f = v.elements;
    return (
      Math.abs(e[0] - f[0]) < epsilon &&
      Math.abs(e[1] - f[1]) < epsilon &&
      Math.abs(e[2] - f[2]) < epsilon &&
      Math.abs(e[3] - f[3]) < epsilon
    );
  }

  toArray() {
    return Array.from(this.elements);
  }

  fromArray(arr, offset = 0) {
    const e = this.elements;
    e[0] = arr[offset];
    e[1] = arr[offset + 1];
    e[2] = arr[offset + 2];
    e[3] = arr[offset + 3];
    return this;
  }

  // --- Static constructors ---
  static zero() {
    return new Vector4(0, 0, 0, 0);
  }
  static one() {
    return new Vector4(1, 1, 1, 1);
  }
  static unitX() {
    return new Vector4(1, 0, 0, 0);
  }
  static unitY() {
    return new Vector4(0, 1, 0, 0);
  }
  static unitZ() {
    return new Vector4(0, 0, 1, 0);
  }
  static unitW() {
    return new Vector4(0, 0, 0, 1);
  }
}
