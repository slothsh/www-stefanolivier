<script lang="ts">
import { createForm } from '@tanstack/svelte-form';
import { z } from 'zod';
import { router } from '@inertiajs/svelte';

interface Props {
    onClose: () => void;
    isVisible: boolean;
}

let { onClose, isVisible }: Props = $props();

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be 5000 characters or less'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

let isSubmitting = $state(false);
let successMessage = $state<string | null>(null);
let serverErrors = $state<Record<string, string>>({});

const form = createForm(() => ({
    defaultValues: {
        name: '',
        email: '',
        message: '',
    } as ContactFormValues,
    validators: {
        onChange: contactSchema,
    },
    onSubmit: async ({ value }) => {
        isSubmitting = true;
        serverErrors = {};

        router.post(route('contact.store'), value, {
            onSuccess: () => {
                successMessage = 'Your message has been sent successfully!';
            },
            onError: (errors) => {
                if (errors && typeof errors === 'object') {
                    serverErrors = errors as Record<string, string>;
                }
            },
            onFinish: () => {
                setTimeout(() => {
                    isSubmitting = false;
                    onClose();
                }, 2000);
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
        form.handleSubmit();
    }}
    class="space-y-5"
>
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
                <div class="min-h-5 mt-1">
                    {#if field.state.meta.errors && field.state.meta.errors.length > 0}
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
                <div class="min-h-5 mt-1">
                    {#if field.state.meta.errors && field.state.meta.errors.length > 0}
                        <p class="text-sm text-red-400">{field.state.meta.errors[0]?.message}</p>
                    {:else if serverErrors.email}
                        <p class="text-sm text-red-400">{serverErrors.email}</p>
                    {/if}
                </div>
            {/snippet}
        </form.Field>
    </div>

    <div>
        <label for="message" class="block text-sm font-medium text-text-muted mb-1.5">
            Message
        </label>
        <form.Field name="message">
            {#snippet children(field)}
                <textarea
                    id="message"
                    name={field.name}
                    rows="4"
                    value={field.state.value}
                    onblur={field.handleBlur}
                    oninput={(e) => field.handleChange(e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                    placeholder="Your message..."
                ></textarea>
                <div class="min-h-5 mt-1">
                    {#if field.state.meta.errors && field.state.meta.errors.length > 0}
                        <p class="text-sm text-red-400">{field.state.meta.errors[0]?.message}</p>
                    {:else if serverErrors.message}
                        <p class="text-sm text-red-400">{serverErrors.message}</p>
                    {/if}
                </div>
            {/snippet}
        </form.Field>
    </div>

    {#if Object.keys(serverErrors).length > 0 && !serverErrors.name && !serverErrors.email && !serverErrors.message}
        <p class="text-sm text-red-400">An error occurred. Please try again.</p>
    {/if}

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
                    Send Message
                {/if}
            </button>
    </div>
</form>
