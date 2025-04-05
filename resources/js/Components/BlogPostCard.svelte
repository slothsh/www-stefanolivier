<script lang="ts">
import type { ComponentProps, BlogPostItem } from "@/types";

type Props = {
    post: BlogPostItem,
};

let {
    post,
    class: _class,
}: ComponentProps<Props> = $props();
</script>

<div class={mc("border border-border w-full p-8", _class)}>
    <h2 class="font-bold text-2xl mb-4">{post.title}</h2>
    <p>{post.content}</p>
</div>
