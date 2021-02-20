<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';
import Clickable from '../Clickable/Clickable.svelte';
import { DownloadIcon, SendIcon } from 'svelte-feather-icons';

const resumeLink = '../Preston_Wang-Stosur-Bassett.pdf';
const emailLink = 'mailto:p.wanstobas@gmail.com';

const constructLocalUrl = partialPath => `${document.location.protocol}//${document.location.host}/${partialPath}`;
const navigate = (url, localLink) => {
    document.location.href = localLink ? constructLocalUrl(url) : url;
};
</script>

<style>
/* iPhone Portrait */
@media (max-width: 414px) {
    .about-section--content {
        display: unset !important;
    }
}
.about-section--content {
	display: flex;
	flex-direction: row;
    align-items: center;
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
		<img src="img/author.jpg" class="about-section--image" alt="Author Image" />
		<div class="about-section--text">
			<h3>Hi, I'm Preston.</h3>
            <p>
                I am a senior software engineer and conversational experience architect who is passionate and dedicated to his work. I excel at building beautiful software and robust conversations in fast-paced environments. I am experienced in building products, delivering for clients, and managing a team.
            </p>
            <p>
                I work at the intersection of people and technology. Passionate about bringing sustainability and morale to work, I am self-motivated and can effectively explain complex situations in easy to understand terms.
            </p>
            <p>
                Seeking a company to grow with where I can meaningfully contribute to company culture, mentor team members, and build robust software experiences.
            </p>
			<div class="about-button-group">
				<Clickable on:click={() => navigate(resumeLink, true)}>
					<DownloadIcon size="16" />
					&nbsp;
					Download Resume
				</Clickable>
				<Clickable on:click={() => navigate(emailLink, false)}>
					<SendIcon size="16" />
					&nbsp;
					Hire Me!
				</Clickable>
			</div>
		</div>
	</div>
</SectionContent>
