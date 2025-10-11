// test/Vector3.test.js
import { expect } from 'chai';
import { Vector3 } from '../src/Vector3.js';
import { Matrix4x4 } from '../src/Matrix4x4.js';

const EPSILON = 1e-5;

describe('Vector3', () => {
  it('should initialize correctly', () => {
    const v = new Vector3(1, 2, 3);
    expect(v.x).to.equal(1);
    expect(v.y).to.equal(2);
    expect(v.z).to.equal(3);
  });

  it('should add vectors', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    v1.add(v2);
    expect(v1.toArray()).to.deep.equal([5, 7, 9]);
  });

  it('should compute dot product', () => {
    const v1 = new Vector3(1, 0, 0);
    const v2 = new Vector3(0, 1, 0);
    expect(v1.dot(v2)).to.equal(0);
  });

  it('should compute cross product', () => {
    const v1 = new Vector3(1, 0, 0);
    const v2 = new Vector3(0, 1, 0);
    v1.cross(v2);
    expect(v1.toArray()).to.deep.equal([0, 0, 1]);
  });

  it('should normalize correctly', () => {
    const v = new Vector3(3, 0, 0);
    v.normalize();
    expect(v.toArray()).to.deep.equal([1, 0, 0]);
  });

  it('should return distance between vectors', () => {
    const v1 = new Vector3(0, 0, 0);
    const v2 = new Vector3(3, 4, 0);
    expect(v1.distanceTo(v2)).to.equal(5);
  });

  it('should be chainable', () => {
    const v = new Vector3(1, 2, 3);
    v.add(Vector3.one()).multiplyScalar(2);
    expect(v.toArray()).to.deep.equal([4, 6, 8]);
  });

  describe('Vector3 chainable operations', () => {
    it('should chain add, sub, multiplyScalar, divideScalar, negate', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);

      const result = a
        .clone()
        .add(b)
        .sub(new Vector3(1, 1, 1))
        .multiplyScalar(2)
        .divideScalar(2)
        .negate();
      expect(result.equals(new Vector3(-4, -6, -8), EPSILON)).to.be.true;
    });

    it('should chain cross, dot, normalize', () => {
      const a = new Vector3(1, 0, 0);
      const b = new Vector3(0, 1, 0);

      const cross = a.clone().cross(b);
      expect(cross.equals(new Vector3(0, 0, 1), EPSILON)).to.be.true;

      const dot = a.clone().dot(b);
      expect(dot).to.be.closeTo(0, EPSILON);

      const norm = new Vector3(3, 0, 4).normalize();
      expect(norm.length()).to.be.closeTo(1, EPSILON);
      expect(norm.equals(new Vector3(0.6, 0, 0.8), EPSILON)).to.be.true;
    });

    it('should applyMatrix4 correctly', () => {
      const v = new Vector3(1, 1, 1);
      const m = new Matrix4x4().fromTranslation(new Vector3(1, 2, 3));
      v.applyMatrix4(m);
      expect(v.equals(new Vector3(2, 3, 4), EPSILON)).to.be.true;
    });
  });
});
