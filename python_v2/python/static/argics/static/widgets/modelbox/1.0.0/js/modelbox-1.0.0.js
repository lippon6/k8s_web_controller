/**
 * @module model box
 */
function ModelboxChainEnvironment() {
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
		
		var boxType = 'message';
		
		var $overlay, $box, $titleBar,
			$messagePane, $signal, $messageWrapper, $message, 
			$detailPane, $detail, $btnSwitchDetail,
			$operatePane, $btnOk, $btnCancel;
		
		function layout() {
			//size:width
			$box.width(setting.width);
			$titleBar.width($box.width() - $titleBar.widthEx());
			$messagePane.width($box.width() - $messagePane.widthEx());
			//$detailPane.width($box.width() - $detailPane.widthEx());
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
			$overlay        = $('<div class="widget-messagebox-overlay"></div>').appendTo($(window.document.body));
			
			$box            = $('<div class="widget-messagebox"></div>').appendTo($(window.document.body));
			$titleBar       = $('<div class="titlebar"><span class="title"></span></div>').appendTo($box);
			$messagePane    = $('<div class="message-pane"><div class="signal"></div><div class="message-wrapper"><div class="message"></div></div></div>').appendTo($box);
			//$detailPane     = $('<div class="detail-pane">详细信息：<textarea readonly style="width:100%;height:100%;"></textarea></div>').appendTo($box);
			$operatePane    = $('<div class="operate-pane"></div>').appendTo($box);
			
			$titleBar.find('.title').text(setting.title);
			$signal         = $messagePane.find('.signal');
			$messageWrapper = $messagePane.find('.message-wrapper');
			$message        = $messageWrapper.find('.message').text(setting.message);
			//$detail         = $detailPane.find('textarea').height(setting.detailBoxHeight).text(setting.detail);
			$btnSwitchDetail = $('<span class="switch-detail"></span>').appendTo($operatePane);
			if (boxType == 'confirm') {
				$signal.addClass('signal-confirm');
				$btnCancel = $('<button class="cancel">取消</button>').appendTo($operatePane);
				$btnOk     = $('<button class="ok">确定</button>').appendTo($operatePane);
			}
			else {
				$signal.addClass('signal-message');
				$btnOk     = $('<button class="ok">确定</button>').appendTo($operatePane);
			}
			
			if(setting.detail == '') $btnSwitchDetail.hide();
			//layout
			layout();
			
			//bind events
			$btnSwitchDetail.click(function(){
				/*
				if($detailPane.is(':visible')) {
					$detailPane.hide();
					$btnSwitchDetail.text('>>详细信息');
				}
				else {
					$detailPane.show();
					$btnSwitchDetail.text('<<详细信息');
				}*/
				layout();
			}).trigger('click');
	
			if(boxType == 'confirm') {
				$btnOk.click(function(){
					if(setting.callback) setting.callback(true);
					chain.pop();
					destroyBox();
				});
				$btnCancel.click(function(){
					if(setting.callback) setting.callback(false);
					chain.pop();
					destroyBox();
				});
			}
			else {
				$btnOk.click(function(){
					if(setting.callback) setting.callback();
					chain.pop();
					destroyBox();
				});
			}
			
			//enable drag
			enableDrag();
		};
		function destroyBox() {
			$overlay.remove();
			$box.remove();
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
				
				boxType = 'message';
				createBox();
			},
			/**
			 * 弹出模态确认框
			 * @param {String} message 消息内容。
			 * @param {String} title 消息标题，可选。
			 * @param {Function} callback 确认回调方法，可选。此方法有一个参数：answer(true/false->确认/取消)。
			 * @param {String} detail 详细内容，可选
			 * @param {Integer} width 消息框宽度，可选。
			 * @param {Integer} height 消息框高度，可选。（含标题栏、消息框、功能栏的高度，不包含详细内容框的高度）
			 * @param {Integer} detailBoxHeight 详细内容框的高度，可选。
			 */
			confirm: function(message, title, callback, detail, width, height, detailBoxHeight) {
				if(message)         setting.message = message;
				if(title)           setting.title = title;
				if(callback)        setting.callback = callback;
				if(detail)          setting.detail = detail;
				if(width)           setting.width = width;
				if(height)          setting.height = height;
				if(detailBoxHeight) setting.detailBoxHeight = detailBoxHeight;
				
				boxType = 'confirm';
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
		},
		/**
		 * 弹出模态确认框
		 */
		confirm: function(message, title, callback, detail, width, height, detailBoxHeight) {
			var modelbox = new Modelbox();
			chain.push(modelbox);
			modelbox.confirm(message, title, callback, detail, width, height, detailBoxHeight);
		}
	};
}

ModelboxChain = new ModelboxChainEnvironment();

function getModelboxChain() {
	return ModelboxChain;
}
