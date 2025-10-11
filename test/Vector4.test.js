// test/Vector4.test.js
import { expect } from 'chai';
import { Vector3 } from '../src/Vector3.js';
import { Vector4 } from '../src/Vector4.js';
import { Matrix4x4 } from '../src/Matrix4x4.js';

const EPSILON = 1e-5;

describe('Vector4', () => {
  it('should initialize correctly', () => {
    const v = new Vector4(1, 2, 3, 4);
    expect(v.x).to.equal(1);
    expect(v.y).to.equal(2);
    expect(v.z).to.equal(3);
    expect(v.w).to.equal(4);
  });

  it('should add vectors', () => {
    const v1 = new Vector4(1, 2, 3, 4);
    const v2 = new Vector4(5, 6, 7, 8);
    v1.add(v2);
    expect(v1.toArray()).to.deep.equal([6, 8, 10, 12]);
  });

  it('should compute dot product', () => {
    const v1 = new Vector4(1, 0, 0, 0);
    const v2 = new Vector4(0, 1, 0, 0);
    expect(v1.dot(v2)).to.equal(0);
  });

  it('should normalize correctly', () => {
    const v = new Vector4(0, 0, 3, 4);
    v.normalize();
    const len = Math.sqrt(3 * 3 + 4 * 4);
    expect(v.equals(new Vector4(0, 0, 3 / len, 4 / len))).to.be.true;
  });

  it('should negate', () => {
    const v = new Vector4(1, -2, 3, -4);
    v.negate();
    expect(v.toArray()).to.deep.equal([-1, 2, -3, 4]);
  });

  it('should be chainable', () => {
    const v = new Vector4(1, 2, 3, 4);
    v.add(Vector4.one()).multiplyScalar(2);
    expect(v.toArray()).to.deep.equal([4, 6, 8, 10]);
  });

  describe('Vector4 chainable operations', () => {
    it('should chain add, sub, multiplyScalar, divideScalar, negate', () => {
      const a = new Vector4(1, 2, 3, 4);
      const b = new Vector4(4, 5, 6, 7);

      const result = a
        .clone()
        .add(b)
        .sub(new Vector4(1, 1, 1, 1))
        .multiplyScalar(2)
        .divideScalar(2)
        .negate();
      expect(result.equals(new Vector4(-4, -6, -8, -10), EPSILON)).to.be.true;
    });

    it('should chain dot, normalize', () => {
      const a = new Vector4(1, 0, 0, 0);
      const b = new Vector4(0, 1, 0, 0);

      const dot = a.clone().dot(b);
      expect(dot).to.be.closeTo(0, EPSILON);

      const norm = new Vector4(2, 0, 0, 0).normalize();
      expect(norm.length()).to.be.closeTo(1, EPSILON);
      expect(norm.equals(new Vector4(1, 0, 0, 0), EPSILON)).to.be.true;
    });

    it('should applyMatrix4 correctly', () => {
      const v = new Vector4(1, 1, 1, 1);
      const m = new Matrix4x4().fromTranslation(new Vector3(1, 2, 3));
      v.applyMatrix4(m);
      expect(v.equals(new Vector4(2, 3, 4, 1), EPSILON)).to.be.true;
    });
  });
});
