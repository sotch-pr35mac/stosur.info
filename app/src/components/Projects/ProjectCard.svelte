<script>
export let name;
export let description;
export let role;
export let start;
export let end;
export let image;
export let link;
</script>

<style>
@media (pointer: course) {
    .project-card--content {
        --project-card--opacity: 1;
    }
}
@media (pointer: fine) {
    .project-card--content {
        --project-card--opacity: 0;
    }
}
@media (prefers-color-scheme: dark) {
    .project-card--content {
        --project-card--background-color: rgba(255, 255, 255, 0.9);
    }
    .project-card--link {
        --project-card--link-color: var(--color--primary-end);
    }
}
@media (prefers-color-scheme: light) {
    .project-card--content {
        --project-card--background-color: rgba(0, 0, 0, 0.9);
    }
    .project-card--link {
        --project-card--link-color: var(--color--primary-start);
    }
}
.project-card--container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38vh;
    background-image: var(--project-image);
    background-size: cover;
    border-radius: var(--border-radius);
}
.project-card--content {
    opacity: var(--project-card--opacity);
    height: 100%;
    width: 100%;
    background-color: var(--project-card--background-color);
    border-radius: var(--border-radius);
    transition-duration: var(--transition-duration);
    transition-property: opacity;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
}
.project-card--container:hover .project-card--content {
    opacity: 1;
}
.project-card--title {
    font-family: var(--font--title);
    font-weight: var(--font-weight--title);
}
.project-card--title, .project-card--description, .project-card--footer {
    color: var(--color--white);
}
.project-card--description, .project-card--footer, .project-card--link {
    font-family: var(--font--text);
    font-weight: var(--font-weight--text);
}
.project-card--description {
    padding: var(--space--small);
    text-align: center;
}
.project-card--link {
    text-decoration: underline;
    transition-duration: var(--transition-duration);
    transition-property: color;
    color: var(--project-card--link-color);
}
.project-card--link:hover {
    color: var(--color--white);
}
.project-card--footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 90%;
}
</style>

<div class="project-card--container" style="--project-image: url({image});">
    <div class="project-card--content">
        <h1 class="project-card--title">{name}</h1>
        <p class="project-card--description">{description}</p>
        <a href="{link}" class="project-card--link" target="_blank">More Information</a>
        <span class="project-card--footer">
            <p class="project-card--date">{start} - {end}</p>
            <p class="project-card--role">{role}</p>
        </span>        
    </div>
</div>
