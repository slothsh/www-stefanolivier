<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/Lib/cn';

interface Props {
    onEmailClick: (e: MouseEvent) => void;
    cvDownloadUrl?: string | null;
    class?: string;
}

let { onEmailClick, cvDownloadUrl = null, class: className = '' }: Props = $props();
</script>

<header class={cn(
    'fixed top-0 left-0 right-0 z-40 flex justify-end bg-bg p-4 md:p-6',
    className
)}>
    <div class="flex gap-4 sm:gap-5">
        <a
            href={Bio.contact.GitHub.src}
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-accent transition-colors"
        >
            <Fa icon={faGithub} size="lg" />
        </a>
        <a
            href={Bio.contact.LinkedIn.src}
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-accent transition-colors"
        >
            <Fa icon={faLinkedin} size="lg" />
        </a>
        {#if cvDownloadUrl}
            <a
                href={cvDownloadUrl}
                download
                class="text-text-muted hover:text-accent transition-colors"
            >
                <Fa icon={faFileArrowDown} size="lg" />
            </a>
        {/if}
        <button
            type="button"
            onclick={onEmailClick}
            class="text-text-muted hover:text-accent transition-colors cursor-pointer"
        >
            <Fa icon={faEnvelope} size="lg" />
        </button>
    </div>
</header>
