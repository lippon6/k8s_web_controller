var tractorInformation = {};
var rotateChart;
var speedChart;
var gasWaterChart;
var option1;
var option2;
var option3;

function meterPageDataPull(){
    var id = document.getElementById('tractorIdSearch').value;
    var message = {
        "state":"OK",

        "abstract":{
            "senderType": "receiver",
            "mesType": "cmd",
            "cmdName": "tractorMeterAsk",
        },

        "device_id": id,

        "data":{
            "id":document.getElementById('tractorIdSearch').value
        }
    };


    sub_tractor(message);
    doSend(message);
    video_get_device_rtmp(id);

}


function meterSubTractor(data){

}

function meterInit(){
    $(function () {
        var dom = document.getElementById("speed");
        speedChart = echarts.init(dom);
        option1 = null;
        option1 = {
            series : [
                {
                    name: '速度',
                    type: 'gauge',
                    z: 3,
                    min: 0,
                    max: 220,
                    splitNumber: 11,
                    center: ['50%', '55%'],
                    radius: '95%',
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.09, '#00ff00'],[0.82, '#1eccff'],[1, '#ff4500']],
                            width: 3,
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisLabel: {            // 坐标轴小标记
                        textStyle: {       // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    splitLine: {           // 分隔线
                        length :25,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width:3,
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    pointer: {           // 分隔线
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    },
                    title : {
                        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 18,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff',
                        shadowBlur: 10
                    },
                    detail : {
                        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        /*
                        formatter: function (value) {
                            value = (value + '').split('.');
                            value.length < 2 && (value.push('00'));
                            return ('00' + value[0]).slice(-2)
                                + '.' + (value[1] + '00').slice(0, 2);
                        },
                        */
                        fontWeight: 'bolder',
                        borderRadius: 5,
                        backgroundColor: '#333',
                        borderColor: '#fff',
                        shadowBlur: 5,
                        shadowColor: '#fff',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        borderWidth: 2,
                        textBorderColor: '#000',
                        textBorderWidth: 1,
                        textShadowBlur: 1,
                        textShadowColor: '#fff',
                        textShadowOffsetX: 0,
                        textShadowOffsetY: 0,
                        fontFamily: 'Arial',
                        width: 90,
                        color: '#eee',
                        rich: {}
                    },
                    data:[{value: 40, name: 'km/h'}]
                }
            ]
        };

        option1.series[0].data[0].value = 0;
        speedChart.setOption(option1,true);
        /*
        setInterval(function (){
            option1.series[0].data[0].value = (Math.random()*100).toFixed(2) - 0;
            myChart.setOption(option1,true);
        },2000);
        if (option1 && typeof option1 === "object") {
            myChart.setOption(option1, true);
        }
        */
    }());

    $(function () {
        var dom = document.getElementById("r-speed");
        rotateChart = echarts.init(dom);
        option2 = null;
        option2 = {
            series : [
                {
                    name: '转速',
                    type: 'gauge',
                    center: ['53%', '55%'],    // 默认全局居中
                    radius: '85%',
                    min:0,
                    max:7,
                    endAngle:45,
                    splitNumber:7,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.29, '#00ff00'],[0.86, '#1eccff'],[1, '#ff4500']],
                            width: 2,
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisLabel: {            // 坐标轴小标记
                        textStyle: {       // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :12,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    splitLine: {           // 分隔线
                        length :20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width:3,
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    pointer: {
                        width:5,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    },
                    title : {
                        offsetCenter: ['10%', '-25%'],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontStyle: 'italic',
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    detail: {
                        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 600,
                        fontSize: 20,
                        color: '#fff'
                    },
                    data:[{value: 1.5, name: 'x1000 r/min'}]
                }
            ]
        };


        option2.series[0].data[0].value = 6;
        rotateChart.setOption(option2,true);

    }());

    $(function () {
        var dom = document.getElementById("fuel");
        gasWaterChart = echarts.init(dom);
        option3 = null;
        option3 = {
            series : [
                {
                    name: '油表',
                    type: 'gauge',
                    center: ['50%', '50%'],    // 默认全局居中
                    radius: '70%',
                    min: 0,
                    max: 2,
                    startAngle: 135,
                    endAngle: 45,
                    splitNumber: 2,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.2, '#00ff00'],[0.8, '#1eccff'],[1, '#ff4500']],
                            width: 2,
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :12,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisLabel: {
                        textStyle: {       // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        },
                        formatter:function(v){
                            switch (v + '') {
                                case '0' : return 'E';
                                case '1' : return 'Gas';
                                case '2' : return 'F';
                            }
                        }
                    },
                    splitLine: {           // 分隔线
                        length :15,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width:3,
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    pointer: {
                        width:2,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    },
                    title : {
                        show: false
                    },
                    detail : {
                        show: false
                    },
                    data:[{value: 0.5, name: 'gas'}]
                },
                {
                    name: '水表',
                    type: 'gauge',
                    center : ['50%', '50%'],    // 默认全局居中
                    radius : '70%',
                    min: 0,
                    max: 2,
                    startAngle: 315,
                    endAngle: 225,
                    splitNumber: 2,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.2, '#00ff00'],[0.8, '#1eccff'],[1, '#ff4500']],
                            width: 2,
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        show: false
                    },
                    axisLabel: {
                        textStyle: {       // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        },
                        formatter:function(v){
                            switch (v + '') {
                                case '0' : return 'H';
                                case '1' : return 'Water';
                                case '2' : return 'C';
                            }
                        }
                    },
                    splitLine: {           // 分隔线
                        length :15,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width:3,
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    pointer: {
                        width:2,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 5
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data:[{value: 0.5, name: 'gas'}]
                }
            ]
        };

        option3.series[0].data[0].value = 1;
        option3.series[1].data[0].value = 1;
        gasWaterChart.setOption(option3,true);
    }());
}

function setRotationMeterData(val){
    option2.series[0].data[0].value = val / 1000;
    rotateChart.setOption(option2,true);
}

function setSpeedMeterData(val){
    option1.series[0].data[0].value = val;
    speedChart.setOption(option1,true);
}

function setGasMeterData(val){
    option3.series[0].data[0].value = val / 100;
    gasWaterChart.setOption(option3,true);
}

function setWaterMeterData(val){
    option3.series[1].data[0].value = (val - 50)/80 ;
    gasWaterChart.setOption(option3,true);
}

//仪表监控参数解析
function meterInformationParse(data)
{
    tractorInformation.basicData = data.data.data.basicData;

    //仪表数据写入
    setSpeedMeterData(tractorInformation.basicData.speed);
    setRotationMeterData(tractorInformation.basicData.rotateSpeed);
    setWaterMeterData(tractorInformation.basicData.waterTemp);
    setGasMeterData(tractorInformation.basicData.gasMassPercent);

    indicatorLightControl();
}

//仪表界面基础数据
function meterDriverInformationParse(data){
    tractorInformation.basicData = data.basicData;
    //基础数据写入
    if(tractorInformation.basicData.isExist == 1){
        document.getElementById("product").innerHTML = tractorInformation.basicData.product;
        document.getElementById("userName").innerHTML = tractorInformation.basicData.userName;
        document.getElementById("engine").innerHTML = tractorInformation.basicData.engine;
        document.getElementById("model").innerHTML = tractorInformation.basicData.model;
        document.getElementById("phone").innerHTML = tractorInformation.basicData.phone;
        document.getElementById("workTime").innerHTML = tractorInformation.basicData.workTime;
        document.getElementById("deviceId").innerHTML = tractorInformation.basicData.id;
        document.getElementById("productDate").innerHTML = tractorInformation.basicData.productDate;
        document.getElementById("useMileage").innerHTML = tractorInformation.basicData.useMileage;
    }
    else{
        alert("不存在该编号拖拉机！");
    }

}

//指示灯逻辑判断
function indicatorLightControl(){

    if(tractorInformation.basicData.temp_lamp_show == 1)
    {
        document.getElementById("image_waterTempLight").src = "static/image/waterTempWarning.png";
    }
    else
    {
        document.getElementById("image_waterTempLight").src = "static/image/waterTempWarning.png";
    }

    if(tractorInformation.basicData.hang_lamp_show == 1)
    {
        document.getElementById("image_warningLight").src = "static/image/stopWarning.png";
    }
    else
    {
        document.getElementById("image_warningLight").src = "static/image/stopOff.png";
    }

    if(tractorInformation.basicData.battery_lamp_show == 1)
    {
        document.getElementById("image_batteryLight").src = "static/image/batteryWarning.png";
    }
    else
    {
        document.getElementById("image_batteryLight").src = "static/image/batteryOff.png";
    }

    if(tractorInformation.basicData.engine_lamp_show == 1)
    {
        document.getElementById("image_engineCheckLight").src = "static/image/engineWarning.png";
    }
    else
    {
        document.getElementById("image_engineCheckLight").src = "static/image/engineOff.png";
    }

    if(tractorInformation.basicData.oil_lamp_show == 1)
    {
        document.getElementById("image_fuelLight").src = "static/image/fuelWarning.png";
    }
    else
    {
        document.getElementById("image_fuelLight").src = "static/image/fuelOff.png";
    }

    if(tractorInformation.basicData.hang_lamp_show == 1)
    {
        document.getElementById("image_highBeam").src = "static/image/highBeamWarning.png";
    }
    else
    {
        document.getElementById("image_highBeam").src = "static/image/highBeamOff.png";
    }

    if(tractorInformation.basicData.park_lamp_show == 1)
    {
        document.getElementById("image_stopLight").src = "static/image/stopWarning.png";
    }
    else
    {
        document.getElementById("image_stopLight").src = "static/image/stopOff.png";
    }

    if(tractorInformation.basicData.fourDrive_lamp_show == 1)
    {
        document.getElementById("image_engineOilLight").src = "static/image/oilWarning.png";
    }
    else
    {
        document.getElementById("image_engineOilLight").src = "static/image/oilOff.png";
    }
}

function meterPageInit(){
    meterInit();
}

window.addEventListener("load", meterPageInit, false);
