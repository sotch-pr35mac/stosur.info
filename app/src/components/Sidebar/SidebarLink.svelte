<style>
.sidebar-link {
	margin: var(--space);
	padding: var(--space--large);
	border: none;
	cursor: pointer;
	color: var(--text-color--light);
	font-family: var(--font--text);
	width: 100%;
	background-color: var(--color--white);
	text-align: left;
	font-size: 1em;
	border-radius: var(--border-radius);
}
.sidebar-link:hover {
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
	color: var(--color--black);
	transition-property: box-shadow, color;
	transition-duration: 0.25s;
}
</style>

<button class="sidebar-link">
	<slot></slot>
</button>
