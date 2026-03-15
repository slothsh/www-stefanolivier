<script lang="ts">
import type { BlogPostSnippet } from '@/types';
import MonthGroup from '../Components/MonthGroup.svelte';
import BlogPostItem from '../Components/BlogPostItem.svelte';
import Header from '../Components/Header.svelte';
import Footer from '../Components/Footer.svelte';
import ContactForm from './ContactForm.svelte';
import { animateFormOpen, animateFormClose, updateClipPathOnResize } from '../Lib/contactFormAnimation';
import { lockScroll, unlockScroll } from '../Lib/scrollLock';
import { tick } from 'svelte';
import { toast, Toaster } from 'svelte-sonner';

interface MonthGroupedPosts {
    [month: string]: BlogPostSnippet[];
}

interface Props {
    posts: MonthGroupedPosts;
    cvDownloadUrl?: string | null;
    contactCardQrCode?: string;
}

let { posts, cvDownloadUrl = null, contactCardQrCode = '' }: Props = $props();

let allPosts = Object.values(posts).flat();

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
    <title>Blog - Stefan Olivier</title>
    <meta name="description" content="Read my latest blog posts about software development, programming, and technology." />
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
            <ContactForm onClose={handleFormClose} {contactCardQrCode} />
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
    <Footer {cvDownloadUrl} />
</div>
