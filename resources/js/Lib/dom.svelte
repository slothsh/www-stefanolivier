<script lang="ts" context="module">
import { readable } from "svelte/store";

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
</script>
