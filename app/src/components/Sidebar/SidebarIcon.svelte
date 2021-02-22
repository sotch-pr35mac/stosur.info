<script>
export let link; 

const navigate = url => {
    document.location.href = url;
}
</script>

<style>
.sidebar-icon {
	margin: var(--space);
	padding: var(--space--large);
	border: none;
	cursor: pointer;
	color: var(--text-color--dark);
	font-family: var(--font--text);
	background-color: var(--color--white);
	border-radius: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.sidebar-icon:hover {
	box-shadow: var(--shadow);
	color: var(--color--black);
	transition-property: box-shadow, color;
	transition-duration: 0.25s;
}
</style>

<button class="sidebar-icon" on:click={() => navigate(link)}>
	<slot></slot>
</button>
