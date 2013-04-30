$(function(){
	$('#generateButton').click(function(){
		console.log('clicked');
		$.get('/renderRandomIdea', function(data){
			console.log(data)
			$('#ideaWrap').html(data);
		});
	});
});