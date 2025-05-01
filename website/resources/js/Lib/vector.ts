export {};

declare global {
    type Vec2 = Vector2;
    type Vec3 = Vector3;
    type Rect = Rectangle;

    let Vector: {
        xy(x: number, y?: number): Vector2;
        xyz(x: number, y?: number, z?: number): Vector2;
        xwyh(x: number, w: number, y?: number, h?: number): Rectangle;
    };
}

class Rectangle {
    constructor(x: number, w: number, y: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    public x: number;
    public y: number;
    public w: number;
    public h: number;
}

class Vector2 {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(n: number): void {
        this.x += n;
        this.y += n;
    }

    public sub(n: number): void {
        this.x -= n;
        this.y -= n;
    }

    public plus(other: Vector2): void {
        this.x += other.x;
        this.y += other.y;
    }

    public diff(other: Vector2): void {
        this.x -= other.x;
        this.y -= other.y;
    }

    public mul(n: number): void {
        this.x *= n;
        this.y *= n;
    }

    public withMul(n: number): Vector2 {
        return Vector.xy(this.x * n, this.y * n);
    }

    public div(n: number): void {
        if (n === 0) {
            throw new Error('divide by zero');
        }

        this.x /= n;
        this.y /= n;
    }

    public withDiv(n: number): Vector2 {
        if (n === 0) {
            throw new Error('divide by zero');
        }

        return Vector.xy(this.x / n, this.y / n);
    }

    public avg(): number {
        return Math.sqrt(Math.pow(this.x + this.y, 2)) / 2;
    }

    public distance(to: Vector2): number {
        return Math.sqrt(Math.pow(to.x - this.x, 2) + Math.pow(to.y - this.y, 2));
    }

    public x: number;
    public y: number;
}

class Vector3 {
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public add(n: number): void {
        this.x += n;
        this.y += n;
        this.z += n;
    }

    public sub(n: number): void {
        this.x -= n;
        this.y -= n;
        this.z -= n;
    }

    public mul(n: number): void {
        this.x *= n;
        this.y *= n;
        this.z *= n;
    }

    public div(n: number): void {
        if (n === 0) {
            throw new Error('divide by zero');
        }

        this.x /= n;
        this.y /= n;
        this.z /= n;
    }

    public avg(): number {
        return (this.x + this.y + this.x) / 3;
    }

    public x: number;
    public y: number;
    public z: number;
}

(globalThis as any).Vector = {
    xy(x: number, y?: number): Vector2 {
        return new Vector2(x, y ?? x);
    },

    xyz(x: number, y?: number, z?: number): Vector3 {
        return new Vector3(x, y ?? x, z ?? y ?? x);
    },

    xwyh(x: number, w: number, y?: number, h?: number): Rectangle {
        return new Rectangle(x, w, y ?? x, h ?? w);
    }
};
