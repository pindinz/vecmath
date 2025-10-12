// test/Quaternion.test.js
import { expect } from 'chai';
import { Quaternion } from '../src/quaternion.js';
import { Vector3 } from '../src/vector3.js';

const EPSILON = 1e-5;

describe('Quaternion', () => {
  it('should initialize correctly', () => {
    const q = new Quaternion(1, 2, 3, 4);
    expect(q.x).to.equal(1);
    expect(q.y).to.equal(2);
    expect(q.z).to.equal(3);
    expect(q.w).to.equal(4);
  });

  it('should normalize correctly', () => {
    const q = new Quaternion(1, 2, 3, 4);
    q.normalize();
    const len = Math.sqrt(1 + 4 + 9 + 16);
    expect(q.equals(new Quaternion(1 / len, 2 / len, 3 / len, 4 / len))).to.be
      .true;
  });

  it('should multiply quaternions', () => {
    const q1 = new Quaternion(0, 0, 0, 1);
    const q2 = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
    q1.multiply(q2);
    expect(Math.abs(q1.length() - 1)).to.be.lessThan(1e-6);
  });

  it('should rotate a vector', () => {
    const q = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
    const v = new Vector3(1, 0, 0);
    q.rotateVector3(v);
    expect(v.x).to.be.closeTo(0, 1e-6);
    expect(v.y).to.be.closeTo(1, 1e-6);
    expect(v.z).to.be.closeTo(0, 1e-6);
  });

  it('should slerp between quaternions', () => {
    const q1 = Quaternion.identity();
    const q2 = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI);
    const q = q1.clone().slerp(q2, 0.5);
    const { angle } = q.toAxisAngle();
    expect(angle).to.be.closeTo(Math.PI / 2, 1e-5);
  });

  describe('Quaternion chainable operations', () => {
    it('should multiply quaternions correctly', () => {
      const q1 = new Quaternion(
        0,
        0,
        Math.sin(Math.PI / 4),
        Math.cos(Math.PI / 4)
      ); // 90° Z
      const q2 = new Quaternion(
        0,
        Math.sin(Math.PI / 4),
        0,
        Math.cos(Math.PI / 4)
      ); // 90° Y

      const q = q1.clone().multiply(q2);

      expect(q.length()).to.be.closeTo(1, EPSILON); // Should remain normalized
    });

    it('should conjugate correctly', () => {
      const q = new Quaternion(1, 2, 3, 4);
      q.conjugate();
      expect(q.equals(new Quaternion(-1, -2, -3, 4), EPSILON)).to.be.true;
    });

    it('should normalize correctly', () => {
      const q = new Quaternion(1, 2, 3, 4);
      q.normalize();
      expect(Math.abs(q.length() - 1)).to.be.lessThan(EPSILON);
    });

    it('should rotate Vector3 correctly', () => {
      const angle = Math.PI / 2;
      const s = Math.sin(angle / 2);
      const q = new Quaternion(0, 0, s, Math.cos(angle / 2)); // 90° Z

      const v = new Vector3(1, 0, 0);
      q.rotateVector3(v);
      expect(v.equals(new Vector3(0, 1, 0), EPSILON)).to.be.true;
    });

    it('should slerp between quaternions correctly', () => {
      const q1 = new Quaternion(0, 0, 0, 1); // identity
      const q2 = new Quaternion(
        0,
        0,
        Math.sin(Math.PI / 4),
        Math.cos(Math.PI / 4)
      ); // 90° Z

      const q = q1.clone().slerp(q2, 0.5); // halfway
      expect(Math.abs(q.length() - 1)).to.be.lessThan(EPSILON); // should remain normalized
    });

    it('should allow chainable operations', () => {
      const q = new Quaternion(0, 0, 0, 1);
      const v = new Vector3(1, 0, 0);

      q.multiply(
        new Quaternion(0, 0, Math.sin(Math.PI / 4), Math.cos(Math.PI / 4))
      )
        .conjugate()
        .normalize()
        .slerp(
          new Quaternion(0, 0, Math.sin(Math.PI / 8), Math.cos(Math.PI / 8)),
          0.5
        );

      // Rotate vector and check it is finite
      q.rotateVector3(v);
      expect(isFinite(v.x)).to.be.true;
      expect(isFinite(v.y)).to.be.true;
      expect(isFinite(v.z)).to.be.true;
    });
  });
});
