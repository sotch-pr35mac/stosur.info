<script>
export let link = '';
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
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
	color: var(--color--black);
	transition-property: box-shadow, color;
	transition-duration: 0.25s;
}
</style>

<button class="sidebar-icon">
	<slot></slot>
</button>
