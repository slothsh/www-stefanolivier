<script lang="ts">
import type { ComponentProps } from "@/types";

type Props = ComponentProps<{
    rect: Rect,
    invert?: boolean,
}>;

const {
    rect,
    invert,
    class: _class,
}: Props = $props();
</script>

<div class={mc('absolute', _class)}
    style:left={`${rect.x}px`}
    style:top={invert ? 'unset' : `${rect.y}px`}
    style:bottom={invert ? `${rect.y}px` : 'unset'}
    style:width={`${rect.w}px`}
    style:height={`${rect.h}px`}
>
</div>
