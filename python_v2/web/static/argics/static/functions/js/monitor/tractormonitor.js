(function($){
	$(function(){
 		$(window).resize(function(){
 			var windowHeight = $(window).height();
 			var windowWidth = $(window).width();
 			var toolbarHeight = $('.navigate').outerHeight();
 			var topHeight=$('.top').outerHeight();
 			var runInfoHeight=$('#runInfo').outerHeight();
			var dataAreaHeight = windowHeight-toolbarHeight-topHeight-runInfoHeight;
			$('#LdataArea').height(dataAreaHeight);
			$('#LgridContainer').height(dataAreaHeight-$('#Lpagination').outerHeight());
		}).trigger('resize');
	});	
})(jQuery);