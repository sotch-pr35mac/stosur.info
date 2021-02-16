<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
</script>

<style>
.clickable-button {
	border: none;
	background: var(--color--grey-2);
	cursor: pointer;
	color: var(--color--black);
	padding: var(--space--large);
	margin: var(--space);
	font-size: 0.8em;
	border-radius: var(--border-radius--small);
	display: flex;
	align-items: center;
}
.clickable-button:hover {
	transition-property: box-shadow, background-color;
	transition-duration: var(--transition-duration);
	box-shadow: var(--shadow);
	background-color: var(--color--white);
}
</style>

<button class="clickable-button" on:click={() => dispatch('click')}>
	<slot></slot>
</button>
