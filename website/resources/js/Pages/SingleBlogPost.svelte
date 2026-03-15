<script lang="ts">
import type { BlogPost } from '@/types';
import BlogContentRenderer from '../Components/BlogContentRenderer.svelte';
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
import { Bio } from '../Lib/bio';

interface Props {
    post: BlogPost;
    cvDownloadUrl?: string | null;
    contactCardQrCode?: string;
    cvPdfQrCode?: string;
}

let { post, cvDownloadUrl = null, contactCardQrCode = '', cvPdfQrCode = '' }: Props = $props();

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

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
</script>

<svelte:head>
    <title>{post.title} - Stefan Olivier</title>
    <meta name="description" content={post.content?.slice(0, 160) || ''} />
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
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header class="mb-12">
                <a
                    href="/blog"
                    class="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors mb-8"
                >
                    ← Back to Blog
                </a>

                <h1 class="text-4xl sm:text-5xl font-bold text-text mb-6">
                    {post.title}
                </h1>

                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted mb-6">
                    {#if post.author}
                        <span class="font-medium text-text">by {post.author}</span>
                        <span>·</span>
                    {/if}
                    <time datetime={post.posted_at}>{formatDate(post.posted_at)}</time>
                    <span>·</span>
                    <span>{post.read_time} min read</span>
                </div>

                {#if post.tags && post.tags.length > 0}
                    <div class="flex flex-wrap gap-2">
                        {#each post.tags as tag}
                            <span class="inline-block px-3 py-1 text-sm bg-bg-secondary text-text-muted rounded-full">
                                {tag}
                            </span>
                        {/each}
                    </div>
                {/if}
            </header>

            <div class="prose prose-lg max-w-none">
                {#if post.structured_content}
                    <BlogContentRenderer content={post.structured_content} />
                {:else if post.content}
                    <div class="text-text-muted whitespace-pre-wrap">{post.content}</div>
                {/if}
            </div>

            <footer class="mt-16 pt-8 border-t border-border">
                <a
                    href="/blog"
                    class="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors"
                >
                    ← Back to Blog
                </a>
            </footer>
        </article>
    </main>
    <Footer class="mx-6" {cvDownloadUrl} />
</div>
