// test/Vector3.test.js
import { expect } from 'chai';
import { Vector3 } from '../src/vector3.js';
import { Matrix4x4 } from '../src/matrix4x4.js';

const EPSILON = 1e-5;

describe('Vector3', () => {
  it('should initialize correctly', () => {
    const v = new Vector3(1, 2, 3);
    expect(v.x).to.equal(1);
    expect(v.y).to.equal(2);
    expect(v.z).to.equal(3);
  });

  it('should initialize correctly with static constructors', () => {
    expect(Vector3.zero().toArray()).to.deep.equal([0, 0, 0]);
    expect(Vector3.one().toArray()).to.deep.equal([1, 1, 1]);
    expect(Vector3.right().toArray()).to.deep.equal([1, 0, 0]);
    expect(Vector3.left().toArray()).to.deep.equal([-1, 0, 0]);
    expect(Vector3.up().toArray()).to.deep.equal([0, 0, 1]);
    expect(Vector3.down().toArray()).to.deep.equal([0, 0, -1]);
    expect(Vector3.forward().toArray()).to.deep.equal([0, 1, 0]);
    expect(Vector3.backward().toArray()).to.deep.equal([0, -1, 0]);
  });

  it('should set and call the onChange callback correctly', () => {
    let changed = false;
    const handleOnChange = () => {
      changed = true;
    };
    const v = new Vector3();
    v.onChange(handleOnChange);
    expect(v._onChange).to.be.a('function');

    changed = false;
    v.x = 1;
    expect(changed).to.be.true;
    changed = false;
    v.y = 1;
    expect(changed).to.be.true;
    changed = false;
    v.z = 1;
    expect(changed).to.be.true;
    changed = false;
    v.set(1, 2, 3);
    expect(changed).to.be.true;

    changed = false;
    v.copy(new Vector3());
    expect(changed).to.be.true;

    changed = false;
    v.add(new Vector3());
    expect(changed).to.be.true;

    changed = false;
    v.addScaledVector(new Vector3(), 3);
    expect(changed).to.be.true;

    changed = false;
    v.sub(new Vector3());
    expect(changed).to.be.true;

    changed = false;
    v.multiplyScalar(5);
    expect(changed).to.be.true;

    changed = false;
    v.divideScalar(5);
    expect(changed).to.be.true;

    changed = false;
    v.cross(new Vector3());
    expect(changed).to.be.true;

    changed = false;
    v.crossProduct(new Vector3(1, 0, 0), new Vector3(0, 1, 0));
    expect(changed).to.be.true;

    changed = false;
    v.negate();
    expect(changed).to.be.true;

    changed = false;
    v.applyMatrix4(new Matrix4x4());
    expect(changed).to.be.true;

    changed = false;
    v.setFromArray([1, 2, 3], 0);
    expect(changed).to.be.true;
  });

  it('should set correctly', () => {
    const v = new Vector3();
    v.set(1, 2, 3);
    expect(v.x).to.equal(1);
    expect(v.y).to.equal(2);
    expect(v.z).to.equal(3);
  });

  it('should copy correctly', () => {
    const v = new Vector3(1, 2, 3);
    const c = new Vector3();
    c.copy(v);
    v.set(1, 2, 3);
    expect(c.x).to.equal(1);
    expect(c.y).to.equal(2);
    expect(c.z).to.equal(3);
  });

  it('should clone correctly', () => {
    const v = new Vector3(1, 2, 3);
    const c = v.clone();
    c.copy(v);
    v.set(1, 2, 3);
    expect(c.x).to.equal(1);
    expect(c.y).to.equal(2);
    expect(c.z).to.equal(3);
  });

  it('should setFromArray correctly', () => {
    const arr = [1, 2, 3, 4, 5];
    const v = new Vector3();
    v.setFromArray(arr, 1);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(v.z).to.equal(4);
  });

  it('should add a vector', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    v1.add(v2);
    expect(v1.toArray()).to.deep.equal([5, 7, 9]);
  });

  it('should add a scaled vector', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    v1.addScaledVector(v2, 2);
    expect(v1.toArray()).to.deep.equal([9, 12, 15]);
  });

  it('should subtract a vector', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    v1.sub(v2);
    expect(v1.toArray()).to.deep.equal([-3, -3, -3]);
  });

  it('should multiply a vector by a scalar', () => {
    const v1 = new Vector3(1, 2, 3);
    v1.multiplyScalar(5);
    expect(v1.toArray()).to.deep.equal([5, 10, 15]);
  });

  it('should divide a vector by a scalar', () => {
    const v1 = new Vector3(5, 10, 15);
    v1.divideScalar(5);
    expect(v1.toArray()).to.deep.equal([1, 2, 3]);
    v1.divideScalar(0);
    expect(v1.toArray()).to.deep.equal([NaN, NaN, NaN]);
  });

  it('should compute dot product', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    expect(v1.dot(v2)).to.equal(32);
  });

  it('should compute cross product', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    v1.cross(v2);
    expect(v1.toArray()).to.deep.equal([-3, 6, -3]);
  });

  it('should compute cross product', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    v1.crossProduct(v1.clone(), v2);
    expect(v1.toArray()).to.deep.equal([-3, 6, -3]);
  });

    it('should compute length squared', () => {
    const v1 = new Vector3(1, 2, 3);
    expect(v1.lengthSq()).to.equal(14);
  });

  it('should normalize correctly', () => {
    const v1 = new Vector3(1, 2, 3);
    const len = Math.hypot(1, 2, 3);
    v1.normalize();
    expect(v1.x).to.be.closeTo(1 / len, EPSILON);
    expect(v1.y).to.be.closeTo(2 / len, EPSILON);
    expect(v1.z).to.be.closeTo(3 / len, EPSILON);
    const v2 = new Vector3();
    v2.normalize();
    expect(v2.toArray()).to.be.deep.equal([0, 0, 0]);
  });

  it('should return distance between vectors', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(2, 3, 4);
    expect(v1.distanceTo(v2)).to.equal(Math.sqrt(3));
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
      const m = new Matrix4x4().setFromTranslation(new Vector3(1, 2, 3));
      v.applyMatrix4(m);
      expect(v.equals(new Vector3(2, 3, 4), EPSILON)).to.be.true;
      v.set(1, 1, 1);
      v.applyMatrix4(m, true);
      expect(v.equals(new Vector3(2, 3, 4), EPSILON)).to.be.true;
    });
  });
});
