<script lang="ts">
import type { ComponentProps } from "@/types";
import { Link } from "@inertiajs/svelte";

type Props = ComponentProps<{
    enableFooter?: boolean
    title?: string
}>;

const {
    enableFooter,
    title,
    class: _class,
}: Props = $props();

const enableFooterFlag = $state(enableFooter ?? true);
</script>

<svelte:head>
    <title>{`${title ? title + ' | ' : ''}Stefan Olivier`}</title>
</svelte:head>

<div class={mc('', _class)}>
    <nav class="w-full sticky top-0 left-0 bg-darkest h-(--navigation-height) border-b border-b-border flex items-center z-(--z-navigation)">
        <div class="pl-2">
            <Link class="px-4" href={route('home.index')}>Home</Link>
            <Link class="px-4" href={route('blog.index')}>Blog</Link>
        </div>
    </nav>

    <slot/>

    {#if enableFooterFlag}
        <footer class="bottom-0 left-0 w-screen h-(--footer-height) flex justify-center items-center border-t border-border bg-darkest z-(--z-navigation)">
            <h1 class="text-sm">Copyright (c) Stefan Olivier</h1>
        </footer>
    {/if}
</div>
