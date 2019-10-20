/**
 * @module splitbar
 */
function SplitBarEnvironment(){
	var $dragOverlay = $('<div class="splitbar-drag-overlay" style="z-index:20000;"></div>');
	var $hSplitLine  = $('<div class="splitbar-h-split-line" style="z-index:20001;"></div>');
	var $vSplitLine  = $('<div class="splitbar-v-split-line" style="z-index:20001;"></div>');

	return {
		/**
		 * 设置横向分割栏。
		 * @param {String} selector 基于jquery选择器的表达式。
		 */
		HSplit: function(selector) {
			$(selector).parent().append($hSplitLine);
			$(selector).addClass('widget-horizontal_split_bar');
			$hSplitLine.width($(selector).outerWidth());
			var mouseInteraction = new $.ui.mouseInteraction($(selector), {
				nonDestructive: true,
				_start: function(helper, pos, cursorAt, mouseObject, e){
					mouseInteraction.posX = e.clientX;
					mouseInteraction.prevWidth = $(helper).prev().width();
					$hSplitLine
						.css('left', e.clientX - $(helper).parent().offset().left)
						.height($(helper).height())
						.show();
					$('body').append($dragOverlay);
					$dragOverlay.height($(helper).height()).show();
				},
				_drag: function(helper, pos, cursorAt, mouseObject, e){
					//var offset = e.clientX - mouseInteraction.posX;
					//var newPrevWidth = mouseInteraction.prevWidth + offset;
					//if(newPrevWidth < parseInt($(helper).prev().css('min-width'))) return;
					var parentWidth = $(helper).parent().width();
					var clx=e.clientX;
					if(clx<=3){clx=3;return false;}
					if(clx>=parentWidth-1){eclix=parentWidth-1;return false;}
					$hSplitLine.css('left', clx - $(helper).parent().offset().left);
				},
				_beforeStop: function(helper, pos, cursorAt, mouseObject, e){
					var parentWidth = $(helper).parent().width();
					var splitWidth = $(helper).outerWidth();
					var maxwidth=parentWidth-splitWidth;
					var minwidth=$(helper).prev().css('min-width');	
					var eclix=e.clientX;
					if(eclix<=0)eclix=0;
					if(eclix>=parentWidth-1)eclix=parentWidth-1;
					var offset = eclix - mouseInteraction.posX;
					var newPrevWidth = mouseInteraction.prevWidth;
					if($(helper).css('float') == 'left')
						newPrevWidth += offset;
					else newPrevWidth -= offset;
					if(minwidth=='auto'||minwidth==undefined)minwidth=0;
					else minwidth = parseInt(minwidth);
					if(newPrevWidth < minwidth) newPrevWidth = minwidth;
					if(newPrevWidth>maxwidth)newPrevWidth=maxwidth;					
					$(helper).prev().width(newPrevWidth);
					$(helper).next().width(maxwidth-splitWidth);
				},
				_stop: function(helper, pos, cursorAt, mouseObject, e){
					$hSplitLine.hide();
					$dragOverlay.remove();
					
					mouseInteraction.posX = null;
					mouseInteraction.prevWidth = null;
					
					$(window).trigger('resize');
				}
			});
		},
		/**
		 * 设置纵向分割栏。
		 * @param {String} selector 基于jquery选择器的表达式。
		 */
		VSplit: function(selector) {//TODO:not implement yet!
		}
	};
};

SplitBar = new SplitBarEnvironment();
