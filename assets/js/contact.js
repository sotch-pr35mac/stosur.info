$(document).ready(function() {
	var name = $("#name").val();
	var email = $("#email").val();
	var subject = "FROM: stosur.info";
	var message = $("#message").val();

	//Listen for click of submit button
	$("#submit-contact").click(function() {
		$.post("assets/js/contact.php",
			{ subject: subject, message: message, name: name, email: email },
			function(data) {
				alert("Message sent!");
			});
	});
});