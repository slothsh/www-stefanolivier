export {};

class Color {
    constructor(r: number, g?: number, b?: number) {
        this._rgb = Vector.xyz(r, g ?? r, b ?? g ?? r);
    }

    get hex(): `#${string}` {
        return `#${this._rgb.x.toString(16)}${this._rgb.y.toString(16)}${this._rgb.z.toString(16)}`;
    }

    get vec(): Vec3 {
        return this._rgb;
    }

    private _rgb: Vec3;
}

declare global {
    interface Colors {
        primary: (darkMode: boolean) => Color,
        primaryMuted: (darkMode: boolean) => Color,
        secondary: (darkMode: boolean) => Color,
        secondaryMuted: (darkMode: boolean) => Color,
        border: (darkMode: boolean) => Color,
        accentPrimary: (darkMode: boolean) => Color,
        accentSecondary: (darkMode: boolean) => Color,
        darker:(darkMode: boolean) => Color,
    }

    interface Theme {
        colors: Colors,
    }

    var Theme: Theme;
}

(globalThis as any).Theme = {
    colors: {
        primary: (darkMode: boolean) => darkMode ? new Color(8, 16, 18) : new Color(204, 221, 238),
        secondary: (darkMode: boolean) => darkMode ? new Color(204, 221, 238) : new Color(8, 16, 18),
        border: (darkMode: boolean) => darkMode ? new Color(32, 53, 69) : new Color(160, 181, 197),
        accentPrimary: (darkMode: boolean) => darkMode ? new Color(0, 34, 2) : new Color(114, 194, 130),
        accentSecondary: (darkMode: boolean) => darkMode ? new Color(114, 194, 130) : new Color(0, 34, 2),
        darker: (darkMode: boolean) => darkMode ? new Color(32, 52, 68) : new Color(202, 218, 255),
    }
};
