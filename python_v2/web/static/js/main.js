var wsUri ="http://127.0.0.1:5000/dashboard";
var output;
var globleInformation;
var sendMessage;
var socket;

var g_account="";
var g_passwd="";

function get_account() {
    $.get("/get_login",function(data,status){
    if (status === 'success'){
        g_account = data['account'];
        g_passwd = data['passwd'];
    }else{

    }
    });
}

// 连接成功后的登陆事件
function on_connect_login() {
    if (g_account !== ""){
        console.log("登陆失败");
    }
    socket.emit('login', {user_name:g_account,user_passwd:g_passwd});
}

function init()
{
    //output = document.getElementById("output");
    get_account();
    socektIoInit();
}

function socektIoInit()
{
    // 连接到socketio
    socket = io.connect('/dashboard');
    socket.on('disconnect', function(data){

        //失去连接的事件
        console.log('断开连接');
        onClose();
    });
    socket.on('connect', function(data){
        //连接正常的事件
        console.log( '连接成功');
        on_connect_login();
        onOpen();
    });

    socket.on('response', function(msg) {
        onMessage(msg);
    });

}

function onOpen(evt){
    writeToScreen("CONNECTED");

    //getID();

    getPageInitInformation();
}

function getID(){
    data = {
        'abstract': {
            'cmdName': 'getKey',
            'packageIndex': 0,
            'msgType': 'get',
            'privateKey': '',
            'senderType': 'pusher'
        },
        'data': {
            'key': ''
        }
    }
    socket.emit('response',  data);
}

function getPageInitInformation(){
    socket.emit('response', sendMessage);
}

function onClose(evt){
    writeToScreen("DISCONNECTED");
}

function onMessage(data) {
    // writeToScreen( JSON.stringify(data));
    messageParse(data);

}

function doSend(message)
{
    writeToScreen("SENT: " + message);
    socket.emit('response', message);
}

// 带命名空间的发送
function doSendWithName(even,message) {
     writeToScreen("even: " + even +"msg"+message);
     socket.emit(even, message);
}

function sub_tractor(data){
    writeToScreen("SENT: " + data);
    socket.emit('sub_tractor', data);
}

function sendImg(img){
    socket.emit('img', img);
}

function writeToScreen(message)
{
    console.log(message);
}

//数据包解析
function messageParse(frame)
{
   // var frame = JSON.parse(evt);

    switch(frame.abstract.senderType)
    {
        case "server":
            severInformationParse(frame);
            break;

        case "pusher":
            pusherInformationParse(frame);
            break;
    }
}


//服务器数据解析
function severInformationParse(frame)
{
    switch(frame.abstract.msgType)
    {
        case "response":
            cmdMessageParse(frame);
            break;
    }
}

//推送者数据解析
function pusherInformationParse(frame){

}

//命令数据解析
function cmdMessageParse(frame)
{

    switch(frame.abstract.cmdName)
    {
        case "getKey":
            saveKey(frame.data);
            break;
        case "control_response":
            control_msg_response(frame.data);
            break;
        case "get_rtmp_addr":
            video_on_get_rtmp_addr(frame.data);
            break;
        case "tractorMeterPush":
            meterInformationParse(frame.data);
            break;

        case "tractorMeterDriverPush":
            meterDriverInformationParse(frame.data);
            break;

        case "sub_tractor":
            meterSubTractor(frame.data);
            break;

        case "forward_data":
            meterInformationParse(frame.data);
            break;

        case "tractorMapPush":
            mapInformationParse(frame.data);
            break;

        case "tractorRoutePush":
            routeInformationParse(frame.data);
            break;

        case "tractorWarningPush":
            warningInformationParse(frame.data);
            break;

        case "tractorStatisticalPush":
            statisticalInformationParse(frame.data);
            break;

        case "mapRoutePicturePush":
            mapPictureParse(frame.data);
            break;

        case "tractorDeviceManagePush":
            deviceManageInformationParse(frame.data);

            break;

        case "tractorProductContentPush":
            productContentInformationParse(frame.data);
            break;

        case "tractorModelManagePush":
            modelManageInformationParse(frame.data);
            break;

        case "tractorWarningManagePush":
            warningManageInformationParse(frame.data);
            break;

        case "tractorServiceManagePush":
            serviceManageInformationParse(frame.data);
            break;

        case "tractorProducerManagePush":
            producerMsgPageInformationParse(frame.data);
            break;

        case "tractorUserManagePush":
            userManageInformationParse(frame.data);
            break;

        case "tractorDepartmentManagePush":
            departmentManageInformationParse(frame.data);
            break;

        case "tractorRoleManagePush":
            roleManageInformationParse(frame.data);
            break;

    }
}

function saveKey(data){
    globleInformation= data;

    writeToScreen( globleInformation.key);
}

window.addEventListener("load", init, false);
