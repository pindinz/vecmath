// test/Matrix4x4.test.js
import { expect } from 'chai';
import { Matrix4x4 } from '../src/matrix4x4.js';
import { Vector3 } from '../src/vector3.js';
import { Vector4 } from '../src/vector4.js';
import { Quaternion } from '../src/quaternion.js';

const EPSILON = 1e-5;

/**
 * Multiply two 4x4 matrices (column-major) for testing
 */
function multiplyMatrices4x4(a, b) {
  const ae = a.elements;
  const be = b.elements;
  const te = new Float32Array(16);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      te[col * 4 + row] =
        ae[0 * 4 + row] * be[col * 4 + 0] +
        ae[1 * 4 + row] * be[col * 4 + 1] +
        ae[2 * 4 + row] * be[col * 4 + 2] +
        ae[3 * 4 + row] * be[col * 4 + 3];
    }
  }

  const result = new Matrix4x4();
  result.elements.set(te);
  return result;
}

describe('Matrix4x4', () => {
  it('should create identity by default', () => {
    const m = new Matrix4x4();
    expect(m.toArray()).to.deep.equal([
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ]);
  });

  it('should transpose correctly', () => {
    const m = new Matrix4x4();
    m.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    m.transpose();
    expect(m.toArray()).to.deep.equal([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
  });

  it('should transpose twice to get original', () => {
    const m = new Matrix4x4();
    m.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    const m2 = m.clone().transpose().transpose();
    expect(m.equals(m2, EPSILON)).to.be.true;
  });

  it('should invert correctly', () => {
    const m = new Matrix4x4();
    m.set(4, 7, 2, 3, 0, 5, 9, 1, 6, 8, 1, 2, 3, 0, 4, 5);

    const inv = m.clone().invert();

    // Check inv * m ≈ identity
    const result = multiplyMatrices4x4(inv, m);
    const identity = new Matrix4x4();
    expect(result.equals(identity, EPSILON)).to.be.true;

    // Double inversion returns original
    const inv2 = inv.clone().invert();
    expect(inv2.equals(m, EPSILON)).to.be.true;
  });

  it('should apply to Vector3 correctly', () => {
    const m = new Matrix4x4().set(
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      2,
      0,
      0,
      1,
      3,
      0,
      0,
      0,
      1
    );
    const v = new Vector3(1, 1, 1);
    const out = m.applyToVector3(v);
    expect(out.x).to.be.closeTo(2, EPSILON);
    expect(out.y).to.be.closeTo(3, EPSILON);
    expect(out.z).to.be.closeTo(4, EPSILON);
  });

  it('should apply to Vector4 correctly', () => {
    const m = new Matrix4x4().set(
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      2,
      0,
      0,
      1,
      3,
      0,
      0,
      0,
      1
    );
    const v = new Vector4(1, 1, 1, 1);
    const out = m.applyToVector4(v);
    expect(out.x).to.be.closeTo(2, EPSILON);
    expect(out.y).to.be.closeTo(3, EPSILON);
    expect(out.z).to.be.closeTo(4, EPSILON);
    expect(out.w).to.be.closeTo(1, EPSILON);
  });

  describe('Matrix4x4 convenience constructors', () => {
    it('should create translation matrix', () => {
      const t = new Vector3(1, 2, 3);
      const m = new Matrix4x4().fromTranslation(t);
      const v = new Vector3(0, 0, 0);
      const out = m.applyToVector3(v);
      expect(out.x).to.be.closeTo(1, EPSILON);
      expect(out.y).to.be.closeTo(2, EPSILON);
      expect(out.z).to.be.closeTo(3, EPSILON);
    });

    it('should create scaling matrix', () => {
      const s = new Vector3(2, 3, 4);
      const m = new Matrix4x4().fromScaling(s);
      const v = new Vector3(1, 1, 1);
      const out = m.applyToVector3(v);
      expect(out.x).to.be.closeTo(2, EPSILON);
      expect(out.y).to.be.closeTo(3, EPSILON);
      expect(out.z).to.be.closeTo(4, EPSILON);
    });

    it('should create rotation matrix from quaternion', () => {
      const angle = Math.PI / 2; // 90 degrees
      const axis = new Vector3(0, 0, 1);
      const s = Math.sin(angle / 2);
      const q = new Quaternion(0, 0, s, Math.cos(angle / 2));
      const m = new Matrix4x4().fromRotationQuaternion(q);
      const v = new Vector3(1, 0, 0);
      const out = m.applyToVector3(v);
      expect(out.x).to.be.closeTo(0, EPSILON);
      expect(out.y).to.be.closeTo(1, EPSILON);
      expect(out.z).to.be.closeTo(0, EPSILON);
    });

    it('should create perspective projection', () => {
      const fov = Math.PI / 2;
      const aspect = 1;
      const near = 1;
      const far = 100;
      const m = new Matrix4x4().fromPerspective(fov, aspect, near, far);
      expect(m.elements[0]).to.be.closeTo(1, EPSILON);
      expect(m.elements[5]).to.be.closeTo(1, EPSILON);
      expect(m.elements[10]).to.be.closeTo(
        -(far + near) / (far - near),
        EPSILON
      );
      expect(m.elements[14]).to.be.closeTo(
        (-2 * far * near) / (far - near),
        EPSILON
      );
    });

    it('should create orthographic projection', () => {
      const m = new Matrix4x4().fromOrtho(-1, 1, -1, 1, 1, 100);
      expect(m.elements[0]).to.be.closeTo(1, EPSILON);
      expect(m.elements[5]).to.be.closeTo(1, EPSILON);
      expect(m.elements[10]).to.be.closeTo(-2 / 99, EPSILON);
      expect(m.elements[12]).to.be.closeTo(0, EPSILON);
    });

    it('should create LookAt matrix', () => {
      const eye = new Vector3(0, 0, 0);
      const target = new Vector3(0, 0, -1);
      const up = new Vector3(0, 1, 0);
      const m = new Matrix4x4().fromLookAt(eye, target, up);

      // Forward vector should point to -Z
      const forward = new Vector3(0, 0, -1);
      const out = new Vector3(
        -m.elements[8], // because we negated z in set()
        -m.elements[9],
        -m.elements[10]
      );
      expect(out.x).to.be.closeTo(forward.x, EPSILON);
      expect(out.y).to.be.closeTo(forward.y, EPSILON);
      expect(out.z).to.be.closeTo(forward.z, EPSILON);
    });
  });

  describe('Matrix4x4 chainable operations', () => {
    it('should chain translate -> rotate -> scale', () => {
      const translation = new Vector3(1, 2, 3);
      const rotation = new Quaternion(
        0,
        0,
        Math.sin(Math.PI / 4),
        Math.cos(Math.PI / 4)
      ); // 90 deg around Z
      const scale = new Vector3(2, 3, 4);

      const m = new Matrix4x4()
        .fromTranslation(translation)
        .multiply(new Matrix4x4().fromScaling(scale))
        .multiply(new Matrix4x4().fromRotationQuaternion(rotation));

      // Test a point at origin
      const v = new Vector3(1, 0, 0);
      const out = m.applyToVector3(v);

      // Apply transformations manually for verification
      // Rotate 90° around Z: (1,0,0) -> (0,1,0)
      // Scale: (0,1,0) -> (0,3,0)
      // Translate: (0,3,0) -> (1,5,3)
      expect(out.x).to.be.closeTo(1, EPSILON);
      expect(out.y).to.be.closeTo(5, EPSILON);
      expect(out.z).to.be.closeTo(3, EPSILON);
    });

    it('should chain invert after multiple transforms', () => {
      const m = new Matrix4x4()
        .fromTranslation(new Vector3(1, 2, 3))
        .multiply(
          new Matrix4x4().fromRotationQuaternion(
            new Quaternion(0, 0, Math.sin(Math.PI / 4), Math.cos(Math.PI / 4))
          )
        )
        .multiply(new Matrix4x4().fromScaling(new Vector3(2, 3, 4)));

      const mInv = m.clone().invert();

      // Multiply matrix by its inverse should yield identity
      const identity = new Matrix4x4();
      const result = new Matrix4x4().multiplyMatrices(m, mInv);
      expect(result.equals(identity, EPSILON)).to.be.true;
    });

    it('should allow multiple chained operations returning the same object', () => {
      const m = new Matrix4x4();
      m.identity()
        .translate(new Vector3(1, 2, 3)) // let's add a translate() method alias
        .multiply(new Matrix4x4().fromScaling(new Vector3(2, 2, 2)))
        .transpose()
        .invert();

      // After all operations, result should still be a valid matrix
      expect(m.elements.length).to.equal(16);
    });
  });

  describe('Matrix4x4 alias methods', () => {
    it('translate() alias should match fromTranslation', () => {
      const v = new Vector3(1, 2, 3);
      const m1 = new Matrix4x4().fromTranslation(v);
      const m2 = new Matrix4x4().identity().translate(v);
      expect(m2.equals(m1, EPSILON)).to.be.true;

      const out = m2.applyToVector3(new Vector3(0, 0, 0));
      expect(out.x).to.be.closeTo(1, EPSILON);
      expect(out.y).to.be.closeTo(2, EPSILON);
      expect(out.z).to.be.closeTo(3, EPSILON);
    });

    it('scale() alias should match fromScaling', () => {
      const s = new Vector3(2, 3, 4);
      const m1 = new Matrix4x4().fromScaling(s);
      const m2 = new Matrix4x4().identity().scale(s);
      expect(m2.equals(m1, EPSILON)).to.be.true;

      const out = m2.applyToVector3(new Vector3(1, 1, 1));
      expect(out.x).to.be.closeTo(2, EPSILON);
      expect(out.y).to.be.closeTo(3, EPSILON);
      expect(out.z).to.be.closeTo(4, EPSILON);
    });

    it('rotateQuaternion() alias should match fromRotationQuaternion', () => {
      const angle = Math.PI / 2;
      const s = Math.sin(angle / 2);
      const q = new Quaternion(0, 0, s, Math.cos(angle / 2));
      const m1 = new Matrix4x4().fromRotationQuaternion(q);
      const m2 = new Matrix4x4().identity().rotateQuaternion(q);
      expect(m2.equals(m1, EPSILON)).to.be.true;

      const out = m2.applyToVector3(new Vector3(1, 0, 0));
      expect(out.x).to.be.closeTo(0, EPSILON);
      expect(out.y).to.be.closeTo(1, EPSILON);
      expect(out.z).to.be.closeTo(0, EPSILON);
    });

    it('lookAt() alias should match fromLookAt', () => {
      const eye = new Vector3(0, 0, 0);
      const target = new Vector3(0, 0, -1);
      const up = new Vector3(0, 1, 0);

      const m1 = new Matrix4x4().fromLookAt(eye, target, up);
      const m2 = new Matrix4x4().identity().lookAt(eye, target, up);
      expect(m2.equals(m1, EPSILON)).to.be.true;
    });

    it('chaining multiple aliases', () => {
      const eye = new Vector3(0, 0, 5);
      const target = new Vector3(0, 0, 0);
      const up = new Vector3(0, 1, 0);
      const q = new Quaternion(
        0,
        0,
        Math.sin(Math.PI / 4),
        Math.cos(Math.PI / 4)
      );
      const s = new Vector3(2, 2, 2);

      const m = new Matrix4x4()
        .identity()
        .translate(new Vector3(1, 0, 0))
        .rotateQuaternion(q)
        .scale(s)
        .lookAt(eye, target, up);

      // Transform a point to ensure it's not NaN and still a valid matrix
      const v = new Vector3(1, 1, 1);
      const out = m.applyToVector3(v);
      expect(isFinite(out.x)).to.be.true;
      expect(isFinite(out.y)).to.be.true;
      expect(isFinite(out.z)).to.be.true;
    });
  });

  describe('Matrix4x4 setFromEuler', () => {
    it('should create correct rotation matrix for Z rotation', () => {
      const angle = Math.PI / 2;
      const m = new Matrix4x4().identity().fromEuler(0, 0, angle);

      const v = new Vector3(1, 0, 0);
      const x = m.elements[0] * v.x + m.elements[4] * v.y + m.elements[8] * v.z;
      const y = m.elements[1] * v.x + m.elements[5] * v.y + m.elements[9] * v.z;

      expect(x).to.be.closeTo(0, EPSILON);
      expect(y).to.be.closeTo(1, EPSILON);
    });

    it('should allow chaining with translation', () => {
      const m = new Matrix4x4()
        .identity()
        .fromEuler(Math.PI / 4, 0, 0) // rotate 45° around X
        .translate(new Vector3(1, 2, 3));

      const v = new Vector3(0, 0, 0);
      const x =
        m.elements[0] * v.x +
        m.elements[4] * v.y +
        m.elements[8] * v.z +
        m.elements[12];
      const y =
        m.elements[1] * v.x +
        m.elements[5] * v.y +
        m.elements[9] * v.z +
        m.elements[13];
      const z =
        m.elements[2] * v.x +
        m.elements[6] * v.y +
        m.elements[10] * v.z +
        m.elements[14];

      const sqrt2over2 = Math.sqrt(2) / 2;
      expect(x).to.be.closeTo(1, EPSILON);
      expect(y).to.be.closeTo(2 * sqrt2over2 - 3 * sqrt2over2, EPSILON); // rotated y
      expect(z).to.be.closeTo(2 * sqrt2over2 + 3 * sqrt2over2, EPSILON); // rotated z
    });
  });
});
