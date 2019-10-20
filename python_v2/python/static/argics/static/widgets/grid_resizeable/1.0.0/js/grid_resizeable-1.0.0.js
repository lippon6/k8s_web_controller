/**
 * @module grid_resizeable
 */
function GridResizeableEnvironment(){

	//private GridRow class ...
	function GridRow(data, $trs) {
		
		function _fillRow(effectColIdxs) {
			$trs.each(function(){
				var $this = $(this);
				var idExp = $this.attr('id');
				if(idExp) {
					var text = idExp.replace(reg, function(s,i) {
						var field = s.substring(1,s.length - 1);
						return data[field];
					});
					$this.attr('id',text);
				}
				$this.find('td').each(function(colIndex){
					if(!effectColIdxs ||
							($.isArray(effectColIdxs) && $.inArray(colIndex,effectColIdxs) > -1) ||
							(colIndex == effectColIdxs)) {
						var $this = $(this);
						var idExp = $this.attr('id');
						if(idExp) {
							var text = idExp.replace(reg, function(s,i) {
								var field = s.substring(1,s.length - 1);
								var dataval = data[field];
								if(dataval == null){
									dataval = '';
								}
								return dataval;
							});
							$this.text(text);
							$this.attr("title",text);
						}
					}
				});
			});
			if(_setting.callback.drawAction) {
				_setting.callback.drawAction(data,$trs);
			}
		}

		return {
			data: data,
			$trs: $trs,
			remove: function(){
				_rows.splice(_rows.indexOf(this),1);
				$trs.remove();
				data = null;
			},
			select: function(){
				_selectedGridRow = this;
				$trs.addClass('selected');
				if(_setting.callback.selectedAction) {
					_setting.callback.selectedAction(data,$trs);
				}
			},
			unselect: function(){
				_selectedGridRow = null;
				$trs.removeClass('selected');
				if(_setting.callback.unselectedAction) {
					_setting.callback.unselectedAction(data,$trs);
				}
			},
			current: function() {
				_currentGridRow = this;
				$trs.addClass('hover');
			},
			uncurrent: function() {
				_currentGridRow = null;
				$trs.removeClass('hover');
			},
			updateView: function(effectColIdxs){
				_fillRow(effectColIdxs);
			}
		};
	}
	//... end.
	
	//members ...
	var _setting = {
			currentable: true,
			selectable: true,
			callback: {
				selectedAction: null,
				unselectedAction: null,
				drawAction: null
			}
	};
	var _rows = [], _selectedGridRow = null, _currentGridRow = null;
	var _$selector,_$fixedTable,_$moveLine,_$templetRows;
	//... end
	
	//initialize ...
	var _widthControlThs = [];
	var _fixedTableWidthControlThs = [];
	function _buildHeadTree($table,lastLevelThs) {
		function _buildRealColIndex($th, crossIndexer) {
			$($th.data('children')).each(function(){
				_buildRealColIndex(this,crossIndexer);
			});
			if($th.data('children') == 0) {
				$th.data('colIndex',crossIndexer.index);
				crossIndexer.index++;
				lastLevelThs.push($th);
			}
			else {
				$th.data('colIndex',crossIndexer.index -1);
			}
		};

		$table.find('thead tr').each(function(){
			var settedColCount = 0;
			var $nextTr = $(this).next();
			$(this).find("th").each(function() {
				$(this).data('children',[]);
				var colspan = parseInt($(this).attr('colspan'));
				if($nextTr && colspan > 1) {
					while(--colspan >= 0) {
						var childTh = $nextTr.find("th").eq(settedColCount);//TODO: change this logic
						childTh.data('parent',$(this));
						$(this).data('children').push(childTh);
						settedColCount++;
					}
				}
			});
		});
		
		var crossIndexer = {index:0};
		$table.find('thead tr:first th').each(function(){
			_buildRealColIndex($(this),crossIndexer);
		});

		//test only
		/*
		$table.find('thead tr th').each(function(){
			console.log('td: ' + $(this).html() 
					+ '; parent: ' + ($(this).data('parent')? $(this).data('parent').html(): null)
					+ '; children count: ' + $(this).data('children').length
					+ '; colIndex: ' + $(this).data('colIndex'));
		});
		*/
		
		/* create col elements if its was not declared in the html dom.
		 * no col elements declare ONLY for SINGLE row header.
		 * MULTI row header MUST declare the col elements.
		 */
		if($table.find('colgroup').length == 0) {
			var $colgroup = $('<colgroup></colgroup>');
			$(lastLevelThs).each(function(){
				$("<col style='width:" + this.width() + "px;'></col>").appendTo($colgroup);
			});
			$colgroup.insertBefore($table.find('thead'));
		}		
	}
	
	function _createFixedTable() {
		_$fixedTable = $('<table style="position:absolute;"></table>').append(_$selector.find("colgroup").clone()).append(_$selector.find("thead").clone(true));
		_$fixedTable.find('tr th').each(function(){
			$('<div class="grid-h-split-holder"></div>').prependTo(this);
		});
		_$fixedTable.css('top', _$selector.parent().scrollTop() + 'px');
		_$selector.parent().append(_$fixedTable);
	}
	function _createMoveLine() {
		_$moveLine = $('<div class="grid-h-move-line"></div>');
		_$selector.parent().append(_$moveLine);
	}
	function _resizeTable() {
		var $fiexdHeaderThs = _$fixedTable.find('thead tr th:visible');
		_$selector.find('thead tr th:visible').each(function(index){
			$(this).height($($fiexdHeaderThs[index]).height());
		});
		var $fiexdHeaderCols = _$fixedTable.find('colgroup col');
		_$selector.find('colgroup col').each(function(index){
			$(this).width($($fiexdHeaderCols[index]).width());
		});
	}
	function _setTempletRows() {
		_$templetRows = _$selector.find('tbody tr');
		if(_setting.currentable) {
			_$templetRows.hover(
				function(){
					var step = _$templetRows.length;
					var index = Math.floor($(this).index() / step);
					_rows[index].current();
				},
				function(){
					if(_currentGridRow)
						_currentGridRow.uncurrent();
				}
			);
		}
		if(_setting.selectable) {
			_$templetRows.click(function() {
				if(_selectedGridRow)
					_selectedGridRow.unselect();
				
				var step = _$templetRows.length;
				var index = Math.floor($(this).index() / step);
				_rows[index].select();
			});
		}
		_$templetRows.addClass('templet');			
	}
	function _listenOnScroll() {
		_$selector.parent().scroll(function(){
			var scrollTop = _$selector.parent().scrollTop() + 'px';
			_$fixedTable.css('top', scrollTop);
		});
	}
	function _listenOnDrag() {
		$('.grid-h-split-holder').each(function(){

			var mouseInteraction = new $.ui.mouseInteraction(this, {
				nonDestructive: true,
				_start: function(helper, pos, cursorAt, mouseObject, e){
					$(helper).parent().parent().css('cursor', 'col-resize');
					
					mouseInteraction.posX = e.clientX;
					mouseInteraction.width = $(helper).parent().width();

					_$moveLine
						.height(_$selector.parent().height())
						.css('left', e.clientX + _$selector.parent().scrollLeft() - _$selector.parent().offset().left)
						.css('top', _$selector.parent().scrollTop())
						.show();
				},
				_drag: function(helper, pos, cursorAt, mouseObject, e){
					var newWidth = mouseInteraction.width + e.clientX - mouseInteraction.posX;
					if(newWidth < parseInt($(helper).parent().css('min-width'))) return;
					
					_$moveLine.css('left', e.clientX + _$selector.parent().scrollLeft() - _$selector.parent().offset().left);
				},
				_beforeStop: function(helper, pos, cursorAt, mouseObject, e){
					var offset = e.clientX - mouseInteraction.posX;
					var newWidth = mouseInteraction.width + offset;
					var minWidth = parseInt($(helper).parent().css('min-width'));
					if(newWidth < minWidth) newWidth = minWidth;
					
					var colIndex = $(helper).parent().data('colIndex');
					var $adjustCol = _$fixedTable.find('colgroup col:eq(' + colIndex + ')');
					$adjustCol.width($adjustCol.width() + offset);
				
					_resizeTable();
				},
				_stop: function(helper, pos, cursorAt, mouseObject, e){
					_$moveLine.hide();
					$(helper).parent().parent().css('cursor', 'default');
					mouseInteraction.posX = null;
					mouseInteraction.width = null;
				}
			});
		});
	}
	//... end.
	
	// for col hide and show ...
	function _hideCols(colIdxs) {
		function hideCol(colIdx) {//internal method -->
			_$selector.find('tbody tr').each(function() {
				$(this).find("td").eq(colIdx).hide();
			});
			_$selector.find('colgroup').each(function() {
				$(this).find("col").eq(colIdx).hide();
			});
			_$fixedTable.find('colgroup').each(function() {
				$(this).find("col").eq(colIdx).hide();
			});
			_widthControlThs[colIdx].hide();
			_fixedTableWidthControlThs[colIdx].hide();
			
			_resetHeaderColspan(_getTopParentTh(_widthControlThs[colIdx]));
			_resetHeaderColspan(_getTopParentTh(_fixedTableWidthControlThs[colIdx]));
		}//internal method <--
		if($.isArray(colIdxs)) {
			$(colIdxs).each(function(){
				hideCol(this);
			});
		}
		else hideCol(colIdxs);
			
		//fix IE8 -->
		if(isIE8) {
			_$selector.find('colgroup col:last').each(function(){$(this).css('width',$(this).css('width'))});
			_$fixedTable.find('colgroup col:last').each(function(){$(this).css('width',$(this).css('width'))});
			_$fixedTable.find('thead th:first').each(function(){var text = $(this).text(); $(this).text('').text(text)});
		}
		//fix IE8 <--
	}
	function _showCols(colIdxs) {
		function showCol(colIdx) {//internal method -->
			_$selector.find('tbody tr').each(function() {
				$(this).find("td").eq(colIdx).show();
			});
			_$selector.find('colgroup').each(function() {
				$(this).find("col").eq(colIdx).show();
			});
			_$fixedTable.find('colgroup').each(function() {
				$(this).find("col").eq(colIdx).show();
			});
			_widthControlThs[colIdx].show();
			_fixedTableWidthControlThs[colIdx].show();
			
			_resetHeaderColspan(_getTopParentTh(_widthControlThs[colIdx]));
			_resetHeaderColspan(_getTopParentTh(_fixedTableWidthControlThs[colIdx]));
		}//internal method <--
		if($.isArray(colIdxs)) {
			$(colIdxs).each(function(){
				showCol(this);
			});
		}
		else showCol(colIdxs);
			
		//fix IE8 -->
		if(isIE8) {
			_$selector.find('colgroup col:last').each(function(){$(this).css('width',$(this).css('width'))});
			_$fixedTable.find('colgroup col:last').each(function(){$(this).css('width',$(this).css('width'))});
			_$fixedTable.find('thead th:first').each(function(){var text = $(this).text(); $(this).text('').text(text)});
		}
		//fix IE8 <--
	}
	
	function _resetHeaderColspan($th) {
		if($th.data('children').length > 0) {
			var childVisibleCount = 0;
			$($th.data('children')).each(function(){
				_resetHeaderColspan(this);
				if(this.is(':visible')) childVisibleCount++;
			});
			if(childVisibleCount > 0) {
				$th.attr('colspan',childVisibleCount);
				$th.show();
			}
			else {
				$th.hide();
			}
		}
	}
	function _getTopParentTh($th) {
		return $th.data('parent')? _getTopParentTh($th.data('parent')) : $th;
	}
	//... end.
	
	//deal with data ...
	function _addRows(data) {
		if($.isArray(data)) {
			$(data).each(function(){
				_addRow(this);
			});
		}
		else _addRow(data);
	}
	function _addRow(rowData) {
		var $newRows = _$templetRows.clone(true);
		var gridRow = new GridRow(rowData,$newRows);
		_rows.push(gridRow);
		gridRow.updateView();
		$newRows.insertBefore($(_$templetRows[0])).removeClass('templet');
	}
	function _insertRowBefore(newRowData,referRowData) {
		$(_rows).each(function(i){
			if(this.data == referRowData) {
				var $newRows = _$templetRows.clone(true);
				var gridRow = new GridRow(newRowData,$newRows);
				_rows.splice(i,0,gridRow);
				gridRow.updateView();
				$newRows.insertBefore($(this.$trs[0])).removeClass('templet');
				return false;
			}
		});
	}
	function _insertRowAfter(newRowData,referRowData) {
		$(_rows).each(function(i){
			if(this.data == referRowData) {
				var $newRows = _$templetRows.clone(true);
				var gridRow = new GridRow(newRowData,$newRows);
				_rows.splice(i +1,0,gridRow);
				gridRow.updateView();
				$newRows.insertAfter($(this.$trs[this.$trs.length -1])).removeClass('templet');
				return false;
			}
		});
	}
	function _updateRowView(rowData,effectColIdxs) {
		$(_rows).each(function(){
			if(this.data == rowData) {
				this.updateView(effectColIdxs);
				if(isIE8) {_$selector.parent().trigger('scroll');}//fix IE8
				return false;
			}
		});
	}
	function _removeRow(rowData) {
		$(_rows).each(function(){
			if(this.data == rowData) {
				this.remove();
				if(isIE8) {_$selector.parent().trigger('scroll');}//fix IE8
				return false;
			}
		});
	}
	function _removeAllRows() {
		_rows = [];
		_$selector.find('tbody tr:not(.templet)').remove();
		if(isIE8) {_$selector.parent().trigger('scroll');}//fix IE8
	}
	//... end.
	
	var reg = /\{[^}]+\}/g;
	
	return {
		/**
		 * 初始化表格。
		 * @param {String} selector 基于jquery选择器的表达式。
		 * @param {Object} setting 自定义设置，可选。默认为：{callback: {selectedAction: null,unselectedAction: null,drawAction: null}}。
		 * @param {Array} data 用于填充表格的数据，可选。 
		 */
		init: function(selector,setting,data) {
			$.extend(_setting, setting);
			_$selector = $(selector);
			
			_$selector.parent().addClass('grid-resizeable-container');
			_buildHeadTree(_$selector,_widthControlThs);//!?
			
			_createFixedTable();
			_buildHeadTree(_$fixedTable,_fixedTableWidthControlThs);

			_createMoveLine();
			_listenOnScroll();
			_listenOnDrag();

			_setTempletRows();
			
			if(data) _addRows(data);
		},
		/**
		 * 初始化后，调用此方法，填充表格数据。调用此方法会清楚已有所有数据行。
		 * @param {Array} data 填充的数据。
		 */
		update: function(data,callBackFunc) {
			_removeAllRows();
			if(data) _addRows(data);
			if(callBackFunc)
				callBackFunc();
		},
		/**
		 * 添加行，并更新界面。
		 * @param {Object} rowData 行数据。
		 */
		addRow: function(rowData) {
			_addRow(rowData);
		},
		/**
		 * 在参照行前面插入一行，并更新界面。
		 * @param {Object} newRowData 新的行数据。
		 * @param {Object} referRowData 参照的行数据。
		 */
		insertRowBefore: function(newRowData,referRowData) {
			_insertRowBefore(newRowData,referRowData);
		},
		/**
		 * 在参照行后面插入一行，并更新界面。
		 * @param {Object} newRowData 新的行数据。
		 * @param {Object} referRowData 参照的行数据。
		 */
		insertRowAfter: function(newRowData,referRowData) {
			_insertRowAfter(newRowData,referRowData);
		},
		/**
		 * 删除行，并更新界面。
		 * @param {Object} rowData 行数据。
		 */
		removeRow: function(rowData) {
			_removeRow(rowData);
		},
		/**
		 * 更新表格行，当数据改变时，调用此方法刷新表格显示。
		 * @param {Object} rowData 行数据。
		 * @parem {Array} effectColIdxs 可选，刷新的列索引或索引数组。不指定则刷新全部列。
		 */
		updateRowView: function(rowData,effectColIdxs) {
			_updateRowView(rowData,effectColIdxs);
		},
		/**
		 * 获取选中行的数据。
		 * @return {Object} 选中行的数据。
		 */
		getSelectedRow: function() {
			return _selectedGridRow? _selectedGridRow.data: null;
		},
		getSelectedRows: function() {
			var data = [];
			$(_rows).each(function(i,v){
				if(this.$trs.hasClass('selected'))
					data.push(this.data);
			});
			return data;
		},
		/**
		 * 获取当前行的数据。
		 * @return {Object} 当前行的数据。
		 */
		getCurrentRow: function() {
			return _currentGridRow? _currentGridRow.data: null;
		},
		/**
		 * 获取列表中的所有数据。
		 * @return {Array} 列表中的所有数据行。
		 */
		getAllData: function() {
			var data = [];
			$(_rows).each(function(i,v){
				data.push(this.data);
			});
			return data;
		},
		/**
		 * 隐藏表格列
		 * @parem {Array} colIdxs 可选，隐藏的表格列索引或索引数组。
		 */
		hideCols: function(colIdxs) {
			_hideCols(colIdxs);
		},
		/**
		 * 显示表格列
		 * @parem {Array} colIdxs 可选，显示的表格列索引或索引数组。
		 */
		showCols: function(colIdxs) {
			_showCols(colIdxs);
		}
	};
};

GridResizeable = new GridResizeableEnvironment();


function cc(inputStar)
    {        
      var temp = inputStar.replace(/[^\x00-\xff]/g,"**");
      if(temp.length > maxlength)
      {
        var bytesCount = 0;
	    for (var i = 0; i < inputStar.length; i++) {
	    var c = inputStar.charAt(i);
	    if(maxlength != -1)
	    {
	    if (/^[\u0000-\u00ff]$/.test(c)) 
	    {
	      bytesCount += 1;
	    }
	    else 
	    {
	      bytesCount += 2;
	    }
	    if(bytesCount > maxlength )
	    {
	      return inputStar.substring(0,i);
	    }
	   } 
	  }
	  }
      else (maxlength == -1)
      {
        return inputStar;
      }
}
	
	$.fn.formMaxlength=function(){
		this.keyup(function(event){	
		     maxlength = $(this).prop('maxlength');		      	   		     
		    $(this).val(cc($(this).val()));
		    alert(1);
		});
	};
(function($){	
	$(function(){
		//$('#dataT input:text').formMaxlength();		
		$(document).on('keyup','#LdataArea input[type="text"]',function(event){
		      maxlength = $(this).prop('maxlength');		      	   		     
		    $(this).val(cc($(this).val()));
		});	
		
	});
})(jQuery);	
