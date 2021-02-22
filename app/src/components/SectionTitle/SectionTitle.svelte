<style>
.section-title {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
}
.section-title--bar {
	flex-grow: 100;
	margin-left: var(--space--extra-large);
	background-color: var(--color--grey-2);
	height: var(--space--extra-large);
}
</style>

<span class="section-title">
	<slot></slot><div class="section-title--bar"></div>
</span>
