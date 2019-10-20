/**
 * @module model box
 */
function MessageBox() {
	/* private Model box class. */
	function Modelbox() {
		var setting = {
				message : '',
				title : '消息框',
				callback : null,
				detail: '',
				width : 300,
				height : 120,
				detailBoxHeight: 150
			};
		
		var $box, $titleBar,
			$messagePane, $signal, $messageWrapper, $message, 
			$detailPane, $detail, $operatePane;
		
		function layout() {
			//size:width
			$box.width(setting.width);
			$titleBar.width($box.width() - $titleBar.widthEx());
			$messagePane.width($box.width() - $messagePane.widthEx());
			$detailPane.width($box.width() - $detailPane.widthEx());
			$operatePane.width($box.width() - $operatePane.widthEx());
			$messageWrapper.width($messagePane.width() - $signal.outerWidth(true) - $messageWrapper.widthEx());
			//size:height
			var messagePaneHeight = setting.height - $titleBar.outerHeight(true) - $operatePane.outerHeight(true);
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
			$box            = $('<div class="widget-messagebox"></div>').appendTo($(window.document.body));
			$titleBar       = $('<div class="titlebar"><span class="title"></span></div>').appendTo($box);
			$messagePane    = $('<div class="message-pane"><div class="signal"></div><div class="message-wrapper"><div class="message"></div></div></div>').appendTo($box);
			$detailPane     = $('<div class="detail-pane">详细信息：<textarea readonly style="width:100%;height:100%;"></textarea></div>').appendTo($box);
			$operatePane    = $('<div class="operate-pane"></div>').appendTo($box);
			
			$titleBar.find('.title').text(setting.title);
			$signal         = $messagePane.find('.signal');
			$messageWrapper = $messagePane.find('.message-wrapper');
			$message        = $messageWrapper.find('.message').text(setting.message);
			$detail         = $detailPane.find('textarea').height(setting.detailBoxHeight).text(setting.detail);
			$signal.addClass('signal-message');

			//layout
			layout();
			var hidebox =  function(){
				$box.fadeOut();
			}
		
			setTimeout(hidebox, 500); 
		};
		function destroyBox() {
			$box.remove();
		};
	
		return {
			/**
			 * 弹出模态消息框
			 * @param {String} message 消息内容。
			 * @param {String} title 消息标题，可选
			 * @param {String} detail 详细内容，可选
			 * @param {Integer} width 消息框宽度，可选。
			 * @param {Integer} height 消息框高度，可选。（含标题栏、消息框、功能栏的高度，不包含详细内容框的高度）
			 * @param {Integer} detailBoxHeight 详细内容框的高度，可选。
			 */
			message: function(message, title, callback, detail, width, height, detailBoxHeight) {
				if(message)         setting.message = message;
				if(title)           setting.title = title;
				if(callback)        setting.callback = callback;
				if(detail)          setting.detail = detail;
				if(width)           setting.width = width;
				if(height)          setting.height = height;
				if(detailBoxHeight) setting.detailBoxHeight = detailBoxHeight;
				createBox();
			}
		};
	}
	
	/* private members */
	var chain = new Array();
	
	return {
		/**
		 * 弹出模态消息框
		 */
		message: function(message, title, callback, detail, width, height, detailBoxHeight) {
			var modelbox = new Modelbox();
			chain.push(modelbox);
			modelbox.message(message, title, callback, detail, width, height, detailBoxHeight);
		}
	};
}

messageBox = new MessageBox();

function getMessaegBox() {
	return messageBox;
}
