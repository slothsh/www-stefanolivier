export {};

declare global {
    interface Math {
        EPSILON: number,
        clamp(n: number, min: number, max: number): number,
        randomInt(low: number, high: number): number,
        nmod(n: number, d: number): number,
    }
}

Object.assign(Math, {
    EPSILON: 0.0000000001,

    clamp(n: number, min: number, max: number): number {
        return Math.max(min, Math.min(n, max));
    },


    randomInt(low: number, high: number): number {
        return Math.clamp(
            Math.round(Math.random() * high - low),
            low,
            high - 1
        );
    },

    nmod(n: number, d: number): number {
        return ((n % d) + d) % d;
    },
});
