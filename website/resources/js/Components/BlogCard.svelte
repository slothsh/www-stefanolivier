<script lang="ts">
import type { BlogPostSnippet } from '@/types';

interface Props {
    post: BlogPostSnippet;
}

let { post }: Props = $props();

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
</script>

<a
    href="/blog/{post.slug}"
    class="block group bg-bg border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
>
    <div class="flex items-start justify-between gap-4 mb-3">
        <h3 class="font-semibold text-lg text-text group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
        </h3>
    </div>

    <p class="text-sm text-text-muted mb-4 line-clamp-3">
        {post.blurb}
    </p>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
        <span>{formatDate(post.posted_at)}</span>
        <span>·</span>
        <span>{post.read_time} min read</span>
        {#if post.author}
            <span>·</span>
            <span>by {post.author}</span>
        {/if}
    </div>

    {#if post.tags && post.tags.length > 0}
        <div class="flex flex-wrap gap-2 mt-4">
            {#each post.tags as tag}
                <span class="inline-block px-2 py-1 text-xs bg-bg-secondary text-text-muted rounded">
                    {tag}
                </span>
            {/each}
        </div>
    {/if}
</a>
