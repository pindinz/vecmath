// src/Quaternion.js
import { Vector3 } from './vector3.js';

export class Quaternion {
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

  copy(q) {
    this.elements.set(q.elements);
    return this;
  }

  clone() {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  identity() {
    return this.set(0, 0, 0, 1);
  }

  conjugate() {
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    this.elements[2] = -this.elements[2];
    return this;
  }

  lengthSq() {
    const e = this.elements;
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3];
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    const len = this.length();
    if (len > 0) {
      const inv = 1 / len;
      const e = this.elements;
      e[0] *= inv;
      e[1] *= inv;
      e[2] *= inv;
      e[3] *= inv;
    }
    return this;
  }

  invert() {
    const e = this.elements;
    const lengthSq = this.lengthSq();
    if (lengthSq > 0) {
      const inv = 1 / lengthSq;
      e[0] = -e[0] * inv;
      e[1] = -e[1] * inv;
      e[2] = -e[2] * inv;
      e[3] = e[3] * inv;
    }
    return this;
  }

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
    return this;
  }

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
    return this;
  }

  // --- Rotate a Vector3 ---
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

  // --- Interpolation ---
  slerp(qb, t) {
    const qa = this;
    const e = qa.elements;
    const eb = qb.elements;

    let cosHalfTheta =
      e[0] * eb[0] + e[1] * eb[1] + e[2] * eb[2] + e[3] * eb[3];

    if (cosHalfTheta < 0) {
      eb[0] = -eb[0];
      eb[1] = -eb[1];
      eb[2] = -eb[2];
      eb[3] = -eb[3];
      cosHalfTheta = -cosHalfTheta;
    }

    if (cosHalfTheta >= 1.0) return this;

    const halfTheta = Math.acos(cosHalfTheta);
    const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
      e[0] = 0.5 * (e[0] + eb[0]);
      e[1] = 0.5 * (e[1] + eb[1]);
      e[2] = 0.5 * (e[2] + eb[2]);
      e[3] = 0.5 * (e[3] + eb[3]);
      return this;
    }

    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    e[0] = e[0] * ratioA + eb[0] * ratioB;
    e[1] = e[1] * ratioA + eb[1] * ratioB;
    e[2] = e[2] * ratioA + eb[2] * ratioB;
    e[3] = e[3] * ratioA + eb[3] * ratioB;
    return this;
  }

  // --- From / To Representations ---
  fromAxisAngle(axis, angle) {
    const half = angle * 0.5;
    const s = Math.sin(half);
    this.set(axis.x * s, axis.y * s, axis.z * s, Math.cos(half));
    return this.normalize();
  }

  toAxisAngle() {
    if (this.w > 1) this.normalize();
    const angle = 2 * Math.acos(this.w);
    const s = Math.sqrt(1 - this.w * this.w);
    if (s < 0.001) return { axis: new Vector3(1, 0, 0), angle };
    return { axis: new Vector3(this.x / s, this.y / s, this.z / s), angle };
  }

  fromEuler(x, y, z) {
    // intrinsic XYZ rotation
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

  // --- Static constructors ---
  static identity() {
    return new Quaternion(0, 0, 0, 1);
  }
  static fromAxisAngle(axis, angle) {
    return new Quaternion().fromAxisAngle(axis, angle);
  }
  static fromEuler(x, y, z) {
    return new Quaternion().fromEuler(x, y, z);
  }
}
