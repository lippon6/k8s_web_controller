var roleManagePageInformation;

var tableData = [];

var idArray = ["serialNum", "name", "useState"];

var titleArray = ["编号", "角色名称", "状态"];


function roleManagePageDataPull()
{

    var roleManagePageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorRoleManageAsk",
    
        },
    }
    sendMessage = roleManagePageMessage;

    tableData[0] = {
        "serialNum":"01",
        "name":"01",
        "useState":"启用",
    }
}

//告警数据帧解析
function roleManageInformationParse(data){
    roleManagePageInformation = data.roleManageData;

    for(var i = 0; i < roleManagePageInformation.quantity; i++){
        tableData[i] = {
            "serialNum" : roleManagePageInformation.serialNum[i],
            "name": roleManagePageInformation.name[i],
            "useState": roleManagePageInformation.useState[i]
        }
    }

    $('#roleManagePageMsgTable').bootstrapTable('removeAll'); 
    $('#roleManagePageMsgTable').bootstrapTable('append', tableData); 

    if(roleManagePageInformation.editAuthority == 0){
        $('#roleManagePageMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#roleManagePageMsgAddBtn").hide();
    }
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="roleEditBtn btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>',
    ].join('')
}


function roleManagePageTableInit(){
    var $roleManagePageTable = $('#roleManagePageMsgTable');
    var $roleManagePageTableRemoveBtn = $('#roleManagePageTableRemove');

    $("#roleManagePageTable").show();
    $("#roleManageEdit").hide();

    // 返回事件
    $("#roleManageTableReturn").click(function () {
        $("#roleManagePageTable").show();
        $("#roleManageEdit").hide();
        manageEditDeviceDataRemove();
    });

    // 移除事件
    $roleManagePageTableRemoveBtn.click(function () {
        var ids = $.map($roleManagePageTable.bootstrapTable('getSelections'), function (row) {
            return row.serialNum
        });
        $('#roleManagePageMsgTable').bootstrapTable('remove', {
            field: 'serialNum',
            values: ids
        });
        manageRemove(ids);
    });
    
    // 添加数据
    $("#roleManagePageMsgAddBtn").click(function () {
        manageAddRole();
    });

    // 保存数据
    $("#roleManageSave").click(function () {
        roleMsgSave();
    });

    // 双击表格事件
    $('#roleManagePageMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditRole(row.serialNum);
    });

    // 操作栏
    window.operateEvents = {
        'click .roleEditBtn': function (e, value, row, index) {
            manageEditRole(row.serialNum);
        },
        'click .remove': function (e, value, row, index) {
            $('#roleManagePageMsgTable').bootstrapTable('remove', {
                field: 'serialNum',
                values: [row.serialNum]
            })
            manageRemove([row.serialNum])
        }
    }

    //填充现有数据
    $(document).ready(function() {
        $('#roleManagePageMsgTable').bootstrapTable('append', tableData);
    });
}

function manageAddRole(){
    $("#roleManagePageTable").hide();
    $("#roleManageEdit").show();
}

function manageEditRole(id){
    manageEditDeviceDataPush(id);
    $("#roleManagePageTable").hide();
    $("#roleManageEdit").show();
}

function roleMsgSave(){
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
            "cmdName": "tractorRoleManageSave",

        },
        "data":{
            "roleManageData":{
                "serialNum":document.getElementById("serialNum").value,
                "name":document.getElementById("name").value,
                "useState":document.getElementById("useState").value,
            }
        }
    }

    doSend(msg);

    console.log(JSON.stringify(msg));

    //返回表格
    $("#roleManagePageTable").show();
    $("#roleManageEdit").hide();

    manageEditDeviceDataRemove();
}

function manageRemove(id){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorRoleManageDelete",

        },
        "data":{
            "roleManageData":{
                "serialNum":id
            }
        }
    }

    doSend(msg);
}


//清空表格
function manageEditDeviceDataRemove(){
    for(var i = 0; i < idArray.length; i++){
        document.getElementById(idArray[i]).value = "";
    }
}

//填充原有数据
function manageEditDeviceDataPush(id){
    var i;
    var index = 0;
    
    //计算id位置所在的数据
    for(i = 0; i < roleManagePageInformation.quantity; i++){
        if(id == roleManagePageInformation.serialNum[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in roleManagePageInformation){
        index++;
        //第一个数据为quantity，因此跳过
        if(index == 1){
            continue;
        }
        document.getElementById(idArray[index - 2]).value = roleManagePageInformation[x][i];
    }
}

function roleManagePageInit(){ 

    roleManagePageDataPull(); 
    
    roleManagePageTableInit();
    
}

window.addEventListener("load", roleManagePageInit, false);  
