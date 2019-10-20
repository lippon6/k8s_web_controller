var serviceManageInformation;

var tableData = [];

var idArray = ["region", "serviceName", "serviceId", "type", "address", "contact", "phone", "useState"];
var titleArray = ["所在区域", "服务商名称", "服务商编码", "类型", "地址", "联系人", "联系电话", "状态"];

function serviceManagePageDataPull()
{
    var serviceManageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorServiceManageAsk",
    
        },
    }
    sendMessage = serviceManageMessage;

    tableData[0] = {
        "region":"四川",
        "serviceName":"01",
        "serviceId":"1",
        "type":"销售",
        "address":"成都市郫县拖拉机学校",
        "contact":"袁国良",
        "phone":"110",
        "useState":"启用",
    }
}

//告警数据帧解析
function serviceManageInformationParse(data){
    serviceManageInformation = data.serviceManageData;

    for(var i = 0; i < serviceManageInformation.quantity; i++){
        tableData[i] = {
            "region" : serviceManageInformation.region[i],
            "serviceName": serviceManageInformation.serviceName[i],
            "serviceId": serviceManageInformation.serviceId[i],
            "type": serviceManageInformation.type[i],
            "address": serviceManageInformation.address[i],
            "contact": serviceManageInformation.contact[i],
            "phone": serviceManageInformation.phone[i],
            "useState": serviceManageInformation.useState[i]
        }
    }

    $('#serviceManageMsgTable').bootstrapTable('removeAll');
    $('#serviceManageMsgTable').bootstrapTable('append', tableData);

    if(serviceManageInformation.editAuthority == 0){
        $('#serviceManageMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#serviceManageMsgAddBtn").hide();
    }
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="serviceEdit btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="manager btn btn-success">管理员</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>',
    ].join('')
}

//表格初始化
function serviceManageTableInit(){
    var $serviceManageTable = $('#serviceManageMsgTable');
    var $serviceManageTableRemoveBtn = $('#serviceManageTableRemove');

    $("#serviceEditTable").hide();
    $("#passwordEditTable").hide();
    $("#serviceManageTable").show();

    // 服务商信息返回事件
    $("#serviceManageTableReturn").click(function () {
        $("#serviceEditTable").hide();
        $("#serviceManageTable").show();
        manageEditServiceDataRemove();
    });

    // 服务商信息保存事件
    $("#serviceManageSave").click(function () {
        serviceMsgSave();
    });

    //管理员编辑返回
    $("#passwordManageTableReturn").click(function () {
        $("#passwordEditTable").hide();
        $("#serviceManageTable").show();
    });

    // 移除事件
    $serviceManageTableRemoveBtn.click(function () {
        var ids = $.map($serviceManageTable.bootstrapTable('getSelections'), function (row) {
            return row.serviceId
        });
        $('#serviceManageMsgTable').bootstrapTable('remove', {
            field: 'serviceId',
            values: ids
        });
        manageRemove(ids);
    });
    
    // 添加数据
    $("#serviceManageMsgAddBtn").click(function () {
        manageAddDService();
    });

    // 双击表格事件
    $('#serviceManageMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditService();
    });

    // 操作栏
    window.operateEvents = {
        'click .serviceEdit': function (e, value, row, index) {
            manageEditDeviceDataPush(row.serviceName)
            manageEditService();
        },
        'click .manager': function (e, value, row, index) {
            manageEditPassword();
        },
        'click .remove': function (e, value, row, index) {
            $('#serviceManageMsgTable').bootstrapTable('remove', {
                field: 'serviceId',
                values: [row.serviceId]
            });
            manageRemove([row.serviceId]);
        }
    }

    $(document).ready(function() {
        $('#serviceManageMsgTable').bootstrapTable('append', tableData);
    });
}

function manageRemove(id){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorServiceManageDelete",

        },
        "data":{
            "serviceManageData":{
                "serviceId":id
            }
        }
    }

    doSend(msg);
}

function manageAddDService(){
    $("#serviceManageTable").hide();
    $("#serviceEditTable").show();
}

function manageEditService(){
    $("#serviceManageTable").hide();
    $("#serviceEditTable").show();
}

//设备存储请求
function serviceMsgSave(){
    var msg;

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
            "cmdName": "tractorServiceManageSave",

        },
        "data":{
            "serviceManageData":{
                "region":document.getElementById("region").value,
                "serviceId":document.getElementById("serviceId").value,
                "serviceName":document.getElementById("serviceName").value,
                "type":document.getElementById("type").value,
                "address":document.getElementById("address").value,
                "contact":document.getElementById("contact").value,
                "phone":document.getElementById("phone").value,
                "useState":document.getElementById("useState").value
            }
        }
    }
    
    

    doSend(msg);

    console.log(JSON.stringify(msg));

    //返回表格
    $("#serviceManageTable").show();
    $("#serviceEditTable").hide();
    manageEditServiceDataRemove();
}

//清空表格
function manageEditServiceDataRemove(){
    for(var i = 0; i < idArray.length; i++){
        document.getElementById(idArray[i]).value = "";
    }
}

//填充原有数据
function manageEditDeviceDataPush(name){
    var i;
    var index = 0;
    
    //计算id位置所在的数据
    for(i = 0; i < serviceManageInformation.quantity; i++){
        if(name == serviceManageInformation.serviceName[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in serviceManageInformation){
        index++;
        //第一个数据为quantity，因此跳过
        if(index == 1){
            continue;
        }
        document.getElementById(idArray[index - 2]).value = serviceManageInformation[x][i];
    }
}

function manageEditPassword(){
    $("#serviceManageTable").hide();
    $("#passwordEditTable").show();
}

function passwrodMsgSave(){
    console.log(233);
}

function serviceManagePageInit(){ 

    serviceManagePageDataPull(); 
    
    serviceManageTableInit();
    
}

window.addEventListener("load", serviceManagePageInit, false);  
