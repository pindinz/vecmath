// test/Vector4.test.js
import { expect } from 'chai';
import { Vector3 } from '../src/vector3.js';
import { Vector4 } from '../src/vector4.js';
import { Matrix4x4 } from '../src/matrix4x4.js';

const EPSILON = 1e-5;

describe('Vector4', () => {
  it('should initialize correctly', () => {
    const v = new Vector4(1, 2, 3, 4);
    expect(v.x).to.equal(1);
    expect(v.y).to.equal(2);
    expect(v.z).to.equal(3);
    expect(v.w).to.equal(4);
  });

  it('should initialize correctly with static constructors', () => {
    expect(Vector4.zero().toArray()).to.deep.equal([0, 0, 0, 0]);
    expect(Vector4.one().toArray()).to.deep.equal([1, 1, 1, 1]);
    expect(Vector4.unitX().toArray()).to.deep.equal([1, 0, 0, 0]);
    expect(Vector4.unitY().toArray()).to.deep.equal([0, 1, 0, 0]);
    expect(Vector4.unitZ().toArray()).to.deep.equal([0, 0, 1, 0]);
    expect(Vector4.unitW().toArray()).to.deep.equal([0, 0, 0, 1]);
  });

  it('should set correctly', () => {
    const v = new Vector4();
    v.set(1, 2, 3, 4);
    expect(v.x).to.equal(1);
    expect(v.y).to.equal(2);
    expect(v.z).to.equal(3);
    expect(v.w).to.equal(4);
  });

  it('should copy correctly', () => {
    const v = new Vector4(1, 2, 3, 4);
    const c = new Vector4();
    c.copy(v);
    expect(c.x).to.equal(1);
    expect(c.y).to.equal(2);
    expect(c.z).to.equal(3);
    expect(c.w).to.equal(4);
  });

  it('should clone correctly', () => {
    const v = new Vector4(1, 2, 3, 4);
    const c = v.clone();
    expect(c.x).to.equal(1);
    expect(c.y).to.equal(2);
    expect(c.z).to.equal(3);
    expect(c.w).to.equal(4);
  });

  it('should set fromArray correctly', () => {
    const v = new Vector4();
    const arr = [1, 2, 3, 4, 5, 6];
    v.fromArray(arr, 1);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(v.z).to.equal(4);
    expect(v.w).to.equal(5);
  });

  it('should add vectors', () => {
    const v1 = new Vector4(1, 2, 3, 4);
    const v2 = new Vector4(5, 6, 7, 8);
    v1.add(v2);
    expect(v1.toArray()).to.deep.equal([6, 8, 10, 12]);
  });

  it('should compute dot product', () => {
    const v1 = new Vector4(1, 2, 3, 4);
    const v2 = new Vector4(5, 6, 7, 8);
    expect(v1.dot(v2)).to.equal(70);
  });

  it('should normalize correctly', () => {
    const v1 = new Vector4(1, 2, 3, 4);
    v1.normalize();
    const len = Math.hypot(1, 2, 3, 4);
    expect(v1.equals(new Vector4(1 / len, 2 / len, 3 / len, 4 / len))).to.be
      .true;
    const v2 = new Vector4();
    v2.normalize();
    expect(v2.equals(new Vector4())).to.be.true;
  });

  it('should negate', () => {
    const v = new Vector4(1, -2, 3, -4);
    v.negate();
    expect(v.toArray()).to.deep.equal([-1, 2, -3, 4]);
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
      const m = new Matrix4x4().setFromTranslation(new Vector3(1, 2, 3));
      v.applyMatrix4(m);
      expect(v.equals(new Vector4(2, 3, 4, 1), EPSILON)).to.be.true;
    });
  });
});
