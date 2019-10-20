var departmentManagePageInformation;

var tableData = [];

var idArray = ["serial", "name", "useState"];

var titleArray = ["编号", "名称", "状态"];

function departmentManagePageDataPull()
{

    var departmentManagePageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorDepartmentManageAsk",
    
        },
    }
    sendMessage = departmentManagePageMessage;

    tableData[0] = {
        "serial": 22,
        "name":"01",
        "useState":"启用",
    }
}

//告警数据帧解析
function departmentManageInformationParse(data){
    departmentManagePageInformation = data.departmentManageData;

    for(var i = 0; i < departmentManagePageInformation.quantity; i++){
        tableData[i] = {
            "serial": departmentManagePageInformation.serial[i],
            "name" : departmentManagePageInformation.name[i],
            "useState": departmentManagePageInformation.useState[i],
        }
    }


    $('#departmentManagePageMsgTable').bootstrapTable('removeAll');
    $('#departmentManagePageMsgTable').bootstrapTable('append', tableData);

    if(departmentManagePageInformation.editAuthority == 0){
        $('#departmentManagePageMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#departmentManagePageMsgAddBtn").hide();
    }

}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="departmentEditBtn btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>',
    ].join('')
}

function departmentManagePageTableInit(){
    var $departmentManagePageTable = $('#departmentManagePageMsgTable');
    var $departmentManagePageTableRemoveBtn = $('#departmentManagePageTableRemove');

    $("#departmentManagePageTable").show();
    $("#departmentManageEdit").hide();

    // 返回事件
    $("#departmentManageTableReturn").click(function () {
        $("#departmentManagePageTable").show();
        $("#departmentManageEdit").hide();
        manageEditDeviceDataRemove();
    });

    // 移除事件
    $departmentManagePageTableRemoveBtn.click(function () {
        var ids = $.map($departmentManagePageTable.bootstrapTable('getSelections'), function (row) {
            return row.serial
        });
        $('#departmentManagePageMsgTable').bootstrapTable('remove', {
            field: 'serial',
            values: ids
        })
        manageRemove(ids)
    });

    // 添加数据
    $("#departmentManagePageMsgAddBtn").click(function () {
        manageAddDepartment();
    });

    //存储事件
    $("#departmentManageSave").click(function () {
        departmentMsgSave();
    });

    // 双击表格事件
    $('#departmentManagePageMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditDepartment(row.serial);
    });

    // 操作栏
    window.operateEvents = {
        'click .departmentEditBtn': function (e, value, row, index) {
            manageEditDepartment(row.serial);
        },
        'click .remove': function (e, value, row, index) {
            $('#departmentManagePageMsgTable').bootstrapTable('remove', {
                field: 'serial',
                values: [row.serial]
            });
            manageRemove([row.serial]);
        }
    }

    //数据填充
    $(document).ready(function() {
        $('#departmentManagePageMsgTable').bootstrapTable('append', tableData);
    });
}

function manageRemove(id){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorDepartmentManageDelete",

        },
        "data":{
            "departmentManageData":{
                "serial":id
            }
        }
    }

    doSend(msg);
}

function manageAddDepartment(){
    $("#departmentManagePageTable").hide();
    $("#departmentManageEdit").show();
}

function manageEditDepartment(serial){
    manageEditDeviceDataPush(serial);
    $("#departmentManagePageTable").hide();
    $("#departmentManageEdit").show();
}

function departmentMsgSave(){
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
            "cmdName": "tractorDepartmentManageSave",

        },
        "data":{
            "departmentManageData":{
                "serial":document.getElementById("serial").value,
                "name":document.getElementById("name").value,
                "useState":document.getElementById("useState").value,
            }
        }
    }

    doSend(msg);

    console.log(JSON.stringify(msg));

    //返回表格
    $("#departmentManagePageTable").show();
    $("#departmentManageEdit").hide();

    manageEditDeviceDataRemove();
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
    for(i = 0; i < departmentManagePageInformation.quantity; i++){
        if(id == departmentManagePageInformation.serial[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in departmentManagePageInformation){
        index++;
        //第一个数据为quantity，因此跳过
        if(index == 1){
            continue;
        }
        document.getElementById(idArray[index - 2]).value = departmentManagePageInformation[x][i];
    }
}

function departmentManagePageInit(){ 

    departmentManagePageDataPull(); 
    
    departmentManagePageTableInit();
    
}

window.addEventListener("load", departmentManagePageInit, false);  
