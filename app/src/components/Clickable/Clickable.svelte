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
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
	background-color: var(--color--white);
}
</style>

<button class="clickable-button">
	<slot></slot>
</button>
