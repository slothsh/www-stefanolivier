<script lang="ts">
import Fa from 'svelte-fa';
import { faXmark, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import ContactForm from './ContactForm.svelte';
import FeaturedItemCard from '../Components/FeaturedItemCard.svelte';
import SocialLinks from '../Components/SocialLinks.svelte';
import Footer from '../Components/Footer.svelte';
import Header from '../Components/Header.svelte';
import { animateFormOpen, animateFormClose, updateClipPathOnResize } from '../Lib/contactFormAnimation';
import { lockScroll, unlockScroll } from '../Lib/scrollLock';
import { cn } from '../Lib/cn';
import { tick } from 'svelte';
import { toast, Toaster } from 'svelte-sonner';
import type { FeaturedItem } from '@/types';

interface Props {
    featuredItems?: FeaturedItem[];
    cvDownloadUrl?: string | null;
}

let { featuredItems = [], cvDownloadUrl = null }: Props = $props();

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
        toast.dismiss();
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
        lockScroll();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            unlockScroll();
        };
    }
});
</script>

<svelte:head>
    <title>Stefan Olivier</title>
</svelte:head>

<div class="min-h-screen bg-bg flex flex-col px-6 md:px-8 lg:px-12">
    {#if featuredItems.length > 0}
        <Header onEmailClick={handleEmailClick} {cvDownloadUrl} />
    {/if}
    <main class="flex-1 flex flex-col items-center justify-center mt-6 md:mt-8 lg:mt-12">
        <div class="flex flex-col items-center text-center justify-center">
            <div class={cn(
                'flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10',
                { 'my-12 md:my-24': featuredItems.length > 0 }
            )}>
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
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {#each featuredItems as item}
                            <FeaturedItemCard {item} />
                        {/each}
                    </div>
                </section>
            {/if}
        </div>
    </main>

    {#if featuredItems.length > 0}
        <Footer class="mt-16" {cvDownloadUrl} />
    {:else}
        <SocialLinks
            class="mb-8"
            variant="bottom"
            onEmailClick={handleEmailClick}
            {cvDownloadUrl}
        />
    {/if}
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
            <div class="bg-bg border border-border rounded-lg p-6 w-full max-w-4xl shadow-xl flex flex-col">
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="flex-1 md:flex-[2]">
                        <ContactForm
                            isVisible={showContactForm}
                            onClose={handleFormClose}
                        />
                    </div>
                    <div class="hidden md:flex flex-1 flex-col border-l border-border pl-8">
                        <h2 class="contact-detail text-xl font-semibold text-text mb-6">Contact</h2>
                        <div class="space-y-4">
                            <a
                                href={Bio.contact.Phone.src}
                                class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                            >
                                <Fa icon={Bio.contact.Phone.icon} class="text-lg w-5" />
                                <span>{Bio.contact.Phone.displayName}</span>
                            </a>
                            <a
                                href={Bio.contact.Email.src}
                                class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                            >
                                <Fa icon={Bio.contact.Email.icon} class="text-lg w-5" />
                                <span>{Bio.contact.Email.displayName}</span>
                            </a>
                            <a
                                href={Bio.contact.GitHub.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                            >
                                <Fa icon={Bio.contact.GitHub.icon} class="text-lg w-5" />
                                <span>{Bio.contact.GitHub.displayName}</span>
                            </a>
                            <a
                                href={Bio.contact.LinkedIn.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                            >
                                <Fa icon={Bio.contact.LinkedIn.icon} class="text-lg w-5" />
                                <span>{Bio.contact.LinkedIn.displayName}</span>
                            </a>
                            {#if cvDownloadUrl}
                                <a
                                    href={cvDownloadUrl}
                                    download
                                    class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                                >
                                    <Fa icon={faFileArrowDown} class="text-lg w-5" />
                                    <span>Download CV</span>
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="md:hidden flex flex-row gap-4 justify-center pt-6 mt-6 border-t border-border">
                    <a
                        href={Bio.contact.Phone.src}
                        class="contact-detail text-text-muted hover:text-accent transition-colors text-sm"
                    >
                        {Bio.contact.Phone.displayName}
                    </a>
                    <a
                        href={Bio.contact.Email.src}
                        class="contact-detail text-text-muted hover:text-accent transition-colors text-sm"
                    >
                        {Bio.contact.Email.displayName}
                    </a>
                    <a
                        href={Bio.contact.GitHub.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="contact-detail text-text-muted hover:text-accent transition-colors"
                    >
                        <Fa icon={Bio.contact.GitHub.icon} class="text-lg" />
                    </a>
                    <a
                        href={Bio.contact.LinkedIn.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="contact-detail text-text-muted hover:text-accent transition-colors"
                    >
                        <Fa icon={Bio.contact.LinkedIn.icon} class="text-lg" />
                    </a>
                    {#if cvDownloadUrl}
                        <a
                            href={cvDownloadUrl}
                            download
                            class="contact-detail text-text-muted hover:text-accent transition-colors"
                        >
                            <Fa icon={faFileArrowDown} class="text-lg" />
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
<Toaster position="top-center" />
