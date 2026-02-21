<script lang="ts">
import type { Snippet } from "svelte";

let { children, onIntersect, threshold = 0.5, root = null, rootMargin = '' }: {
    children: Snippet,
    onIntersect?: (entry: IntersectionObserverEntry) => void,
    threshold?: number,
    root?: Element | null,
    rootMargin?: string,
} = $props();

let ref: HTMLDivElement | undefined = $state();

$effect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                onIntersect?.(entry);
            });
        },
        { root, threshold, rootMargin }
    );

    observer.observe(ref);

    return () => observer.disconnect();
});
</script>

<div bind:this={ref}>
    {@render children?.()}
</div>
