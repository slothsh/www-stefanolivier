<script lang="ts">
import type { BlogPost } from '@/types';
import BlogContentRenderer from '../Components/BlogContentRenderer.svelte';
import Header from '../Components/Header.svelte';
import Footer from '../Components/Footer.svelte';
import ContactForm from './ContactForm.svelte';
import { animateFormOpen, animateFormClose, updateClipPathOnResize } from '../Lib/contactFormAnimation';
import { lockScroll, unlockScroll } from '../Lib/scrollLock';
import { tick } from 'svelte';
import { toast, Toaster } from 'svelte-sonner';

interface Props {
    post: BlogPost;
    cvDownloadUrl?: string | null;
    contactCardQrCode?: string;
}

let { post, cvDownloadUrl = null, contactCardQrCode = '' }: Props = $props();

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

<Toaster />

{#if showContactForm}
    <div
        bind:this={overlayRef}
        class="fixed inset-0 z-50 bg-bg/90 backdrop-blur-sm"
    >
        <div
            bind:this={formRef}
            class="fixed left-1/2 top-0 w-full max-w-md bg-bg border border-border rounded-2xl shadow-2xl"
        >
            <ContactForm onClose={handleFormClose} contactCardQrCode={contactCardQrCode} />
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
    <Footer {cvDownloadUrl} />
</div>
