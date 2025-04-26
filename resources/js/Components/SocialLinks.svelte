<script lang="ts">
import Fa from 'svelte-fa';
import { faPaste, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

let arrowElement: SVGElement | null = $state(null);
let socialLinksContainer: HTMLDivElement | null = $state(null);
let popupMenu: HTMLDivElement | null = $state(null);
let currentlySelected: string | null = $state(null);
let currentlyFocused: string | null = $state(null);
let lastSelected: string = $state('');
let lastSelectedClipboard: string = $state('');
const closeTimeout: number = 5000;
let currentTimeout: NodeJS.Timeout | null = $state(null);
let copiedTimeout: NodeJS.Timeout | null = $state(null);
let isLoading: boolean = $state(false);
let isRecentlyCopied: boolean = $state(false);

let arrowX = $derived((() => {
    let value = 0;
    const containerRect = (socialLinksContainer as HTMLDivElement | null)?.getBoundingClientRect() ?? new DOMRect();
    const iconBoundRect = document.querySelector('.social-link[data-enabled]')?.getBoundingClientRect() ?? new DOMRect();
    const popupRect = (popupMenu as HTMLDivElement | null)?.getBoundingClientRect() ?? new DOMRect();
    const arrowRect = (arrowElement as SVGElement | null)?.getBoundingClientRect() ?? new DOMRect();

    if (currentlyFocused !== null) {
        const containerStartRelative = (iconBoundRect.left - containerRect.left);
        const arrowStart = containerRect.left - popupRect.left;
        value = containerStartRelative + arrowStart + (iconBoundRect.width / 2) - (arrowRect.width / 2);
    }

    return value;
})());

const items = [
    'social-link-0',
    'social-link-1',
    'social-link-2',
    'social-link-3',
];

function handleCurrentlyFocused(item: ContactItem | null) {
    if (currentlySelected) {
        return;
    }

    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
        isLoading = false;
        isRecentlyCopied = false;
    }

    if (!item) {
        currentTimeout = setTimeout(() => {
            currentlyFocused = null
            lastSelected = currentlyFocused ?? lastSelected;
            lastSelectedClipboard = '';
            isLoading = false;
        }, closeTimeout);

        isLoading = true;

        return;
    }

    currentlyFocused = item.displayName;
    lastSelected = currentlyFocused;
    lastSelectedClipboard = item.src;
}

function handleCurrentlyFocusedDialog() {
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
        isLoading = false;
        return;
    }

    currentTimeout = setTimeout(() => {
        currentlyFocused = null
        lastSelected = currentlyFocused ?? lastSelected;
        lastSelectedClipboard = '';
        isLoading = false;
        isRecentlyCopied = false;
    }, closeTimeout);

    isLoading = true;
}

function handleClose(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (items.some((item) => target.querySelector('#' + item) !== null)) {
        currentlySelected = null;
        currentlyFocused = null;
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
            isLoading = false;
        }
    }
}

async function handleCopyLink(): Promise<void> {
    await navigator.clipboard.writeText(lastSelectedClipboard);
    if (copiedTimeout) {
        clearTimeout(copiedTimeout);
    }

    isRecentlyCopied = true;
    copiedTimeout = setTimeout(() => {
        isRecentlyCopied = false;
    }, 2500);
}
</script>

<svelte:window on:click={handleClose} />

<div bind:this={socialLinksContainer} class="flex justify-between items-center gap-4">
    {#each Object.entries(Bio.contact) as [contactKey, contactValue], i}
        <a id={`social-link-${i}`}
            href={contactValue.src}
            target="_blank"
            rel="noopener noreferrer"
            class="social-link bg-primary cursor-pointer"
            data-enabled={currentlySelected === contactValue.displayName || currentlyFocused === contactValue.displayName ? '' : null}
            onmousemove={() => handleCurrentlyFocused(contactValue)}
            onmouseleave={() => handleCurrentlyFocused(null)}
            >
            <Fa icon={contactValue.icon}
                size="4x"
                class={mc("border border-border shadow rounded-md p-2 icon fill-red-200 hover:bg-accent-primary", {
                    'bg-accent-primary': currentlySelected === contactValue.displayName,
                })}
                color={[currentlySelected, currentlyFocused].includes(contactKey) ? '#eeffff' : '#ccddee'}
                style="width: 64px; height: 64px;"
            />
        </a>
    {/each}
</div>
<div bind:this={popupMenu}
    onmouseenter={handleCurrentlyFocusedDialog}
    onmouseleave={handleCurrentlyFocusedDialog}
    class={mc("mt-6 relative shadow", {
    'animate-in-up': currentlyFocused !== null,
    'animate-out-down': currentlyFocused === null,
    'opacity-0': currentlySelected === null && currentlyFocused === null,
    'pointer-events-none': currentlySelected === null && currentlyFocused === null,
})}>
    <svg bind:this={arrowElement}
        width="64"
        height="24"
        viewBox="-4 0 64 24"
        xmlns="http://www.w3.org/2000/svg"
        class={mc("absolute w-4 h-4 -translate-y-[calc(var(--spacing)*4-1px)]", {
            'opacity-0': arrowX === 0,
        })}
        style:left={`${arrowX}px`}
    >
        <path d="M21.5359 2C23.0755 -0.666669 26.9245 -0.666667 28.4641 2L49.2487 38C50.7883 40.6667 48.8638 44 45.7846 44H4.21539C1.13619 44 -0.788312 40.6667 0.751289 38L21.5359 2Z" fill="#102530" stroke="#203545" stroke-width="4px"/>
    </svg>
    <div class="relative w-[400px] h-16 text-md font-light border border-border rounded-md bg-primary flex justify-center items-center gap-4">
        <div class="absolute top-0 rounded-t left-0 w-full h-(--radius-md) bg-none">
            <div class={mc("bg-accent-primary h-1/2 [animation-duration:5000ms]", { 'animate-progress': isLoading, 'w-0': !isLoading })}></div>
        </div>
        <button class="absolute left-0 border-r border-border w-16 h-full flex justify-center items-center hover:bg-accent-primary cursor-pointer"
            onclick={handleCopyLink}
        >
            <Fa icon={isRecentlyCopied ? faClipboardCheck : faPaste}
                size="sm"
                class={mc('[animation-duration:200ms]', { 'animate-scale-out-in': isRecentlyCopied, 'animate-scale-out-in-again': !isRecentlyCopied })}
            />
        </button>
        <div class="block w-[calc(100%-var(--spacing)*16)] translate-x-[calc(var(--spacing)*8)]">{lastSelected}</div>
    </div>
</div>

