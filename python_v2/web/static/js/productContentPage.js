var productContentInformation;

var tableData = [];

function productContentPageDataPull()
{

    var productContentMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorProductContentAsk",
    
        },
    }
    sendMessage = productContentMessage;

    tableData[0] = {
        "productName":"拖拉机",
        "id":"01",
    }

    console.log(233);
}

//告警数据帧解析
function productContentInformationParse(data){
    productContentInformation = data.productContentData;

    for(var i = 0; i < productContentInformation.quantity; i++){
        tableData[i] = {
            "productName":productContentInformation.productName[i],
            "id":productContentInformation.id[i]
        }
    }

    //删除原有数据
    $('#productContentMsgTable').bootstrapTable('removeAll');
    //填充新的数据
    $('#productContentMsgTable').bootstrapTable('append', tableData);

    if(productContentInformation.editAuthority == 0){
        $('#productContentMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#productContentMsgAddBtn").hide();
    }

}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="contentEdit btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>'
    ].join('')
}

function productContentTableInit(){
    var $productContentTable = $('#productContentMsgTable');
    var $productContentTableRemoveBtn = $('#productContentTableRemove');

    $("#productContentTable").show();
    $("#productContentEdit").hide();

    // 返回事件
    $("#productContentTableReturn").click(function () {
        $("#productContentTable").show();
        $("#productContentEdit").hide();
        document.getElementById("productName").value = "";
        document.getElementById("id").value = "";
    });

    // 存储事件
    $("#productContentSaveBtn").click(function () {
        productContentSave();
    });

    // 移除事件
    $productContentTableRemoveBtn.click(function () {
        var ids = $.map($productContentTable.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
        $('#productContentMsgTable').bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
        manageRemove(ids);
    });
    
    // 添加数据
    $("#productContentMsgAddBtn").click(function () {
        manageAddContent();
    });

    // 双击表格事件
    $('#productContentMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditDevice();
    });

    // 操作栏
    window.operateEvents = {
        'click .contentEdit': function (e, value, row, index) {
            manageEditDevice(row.id, row.productName);
        },
        'click .remove': function (e, value, row, index) {
            $('#productContentMsgTable').bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            })
            manageRemove([row.id]);
        }
    }

    //填充数据
    $(document).ready(function() {
        $('#productContentMsgTable').bootstrapTable('append', tableData);
    });
}

function manageRemove(id){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorProductContentDelete",

        },
        "data":{
            "productContentData":{
                "id":id
            }
        }
    }

    doSend(msg);
}

function productContentSave(){
    if(document.getElementById("productName").value == ""){
        alert("请填写产品目录名称！");
        return;
    }
    else if(document.getElementById("id").value == ""){
        alert("请填写编码！");
        return;
    }

    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorProductContentSave",

        },
        "data":{
            "productContentData":{
               "productName": document.getElementById("productName").value,
               "id": document.getElementById("id").value
            }
        }
    }

    doSend(msg);

    console.log(JSON.stringify(msg));

    //返回表格
    $("#productContentTable").show();
    $("#productContentEdit").hide();

    document.getElementById("productName").value = "";
    document.getElementById("id").value = "";
}

function manageAddContent(){
    $("#productContentTable").hide();
    $("#productContentEdit").show();
}

function manageEditDevice(id, name){
    //添加原有数据
    document.getElementById("id").value = id;
    document.getElementById("productName").value = name;

    $("#productContentTable").hide();
    $("#productContentEdit").show(); 
}

function productContentPageInit(){ 

    productContentPageDataPull(); 
    
    productContentTableInit();
    
}

window.addEventListener("load", productContentPageInit, false);  
