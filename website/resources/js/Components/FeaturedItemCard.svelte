<script lang="ts">
import type { FeaturedItem } from '@/types';
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface Props {
    item: FeaturedItem;
}

let { item }: Props = $props();

function getSourceIcon(sourceType: string) {
    switch (sourceType) {
        case 'github':
            return faGithub;
        default:
            return faArrowUpRightFromSquare;
    }
}
</script>

<article class="group bg-bg border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors cursor-pointer">
    {#if item.imageUrl}
        <div class="aspect-video bg-border overflow-hidden">
            <img
                src={item.imageUrl}
                alt={item.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
    {:else}
        <div class="aspect-video bg-border flex items-center justify-center">
            <Fa icon={getSourceIcon(item.sourceType)} class="text-4xl text-text-muted/50" />
        </div>
    {/if}

    <div class="p-4">
        <h3 class="font-semibold text-lg text-text mb-1 line-clamp-1">
            {item.title}
        </h3>
        <p class="text-sm text-text-muted mb-3 line-clamp-2">
            {item.description}
        </p>
        <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
            <span>{item.linkText}</span>
            <Fa icon={faArrowUpRightFromSquare} class="text-xs" />
        </a>
    </div>
</article>
