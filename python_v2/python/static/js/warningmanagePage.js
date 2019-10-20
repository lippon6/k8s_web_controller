var warningmanageInformation;

var tableData = [];

function warningmanagePageDataPull()
{

    var warningmanageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorWarningManageAsk",
    
        },
    }
    sendMessage = warningmanageMessage;

    tableData[0] = {
        "serial": 5,
        "productContent":"拖拉机",
        "modelName":"01",
        "warningContent":"油压过高",
    }
}

//告警数据帧解析
function warningManageInformationParse(data){
    warningManageInformation = data.warningManageData;
    for(var i = 0; i < warningManageInformation.quantity; i++){
        tableData[i] = {
            "serial": warningManageInformation.serial[i],
            "productContent" : warningManageInformation.productContent[i],
            "modelName": warningManageInformation.modelName[i],
            "warningContent": warningManageInformation.warningContent[i]
        }
    }

    $('#warningmanageMsgTable').bootstrapTable('removeAll');
    $('#warningmanageMsgTable').bootstrapTable('append', tableData);

    if(warningManageInformation.editAuthority == 0){
        $('#warningmanageMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#warningmanageMsgAddBtn").hide();
    }
    
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="warningEditBtn btn btn-success">预警项目设置</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>'
    ].join('')
}


function warningmanageTableInit(){
    var $warningmanageTable = $('#warningmanageMsgTable');
    var $warningmanageTableRemoveBtn = $('#warningmanageTableRemove');

    $("#warningEditTable").hide();
    $("#warningManageTable").show();

    // 返回事件
    $("#warningManageTableReturn").click(function () {
        $("#warningEditTable").hide();
        $("#warningManageTable").show();
        manageEditwarningDataRemove();
    });

    // 移除事件
    $warningmanageTableRemoveBtn.click(function () {
        var ids = $.map($warningmanageTable.bootstrapTable('getSelections'), function (row) {
            return row.serial
        });
        $('#warningmanageMsgTable').bootstrapTable('remove', {
            field: 'serial',
            values: ids
        })
        manageRemove(ids);
    });

    // 添加数据
    $("#warningmanageMsgAddBtn").click(function () {
        manageAddWarning();
    });

    // 保存数据
    $("#warningManageSave").click(function () {
        warnignManageSave();
    });
    
    // 双击表格事件
    $('#warningmanageMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditWarningDataPush(row.serial, row.productContent, row.modelName, row.warningContent);
        manageEditWarning();
    });

    // 操作栏
    window.operateEvents = {
        'click .warningEditBtn': function (e, value, row, index) {
            manageEditWarningDataPush(row.serial,row.productContent, row.modelName, row.warningContent);
            manageEditWarning();
        },
        'click .remove': function (e, value, row, index) {
            $('#warningmanageMsgTable').bootstrapTable('remove', {
                field: 'serial',
                values: [row.serial]
            })
            manageRemove([row.serial]);
        }
    }

    //填充表格数据
    $(document).ready(function() {
        $('#warningmanageMsgTable').bootstrapTable('append', tableData);
    });
}


function manageRemove(id){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorWarningManageDelete",

        },
        "data":{
            "warningManageData":{
                "serial":id
            }
        }
    }

    doSend(msg);
}

//机型存储
function warnignManageSave(){
    //遍历输入框检查是否填写完全
    if(document.getElementById("serial").value == ""){
        alert("请填写编号！");
    }
    else if(document.getElementById("productContent").value == ""){
        alert("请填写产品目录！");
    }
    else if(document.getElementById("modelName").value == ""){
        alert("请填写机型名称");
    }
    else if(document.getElementById("warningContent").value == ""){
        alert("请填写预警项目");
    }

    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorWarningManageSave",

        },
        "data":{
            "warningManageData":{
                "serial": document.getElementById("serial").value,
                "productContent":document.getElementById("productContent").value,
                "modelName":document.getElementById("modelName").value,
                "warningContent":document.getElementById("warningContent").value,
            }
        }
    }
    
    doSend(msg);

    $("#warningEditTable").hide();
    $("#warningManageTable").show();

    //清空数据
    manageEditwarningDataRemove();
}

//清空表格
function manageEditwarningDataRemove(){
    document.getElementById("serial").value == "";
    document.getElementById("productContent").value = "";
    document.getElementById("modelName").value = "";
    document.getElementById("warningContent").value = "";
}

//增加事件
function manageAddWarning(){
    $("#warningManageTable").hide();
    $("#warningEditTable").show();
}

//编辑事件
function manageEditWarning(){
    $("#warningManageTable").hide();
    $("#warningEditTable").show();
}

//填充原有数据
function manageEditWarningDataPush(serial, product, name, warning){
    document.getElementById("serial").value = serial;
    document.getElementById("productContent").value = product;
    document.getElementById("modelName").value = name;
    document.getElementById("warningContent").value = warning;
}

//界面初始化
function warningmanagePageInit(){ 

    warningmanagePageDataPull(); 
    
    warningmanageTableInit();
    
}

window.addEventListener("load", warningmanagePageInit, false);  
