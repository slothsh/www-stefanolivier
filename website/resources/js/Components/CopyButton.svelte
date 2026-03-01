<script lang="ts">
interface Props {
    text: string;
}

let { text }: Props = $props();

let copied = $state(false);

async function handleCopy() {
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => {
        copied = false;
    }, 3000);
}
</script>

<button
    onclick={handleCopy}
    class="ml-auto text-xs text-text-muted hover:text-accent transition-colors cursor-pointer"
>
    {copied ? 'Copied' : 'Copy'}
</button>
