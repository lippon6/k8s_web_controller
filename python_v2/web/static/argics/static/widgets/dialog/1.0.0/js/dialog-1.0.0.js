/**
 * @module dialog
 */
function DialogChainEnvironment() {
	/* private dialog class. */
	function Dialog(url, options, owner){
		var settings = {
				title: '对话框',
				width: 500,
				height: 300
		};
		
		var $overlay, $dialog, $titlebar, $iframe, $maxbtn;
		var resize = function(){//to recount position & size
			$titlebar.find('.title').text(settings.title);
			if($maxbtn.hasClass('maximize')) {
				var top = ($(window).height() - settings.height) / 2;
				var left = ($(window).width() - settings.width) / 2;
				$dialog.css('top',top).css('left',left).width(settings.width).height(settings.height);
			}
			else {
				$dialog.css('top',-5).css('left',-5).width($(window).width()).height($(window).height());//TODO: -5 is border width, should passing the calculation.
			}

			$iframe.height($dialog.height() - $titlebar.outerHeight());
		};
		
		function createDialog(url) {
			var zIndex = 10000 + chain.length;
			$overlay  = $('<div class="widget-dialog-overlay"></div>').css('z-index',zIndex).appendTo($(window.document.body));
			$dialog   = $('<div class="widget-dialog"></div>').css('z-index',zIndex).appendTo($(window.document.body));
			$titlebar = $('<div class="titlebar"><span class="title"></span><span class="buttons-area"><button class="maximize"></button><button class="close"></button></span></div>').appendTo($dialog);
			$iframe   = $('<iframe frameborder="0" allowTransparency="true" scrolling="no" style="width:100%;"></iframe>').attr('src', url).appendTo($dialog);
			
			$maxbtn = $titlebar.find('.maximize');
			$maxbtn.click(function(){
				if($(this).hasClass('maximize')) {
					$(this).removeClass('maximize').addClass('restore');
				}
				else {
					$(this).removeClass('restore').addClass('maximize');
				}
				$(window).trigger('resize');
			});
			
			//bind events
			$(window).bind('resize', resize).trigger('resize');
			$titlebar.find('.close').click(function(){
				chain.pop();
				destroyDialog();
			});
		};
		function destroyDialog() {
			//unbind events
			$(window).unbind('resize', resize);
			
			//fixed IE8- memory leaks -->
			if(isIE8) {
				$iframe[0].src = 'about:blank';
				$iframe[0].src = "javascript:void((function(){document.open();document.write('');document.close()})())";
				$iframe.remove();
				window.CollectGarbage();
			}
			//fixed IE8- memory leaks <--

			$overlay.remove();
			$dialog.remove();
		};
		
		function enableDrag() {
			var $dragOverlay = $('<div class="widget-dialog-drag-overlay" style="z-index:20000;"></div>');
			var $dragBox  = $('<div class="widget-dialog-drag-box" style="z-index:20001;"></div>');
			var MI = new $.ui.mouseInteraction($titlebar, {
				nonDestructive: true,
				_start: function(helper, pos, cursorAt, mouseObject, e){
					MI.posX = e.clientX;
					MI.posY = e.clientY;
					MI.boxLeft = parseInt($dialog.css('left').replace('.px',''));
					MI.boxTop = parseInt($dialog.css('top').replace('.px',''));
					
					$dragBox
						.css('left', $dialog.css('left'))
						.css('top', $dialog.css('top'))
						.width($dialog.outerWidth())
						.height($dialog.outerHeight())
						.appendTo($(window.document.body))
						.show();
					$dragOverlay
						.appendTo($(window.document.body))
						.show();
				},
				_drag: function(helper, pos, cursorAt, mouseObject, e){
					var offsetX = e.clientX - MI.posX;
					var offsetY = e.clientY - MI.posY;

					if(MI.boxTop + offsetY > $(window).height() - $titlebar.outerHeight()) return;
					if(MI.boxTop + offsetY < 0) return;
					
					MI.boxLeft = MI.boxLeft + offsetX;
					MI.boxTop = MI.boxTop + offsetY;
					MI.posX = e.clientX;
					MI.posY = e.clientY;
					
					$dragBox.css('left', MI.boxLeft);
					$dragBox.css('top', MI.boxTop);
				},
				_beforeStop: function(helper, pos, cursorAt, mouseObject, e){
					$dialog.css('left',MI.boxLeft);
					$dialog.css('top',MI.boxTop);
				},
				_stop: function(helper, pos, cursorAt, mouseObject, e){
					$dragBox.remove();
					$dragOverlay.remove();
					
					MI.posX = null;
					MI.posY = null;
					MI.boxLeft = null;
					MI.boxTop = null;
				}
			});
		};

		return {
			show: function() {
				$.extend(settings,options);
				createDialog(url);
				enableDrag();
			},
			close: function() {
				destroyDialog();
			},
			owner: function() {
				return owner;
			}
		};
	};
	
	/* private members */
	var chain = new Array();
	
	return {
		/**
		 * 添加一个对话窗口到对话窗口链，并将其显示在最上层。
		 * @param {String} url 对话框中的页面地址
		 * @param {Object} options 选项，可选。默认为：{title: '对话框',width: 500,height: 300}
		 * @param {Object} owner 调用页面的window对象，在对话窗口中调用回掉方法时很有用。
		 */
		push: function(url, options, owner) {
			var dialog = new Dialog(url, options, owner);
			chain.push(dialog);
			dialog.show();
		},
		/**
		 * 关闭对话窗口链中最上层的窗口，并从对话窗口链中移除该对话框。
		 */
		pop: function() {
			var dialog = chain.pop();
			dialog.close();
		},
		/**
		 * 返回对话窗口链中最上层窗口持有者的window对象。
		 */
		owner: function() {
			return chain[chain.length-1].owner();
		}
	};
}

DialogChain = new DialogChainEnvironment();

function getDialogChain() {
	return DialogChain;
}
