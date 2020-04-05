<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';
import JobCard from './JobCard.svelte';

const experiences = [
	{
		display: true,
		startDate: '2018',
		endDate: 'Present',
		title: 'Senior Software Engineer',
		company: 'Clinc',
		description: 'Developed features and resolved issues on the Product Engineering team building a conversational AI web platform. Architected conversational AI for clients. Frew a team from zero to six and mentored junior engineers as teh lead of the AI Experience Development team.'
	},
	{
		display: true,
		startDate: '2016',
		endDate: '2016',
		title: 'Front-End Developer',
		company: 'MCON Beijing',
		description: 'Developed WeChat apps for corporate clients in China using Angular and WeUI. Gained insights into developing for the Chinese market while working on a remote international team.'
	},
	{
		display: true,
		startDate: '2015',
		endDate: '2016',
		title: 'Manager',
		company: 'CPR Cell Phone Repair',
		description: 'Managed teh Kalamazoo franchise location of five people, repaired a variety of mobile electronics, and increased sales with a "no-pressure" sales style.'
	},
	{
		display: true,
		startDate: '2010',
		endDate: '2013',
		title: 'Junior Software Engineer',
		company: 'Floydware, LLC',
		description: 'Internationalized software for use in other languages and developed Android mobile app for cloud scheduling software company'
	}
];
</script>

<style>
.experience-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 10px;
	grid-auto-rows: minmax(100px, auto);
}
</style>

<SectionContent color="light">
	<SectionTitle>
		<h1>Experience</h1>
	</SectionTitle>
	<div class="experience-grid">
		{#each experiences as experience}
			{#if experience.display}
				<JobCard positionDescription={experience}/>
			{/if}
		{/each}
	</div>
</SectionContent>
