$(document).ready(function() {

$('#btn_cancelar').click(function(){
		navigator.notification.alert(
	    'You are the winner!',  // message
	    alertDismissed,         // callback
	    'Game Over',            // title
	    'Done'                  // buttonName
		);
	});
});