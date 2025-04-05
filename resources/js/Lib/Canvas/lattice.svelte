<script lang="ts" context="module">
import '@/Lib/lib';
import type { CanvasProps } from '@/types';

type Props = CanvasProps;

let PROGRESS = $state(0);
let CURSOR_VELOCITY = $state(0.0);
let CURSOR_LAST = $state(Vector.xy(0, 0));
let BULGE_RESET_DELAY = $state(0);

// Wave Parameters
type WavePoint = {
    position: Vec2,
    falloff: number,
};

export function lattice({
    ctx,
    canvas,
    singleFrameDuration,
    fps,
    deltaTime,
    clientWindow,
    clientCursor,
}: Props) {
    // Grid Parameters
    const gridSize = 25;
    const extraSize = 20;
    const totalColumns = Math.floor(canvas.width / gridSize) + extraSize;
    const totalRows = Math.floor(canvas.height / gridSize) + extraSize;
    const grid = Vector.xy(totalColumns, totalRows);

    // Animation Parameters
    const sequenceDuration = 10000 / fps;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cursor = Vector.xy(
        clientCursor.position.x / clientWindow.width * canvas.width - (gridSize / 2),
        clientCursor.position.y / clientWindow.height * canvas.height - (gridSize / 2),
    );

    const cursorMoved = CURSOR_LAST.distance(cursor) >= Math.EPSILON;
    if (cursorMoved) {
        BULGE_RESET_DELAY = 0.0;
    }

    if (BULGE_RESET_DELAY > singleFrameDuration / 2) {
        CURSOR_VELOCITY -= 0.1;
        if (CURSOR_VELOCITY < Math.EPSILON) {
            CURSOR_VELOCITY = 0.0;
        }
    }

    for (let y = 0 - Math.floor(extraSize / 2); y < grid.y; ++y) {
        for (let x = 0 - Math.floor(extraSize / 2); x < grid.x; ++x) {
            const sizeFactor = Math.min(0.95, y / totalRows + 0.05);
            const halfSize = gridSize * sizeFactor / 2;

            // 1
            const ox = x * gridSize;
            const oy = y * gridSize;
            const theta = Math.atan2(oy - cursor.y, ox - cursor.x);
            const tx = Math.cos(theta) * gridSize * 3.0 * CURSOR_VELOCITY;
            const ty = Math.sin(theta) * gridSize * 3.0 * CURSOR_VELOCITY;
            const srx = Math.cos(PROGRESS) * gridSize / 4;
            const sry = Math.sin(PROGRESS) * gridSize / 4;

            // 2
            const oox = (x + 1) * gridSize;
            const ooy = (y + 0) * gridSize;
            const thetaNext = Math.atan2(ooy - cursor.y, oox - cursor.x);
            const ttx = Math.cos(thetaNext) * gridSize * 3.0 * CURSOR_VELOCITY;
            const tty = Math.sin(thetaNext) * gridSize * 3.0 * CURSOR_VELOCITY;

            // 3
            const ooox = (x + 0) * gridSize;
            const oooy = (y + 1) * gridSize;
            const thetaNextNext = Math.atan2(oooy - cursor.y, ooox - cursor.x);
            const tttx = Math.cos(thetaNextNext) * gridSize * 3.0 * CURSOR_VELOCITY;
            const ttty = Math.sin(thetaNextNext) * gridSize * 3.0 * CURSOR_VELOCITY;

            let alphaVelocity = Math.max(0, 1 - CURSOR_VELOCITY);
            const fillOpacity = Math.max(alphaVelocity, cursor.withDiv(256.0).distance(Vector.xy(ox / 256.0, oy / 256.0)));
            const strokeOpacity = fillOpacity;
            ctx.fillStyle = `rgba(32, 53, 69, ${fillOpacity})`;
            ctx.strokeStyle = `rgba(21, 48, 64, ${strokeOpacity})`

            ctx.beginPath();
            ctx.moveTo(ox + tx + srx + halfSize, oy + ty + sry + halfSize);
            ctx.lineTo(oox + ttx + srx + halfSize, ooy + tty + sry + halfSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(ox + tx + srx + halfSize, oy + ty + sry + halfSize);
            ctx.lineTo(ooox + tttx + srx + halfSize, oooy + ttty + sry + halfSize);
            ctx.stroke();

            ctx.fillRect(ox + tx + srx, oy + ty + sry, gridSize * sizeFactor, gridSize * sizeFactor);
        }
    }

    CURSOR_VELOCITY = Math.min(1, CURSOR_VELOCITY + CURSOR_LAST.distance(cursor) * 0.01);
    CURSOR_LAST = cursor;
    PROGRESS += (2 * Math.PI / sequenceDuration);
    BULGE_RESET_DELAY += deltaTime;
    if (PROGRESS >= 2 * Math.PI) {
        PROGRESS -= 2 * Math.PI;
    }
}
</script>
