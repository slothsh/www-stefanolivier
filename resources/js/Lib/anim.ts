export {};

declare global {
    interface Anim {
        easeInOutSine(n: number): number,
        easeInOutQuint(n: number): number,
        easeOutBounce(n: number): number,
    }

    var Anim: Anim;
}

(globalThis as any).Anim = {
    easeInOutSine(n: number): number {
        return -(Math.cos(Math.PI * n) - 1) / 2;
    },

    easeInOutQuint(n: number): number {
        return n < 0.5 ? 16 * n * n * n * n * n : 1 - Math.pow(-2 * n + 2, 5) / 2;
    },

    easeOutBounce(n: number): number {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (n < 1 / d1) {
            return n1 * n * n;
        } else if (n < 2 / d1) {
            return n1 * (n -= 1.5 / d1) * n + 0.75;
        } else if (n < 2.5 / d1) {
            return n1 * (n -= 2.25 / d1) * n + 0.9375;
        } else {
            return n1 * (n -= 2.625 / d1) * n + 0.984375;
        }

    }
}
