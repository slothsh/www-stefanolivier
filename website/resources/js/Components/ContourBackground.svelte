<script lang="ts">
import { ContourRenderer } from '@/Lib/ContourRenderer';
import type { ContourColor } from '@/Lib/ContourRenderer';
import { computeContours } from '@/Lib/ContourComputer';
import { generateNoiseGrid } from '@/Lib/NoiseField';

const DEFAULT_COLORS: ContourColor[] = [
    { r: 0.353, g: 0.478, b: 0.373, a: 0.55 },
    { r: 0.427, g: 0.561, b: 0.447, a: 0.45 },
    { r: 0.541, g: 0.667, b: 0.557, a: 0.35 },
    { r: 0.306, g: 0.42, b: 0.325, a: 0.6 },
];

const COLOR_VARS = ['--contour-color-base', '--contour-color-mid', '--contour-color-faint', '--contour-color-accent'];

function parseHexColor(value: string): { r: number; g: number; b: number } | null {
    const match = /^#?([0-9a-f]{6})$/i.exec(value.trim());
    if (!match) return null;
    const int = parseInt(match[1], 16);
    return { r: ((int >> 16) & 255) / 255, g: ((int >> 8) & 255) / 255, b: (int & 255) / 255 };
}

function resolveThemeColors(): ContourColor[] {
    const styles = getComputedStyle(document.documentElement);
    return COLOR_VARS.map((name, i) => {
        const parsed = parseHexColor(styles.getPropertyValue(name));
        if (!parsed) return DEFAULT_COLORS[i];
        return { ...parsed, a: DEFAULT_COLORS[i].a };
    });
}

let {
    gridCols = 80,
    gridRows = 60,
    levelCount = 10,
    animationSpeed = 0.0003,
    seed = 42,
    lineWidth = 1,
    showThroughContent = false,
    colors,
}: {
    gridCols?: number;
    gridRows?: number;
    levelCount?: number;
    animationSpeed?: number;
    seed?: number;
    lineWidth?: number;
    showThroughContent?: boolean;
    colors?: ContourColor[];
} = $props();

let canvasEl: HTMLCanvasElement | undefined = $state();

$effect(() => {
    const canvas = canvasEl;
    if (!canvas) return;

    const renderer = new ContourRenderer(canvas, { lineWidth });
    renderer.setColors(colors ?? resolveThemeColors());
    renderer.resize(window.innerWidth, window.innerHeight);

    let time = 0;
    let frameId = 0;
    let running = true;

    const loop = () => {
        if (!running) return;
        time += animationSpeed;
        const grid = generateNoiseGrid(gridCols, gridRows, seed, time);
        const { vertices, levels, segmentCount } = computeContours(grid, gridCols, gridRows, levelCount);
        renderer.updateData(vertices, levels, segmentCount);
        renderer.render();
        frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    const onResize = () => renderer.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onResize);

    return () => {
        running = false;
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', onResize);
        renderer.destroy();
    };
});
</script>

<canvas
    bind:this={canvasEl}
    class="fixed inset-0 z-0 h-full w-full pointer-events-none"
    class:opacity-50={!showThroughContent}
></canvas>
