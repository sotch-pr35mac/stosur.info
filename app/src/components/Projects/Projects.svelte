<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';
import ProjectCard from './ProjectCard.svelte';

const projects = [
    {
        name: 'Syng',
        description: 'Designed, developed, and maintain open-source, cross-platform Chinese-to-English dictionary app and study toolkit',
        role: 'Personal Project',
        start: '2016',
        end: 'Present',
        image: '../img/projects/syng.png',
        link: 'http://getsyng.com/'
    },
    {
        name: 'AI Testing',
        description: 'Designed, developed, and maintained AI Testing feature of Conversational AI Platform. Started from requirements document and developed project scope with input from relevant stakeholders. Designed wireframes, developed front-end, and maintained project after launch.',
        role: 'Software Engineer [Clinc]',
        start: '2018',
        end: '2019',
        image: '../img/projects/testing.png',
        link: 'http://clinc.com'
    },
    {
        name: 'Custom Banking Conversational AI',
        description: 'Scoped, developed, and maintained conversational AI solution for existing and potential banking customers. Maintained over 40 training and testing datasets. Worked closely with client to ensure successful project delivery.',
        role: 'Solutions Architect [Clinc]',
        start: '2019',
        end: '2020',
        image: '../img/projects/banking.png',
        link: 'http://clinc.com' 
    },
    {
        name: 'Finie',
        description: `Lead team of developers to build the company's flagship conversational experience product. Conducting code and dataset reviews. Work closely with the product team to create a roadmap and deliver on milestones.`,
        role: 'Tech Lead [Clinc]',
        start: '2020',
        end: 'Present',
        image: '../img/projects/finie.png',
        link: 'https://clinc.com/finie/'
    },
    {
        name: 'chinese-dictionary',
        description: 'A searchable Chinese / English dictionary npm module with helpful utilities.',
        role: 'Package',
        start: '2021',
        end: 'Present',
        image: '../img/projects/chinese-dictionary.png',
        link: 'https://www.npmjs.com/package/chinese-dictionary'
    },
    {
        name: 'chinese_dictionary',
        description: 'A searchable Chinese / English Rust crate with helpful utilities',
        role: 'Package',
        start: '2020',
        end: 'Present',
        image: '../img/projects/chinese_dictionary.png',
        link: 'https://crates.io/crates/chinese_dictionary'
    },
    {
        name: 'character_converter',
        description: 'Turn Traditional Chinese script to Simplified Chinese script and vice-versa. Check string script to determine if string is Traditional or Simplified Chinese Characters.',
        role: 'Package',
        start: '2020',
        end: 'Present',
        image: '../img/projects/character_converter.png',
        link: 'https://crates.io/crates/character_converter'
    },
    {
        name: 'chinese_detection',
        description: 'Classify a string as either English, Chinese, or Pinyin.',
        role: 'Package',
        start: '2020',
        end: 'Present',
        image: '../img/projects/chinese_detection.png',
        link: 'https://crates.io/crates/chinese_detection'
    },
    {
        name: 'prettify_pinyin',
        description: 'Turn tone numbers into tone marks.',
        role: 'Package',
        start: '2017',
        end: 'Present',
        image: '../img/projects/prettify_pinyin.png',
        link: 'https://crates.io/crates/prettify_pinyin'
    },
    {
        name: 'hsk',
        description: 'Return HSK level for Simplified Chinese Characters',
        role: 'Package',
        start: '2020',
        end: 'Present',
        image: '../img/projects/hsk.png',
        link: 'https://crates.io/crates/hsk'
    },
    {
        name: 'chinese_segmenter',
        description: 'Segment Chinese sentences into component words using a dictionary-driven largest first matching approach.',
        role: 'Package',
        start: '2020',
        end: 'Present',
        image: '../img/projects/chinese_segmenter.png',
        link: 'https://crates.io/crates/chinese_segmenter'
    }
].sort((a, b) => {
    let order;

    if(a.start < b.start) {
        order = -1;
    } else if(a.start > b.start) {
        order = 1;
    } else {
        order = 0;
    }

    return order;
});
</script>

<style>
.projects-section--content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space--large);
}
</style>

<SectionContent color="light">
	<SectionTitle>
		<h1 id="projects">Projects</h1>
	</SectionTitle>
    <div class="projects-section--content">
        {#each projects as project}
            <ProjectCard name="{project.name}"
                description="{project.description}"
                role="{project.role}"
                start="{project.start}"
                end="{project.end}"
                image="{project.image}"
                link="{project.link}" /> 
        {/each}
    </div>
</SectionContent>
