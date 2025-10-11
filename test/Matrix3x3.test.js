// test/Matrix3x3.test.js
import { expect } from 'chai';
import { Matrix3x3 } from '../src/Matrix3x3.js';

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
});
