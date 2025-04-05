<script lang="ts">
import type { BlogPostItem } from '@/types';
import NavigationLayout from '@/Components/NavigationLayout.svelte';
import BlogPostCard from '@/Components/BlogPostCard.svelte';

type Props = {
    name: string,
    posts: BlogPostItem[],
};

let {
    posts,
}: Props = $props();
</script>

<NavigationLayout class="relative">
    <div class="w-screen px-64 flex justify-center items-center flex-col">
        <h1 class="w-full my-8 font-bold text-5xl">Blog</h1>
        <section title="blog-posts" class="w-full">
            {#each posts as post}
                <BlogPostCard class="mb-10 h-[240px]" {post} />
            {/each}
        </section>
    </div>
</NavigationLayout>
