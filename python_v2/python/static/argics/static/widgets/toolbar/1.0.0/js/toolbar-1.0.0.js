/**
 * @module toolbar
 */
function ToolbarEnvironment(){
	/* My mind:
	 * <div class='widget-toolbar'>  --tool bar
	 *   <div class='items-pane'>    --the pane to show items
	 *     <div class=items-wrapper> --for scroll
	 *       <div class='item'>      --real tab item
	 *       </div>
	 *       <div class='item'>      --real tab item
	 *       </div>
	 *     </div>
	 *   </div>
	 *   <div class='navi-pane'>     --the pane to show navi functions button
	 *     <div class='prev'>        --prev function button
	 *     </div>
	 *     <div class='next'>        --next function button
	 *     </div>
	 *   </div>
	 * </div>
	 */
	var animating = false;
	var $originalItems;
	var $toolbar;
	var $itemsPane;
	var $naviPane;
	var $itemsWrapper;
	
	function changeNaviState() {
		if(startItemShown())
			$naviPane.find('.prev').removeClass('prev').addClass('prev-disabled');
		else
			$naviPane.find('.prev-disabled').removeClass('prev-disabled').addClass('prev');
		
		if(endItemShown())
			$naviPane.find('.next').removeClass('next').addClass('next-disabled');
		else
			$naviPane.find('.next-disabled').removeClass('next-disabled').addClass('next');
	};
	function startItemShown() {
		return getVisibleStartItemIndex() == 0;
	};
	function endItemShown() {
		return getItemsPaneWidth() - $itemsWrapper.position().left >= getTotalItemsWidth();
	};
	function getTabbarWidth() {
		return $toolbar.width();
	};
	function getNaviPaneWidth() {
		return $naviPane.outerWidth();
	}
	function getItemsPaneWidth() {
		if(canShowAllItems()) return getTabbarWidth();
		else return getTabbarWidth() - getNaviPaneWidth();
	};
	function getTotalItemsWidth(){
		var totalItemsWidth = 0;
		for(var i = 0; i < $originalItems.length; i++) {
			totalItemsWidth += getItemWidthByIndex(i);
		}
		return totalItemsWidth;
	};
	function getItemWidthByIndex(index) {
		var $this = $($originalItems[index]);
		return $this.outerWidth() + parseInt($this.css('margin-left').replace('.px','')) + parseInt($this.css('margin-right').replace('.px',''));
	};
	function canShowAllItems() {
		return getTotalItemsWidth() <= getTabbarWidth();
	};
	function getVisibleStartItemIndex() {
		if($itemsWrapper.position().left == 0) return 0;
		else {
			var sumWidth = 0;
			var idx = 0
			for(; idx < $originalItems.length; idx++){
				sumWidth += getItemWidthByIndex(idx);
				if(sumWidth >= (0 - $itemsWrapper.position().left))
					break;
			};
			return idx +1;
		}
	};
	function getPrevCanMoveLength() {
		var idx = getVisibleStartItemIndex() -1;
		if(getItemWidthByIndex(idx) >= getItemsPaneWidth())
			return getItemWidthByIndex(idx);
		else {
			var sumWidth = 0;
			for(; idx > -1; idx--) {
				if (sumWidth + getItemWidthByIndex(idx) >= getItemsPaneWidth()) break;
				else sumWidth += getItemWidthByIndex(idx);
			}
			return sumWidth;
		}
	};
	function getNextCanMoveLength() {
		var idx = getVisibleStartItemIndex();
		if(getItemWidthByIndex(idx) >= getItemsPaneWidth())
			return getItemWidthByIndex(idx);
		else {
			var sumWidth = 0;
			for(; idx < $originalItems.length; idx++) {
				if (sumWidth + getItemWidthByIndex(idx) >= getItemsPaneWidth()) break;
				else sumWidth += getItemWidthByIndex(idx);
			}
			return sumWidth;
		}
	};
	
	function _redraw() {
		$itemsPane.width(getItemsPaneWidth());
		if(canShowAllItems()) {
			$naviPane.hide();
			if(animating) return;
			$itemsWrapper.animate({left : "+=" + (0 - $itemsWrapper.position().left) +"px"},400,function(){
				animating = false;
			});
		}
		else {
			$naviPane.show();
			changeNaviState();
		}
	}
	
	var resizeDelayer = function() {
		return {
			redraw: function(preWidth) {
				if($toolbar.width() == preWidth) {
					_redraw();
				}
			}
		};
	}();

	return {
		/**
		 * 初始化工具栏。
		 * @param {String} selector 基于jquery选择器的表达式。
		 * @param {Function} action 点击工具按钮时回调方法。此回调函数有两个参数：id、index。
		 */
		init: function(selector,action) {
			$toolbar = $(selector).addClass('widget-toolbar');
			$originalItems = $toolbar.children().addClass('item');
			$itemsWrapper = $('<div class="items-wrapper"></div>');
			$itemsWrapper.append($originalItems);
			$itemsPane = $('<div class="items-pane"></div>');
			$itemsPane.append($itemsWrapper);
			$toolbar.append($itemsPane);
			$naviPane = $('<div class="navi-pane"><div class="prev"></div><div class="next"></div></div>');
			$toolbar.append($naviPane);
			
			/* navi internal call */
			$naviPane.children().click(function(){
				if(animating) return;
				
				if($(this).hasClass('prev')) {
					if(startItemShown()) return;
					else {
						animating = true;
						$itemsWrapper.animate({left : "+=" + getPrevCanMoveLength() +"px"},400,function(){
							animating = false;
							changeNaviState();
						});
					}
				}
				else if($(this).hasClass('next')) {
					if(endItemShown()) return;
					else {
						animating = true;
						$itemsWrapper.animate({left : "-=" + getNextCanMoveLength() +"px"},400,function(){
							animating = false;
							changeNaviState();
						});
					}
				}
			});
			
			$(window).resize(function(){
				var preWidth = $toolbar.width();
				window.setTimeout(function(){
					resizeDelayer.redraw(preWidth);
				},200);
			});
		}
	};
};

Toolbar = new ToolbarEnvironment();
