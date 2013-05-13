var clicks = 0;
$(function(){
  $(document).ready(function() {
  	adjustCSS();
    console.log("ready");

	$('#navbar_ideapanel').hide();	
	$('#navbar_yourideas').click(function(){
		if (clicks % 2 == 0){
			console.log("You clicked it");
			$.get('/yourIdeas', function(data){
				console.log(data);
				$('#navbar_ideapanel').html(data);
				$('#navbar_ideapanel').slideDown('slow');
			});		
			clicks += 1;	
		}
		else {
			$('#navbar_ideapanel').slideUp('slow');
			clicks += 1;
		}
		// console.log("You clicked it");
		// $.get('/yourIdeas', function(data){
		// 	console.log(data);
		// 	$('#navbar_ideapanel').html(data);
		// 	$('#navbar_ideapanel').slideDown('slow');
		// });
		// $('#navbar_ideapanel').slideDown('slow');
	})
	// $(document).on('click','#navbar_yourideas_close',function(event){
	// 	event.stopImmediatePropagation();
	// 	console.log("Closing your ideas");
	// 	$('#navbar_ideapanel').slideUp('slow');
	// })
	$(document).on('click','#like',function(){
		var ideaName = $(this).attr('val');
		var el = $(this).parent();
		$.post('/updateIdea',{liked:true,ideaName:ideaName},function(data){
			var likeEl = $(el.children()[1]);
			var dislikeEl = $(el.children()[3]);
			var likeNum = parseInt(likeEl.text());
			likeNum += data.likeIncr;
			likeEl.text(likeNum);
			var dislikeNum = parseInt(dislikeEl.text());
			dislikeNum += data.dislikeIncr;
			dislikeEl.text(dislikeNum);
		});
	});
	$(document).on('click','#dislike',function(){
		var ideaName = $(this).attr('val');
		var el = $(this).parent();
		$.post('/updateIdea',{liked:false,ideaName:ideaName},function(data){
			var likeEl = $(el.children()[1]);
			var dislikeEl = $(el.children()[3]);
			var likeNum = parseInt(likeEl.text());
			likeNum += data.likeIncr;
			likeEl.text(likeNum);
			var dislikeNum = parseInt(dislikeEl.text());
			dislikeNum += data.dislikeIncr;
			dislikeEl.text(dislikeNum);
		});
	});


  $(function() {
    function changeSlide( newSlide ) {
        //cancel any timeouts
        clearTimeout(slideTimeout);

        // change the currSlide value
        currSlide = newSlide;
        
        // make sure the currSlide value is not too low or high
        if ( currSlide > maxSlide ) currSlide = 0;
        else if ( currSlide < 0 ) currSlide = maxSlide;
       
    
        // animate the slide reel
        $slideReel.animate({
            left : currSlide * -225
        }, 800, 'swing', function() {
            //hide / show arrows depending on the frame it's on.
            if ( currSlide == 0 ) $slidePrevNav.hide();
            else $slidePrevNav.show();
            
            if ( currSlide == maxSlide ) $slideNextNav.hide();
            else $slideNextNav.show();
            
            // set new timeout if active
            if ( activeSlideshow ) slideTimeout = setTimeout(nextSlide, 1200);
        });
    }
    
    function nextSlide() {
        changeSlide( currSlide + 1 );
    }
    // define some variables / DOM references
    var activeSlideshow = true,
    currSlide = 0,
    slideTimeout,
    $slideshow = $('#slideshow'),
    $slideReel = $slideshow.find('#slideshow-reel'),
    maxSlide = $slideReel.children().length - 1;
    $slidePrevNav=$slideshow.find('#slideshow-prev'),
    $slideNextNav=$slideshow.find('#slideshow-next'); 
    

    // set navigation click events
    
    // left arrow
    $slidePrevNav.click(function(ev) {
        ev.preventDefault();
        activeSlideshow = false;
        changeSlide( currSlide - 1 );
    });
    // right arrow
    $slideNextNav.click(function(ev) {
        ev.preventDefault();
        activeSlideshow = false;
        changeSlide( currSlide + 1 );
    });
    // start the animation
    slideTimeout = setTimeout(nextSlide, 1200);
  });

});
	$(document).on('click','div.tag',function(){
		var query = $(this).text();
		var form = $('<form action="/search" style="display:none;" method="post">'+'<input type="text" name="query" value="' + query + '" />'+'</form>');
		$('body').append(form);
		$(form).submit();
	});
	$(document).on('click','#commentButton',function(){
		var text = $('p.contentEditable').text();
		if (text != 'Write a comment here...'){
			var anonymous = $('#checkbox').is(':checked');
			var ideaName = $('p.title').text();
			$.post('/saveComment',{text:text,anonymous:anonymous,ideaName:ideaName},function(data){
				console.log(data);
				location.reload();
			});			
		}
		else{
			alert("You haven't written anything");
		}
	});
	$(window).resize(function(){
		adjustCSS();
	});
	// $('.ideaPoolWrap').
	// $('#navbar_yourideas_close').click(function(){
	// 	console.log("Closing your ideas");
	// 	$('#navbar_ideapanel').hide();
	// })
});

function adjustCSS(){
	// var width = $(document).width();
	// var IPWidth = $('.ideaPoolWrap').width();
	// $('.ideaPoolWrap').css('margin-left',(width-IPWidth)/2);
	// $('.ideaPoolWrap').css('margin-right',(width-IPWidth)/2);
	// console.log(width);
}