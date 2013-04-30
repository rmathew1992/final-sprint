$(function(){
  $(document).ready(function() {
    console.log("ready");

	$('#navbar_ideapanel').hide();	
	$('#navbar_yourideas').click(function(){
		console.log("You clicked it");
		$.get('/yourIdeas', function(data){
			console.log(data);
			$('#navbar_ideapanel').html(data);
			$('#navbar_ideapanel').slideDown('slow');
		});
		// $('#navbar_ideapanel').slideDown('slow');
	})
	$(document).on('click','#navbar_yourideas_close',function(){
		console.log("Closing your ideas");
		$('#navbar_ideapanel').slideUp('slow');
	})
	// $('#navbar_yourideas_close').click(function(){
	// 	console.log("Closing your ideas");
	// 	$('#navbar_ideapanel').hide();
	// })
  	});
})