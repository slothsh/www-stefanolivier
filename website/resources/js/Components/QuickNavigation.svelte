<script lang="ts">
import Fa from 'svelte-fa';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="flex justify-start mt-8">
    <div class="h-32">
        {#each {length: 3} as _, i}
            <h1>Velit aliquyam volutpat sed.</h1>
        {/each}
    </div>
</div>
