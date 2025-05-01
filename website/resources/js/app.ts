import './bootstrap';
import './Lib/lib';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/svelte';
import { hydrate, mount } from 'svelte';
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

createInertiaApp({
    resolve: name => {
        // @ts-ignore
        return resolvePageComponent(`./Pages/${name}`, import.meta.glob('./Pages/**/*.svelte', { eager: true }));
    },
    setup({ el, App, props }) {
        if (el!.dataset.serverRendered === 'true') {
            hydrate(App, { target: el!, props });
        } else {
            mount(App, { target: el!, props });
        }
    },
});
