var deviceManageInformation;
var addModel = "single";

var tableData = [];

var idArray = ["productContent", "model", "engineModel", "frameNum", 
    "productDate", "purchaseDate", "threeGuaranteeDate", "id", "installWay", "distributor",
    "userName", "region", "phone", "address", "qq", "wechat", "brand", "provinceName",
    "provinceZoom", "provinceID", "provinceLongitude", "provinceLatitude", "cityName",
    "cityID", "cityZoom", "cityLongitude", "cityLatitude", "longitude", "latitude",
    "servicer", "producer", "productID"];

var titleArray  = ["产品目录", "机型", "发动机型号", "车架号", "出厂日期", "购买日期",
    "三包日期", "终端编号", "安装方式", "经销商", "用户名称", "所在地区", "手机", "地址", "QQ",
    "微信", "品牌", "省份名称", "省份大小", "省份编号", "省会经度", "省会纬度", "城市名称", "城市大小", 
    "城市编号", "城市经度", "城市纬度", "所在地经度", "所在地纬度", "服务商", "生产厂家", "出厂编号"
];

var idArrayBulkAdd = ["productContent", "model", "productIDSmall", "productIDLarge", "engineModel", "frameNum", 
    "productDate", "purchaseDate", "threeGuaranteeDate", "idSmall", "idLarge", "installWay", "distributor",
    "userName", "region", "phone", "address", "qq", "wechat", "brand", "provinceName",
    "provinceZoom", "provinceID", "provinceLongitude", "provinceLatitude", "cityName",
    "cityID", "cityZoom", "cityLongitude", "cityLatitude", "longitude", "latitude",
    "servicer", "producer"];

var titleArrayBulkAdd  = ["产品目录", "机型", "出厂起始编号", "出厂终止编号", "发动机型号", "车架号", "出厂日期", "购买日期",
    "三包日期", "终端起始编号", "终端终止编号", "安装方式", "经销商", "用户名称", "所在地区", "手机", "地址", "QQ",
    "微信", "品牌", "省份名称", "省份大小", "省份编号", "省会经度", "省会纬度", "城市名称", "城市大小", 
    "城市编号", "城市经度", "城市纬度", "所在地经度", "所在地纬度", "服务商", "生产厂家"
];

//页面数据下拉请求
function deviceManagePageDataPull()
{

    var deviceManageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorDeviceManageAsk",
    
        }
    }
    sendMessage = deviceManageMessage;

    tableData[0] = {
        "productContent":"拖拉机",
        "model":"天龙",
        "id":"110",
        "userName":"袁国良",
        "phone":"119",
        "region":"西华",
        "purchaseDate":"20180206",
        "brand":"东风",
        "producer":"一汽",
        "distributor":"川龙"
    }

}

//告警数据帧解析
function deviceManageInformationParse(data){
    deviceManageInformation = data.deviceManageData;

    //提取表格所需数据
    for(var i = 0; i < deviceManageInformation.quantity; i++){
        tableData[i] = {
            "productContent" : deviceManageInformation.productContent[i],
            "model": deviceManageInformation.model[i],
            "id": deviceManageInformation.id[i],
            "userName": deviceManageInformation.userName[i],
            "phone": deviceManageInformation.phone[i],
            "region": deviceManageInformation.region[i],
            "purchaseDate": deviceManageInformation.purchaseDate[i],
            "brand": deviceManageInformation.brand[i],
            "producer": deviceManageInformation.producer[i],
            "distributor": deviceManageInformation.distributor[i],
        }
    }

    //删除原有数据
    $('#deviceManageMsgTable').bootstrapTable('removeAll');
    //填充新的数据
    $('#deviceManageMsgTable').bootstrapTable('append', tableData);

    if(deviceManageInformation.editAuthority == 0){
        $('#deviceManageMsgTable').bootstrapTable('hideColumn', 'operate');
        $("#deviceManageMsgAddBtn").hide();
    }
}


// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="edit btn btn-success">编辑</button>',
        '<span style="width:150px; color:#ccc;background-color:#ccc;">_____</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>'
    ].join('')
}

//表格初始化
function deviceManageTableInit(){
    var $deviceManageTable = $('#deviceManageMsgTable');
    var $deviceManageTableRemoveBtn = $('#deviceManageTableRemove');

    //单个添加
    $("#singlePushForm").show();
    $("#singlePushButton").show();
    $("#bulkPushForm").hide();

    //初始化表格显隐
    $("#deviceManageTable").show();
    $("#deviceEdit").hide();

    // 返回事件绑定
    $("#deviceManageTableReturn").click(function () {
        $("#deviceManageTable").show();
        $("#deviceEdit").hide();
    });

    //批量移除事件绑定
    $deviceManageTableRemoveBtn.click(function () {
        var ids = $.map($deviceManageTable.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
        $('#deviceManageMsgTable').bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
        manageRemoveDevice(ids)
    });

    
    //新增数据事件绑定
    $("#deviceManageMsgAddBtn").click(function () {
        manageAddDevice();
    });

    //双击表格事件绑定
    $('#deviceManageMsgTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        manageEditDevice(row.id);
    });

    // 操作栏事件绑定
    window.operateEvents = {
        //编辑事件
        'click .edit': function (e, value, row, index) {
            manageEditDevice(row.id);
        },
        //移除事件
        'click .remove': function (e, value, row, index) {
            $('#deviceManageMsgTable').bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            })
            manageRemoveDevice([row.id]);
        }
    }
    
    //添加已有数据
    $(document).ready(function() {
        $('#deviceManageMsgTable').bootstrapTable('append', tableData);
    });
}

function checkFile(val){ 
    var extend =  getFileExtendingName(val);
    if(extend == ".xlsx" || extend == ".xls"){

    }
    else
    {
        alert("请提交以xlsx或xls后缀的excel表格!");
        document.getElementById("fileInput").value = "";
    }
}

function getFileExtendingName(filename) {
    // 文件扩展名匹配正则
    var reg = /\.[^\.]+$/;
    var matches = reg.exec(filename);
    if (matches) {
      return matches[0];
    }
    return '';
  }

function manageRemoveDevice(id){
    msg = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorDeviceManageDelete",

        },
        "data":{
            "deviceManageData":{
                "id":id,
            }
        }
    }

    doSend(msg);
}

//添加设备
function manageAddDevice(){
    addModel = "single";
    document.getElementById("addModelChangeBtn").innerHTML = "批量添加";
    //改为单一提交
    singleAddStyleChange();
    //清空表格
    manageEditDeviceDataRemove();

    $("#addModelChangeBtnFather").show();
    $("#deviceManageTable").hide();
    $("#deviceEdit").show();
}

//编辑设备
function manageEditDevice(id){
    //改为单一提交
    singleAddStyleChange();
    //填空原有数据
    manageEditDeviceDataPush(id);
    $("#addModelChangeBtnFather").hide();
    $("#deviceManageTable").hide();
    $("#deviceEdit").show();

}

//批量添加事件
function addModelChange(){

    if(addModel == "single"){
        document.getElementById("addModelChangeBtn").innerHTML = "单个添加";
        addModel = "bulk";
        
        bulkAddStyleChange();
    }
    else if(addModel == "bulk"){
        document.getElementById("addModelChangeBtn").innerHTML = "批量添加";
        addModel = "single";

        singleAddStyleChange();
    }
}

//单个添加表单
function singleAddStyleChange(){
    $("#singlePushButton").show();
    $("#singlePushForm").show();
    $("#bulkPushForm").hide();
}

//批量添加表单
function bulkAddStyleChange(){
    $("#singlePushButton").hide();
    $("#singlePushForm").hide();
    $("#bulkPushForm").show();

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
    for(i = 0; i < deviceManageInformation.quantity; i++){
        if(id == deviceManageInformation.id[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in deviceManageInformation){
        index++;
        //第一个数据为quantity，因此跳过
        if(index == 1){
            continue;
        }
        document.getElementById(idArray[index - 2]).value = deviceManageInformation[x][i];
    }
}

//设备存储请求
function deviceMsgSave(){
    var msg;

    if(addModel == "single"){
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
                "cmdName": "tractorDeviceManageSave",

            },
            "data":{
                "deviceManageAddmodel":"single",
                "deviceManageData":{
                    "productContent":document.getElementById("productContent").value,
                    "model":document.getElementById("model").value,
                    "productID":document.getElementById("productID").value,
                    "engineModel":document.getElementById("engineModel").value,
                    "frameNum":document.getElementById("frameNum").value,
                    "productDate":document.getElementById("productDate").value,
                    "purchaseDate":document.getElementById("purchaseDate").value,
                    "threeGuaranteeDate":document.getElementById("threeGuaranteeDate").value,
                    "id":document.getElementById("id").value,
                    "installWay":document.getElementById("installWay").value,
                    "distributor":document.getElementById("distributor").value,
                    "userName":document.getElementById("userName").value,
                    "region":document.getElementById("region").value,
                    "phone":document.getElementById("phone").value,
                    "address":document.getElementById("address").value,
                    "qq":document.getElementById("qq").value,
                    "wechat":document.getElementById("wechat").value,
                    "brand":document.getElementById("brand").value,
                    "provinceName":document.getElementById("provinceName").value,
                    "provinceZoom":document.getElementById("provinceZoom").value,
                    "provinceID":document.getElementById("provinceID").value,
                    "provinceLongitude":document.getElementById("provinceLongitude").value,
                    "provinceLatitude":document.getElementById("provinceLatitude").value,
                    "cityName":document.getElementById("cityName").value,
                    "cityZoom":document.getElementById("cityZoom").value,
                    "cityID":document.getElementById("cityID").value,
                    "cityLongitude":document.getElementById("cityLongitude").value,
                    "cityLatitude":document.getElementById("cityLatitude").value,
                    "longitude":document.getElementById("longitude").value,
                    "latitude":document.getElementById("latitude").value,
                    "servicer":document.getElementById("servicer").value,
                    "producer":document.getElementById("producer").value
                }
            }
        }
    }
    else if(addModel == "bulk"){
        //遍历输入框检查是否填写完全
        for(var i = 0; i < idArrayBulkAdd.length; i++){
            if(document.getElementById(idArrayBulkAdd[i]).value == ""){
                console.log(document.getElementById(idArrayBulkAdd[i]).value);
                alert("请填写" + titleArrayBulkAdd[i] + "!");
                return;
            }
        }

        if(document.getElementById("idLarge").value > document.getElementById("idSmall").value){
            if(document.getElementById("productIDLarge").value > document.getElementById("productIDSmall").value){
                alert("出厂编号填写有误！");
            }
        }
        else{
            alert("终端编号填写有误！");
        }

        msg = {
            "abstract":{
                "senderType": "receiver",
                "msgType": "cmd",
                "cmdName": "tractorDeviceManageSave",

            },
            "data":{
                "deviceManageAddmodel":"bulk",
                "deviceManageData":{
                    "productContent":document.getElementById("productContent").value,
                    "model":document.getElementById("model").value,
                    "productIDSmall":document.getElementById("productIDSmall").value,
                    "productIDLarge":document.getElementById("productIDLarge").value,
                    "engineModel":document.getElementById("engineModel").value,
                    "frameNum":document.getElementById("frameNum").value,
                    "productDate":document.getElementById("productDate").value,
                    "purchaseDate":document.getElementById("purchaseDate").value,
                    "threeGuaranteeDate":document.getElementById("threeGuaranteeDate").value,
                    "idSmall":document.getElementById("idSmall").value,
                    "idLarge":document.getElementById("idLarge").value,
                    "installWay":document.getElementById("installWay").value,
                    "distributor":document.getElementById("distributor").value,
                    "userName":document.getElementById("userName").value,
                    "region":document.getElementById("region").value,
                    "phone":document.getElementById("phone").value,
                    "address":document.getElementById("address").value,
                    "qq":document.getElementById("qq").value,
                    "wechat":document.getElementById("wechat").value,
                    "brand":document.getElementById("brand").value,
                    "provinceName":document.getElementById("provinceName").value,
                    "provinceZoom":document.getElementById("provinceZoom").value,
                    "provinceID":document.getElementById("provinceID").value,
                    "provinceLongitude":document.getElementById("provinceLongitude").value,
                    "provinceLatitude":document.getElementById("provinceLatitude").value,
                    "cityName":document.getElementById("cityName").value,
                    "cityZoom":document.getElementById("cityZoom").value,
                    "cityID":document.getElementById("cityID").value,
                    "cityLongitude":document.getElementById("cityLongitude").value,
                    "cityLatitude":document.getElementById("cityLatitude").value,
                    "longitude":document.getElementById("longitude").value,
                    "latitude":document.getElementById("latitude").value,
                    "servicer":document.getElementById("servicer").value,
                    "producer":document.getElementById("producer").value
                }
            }
        }
    }
    

    doSend(msg);

    console.log(JSON.stringify(msg));

    //返回表格
    $("#deviceManageTable").show();
    $("#deviceEdit").hide();
}

function deviceExcelPush(){
    var fileInput = document.querySelector('#deviceFile');
    console.log('文件名:',fileInput.value);
    var files = document.getElementById("deviceFile").files;

    if(files.length == 0){

        return;
    }

    var form = new FormData(),
        url = 'localhost',
        file = files[0];

    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);

        //上传进度事件
    xhr.upload.addEventListener("progress", function(result) {
        if (result.lengthComputable) {
            //上传进度
            var percent = (result.loaded / result.total * 100).toFixed(2); 
        }
    }, false);
   
    xhr.addEventListener("readystatechange", function() {
        var result = xhr;
        if (result.status != 200) { //error
            console.log('上传失败', result.status, result.statusText, result.response);
        } 
        else if (result.readyState == 4) { //finished
            console.log('上传成功', result);
        }
    });
    xhr.send(form); //开始上传
    
}

//页面初始化
function deviceManagePageInit(){ 

    deviceManagePageDataPull(); 
    
    deviceManageTableInit();
    
}

//页面加载完成事件
window.addEventListener("load", deviceManagePageInit, false);  
