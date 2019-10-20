var statisticalInformation;

var statisticalWorkingData = [];
var statisticalRepairData = [];
var statisticalWorkRatioData = []

//柱状图初始化
function statisticalWarningBarInit(){
    var BarGraphDom1 = document.getElementById("waringBar");
    var BarGraph1 = echarts.init(BarGraphDom1);
    BarGraph1option = null;
    BarGraph1option = {
        title: {
            text: '各部件告警次数统计表',
        },
        xAxis: {
            type: 'category',
            data: statisticalInformation.componentWarningComponent            
                
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: statisticalInformation.componentWarningFrequency,
            type: 'bar'
        }]
    };
    ;
    if (BarGraph1option && typeof BarGraph1option === "object") {
        BarGraph1.setOption(BarGraph1option, true);
    }
}

function statisticalDistrubeBarInit(){
    var BarGraphDom1 = document.getElementById("distrableBar");
    var BarGraph1 = echarts.init(BarGraphDom1);
    BarGraph1option = null;
    BarGraph1option = {
        title: {
            text: '设备分布表',
        },
        xAxis: {
            type: 'category',
            data: statisticalInformation.distributRegion
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: statisticalInformation.distributFrequency,
            type: 'bar'
        }]
    };
    ;
    if (BarGraph1option && typeof BarGraph1option === "object") {
        BarGraph1.setOption(BarGraph1option, true);
    }
}

function changeWorkingTable(){

    $("#workingTable").show();
    $("#workingRatioTable").hide();
    $("#repairTable").hide();
    $("#warningTable").hide();
    $("#distrubeTable").hide();
}

function changeDeviceDistrubeTable(){
    $("#workingTable").hide();
    $("#workingRatioTable").hide();
    $("#repairTable").hide();
    $("#warningTable").hide();
    $("#distrubeTable").show();
}

function changeWorkingRatioTable(){
    $("#workingTable").hide();
    $("#workingRatioTable").show();
    $("#repairTable").hide();
    $("#warningTable").hide();
    $("#distrubeTable").hide();

}

function changeWarningTable(){
    $("#workingTable").hide();
    $("#workingRatioTable").hide();
    $("#repairTable").hide();
    $("#warningTable").show();
    $("#distrubeTable").hide();
}

function changeRepairTable(){
    $("#workingTable").hide();
    $("#workingRatioTable").hide();
    $("#repairTable").show();
    $("#warningTable").hide();
    $("#distrubeTable").hide();
}


function statisticalTableInit(){
    var $statisticalTable = $('#statisticalMsgTable');
    var $statisticalTableRemoveBtn = $('#statisticalTableRemove');

    // 移除事件
    $statisticalTableRemoveBtn.click(function () {
        var ids = $.map($statisticalTable.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
        $('#statisticalMsgTable').bootstrapTable('remove', {
            field: 'id',
            values: ids
        })
    });

    $(document).ready(function() {
        $('#statisticalMsgTable').bootstrapTable('append', statisticalWorkingData);
    });
}

function tableInformationTrans(){
    for(var i = 0; i < statisticalInformation.workMonthId.length; i++){
        statisticalWorkingData[i] = {
            'tractorNum': statisticalInformation.workMonthId[i],
            'usingFrequnce':statisticalInformation.workMonthFrequency[i],
            'time': statisticalInformation.workMonthTime[i],
            'place': statisticalInformation.workMonthRegion[i]
        }
    }

    statisticalTableInit();
}

//初始化画工作率月报表
function statisticalWorkRatioTableInit(){
    $(document).ready(function() {
        $('#workingRatioMsgTable').bootstrapTable('append', statisticalWorkRatioData);
    });
}

//读取工作率月报表数据
function workRatioInformationTrans(){
    for(var i = 0; i < statisticalInformation.workRatio.length; i++){
        statisticalWorkRatioData[i] = {
            'province':statisticalInformation.workRatioProvince[i],
            'ratio': statisticalInformation.workRatio[i],
        }
    }

    statisticalWorkRatioTableInit();
}

function statisticalRepairTableInit(){
    $(document).ready(function() {
        $('#repairMsgTable').bootstrapTable('append', statisticalRepairData);
    });
}

function repairInformationTrans(){
    for(var i = 0; i < statisticalInformation.workRatio.length; i++){
        statisticalRepairData[i] = {
            'sendTime': statisticalInformation.repairTime[i],
            'sendNum':statisticalInformation.repairSerial[i],
            'deviceType': statisticalInformation.repairModel[i],
            'deviceNum':statisticalInformation.repairId[i],
            'customerName': statisticalInformation.repairCustomer[i],
            'describe':statisticalInformation.repairDescribe[i],
            'repairConmpany': statisticalInformation.repairCompany[i],
            'fee':statisticalInformation.repairFee[i]
        }
    }

    statisticalRepairTableInit();
}

function statisticalInformationParse(data){
    statisticalInformation = data.statisticalData;

    tableInformationTrans();
    workRatioInformationTrans();
    repairInformationTrans();

    statisticalWarningBarInit();
    statisticalDistrubeBarInit();

}

function statisticalPageDataPull(){
    var statisticalMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorStatisticalAsk",
    
        }

    }

    sendMessage = statisticalMessage;
}

function statisticalAllTableInit(){
    $("#workingRatioTable").hide();
    $("#repairTable").hide();
    $("#warningTable").hide();
    $("#distrubeTable").hide();

    statisticalTableInit();
}

function statisticalPageInit()
{
    statisticalAllTableInit();

    statisticalPageDataPull();

}


window.addEventListener("load", statisticalPageInit, false);  

