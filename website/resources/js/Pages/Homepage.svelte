<script lang="ts">
import Fa from 'svelte-fa';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faXmark } from '@fortawesome/free-solid-svg-icons';
import ContactForm from './ContactForm.svelte';
import FeaturedItemCard from '../Components/FeaturedItemCard.svelte';
import { animateFormOpen, animateFormClose, updateClipPathOnResize } from '../Lib/contactFormAnimation';
import { tick } from 'svelte';
import type { FeaturedItem } from '@/types';

interface Props {
    featuredItems?: FeaturedItem[];
}

let { featuredItems = [] }: Props = $props();

let showContactForm = $state(false);
let showSocialIcons = $state(true);
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
    showSocialIcons = false;
    await tick();
    if (overlayRef && formRef) {
        animateFormOpen(clickOrigin.x, clickOrigin.y, overlayRef, formRef, target);
    }
}

function handleFormClose() {
    if (overlayRef && formRef) {
        showSocialIcons = true;
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

<div class="min-h-screen bg-bg flex flex-col p-6 md:p-8 lg:p-12">
    <main class="flex-1">
        <div class="flex flex-col items-center text-center mb-12">
            <div class="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10 mb-8">
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

            {#if featuredItems.length > 0}
                <section class="w-full max-w-4xl">
                    <h2 class="text-lg font-medium text-text-muted mb-4">Featured Projects</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {#each featuredItems as item}
                            <FeaturedItemCard {item} />
                        {/each}
                    </div>
                </section>
            {/if}
        </div>
    </main>

    <footer class="flex gap-4 sm:gap-5 justify-end relative z-[55] transition-opacity duration-300" class:opacity-0={!showSocialIcons}>
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
        class="fixed inset-0 z-[60]"
    >
        <button
            type="button"
            onclick={handleFormClose}
            class="absolute top-6 left-6 text-text-muted hover:text-text transition-colors cursor-pointer"
        >
            <Fa icon={faXmark} class="text-3xl" />
        </button>
        <div class="flex items-center justify-center h-full p-4">
            <div class="bg-bg border border-border rounded-lg p-6 w-full max-w-md shadow-xl">
                <ContactForm
                    isVisible={showContactForm}
                    onClose={handleFormClose}
                />
            </div>
        </div>
    </div>
{/if}
