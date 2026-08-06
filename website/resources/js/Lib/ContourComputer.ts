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

    const conrec = new Conrec();
    conrec.contour(d, 0, cols - 1, 0, rows - 1, xCoords, yCoords, nc, z);

    const contourList = conrec.contourList;

    let totalSegments = 0;
    for (let c = 0; c < contourList.length; c++) {
        const contour = contourList[c];
        if (contour.length > 1) {
            totalSegments += contour.length - 1;
        }
    }

    if (totalSegments === 0) {
        return { vertices: new Float32Array(0), levels: new Float32Array(0), segmentCount: 0 };
    }

    const vertices = new Float32Array(totalSegments * 4);
    const levels = new Float32Array(totalSegments * 2);
    let offset = 0;
    let levelOffset = 0;
    for (let c = 0; c < contourList.length; c++) {
        const contour = contourList[c];
        const levelIndex = Number(contour.k) || 0;
        for (let p = 0; p < contour.length - 1; p++) {
            const a = contour[p];
            const b = contour[p + 1];
            vertices[offset++] = a.x;
            vertices[offset++] = a.y;
            vertices[offset++] = b.x;
            vertices[offset++] = b.y;
            levels[levelOffset++] = levelIndex;
            levels[levelOffset++] = levelIndex;
        }
    }

    return { vertices, levels, segmentCount: totalSegments };
}
