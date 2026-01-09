<script lang="ts">
type Props = {
    firstname: string,
    lastname: string,
    avatar?: string,
    avatar_alt?: string,
    class?: string,
    classText?: string,
};

let {
    firstname,
    lastname,
    avatar,
    avatar_alt,
    class: _class,
    classText,
}: Props = $props();
</script>

{#snippet userAvatar(firstname: string, lastname: string, src?: string, alt?: string)}
    {#if src}
        <img {src} {alt} class="w-6 drop-shadow-lg">
    {:else}
        <div class="rounded-full text-primary font-bold text-sm content-center text-center bg-secondary w-8 h-8">
            {firstname.slice(0, 1).toUpperCase() + lastname.slice(0, 1).toUpperCase()}
        </div>
    {/if}
{/snippet}

<div class={mc("flex items-center gap-3", _class)}>
    {@render userAvatar(firstname, lastname, avatar, avatar_alt)}
    <span class={classText}>{Str.capitalize(firstname) + ' ' + lastname.slice(0, 1)}</span>
</div>
