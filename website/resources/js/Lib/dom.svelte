<script lang="ts" context="module">
import { readable, writable } from "svelte/store";

const darkMode = writable(true);

export const clientDarkMode = {
    darkMode,
    toggleDarkMode: () => darkMode.update((mode) => !mode),
};

export function useClientWindow() {
    return readable(
        { width: window.innerWidth, height: window.innerHeight, scale: window.devicePixelRatio || 2 },
        (set) => {
            const update = () => set({ width: window.innerWidth, height: window.innerHeight, scale: window.devicePixelRatio || 2 });
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
        }
    );
}

export function useClientCursor() {
    return readable(
        { position: Vector.xy(0, 0), offset: Vector.xy(0, 0) },
        (set) => {
            const update = (e: MouseEvent) => set({ position: Vector.xy(e.clientX, e.clientY), offset: Vector.xy(e.movementX, e.movementY) });
            window.addEventListener("mousemove", update);
            return () => window.removeEventListener("mousemove", update);
        }
    );
}

export function forwardClick(element: Element) {
    const handleClick = () => {
        const button = element.querySelector('button');
        if (button) {
            button.click();
        }
    };

    element.addEventListener('click', handleClick);

    return {
        destroy() {
            element.removeEventListener('click', handleClick);
        }
    };
}

export function forwardClickSiblings(element: HTMLElement) {
    const handleClick = () => {
        if (!element.parentNode) {
            return;
        }

        element.parentNode
            .querySelectorAll('button')
            .forEach(sibling =>  {
                if (sibling !== element) {
                    sibling.click();
                }
            });
    };

    element.addEventListener('click', handleClick);

    return {
        destroy() {
            element.removeEventListener('click', handleClick);
        }
    };
}

export function scrollOnClick(element: HTMLElement) {
    const offset = [
        parseInt(
            getComputedStyle(document.documentElement)
                .getPropertyValue("--navigation-height")
                .trim(),
        ),
    ].reduce((acc, n) => acc + n, 0);

    const scroll = () => window.scrollBy({
        top: element.getBoundingClientRect().y! - offset - 32,
        behavior: "smooth",
    });

    element.addEventListener('click', scroll);

    return {
        destroy() {
            element.removeEventListener('click', scroll);
        }
    };
}

export function scrollToTop(element: HTMLElement) {
    const scroll = () => window.scrollTo({ top: 0, behavior: "smooth", });

    element.addEventListener('click', scroll);

    return {
        destroy() {
            element.removeEventListener('click', scroll);
        }
    };
}
</script>
