var warningInformation;

var tableData = [];

function warningPageDataPull()
{

    var warningMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorWarningAsk",
    
        },
    }
    sendMessage = warningMessage;

    
    tableData[0] = {
        "serial" : 0,
        "time": 201902,
        "id": 25,
        "level": 5,
        "title": 233
    };
    


}

//告警数据帧解析
function warningInformationParse(data){
    warningInformation = data.warningData;

    for(var i = 0; i < warningInformation.quantity; i++){
        tableData[i] = {
            "serial" : warningInformation.serial[i],
            "time": warningInformation.time[i],
            "id": warningInformation.id[i],
            "level": warningInformation.level[i],
            "title": warningInformation.title[i],
            "model": warningInformation.model[i],
            "brand": warningInformation.brand[i],
            "producer": warningInformation.producer[i]
            
        }
    }

    $('#warningMsgTable').bootstrapTable('removeAll');
    warningTableInit();   
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="look btn btn-success">看</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>'
    ].join('')
}

// 表格解析函数
function msg_talbe_parser(row) {
    var i;

    for(i = 0; i < warningInformation.quantity; i++){
        if(row.serial == warningInformation.serial[i]){
            break;
        }
    }

    $("#warningContent").show();
    $("#warningMsgContent").hide();
    $("#warningTableReturn").show();
    var content = document.getElementById("warningContent"); 

    content.innerHTML = "<p>"+ warningInformation.content[i] +"<p/>";    
}

function warningTableInit(){
    var $warningTable = $('#warningMsgTable');
    var $warningTableRemoveBtn = $('#warningTableRemove');

    $("#warningTableReturn").hide();
    $("#warningContent").hide();

    // 返回事件
    $("#warningTableReturn").click(function () {
        $("#warningMsgContent").show();
        $("#warningTableReturn").hide();
        $("#warningContent").hide();
    });

    // 移除事件
    $warningTableRemoveBtn.click(function () {
        var ids = $.map($warningTable.bootstrapTable('getSelections'), function (row) {
            return row.serial
        });
        $('#warningMsgTable').bootstrapTable('remove', {
            field: 'serial',
            values: ids
        })
    });

    // 添加数据
    $("#warningMsgAddBtn").click(function () {
    });

    // 双击表格事件
    $('#warningMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        msg_talbe_parser(row);
    });

    // 操作栏
    window.operateEvents = {
        'click .look': function (e, value, row, index) {
            msg_talbe_parser(row);
        },
        'click .remove': function (e, value, row, index) {
            $('#warningMsgTable').bootstrapTable('remove', {
                field: 'serial',
                values: [row.serial]
            })
        }
    }

    //数据填充
    $(document).ready(function() {
        $('#warningMsgTable').bootstrapTable('append', tableData);
    });
}

function serialSearch(id){
    var data = document.getElementById(id).value;

    if(data == ""){
        $('#warningMsgTable').bootstrapTable('filterBy');
    }
    else{
        var str = "$('#warningMsgTable').bootstrapTable('filterBy', {serial: " + data + "})";

        eval(str);
    }
}

function timeSearch(id){
    var data = document.getElementById(id).value;

    if(data == ""){
        $('#warningMsgTable').bootstrapTable('filterBy');
    }
    else{
        var str = "$('#warningMsgTable').bootstrapTable('filterBy', {time: " + data + "})";

        eval(str);
    }
}

function idSearch(id){
    var data = document.getElementById(id).value;

    if(data == ""){
        $('#warningMsgTable').bootstrapTable('filterBy');
    }
    else{
        var str = "$('#warningMsgTable').bootstrapTable('filterBy', {id: " + data + "})";

        eval(str);
    }
}

function tableSearch(id, type){
    var data = document.getElementById(id).value;

    if(data == ""){
        $('#warningMsgTable').bootstrapTable('filterBy');
    }
    else{
        var str = "$('#warningMsgTable').bootstrapTable('filterBy', {" + type + ": '" + data + "'})";

        eval(str);
    }
}

function warningPageInit(){ 

    warningPageDataPull();  

    warningTableInit();
    
}

window.addEventListener("load", warningPageInit, false);  
