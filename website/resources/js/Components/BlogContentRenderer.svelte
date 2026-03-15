<script lang="ts">
import Fa from 'svelte-fa';
import { faQuestion, faWarning, faLightbulb, faCircleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface StructuredContentChild {
    kind: string;
    content?: string;
    language?: string;
    source?: string;
    height?: number;
    caption?: string;
    icon?: string;
    children?: StructuredContentChild[];
}

interface StructuredContent {
    kind: string;
    content?: string;
    children?: StructuredContentChild[];
}

interface Props {
    content: StructuredContent[];
}

let { content }: Props = $props();

function getCalloutIcon(icon?: string) {
    switch (icon) {
        case 'question': return faQuestion;
        case 'warning': return faWarning;
        case 'hint': return faLightbulb;
        case 'error': return faCircleExclamation;
        case 'info': return faCircleInfo;
        default: return faCircleInfo;
    }
}

function getCalloutClass(icon?: string): string {
    switch (icon) {
        case 'question': return 'bg-blue-500/10 border-blue-500 text-blue-500';
        case 'warning': return 'bg-yellow-500/10 border-yellow-500 text-yellow-500';
        case 'hint': return 'bg-green-500/10 border-green-500 text-green-500';
        case 'error': return 'bg-red-500/10 border-red-500 text-red-500';
        case 'info': return 'bg-blue-500/10 border-blue-500 text-blue-500';
        default: return 'bg-blue-500/10 border-blue-500 text-blue-500';
    }
}
</script>

<div class="space-y-6">
    {#each content as section}
        {#if section.kind === 'section' && section.children}
            {#each section.children as child}
                {#if child.kind === 'heading'}
                    <h2 class="text-2xl font-bold text-text mt-8 mb-4">{child.content}</h2>
                {:else if child.kind === 'paragraph'}
                    <p class="text-text-muted leading-relaxed">{child.content}</p>
                {:else if child.kind === 'code'}
                    <pre class="bg-bg-secondary border border-border rounded-lg p-4 overflow-x-auto"><code class="text-sm text-text-muted font-mono">{child.content}</code></pre>
                {:else if child.kind === 'image'}
                    <figure class="my-6">
                        <img
                            src={child.source}
                            alt={child.caption || ''}
                            class="w-full rounded-lg"
                            style="height: {child.height || 300}px"
                        />
                        {#if child.caption}
                            <figcaption class="text-center text-sm text-text-muted mt-2">{child.caption}</figcaption>
                        {/if}
                    </figure>
                {:else if child.kind === 'callout'}
                    <div class="flex gap-3 p-4 rounded-lg border {getCalloutClass(child.icon)}">
                        <Fa icon={getCalloutIcon(child.icon)} class="flex-shrink-0 mt-0.5" />
                        <div class="text-text-muted">
                            {#if child.content}
                                <p class="font-medium mb-2">{child.content}</p>
                            {/if}
                            {#if child.children}
                                {#each child.children as childContent}
                                    <p class="text-sm">{childContent.content}</p>
                                {/each}
                            {/if}
                        </div>
                    </div>
                {:else if child.kind === 'divider'}
                    <hr class="border-border my-8" />
                {/if}
            {/each}
        {/if}
    {/each}
</div>
