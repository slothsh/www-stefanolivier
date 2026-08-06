export interface NoiseOptions {
    octaves?: number;
    persistence?: number;
    lacunarity?: number;
    frequency?: number;
}

const DEFAULT_OCTAVES = 4;
const DEFAULT_PERSISTENCE = 0.5;
const DEFAULT_LACUNARITY = 2.0;
const DEFAULT_FREQUENCY = 3.0;

function hash2(ix: number, iy: number, seed: number): number {
    let h = (ix * 374761393 + iy * 668265263 + seed * 1442695041) | 0;
    h = (h ^ (h >> 13)) | 0;
    h = Math.imul(h, 1274126177);
    h = (h ^ (h >> 16)) | 0;
    return (h >>> 0) / 4294967295;
}

function smoothstep(t: number): number {
    return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, seed: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const v00 = hash2(ix, iy, seed);
    const v10 = hash2(ix + 1, iy, seed);
    const v01 = hash2(ix, iy + 1, seed);
    const v11 = hash2(ix + 1, iy + 1, seed);

    const sx = smoothstep(fx);
    const sy = smoothstep(fy);

    const top = v00 + (v10 - v00) * sx;
    const bottom = v01 + (v11 - v01) * sx;
    return top + (bottom - top) * sy;
}

function fbm(x: number, y: number, seed: number, octaves: number, persistence: number, lacunarity: number): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxAmplitude = 0;

    for (let o = 0; o < octaves; o++) {
        value += valueNoise(x * frequency, y * frequency, seed + o * 101) * amplitude;
        maxAmplitude += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    return value / maxAmplitude;
}

export function generateNoiseGrid(
    cols: number,
    rows: number,
    seed: number,
    time: number,
    options?: NoiseOptions,
): number[][] {
    const octaves = options?.octaves ?? DEFAULT_OCTAVES;
    const persistence = options?.persistence ?? DEFAULT_PERSISTENCE;
    const lacunarity = options?.lacunarity ?? DEFAULT_LACUNARITY;
    const frequency = options?.frequency ?? DEFAULT_FREQUENCY;

    const grid: number[][] = new Array(rows);
    const driftX = time * 0.7;
    const driftY = time * 0.4;

    for (let j = 0; j < rows; j++) {
        const row: number[] = new Array(cols);
        const ny = (j / rows) * frequency + driftY;
        for (let i = 0; i < cols; i++) {
            const nx = (i / cols) * frequency + driftX;
            row[i] = fbm(nx, ny, seed, octaves, persistence, lacunarity) * 2 - 1;
        }
        grid[j] = row;
    }

    return grid;
}
