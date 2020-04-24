<script>
import {
	GithubIcon,
	LinkedinIcon,
	MailIcon
} from 'svelte-feather-icons';

import SidebarLink from './SidebarLink.svelte';
import SidebarIcon from './SidebarIcon.svelte';

const navigationLinks = [
	'Home',
	'About',
	'Experience',
	'Education',
	'Skills',
	'Projects',
	'Contact'
];
const iconLinks = [
	{
		icon: GithubIcon,
		link: ''
	},
	{
		icon: LinkedinIcon,
		link: ''
	},
	{
		icon: MailIcon,
		link: ''
	}
]; 
</script>

<style>
.sidebar {
	padding: var(--space--gutter);
	width: 100%;
	z-index: 999;
	background-color: var(--color--white);
	transition: var(--transition-duration);
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
	display: flex;
	flex-direction: column;
}
.sidebar--brand {
	text-align: left;
	margin-bottom: var(--space--gutter--large);
	width: 100%;
}
.sidebar--brand-name {
	margin: var(--space) 0;
}
.sidebar--brand-subtitle {
	margin: 0px;
	font-size: 1em;
}
.sidebar--icons--container {
	position: absolute;
	bottom: var(--space--gutter--large);
}
.sidebar--icons {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>

<aside class="sidebar">
	<div class="sidebar--brand">
		<h2 class="sidebar--brand-name">
			Preston<br/>
			Wang-Stosur-Bassett
		</h2>
		<p class="sidebar--brand-subtitle">
			Software Engineer
		</p>
	</div>	
	<div class="sidebar--links">
		{#each navigationLinks as navItem}
			<SidebarLink color="white" width="full-width">
				{ navItem }
			</SidebarLink>
		{/each} 
	</div>
	<div class="sidebar--icons--container">
		<div class="sidebar--icons">
			{#each iconLinks as icon}
				<SidebarIcon link="{icon.link}">
					<svelte:component this={icon.icon} size="20" />
				</SidebarIcon>
			{/each}
		</div>
	</div>
</aside>
