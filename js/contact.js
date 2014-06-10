$(document).ready(function() {
	var name = $("#name").val();
	var email = $("#email").val();
	var subject = $("#subject").val();
	var message = $("#message").val();

	//Listen for click of submit button
	$("#btn-submit").click(function() {
    alert("button press");
		$.post("php/contact.php",
			{ subject: subject, message: message, name: name, email: email },
			function(data) {
				alert("Your message has been sent");
			});
	});
});
