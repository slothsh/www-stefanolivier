<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ContactForm from './ContactForm.svelte';
import { animateFormOpen, animateFormClose, updateClipPathOnResize } from '../Lib/contactFormAnimation';
import { tick } from 'svelte';

let showContactForm = $state(false);
let overlayRef: HTMLElement | undefined = $state();
let formRef: HTMLElement | undefined = $state();
let clickOrigin = $state({ x: 0, y: 0 });

async function handleEmailClick(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    clickOrigin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
    showContactForm = true;
    await tick();
    if (overlayRef && formRef) {
        animateFormOpen(clickOrigin.x, clickOrigin.y, overlayRef, formRef, target);
    }
}

function handleFormClose() {
    if (overlayRef && formRef) {
        animateFormClose(overlayRef, formRef, () => {
            showContactForm = false;
        });
    } else {
        showContactForm = false;
    }
}

function handleResize() {
    if (overlayRef && formRef) {
        updateClipPathOnResize(overlayRef, formRef);
    }
}

$effect(() => {
    if (showContactForm) {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }
});
</script>

<svelte:head>
    <title>Stefan Olivier</title>
</svelte:head>

<div class="min-h-screen bg-bg flex flex-col justify-between p-6 md:p-8 lg:p-12">
    <main class="flex-1 flex items-center justify-center">
        <div class="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-border flex-shrink-0 ring-2 ring-border">
                <img
                    src="https://stefanolivier.imgix.net/img/owlsh.jpg"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
                <h1 class="font-semibold text-4xl sm:text-5xl lg:text-6xl text-text tracking-tight">{Bio.name}</h1>
                <p class="text-base sm:text-lg lg:text-xl text-text-muted mt-1 sm:mt-1.5">{Bio.occupation}</p>
            </div>
        </div>
    </main>

    <footer class="flex gap-4 sm:gap-5 justify-end relative z-[55]">
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
            onclick={handleEmailClick}
            class="text-text-muted hover:text-accent transition-colors cursor-pointer"
        >
            <Fa icon={faEnvelope} size="lg" />
        </button>
    </footer>
</div>

{#if showContactForm}
    <div
        bind:this={overlayRef}
        class="fixed inset-0 z-50"
    ></div>
    <div 
        bind:this={formRef}
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
        <div class="bg-bg border border-border rounded-lg p-6 w-full max-w-md shadow-xl">
            <ContactForm
                isVisible={showContactForm}
                onClose={handleFormClose}
            />
        </div>
    </div>
{/if}
