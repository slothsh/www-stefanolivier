<script lang="ts">
import type { ComponentProps } from "@/types";
import { Link } from "@inertiajs/svelte";

type Props = ComponentProps<{
    enableFooter?: boolean
}>;

const {
    enableFooter,
    class: _class,
}: Props = $props();

const enableFooterFlag = $state(enableFooter ?? true);
</script>

<div class={mc('', _class)}>
    <nav class="w-full sticky top-0 left-0 bg-primary h-[40px] border-b border-b-border flex justify-center items-center z-50">
        <div class="w-page">
            <Link class="px-4" href={route('home.index')}>Home</Link>
            <Link class="px-4" href={route('blog.index')}>Blog</Link>
        </div>
    </nav>

    <slot/>

    {#if enableFooterFlag}
        <footer class="sticky bottom-0 left-0 w-screen h-[80px] translate-y-[80px] flex justify-center items-center border-t border-border z-50">
            <h1 class="text-sm">Copyright (c) Stefan Olivier</h1>
        </footer>
    {/if}
</div>
