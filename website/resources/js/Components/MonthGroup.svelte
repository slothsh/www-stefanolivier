<script lang="ts">
import type { BlogPostSnippet } from '@/types';
import BlogCard from './BlogCard.svelte';

interface Props {
    month: string;
    posts: BlogPostSnippet[];
}

let { month, posts }: Props = $props();

let isExpanded = $state(true);

function toggle() {
    isExpanded = !isExpanded;
}
</script>

<div class="border-b border-border last:border-b-0">
    <button
        type="button"
        onclick={toggle}
        class="w-full flex items-center justify-between py-4 text-left hover:bg-bg-secondary/30 transition-colors"
    >
        <h2 class="text-xl font-semibold text-text">{month}</h2>
        <span class="text-sm text-text-muted">
            {isExpanded ? '−' : '+'} {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </span>
    </button>

    {#if isExpanded}
        <div class="grid gap-4 pb-6">
            {#each posts as post (post.slug)}
                <BlogCard {post} />
            {/each}
        </div>
    {/if}
</div>
