<script>
import Router from 'svelte-spa-router';
import Sidebar from './components/Sidebar/Sidebar.svelte';
import Landing from './components/Landing/Landing.svelte';
import BrandingBar from './components/Landing/BrandingBar.svelte';
import Profile from './components/Profile/Profile.svelte';
import Experience from './components/Experience/Experience.svelte';
import Education from './components/Education/Education.svelte';
import Skills from './components/Skills/Skills.svelte';
import Projects from './components/Projects/Projects.svelte';
import Contact from './components/Contact/Contact.svelte';
</script>

<style>
/* iPad Portrait */
@media (max-width: 1024px) {
    .app-container {
        flex-direction: column;
    }
    .sidebar-container {
        flex: unset !important;
    }
}
.app-container {
	display: flex;
	height: 100vh;
}
.sidebar-container {
	display: flex;
	flex: 1;
}
.content-container {
	display: flex;
	flex: 3.5;
	flex-direction: column;
	overflow-y: scroll;
    scroll-behavior: smooth;
}
.content {
	display: block;
	overflow-y: scroll;
	height: 100vh;
	width: 100%;
}
</style>

<div class="app-container">
	<div class="sidebar-container">
		<Sidebar />
	</div>
	<div class="content-container">
		<div class="content">
			<Landing />
			<BrandingBar />
			<Profile />
			<Projects />
			<Experience />
			<Education />
            <!--
			<Skills />
            -->
			<Contact />
		</div>
	</div>
</div>
