import './Lib/lib';
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'
import { render } from 'svelte/server'
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

createServer(page =>
    createInertiaApp({
        page,
        resolve: name => {
            // @ts-ignore
            return resolvePageComponent(`./Pages/${name}`, import.meta.glob('./Pages/**/*.svelte', { eager: true }));
        },
        setup({ App, props }) {
            return render(App, { props })
        },
    }),
)
