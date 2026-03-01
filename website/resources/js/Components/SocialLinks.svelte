<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

interface Props {
    variant: 'sticky-top' | 'bottom';
    onEmailClick: (e: MouseEvent) => void;
    cvDownloadUrl?: string | null;
    class?: string;
}

let { variant, onEmailClick, cvDownloadUrl = null, class: className = '' }: Props = $props();

const baseClasses = 'flex gap-4 sm:gap-5 transition-opacity duration-300';
const variantClasses = {
    'sticky-top': 'fixed top-6 right-6 z-40',
    'bottom': 'justify-end relative z-30',
};
</script>

<div class="{baseClasses} {variantClasses[variant]} {className}">
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
