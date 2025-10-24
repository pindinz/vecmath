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

function matricesAlmostEqual(a, b, relEps = 1e-6, absEps = 1e-6) {
  const ae = a.elements,
    be = b.elements;
  for (let i = 0; i < 16; i++) {
    if (
      Math.abs(ae[i] - be[i]) >
      Math.max(relEps * Math.max(Math.abs(ae[i]), Math.abs(be[i])), absEps)
    ) {
      return false;
    }
  }
  return true;
}

function addMatrixNoise(matrix, magnitude = 1e-6) {
  const noisy = matrix.clone();
  const e = noisy.elements;
  for (let i = 0; i < 16; i++) {
    e[i] += (Math.random() * 2 - 1) * magnitude;
  }
  return noisy;
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

  describe('Matrix4x4.determinant()', () => {
    it('should return 1 for the identity matrix', () => {
      const m = new Matrix4x4().identity();
      expect(m.determinant()).to.be.closeTo(1, 1e-10);
    });

    it('should equal the product of scales for a pure scaling matrix', () => {
      const scale = new Vector3(2, 3, 4);
      const m = new Matrix4x4().identity().scale(scale);
      expect(m.determinant()).to.be.closeTo(2 * 3 * 4, 1e-10);
    });

    it('should return -1 for a reflection (one negative scale axis)', () => {
      const scale = new Vector3(-1, 1, 1);
      const m = new Matrix4x4().identity().scale(scale);
      expect(Math.sign(m.determinant())).to.equal(-1);
      expect(Math.abs(m.determinant())).to.be.closeTo(1, 1e-10);
    });

    it('should return +1 for any pure rotation matrix', () => {
      const q = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4);
      const m = new Matrix4x4().setFromRotationQuaternion(q);
      expect(m.determinant()).to.be.closeTo(1, 1e-6);
    });

    it('should scale correctly after combining rotation and scale', () => {
      const q = Quaternion.fromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
      const scale = new Vector3(2, 3, 4);
      const m = new Matrix4x4().setFromRotationQuaternion(q).scale(scale);
      expect(m.determinant()).to.be.closeTo(2 * 3 * 4, 1e-5);
    });

    it('should be negative if rotation is combined with reflection', () => {
      const q = Quaternion.fromAxisAngle(new Vector3(0, 0, 1), Math.PI / 3);
      const scale = new Vector3(-1, 1, 1);
      const m = new Matrix4x4().setFromRotationQuaternion(q).scale(scale);
      expect(Math.sign(m.determinant())).to.equal(-1);
      expect(Math.abs(m.determinant())).to.be.closeTo(1, 1e-6);
    });

    it('should give zero for singular (degenerate) matrix with zero scale', () => {
      const scale = new Vector3(0, 2, 3);
      const m = new Matrix4x4().identity().scale(scale);
      expect(m.determinant()).to.be.closeTo(0, 1e-10);
    });

    it('should match manual determinant computation for a known matrix', () => {
      // From standard 4x4 example
      const m = new Matrix4x4().set(
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
      );
      expect(m.determinant()).to.be.closeTo(0, 1e-10);
    });

    it('should handle translation without affecting determinant', () => {
      const m = new Matrix4x4().identity().translate(new Vector3(5, 10, -2));
      expect(m.determinant()).to.be.closeTo(1, 1e-10);
    });

    it('should compute the correct determinant for a random composed transform', () => {
      const pos = new Vector3(2, -3, 5);
      const q = Quaternion.fromAxisAngle(
        new Vector3(1, 1, 1).normalize(),
        Math.PI / 3
      );
      const scale = new Vector3(2, 0.5, -3);
      const m = new Matrix4x4().compose(pos, q, scale);

      // rotation has det = +1, so det = product of scales
      const expected = 2 * 0.5 * -3;
      expect(m.determinant()).to.be.closeTo(expected, 1e-6);
    });
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
      const m = new Matrix4x4().setFromTranslation(t);
      const v = new Vector3(0, 0, 0);
      const out = m.applyToVector3(v);
      expect(out.x).to.be.closeTo(1, EPSILON);
      expect(out.y).to.be.closeTo(2, EPSILON);
      expect(out.z).to.be.closeTo(3, EPSILON);
    });

    it('should create scaling matrix', () => {
      const s = new Vector3(2, 3, 4);
      const m = new Matrix4x4().setFromScaling(s);
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
      const m = new Matrix4x4().setFromRotationQuaternion(q);
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
      const m = new Matrix4x4().setFromPerspective(fov, aspect, near, far);
      expect(m.elements[0]).to.be.closeTo(1, EPSILON);
      expect(m.elements[5]).to.be.closeTo(1, EPSILON);
      expect(m.elements[10]).to.be.closeTo(
        (far + near) / (far - near),
        EPSILON
      );
      expect(m.elements[11]).to.be.closeTo(
        (2 * far * near) / (far - near),
        EPSILON
      );
      expect(m.elements[14]).to.be.equal(-1);
    });

    it('should create orthographic projection', () => {
      const m = new Matrix4x4().setFromOrtho(-1, 1, -1, 1, 1, 100);
      expect(m.elements[0]).to.be.closeTo(1, EPSILON);
      expect(m.elements[5]).to.be.closeTo(1, EPSILON);
      expect(m.elements[10]).to.be.closeTo(-2 / 99, EPSILON);
      expect(m.elements[12]).to.be.closeTo(0, EPSILON);
    });

    it('should create LookAt matrix', () => {
      const eye = new Vector3(0, 0, 0);
      const target = new Vector3(0, 0, -1);
      const up = new Vector3(0, 1, 0);
      const m = new Matrix4x4().setFromLookAt(eye, target, up);

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
        .setFromTranslation(translation)
        .multiply(new Matrix4x4().setFromScaling(scale))
        .multiply(new Matrix4x4().setFromRotationQuaternion(rotation));

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
        .setFromTranslation(new Vector3(1, 2, 3))
        .multiply(
          new Matrix4x4().setFromRotationQuaternion(
            new Quaternion(0, 0, Math.sin(Math.PI / 4), Math.cos(Math.PI / 4))
          )
        )
        .multiply(new Matrix4x4().setFromScaling(new Vector3(2, 3, 4)));

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
        .multiply(new Matrix4x4().setFromScaling(new Vector3(2, 2, 2)))
        .transpose()
        .invert();

      // After all operations, result should still be a valid matrix
      expect(m.elements.length).to.equal(16);
    });
  });

  describe('Matrix4x4 alias methods', () => {
    it('translate() alias should match fromTranslation', () => {
      const v = new Vector3(1, 2, 3);
      const m1 = new Matrix4x4().setFromTranslation(v);
      const m2 = new Matrix4x4().identity().translate(v);
      expect(m2.equals(m1, EPSILON)).to.be.true;

      const out = m2.applyToVector3(new Vector3(0, 0, 0));
      expect(out.x).to.be.closeTo(1, EPSILON);
      expect(out.y).to.be.closeTo(2, EPSILON);
      expect(out.z).to.be.closeTo(3, EPSILON);
    });

    it('scale() alias should match fromScaling', () => {
      const s = new Vector3(2, 3, 4);
      const m1 = new Matrix4x4().setFromScaling(s);
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
      const m1 = new Matrix4x4().setFromRotationQuaternion(q);
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

      const m1 = new Matrix4x4().setFromLookAt(eye, target, up);
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
      const m = new Matrix4x4().identity().setFromEuler(0, 0, angle);

      const v = new Vector3(1, 0, 0);
      const x = m.elements[0] * v.x + m.elements[4] * v.y + m.elements[8] * v.z;
      const y = m.elements[1] * v.x + m.elements[5] * v.y + m.elements[9] * v.z;

      expect(x).to.be.closeTo(0, EPSILON);
      expect(y).to.be.closeTo(1, EPSILON);
    });

    it('should allow chaining with translation', () => {
      const m = new Matrix4x4()
        .identity()
        .setFromEuler(Math.PI / 4, 0, 0) // rotate 45° around X
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

  describe('Matrix4x4 compose() / decompose()', () => {
    it('should correctly round-trip a simple non-mirrored transform', () => {
      const position = new Vector3(1, 2, 3);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0, 1, 0),
        Math.PI / 4
      );
      const scale = new Vector3(2, 2, 2);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);

      expect(p2.equals(position, 1e-6)).to.be.true;
      expect(s2.equals(scale, 1e-6)).to.be.true;

      // quaternions can differ by sign and still represent same rotation
      const qAlt = q2.clone().negate();
      const sameRotation =
        q2.equals(quaternion, 1e-6) || qAlt.equals(quaternion, 1e-6);
      expect(sameRotation).to.be.true;
    });

    it('should round-trip a random mirrored transform via recompose', () => {
      const position = new Vector3(5, -2, 1);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(1, 0, 0),
        Math.PI / 3
      );
      const scale = new Vector3(1, -2, 3); // negative determinant (mirror)

      const m = new Matrix4x4().compose(position, quaternion, scale);
      expect(m.determinant()).to.be.lessThan(0);

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);
      const recomposed = new Matrix4x4().compose(p2, q2, s2);

      const equal = matricesAlmostEqual(m, recomposed);
      expect(equal).to.be.true;
    });

    it('should round-trip multiple random transforms, mirrored and non-mirrored', () => {
      for (let i = 0; i < 20; i++) {
        const position = new Vector3(
          Math.random(),
          Math.random(),
          Math.random()
        );
        const axis = new Vector3(
          Math.random(),
          Math.random(),
          Math.random()
        ).normalize();
        const angle = Math.random() * Math.PI * 2;
        const quaternion = Quaternion.fromAxisAngle(axis, angle);

        // random scale, sometimes negative
        const scale = new Vector3(
          (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 2),
          (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 2),
          (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 2)
        );

        const m = new Matrix4x4().compose(position, quaternion, scale);
        const det = m.determinant();

        const p2 = new Vector3(),
          q2 = new Quaternion(),
          s2 = new Vector3();
        m.decompose(p2, q2, s2);
        const recomposed = new Matrix4x4().compose(p2, q2, s2);

        const equal = matricesAlmostEqual(m, recomposed, 1e-4, 1e-4);
        expect(
          equal,
          `Failed on iteration ${i} (det=${det}, composed=[${m.elements}], recomposed=[${recomposed.elements}])`
        ).to.be.true;
      }
    });

    it('should preserve position exactly in all cases', () => {
      const position = new Vector3(10, -5, 3.2);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0, 0, 1),
        Math.PI / 5
      );
      const scale = new Vector3(-1, 2, 1);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);

      expect(p2.equals(position, 1e-6)).to.be.true;
    });

    it('should handle zero scale gracefully', () => {
      const position = new Vector3(1, 2, 3);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0, 1, 0),
        Math.PI / 2
      );
      const scale = new Vector3(0, 0, 0);

      const m = new Matrix4x4().compose(position, quaternion, scale);

      // Determinant should be 0 for collapsed geometry
      expect(Math.abs(m.determinant())).to.be.lessThan(1e-12);

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);

      // Translation should still match
      expect(p2.equals(position, 1e-6)).to.be.true;
      // Scale recovered as near-zero
      expect(s2.length() < 1e-6).to.be.true;
    });

    it('should handle extremely small scales without numerical instability', () => {
      const position = new Vector3(0.001, -0.002, 0.003);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(1, 1, 0).normalize(),
        Math.PI / 4
      );
      const scale = new Vector3(1e-8, 2e-8, 3e-8);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);

      expect(p2.equals(position, 1e-6)).to.be.true;
      // Should at least roughly preserve relative scale ratios
      const ratioOrig = scale.y / scale.x;
      const ratioDecomp = s2.y / s2.x;
      expect(ratioDecomp / ratioOrig).to.be.closeTo(1, 1e-3);
    });

    it('should handle extremely large scales without overflow or NaN', () => {
      const position = new Vector3(1e6, 2e6, -3e6);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0, 0, 1),
        Math.PI / 3
      );
      const scale = new Vector3(1e5, -2e5, 3e5);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const det = m.determinant();
      expect(isFinite(det)).to.be.true;

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);
      const recomposed = new Matrix4x4().compose(p2, q2, s2);

      expect(matricesAlmostEqual(m, recomposed)).to.be.true;
    });

    it('should handle non-uniform but orthogonal scale correctly', () => {
      const position = new Vector3(-2, 4, 1);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0, 1, 0),
        Math.PI / 6
      );
      const scale = new Vector3(2, 3, 4);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);

      expect(p2.equals(position, 1e-6)).to.be.true;
      expect(s2.equals(scale, 1e-5)).to.be.true;

      // Quaternions can differ by sign, but rotation should be preserved
      const qAlt = q2.clone().negate();
      const sameRotation =
        q2.equals(quaternion, 1e-5) || qAlt.equals(quaternion, 1e-5);
      expect(sameRotation).to.be.true;
    });

    it('should correctly round-trip a mirrored + non-uniform transform', () => {
      const position = new Vector3(3, -1, 2);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0.5, 0.5, 0.5).normalize(),
        Math.PI / 4
      );
      const scale = new Vector3(-1, 2, 0.5); // mirrored on X

      const m = new Matrix4x4().compose(position, quaternion, scale);
      expect(m.determinant()).to.be.lessThan(0);

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      m.decompose(p2, q2, s2);
      const recomposed = new Matrix4x4().compose(p2, q2, s2);

      const equal = matricesAlmostEqual(m, recomposed);
      expect(equal).to.be.true;
    });

    it('should recover consistent results under small random noise', () => {
      const position = new Vector3(1.5, -2.0, 0.75);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0.3, 0.9, 0.1).normalize(),
        Math.PI / 3
      );
      const scale = new Vector3(2, -1, 0.5);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const noisy = addMatrixNoise(m, 1e-6);

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      noisy.decompose(p2, q2, s2);

      const recomposed = new Matrix4x4().compose(p2, q2, s2);

      expect(matricesAlmostEqual(m, recomposed, 1e-4, 1e-4)).to.be.true;
    });

    it('should produce stable scale vectors even with rounding noise', () => {
      const position = new Vector3(0, 0, 0);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(1, 1, 0).normalize(),
        Math.PI / 8
      );
      const scale = new Vector3(2.0, 3.0, 4.0);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const noisy = addMatrixNoise(m, 1e-7);

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      noisy.decompose(p2, q2, s2);

      expect(s2.equals(scale, 1e-3)).to.be.true;
    });

    it('should produce a normalized quaternion after decompose()', () => {
      const position = new Vector3(0.5, 1.0, -2.0);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0, 1, 0),
        Math.PI / 4
      );
      const scale = new Vector3(1, 2, 3);

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const noisy = addMatrixNoise(m, 1e-8);

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      noisy.decompose(p2, q2, s2);

      const length = Math.sqrt(
        q2.x * q2.x + q2.y * q2.y + q2.z * q2.z + q2.w * q2.w
      );
      expect(length).to.be.closeTo(1, 1e-6);
    });

    it('should maintain orientation consistency under noise (up to sign)', () => {
      const position = new Vector3(0, 0, 0);
      const quaternion = Quaternion.fromAxisAngle(
        new Vector3(0, 0, 1),
        Math.PI / 3
      );
      const scale = new Vector3(1, -2, 1); // mirrored

      const m = new Matrix4x4().compose(position, quaternion, scale);
      const noisy = addMatrixNoise(m, 1e-6);

      const p2 = new Vector3(),
        q2 = new Quaternion(),
        s2 = new Vector3();
      noisy.decompose(p2, q2, s2);

      const qAlt = q2.clone().negate();
      const sameRotation =
        q2.equals(quaternion, 1e-3) || qAlt.equals(quaternion, 1e-3);
      expect(sameRotation).to.be.true;
    });
  });
});
