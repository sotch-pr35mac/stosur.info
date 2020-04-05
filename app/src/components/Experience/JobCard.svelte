<script>
export let positionDescription = {};

const renderDate = (startDate, endDate) => {
	let dateHtml = '';
	if(isNaN(parseInt(endDate))) {
		dateHtml = `${startDate}&nbsp;-<br/>${endDate}`;	
	} else {
		dateHtml = `${startDate}<br/>-&nbsp;${endDate}`;
	}

	return dateHtml;
};
</script>

<style>
.job-card--container {
	display: flex;
	align-items: flex-start;
}
.job-card--date {
	
}
.job-card--date-text {
	margin: var(--space--small);
	text-align: right;
}
.job-card--text {
	margin-left: var(--space--extra-large);
}
.job-card--text-title {
	margin: var(--space--small);
	font-size: 1em;
}
.job-card--text-company {
	margin: var(--space--small);
	font-size: 0.8em;
	text-transform: uppercase;
}
.job-card--text-description {
	margin: var(--space--small);
	font-size: 0.9em;
}
</style>

<div class="job-card--container">
	<div class="job-card--date">
		<p class="job-card--date-text">
			{@html renderDate(positionDescription.startDate, positionDescription.endDate) }
		</p>
	</div>
	<div class="job-card--text">
		<h2 class="job-card--text-title">{ positionDescription.title }</h2>
		<h3 class="job-card--text-company">{ positionDescription.company }</h3>
		<p class="job-card--text-description">{ positionDescription.description }</p>
	</div>
</div>
