<script lang="ts" context="module">
import '@/Lib/lib';
import type { CanvasProps } from '@/types';

type Props = CanvasProps & {
    strokeColor?: string,
};

const TOTAL_LINES = 80;

export function crossHatch({
    ctx,
    canvas,
    strokeColor = 'rgba(32, 53, 69, 1)',
}: Props) {
    const lineSpacing = canvas.width * 1.5 / TOTAL_LINES;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = strokeColor;

    for (let n = 0; n < TOTAL_LINES; ++n) {
        ctx.beginPath();
        ctx.moveTo(n * lineSpacing, 0);
        ctx.lineTo(0, n * lineSpacing);
        ctx.stroke();
    }
}
</script>
