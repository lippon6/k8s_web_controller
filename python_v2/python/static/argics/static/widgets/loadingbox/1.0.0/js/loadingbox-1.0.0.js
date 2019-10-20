/**
 * @module loading box
 */
function LoadingboxChainEnvironment() {
	/* private Loading box class. */
	function Loadingbox() {
		var setting = {
				message : '',
				title : '消息框',
				width : 300,
				height : 120
			};
		
		var $overlay, $box, $titleBar,
			$messagePane, $signal, $messageWrapper, $message, $operatePane;
		
		function layout() {
			//size:width
			$box.width(setting.width);
			$titleBar.width($box.width() - $titleBar.widthEx());
			$messagePane.width($box.width() - $messagePane.widthEx());
			$messageWrapper.width($messagePane.width() - $signal.outerWidth(true) - $messageWrapper.widthEx());
			//size:height
			var messagePaneHeight = setting.height - $titleBar.outerHeight(true);
			$messagePane.height(messagePaneHeight);
			$signal.height(messagePaneHeight - $signal.heightEx());
			$messageWrapper.height(messagePaneHeight - $messageWrapper.heightEx());
			$message.height($messageWrapper.height() - $message.heightEx());
			//position
			var top = ($(window).height() - $box.outerHeight(true)) / 2.5;
			var left = ($(window).width() - $box.outerWidth(true)) / 2;
			$box.css('top',top).css('left',left);
		};
		
		function createBox() {
			//create elements
			$overlay        = $('<div class="widget-messagebox-overlay"></div>').appendTo($(window.document.body));
			
			$box            = $('<div class="widget-messagebox"></div>').appendTo($(window.document.body));
			$titleBar       = $('<div class="titlebar"><span class="title"></span></div>').appendTo($box);
			$messagePane    = $('<div class="message-pane"><div class="signal"></div><div class="message-wrapper"><div class="message"></div></div></div>').appendTo($box);
			
			$titleBar.find('.title').text(setting.title);
			$signal         = $messagePane.find('.signal');
			$messageWrapper = $messagePane.find('.message-wrapper');
			$message        = $messageWrapper.find('.message').text(setting.message);
			$signal.addClass('signal-loading');
			$('.widget-messagebox-overlay').attr('id','loading1');
			$('.widget-messagebox').attr('id','loading2');
			//layout
			layout();
			
			//enable drag
			enableDrag();
		};
		function destroyBox() {
			$('#loading1').remove();
			$('#loading2').remove();
		};
		
		function enableDrag() {
			var $dragOverlay = $('<div class="widget-messagebox-drag-overlay" style="z-index:20000;"></div>');
			var $dragBox  = $('<div class="widget-messagebox-drag-box" style="z-index:20000;"></div>');
			var MI = new $.ui.mouseInteraction($titleBar, {
				nonDestructive: true,
				_start: function(helper, pos, cursorAt, mouseObject, e){
					MI.posX = e.clientX;
					MI.posY = e.clientY;
					MI.boxLeft = parseInt($box.css('left').replace('.px',''));
					MI.boxTop = parseInt($box.css('top').replace('.px',''));
					
					$dragOverlay
						.appendTo($(window.document.body))
						.show();
					$dragBox
						.css('left', $box.css('left'))
						.css('top', $box.css('top'))
						.width($box.outerWidth())
						.height($box.outerHeight())
						.appendTo($(window.document.body))
						.show();
				},
				_drag: function(helper, pos, cursorAt, mouseObject, e){
					var offsetX = e.clientX - MI.posX;
					var offsetY = e.clientY - MI.posY;
	
					if(MI.boxTop + offsetY > $(window).height() - $titleBar.outerHeight()) return;
					if(MI.boxTop + offsetY < 0) return;
					
					MI.boxLeft = MI.boxLeft + offsetX;
					MI.boxTop = MI.boxTop + offsetY;
					MI.posX = e.clientX;
					MI.posY = e.clientY;
					
					$dragBox.css('left', MI.boxLeft);
					$dragBox.css('top', MI.boxTop);
				},
				_beforeStop: function(helper, pos, cursorAt, mouseObject, e){
					$box.css('left',MI.boxLeft);
					$box.css('top',MI.boxTop);
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
			/**
			 * 弹出模态等待框
			 * @param {String} message 消息内容。
			 * @param {String} title 消息标题，可选。
			 * @param {Integer} width 消息框宽度，可选。
			 * @param {Integer} height 消息框高度，可选。（含标题栏、消息框、功能栏的高度，不包含详细内容框的高度）
			 */
			loading: function(message, title, width, height) {
				if(message)         setting.message = message;
				if(title)           setting.title = title;
				if(width)           setting.width = width;
				if(height)          setting.height = height;
				createBox();
			},
			/**
			 * 关闭模态等待框
			 */
			close: function() {
				chain.pop();
				destroyBox();
			}
		};
	}
	
	/* private members */
	var chain = new Array();
	
	return {
		/**
		 * 弹出模态等待框
		 */
		loading: function(message, title, width, height) {
			var loadingbox = new Loadingbox();
			chain.push(loadingbox);
			loadingbox.loading(message, title, width, height);
		},
		/**
		 * 关闭模态等待框
		 */
		close: function() {
			var loadingbox = new Loadingbox();
			loadingbox.close();
		}
	};
}

LoadingboxChain = new LoadingboxChainEnvironment();

function getLoadingboxChain() {
	return LoadingboxChain;
}
