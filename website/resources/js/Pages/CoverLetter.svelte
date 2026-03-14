<script lang="ts">
import type { CoverLetterData } from '@/types';
import { formatDate } from 'date-fns';

interface Props {
    coverLetter: CoverLetterData;
}

let { coverLetter }: Props = $props();

function formatRange(start: string, end?: string): string {
    const startFormatted = formatDate(start, 'MMM y');
    const endFormatted = end ? formatDate(end, 'MMM y') : 'Present';
    return `${startFormatted} - ${endFormatted}`;
}
</script>

<div class="min-h-screen bg-white text-gray-900 print:p-0">
    <div class="max-w-[210mm] mx-auto p-8 print:p-6 print:max-w-none">
        <header class="mb-10 print:mb-8">
            <div class="mb-6">
                <p class="text-sm text-gray-600">{coverLetter.content.date}</p>
            </div>
            
            <div class="mb-6">
                <p class="text-lg font-medium text-gray-900">{coverLetter.content.recipient_name}</p>
                <p class="text-sm text-gray-600">{coverLetter.content.recipient_title}</p>
                <p class="text-sm text-gray-600">{coverLetter.content.recipient_company}</p>
                {#if coverLetter.content.recipient_address}
                    <p class="text-sm text-gray-600">{coverLetter.content.recipient_address}</p>
                {/if}
            </div>
        </header>

        <div class="mb-6">
            <p class="text-lg font-medium text-gray-900 mb-2">Dear {coverLetter.content.recipient_name},</p>
        </div>

        {#if coverLetter.content.paragraphs && coverLetter.content.paragraphs.length > 0}
            <div class="space-y-6">
                {#each coverLetter.content.paragraphs as paragraph, index}
                    <p class="text-gray-700 leading-relaxed print:text-xs">{paragraph}</p>
                {/each}
            </div>
        {/if}

        <div class="mt-10 print:mt-8">
            <p class="text-gray-700">{coverLetter.content.closing},</p>
            <p class="text-gray-700 mt-2 font-medium">{coverLetter.content.sender_name}</p>
            {#if coverLetter.content.sender_title}
                <p class="text-sm text-gray-600">{coverLetter.content.sender_title}</p>
            {/if}
            {#if coverLetter.content.sender_phone}
                <p class="text-sm text-gray-600">{coverLetter.content.sender_phone}</p>
            {/if}
            {#if coverLetter.content.sender_email}
                <p class="text-sm text-gray-600">
                    <a href="mailto:{coverLetter.content.sender_email}" class="hover:text-gray-900 print:text-gray-600">
                        {coverLetter.content.sender_email}
                    </a>
                </p>
            {/if}
        </div>
    </div>
</div>
