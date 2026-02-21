<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
    import { cn } from '@/Lib/cn';

let isVisible = $state(false);
let {
    class: className
}: {
    class?: string
} = $props();

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
    class={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border transition-opacity duration-300",
        {'opacity-100': isVisible, 'opacity-0 pointer-events-none': !isVisible},
        className
    )}>
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
