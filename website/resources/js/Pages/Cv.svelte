<script lang="ts">
import type { CvData } from '@/types';
import { formatDate } from 'date-fns';
import Fa from 'svelte-fa';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faLink } from '@fortawesome/free-solid-svg-icons';

interface Props {
    cv: CvData;
}

let { cv }: Props = $props();

function formatRange(start: string, end?: string): string {
    const startFormatted = formatDate(start, 'MMM y');
    const endFormatted = end ? formatDate(end, 'MMM y') : 'Present';
    return `${startFormatted} - ${endFormatted}`;
}

function getExternalLinkIcon(iconKey: string) {
    switch (iconKey.toLowerCase()) {
        case 'linkedin':
            return faLinkedin;
        case 'github':
            return faGithub;
        case 'globe':
            return faGlobe;
        default:
            return faLink;
    }
}
</script>

<div class="min-h-screen bg-white text-gray-900 print:p-0">
    <div class="max-w-[210mm] mx-auto p-8 print:p-6 print:max-w-none">
        <header class="border-b border-gray-300 pb-6 mb-6 print:pb-4 print:mb-4">
            <div class="flex justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 print:text-2xl">{cv.content.name}</h1>
                    {#if cv.content.title}
                        <p class="text-xl text-gray-600 mt-1 print:text-lg">{cv.content.title}</p>
                    {/if}
                    <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 print:gap-3 print:text-xs">
                        {#if cv.content.email}
                            <a href="mailto:{cv.content.email}" class="hover:text-gray-900 print:text-gray-600">{cv.content.email}</a>
                        {/if}
                        {#if cv.content.phone}
                            <a href="tel:{cv.content.phone}" class="hover:text-gray-900 print:text-gray-600">{cv.content.phone}</a>
                        {/if}
                        {#if cv.content.location}
                            <span class="print:text-gray-600">{cv.content.location}</span>
                        {/if}
                    </div>

                    {#if cv.content.status && cv.content.status.length > 0}
                        <div class="flex flex-wrap gap-2 mt-2">
                            {#each cv.content.status as status}
                                <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary print:bg-primary/5 print:text-primary">
                                    {status}
                                </span>
                            {/each}
                        </div>
                    {/if}

                    {#if cv.content.externalLinks && cv.content.externalLinks.length > 0}
                        <div class="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 print:gap-3 print:text-xs">
                            {#each cv.content.externalLinks as link}
                                <a href={link.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 hover:text-gray-900 print:text-gray-600">
                                    <Fa icon={getExternalLinkIcon(link.icon)} class="w-4 h-4" />
                                    <span>{link.label}</span>
                                </a>
                            {/each}
                        </div>
                    {/if}

                    {#if cv.content.auxiliaryItems && cv.content.auxiliaryItems.length > 0}
                        <div class="flex flex-wrap gap-2 mt-2">
                            {#each cv.content.auxiliaryItems as item}
                                <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 print:bg-gray-50 print:text-gray-600">
                                    {item}
                                </span>
                            {/each}
                        </div>
                    {/if}
                </div>
                <img src={Bio.portraitUrl} class="rounded-full" width="124mm" alt="portrait image">
            </div>
        </header>

        {#if cv.content.summary}
            <section class="mb-6 print:mb-4">
                <h2 class="text-lg font-semibold text-gray-900 mb-2 print:text-base">Summary</h2>
                <p class="text-gray-700 text-sm leading-relaxed print:text-xs">{cv.content.summary}</p>
            </section>
        {/if}

        {#if cv.content.experience.length > 0}
            <section class="mb-6 print:mb-4">
                <h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Experience</h2>
                <div class="space-y-4 print:space-y-3">
                    {#each cv.content.experience as exp}
                        <div class="print:break-inside-avoid">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-semibold text-gray-900 print:text-sm">{exp.position}</h3>
                                    <p class="text-gray-600 text-sm print:text-xs">{exp.company}</p>
                                </div>
                                <span class="text-sm text-gray-500 print:text-xs">{formatRange(exp.startDate, exp.endDate)}</span>
                            </div>
                            <p class="text-gray-700 text-sm mt-2 print:text-xs">{exp.description}</p>
                            {#if exp.highlights && exp.highlights.length > 0}
                                <ul class="list-disc list-outside ml-4 text-sm text-gray-700 mt-2 print:text-xs">
                                    {#each exp.highlights as highlight}
                                        <li class="print:my-0.5">{highlight}</li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if cv.content.education.length > 0}
            <section class="mb-6 print:mb-4">
                <h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Education</h2>
                <div class="space-y-3 print:space-y-2">
                    {#each cv.content.education as edu}
                        <div class="print:break-inside-avoid">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-semibold text-gray-900 print:text-sm">{edu.degree}</h3>
                                    <p class="text-gray-600 text-sm print:text-xs">{edu.institution} - {edu.field}</p>
                                </div>
                                <span class="text-sm text-gray-500 print:text-xs">{formatRange(edu.startDate, edu.endDate)}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if cv.content.skills.length > 0}
            <section class="print:break-inside-avoid">
                <h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    {#each cv.content.skills as skill}
                        <span class="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded print:text-xs print:px-1.5 print:py-0.5">{skill}</span>
                    {/each}
                </div>
            </section>
        {/if}

        {#if cv.content.projects && cv.content.projects.length > 0}
            <section class="mb-6 print:mb-4">
                <h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Projects</h2>
                <div class="space-y-4 print:space-y-3">
                    {#each cv.content.projects as project}
                        <div class="print:break-inside-avoid">
                            <h3 class="font-semibold text-gray-900 print:text-sm">{project.name}</h3>
                            {#if project.description}
                                <p class="text-gray-700 text-sm mt-1 print:text-xs">{project.description}</p>
                            {/if}
                            {#if project.technologies && project.technologies.length > 0}
                                <div class="flex flex-wrap gap-1 mt-2 print:mt-1">
                                    {#each project.technologies as tech}
                                        <span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded print:text-xs print:px-1 print:py-0.5">{tech}</span>
                                    {/each}
                                </div>
                            {/if}
                            {#if project.link}
                                <a href={project.link} target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-500 print:text-xs print:mt-1">
                                    <Fa icon={faGlobe} class="w-3 h-3" />
                                    View Project
                                </a>
                            {/if}
                            {#if project.startDate || project.endDate}
                                <p class="mt-2 text-sm text-gray-500 print:text-xs print:mt-1">
                                    {#if project.startDate}
                                        {formatDate(project.startDate, 'MMM y')}
                                    {/if}
                                    {#if project.startDate && project.endDate}
                                        -
                                    {/if}
                                    {#if project.endDate}
                                        {project.endDate ? formatDate(project.endDate, 'MMM y') : 'Present'}
                                    {/if}
                                </p>
                            {/if}
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</div>
