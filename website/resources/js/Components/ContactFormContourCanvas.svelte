<script lang="ts">
import { ContourRenderer } from '@/Lib/ContourRenderer';
import type { ContourColor } from '@/Lib/ContourRenderer';
import { contourSync } from '@/Lib/ContourSync';

function resolveThemeColors(): ContourColor[] {
    const styles = getComputedStyle(document.documentElement);
    const bg = parseHexColor(styles.getPropertyValue('--bg')) ?? { r: 0.059, g: 0.078, b: 0.059 };
    return [
        { ...bg, a: 0.55 },
        { ...bg, a: 0.45 },
        { ...bg, a: 0.35 },
        { ...bg, a: 0.6 },
    ];
}

function parseHexColor(value: string): { r: number; g: number; b: number } | null {
    const match = /^#?([0-9a-f]{6})$/i.exec(value.trim());
    if (!match) return null;
    const int = parseInt(match[1], 16);
    return { r: ((int >> 16) & 255) / 255, g: ((int >> 8) & 255) / 255, b: (int & 255) / 255 };
}

let {
    lineWidth = 1,
}: {
    lineWidth?: number;
} = $props();

let canvasEl: HTMLCanvasElement | undefined = $state();

$effect(() => {
    const canvas = canvasEl;
    if (!canvas) return;

    const renderer = new ContourRenderer(canvas, { lineWidth });
    renderer.setColors(resolveThemeColors());
    renderer.resize(window.innerWidth, window.innerHeight);

    contourSync.addRenderer(renderer);

    const onResize = () => renderer.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onResize);

    return () => {
        window.removeEventListener('resize', onResize);
        contourSync.removeRenderer(renderer);
        renderer.destroy();
    };
});
</script>

<canvas
    bind:this={canvasEl}
    class="absolute inset-0 w-full h-full pointer-events-none"
></canvas>
