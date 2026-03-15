<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/Lib/cn';
import { router } from '@inertiajs/svelte';

interface Props {
    onEmailClick: (e: MouseEvent) => void;
    cvDownloadUrl?: string | null;
    showBlogLink?: boolean;
    class?: string;
}

let { onEmailClick, cvDownloadUrl = null, showBlogLink = true, class: className = '' }: Props = $props();
</script>

<header class={cn(
    'fixed top-0 left-0 right-0 z-40 flex justify-between items-center bg-bg p-4 md:p-6',
    className
)}>
    <div class="flex gap-3 sm:gap-4 text-sm font-medium">
        <button
            type="button"
            onclick={() => router.get('/')}
            class="text-text-muted hover:text-accent transition-colors"
        >
            Home
        </button>
        {#if showBlogLink}
            <button
                type="button"
                onclick={() => router.get('/blog')}
                class="text-text-muted hover:text-accent transition-colors"
            >
                Blog
            </button>
        {/if}
    </div>
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
