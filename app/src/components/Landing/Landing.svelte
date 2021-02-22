<script>
import { ChevronDownIcon } from 'svelte-feather-icons';

const navigate = slug => {
    document.location.href = `${document.location.href.split('#')[0]}#${slug}`;
}
</script>

<style>
.landing-content {
	width: 100%;
	margin: 0;
	height: 100vh;
	background-image: url('../img/landing1.jpg');
	background-size: cover;
}
.landing--image-mask {
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.25);
	background-size: cover;
	display: flex;
	justify-content: center;
	flex-direction: column;
}
.landing--profile-frame {
	height: 22vh;
	width: 22vh;
	background: rgba(103, 103, 103, 0.7);
	background-size: cover;
	border-radius: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	align-self: center;
}
.landing--profile-photo {
	background-image: url('../img/profile.png');
	background-size: cover;
	border-radius: 100%;
	height: 20vh;
	width: 20vh;
    box-shadow: var(--shadow);
}
.landing--chevron {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color--white);
}
.landing--chevron:hover {
    transform: scale(3) translate(0px, 10%);
}
</style>

<section class="landing-content">
	<div class="landing--image-mask">
		<div class="landing--profile-frame">
			<div class="landing--profile-photo"></div>
		</div>
		<div class="landing--chevron" on:click={() => navigate('about')}>
			<ChevronDownIcon size="24" />	
		</div>
	</div>
</section>
