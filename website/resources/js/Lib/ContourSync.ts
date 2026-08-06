import { computeContours } from './ContourComputer';
import { generateNoiseGrid } from './NoiseField';
import type { ContourRenderer } from './ContourRenderer';

class ContourSync {
    private renderers: ContourRenderer[] = [];
    private time = 0;
    private frameId = 0;
    private running = false;
    private animationSpeed = 0.0003;
    private gridCols = 100;
    private gridRows = 100;
    private seed = 1337;

    addRenderer(renderer: ContourRenderer): void {
        if (this.renderers.includes(renderer)) return;
        this.renderers.push(renderer);
        if (!this.running) this.start();
    }

    removeRenderer(renderer: ContourRenderer): void {
        this.renderers = this.renderers.filter(r => r !== renderer);
        if (this.renderers.length === 0) this.stop();
    }

    private start(): void {
        this.running = true;
        const loop = () => {
            if (!this.running) return;
            this.time += this.animationSpeed;
            const grid = generateNoiseGrid(this.gridCols, this.gridRows, this.seed, this.time);
            const e1 = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
            const e2 = Math.sqrt(Math.pow(1920, 2) + Math.pow(1080, 2));
            const levelCount = Math.min(30, Math.ceil(e1 / e2 * 30));
            const { vertices, levels, segmentCount } = computeContours(grid, this.gridCols, this.gridRows, levelCount);
            for (const r of this.renderers) {
                r.updateData(vertices, levels, segmentCount);
                r.render();
            }
            this.frameId = requestAnimationFrame(loop);
        };
        this.frameId = requestAnimationFrame(loop);
    }

    private stop(): void {
        this.running = false;
        cancelAnimationFrame(this.frameId);
    }
}

export const contourSync = new ContourSync();