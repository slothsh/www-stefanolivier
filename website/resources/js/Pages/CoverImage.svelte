<script lang="ts">
const gridSize = 32;

const { html, width, height }: {
    html?: string,
    width: number,
    height: number,
} = $props();

const verticalLines = Array.from({ length: Math.floor(width / gridSize) + 1 }, (_, i) => i * gridSize);
const horizontalLines = Array.from({ length: Math.floor(height / gridSize) + 1 }, (_, i) => i * gridSize);
</script>

<main class="absolute top-0 left-0 w-full h-full bg-radial from-[#2a352a] to-[#1f2a1f]">
    <div class="relative flex w-full h-full justify-center items-center gap-2 text-[#e8e8e8] text-[96px] font-bold">
        <svg class="absolute top-0 left-0" {width} {height} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="radial-mask" cx="50%" cy="50%" r="50%">
                    <stop offset="50%" stop-color="#1a1f1a" stop-opacity="1" />
                    <stop offset="100%" stop-color="#1a1f1a" stop-opacity="0" />
                </radialGradient>
                <mask id="mask">
                    <rect {width} {height} fill="url(#radial-mask)" />
                </mask>
            </defs>

            <g mask="url(#mask)">
                {#each verticalLines as x}
                    <line x1={x} y1={0} x2={x} y2={height} stroke="#ccc" stroke-width="0.5" />
                {/each}

                {#each horizontalLines as y}
                    <line x1={0} y1={y} x2={width} y2={y} stroke="#ccc" stroke-width="0.5" />
                {/each}
            </g>
        </svg>
        {@html html}
    </div>
</main>

