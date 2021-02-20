<script>
import {
	GithubIcon,
	LinkedinIcon,
	MailIcon,
    AlignRightIcon
} from 'svelte-feather-icons';

import SidebarLink from './SidebarLink.svelte';
import SidebarIcon from './SidebarIcon.svelte';

const navigationLinks = [
	'About',
	'Projects',
	'Experience',
	'Education',
	// 'Skills',
	'Contact'
];
const iconLinks = [
	{
		icon: GithubIcon,
		link: 'https://github.com/sotch-pr35mac'
	},
    /*
	{
		icon: LinkedinIcon,
		link: ''
	},
    */
	{
		icon: MailIcon,
		link: 'mailto:p.wanstobas@gmail.com'
	}
]; 
</script>

<style>
@media (max-width: 1024px) {
    .sidebar {
        flex-direction: row !important;
        padding: var(--space--extra-large) !important;
    }
    .sidebar--links {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .sidebar--brand {
        margin-bottom: unset !important;
    }
    .sidebar--icons--container {
        display: none;
    }
    .sidebar--brand-subtitle {
        display: none;
    }
}
@media (max-width: 414px) {
    .sidebar--brand-name {
        display: none !important;
    }
    .sidebar--brand-shortname {
        display: unset !important;
    }
    .sidebar--links {
        display: none;
    }
}
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
.sidebar--brand-name, .sidebar--brand-shortname {
	margin: var(--space) 0;
}
.sidebar--brand-shortname {
    display: none;
}
.sidebar--brand-subtitle {
	margin: 0px;
	font-size: 1em;
    line-height: 1.5;
    opacity: 0.7;
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
        <h2 class="sidebar--brand-shortname">
            Preston
        </h2>
		<p class="sidebar--brand-subtitle">
			Software Engineer<br/>
            & Experience Architect
		</p>
	</div>	
	<div class="sidebar--links">
		{#each navigationLinks as navItem}
			<SidebarLink color="white" width="full-width" link={navItem.toLowerCase()}>
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
