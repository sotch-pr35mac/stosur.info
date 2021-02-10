<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';
import ListItemDescription from '../ListItemDescription/ListItemDescription.svelte';

const experiences = [
	{
		id: 1,
		display: true,
		startDate: '2018',
		endDate: 'Present',
		title: 'Senior Software Engineer',
		name: 'Clinc',
		description: 'Developed features and resolved issues on the Product Engineering team building a conversational AI web platform. Architected conversational AI for clients. Frew a team from zero to six and mentored junior engineers as teh lead of the AI Experience Development team.',
		link: 'https://clinc.com/'
	},
	{
		id: 2,
		display: true,
		startDate: '2016',
		endDate: '2016',
		title: 'Front-End Developer',
		name: 'MCON Beijing',
		description: 'Developed WeChat apps for corporate clients in China using Angular and WeUI. Gained insights into developing for the Chinese market while working on a remote international team.',
		link: 'https://www.mcon-group.com/'
	},
	{
		id: 3,
		display: true,
		startDate: '2015',
		endDate: '2016',
		title: 'Manager',
		name: 'CPR Cell Phone Repair',
		description: 'Managed teh Kalamazoo franchise location of five people, repaired a variety of mobile electronics, and increased sales with a "no-pressure" sales style.',
		link: 'https://www.cellphonerepair.com/'
	},
	{
		id: 4,
		display: true,
		startDate: '2010',
		endDate: '2013',
		title: 'Junior Software Engineer',
		name: 'Floydware, LLC',
		description: 'Internationalized software for use in other languages and developed Android mobile app for cloud scheduling software company',
		link: 'https://www.rosysalonsoftware.com/'
	}
];
</script>

<SectionContent color="dark">
	<SectionTitle>
		<h1 id="experience">Experience</h1>
	</SectionTitle>
	<ListItemDescription items={experiences} showLink={true} />
</SectionContent>
