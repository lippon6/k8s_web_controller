var userManagePageInformation;

var tableData = [];

var idArray = ["serialNum", "userName", "userRealName", "department", "role", "useState"];

var titleArray = ["编号", "用户名", "姓名", "部门", "所属角色", "状态"];

function userManagePageDataPull()
{

    var userManagePageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorUserManageAsk",
    
        },
    }
    sendMessage = userManagePageMessage;

    tableData[0] = {
        "serialNum":"01",
        "userName":"yuan",
        "userRealName":"袁国良",
        "department":"西华",
        "role":"佣兵",
        "useState":"启用",
    }
}

//告警数据帧解析
function userManageInformationParse(data){
    userManagePageInformation = data.userManageData;

    for(var i = 0; i < userManagePageInformation.quantity; i++){
        tableData[i] = {
            "serialNum" : userManagePageInformation.serialNum[i],
            "userName": userManagePageInformation.userName[i],
            "userRealName": userManagePageInformation.userRealName[i],
            "department": userManagePageInformation.department[i],
            "role": userManagePageInformation.role[i],
            "useState": userManagePageInformation.useState[i]
        }
    }

    $('#userManagePageMsgTable').bootstrapTable('removeAll');
    $('#userManagePageMsgTable').bootstrapTable('append', tableData);

    if(userManagePageInformation.editAuthority == 0){
        $('#userManagePageMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#userManageMsgAddBtn").hide();
    }
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="userMsgEdit btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>',
    ].join('')
}


function userManagePageTableInit(){
    var $userManagePageTable = $('#userManagePageMsgTable');
    var $userManagePageTableRemoveBtn = $('#userManagePageTableRemove');

    $("#userManagePageTable").show();
    $("#userManageEdit").hide();

    // 返回事件
    $("#userManageTableReturn").click(function () {
        $("#userManagePageTable").show();
        $("#userManageEdit").hide();
        manageEditDeviceDataRemove();
    });

    //保存事件
    $("#userManageSave").click(function () {
        userMsgSave();
    });

    // 移除事件
    $userManagePageTableRemoveBtn.click(function () {
        var ids = $.map($userManagePageTable.bootstrapTable('getSelections'), function (row) {
            return row.userName
        });
        $('#userManagePageMsgTable').bootstrapTable('remove', {
            field: 'userName',
            values: ids
        })
        manageRemove(ids);
    });
    
    // 添加数据
    $("#userManagePageMsgAddBtn").click(function () {
        manageAddUser();
    });

    // 双击表格事件
    $('#userManagePageMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditUser(row.userName);
    });

    // 操作栏
    window.operateEvents = {
        'click .userMsgEdit': function (e, value, row, index) {
            manageEditUser(row.userName);
        },
        'click .remove': function (e, value, row, index) {
            $('#userManagePageMsgTable').bootstrapTable('remove', {
                field: 'userName',
                values: [row.userName]
            });
            manageRemove([row.userName]);
        }
    }

    $(document).ready(function() {
        $('#userManagePageMsgTable').bootstrapTable('append', tableData);
    });
}

function manageRemove(id){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorUserManageDelete",

        },
        "data":{
            "userManageData":{
                "userName":id
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
    for(i = 0; i < userManagePageInformation.quantity; i++){
        if(id == userManagePageInformation.userName[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in userManagePageInformation){
        index++;
        //第一个数据为quantity，因此跳过
        if(index == 1){
            continue;
        }
        document.getElementById(idArray[index - 2]).value = userManagePageInformation[x][i];
    }
}

//增加用户
function manageAddUser(){
    $("#userManagePageTable").hide();
    $("#userManageEdit").show();
}

//用户信息编辑
function manageEditUser(userName){
    manageEditDeviceDataPush(userName);
    $("#userManagePageTable").hide();
    $("#userManageEdit").show();
}

function userMsgSave(){
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
            "cmdName": "tractorUserManageSave",

        },
        "data":{
            "userManageData":{
                "serialNum":document.getElementById("serialNum").value,
                "userName":document.getElementById("userName").value,
                "userRealName":document.getElementById("userRealName").value,
                "department":document.getElementById("department").value,
                "role":document.getElementById("role").value,
                "useState":document.getElementById("useState").value,
            }
        }
    }

    doSend(msg);

    console.log(JSON.stringify(msg));

    //返回表格
    $("#userManagePageTable").show();
    $("#userManageEdit").hide();

    //清空表格
    manageEditDeviceDataRemove();
}

function userManagePageInit(){ 

    userManagePageDataPull(); 
    
    userManagePageTableInit();
    
}

window.addEventListener("load", userManagePageInit, false);  
