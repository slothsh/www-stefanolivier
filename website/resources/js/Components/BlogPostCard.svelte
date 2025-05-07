<script lang="ts">
import Fa from "svelte-fa";
import Tag from "@/Components/Tag.svelte";
import User from "@/Components/User.svelte";
import type { ComponentProps, BlogPostSnippet } from "@/types";
import { Link } from "@inertiajs/svelte";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { format as formatDate } from 'date-fns';
import { secondsToMinutes } from "date-fns";

type Props = {
    post: BlogPostSnippet,
};

let {
    post,
    class: _class,
}: ComponentProps<Props> = $props();

let root: HTMLDivElement | undefined = $state();
let rootRect = $derived(root?.getBoundingClientRect() ?? { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0} as DOMRect);
</script>

<div id={post.slug} bind:this={root} class={mc("group relative border border-border rounded-md shadow-lg overflow-hidden min-w-[640px] min-h-[360px] cursor-pointer", _class)}>
    <Link href={route('blog.show', post.slug)}>
        <div class="absolute top-0 left-0 w-full h-full bg-primary"></div>
        <div class="absolute top-0 left-0 w-1/3 h-full group-hover:scale-110 border-r border-border transition-all z-10 duration-300 [transition-timing-function:ease-out] [background-image:linear-gradient(90deg,rgba(255,255,255,0),rgba(0,0,0,0.5))] bg-bluest opacity-50">
            <img src="https://picsum.photos/512" class="w-full h-full object-fill z-9">
        </div>
        <div class="flex flex-col justify-start w-full p-12 transition-all top">
            <div class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-4 cursor-pointer group">
                    <Fa icon={faLink} size="sm" class="brightness-75 group-hover:brightness-100" />
                    <h2 class="font-bold text-2xl text-font group-hover:text-font-highlight">
                        {post.title}
                    </h2>
                </div>
                <small class="text-sm italic">Read Time: {secondsToMinutes(post.read_time)} Minutes</small>
            </div>
            <div class="flex justify-between items-center mb-8">
                <div class="flex flex-col justify-center gap-4">
                    <User firstname={Bio.firstname} lastname={Bio.surname} avatar="https://avatar.iran.liara.run/public" avatar_alt={Bio.name} class="w-full" />
                    <div class="flex items-center">
                        <span class="mr-4">Posted:</span>
                        {' '}
                        <time class="text-sm italic">{formatDate(post.posted_at, 'yyyy-MM-dd')}</time>
                    </div>
                </div>
                <div class="flex justify-end items-center gap-2 self-start">
                {#each post.tags as tag}
                    <Tag tag={tag} />
                {/each}
                </div>
            </div>
            <p>{post.blurb}</p>
        </div>
    </Link>
</div>

<style lang="scss">
.top {
    * {
        z-index: 10;
    }
}
</style>
