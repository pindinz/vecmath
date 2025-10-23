/**
 * Class representing a vector in 4D space (homogenous coordinates)
 */
export class Vector4 {
    static zero(): Vector4;
    static one(): Vector4;
    static unitX(): Vector4;
    static unitY(): Vector4;
    static unitZ(): Vector4;
    static unitW(): Vector4;
    constructor(x?: number, y?: number, z?: number, w?: number);
    elements: Float32Array<ArrayBuffer>;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set z(v: number);
    get z(): number;
    set w(v: number);
    get w(): number;
    set(x: any, y: any, z: any, w: any): this;
    copy(v: any): this;
    clone(): Vector4;
    add(v: any): this;
    sub(v: any): this;
    multiplyScalar(s: any): this;
    divideScalar(s: any): this;
    dot(v: any): number;
    lengthSq(): number;
    length(): number;
    normalize(): this;
    negate(): this;
    applyMatrix4(m: any): this;
    equals(v: any, epsilon?: number): boolean;
    toArray(): number[];
    fromArray(arr: any, offset?: number): this;
}
