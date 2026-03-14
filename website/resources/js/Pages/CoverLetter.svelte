<script lang="ts">
interface CoverLetterContent {
    [key: string]: string | string[] | undefined;
}

interface Props {
    coverLetter: {
        content: CoverLetterContent;
    };
}

let { coverLetter }: Props = $props();

function getValue(key: string): string | string[] | undefined {
    return coverLetter.content[key];
}

function getString(key: string): string {
    const val = getValue(key);
    return typeof val === 'string' ? val : '';
}

function getArray(key: string): string[] {
    const val = getValue(key);
    return Array.isArray(val) ? val : [];
}
</script>

<div class="min-h-screen bg-white text-gray-900 print:p-0">
    <div class="max-w-[210mm] mx-auto p-8 print:p-6 print:max-w-none">
        {#if getValue('date')}
            <p class="text-sm text-gray-600 mb-6 print:mb-4">{getString('date')}</p>
        {/if}

        {#if getValue('recipient_name') || getValue('recipient_title') || getValue('recipient_company')}
            <header class="border-b border-gray-300 print:pb-4 print:mb-4">
                {#if getValue('recipient_name')}
                    <p class="text-lg font-medium text-gray-900">{getString('recipient_name')}</p>
                {/if}
                {#if getValue('recipient_title')}
                    <p class="text-sm text-gray-600">{getString('recipient_title')}</p>
                {/if}
                {#if getValue('recipient_company')}
                    <p class="text-sm text-gray-600">{getString('recipient_company')}</p>
                {/if}
                {#if getValue('recipient_address')}
                    <p class="text-sm text-gray-600">{getString('recipient_address')}</p>
                {/if}
            </header>
        {/if}

        {#if getValue('salutation')}
            <div class="mb-6 print:mb-4">
                <p class="print:text-xs text-gray-700">Dear {getString('salutation')},</p>
            </div>
        {:else if getValue('recipient_name')}
            <div class="mb-6 print:mb-4">
                <p class="print:text-xs text-gray-700">Dear {getString('recipient_name')},</p>
            </div>
        {/if}

        {#if getArray('paragraphs').length > 0}
            <div class="space-y-6 print:space-y-4">
                {#each getArray('paragraphs') as paragraph}
                    <p class="text-gray-700 leading-relaxed text-sm print:text-xs">{paragraph}</p>
                {/each}
            </div>
        {:else if getArray('body').length > 0}
            <div class="space-y-6 print:space-y-4">
                {#each getArray('body') as paragraph}
                    <p class="text-gray-700 leading-relaxed text-sm print:text-xs">{paragraph}</p>
                {/each}
            </div>
        {/if}

        {#if getValue('closing') || getValue('sender_name')}
            <div class="print:text-xs mt-10 print:mt-8">
                {#if getValue('closing')}
                    <p class="text-gray-700">{getString('closing')},</p>
                {/if}
                {#if getValue('sender_name')}
                    <p class="text-gray-700 mt-2">{getString('sender_name')}</p>
                {/if}
                {#if getValue('sender_title')}
                    <p class="text-gray-700">{getString('sender_title')}</p>
                {/if}
                {#if getValue('sender_phone')}
                    <p class="text-gray-700">{getString('sender_phone')}</p>
                {/if}
                {#if getValue('sender_email')}
                    <p class="text-gray-700">
                        <a href="mailto:{getString('sender_email')}" class="hover:text-gray-900 print:text-gray-700">
                            {getString('sender_email')}
                        </a>
                    </p>
                {/if}
            </div>
        {/if}
    </div>
</div>
