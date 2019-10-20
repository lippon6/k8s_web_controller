(function($){
	$(function(){
 		$(window).resize(function(){
 		    var windowHeight = $(window).height();
 			var windowWidth = $(window).width();
 			var toolbarHeight = $('#Ltoolbar').outerHeight();
			var dataAreaHeight = windowHeight-toolbarHeight;
			var hSplitBarWidth = $('#LhSplitBar').outerWidth();
 			var leftPaneWidth = $('#LleftPanel').outerWidth();
 			var maxWidth=windowWidth-hSplitBarWidth;
			if(leftPaneWidth>=maxWidth)leftPaneWidth=maxWidth;
			$('#LleftPanel').width(leftPaneWidth);
			$('#LdataArea,#LrightPanel,#LhSplitBar,#LleftPanel').height(dataAreaHeight);
			$('#LrightPanel,#LrightPanel').width(windowWidth-leftPaneWidth-hSplitBarWidth);
		}).trigger('resize');
	});	
})(jQuery);	