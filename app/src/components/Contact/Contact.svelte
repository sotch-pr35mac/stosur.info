<script>
import SectionContent from '../SectionContent/SectionContent.svelte';
import SectionTitle from '../SectionTitle/SectionTitle.svelte';
import TextBox from '../TextBox/TextBox.svelte';
import Clickable from '../Clickable/Clickable.svelte';
import { SendIcon } from 'svelte-feather-icons';

const sendTo = 'p.wanstobas@gmail.com';
let name;
let email;
let subject;
let message;

const getSubject = (subject, name) => `Contact Request from ${name}: ${subject}`;
const getBody = (email, messge) => `${message}\n\nReply to ${email}.`;
const urlEncode = text => encodeURI(text);
const send = () => {
    document.location.href = urlEncode(`mailto:${sendTo}?subject=${getSubject(subject, name)}&body=${getBody(email, message)}`);
}
</script>

<style>
/* iPhone Portrait */
@media (max-width: 414px) {
    .contact--container {
        display: unset !important;
    }
}
.contact--container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
}
.contact--content {
    flex: 1;
    padding: var(--space--extra-large);
}
</style>

<SectionContent color="dark">
	<SectionTitle>
		<h1 id="contact">Contact</h1>
	</SectionTitle>
    <div class="contact--container">
        <div class="contact--content">
            <h1>Let's Build Great Things Together</h1>
            <p>Based out of Detroit, Michigan. Demos and more information on portfolio projects available upon request.</p>
        </div>
        <div class="contact--content">
            <TextBox type="text" label="Name" bind:value={name} /> 
            <TextBox type="email" label="Email" bind:value={email} />
            <TextBox type="text" label="Subject" bind:value={subject} />
            <TextBox type="textarea" label="Message" bind:value={message} />
            <Clickable on:click={() => send()}>
                <SendIcon size="16" />
                &nbsp;
                Send Message
            </Clickable>
        </div>
    </div>
</SectionContent>
