<script>
export let type; // Required
export let placeholder = '';
export let label = false; 
export let value = '';
</script>

<style>
.text-box--container {
    margin: var(--space--large);
}
.text-box--label {
    margin: var(--sppce);
    color: var(--color--grey-3);
}
.text-box--input {
    width: 100%;
    padding: var(--space--large);
    margin: var(--space) 0px var(--space);
    border: 1px solid var(--color--grey-2);
    background: var(--color--white);
    border-radius: var(--border-radius--small);
    box-shadow: var(--shadow);
}
.text-box--input--textarea {
    min-height: calc(var(--space--extra-large) * 4);
}
</style>

<div class="text-box--container">
    {#if label != false}
        <h5 class="text-box--label">{label}</h5>
    {/if}
    {#if type == 'textarea'}
        <textarea bind:value class="text-box--input text-box--input--textarea" placeholder="{placeholder}"></textarea>
    {:else if type == 'email'}
        <input bind:value type="email" class="text-box--input" placeholder="{placeholder}" />
    {:else if type == 'password'}
        <input bind:value type="password" class="text-box--input" placeholder="{placeholder}" />
    {:else}
        <input bind:value type="text" class="text-box--input" placeholder="{placeholder}" />
    {/if}
</div>
