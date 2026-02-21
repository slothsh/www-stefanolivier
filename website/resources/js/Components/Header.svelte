<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/Lib/cn';

interface Props {
    onEmailClick: (e: MouseEvent) => void;
    class?: string;
}

let { onEmailClick, class: className = '' }: Props = $props();
</script>

<header class={cn('fixed top-6 right-6 z-40 flex justify-end bg-bg', className)}>
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
        <button
            type="button"
            onclick={onEmailClick}
            class="text-text-muted hover:text-accent transition-colors cursor-pointer"
        >
            <Fa icon={faEnvelope} size="lg" />
        </button>
    </div>
</header>
