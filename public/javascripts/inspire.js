$(function(){
	$('#generateButton').click(function(){
		console.log('clicked');
		$.post('/renderRandomIdea', {numIdeas:1}, function(data){
			console.log(data)
			$('div.ideaPoolWrap').html(data);
		});
	});
	$('#mashupButton').click(function(){
		console.log('clicked');
		$.post('/renderRandomIdea', {numIdeas:2}, function(data){
			console.log(data)
			$('div.ideaPoolWrap').html(data);
		});
	});

});