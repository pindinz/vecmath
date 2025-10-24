import { Quaternion } from './quaternion.js';
import { Vector3 } from './vector3.js';
import { Vector4 } from './vector4.js';

/**
 * Class representing a 4x4 matrix
 * The elements are stored in a Float32Array in column-major order
 */
export class Matrix4x4 {
  constructor(
    n11 = 1,
    n12 = 0,
    n13 = 0,
    n14 = 0,
    n21 = 0,
    n22 = 1,
    n23 = 0,
    n24 = 0,
    n31 = 0,
    n32 = 0,
    n33 = 1,
    n34 = 0,
    n41 = 0,
    n42 = 0,
    n43 = 0,
    n44 = 1
  ) {
    this.elements = new Float32Array(16);
    this.set(
      n11,
      n12,
      n13,
      n14,
      n21,
      n22,
      n23,
      n24,
      n31,
      n32,
      n33,
      n34,
      n41,
      n42,
      n43,
      n44
    );
  }

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
  set(
    n11,
    n12,
    n13,
    n14,
    n21,
    n22,
    n23,
    n24,
    n31,
    n32,
    n33,
    n34,
    n41,
    n42,
    n43,
    n44
  ) {
    const e = this.elements;
    // column-major storage
    e[0] = n11;
    e[4] = n12;
    e[8] = n13;
    e[12] = n14;
    e[1] = n21;
    e[5] = n22;
    e[9] = n23;
    e[13] = n24;
    e[2] = n31;
    e[6] = n32;
    e[10] = n33;
    e[14] = n34;
    e[3] = n41;
    e[7] = n42;
    e[11] = n43;
    e[15] = n44;
    return this;
  }

  copy(m) {
    this.elements.set(m.elements);
    return this;
  }

  clone() {
    const m = new Matrix4x4();
    m.copy(this);
    return m;
  }

  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  /**
   * Multiply this Matrix4x4 by another Matrix4x4
   * this × m
   * @param {Matrix4x4} m
   * @returns {Matrix4x4}
   */
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }

  /**
   * Set this Matrix4x4 to the matrix multiplication of two Matrix4x4s
   * this = a × b
   * @param {Matrix4x4} a
   * @param {Matrix4x4} b
   * @returns {Matrix4x4}
   */
  multiplyMatrices(a, b) {
    const ae = a.elements,
      be = b.elements,
      te = this.elements;

    const a00 = ae[0],
      a01 = ae[4],
      a02 = ae[8],
      a03 = ae[12];
    const a10 = ae[1],
      a11 = ae[5],
      a12 = ae[9],
      a13 = ae[13];
    const a20 = ae[2],
      a21 = ae[6],
      a22 = ae[10],
      a23 = ae[14];
    const a30 = ae[3],
      a31 = ae[7],
      a32 = ae[11],
      a33 = ae[15];

    const b00 = be[0],
      b01 = be[4],
      b02 = be[8],
      b03 = be[12];
    const b10 = be[1],
      b11 = be[5],
      b12 = be[9],
      b13 = be[13];
    const b20 = be[2],
      b21 = be[6],
      b22 = be[10],
      b23 = be[14];
    const b30 = be[3],
      b31 = be[7],
      b32 = be[11],
      b33 = be[15];

    te[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    te[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    te[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    te[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

    te[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    te[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    te[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    te[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

    te[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    te[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    te[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    te[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

    te[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    te[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    te[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    te[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  /**
   *
   * @param {Vector3} position
   * @param {Quaternion} quaternion
   * @param {Vector3} scale
   * @returns {Matrix4x4}
   */
  compose(position, quaternion, scale) {
    const te = this.elements;
    const x = quaternion.x,
      y = quaternion.y,
      z = quaternion.z,
      w = quaternion.w;
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

    const sx = scale.x,
      sy = scale.y,
      sz = scale.z;

    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;

    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;

    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;

    te[12] = position.x;
    te[13] = position.y;
    te[14] = position.z;
    te[15] = 1;

    return this;
  }

  decompose(position, quaternion, scale) {
    const te = this.elements;

    // 1) Translation
    position.set(te[12], te[13], te[14]);

    // 2) Extract columns (basis vectors)
    const colX = new Vector3(te[0], te[1], te[2]); // first column
    const colY = new Vector3(te[4], te[5], te[6]); // second column
    const colZ = new Vector3(te[8], te[9], te[10]); // third column

    // 3) Lengths = scales (positive magnitudes)
    // Extract scale safely
    let sx = Math.hypot(te[0], te[1], te[2]);
    let sy = Math.hypot(te[4], te[5], te[6]);
    let sz = Math.hypot(te[8], te[9], te[10]);

    // Avoid divide-by-zero: if one scale is zero, treat inv as 0 to preserve zeros
    // Avoid division by near-zero (degenerate scales)
    const EPS = 1e-12;
    const invSx = sx > EPS ? 1 / sx : 0;
    const invSy = sy > EPS ? 1 / sy : 0;
    const invSz = sz > EPS ? 1 / sz : 0;

    // 4) Normalize columns to get a rotation matrix (still column-major)
    const rx = new Vector3(colX.x * invSx, colX.y * invSx, colX.z * invSx);
    const ry = new Vector3(colY.x * invSy, colY.y * invSy, colY.z * invSy);
    const rz = new Vector3(colZ.x * invSz, colZ.y * invSz, colZ.z * invSz);

    // 5) Compute determinant of rotation part to detect mirroring (handedness)
    // Using cross(x, y) dot z gives determinant sign for right-handed system
    const detSign = rx.clone().cross(ry).dot(rz);

    if (detSign < 0) {
      // Mirror detected. Determine which axis was flipped in the original scale
      // We determine which original column, when negated, makes the basis right-handed.
      // Test flipping X:
      if (rx.clone().negate().cross(ry).dot(rz) > 0) {
        sx = -sx;
        rx.negate();
      }
      // else test flipping Y:
      else if (rx.clone().cross(ry.clone().negate()).dot(rz) > 0) {
        sy = -sy;
        ry.negate();
      }
      // else flip Z:
      else {
        sz = -sz;
        rz.negate();
      }
    }

    // 6) Build a rotation matrix explicitly in column-major order:
    const rot = new Matrix4x4();
    const re = rot.elements;
    // first column = rx
    re[0] = rx.x;
    re[1] = rx.y;
    re[2] = rx.z;
    re[3] = 0;
    // second column = ry
    re[4] = ry.x;
    re[5] = ry.y;
    re[6] = ry.z;
    re[7] = 0;
    // third column = rz
    re[8] = rz.x;
    re[9] = rz.y;
    re[10] = rz.z;
    re[11] = 0;
    // translation / bottom row
    re[12] = 0;
    re[13] = 0;
    re[14] = 0;
    re[15] = 1;

    // 7) Quaternion from rotation matrix (expects column-major)
    quaternion.setFromRotationMatrix(rot);

    /*
te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;

    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;

    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;
    */
    sx = te[0] / (1 - 2 * quaternion.y ** 2 - 2 * quaternion.z ** 2);
    sy = te[5] / (1 - 2 * quaternion.x ** 2 - 2 * quaternion.z ** 2);
    sz = te[10] / (1 - 2 * quaternion.x ** 2 - 2 * quaternion.y ** 2);

    // 8) Set scale (with preserved signs)
    scale.set(sx, sy, sz);

    return this;
  }

  /**
   * Transpose this Matrix4x4
   * @returns {Matrix4x4}
   */
  transpose() {
    const e = this.elements;
    let tmp;
    tmp = e[1];
    e[1] = e[4];
    e[4] = tmp;
    tmp = e[2];
    e[2] = e[8];
    e[8] = tmp;
    tmp = e[3];
    e[3] = e[12];
    e[12] = tmp;
    tmp = e[6];
    e[6] = e[9];
    e[9] = tmp;
    tmp = e[7];
    e[7] = e[13];
    e[13] = tmp;
    tmp = e[11];
    e[11] = e[14];
    e[14] = tmp;
    return this;
  }

  /**
   * Calculate the determinant of this Matrix4x4
   * @returns {number}
   */
  determinant() {
    const te = this.elements;

    const n11 = te[0],
      n12 = te[4],
      n13 = te[8],
      n14 = te[12];
    const n21 = te[1],
      n22 = te[5],
      n23 = te[9],
      n24 = te[13];
    const n31 = te[2],
      n32 = te[6],
      n33 = te[10],
      n34 = te[14];
    const n41 = te[3],
      n42 = te[7],
      n43 = te[11],
      n44 = te[15];

    return (
      n41 *
        (+n14 * n23 * n32 -
          n13 * n24 * n32 -
          n14 * n22 * n33 +
          n12 * n24 * n33 +
          n13 * n22 * n34 -
          n12 * n23 * n34) +
      n42 *
        (+n11 * n23 * n34 -
          n11 * n24 * n33 +
          n14 * n21 * n33 -
          n13 * n21 * n34 +
          n13 * n24 * n31 -
          n14 * n23 * n31) +
      n43 *
        (+n11 * n24 * n32 -
          n11 * n22 * n34 -
          n14 * n21 * n32 +
          n12 * n21 * n34 +
          n14 * n22 * n31 -
          n12 * n24 * n31) +
      n44 *
        (-n13 * n22 * n31 -
          n11 * n23 * n32 +
          n11 * n22 * n33 +
          n13 * n21 * n32 -
          n12 * n21 * n33 +
          n12 * n23 * n31)
    );
  }

  /**
   * Invert this Matrix4x4
   * @returns {Matrix4x4}
   */
  invert() {
    const m = this.elements;
    const inv = new Float32Array(16);

    inv[0] =
      m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10];

    inv[4] =
      -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10];

    inv[8] =
      m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9];

    inv[12] =
      -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9];

    inv[1] =
      -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10];

    inv[5] =
      m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10];

    inv[9] =
      -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9];

    inv[13] =
      m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9];

    inv[2] =
      m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6];

    inv[6] =
      -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6];

    inv[10] =
      m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5];

    inv[14] =
      -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5];

    inv[3] =
      -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6];

    inv[7] =
      m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6];

    inv[11] =
      -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5];

    inv[15] =
      m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5];

    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det === 0) return this.identity();

    det = 1.0 / det;
    for (let i = 0; i < 16; i++) m[i] = inv[i] * det;
    return this;
  }

  // --- Apply to vectors ---
  applyToVector3(v) {
    const e = this.elements;
    const x = v.x,
      y = v.y,
      z = v.z;
    return new Vector3(
      e[0] * x + e[4] * y + e[8] * z + e[12],
      e[1] * x + e[5] * y + e[9] * z + e[13],
      e[2] * x + e[6] * y + e[10] * z + e[14]
    );
  }

  applyToVector4(v) {
    const e = this.elements;
    const x = v.x,
      y = v.y,
      z = v.z,
      w = v.w;
    return new Vector4(
      e[0] * x + e[4] * y + e[8] * z + e[12] * w,
      e[1] * x + e[5] * y + e[9] * z + e[13] * w,
      e[2] * x + e[6] * y + e[10] * z + e[14] * w,
      e[3] * x + e[7] * y + e[11] * z + e[15] * w
    );
  }

  // --- Utilities ---
  equals(m, epsilon = 1e-5) {
    const te = this.elements;
    const me = m.elements;
    for (let i = 0; i < 16; i++)
      if (Math.abs(te[i] - me[i]) > epsilon) return false;
    return true;
  }

  toArray() {
    return Array.from(this.elements);
  }

  // --- Alias methods for convenience and chaining ---
  translate(v) {
    return this.multiply(new Matrix4x4().setFromTranslation(v));
  }

  scale(v) {
    return this.multiply(new Matrix4x4().setFromScaling(v));
  }

  rotateQuaternion(q) {
    return this.multiply(new Matrix4x4().setFromRotationQuaternion(q));
  }

  perspective(fov, aspect, near, far) {
    return this.multiply(
      new Matrix4x4().setFromPerspective(fov, aspect, near, far)
    );
  }

  ortho(left, right, bottom, top, near, far) {
    return this.multiply(
      new Matrix4x4().setFromOrtho(left, right, bottom, top, near, far)
    );
  }

  lookAt(eye, target, up) {
    return this.multiply(new Matrix4x4().setFromLookAt(eye, target, up));
  }

  // --- Convenience constructors ---
  setFromTranslation(v) {
    return this.set(1, 0, 0, v.x, 0, 1, 0, v.y, 0, 0, 1, v.z, 0, 0, 0, 1);
  }

  setFromScaling(v) {
    return this.set(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
  }

  setFromRotationQuaternion(q) {
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
      0,
      xy + wz,
      1 - (xx + zz),
      yz - wx,
      0,
      xz - wy,
      yz + wx,
      1 - (xx + yy),
      0,
      0,
      0,
      0,
      1
    );
  }

  setFromPerspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (far - near);

    return this.set(
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) * nf,
      -1,
      0,
      0,
      2 * far * near * nf,
      0
    );
  }

  setFromOrtho(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right),
      bt = 1 / (bottom - top),
      nf = 1 / (near - far);
    return this.set(
      -2 * lr,
      0,
      0,
      (left + right) * lr,
      0,
      -2 * bt,
      0,
      (top + bottom) * bt,
      0,
      0,
      2 * nf,
      (far + near) * nf,
      0,
      0,
      0,
      1
    );
  }

  setFromLookAt(eye, target, up) {
    const z = eye.clone().sub(target).normalize();
    const x = up.clone().cross(z).normalize();
    const y = z.clone().cross(x).normalize();
    return this.set(
      x.x,
      y.x,
      z.x,
      eye.x,
      x.y,
      y.y,
      z.y,
      eye.y,
      x.z,
      y.z,
      z.z,
      eye.z,
      0,
      0,
      0,
      1
    ).invert(); // LookAt matrix is inverse of camera transform
  }

  // Assumes Euler angles in radians, order XYZ
  setFromEuler(x, y, z) {
    const cx = Math.cos(x),
      sx = Math.sin(x);
    const cy = Math.cos(y),
      sy = Math.sin(y);
    const cz = Math.cos(z),
      sz = Math.sin(z);

    // Rotation order: X -> Y -> Z
    const m00 = cy * cz;
    const m01 = -cy * sz;
    const m02 = sy;
    const m03 = 0;

    const m10 = sx * sy * cz + cx * sz;
    const m11 = -sx * sy * sz + cx * cz;
    const m12 = -sx * cy;
    const m13 = 0;

    const m20 = -cx * sy * cz + sx * sz;
    const m21 = cx * sy * sz + sx * cz;
    const m22 = cx * cy;
    const m23 = 0;

    return this.set(
      m00,
      m01,
      m02,
      m03,
      m10,
      m11,
      m12,
      m13,
      m20,
      m21,
      m22,
      m23,
      0,
      0,
      0,
      1
    );
  }

  static identity() {
    return new Matrix4x4();
  }
}
