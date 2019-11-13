<!DOCTYPE html>

 
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8" />
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache" />
<META HTTP-EQUIV="Pragma" CONTENT="no-cache" />
<META HTTP-EQUIV="Expires" CONTENT="0" />


<script type="text/javascript" src="/argics/static/application-context.js"></script>

<script type="text/javascript">
var addr = "http://www.njy365.com:80";
var ctxSetting = {
		themeName: "blue",
		contextPath: "/argics"
};
CTX.init(ctxSetting);
CTX.functions.loadCss("default");
CTX.utilities.load("global","1.0.0");
CTX.utilities.load("jquery","1.9.1");
CTX.widgets.load("loadingbox","1.0.0");
CTX.utilities.load("jquery.ex","1.0.0");
CTX.utilities.load("json2","1.0.0");
</script>
	<link rel="stylesheet" href="/argics/static/bootstrap/3.3.4/css/bootstrap.min.css">  
	<link rel="stylesheet" href="/argics/static/bootstrap/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css"> 
	<link rel="stylesheet" href="/argics/static/bootstrap-table/bootstrap-table.min.css"> 
	
	<script src="/argics/static/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script src="/argics/static/bootstrap/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min.js"></script>
	<script src="/argics/static/bootstrap/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
	<script src="/argics/static/bootstrap-table/bootstrap-table.min.js"></script>
	<script src="/argics/static/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script type="text/javascript">
(function($){
	$(function(){
		$.ajaxSetup({cache:false});//for IE
	});
})(jQuery);
</script>

<html>
<head>


<title>车况监测</title>

<link rel="stylesheet" type="text/css" href="/argics/global/css/main.css" />

<script type="text/javascript" src="/argics/static/ichar/ichart-1.0.min.js"></script>
<script type="text/javascript" src="/argics/static/ichar/ichart.gauge2d.js"></script>


<script type="text/javascript">
	CTX.utilities.load("jquery.ui.mouseinteraction", "1.0.0");
	CTX.widgets.load("dialog", "1.0.0");
	CTX.widgets.load("modelbox", "1.0.0");
	CTX.widgets.load("message", "1.0.0");
	CTX.widgets.load("toolbar", "1.0.0");//按钮
	CTX.widgets.load("form", "1.0.0");//form表单
	CTX.utilities.load("validate", "1.0.0");
	CTX.widgets.load("splitbar", "1.0.0");//分割线
	CTX.widgets.load("grid_resizeable", "1.0.0");//表格
	CTX.widgets.load("pagination", "1.0.0");//分页
	CTX.functions.load("catalogManager", "basic");
	CTX.widgets.load("ztree", "3.5.16");//树

	CTX.widgets.load("paginationed", "1.0.0");
	CTX.functions.load("tractormonitor", "monitor");

	var globalobj = 1;
	//当前选中节点
	var filter = {};
	var curTreeNode = null;
	var refresh;

	var engin_name = null;
	//设备id
	var tractorId = "12362";

	function query() {
		var searchCode = $('#searchCode').val();
		location.href = addr + "/argics/tracmonitor/main.do?searchCode=" + searchCode;
		$('#searchCode').val(searchCode);
	}

	function enterQuery() {
		var event = window.event || arguments.callee.caller.arguments[0];
		var keyCode = event.charCode || event.keyCode;
		if (keyCode == 13)
			query();
	};

	(function($) {
		$(function() {
			var curTr;
			Toolbar.init('#Ltoolbar');
			SplitBar.HSplit('#LhSplitBar');
			filter.pageSize = 10;
			getGridData();
			var curArea = {};
			curArea.id = null;
			curArea.treelevel = 0;
			var operFlag = '';
			var isDisplay = false;

			var canLoadInfo = true;//解决节点信息未加载出来就点新增按钮造成的体验不好问题
			/* var bootNodes = [ {
				name : '产品目录',
				open : true,
				pId : null,
				id : -1,
				isParent : true,
				treelevel : 0
			} ];

			var setting = {
				data : {
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pId",
						rootPId : null,
					}
				},
				async : {
					enable : true,
					url : addr + "/argics/tracmonitor/getCatalogTreeList.do",
				},
				callback : {
					onClick : function(event, tid, tnode) {
						if (tnode.id.indexOf("en_") >= 0 && !tnode.isParent) {//机型 才可点击
							engin_name = tnode.name;//机型名称
							$('#tractorTB').bootstrapTable("refresh", {
								url : addr + "/argics/tracmonitor/getTractorList.do?idStr=" + tnode.id
							});
						}
					}
				}
			};

			$.fn.zTree.init($('#treePanel'), setting, bootNodes); */

			//获取表格数据
		 	function getGridData() {
				var uri = addr + "/argics/engineType/getEngineTypeLister.do";
				$.postJSON(uri, filter, function(data) {
					GridResizeable.update(data.records);
					Pagination.update({
						cp : data.cp,
						tp : data.tp,
						cr : data.cr,
						tr : data.tr
					});
				});
			}
			refresh = function() {
				getGridData();
			}; 

			$('#tractorTB').bootstrapTable({
				url : addr + "/argics/tracmonitor/getTractorList.do",
				onClickRow : function(row) {
					var id = row.tractorId;
					tractorId = row.tractorId;//赋值 定时刷新条件
					location.href = addr + "/argics/tracmonitor/main.do?tractorid=" + id + "&flag=";
				},
				formatNoMatches : function() { //没有匹配的结果  
					return '不含任何设备';
				}
			});

			//如果从车辆运营 - 车辆跟踪过来  显示 返回按钮
			if ("" == "20") {
				//$("#back").attr('style','display:block;float:right;margin:0px 8px 0 0;cursor:pointer;');
				$('#back').css('display', 'block');
			}

		});
	})(jQuery);

	/* function showmenu() {
		var obj = $("#tractorSel");
		var offset = $("#tractorSel").offset();
		$("#menuContent").css({
			left : offset.left + "px",
			top : offset.top + obj.outerHeight() + "px"
		}).slideDown("fast");

		$("body").bind("mousedown", onBodyDown);
	};

	function hideMenu() {
		$("#menuContent").fadeOut("fast");
		$("body").unbind("mousedown", onBodyDown);
	}

	function onBodyDown(event) {
		if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
			hideMenu();
		}
	} */

	//返回
	function comeBack() {
		javascript: history.go(-1);
	}
</script>
<style>
#dataT {
	font-family: verdana, arial, sans-serif;
	font-size: 15px;
	color: #333333;
	border-width: 1px;
	border-color: #F7F7F7;
	border-collapse: collapse;
	border: none;
}

#dataT th {
	height: 40px;
	border-width: 1px;
	border-style: solid;
	border-color: #F7F7F7;
	background-color: #dedede;
	border: none;
	text-align: center;
}

#dataT td {
	border-width: 1px;
	border-style: solid;
	border-color: #666666;
	background-color: #ffffff;
	border: none;
}

body {
	overflow-x: hidden;
	overflow-y: hidden;
}

label {
	font-weight: normal;
	font-size: 15px;
}

#heads {
	height: 100%;
}

#mands {
	background-color: #F7F7F7;
	width: 100%;
	height: 9%;
	font-size: 16px;
	padding-top: 1%;
}

#mandss {
	background-color: #F7F7F7;
	width: 100%;
	font-size: 16px;
}

#ners {
	width: 100%;
	height: 4%;
	float: center;
	font-size: 14px;
}

#searchCode {
	height: 30px;
	width: 150px;
}

LrightPanel {
	vertical-align: middle !important;
	height: 100%;
	width: 100%;
}
</style>
</head>

<body>

	<div id="heads">
		<div id="mands">&nbsp;&nbsp;车况监测</div>
		<div id="ners" style="height: 40px;">
			&nbsp;&nbsp;设备目录： <input id="tractorSel" onclick="showmenu()" style="height: 35px; width: 200px; margin-top: 3px;" value="凯沃" /> <img
				src="/argics/global/images/search.png" style="float: right; margin-right: 30px; cursor: pointer; margin: 3px 8px 0 0;" onclick="query();" /> <input
				type="text" id="searchCode" style="float: right; height: 30px; margin-top: 5px; font-size: 14px;" placeholder="设备编号/手机" onkeydown="enterQuery();" value=""></input>
			<img src="/argics/global/images/retu.png" id="back" style="float: right; margin: 5px 8px 0 0; cursor: pointer; display: none; height: 30px;"
				onclick="comeBack()" />



			<div id="menuContent" class="menuContent" style="height: 320px; width: 520px; display: none; position: absolute; z-index: 99999; background: #fff; border: 10px solid #F2F2F2">
				<div class="menuTitle" style="height: 30px; width: 500px; background: #6AB6D2; text-align: left">
					<span style="font-size: 20px; color: #fff;">选择设备目录</span>
				</div>
				<div class="content" style="height: 280px; width: 500px;">
					<div class="contentLeft" style="height: 270px; width: 200px; float: left; overflow: auto; border: 5px solid #F2F2F2">
						<ul id="treePanel" class="ztree"></ul>
					</div>
					<div class="contentLeft" style="height: 270px; width: 300px; float: right; overflow: auto; border: 5px solid #F2F2F2">
						<table id="tractorTB">
							<thead>
								<tr>
									<th data-field="tractorNo">设备目录</th>
									<th data-field="userName">用户</th>
								</tr>
							</thead>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div id="mandss" style="border: 2px solid #F2F2F2">

			<div id="LrightPanel">
				<div id="runInfo">
					<div id="runInfo-left">
						<div class="picture">
							<img id="image" src="/argics/uploadImage/enginetype/20180117181237398_412.jpg" style="width: 150px; height: 150px;" />
						</div>
					</div>

					<div id="runInfo-right">
						<div class="f-row">
							<div class="f-col">
								<label>产品</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="拖拉机"></input>
							</div>
							<div class="f-col">
								<label>用户</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="凯沃"></input>
							</div>
							<div class="f-col">
								<label>发动机型号</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="全柴Q170694884G"></input>
							</div>

						</div>
						<div class="f-row">
							<div class="f-col">
								<label>机型</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="凯沃"></input>
							</div>
							
							<div class="f-col">
								<label>电话</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="18615086126"></input>
							</div>
							<div class="f-col">
								<label>工作时间(h)</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="0.00"></input>
							</div>
						</div>
						<div class="f-row">
							<div class="f-col">
								<label>编号</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="09"></input>
							</div>
							<div class="f-col">
								<label>出厂</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="2017-12-12"></input>
							</div>
							<div class="f-col">
								<label style="width: 110px; margin-left: -9px;">行驶里程(km)</label> <input style="border: none; font-size: 15px; text-align: left;" type="text" value="0.00"></input>
							</div>
						</div>



					</div>
				</div>


				<div style="width: 100%; border: none; margin-top: -15px;">
					<div style="display: none; float: left; width: 304px; height: 227px; overflow: hidden; position: relative;">
						<div id='canvasDiv' style="float: left; border: none; margin-left: -40px; left: 37px; top: -13px; position: absolute;"></div>
					</div>
					<div style="float: left; width: 420px; height: 227px; overflow: hidden; position: relative; border: none;">
						<div id='canvasDiv2' style="float: left; border: none; margin-left: -40px; left: 37px; top: -13px; position: absolute;"></div>
						<!-- <div id='canvas' style="width:50px;height:22px">   </div> -->
					</div>

					<div style="float: left; width: 400px; height: 227px; overflow: hidden; position: relative; border: none;">
						<div id='canvasDiv3' style="float: left; border: none; margin-left: -40px; left: 37px; top: -13px; position: absolute;"></div>
					</div>
					<div style="float: left; width: 400px; height: 227px; overflow: hidden; position: relative; border: none;">
						<div id='canvasDiv4' style="float: left; border: none; margin-left: -40px; left: 37px; top: -13px; position: absolute;"></div>
					</div>
				</div>

				<div id="" style="margin-top: -40px;">
					<table id="dataT">
						<thead>
							<tr>
								<th style="width: 220px;">数据时间</th>
								<th style="width: 200px;">发动机转速(rpm)</th>
								<th style="width: 150px;">冷却液温度(℃)</th>
								<th style="width: 200px;">发动机油压(MPa)</th>

								<th style="width: 120px;">经度</th>
								<th style="width: 120px;">纬度</th>
								<th style="width: 120px;">工作时间(h)</th>
								<th style="width: 150px;">行驶里程(Km)</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td id="gathertime">2018-01-08 13:19:44</td>
								<td id="enginerpm">1544.000</td>
								<td id="coolanttemp">24</td>
								<td id="oilpressure">0.5840</td>

								<td id="longtitude">119.216253</td>
								<td id="latitude">36.602366</td>
								<td id="enginehours">0.00</td>
								<td id="mileage">0.00</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

		</div>



	</div>
</body>

<script type="text/javascript">
	var chart;
	var chart2;
	var chart3;
	var chart4;
	$(function() {
		//第一个表盘
		chart = new iChart.Gauge2D({
			render : 'canvasDiv',
			/* title : {
				text : 'Gauge Component Designer',
				height:40,
				fontsize : 20,
				color : '#2c374a'
			}, */
			panel : {
				background_color : '#2c374a',
				border : false,
				iborder : {
					radius : '98%',
					color : '#9cb1b2'
				}
			},
			tickmarks : {
				start_angle : 40,
				space_angle : 0,
				radius : '84%',
				width : 14,
				bg_color : [ 0, 0, 0, 0, 0, 0, 0, 0, '#e3c63e', '#e33e41' ],
				size : 2,
				count : 10,
				color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				lower : 0,
				upper : 60,
				small_color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				small_count : 5
			},
			screen : {
				decimalsnum : 1,
				unit_post : 'km/h',
				fontsize : 12,
				width : 50,
				height : 22,
				background_color : '#fefefe',
				color : '#2c374a'
			},
			label : {
				label_space : 20,
				color : '#9fb3b2',
				fontsize : 11,
				fontweight : 600
			},
			shadow : true,
			value : 10,
			background_color : '#ffffff',
			text : {
				text : '车速',
				color : '#fff',
				fontsize : 13,
			},

			needle : {
				color : '#f4e5b0',
				size : 6,
				alpham : 0.6
			},
			cap : {
				color : '#7bbfec',
				size : 12
			},
			width : 340,
			height : 260,
			radius : '90%'
		});

		//第二个表盘
		chart2 = new iChart.Gauge2D({
			render : 'canvasDiv2',
			/* title : {
				text : 'Gauge Component Designer',
				height:40,
				fontsize : 20,
				color : '#2c374a'
			}, */
			panel : {
				background_color : '#2c374a',
				border : false,
				iborder : {
					radius : '98%',
					color : '#9cb1b2'
				}
			},
			tickmarks : {
				start_angle : 40,
				space_angle : 0,
				radius : '84%',
				width : 14,
				bg_color : [ 0, 0, 0, 0, 0, 0, 0, 0, '#e3c63e', '#e33e41' ],
				size : 2,
				count : 10,
				color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				lower : 0,
				upper : 30,
				small_color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				small_count : 5
			},
			screen : {
				decimalsnum : 2,
				unit_post : 'r/min×100',
				fontsize : 12,
				width : 50,
				height : 22,
				background_color : '#fefefe',
				color : '#2c374a'
			},
			label : {
				label_space : 20,
				color : '#9fb3b2',
				fontsize : 11,
				fontweight : 600
			},
			shadow : true,
			value : 10,
			background_color : '#ffffff',
			text : {
				text : '转速x100',
				color : '#fff',
				fontsize : 13
			},
			needle : {
				color : '#f4e5b0',
				size : 6,
				alpham : 0.6
			},
			cap : {
				color : '#7bbfec',
				size : 12
			},
			width : 340,
			height : 260,
			radius : '90%',
			border : 'none'
		});
		//第3个表盘
		chart3 = new iChart.Gauge2D({
			render : 'canvasDiv3',
			/* title : {
				text : 'Gauge Component Designer',
				height:40,
				fontsize : 20,
				color : '#2c374a'
			}, */
			panel : {
				background_color : '#2c374a',
				border : false,
				iborder : {
					radius : '98%',
					color : '#9cb1b2'
				}
			},
			tickmarks : {
				start_angle : 40,
				space_angle : 0,
				radius : '84%',
				width : 14,
				bg_color : [ 0, 0, 0, 0, 0, 0, 0, 0, '#e3c63e', '#e33e41' ],
				size : 2,
				count : 10,
				color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				lower : 0,
				upper : 120,
				small_color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				small_count : 5
			},
			screen : {
				decimalsnum : 1,
				unit_post : '℃',
				fontsize : 12,
				width : 50,
				height : 22,
				background_color : '#fefefe',
				color : '#2c374a'
			},
			label : {
				label_space : 20,
				color : '#9fb3b2',
				fontsize : 11,
				fontweight : 600
			},
			shadow : true,
			value : 10,
			background_color : '#ffffff',
			text : {
				text : '水温',
				color : '#fff',
				fontsize : 13
			},
			needle : {
				color : '#f4e5b0',
				size : 6,
				alpham : 0.6
			},
			cap : {
				color : '#7bbfec',
				size : 12
			},
			width : 340,
			height : 260,
			radius : '90%',
			border : 'none'
		});
		//第4个表盘
		chart4 = new iChart.Gauge2D({
			render : 'canvasDiv4',
			/* title : {
				text : 'Gauge Component Designer',
				height:40,
				fontsize : 20,
				color : '#2c374a'
			}, */
			panel : {
				background_color : '#2c374a',
				border : false,
				iborder : {
					radius : '98%',
					color : '#9cb1b2'
				}
			},
			tickmarks : {
				start_angle : 40,
				space_angle : 0,
				radius : '84%',
				width : 14,
				bg_color : [ 0, 0, 0, 0, 0, 0, 0, 0, '#e3c63e', '#e33e41' ],
				size : 2,
				count : 4,
				color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				lower : 0,
				upper : 1,
				small_color : [ '#fcf1e2', 0, 0, 0, 0, 0, 0, 0, '#2c374a', '#2c374a' ],
				small_count : 5
			},
			screen : {
				decimalsnum : 2,
				unit_post : 'MPa',
				fontsize : 12,
				width : 50,
				height : 22,
				background_color : '#fefefe',
				color : '#2c374a'
			},
			label : {
				label_space : 20,
				color : '#9fb3b2',
				fontsize : 11,
				fontweight : 600
			},
			shadow : true,
			value : 10,
			background_color : '#ffffff',
			text : {
				text : '油压',
				color : '#fff',
				fontsize : 13
			},
			needle : {
				color : '#f4e5b0',
				size : 3,
				alpham : 0.6
			},
			cap : {
				color : '#7bbfec',
				size : 12
			},
			width : 340,
			height : 260,
			radius : '90%',
			border : 'none'
		});
		chart.draw();
		chart2.draw();
		chart3.draw();
		chart4.draw();

		chart.to("0.00");
		chart2.to("15.44");
		chart3.to("24");
		chart4.to("0.5840");
	});

	/** 定时刷新 */
	function timeTaskRefresh() {
		if (tractorId) {
			var tractor = {};
			tractor.tractorId = tractorId;
			var uri_timeTask = addr + "/argics/tracmonitor/timeTaskRefresh.do";
			$.postJSON(uri_timeTask, tractor, function(data) {

				//if(data.success){
				//刷新 最下面 表格 数据
				$("#gathertime").html(data.gathertime == null ? "" : data.gathertime.substring(0, 19));//数据时间
				$("#enginerpm").html(data.enginerpm);//发动机转速
				$("#coolanttemp").html(data.coolanttemp);//冷却液温度
				$("#oilpressure").html(data.oilpressure);//发动机油压
				//$("#speed").html(data.speed);//车速
				$("#longtitude").html(data.longtitude);//经度
				$("#latitude").html(data.latitude);//纬度
				$("#enginehours").html(data.enginehours);//工作时间
				$("#mileage").html(data.mileage);//行驶里程

				//刷新 表盘
				chart.to(data.speed);
				chart2.to(data.enginerpm / 100);
				chart3.to(data.coolanttemp);
				chart4.to(data.oilpressure);
				// } // 是否 刷新 成功 end
			});
		}

	}
	//每隔30秒执行一次
	window.setInterval(timeTaskRefresh, 1000 * 30);
</script>


</html>
