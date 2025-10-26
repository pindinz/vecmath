// test/Matrix3x3.test.js
import { expect } from 'chai';
import { Matrix3x3 } from '../src/Matrix3x3.js';
import { Vector3 } from '../src/Vector3.js';

const EPSILON = 1e-5;

/**
 * Utility: multiplies two 3x3 matrices (column-major)
 */
function multiplyMatrices3x3(a, b) {
  const ae = a.elements;
  const be = b.elements;
  const te = new Float32Array(9);

  // column-major multiplication: te[col*3 + row]
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      te[col * 3 + row] =
        ae[0 * 3 + row] * be[col * 3 + 0] +
        ae[1 * 3 + row] * be[col * 3 + 1] +
        ae[2 * 3 + row] * be[col * 3 + 2];
    }
  }

  const result = new Matrix3x3();
  result.elements.set(te);
  return result;
}

describe('Matrix3x3', () => {
  it('should create an identity matrix by default', () => {
    const m = new Matrix3x3();
    expect(m.toArray()).to.deep.equal([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });

  it('should transpose correctly', () => {
    // column-major: columns are stored sequentially
    const m = new Matrix3x3();
    m.set(1, 2, 3, 4, 5, 6, 7, 8, 9);
    m.transpose();

    // column-major after transpose:
    expect(m.toArray()).to.deep.equal([
      1,
      2,
      3, // first column
      4,
      5,
      6, // second column
      7,
      8,
      9, // third column
    ]);
  });

  it('should transpose twice to get original', () => {
    const m = new Matrix3x3();
    m.set(1, 4, 7, 2, 5, 8, 3, 6, 9);
    const m2 = m.clone().transpose().transpose();
    expect(m.equals(m2, EPSILON)).to.be.true;
  });

  it('should invert correctly', () => {
    const m = new Matrix3x3();
    m.set(
      2,
      5,
      7, // first column
      6,
      3,
      4, // second column
      5,
      -2,
      -3 // third column
    );

    const inv = m.clone().invert();

    const result = multiplyMatrices3x3(inv, m);
    const identity = new Matrix3x3();
    expect(result.equals(identity, EPSILON)).to.be.true;

    // Double inversion returns original
    const inv2 = inv.clone().invert();
    expect(inv2.equals(m, EPSILON)).to.be.true;
  });

  describe('Matrix3x3 chainable operations', () => {
    it('should scale correctly using chainable scale()', () => {
      const m = new Matrix3x3().identity().scale(new Vector3(2, 3, 4));

      const v = new Vector3(1, 1, 1);
      const x = m.elements[0] * v.x + m.elements[3] * v.y + m.elements[6] * v.z;
      const y = m.elements[1] * v.x + m.elements[4] * v.y + m.elements[7] * v.z;
      const z = m.elements[2] * v.x + m.elements[5] * v.y + m.elements[8] * v.z;

      expect(x).to.be.closeTo(2, EPSILON);
      expect(y).to.be.closeTo(3, EPSILON);
      expect(z).to.be.closeTo(4, EPSILON);
    });

    it('should rotate correctly using rotateX/Y/Z', () => {
      const v = new Vector3(0, 1, 0);

      // Rotate 90° around X -> y=1,z=0 becomes y~0,z~1
      const mX = new Matrix3x3().identity().rotateX(Math.PI / 2);
      const x =
        mX.elements[0] * v.x + mX.elements[3] * v.y + mX.elements[6] * v.z;
      const y =
        mX.elements[1] * v.x + mX.elements[4] * v.y + mX.elements[7] * v.z;
      const z =
        mX.elements[2] * v.x + mX.elements[5] * v.y + mX.elements[8] * v.z;
      expect(x).to.be.closeTo(0, EPSILON);
      expect(y).to.be.closeTo(0, EPSILON);
      expect(z).to.be.closeTo(1, EPSILON);

      // Rotate 90° around Z -> x=1,y=0 becomes x~0,y~1
      const v2 = new Vector3(1, 0, 0);
      const mZ = new Matrix3x3().identity().rotateZ(Math.PI / 2);
      const x2 =
        mZ.elements[0] * v2.x + mZ.elements[3] * v2.y + mZ.elements[6] * v2.z;
      const y2 =
        mZ.elements[1] * v2.x + mZ.elements[4] * v2.y + mZ.elements[7] * v2.z;
      const z2 =
        mZ.elements[2] * v2.x + mZ.elements[5] * v2.y + mZ.elements[8] * v2.z;
      expect(x2).to.be.closeTo(0, EPSILON);
      expect(y2).to.be.closeTo(1, EPSILON);
      expect(z2).to.be.closeTo(0, EPSILON);
    });

    it('should allow multiple chained operations', () => {
      const m = new Matrix3x3()
        .identity()
        .scale(new Vector3(2, 3, 4))
        .rotateX(Math.PI / 4)
        .rotateY(Math.PI / 4)
        .transpose()
        .invert();

      // Resulting matrix elements should be finite
      for (const e of m.elements) {
        expect(isFinite(e)).to.be.true;
      }
    });
  });

  describe('Matrix3x3 setFromEuler', () => {
    it('should create correct rotation matrix for X rotation', () => {
      const angle = Math.PI / 2; // 90°
      const m = new Matrix3x3().identity().fromEuler(angle, 0, 0);

      const v = new Vector3(0, 1, 0);
      // Rotate around X -> y=1,z=0 becomes y~0,z~1
      const y = m.elements[1] * v.x + m.elements[4] * v.y + m.elements[7] * v.z;
      const z = m.elements[2] * v.x + m.elements[5] * v.y + m.elements[8] * v.z;

      expect(y).to.be.closeTo(0, EPSILON);
      expect(z).to.be.closeTo(1, EPSILON);
    });

    it('should create correct rotation matrix for Y rotation', () => {
      const angle = Math.PI / 2;
      const m = new Matrix3x3().identity().fromEuler(0, angle, 0);

      const v = new Vector3(1, 0, 0);
      const x = m.elements[0] * v.x + m.elements[3] * v.y + m.elements[6] * v.z;
      const z = m.elements[2] * v.x + m.elements[5] * v.y + m.elements[8] * v.z;

      expect(x).to.be.closeTo(0, EPSILON);
      expect(z).to.be.closeTo(-1, EPSILON);
    });

    it('should allow chaining with other operations', () => {
      const m = new Matrix3x3()
        .identity()
        .fromEuler(0, 0, Math.PI / 4)
        .transpose();
      expect(m.elements.every((e) => isFinite(e))).to.be.true;
    });
  });
});
