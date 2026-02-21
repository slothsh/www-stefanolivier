<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

let isVisible = $state(false);
let footerRef: HTMLElement | undefined = $state();

function checkScrollable() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    isVisible = scrollHeight > clientHeight + 100;
}

$effect(() => {
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
});
</script>

<footer
    bind:this={footerRef}
    class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border transition-opacity duration-300 {isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
>
    <span class="text-sm text-text-muted">
        {Bio.firstname} {Bio.surname}
    </span>
    <div class="flex gap-4">
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
        <a
            href={Bio.contact.Email.src}
            class="text-text-muted hover:text-accent transition-colors"
        >
            <Fa icon={faEnvelope} size="lg" />
        </a>
    </div>
</footer>
