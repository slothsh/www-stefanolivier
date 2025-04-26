export {};

declare global {
    interface Str {
        capitalize<T>(str: string): string;
        lowerCase<T>(str: string): string;
        slugify<T>(str: string): string;
    }

    var Str: Str;
}

(globalThis as any).Str = {
    capitalize(str: string): string {
        if (!str) return '';

        return str
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + str.slice(1))
            .join(' ')
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + str.slice(1))
            .join('-');
    },

    lowerCase(str: string): string {
        return str.toLowerCase();
    },

    slugify(str: string): string {
        return str
            .trim()
            .replaceAll(/[^A-z0-9]/g, '-')
            .toLowerCase();
    }
};
