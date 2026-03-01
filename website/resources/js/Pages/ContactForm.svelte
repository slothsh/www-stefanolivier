<script lang="ts">
import { createForm } from '@tanstack/svelte-form';
import { z } from 'zod';
import { router } from '@inertiajs/svelte';
import { toast } from 'svelte-sonner';

interface Props {
    onClose: () => void;
    isVisible: boolean;
}

let { onClose }: Props = $props();

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
    email: z.string().regex(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/, "Email is required"),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be 5000 characters or less'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

let isSubmitting = $state(false);
let serverErrors = $state<Record<string, string>>({});
let hasSubmitted = $state(false);

const form = createForm(() => ({
    defaultValues: {
        name: '',
        email: '',
        message: '',
    } as ContactFormValues,
    validators: {
        onChange: contactSchema,
        onSubmit: contactSchema,
    },
    onSubmit: async ({ value }) => {
        isSubmitting = true;
        serverErrors = {};

        router.post(route('contact.store'), value, {
            onSuccess: () => {
                form.reset();
                toast.success('Message sent successfully! I\'ll get back to you soon.');
            },
            onError: (errors) => {
                if (errors && typeof errors === 'object') {
                    serverErrors = errors as Record<string, string>;
                }
                toast.error('Failed to send message', {
                    description: 'Please try again or contact me through other means.',
                });
            },
            onFinish: () => {
                isSubmitting = false;
            },
        });
    },
}));
</script>

<h2 class="text-xl font-semibold text-text mb-6">Send a Message</h2>
<form
    onsubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        hasSubmitted = true;
        form.handleSubmit();
    }}
    class="flex flex-col h-full"
>
    <div class="flex-1 flex flex-col min-h-0">
        <div>
            <label for="name" class="block text-sm font-medium text-text-muted mb-1.5">
                Name
            </label>
            <form.Field name="name">
                {#snippet children(field)}
                    <input
                        type="text"
                        id="name"
                        name={field.name}
                        value={field.state.value}
                        onblur={field.handleBlur}
                        oninput={(e) => field.handleChange(e.currentTarget.value)}
                        class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        placeholder="Your name"
                    />
                    <div class="min-h-5 mt-1 mb-3 form-hint">
                        {#if (hasSubmitted || field.state.meta.isBlurred) && field.state.meta.errors && field.state.meta.errors.length > 0}
                            <p class="text-sm text-red-400">{field.state.meta.errors[0]?.message}</p>
                        {:else if serverErrors.name}
                            <p class="text-sm text-red-400">{serverErrors.name}</p>
                        {/if}
                    </div>
                {/snippet}
            </form.Field>
        </div>

        <div>
            <label for="email" class="block text-sm font-medium text-text-muted mb-1.5">
                Email
            </label>
            <form.Field name="email">
                {#snippet children(field)}
                    <input
                        type="email"
                        id="email"
                        name={field.name}
                        value={field.state.value}
                        onblur={field.handleBlur}
                        oninput={(e) => field.handleChange(e.currentTarget.value)}
                        class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        placeholder="you@example.com"
                    />
                    <div class="min-h-5 mt-1 mb-3 form-hint">
                        {#if (hasSubmitted || field.state.meta.isBlurred) && field.state.meta.errors && field.state.meta.errors.length > 0}
                            <p class="text-sm text-red-400">{field.state.meta.errors[0]?.message}</p>
                        {:else if serverErrors.email}
                            <p class="text-sm text-red-400">{serverErrors.email}</p>
                        {/if}
                    </div>
                {/snippet}
            </form.Field>
        </div>

        <div class="flex-1 flex flex-col min-h-0">
            <label for="message" class="block text-sm font-medium text-text-muted mb-1.5">
                Message
            </label>
            <form.Field name="message">
                {#snippet children(field)}
                    <textarea
                        id="message"
                        name={field.name}
                        rows="6"
                        value={field.state.value}
                        onblur={field.handleBlur}
                        oninput={(e) => field.handleChange(e.currentTarget.value)}
                        class="w-full flex-1 min-h-[120px] px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                        placeholder="Your message..."
                    ></textarea>
                    <div class="min-h-5 mt-1 mb-3 form-hint">
                        {#if (hasSubmitted || field.state.meta.isBlurred) && field.state.meta.errors && field.state.meta.errors.length > 0}
                            <p class="text-sm text-red-400">{field.state.meta.errors[0]?.message}</p>
                        {:else if serverErrors.message}
                            <p class="text-sm text-red-400">{serverErrors.message}</p>
                        {/if}
                    </div>
                {/snippet}
            </form.Field>
        </div>
    </div>

    <div class="flex gap-3 pt-2">
        <button
            type="button"
            onclick={onClose}
            class="flex-1 px-4 py-2 border border-border rounded-md text-text-muted hover:text-text hover:border-text-muted transition-colors cursor-pointer"
            disabled={isSubmitting}
        >
            Cancel
        </button>
            <button
                type="submit"
                class="flex-1 px-4 py-2 bg-accent text-bg rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer relative"
                disabled={isSubmitting}
            >
                {#if isSubmitting}
                    <div class="flex items-center justify-center">
                        <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending
                    </div>
                {:else}
                    Send
                {/if}
            </button>
    </div>
</form>
