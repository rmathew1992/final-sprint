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
	$(document).on('click','#like',function(){
		var ideaName = $(this).attr('val');
		$.post('/updateIdea',{liked:true,ideaName:ideaName},function(data){
			console.log(data);
		});
	});
	$(document).on('click','#dislike',function(){
		var ideaName = $(this).attr('val');
		$.post('/updateIdea',{liked:false,ideaName:ideaName},function(data){
			console.log(data);
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
});