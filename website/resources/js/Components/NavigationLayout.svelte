<script lang="ts">
import type { ComponentProps } from "@/types";
import { Link } from "@inertiajs/svelte";
import Fa from "svelte-fa";
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { clientDarkMode } from "@/Lib/dom.svelte";

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
const { darkMode, toggleDarkMode } = clientDarkMode;

$effect(() => {
    document.documentElement.dataset.theme = $darkMode ? 'dark' : 'light';
});
</script>

<svelte:head>
    <title>{`${title ? title + ' | ' : ''}Stefan Olivier`}</title>
</svelte:head>

<div class={mc('', _class)}>
    <nav class="w-full sticky top-0 left-0 bg-primary h-(--navigation-height) border-b border-b-border flex items-center z-(--z-navigation)">
        <div class="pl-2 flex items-center">
            <Link class="px-4" href={route('home.index')}>Home</Link>
            <Link class="px-4" href={route('blog.index')}>Blog</Link>
        </div>
        <button onclick={toggleDarkMode} class="absolute inline-flex items-center mr-4 cursor-pointer right-0">
            <Fa icon={$darkMode ? faSun : faMoon} class="text-secondary hover:text-accent-light" />
        </button>
    </nav>

    <slot/>

    {#if enableFooterFlag}
        <footer class="bottom-0 left-0 w-screen h-(--footer-height) flex justify-center items-center border-t border-border bg-primary z-(--z-navigation)">
            <h1 class="text-sm">Copyright (c) Stefan Olivier</h1>
        </footer>
    {/if}
</div>
