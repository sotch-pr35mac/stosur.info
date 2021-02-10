<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';
import Clickable from '../Clickable/Clickable.svelte';
import { DownloadIcon, SendIcon } from 'svelte-feather-icons';
</script>

<style>
.about-section--content {
	display: flex;
	flex-direction: row;
}
.about-section--image {
	flex: 1;
	display: flex;
	border-radius: var(--border-radius);
    height: 35vh;
}
.about-section--text {
	flex: 3;
	margin-left: var(--space--extra-large);
}
.about-button-group {
	display: flex;
	align-items: center;
	flex-direction: row;
}
</style>

<SectionContent color="dark">
	<SectionTitle>
		<h1 id="about">About</h1>
	</SectionTitle>
	<div class="about-section--content">
		<img src="img/author.jpg" class="about-section--image" />
		<div class="about-section--text">
			<h3>Hi, I'm Preston.</h3>
			<p>
				I am a self-motivated full-stack senior software engineer with excellent communication skills who is passionate and dedicated to his work. I ahve an eye for design and a talent for software engineering. I am experienced in building products, delivering for clients, and managing a team.
			</p>
			<p>
				I am seeking a company to grow with. I am looking to further my passion and knowledge of software engineering. Devoted to making the world a better place.
			</p>
			<div class="about-button-group">
				<Clickable>
					<DownloadIcon size="16" />
					&nbsp;
					Download Resume
				</Clickable>
				<Clickable>
					<SendIcon size="16" />
					&nbsp;
					Hire Me!
				</Clickable>
			</div>
		</div>
	</div>
</SectionContent>
