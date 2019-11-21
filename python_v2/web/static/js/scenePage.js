// 全局信息
var scenarioInformation;
// 表格数据
var scenarioTableData = [];
// 提交类型
var pushType = ""

// 编辑界面文本ID
var idArray = ["scenarioID", "scenarioName", "projectID", "numberNode",
 "numberSimpleNode", "numberComplexNode", "dynamicTopologyFile", "scenarioStatus", "scenarioType"];

// 编辑界面输入框标题
var titleArray = ["场景编号", "场景名称", "所属项目", "节点数", "简单节点数", "复杂节点数量", "运动文件", "场景状态", "场景类型"];

// 在创建的时候需要填入初值的序列
var needinitialIndex = [2, 3, 4, 5];

// 初始值 其中的所属项目由本身产生
var initialValue = [0, 0, 0, 0];

function scenarioTableInit(){
    var $scenarioTable = $('#scenarioTable');
    var $scenarioTableRemoveBtn = $('#scenarioTableRemoveBtn');

    $("#scenarioManageTable").show();
    $("#scenarioTableEdit").hide();

    // 移除事件
    $scenarioTableRemoveBtn.click(function () {
        var ids = $.map($scenarioTable.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
        $('#scenarioTable').bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
        dataRemoveById(ids);
    });

    // 操作栏
    window.operateEvents = {
        'click .edit': function (e, value, row, index) {
            dataEdit(row.id);
        },
        'click .remove': function (e, value, row, index) {
            $('#scenarioTable').bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            });
            dataRemoveById([row.id]);
        },
        'click .choose': function (e, value, row, index) {
            enterSimulationPage(row.id);
        }

    }

    // 双击表格事件
    $('#scenarioTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        enterSimulationPage(row.id);
    });

    // 添加表格数据
    $(document).ready(function() {
        $('#scenarioTable').bootstrapTable('append', scenarioTableData);
    });

    // 添加数据
    $("#scenarioTableAddBtn").click(function () {
        manageAddscenario();
    });

    // 返回事件
    $("#scenarioReturn").click(function () {
        $("#scenarioManageTable").show();
        $("#scenarioTableEdit").hide();
        manageEditDeviceDataRemove();
    });
}

// 选择场景进入仿真界面
function enterSimulationPage(id){
    // 数据组装
    data = {
        "function": "choose",
        "scenario": id
    }

    $.ajax({
        type: 'POST',
        url: '/scenario',
        data: data,
        dataType: 'json',
        success: function(data) {
            window.location.href="simulationPage.html"
        },
        error: function(xhr, type) {
            alert("网络错误!");
        }
    });
}

// 依据id删除工程
function dataRemoveById(ids){

    // 数据组装
    data = {
        "function": "delete",
        "id": ids
    }
    console.log(data)
    //采用post方法向后端提交数据
    $.ajax({
        type: 'POST',
        url: '/scenario',
        data: data,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if(data == "success"){
                alert("成功删除!");
            }
            else if(data == "wrong"){
                alert("删除失败!");
            }
        },
        error: function(xhr, type) {
            alert("网络错误!");
        }
    });
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="edit btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">___</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">___</span>',
        '<button type="button" class="choose btn btn-success">选择</button>',
    ].join('')
}

// 将后端数据进行解析
function tableInformationTrans(){

    // 删除表格原有数据
    $('#scenarioTable').bootstrapTable('removeAll');

    for(var i = 0; i < scenarioInformation.scenarioID.length; i++){
        scenarioTableData[i] = {
            'id': scenarioInformation.scenarioID[i],
            'scenarioName':scenarioInformation.scenarioName[i],
            'projectID': scenarioInformation.projectID[i],
            'numberNode': scenarioInformation.numberNode[i],
            'numberSimpleNode': scenarioInformation.numberSimpleNode[i],
            'numberComplexNode':scenarioInformation.numberComplexNode[i],
            'dynamicTopologyFile': scenarioInformation.dynamicTopologyFile[i],
            'scenarioStatus': scenarioInformation.scenarioStatus[i],
            'scenarioType': scenarioInformation.scenarioType[i]
        }
    }

    scenarioTableInit();
}

// 增加数据
function manageAddscenario(){
    pushType = "create";
    for(var i= 0; i < needinitialIndex.length; i++){
        if(i == 0){
            // 填充当前项目编号
            document.getElementById(idArray[needinitialIndex[i]]).value = scenarioInformation.projectID[0]
            continue;
        }
        document.getElementById(idArray[needinitialIndex[i]]).value = 0;
    }
    $("#scenarioManageTable").hide();
    $("#scenarioTableEdit").show();
}

// 工程保存
function scenarioMsgSave(){
    //遍历输入框检查是否填写完全 其中编号无法修改 所以i从1开始赋值
    for(var i = 1; i < idArray.length; i++){
        if(document.getElementById(idArray[i]).value == ""){
            alert("请填写" + titleArray[i] + "!");
            return;
        }
    }

    // 数据组装
    data = {
        "function": pushType,
        "scenarioID": document.getElementById("scenarioID").value,
        "scenarioName": document.getElementById("scenarioName").value,
        "projectID": document.getElementById("projectID").value,
        "numberNode": document.getElementById("numberNode").value,
        "numberSimpleNode": document.getElementById("numberSimpleNode").value,
        "numberComplexNode": document.getElementById("numberComplexNode").value,
        "dynamicTopologyFile": document.getElementById("dynamicTopologyFile").value,
        "scenarioStatus": document.getElementById("scenarioStatus").value,
        "scenarioType": document.getElementById("scenarioType").value,
        "data": ""
    }

    //采用post方法向后端提交数据
    $.ajax({
        type: 'POST',
        url: '/scenario',
        data: data,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if(data == "success"){

                // 清空表格
                manageEditDeviceDataRemove();

                //重新获取数据
                scenarioPageInit();   
            }
            else if(data == "existed"){
                alert("场景名称已存在!");
            }
    
        },
        error: function(xhr, type) {
            alert("网络错误!");
        }
    });
}

//清空表格
function manageEditDeviceDataRemove(){
    for(var i = 0; i < idArray.length; i++){
        document.getElementById(idArray[i]).value = "";
    }
}

//填充原有数据
function manageEditDataPush(id){
    var i;
    var index = 0;
    
    //计算id位置所在的数据
    for(i = 0; i < scenarioInformation.scenarioID.length; i++){
        if(id == scenarioInformation.scenarioID[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in scenarioInformation){
        document.getElementById(x).value = scenarioInformation[x][i];
    }
}

//信息编辑
function dataEdit(id){
    pushType = "edit";
    manageEditDataPush(id);
    $("#scenarioManageTable").hide();
    $("#scenarioTableEdit").show();
}

//后端数据获取
function scenarioPageDataPull(){
    data = {
        "function": "get",
        "data": ""
    }
    //采用post方法向后端请求数据
    $.ajax({
        type: 'POST',
        url: '/scenario',
        data: data,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            scenarioInformation = data;
            tableInformationTrans();
            
        },
        error: function(xhr, type) {
            console.log('错误')
        }
    });
}

//界面初始化
function scenarioPageInit()
{
    //表格初始化
    scenarioTableInit();

    //数据拉取
    scenarioPageDataPull();
}


window.addEventListener("load", scenarioPageInit, false);  

