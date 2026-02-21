<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface Props {
    variant: 'sticky-top' | 'bottom';
    onEmailClick: (e: MouseEvent) => void;
    class?: string;
}

let { variant, onEmailClick, class: className = '' }: Props = $props();

const baseClasses = 'flex gap-4 sm:gap-5 transition-opacity duration-300';
const variantClasses = {
    'sticky-top': 'fixed top-6 right-6 z-40',
    'bottom': 'justify-end relative z-[55]',
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
    <button
        type="button"
        onclick={onEmailClick}
        class="text-text-muted hover:text-accent transition-colors cursor-pointer"
    >
        <Fa icon={faEnvelope} size="lg" />
    </button>
</div>
