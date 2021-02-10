<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';
import ListItemDescription from '../ListItemDescription/ListItemDescription.svelte';

const education = [
	{
		id: 1,
		display: true,
		startDate: '2014',
		endDate: '2018',
		title: 'B.S. Computer Science',
		name: 'Kalamazoo College',
		description: 'Studied computer science and Chinese with a 3.6 GPA. Studied abroad one year in Beijing at Capital Normal University and Harbin Institute of Technology in Harbin'
	},
	{
		id: 2,
		display: true,
		startDate: '2011',
		endDate: '2014',
		title: 'High School',
		name: 'Glenbard West',
		description: 'Enrolled in all honors and AP classes. On high honor roll with a weighted 5.3 GPA. Vice President Chinese National Honors Society.'
	}
];
</script>

<SectionContent color="light">
	<SectionTitle>
		<h1>Education</h1>
	</SectionTitle>
	<ListItemDescription items={education} showLink={false} />
</SectionContent>
