<script lang="ts">
import type { BlogPostSnippet } from '@/types';
import MonthGroup from '../Components/MonthGroup.svelte';
import BlogPostItem from '../Components/BlogPostItem.svelte';

interface MonthGroupedPosts {
    [month: string]: BlogPostSnippet[];
}

interface Props {
    posts: MonthGroupedPosts;
}

let { posts }: Props = $props();

let allPosts = Object.values(posts).flat();
</script>

<svelte:head>
    <title>Blog - Stefan Olivier</title>
    <meta name="description" content="Read my latest blog posts about software development, programming, and technology." />
</svelte:head>

<div class="min-h-screen bg-bg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header class="mb-12">
            <h1 class="text-4xl font-bold text-text mb-4">Blog</h1>
            <p class="text-lg text-text-muted">Thoughts on software development, programming, and technology.</p>
        </header>

        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
            <main class="lg:col-span-8">
                {#if Object.keys(posts).length === 0}
                    <p class="text-text-muted">No blog posts yet.</p>
                {:else}
                    {#each Object.entries(posts) as [month, monthPosts] (month)}
                        <MonthGroup {month} posts={monthPosts} />
                    {/each}
                {/if}
            </main>

            <aside class="hidden lg:block lg:col-span-4 lg:pl-8">
                <div class="sticky top-8">
                    <div class="bg-bg border border-border rounded-lg p-4">
                        <h3 class="font-semibold text-text mb-4">Recent Posts</h3>
                        <div class="divide-y divide-border">
                            {#each allPosts.slice(0, 5) as post (post.slug)}
                                <BlogPostItem {post} />
                            {/each}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</div>
