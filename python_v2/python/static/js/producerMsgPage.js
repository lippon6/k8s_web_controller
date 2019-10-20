var producerMsgPageInformation;

var idArray = ["name", "summary", "address", "brand", "postNum", "telephone", "license"];
var titleArray = ["厂商名称", "厂商简介", "详细地址", "品牌", "邮编", "电话", "营业执照"]

var tableData = [];

//下拉生产商页面数据
function producerMsgPageDataPull()
{

    var producerMsgPageMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorProducerMsgPageAsk",
    
        },
    }
    sendMessage = producerMsgPageMessage;

    tableData = {
        "name": "万盛",
        "summary": "专业的拖拉机服务商",
        "address": "成都市郫县红光",
        "brand": "三一",
        "postNum": "610235",
        "telephone": "87114243",
        "license": "454846548415",
    }
}

//数据帧解析
function producerMsgPageInformationParse(data){
    producerMsgPageInformation = data.producerManageData;

    manageEditDeviceDataPush();

    if(producerMsgPageInformation.editAuthority == 0){
        $("#producerUpload").hide();
        $("#del").hide();
        $("#dataSave").hide();
    }
}

//填充原有数据
function manageEditDeviceDataPush(){
    var index = 0;

    //遍历json数据并赋值
    for(var x in producerMsgPageInformation){
        if(x == "editAuthority"){
            continue;
        }
        document.getElementById(idArray[index]).value = producerMsgPageInformation[x];
        index++;
    }
}

function producerSave(){
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
            "cmdName": "tractorProducerManageSave",

        },
        "data":{
            "producerManageData":{
                "name":document.getElementById("name").value,
                "summary":document.getElementById("summary").value,
                "address":document.getElementById("address").value,
                "brand":document.getElementById("brand").value,
                "postNum":document.getElementById("postNum").value,
                "telephone":document.getElementById("telephone").value,
                "license":document.getElementById("license").value,
            }
        }
    }    

    let img = document.getElementById('producerPictureSelect');

    let file = img.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function(){
        let data = {img: this.result};

        sendImg(data);
    }

    doSend(msg);

    alert("提交完成！");

}

//页面初始化
function producerMsgPageInit(){ 

    producerMsgPageDataPull();    
    
}

//得到照片地址
function getFileUrl(sourceId) {
    var url;
    if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
        url = document.getElementById(sourceId).value;
    } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    }
    return url;
}

//更改照片
function producerPictureChange(sourceId, targetId){
    
    var url = getFileUrl(sourceId); 
    var imgPre = document.getElementById(targetId); 
    imgPre.src = url;

}

//删除照片
function producerPictureDelele(targetId){
    var imgPre = document.getElementById(targetId); 
    imgPre.src = null;
}

window.addEventListener("load", producerMsgPageInit, false);  
