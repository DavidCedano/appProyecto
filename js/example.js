$('#btn_cancelar').click(function(e){
		navigator.notification.alert(
	    'You are the winner!',  // message
	    alertDismissed,         // callback
	    'Game Over',            // title
	    'Done'                  // buttonName
		);
	});