$(function(){
	$(document).on('keydown','#searchbar',function(event){
		event.stopImmediatePropagation();
		if (event.keyCode==13){
			$('#searchForm').submit();
		}
	});
});