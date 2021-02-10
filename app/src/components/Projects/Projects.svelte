<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';

const projects = [
    {
        name: '',
        description: '',
        role: '',
        start: '',
        end: '',
        image: ''
    }
];
</script>

<style>
.projects-section--content {

}
</style>

<SectionContent color="light">
	<SectionTitle>
		<h1 id="projects">Projects</h1>
	</SectionTitle>
    <div class="projects-section--content">

    </div>
</SectionContent>
