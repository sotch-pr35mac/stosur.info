<script>
import SidebarLink from '../Sidebar/SidebarLink.svelte';

export let items;
export let showLink = false;

let activeIndex = 0;
const getItemList = () => items.map(i => i.name);
const changeActiveIndex = index => {
	activeIndex = index;
}
const splitDescription = paragraph => paragraph.split('. ');
</script>

<style>
.list-item-description--container {
	width: 100%;
	display: flex;
	justify-content: center;
}
.list-item-description {
	display: flex;
	align-items: flex-start;
	max-width: 1000px;
	min-width: 1000px;
}
.list-item-description--list {
	list-style-type: none;
	padding: var(--space) 0;
	margin-top: 0 var(--space--extra-large) 0 0;
	min-width: max-content;
	max-width: max-content;
}
.list-item-description--list-item {
	margin: var(--space--large);
}
.list-item-description--list-item--active {
    font-weight: bold;
    color: var(--color--primary-end);
}
.list-item-description--list-item--content {
	text-transform: uppercase;
}
.list-item-description--detail {
	margin-left: var(--space--extra-large);
}
.list-item-description--detail--title {
	margin: var(--space);
}
.list-item-description--detail--subtitle {
	margin: var(--space);
	color: var(--text-color--light);
}
.list-item-description--detail--description {
	margin: var(--space);
	margin-top: var(--space--extra-large);
}
.list-item-description--detail--link {
	text-decoration: none;
	color: var(--color--primary-end);	
}
.list-item-description--detail--link:hover {
	border-bottom: 1.5px solid var(--color--primary-end);
}
.list-item-description--detail--description-item {
	margin: var(--space);
}
</style>

<div class="list-item-description--container">
<div class="list-item-description">
	<ul class="list-item-description--list">
		{#each getItemList() as itemName, i}
			<li class="list-item-description--list-item" on:click="{() => changeActiveIndex(i)}">
			<SidebarLink color="grey" width="full-width">
				<span class:list-item-description--list-item--active="{i == activeIndex}">{itemName}</span>
			</SidebarLink>
			</li>
		{/each}
	</ul>
	<div class="list-item-description--detail">
		<h1 class="list-item-description--detail--title">
			{ items[activeIndex].title }
			{#if showLink}
				@&nbsp;<a class="list-item-description--detail--link" href="{items[activeIndex].link}" target="_blank">{items[activeIndex].name}</a>
			{/if}
		</h1>
		<h3 class="list-item-description--detail--subtitle">{ items[activeIndex].startDate }&nbsp;-&nbsp;{ items[activeIndex].endDate }</h3>
		<ul class="list-item-description--detail--description">
			{#each splitDescription(items[activeIndex].description) as sentence}
				<li class="list-item-description--detail--description-item">{sentence}</li>
			{/each}
		</ul>
	</div>
</div>
</div>
