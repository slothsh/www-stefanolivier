export {};

declare global {
    interface Arr {
        randomItem<T>(items: T[]): T ;
    }

    var Arr: Arr;
}

(globalThis as any).Arr = {
    randomItem<T>(items: T[]): T {
        return items[Math.randomInt(0, items.length)];
    }
};
