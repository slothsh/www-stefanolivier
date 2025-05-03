<script lang="ts">
import Canvas from "@/Components/Canvas.svelte";
import CopyButton from "@/Components/CopyButton.svelte";
import Fa from "svelte-fa";
import Image from "@/Components/Image.svelte";
import NavigationLayout from "@/Components/NavigationLayout.svelte";
import User from "@/Components/User.svelte";
import hljs from "highlight.js/lib/core";
import type { BlogPost } from "@/types";
import typescript from 'highlight.js/lib/languages/typescript';
import { faExclamationCircle, faQuestionCircle, faWarning, faMagnifyingGlass, type IconDefinition, faLink, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { format as formatDate } from 'date-fns';
import { forwardClick, scrollOnClick, scrollToTop } from "@/Lib/dom.svelte";
import { lattice } from "@/Lib/Canvas/lattice.svelte";
import { secondsToMinutes } from "date-fns";
import { useClientWindow } from "@/Lib/dom.svelte";

type Props = {
    post: BlogPost,
};

let {
    post,
}: Props = $props();

const clientWindow = useClientWindow();

let canvasRect = $derived(
    Vector.xwyh(
        0,
        $clientWindow.width * $clientWindow.scale,
        0,
        $clientWindow.height * $clientWindow.scale,
    ),
);

hljs.registerLanguage('typescript', typescript);

const calloutColors = {
    'info': '#72c282',
}

const defaultAttributes = {
    section: {
        class: 'font-bold [&>*:first-child]:mb-16',
    },

    heading: {
        class: 'font-bold not-last:mb-8 tracking-widest uppercase text-accent-secondary',
    },

    h1: {
        class: 'text-4xl',
    },

    h2: {
        class: 'text-2xl',
    },

    h3: {
        class: 'text-2xl',
    },

    image: {
        class: 'rounded-xl shadow-[10px_10px_30px_rgba(0,0,0,0.2)] overflow-hidden [&:not(:first-child):not(:last-child)]:my-16 first:mb-16 last:mt-16',
    },

    paragraph: {
        class: 'not-last:mb-8 leading-8 font-light text-muted text-[1.15rem]'
    },

    callout: {
        class: 'relative bg-primary-1 border border-border rounded-md shadow-lg p-8 pl-12 [&>*:first-child]:mb-4 [&:not(:first-child):not(:last-child)]:my-16 first:mb-16 last:mt-16 overflow-hidden'
    },

    divider: {
        class: 'text-border [&:not(:first-child):not(:last-child)]:my-16 first:mb-16 last:mt-16'
    },

    code: {},
};

const mockStructuredBody = [
    {
        kind: 'section',
        content: 'Section 1',
        children: [
            {
                kind: 'heading',
                content: 'Foo Bar Baz',
            },
            {
                kind: 'paragraph',
                content: 'Accumsan delenit amet enim imperdiet eu. Lobortis elit accumsan elitr hendrerit nobis. Ut nam sanctus kasd blandit. Sea veniam consectetuer accusam augue. Nisl consetetur takimata esse dolores. Illum aliquyam ex exerci placerat. In sed takimata sit nulla. Feugait minim nulla facilisi qui. Hendrerit congue eos nonummy exerci feugiat. Odio voluptua.',
            },
            {
                kind: 'heading',
                content: 'Foo Bar Baz',
            },
            {
                kind: 'code',
                content: 'const foo = "bar";\nconsole.log(foo); // bar',
                language: 'typescript',
            },
        ]
    },
    {
        kind: 'divider',
    },
    {
        kind: 'section',
        content: 'Section 2',
        children: [
            {
                kind: 'heading',
                content: 'Accumsan Delenit',
            },
            {
                kind: 'paragraph',
                content: 'Accumsan delenit amet enim imperdiet eu. Lobortis elit accumsan elitr hendrerit nobis. Ut nam sanctus kasd blandit. Sea veniam consectetuer accusam augue. Nisl consetetur takimata esse dolores. Illum aliquyam ex exerci placerat. In sed takimata sit nulla. Feugait minim nulla facilisi qui. Hendrerit congue eos nonummy exerci feugiat. Odio voluptua.',
            },
            {
                kind: 'image',
                source: 'https://images.unsplash.com/photo-1523633589114-88eaf4b4f1a8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                height: 500,
                caption: 'Water'
            },
            {
                kind: 'callout',
                content: 'Callout 1',
                icon: 'info',
                children: [
                    {
                        kind: 'paragraph',
                        content: 'Nobis eleifend adipiscing tation soluta duis. Laoreet odio id dolor tincidunt rebum tincidunt consequat. Te gubergren eleifend clita option. Hendrerit.',
                    }
                ],
            },
        ],
    },
    {
        kind: 'divider',
    },
]

function mergeAttributes(...attributeObjects: { class?: string }[]) {
    const merged = {};
    for (const o of attributeObjects) {
        for (const k in o) {
            switch (k) {
                case 'class': {
                    if (!('class' in merged)) {
                        merged['class'] = '';
                    }

                    merged['class'] = [...merged['class'].split(' '), ...o['class']!.split(' ')]
                        .map(s => s.trim())
                        .join(' ');
                } break;
            }
        }
    }

    return merged;
}

function calloutIcon(iconKind: string): IconDefinition {
    switch (iconKind) {
        case 'question': return faQuestionCircle;
        case 'warning': return faWarning;
        case 'hint': return faMagnifyingGlass;
        case 'error': return faWarning;

        case 'info':
        default: return faExclamationCircle;
    }
}

function calloutTitle(iconKind: string): string {
    switch (iconKind) {
        case 'question': return 'Question';
        case 'warning': return 'Warning';
        case 'hint': return 'Hint';
        case 'error': return 'Error';

        case 'info':
        default: return 'Info';
    }
}

let topOfPage = $state(false);
let scrollToTopButtonVisible = $state(false);
let mainSectionElement: HTMLElement | undefined = $state();

function observeScroll(scrollButton: HTMLElement){
    function checkOverlap() {
        const buttonRect = scrollButton.getBoundingClientRect();
        const targetRect = mainSectionElement?.getBoundingClientRect() ?? { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 } as DOMRect;
        scrollToTopButtonVisible = buttonRect.top >= targetRect.bottom;
    }

    window.addEventListener('scroll', checkOverlap);
    window.addEventListener('resize', checkOverlap);

    return {
        destroy() {
            window.removeEventListener('scroll', checkOverlap);
            window.removeEventListener('resize', checkOverlap);
        }
    }
}

function observeScrollTopOfPage(element: HTMLElement) {
    function checkScroll() {
        const elementRect = element.getBoundingClientRect();
        topOfPage = elementRect.bottom >= 0;
    }

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return {
        destroy() {
            window.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        }
    }
}
</script>

{#snippet conditionalContent(content: string | undefined)}
    {#if content}
        {content}
    {/if}
{/snippet}

{#snippet dynamicHeading(content: string | undefined, level: number, children: any = {}, attributes: any = {})}
    {#if level + 1 < 6}
        {@const tag = `h${level + 1}`}
        <svelte:element use:scrollOnClick id={`${Str.slugify(content!)}`} this={tag} {...mergeAttributes(defaultAttributes['heading'], defaultAttributes[tag], attributes, { class: 'group relative cursor-pointer flex items-center' })}>
            {#if attributes.anchor}
                <Fa icon={faLink} size="xs" class="absolute w-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-[150%] self-center group-hover:cursor-pointer" />
            {/if}
            {@render conditionalContent(content)}
            {@render structuredBlock(children, level + 1)}
        </svelte:element>
    {:else}
        {@const tag = `h${level + 1}`}
        <h6 {...mergeAttributes(defaultAttributes['heading'], defaultAttributes[tag], attributes)}>
            {@render conditionalContent(content)}
            {@render structuredBlock(children, level + 1)}
        </h6>
    {/if}
{/snippet}

{#snippet iconTitle(title: string | null, calloutKind: string | null, depth: number, attributes: any = {})}
    {@const icon = calloutIcon(calloutKind ?? 'info')}
    {@const titleString = title ?? calloutTitle(calloutKind ?? 'info')}
    <div {...mergeAttributes({ class: "flex justify-start items-center gap-4 mb-4" }, attributes)}>
        <Fa icon={icon} size="sm" />
        {@render dynamicHeading(titleString, depth, {})}
    </div>
{/snippet}

{#snippet structuredBlock(data: any, depth = 0)}
    {#each data as node}
        {#if node.kind === 'section'}
            <section {...defaultAttributes['section']}>
                {@render dynamicHeading(node.content, 0, {}, { class: 'cursor-pointer', anchor: node.content })}
                {@render structuredBlock(node.children, depth + 1)}
            </section>
        {:else if node.kind === 'heading'}
            {@render dynamicHeading(node.content as string, depth, node.children, { anchor: node.content })}
        {:else if node.kind === 'paragraph'}
            <p {...defaultAttributes['paragraph']}>
                {@render conditionalContent(node.content)}
                {@render structuredBlock(node.children, depth + 1)}
            </p>
        {:else if node.kind === 'callout'}
            <div {...defaultAttributes['callout']}>
                <div class="absolute top-0 left-0 w-[16px] h-full" style:background-color={calloutColors[node.icon]}></div>
                {@render iconTitle(node.content, node.icon, depth)}
                {@render structuredBlock(node.children, depth + 1)}
            </div>
        {:else if node.kind === 'image'}
            <div {...defaultAttributes['image']}>
                <Image src={node.source} alt={node.caption} caption={node.caption} width={node.width} height={node.height} />
            </div>
        {:else if node.kind === 'code'}
            <div class="border border-border rounded-md shadow-lg text-sm font-mono" {...defaultAttributes['code']}>
                <div class="flex justify-end items-center h-8 w-full border-b border-border">
                    <div use:forwardClick class="group flex justify-between items-center border-l border-border h-full">
                        <span class="text-xs text-muted h-full pl-3 content-center group-hover:bg-accent-primary group-hover:cursor-pointer">{Str.lowerCase(node.language)}</span>
                        <CopyButton content={node.content} class="w-8 h-full rounded-tr" />
                    </div>
                </div>
                <pre class="p-6 whitespace-pre-line bg-primary-1">
                    <code>{@html hljs.highlight(node.content, { language: node.language }).value}</code>
                </pre>
            </div>
        {:else if node.kind === 'divider'}
            <hr {...defaultAttributes['divider']}/>
        {/if}
    {/each}
{/snippet}

<NavigationLayout class="relative" title={post.title}>
    <Canvas
        class="fixed top-0 w-full h-full z-[-1]"
        rect={canvasRect}
        program={lattice}
    />

    <div use:observeScroll class={mc("fixed left-0 top-[calc(var(--navigation-height)+32px)] z-(--z-page) ml-48 opacity-0 transition-all", { 'opacity-100 -translate-x-1/2': scrollToTopButtonVisible })}>
        <div use:forwardClick class="w-12 h-12 rounded-md bg-primary border border-border flex items-center cursor-pointer shadow-lg mb-4 hover:brightness-125">
            <button use:scrollToTop />
            <Fa icon={faArrowUp} size="sm" class="w-full h-full" />
        </div>
        <div class="w-12 h-[200px] bg-primary border border-border rounded-md shadow-lg">
        </div>
    </div>

    <main class="relative w-screen px-48 flex justify-center flex-col">
        <div class="relative bg-primary border-r border-l border-border">
            <div use:observeScrollTopOfPage bind:this={mainSectionElement} class="group relative w-full h-[300px] mb-16 shadow-lg border-b border-border overflow-hidden" >
                <img src="https://picsum.photos/1000/300" alt="random image" height={300} class={mc("absolute top-0 left-0 object-fill object-center w-full h-[300px] mix-blend-multiply pb-px z-9 transition-transform duration-2000", { 'scale-110': topOfPage })}>
                <div class="absolute top-0 left-0 w-full h-full [background-image:linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.5))]" style:background-color="#72a2b2"></div>
                <div class="pt-16 mx-28 relative flex flex-col justify-start gap-4 h-full">
                    <h1 class="text-5xl z-(--z-page) relative font-bold mix-blend-plus-lighter text-shadow-lg">{post.title}</h1>
                    <User firstname={Bio.firstname} lastname={Bio.surname} avatar="https://avatar.iran.liara.run/public" avatar_alt={Bio.name} class="relative w-full z-(--z-page)" classText="mix-blend-plus-lighter text-shadow-lg" />
                    <div class="mt-8 justify-self-end flex flex-col items-start">
                        <span class="text-sm mix-blend-plus-lighter z-(--z-page) text-shadow-lg">Posted: {formatDate(post.posted_at, 'yyyy-MM-dd')}</span>
                        <span class="z-(--z-page) text-sm mix-blend-plus-lighter text-shadow-lg">Read Time: {secondsToMinutes(post.read_time)} Minutes</span>
                    </div>
                </div>
            </div>
            <div class="px-28">
                {@render structuredBlock(mockStructuredBody)}
            </div>
        </div>
    </main>
</NavigationLayout>
