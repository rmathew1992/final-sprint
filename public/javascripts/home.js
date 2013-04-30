$(function(){
  $(document).ready(function() {
    console.log("ready");

	$('#navbar_ideapanel').hide();	
	$('#navbar_yourideas').click(function(){
		console.log("You clicked it");
		$('#navbar_ideapanel').slideDown('slow');
	})
	$('#navbar_yourideas_close').click(function(){
		console.log("Closing your ideas");
		$('#navbar_ideapanel').hide();
	})
  	});
})