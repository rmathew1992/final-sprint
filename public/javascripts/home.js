$(function(){
  $(document).ready(function() {
    console.log("ready");
    $("#needinspire").click(function(event){
      console.log('inspiration');
      res.redirect('/');
  	});
})