<script lang="ts">
import BlogPostCard from "@/Components/BlogPostCard.svelte";
import Canvas from "@/Components/Canvas.svelte";
import NavigationLayout from "@/Components/NavigationLayout.svelte";
import type { BlogPostSnippet } from "@/types";
import { compareDesc, formatDate, parse } from "date-fns";
import { forwardClick } from "@/Lib/dom.svelte";
import { lattice } from "@/Lib/Canvas/lattice.svelte";
import { useClientWindow, clientDarkMode } from "@/Lib/dom.svelte";

type Props = {
    name: string;
    posts: BlogPostSnippet[];
};

let { posts }: Props = $props();

const clientWindow = useClientWindow();

let canvasRect = $derived(
    Vector.xwyh(
        0,
        $clientWindow.width * $clientWindow.scale,
        0,
        $clientWindow.height * $clientWindow.scale,
    ),
);

posts.sort((a, b) => {
    return compareDesc(new Date(a.posted_at), new Date(b.posted_at));
});

const index = Object.entries(
    Object.groupBy(posts, (post) => formatDate(post.posted_at, 'MMMM, y'))
).sort(([ka,_], [kb,__]) => compareDesc(parse(ka, 'MMMM, y', new Date()), parse(kb, 'MMMM, y', new Date())));

const blogPostCards: Record<string, HTMLElement | null> =
    Object.fromEntries(posts.map((post) => [post.slug, null]));

function handlePostScroll(slug: string) {
    const offset = [
        parseInt(
            getComputedStyle(document.documentElement)
                .getPropertyValue("--navigation-height")
                .trim(),
        ),
        parseInt(
            getComputedStyle(
                blogPostCards[slug]?.firstElementChild as HTMLDivElement,
            ).marginBottom,
        ),
    ].reduce((acc, n) => acc + n, 0);

    window.scrollBy({
        top: blogPostCards[slug]?.getBoundingClientRect().y! - offset,
        behavior: "smooth",
    });
}

const { darkMode } = clientDarkMode;
</script>

<NavigationLayout class="relative" title="Blog">
    <Canvas
        class="fixed top-0 w-full h-full z-[-1]"
        rect={canvasRect}
        program={lattice}
        programArgs={{ fill: Theme.colors.darker($darkMode).vec, stroke: Theme.colors.border($darkMode).vec }}
    />

    <div class={mc("w-screen min-h-[calc(100dvh-var(--navigation-height))] z-(--z-page)", {
        'grid grid-cols-8': posts.length > 0,
        'flex justify-center items-center': posts.length === 0,
    })}>
        {#if posts.length === 0}
            <div class="flex justify-start flex-col items-center gap-4">
                <h1 class="font-bold text-3xl">No Posts Yet</h1>
                <p>Please visit again soon</p>
            </div>
        {:else}
            <div class="sticky col-span-2 p-6 top-(--navigation-height) left-0 overflow-y-auto h-full max-h-[calc(100dvh-var(--spacing)*6)] border-r border-border bg-primary mr-16">
                <h2 class="mb-4">Index</h2>
                <ul>
                    {#each index as [postedAt, postItems]}
                        {@const totalPosts = postItems?.length.toString() ?? ''}
                        <li class="text-sm">
                            <section>
                                <button class="text-md cursor-pointer flex justify-between w-full py-1 indent-4 border-l border-border hover:border-accent-light hover:text-font-highlight"
                                    onclick={(e) => { e.preventDefault(); handlePostScroll(postItems?.at(0)?.slug ?? ''); }}
                                >
                                    <span>{postedAt}</span>
                                    <span>{totalPosts}</span>
                                </button>
                            </section>
                        </li>
                    {/each}
                </ul>
            </div>
            <div class="col-span-6 mr-16 flex justify-center items-center flex-col">
                <h1 class="w-full my-8 font-bold text-5xl">Blog</h1>
                <section class="w-full min-h-[calc(100dvh-var(--footer-height)*2-var(--navigation-height)*2)]">
                    {#each posts as post}
                        <div id={post.slug} bind:this={blogPostCards[post.slug]}>
                            <BlogPostCard class="mb-10 min-h-[240px]" {post} />
                        </div>
                    {/each}
                </section>
            </div>
        {/if}
    </div>
</NavigationLayout>
