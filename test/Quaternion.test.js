// test/Quaternion.test.js
import { expect } from 'chai';
import { Quaternion } from '../src/Quaternion.js';
import { Vector3 } from '../src/Vector3.js';
import { Matrix4x4 } from '../src/Matrix4x4.js';

const EPSILON = 1e-5;

describe('Quaternion', () => {
  it('should initialize correctly', () => {
    const q = new Quaternion(1, 2, 3, 4);
    expect(q.x).to.equal(1);
    expect(q.y).to.equal(2);
    expect(q.z).to.equal(3);
    expect(q.w).to.equal(4);
  });

  it('should set and call the onChange callback correctly', () => {
    let changed = false;
    const handleOnChange = () => {
      changed = true;
    };
    const q = new Quaternion();
    q.onChange(handleOnChange);
    expect(q._onChange).to.be.a('function');

    changed = false;
    q.x = 1;
    expect(changed).to.be.true;
    changed = false;
    q.y = 1;
    expect(changed).to.be.true;
    changed = false;
    q.z = 1;
    expect(changed).to.be.true;
    changed = false;
    q.w = 1;
    expect(changed).to.be.true;

    changed = false;
    q.set(1, 2, 3, 4);
    expect(changed).to.be.true;

    changed = false;
    q.copy(new Quaternion());
    expect(changed).to.be.true;

    changed = false;
    q.identity();
    expect(changed).to.be.true;

    changed = false;
    q.conjugate();
    expect(changed).to.be.true;

    changed = false;
    q.negate();
    expect(changed).to.be.true;

    changed = false;
    q.normalize();
    expect(changed).to.be.true;

    changed = false;
    q.invert();
    expect(changed).to.be.true;

    changed = false;
    q.multiply(new Quaternion());
    expect(changed).to.be.true;

    changed = false;
    q.multiplyQuaternions(q, new Quaternion());
    expect(changed).to.be.true;

    changed = false;
    q.slerp(
      new Quaternion().setFromEuler(Math.PI / 2, Math.PI / 3, Math.PI / 4),
      0.5
    );
    expect(changed).to.be.true;
    q.setFromEuler(Math.PI / 2, Math.PI / 3, Math.PI / 3.999);
    q.slerp(
      new Quaternion().setFromEuler(Math.PI / 2, Math.PI / 3, Math.PI / 4),
      0.5
    );
    expect(changed).to.be.true;

    changed = false;
    q.setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 3);
    expect(changed).to.be.true;

    changed = false;
    q.setFromEuler(Math.PI / 2, Math.PI / 3, Math.PI / 4);
    expect(changed).to.be.true;

    changed = false;
    q.setFromRotationMatrix(new Matrix4x4());
    expect(changed).to.be.true;

    changed = false;
    q.setFromArray([1, 2, 3, 4], 0);
    expect(changed).to.be.true;
  });

  it('should set correctly', () => {
    const q = new Quaternion();
    q.set(1, 2, 3, 4);
    expect(q.x).to.equal(1);
    expect(q.y).to.equal(2);
    expect(q.z).to.equal(3);
    expect(q.w).to.equal(4);
  });

  it('should copy correctly', () => {
    const q = new Quaternion().copy(new Quaternion(1, 2, 3, 4));
    expect(q.x).to.equal(1);
    expect(q.y).to.equal(2);
    expect(q.z).to.equal(3);
    expect(q.w).to.equal(4);
  });

  it('should set to identity', () => {
    const q = new Quaternion().identity();
    expect(q.x).to.equal(0);
    expect(q.y).to.equal(0);
    expect(q.z).to.equal(0);
    expect(q.w).to.equal(1);
  });

  it('should have proper accessors', () => {
    const q = new Quaternion();
    q.x = 1;
    q.y = 2;
    q.z = 3;
    q.w = 4;
    expect(q.x).to.equal(1);
    expect(q.y).to.equal(2);
    expect(q.z).to.equal(3);
    expect(q.w).to.equal(4);
  });

  it('should normalize correctly', () => {
    const q1 = new Quaternion(1, 2, 3, 4);
    q1.normalize();
    const len = Math.hypot(1, 2, 3, 4);
    expect(q1.equals(new Quaternion(1 / len, 2 / len, 3 / len, 4 / len))).to.be
      .true;
    const q2 = new Quaternion();
    q2.normalize();
    expect(q2.equals(new Quaternion())).to.be.true;
  });

  it('should invert correctly', () => {
    const q = new Quaternion(1, 2, 3, 4);
    q.invert();
    expect(q.x).to.be.closeTo(-0.0333333333, EPSILON);
    expect(q.y).to.be.closeTo(-0.0666666667, EPSILON);
    expect(q.z).to.be.closeTo(-0.1, EPSILON);
    expect(q.w).to.be.closeTo(0.13333333333, EPSILON);
  });

  it('should multiply quaternions', () => {
    const q1 = new Quaternion(1, 2, 3, 4);
    const q2 = new Quaternion(5, 6, 7, 8);
    const q3 = new Quaternion().multiplyQuaternions(q1, q2);
    q1.multiply(q2);
    expect(q1.equals(new Quaternion(24, 48, 48, -6))).to.be.true;
    expect(q3.equals(new Quaternion(24, 48, 48, -6))).to.be.true;
  });

  it('should rotate a vector', () => {
    const q = Quaternion.fromAxisAngle(
      new Vector3(1, 2, 3).normalize(),
      Math.PI / 6
    );
    const v = q.rotateVector3(new Vector3(4, 5, 6));
    expect(v.x).to.be.closeTo(3.3694374008, 1e-6);
    expect(v.y).to.be.closeTo(5.7443660416, 1e-6);
    expect(v.z).to.be.closeTo(5.7139435053, 1e-6);
  });

  it('should slerp between quaternions', () => {
    const q1 = Quaternion.identity();
    const q2 = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), 1.5 * Math.PI);
    const q = q1.clone().slerp(q2, 0.5);
    const { angle } = q.toAxisAngle();
    expect(angle).to.be.closeTo(0.25 * Math.PI, 1e-5);
  });

  it('should lerp between quaternions for small angles', () => {
    const q1 = Quaternion.identity();
    const q2 = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), 0.002);
    const q = q1.clone().slerp(q2, 0.5);
    const { angle } = q.toAxisAngle();
    expect(angle).to.be.closeTo(0.001, 1e-4);
  });

  it('should return from slerp when the angle is 0', () => {
    const q1 = Quaternion.identity();
    const q2 = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), 0);
    const q = q1.clone().slerp(q2, 0.5);
    const { angle } = q.toAxisAngle();
    expect(angle).to.be.closeTo(0, 1e-5);
  });

  it('should initialize correctly from Euler angles', () => {
    const q = Quaternion.fromEuler(Math.PI / 6, Math.PI / 4, Math.PI / 3);
    expect(q.x).to.be.closeTo(0.391904, 1e-6);
    expect(q.y).to.be.closeTo(0.200562, 1e-6);
    expect(q.z).to.be.closeTo(0.531976, 1e-6);
    expect(q.w).to.be.closeTo(0.723317, 1e-6);
  });

  it('should update correctly from an array with offset', () => {
    const arr = [0, 1, 2, 3, 4, 5];
    const q = new Quaternion().setFromArray(arr, 1);
    expect(q.x).to.equal(1);
    expect(q.y).to.equal(2);
    expect(q.z).to.equal(3);
    expect(q.w).to.equal(4);
  });

  it('should return its values as an array correctly', () => {
    const q = new Quaternion(1, 2, 3, 4);
    const arr = q.toArray();
    expect(arr).to.deep.equal([1, 2, 3, 4]);
  });

  it('should update correctly from an axis and angle', () => {
    const q = Quaternion.fromAxisAngle(
      new Vector3(1, 2, 3).normalize(),
      Math.PI / 3
    );
    expect(q.x).to.be.closeTo(0.1336306, 1e-6);
    expect(q.y).to.be.closeTo(0.2672612, 1e-6);
    expect(q.z).to.be.closeTo(0.4008919, 1e-6);
    expect(q.w).to.be.closeTo(0.8660254, 1e-6);
  });

  it('should convert correctly to an axis and angle', () => {
    const v = new Vector3(1, 2, 3).normalize();
    const q = Quaternion.fromAxisAngle(v, Math.PI / 3);
    const { axis, angle } = q.toAxisAngle();
    expect(axis.x).to.be.closeTo(v.x, 1e-6);
    expect(axis.y).to.be.closeTo(v.y, 1e-6);
    expect(axis.z).to.be.closeTo(v.z, 1e-6);
    expect(angle).to.be.closeTo(Math.PI / 3, 1e-6);
  });

  it('should convert correctly to an axis and angle when w > 1', () => {
    const v = new Vector3(1, 2, 3).normalize();
    const q = Quaternion.fromAxisAngle(v, 0);
    q.x *= 1.000001;
    q.y *= 1.000001;
    q.z *= 1.000001;
    q.w *= 1.000001;
    const { axis, angle } = q.toAxisAngle();
    expect(axis.x).to.equal(1);
    expect(axis.y).to.equal(0);
    expect(axis.z).to.equal(0);
    expect(angle).to.equal(0);
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

    it('should negate correctly', () => {
      const q = new Quaternion(1, 2, 3, 4);
      q.negate();
      expect(q.equals(new Quaternion(-1, -2, -3, -4), EPSILON)).to.be.true;
    });

    it('should calculate length squared correctly', () => {
      const q = new Quaternion(1, 2, 3, 4);
      expect(q.lengthSq()).to.equal(30);
    });

    it('should calculate length correctly', () => {
      const q = new Quaternion(1, 2, 3, 4);
      expect(q.length()).to.equal(Math.hypot(1, 2, 3, 4));
    });

    it('should calculate the dot product correctly', () => {
      const q = new Quaternion(1, 2, 3, 4);
      expect(q.dot(new Quaternion(4, 3, 2, 1))).to.equal(20);
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
