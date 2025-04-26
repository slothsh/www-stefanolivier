<script lang="ts">
type Props = {
    src: string,
    alt?: string,
    width?: number,
    height?: number,
    caption?: string,
    class?: string,
};

let {
    src,
    alt,
    width,
    height,
    caption,
    class: _class,
}: Props = $props();
</script>

<figure class={mc('relative group cursor-pointer', _class)}>
    {#if caption}<figcaption class="opacity-0 group-hover:opacity-100 absolute bottom-4 right-4 text-sm font-light text-black/75 font-mono border border-white/10 bg-white/30 backdrop-blur-md shadow px-2 rounded cursor-pointer transition-opacity duration-150">{caption}</figcaption>{/if}
    <img {src} {width} {height} class="object-cover" {alt}>
</figure>
