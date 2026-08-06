import Conrec from './conrect';

export interface ContourResult {
    vertices: Float32Array;
    levels: Float32Array;
    segmentCount: number;
}

const LEVEL_EPSILON = 1e-6;

export function computeContours(
    data: number[][],
    cols: number,
    rows: number,
    levelCount: number,
): ContourResult {
    if (rows < 2 || cols < 2 || data.length === 0) {
        return { vertices: new Float32Array(0), levels: new Float32Array(0), segmentCount: 0 };
    }

    let min = Infinity;
    let max = -Infinity;
    for (let j = 0; j < rows; j++) {
        const row = data[j];
        if (!row) continue;
        for (let i = 0; i < cols; i++) {
            const v = row[i];
            if (v < min) min = v;
            if (v > max) max = v;
        }
    }

    if (!isFinite(min) || !isFinite(max) || max - min < 1e-9) {
        return { vertices: new Float32Array(0), levels: new Float32Array(0), segmentCount: 0 };
    }

    const nc = Math.max(1, levelCount);
    const z: number[] = new Array(nc);
    for (let k = 0; k < nc; k++) {
        z[k] = min + ((k + 1) / (nc + 1)) * (max - min) + LEVEL_EPSILON;
    }

    const xCoords: number[] = new Array(cols);
    for (let i = 0; i < cols; i++) {
        xCoords[i] = (i / (cols - 1)) * 2 - 1;
    }

    const yCoords: number[] = new Array(rows);
    for (let j = 0; j < rows; j++) {
        yCoords[j] = 1 - (j / (rows - 1)) * 2;
    }

    const d: number[][] = new Array(cols);
    for (let i = 0; i < cols; i++) {
        const col: number[] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            col[j] = data[j][i];
        }
        d[i] = col;
    }

    const initialCap = Math.min((cols - 1) * (rows - 1) * 4 * nc, 120000);
    let vertexData = new Float32Array(initialCap * 4);
    let levelData = new Float32Array(initialCap * 2);
    let segIdx = 0;

    const conrec = new Conrec((startX, startY, endX, endY, _contourLevel, k) => {
        if (!isFinite(startX) || !isFinite(startY) || !isFinite(endX) || !isFinite(endY)) {
            return;
        }
        if (segIdx >= vertexData.length / 4) {
            const grow = new Float32Array(vertexData.length * 2);
            grow.set(vertexData);
            vertexData = grow;
            const growLvl = new Float32Array(levelData.length * 2);
            growLvl.set(levelData);
            levelData = growLvl;
        }
        const vi = segIdx * 4;
        const li = segIdx * 2;
        vertexData[vi] = startX;
        vertexData[vi + 1] = startY;
        vertexData[vi + 2] = endX;
        vertexData[vi + 3] = endY;
        levelData[li] = k;
        levelData[li + 1] = k;
        segIdx++;
    });

    conrec.contour(d, 0, cols - 1, 0, rows - 1, xCoords, yCoords, nc, z);

    if (segIdx === 0) {
        return { vertices: new Float32Array(0), levels: new Float32Array(0), segmentCount: 0 };
    }

    return {
        vertices: vertexData.slice(0, segIdx * 4),
        levels: levelData.slice(0, segIdx * 2),
        segmentCount: segIdx,
    };
}