<script lang="ts">
type Props = {
    tag: string,
};

let {
    tag
}: Props = $props();
</script>

<button class="text-sm py-1 px-3 bg-accent-dark hover:brightness-110 rounded border border-white/10 shadow cursor-pointer">{tag}</button>
