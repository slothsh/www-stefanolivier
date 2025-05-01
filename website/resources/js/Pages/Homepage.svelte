<script lang="ts">
import Canvas from '@/Components/Canvas.svelte';
import NavigationLayout from '@/Components/NavigationLayout.svelte';
import SocialLinks from '@/Components/SocialLinks.svelte';
import { lattice } from '@/Lib/Canvas/lattice.svelte';
import { useClientWindow } from '@/Lib/dom.svelte';

const clientWindow = useClientWindow();

let canvasRect = $derived(
    Vector.xwyh(0, $clientWindow.width * $clientWindow.scale, 0, $clientWindow.height * $clientWindow.scale)
);
</script>

<NavigationLayout class="relative overflow-hidden h-screen" enableFooter={false} title="Home">
    <Canvas class="absolute w-full h-full" rect={canvasRect} program={lattice} />

    <div class="flex flex-row w-full items-center left-0 min-h-[768px]">
        <div class="relative flex flex-col justify-center items-center w-full px-16 border-border text-center">
            <div class="flex flex-col mb-8 max-w-page">
                <h1 class="w-full font-bold text-7xl">{Bio.name}</h1>
                <h1 class="w-full font-medium text-4xl">{Bio.occupation}</h1>
            </div>
            <p class="font-normal max-w-page mb-16">{Bio.about}</p>
            <SocialLinks />
        </div>
    </div>
</NavigationLayout>
