// test/Quaternion.test.js
import { expect } from 'chai';
import { Quaternion } from '../src/Quaternion.js';
import { Vector3 } from '../src/Vector3.js';

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
        expect(q.equals(new Quaternion(1/len, 2/len, 3/len, 4/len))).to.be.true;
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
        q.applyToVector3(v);
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
});
