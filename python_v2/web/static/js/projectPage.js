// 全局信息
var projectInformation;
// 表格数据
var projectTable = [];

// 编辑界面文本ID
var idArray = ["projectID", "projectName", "projectStatus", "projectUser"];


projectTable[0] = {
    "id":"01",
    "name":"test1",
    "status":"启用",
    "user":"lippon"
}

function projectTableInit(){
    var $projectTable = $('#projectTable');
    var $projectTableRemoveBtn = $('#projectTableRemoveBtn');

    $("#projectManageTable").show();
    $("#projectTableEdit").hide();

    // 移除事件
    $projectTableRemoveBtn.click(function () {
        var ids = $.map($projectTable.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
        $('#projectTable').bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
    });

    // 操作栏
    window.operateEvents = {
        'click .edit': function (e, value, row, index) {
            dataEdit(row.id);
        },
        'click .remove': function (e, value, row, index) {
            $('#projectTable').bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            });
            dataRemove([row.userName]);
        }
    }

    $(document).ready(function() {
        $('#projectTable').bootstrapTable('append', projectTable);
    });

    // 添加数据
    $("#projectTableAddBtn").click(function () {
        manageAddProject();
    });

    // 返回事件
    $("#projectReturn").click(function () {
        $("#projectManageTable").show();
        $("#projectTableEdit").hide();
        manageEditDeviceDataRemove();
    });

    //保存事件
    $("#projectSave").click(function () {
        projectMsgSave();
    });

}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="edit btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>',
    ].join('')
}

function tableInformationTrans(){
    for(var i = 0; i < projectInformation.workMonthId.length; i++){
        projectTable[i] = {
            'id': projectInformation.id[i],
            'name':projectInformation.user[i],
            'status': projectInformation.status[i],
            'user': projectInformation.workMonthRegion[i]
        }
    }

    projectTableInit();
}



//增加数据
function manageAddProject(){
    $("#projectManageTable").hide();
    $("#projectTableEdit").show();
}


function projectMsgSave(){
    //遍历输入框检查是否填写完全
    for(var i = 0; i < idArray.length; i++){
        if(document.getElementById(idArray[i]).value == ""){
            alert("请填写" + titleArray[i] + "!");
            return;
        }
    }

    // msg = {
    //     "abstract":{
    //         "senderType": "receiver",
    //         "msgType": "cmd",
    //         "cmdName": "tractorUserManageSave",

    //     },
    //     "data":{
    //         "userManageData":{
    //             "serialNum":document.getElementById("serialNum").value,
    //             "userName":document.getElementById("userName").value,
    //             "userRealName":document.getElementById("userRealName").value,
    //             "department":document.getElementById("department").value,
    //             "role":document.getElementById("role").value,
    //             "useState":document.getElementById("useState").value,
    //         }
    //     }
    // }

    // doSend(msg);

    // console.log(JSON.stringify(msg));

    //返回表格
    $("#projectManageTable").show();
    $("#projectTableEdit").hide();

    //清空表格
    manageEditDeviceDataRemove();
}


//清空表格
function manageEditDeviceDataRemove(){
    for(var i = 0; i < idArray.length; i++){
        document.getElementById(idArray[i]).value = "";
    }
}

//数据删除
function manageRemove(id){

}

//填充原有数据
function manageEditDataPush(id){

}

//信息编辑
function dataEdit(id){
    manageEditDataPush(id);
    $("#projectManageTable").hide();
    $("#projectTableEdit").show();
}

//数据解析
function projectInformationParse(data){
    projectInformation = data.projectData;

    tableInformationTrans();

    projectDistrubeBarInit();

}

//后端数据获取
function projectPageDataPull(){
    //采用post方法向后端请求数据
    $.ajax({
        type: 'POST',
        url: '/login',
        data: data,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if(data.data == "login ok"){
                window.location.href="index.html"
            }
            else{
                alert("验证信息错误！");
            }	
        },
        error: function(xhr, type) {
            console.log('错误')
        }
    });

    projectTable[0] = {
        "projectID":"01",
        "projectName":"test1",
        "projectStatus":"启用",
        "projectUser":"lippon"
    }
}

//界面初始化
function projectPageInit()
{
    //表格初始化
    projectTableInit();

    //数据拉取
    projectPageDataPull();
}


window.addEventListener("load", projectPageInit, false);  

