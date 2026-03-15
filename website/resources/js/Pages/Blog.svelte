<script lang="ts">
import type { BlogPostSnippet } from '@/types';
import MonthGroup from '../Components/MonthGroup.svelte';
import BlogPostItem from '../Components/BlogPostItem.svelte';
import Header from '../Components/Header.svelte';
import Footer from '../Components/Footer.svelte';
import ContactForm from './ContactForm.svelte';
import CopyButton from '../Components/CopyButton.svelte';
import { animateFormOpen, animateFormClose, updateClipPathOnResize } from '../Lib/contactFormAnimation';
import { lockScroll, unlockScroll } from '../Lib/scrollLock';
import { tick } from 'svelte';
import { toast, Toaster } from 'svelte-sonner';
import Fa from 'svelte-fa';
import { faXmark, faFileArrowDown, faPhone, faEnvelope, faFilePdf, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface MonthGroupedPosts {
    [month: string]: BlogPostSnippet[];
}

interface Props {
    posts: MonthGroupedPosts;
    cvDownloadUrl?: string | null;
    contactCardQrCode?: string;
    cvPdfQrCode?: string;
}

let { posts, cvDownloadUrl = null, contactCardQrCode = '', cvPdfQrCode = '' }: Props = $props();

let allPosts = $derived(Object.values(posts).flat());

let showContactForm = $state(false);
let activeQrCode = $state<'contact' | 'cv'>('contact');
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
    <title>Blog - Stefan Olivier</title>
    <meta name="description" content="Read my latest blog posts about software development, programming, and technology." />
</svelte:head>

<Toaster
    position="top-center"
    theme="dark"
    richColors
    closeButton
    toastOptions={{
        classes: {
            success: 'toast-success',
            error: 'toast-error',
            warning: 'toast-warning',
            info: 'toast-info',
        }
    }}
/>

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
                <div class="flex flex-col md:flex-row h-full gap-8">
                    <div class="flex-1 md:flex-[2] flex flex-col">
                        <ContactForm
                            isVisible={showContactForm}
                            onClose={handleFormClose}
                        />
                    </div>
                    <div class="hidden md:flex flex-1 flex-col border-l border-border pl-8 justify-between">
                        <div>
                            <h2 class="contact-detail text-xl font-semibold text-text mb-6">Contact</h2>
                            <div class="space-y-4">
                            <div class="flex items-center">
                                <a
                                    href={Bio.contact.Phone.src}
                                    class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                                >
                                    <Fa icon={faPhone} class="text-lg w-5" />
                                    <span>{Bio.contact.Phone.displayName}</span>
                                </a>
                                <CopyButton text={Bio.contact.Phone.displayName} />
                            </div>
                            <div class="flex items-center">
                                <a
                                    href={Bio.contact.Email.src}
                                    class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                                >
                                    <Fa icon={faEnvelope} class="text-lg w-5" />
                                    <span>{Bio.contact.Email.displayName}</span>
                                </a>
                                <CopyButton text={Bio.contact.Email.displayName} />
                            </div>
                            <div class="flex items-center">
                                <a
                                    href={Bio.contact.GitHub.src}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                                >
                                    <Fa icon={faGithub} class="text-lg w-5" />
                                    <span>{Bio.contact.GitHub.displayName}</span>
                                </a>
                                <CopyButton text={Bio.contact.GitHub.src} />
                            </div>
                            <div class="flex items-center">
                                <a
                                    href={Bio.contact.LinkedIn.src}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                                >
                                    <Fa icon={faLinkedin} class="text-lg w-5" />
                                    <span>{Bio.contact.LinkedIn.displayName}</span>
                                </a>
                                <CopyButton text={Bio.contact.LinkedIn.src} />
                            </div>
                            {#if cvDownloadUrl}
                                <div class="flex items-center">
                                    <a
                                        href={cvDownloadUrl}
                                        download
                                        class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors"
                                    >
                                        <Fa icon={faFileArrowDown} class="text-lg w-5" />
                                        <span>Download CV</span>
                                    </a>
                                    <CopyButton text={cvDownloadUrl} />
                                </div>
                            {/if}
                            {#if contactCardQrCode && cvPdfQrCode}
                                <div class="qr-code pt-4 mt-4 border-t border-border">
                                    <div class="flex gap-2 mb-3">
                                        <button
                                            type="button"
                                            onclick={() => activeQrCode = 'contact'}
                                            class="qr-code flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors {activeQrCode === 'contact' ? 'bg-accent text-bg' : 'bg-bg text-text-muted hover:text-text'}"
                                        >
                                            <Fa icon={faAddressCard} class="text-xs" />
                                            Contact
                                        </button>
                                        <button
                                            type="button"
                                            onclick={() => activeQrCode = 'cv'}
                                            class="qr-code flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors {activeQrCode === 'cv' ? 'bg-accent text-bg' : 'bg-bg text-text-muted hover:text-text'}"
                                        >
                                            <Fa icon={faFilePdf} class="text-xs" />
                                            Download CV
                                        </button>
                                    </div>
                                    {#if activeQrCode === 'contact'}
                                        <img
                                            src={contactCardQrCode}
                                            alt="Contact QR Code"
                                            class="qr-code rounded-md border border-border w-full"
                                        />
                                    {:else}
                                        <img
                                            src={cvPdfQrCode}
                                            alt="CV PDF QR Code"
                                            class="qr-code rounded-md border border-border w-full"
                                        />
                                    {/if}
                                </div>
                            {/if}
                        </div>
                        </div>
                    </div>
                </div>
                <div class="md:hidden flex flex-row gap-4 justify-center pt-6 mt-6 border-t border-border">
                    <div class="flex flex-row items-center">
                        <a
                            href={Bio.contact.Phone.src}
                            class="contact-detail text-text-muted hover:text-accent transition-colors text-sm"
                        >
                            {Bio.contact.Phone.displayName}
                        </a>
                    </div>
                    <div class="flex flex-row items-center">
                        <a
                            href={Bio.contact.Email.src}
                            class="contact-detail text-text-muted hover:text-accent transition-colors text-sm"
                        >
                            {Bio.contact.Email.displayName}
                        </a>
                    </div>
                    <div class="flex flex-row items-center">
                        <a
                            href={Bio.contact.GitHub.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="contact-detail text-text-muted hover:text-accent transition-colors"
                        >
                            <Fa icon={faGithub} class="text-lg" />
                        </a>
                    </div>
                    <div class="flex flex-row items-center">
                        <a
                            href={Bio.contact.LinkedIn.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="contact-detail text-text-muted hover:text-accent transition-colors"
                        >
                            <Fa icon={faLinkedin} class="text-lg" />
                        </a>
                    </div>
                    {#if cvDownloadUrl}
                        <div class="flex flex-row items-center">
                            <a
                                href={cvDownloadUrl}
                                download
                                class="contact-detail text-text-muted hover:text-accent transition-colors"
                            >
                                <Fa icon={faFileArrowDown} class="text-lg" />
                            </a>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="min-h-screen bg-bg flex flex-col">
    <Header onEmailClick={handleEmailClick} {cvDownloadUrl} />
    <main class="flex-1 pt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header class="mb-12">
                <h1 class="text-4xl font-bold text-text mb-4">Blog</h1>
                <p class="text-lg text-text-muted">Thoughts on software development, programming, and technology.</p>
            </header>

            <div class="lg:grid lg:grid-cols-12 lg:gap-8">
                <main class="lg:col-span-8">
                    {#if Object.keys(posts).length === 0}
                        <p class="text-text-muted">No blog posts yet.</p>
                    {:else}
                        {#each Object.entries(posts) as [month, monthPosts] (month)}
                            <MonthGroup {month} posts={monthPosts} />
                        {/each}
                    {/if}
                </main>

                <aside class="hidden lg:block lg:col-span-4 lg:pl-8">
                    <div class="sticky top-24">
                        <div class="bg-bg border border-border rounded-lg p-4">
                            <h3 class="font-semibold text-text mb-4">Recent Posts</h3>
                            <div class="divide-y divide-border">
                                {#each allPosts.slice(0, 5) as post (post.slug)}
                                    <BlogPostItem {post} />
                                {/each}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </main>
    <Footer class="mx-6" {cvDownloadUrl} />
</div>
