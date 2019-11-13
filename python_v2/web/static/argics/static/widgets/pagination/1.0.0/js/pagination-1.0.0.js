/**
 * @module pagination
 */
function PaginationEnvironment(){
	var settings = {//default
		infoFormat: '第 {cp}/{tp} 页，共 {tr} 条记录，本页 {cr} 条',
		currentPageField: 'cp',
		totalPageField: 'tp',
		numPrefix: '转到第',
		numSuffix: '页',
		callback: null
	};
	
	var $selector;
	var $firstPage = $('<span class="first-page"></span>');
	var $prevPage  = $('<span class="prev-page"></span>');
	var $infoArea  = $('<span class="info-area"></span>');
	var $nextPage  = $('<span class="next-page"></span>');
	var $lastPage  = $('<span class="last-page"></span>');
	var $gotoNum   = $('<span class="go-to-page-num"><input type="text"/></span>');
	var $gotoPage  = $('<span class="go-to-page"></span>');
	
	var currentPageNum = 1;
	var totalPageCount = 1;
	
	var initElements = function(){
		$('<span>' + settings.numPrefix + '</span>').insertBefore($gotoNum.find('input'));
		$('<span>' + settings.numSuffix + '</span>').insertAfter($gotoNum.find('input'));
		$selector
			.append($firstPage)
			.append($prevPage)
			.append($infoArea)
			.append($nextPage)
			.append($lastPage)
			.append($gotoNum)
			.append($gotoPage);
		
		$firstPage.click(function(){
			if(!$(this).hasClass('first-page-disabled'))
				settings.callback(1);
		});
		$prevPage.click(function(){
			if(!$(this).hasClass('prev-page-disabled'))
				settings.callback(currentPageNum -1);
		});
		$nextPage.click(function(){
			if(!$(this).hasClass('next-page-disabled'))
				settings.callback(currentPageNum +1);
		});
		$lastPage.click(function(){
			if(!$(this).hasClass('last-page-disabled'))
				settings.callback(totalPageCount);
		});
		$gotoPage.click(function(){
			if(! /^[0-9]*[1-9][0-9]*$/.test($gotoNum.find('input').val())) {
				$gotoNum.find('input').val(1);
			}
			var newPageNum = parseInt($gotoNum.find('input').val());
			if(newPageNum < 1) newPageNum = 1;
			else if(newPageNum > totalPageCount) newPageNum = totalPageCount;
			settings.callback(newPageNum);
		});
	};
	
	var updateUI = function(value) {
		currentPageNum = value[settings.currentPageField];
		totalPageCount = value[settings.totalPageField];
		
		$gotoNum.find('input').val(currentPageNum);
		var info = settings.infoFormat;
		for(var i in value) {
			info = info.replace('{'+i+'}',value[i]);
		}
		$infoArea.text(info);
		
		/* set status enabled all*/
		$firstPage.removeClass('first-page-disabled');
		$prevPage.removeClass('prev-page-disabled');
		$nextPage.removeClass('next-page-disabled');
		$lastPage.removeClass('last-page-disabled');

		/* reset status */
		if(currentPageNum == 1) {
			$firstPage.addClass('first-page-disabled');
			$prevPage.addClass('prev-page-disabled');
		}
		if(currentPageNum == totalPageCount) {
			$nextPage.addClass('next-page-disabled');
			$lastPage.addClass('last-page-disabled');
		}
	};

	return {
		/**
		 * 初始化分页栏。
		 * @param {String} selector 基于jquery选择器的表达式。
		 * @param {Object} option 自定义设置，可选。
		 * @param {Object} value 初始化值，可选。 
		 */
		init: function(selector, options, value) {
			$selector = $(selector);
			$selector.addClass('pagination');
			$.extend(settings, options);
			initElements();
			if(value) updateUI(value);
		},
		/**
		 * 初始化后，调用此方法，更新数据。
		 * @param {Array} data 填充的数据。
		 */
		update: function(value) {
			if(value) updateUI(value);
		}
	};
};

Pagination = new PaginationEnvironment();