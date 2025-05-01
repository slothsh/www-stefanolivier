<script lang="ts">
import { useClientCursor, useClientWindow } from '@/Lib/dom.svelte';
import type { CanvasProps, ComponentProps } from '@/types';

const clientWindow = useClientWindow();

type Props<A = {}> = ComponentProps<{
    rect: Rect,
    program: (props: CanvasProps<A>) => void,
    programArgs?: A,
}>;

let {
    rect,
    class: _class,
    program,
    programArgs = {},
}: Props = $props();

let canvas: HTMLCanvasElement | null = $state(null);
let ctx: CanvasRenderingContext2D;
let clientCursor = useClientCursor();

const FPS = 60;
const SINGLE_FRAME_DURATION = 1000 / FPS;
let START_TIME = $state(0);
let ELAPSED_TIME = $state(0);

$effect(() => {
    if (canvas) {
        ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high'
        ctx.fillStyle = 'transparent';
    }

    function main(currentTime: DOMHighResTimeStamp) {
        if (!canvas || !ctx) {
            return;
        }

        const deltaTime = currentTime - START_TIME;
        ELAPSED_TIME += deltaTime;

        if (ELAPSED_TIME >= SINGLE_FRAME_DURATION) {
            program({
                ctx,
                canvas,
                fps: FPS,
                singleFrameDuration: SINGLE_FRAME_DURATION,
                startTime: START_TIME,
                elapsedTime: ELAPSED_TIME,
                deltaTime,
                currentTime,
                clientWindow: {...$clientWindow},
                clientCursor: {...$clientCursor},
                ...programArgs,
            });

            ELAPSED_TIME = 0;
        }

        START_TIME = currentTime;
        requestAnimationFrame(main);
    }

    requestAnimationFrame(main);
});
</script>

<canvas bind:this={canvas}
    style:left={`${rect.x}px`}
    style:top={`${rect.y}px`}
    width={rect.w}
    height={rect.h}
    class={_class}
/>
