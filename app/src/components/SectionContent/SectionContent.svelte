<script>
export let color = 'light';

const getClasses = () => {
	return ['section-content',
		`section-content--${color}`].join(' ');	
};
</script>

<style>
.section-content {
	width: calc(100% - var(--space--gutter--large));
	margin: 0;
	padding: var(--space--gutter);
	height: max-content;
}
.section-content--dark {
	background-color: var(--color--grey-1);
}
.section-content--light {
	background-color: var(--color--white);
}
</style>

<section class="{getClasses()}">
	<slot></slot>
</section>
