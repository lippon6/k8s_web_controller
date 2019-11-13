var modelManageInformation;

var tableData = [];
var idArray = ["productContent", "modelNum", "modelName", "useState", "remark"];
var titleArray = ["产品目录", "机型编码", "机型名称", "状态", "备注"];

function modelManagePageDataPull()
{

    var modelManageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorModelManageAsk",
    
        }
    }
    sendMessage = modelManageMessage;

    tableData[0] = {
        "productContent":"拖拉机",
        "modelNum":"01",
        "modelName":"01",
        "useState":"01",
        "remark":"01",
    }
}

//告警数据帧解析
function modelManageInformationParse(data){
    modelManageInformation = data.modelManageData;

    for(var i = 0; i < modelManageInformation.quantity; i++){
        tableData[i] = {
            "productContent" : modelManageInformation.productContent[i],
            "modelNum": modelManageInformation.modelNum[i],
            "modelName": modelManageInformation.modelName[i],
            "useState": modelManageInformation.useState[i],
            "remark": modelManageInformation.remark[i]
        }
    }

    $('#modelManageMsgTable').bootstrapTable('removeAll');
    $('#modelManageMsgTable').bootstrapTable('append', tableData);

    if(modelManageInformation.editAuthority == 0){
        $('#modelManageMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#modelManageMsgAddBtn").hide();
    }
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="modelEditBtn btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>'
    ].join('')
}

function modelManageTableInit(){
    var $modelManageTable = $('#modelManageMsgTable');
    var $modelManageTableRemoveBtn = $('#modelManageTableRemove');
    $("#modelEdit").hide();
    $("#modelManageTable").show();
    

    // 返回事件
    $("#modelManageTableReturn").click(function (){
        $("#modelEdit").hide();
        $("#modelManageTable").show();
        //清空表格
        manageEditModelDataRemove();
    });

    // 保存事件
    $("#modelManageSave").click(function (){
        modelSave();
    });

    // 移除事件
    $modelManageTableRemoveBtn.click(function () {
        var ids = $.map($modelManageTable.bootstrapTable('getSelections'), function (row) {
            return row.modelNum
        });
        $('#modelManageMsgTable').bootstrapTable('remove', {
            field: 'modelNum',
            values: ids
        });
        manageDeleteModel(ids);
    });

    // 双击表格事件
    $('#modelManageMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditModel(row.modelNum);
    });

    // 操作栏
    window.operateEvents = {
        'click .modelEditBtn': function (e, value, row, index) {
            manageEditModel(row.modelNum);
        },
        'click .remove': function (e, value, row, index) {
            $('#modelManageMsgTable').bootstrapTable('remove', {
                field: 'modelNum',
                values: [row.modelNum]
            })
            manageDeleteModel([row.modelNum]);
        }
    }

    // 添加数据
    $("#modelManageMsgAddBtn").click(function () {
        manageAddModel();
    });

    $(document).ready(function() {
        $('#modelManageMsgTable').bootstrapTable('append', tableData);
    });
}

//机型存储
function modelSave(){
    //遍历输入框检查是否填写完全
    for(var i = 0; i < idArray.length; i++){
        if(document.getElementById(idArray[i]).value == ""){
            alert("请填写" + titleArray[i] + "!");
            return;
        }
    }
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorModelManageSave",

        },
        "data":{
            "modelManageData":{
                "productContent":document.getElementById("productContent").value,
                "modelNum":document.getElementById("modelNum").value,
                "modelName":document.getElementById("modelName").value,
                "useState":document.getElementById("useState").value,
                "remark":document.getElementById("remark").value,
            }
        }
    }

    doSend(msg);

    $("#modelEdit").hide();
    $("#modelManageTable").show();

    //清空数据
    manageEditModelDataRemove();
}

function manageDeleteModel(modelNum){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorModelManageDelete",

        },
        "data":{
            "modelManageData":{
                "modelNum":modelNum
            }
        }
    }

    doSend(msg);
}

function manageAddModel(){

    $("#modelManageTable").hide();
    $("#modelEdit").show();
}

function manageEditModel(num){
    manageEditModelDataPush(num);

    $("#modelManageTable").hide();
    $("#modelEdit").show();
}


//清空表格
function manageEditModelDataRemove(){
    for(var i = 0; i < idArray.length; i++){
        document.getElementById(idArray[i]).value = "";
    }
}

//填充原有数据
function manageEditModelDataPush(id){
    var i;
    var index = 0;

    //计算id位置所在的数据
    for(i = 0; i < modelManageInformation.quantity; i++){
        if(id == modelManageInformation.modelNum[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in modelManageInformation){
        index++;
        //第一个数据为quantity，因此跳过
        if(index == 1){
            continue;
        }
        document.getElementById(idArray[index - 2]).value = modelManageInformation[x][i];
    }
}

function modelManagePageInit(){ 

    modelManagePageDataPull(); 
    
    modelManageTableInit();
    
}

window.addEventListener("load", modelManagePageInit, false);  
