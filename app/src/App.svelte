<script>
import Router from 'svelte-spa-router';
import Sidebar from './components/Sidebar/Sidebar.svelte';
import Profile from './components/Profile/Profile.svelte';
</script>

<style>
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
}
</style>

<div class="app-container">
	<div class="sidebar-container">
		<Sidebar/>
	</div>
	<div class="content-container">
		<Profile/>
	</div>
</div>
