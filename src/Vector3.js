export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.elements = new Float32Array([x, y, z]);
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

  set x(v) {
    this.elements[0] = v;
  }
  set y(v) {
    this.elements[1] = v;
  }
  set z(v) {
    this.elements[2] = v;
  }

  // --- Basic operations ---
  set(x, y, z) {
    this.elements[0] = x;
    this.elements[1] = y;
    this.elements[2] = z;
    return this;
  }

  copy(v) {
    this.elements.set(v.elements);
    return this;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  add(v) {
    this.elements[0] += v.elements[0];
    this.elements[1] += v.elements[1];
    this.elements[2] += v.elements[2];
    return this;
  }

  sub(v) {
    this.elements[0] -= v.elements[0];
    this.elements[1] -= v.elements[1];
    this.elements[2] -= v.elements[2];
    return this;
  }

  multiplyScalar(s) {
    this.elements[0] *= s;
    this.elements[1] *= s;
    this.elements[2] *= s;
    return this;
  }

  divideScalar(s) {
    const inv = 1 / s;
    this.elements[0] *= inv;
    this.elements[1] *= inv;
    this.elements[2] *= inv;
    return this;
  }

  // --- Dot & Cross ---
  dot(v) {
    const e = this.elements;
    const f = v.elements;
    return e[0] * f[0] + e[1] * f[1] + e[2] * f[2];
  }

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

  // --- Length operations ---
  lengthSq() {
    const e = this.elements;
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    const len = this.length();
    if (len > 0) this.divideScalar(len);
    return this;
  }

  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  negate() {
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    this.elements[2] = -this.elements[2];
    return this;
  }

  applyMatrix4(m){ // Transform using a 4x4 matrix
        const e=m.elements;
        const x=this.x, y=this.y, z=this.z;
        const w = 1/(e[3]*x + e[7]*y + e[11]*z + e[15]);
        this.x = (e[0]*x + e[4]*y + e[8]*z + e[12])*w;
        this.y = (e[1]*x + e[5]*y + e[9]*z + e[13])*w;
        this.z = (e[2]*x + e[6]*y + e[10]*z + e[14])*w;
        return this;
    }

  // --- Utilities ---
  equals(v, epsilon = 1e-6) {
    return (
      Math.abs(this.x - v.x) < epsilon &&
      Math.abs(this.y - v.y) < epsilon &&
      Math.abs(this.z - v.z) < epsilon
    );
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  fromArray(arr, offset = 0) {
    this.elements[0] = arr[offset];
    this.elements[1] = arr[offset + 1];
    this.elements[2] = arr[offset + 2];
    return this;
  }

  // --- Static constructors ---
  static zero() {
    return new Vector3(0, 0, 0);
  }
  static one() {
    return new Vector3(1, 1, 1);
  }
  static right() {
    return new Vector3(1, 0, 0);
  }
  static left() {
    return new Vector3(-1, 0, 0);
  }
  static up() {
    return new Vector3(0, 0, 1);
  }
  static down() {
    return new Vector3(0, 0, -1);
  }
  static forward() {
    return new Vector3(0, 1, 0);
  }
  static backward() {
    return new Vector3(0, -1, 0);
  }
}
