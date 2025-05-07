<script lang="ts">
import Fa from "svelte-fa";
import { faClipboardCheck, faPaste } from "@fortawesome/free-solid-svg-icons";

type Props = {
    content: string,
    class?: string,
};

let {
    content,
    class: _class,
}: Props = $props();

let isRecentlyCopied = $state(false);
let copiedTimeout: NodeJS.Timeout | null = $state(null);

async function handleCopyLink(): Promise<void> {
    await navigator.clipboard.writeText(content);
    if (copiedTimeout) {
        clearTimeout(copiedTimeout);
    }

    isRecentlyCopied = true;
    copiedTimeout = setTimeout(() => {
        isRecentlyCopied = false;
    }, 2500);
}
</script>

<button class={mc("flex justify-center items-center hover:bg-accent-dark group-hover:bg-accent-dark cursor-pointer", _class)}
    onclick={handleCopyLink}
>
    <Fa icon={isRecentlyCopied ? faClipboardCheck : faPaste}
        size="sm"
        class={mc('[animation-duration:200ms] text-accent-light', { 'animate-scale-out-in': isRecentlyCopied, 'animate-scale-out-in-again': !isRecentlyCopied })}
    />
</button>
