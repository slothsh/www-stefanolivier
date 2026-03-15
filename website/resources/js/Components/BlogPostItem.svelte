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
        month: 'short',
        day: 'numeric',
    });
}
</script>

<a
    href="/blog/{post.slug}"
    class="block group py-3 border-b border-border last:border-b-0 hover:bg-bg-secondary/50 transition-colors"
>
    <h4 class="font-medium text-sm text-text group-hover:text-accent transition-colors line-clamp-2 mb-1">
        {post.title}
    </h4>

    <div class="flex items-center gap-2 text-xs text-text-muted">
        <span>{formatDate(post.posted_at)}</span>
        <span>·</span>
        <span>{post.read_time} min</span>
    </div>
</a>
