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
</script>

<div class="min-h-screen bg-white text-gray-900 print:p-0">
    <div class="max-w-[210mm] mx-auto p-8 print:p-6 print:max-w-none">
        {#each Object.entries(coverLetter.content) as [key, value]}
            {#if Array.isArray(value)}
                <div class="space-y-6">
                    {#each value as item}
                        <p class="text-gray-700 leading-relaxed print:text-xs">{item}</p>
                    {/each}
                </div>
            {:else if typeof value === 'string'}
                <p class="text-gray-700">{value}</p>
            {/if}
        {/each}
    </div>
</div>
