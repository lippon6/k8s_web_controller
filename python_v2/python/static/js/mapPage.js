var map;
var mapInformation = {};

var cityCenter=[];
var provinceCenter=[];
var numCenter=[];
var markerArray=[];

function mapPageInit(){

    mapPageDataInit();


    mapInit();


    mapPageDataPull();

}

function mapPageDataInit(){

}

//初始化城市下拉菜单
function cityDropdownInit(){
    var dropdownMenu = document.getElementById("cityDropdownUl");

    for(var i = 0; i < mapInformation.cityQuantity; i++){

        cityCenter[i] = [mapInformation.cityLongitude[i], mapInformation.cityLatitude[i]];

        var li = document.createElement("li");
    
        li.innerHTML = "<a href='javascript:void(0)' onclick = 'map.setCenter(cityCenter["+ i +"]);map.setZoom("+ mapInformation.cityZoom[i] +")'>" + 
         mapInformation.cityName[i] + "</a>";
    
        dropdownMenu.appendChild(li);
    }
}

//初始化省份下拉菜单
function provinceDropdownInit(){
    var dropdownMenu = document.getElementById("provinceDropdownUl");

    for(var i = 0; i < mapInformation.provinceQuantity; i++){
        provinceCenter[i] = [mapInformation.provinceLongitude[i], mapInformation.provinceLatitude[i]];

        var li = document.createElement("li");

        li.innerHTML =  "<a href='javascript:void(0)' onclick = 'map.setCenter(provinceCenter["+ i +"]);map.setZoom("+ mapInformation.provinceZoom[i] +")'>" + 
        mapInformation.provinceName[i] + "</a>";

        dropdownMenu.appendChild(li);
    }
}

//初始化编号下拉菜单
function numDropDownInit(){
    var dropdownMenu = document.getElementById("numDropdownUl");

    for(var i = 0; i < mapInformation.tractorQuantity; i++){
        numCenter[i] = [mapInformation.longitude[i], mapInformation.latitude[i]];

        var li = document.createElement("li");

        li.innerHTML =  "<a href='javascript:void(0)' onclick = 'map.setCenter(numCenter["+ i +"]);map.setZoom(19)'>" + 
        mapInformation.id[i] + "</a>";

        dropdownMenu.appendChild(li);
    }
}

//初始化设备类型下拉菜单
function modelDropDownInit(){
    var dropdownMenu = document.getElementById("deviceTypeDropdownUl");

    for(var i = 0; i < mapInformation.modelQuantity; i++){

        var li = document.createElement("li");

        li.innerHTML =  "<a href='javascript:void(0)' onclick = 'deviceTypeFilter(mapInformation.modelPool["+ i +"])'>" + 
        mapInformation.modelPool[i] + "</a>";

        dropdownMenu.appendChild(li);
    }
}

//初始化品牌下拉菜单
function brandDropDownInit(){
    var dropdownMenu = document.getElementById("brandDropdownUl");

    for(var i = 0; i < mapInformation.brandQuantity; i++){

        var li = document.createElement("li");

        li.innerHTML =  "<a href='javascript:void(0)' onclick = 'brandFilter(mapInformation.brandPool["+ i +"])'>" + 
        mapInformation.brandPool[i] + "</a>";

        dropdownMenu.appendChild(li);
    }
}

//初始化制造商下拉菜单
function producerDropDownInit(){
    var dropdownMenu = document.getElementById("producerDropdownUl");

    for(var i = 0; i < mapInformation.producerQuantity; i++){

        var li = document.createElement("li");

        li.innerHTML =  "<a href='javascript:void(0)' onclick = 'producerFilter(mapInformation.producerPool["+ i +"])'>" + 
        mapInformation.producerPool[i] + "</a>";

        dropdownMenu.appendChild(li);
    }
}

//初始化服务商下拉菜单
function serviceProviderDropDownInit(){
    var dropdownMenu = document.getElementById("servicerDropdownUl");

    for(var i = 0; i < mapInformation.servicerQuantity; i++){

        var li = document.createElement("li");

        li.innerHTML =  "<a href='javascript:void(0)' onclick = 'serviceProviderFilter(mapInformation.servicerPool["+ i +"])'>" + 
        mapInformation.servicerPool[i] + "</a>";

        dropdownMenu.appendChild(li);
    }
}

//根据品牌过滤标记
function brandFilter(name){
    var num = 0;

    map.remove(markerArray);
    markerArray = [];

    for(var i = 0; i < mapInformation.tractorQuantity; i++){
        if(mapInformation.brand[i] == name){
            var marker = new AMap.Marker({
                position: new AMap.LngLat(mapInformation.longitude[i], mapInformation.latitude[i]),
                  
            }); 

            marker.setLabel({
                offset: new AMap.Pixel(20, 20),
                content: mapInformation.id[i]
            });

            markerArray[num] = marker;
            num++;
        }
    }

    map.add(markerArray);

    pushClickEvent(markerArray);
}

//根据制造商过滤标记
function producerFilter(name){
    var num = 0;

    map.remove(markerArray);
    markerArray = [];

    for(var i = 0; i < mapInformation.tractorQuantity; i++){
        if(mapInformation.producer[i] == name){
            var marker = new AMap.Marker({
                position: new AMap.LngLat(mapInformation.longitude[i], mapInformation.latitude[i]),
                  
            }); 

            marker.setLabel({
                offset: new AMap.Pixel(20, 20),
                content: mapInformation.id[i]
            });

            markerArray[num] = marker;
            num++;
        }
    }

    map.add(markerArray);

    pushClickEvent(markerArray);
}

//根据服务商过滤标记
function serviceProviderFilter(name){
    var num = 0;

    map.remove(markerArray);
    markerArray = [];

    for(var i = 0; i < mapInformation.tractorQuantity; i++){
        if(mapInformation.servicer[i] == name){
            var marker = new AMap.Marker({
                position: new AMap.LngLat(mapInformation.longitude[i], mapInformation.latitude[i]),
                  
            }); 

            marker.setLabel({
                offset: new AMap.Pixel(20, 20),
                content: mapInformation.id[i]
            });

            markerArray[num] = marker;
            num++;
        }
    }

    map.add(markerArray);

    pushClickEvent(markerArray);
}

//根据设备类型过滤标记
function deviceTypeFilter(name){
    var num = 0;

    map.remove(markerArray);
    markerArray = [];

    for(var i = 0; i < mapInformation.tractorQuantity; i++){
        if(mapInformation.model[i] == name){
            var marker = new AMap.Marker({
                position: new AMap.LngLat(mapInformation.longitude[i], mapInformation.latitude[i]),
                  
            }); 

            marker.setLabel({
                offset: new AMap.Pixel(20, 20),
                content: mapInformation.id[i]
            });

            markerArray[num] = marker;
            num++;
        }
    }

    map.add(markerArray);

    pushClickEvent(markerArray);
}


//标记点绘制
function markerInit(){
    

    for(var i = 0; i < mapInformation.tractorQuantity; i++){
        var marker = new AMap.Marker({
            position: new AMap.LngLat(mapInformation.longitude[i], mapInformation.latitude[i]),
              
        }); 

        marker.setLabel({
            offset: new AMap.Pixel(20, 20),
            content: mapInformation.id[i]
        });
        markerArray[i] = marker;    
    }

    map.add(markerArray);

    pushClickEvent(markerArray);
}

//地图数据帧解析
function mapInformationParse(data){
    writeToScreen(data);  

    mapInformation = data.map;

    if(mapInformation.tractorQuantity > 0){
        markerInit();
    }

    
    cityDropdownInit();
    provinceDropdownInit();
    numDropDownInit();
    modelDropDownInit();
    brandDropDownInit();
    producerDropDownInit();
    serviceProviderDropDownInit();
    
}

//地图初始化
function mapInit(){
    map = new AMap.Map('mapContainer', {
        zoom:5
    });
}

//删除地图块
function deleteMap(){
    var mapFather = document.getElementById("mapFather");
    var mapSon = document.getElementById("mapContainer");

    var dropdownFather = document.getElementById("dropdownFather");
    var dropdownSon = document.getElementById("dropdownSon");

    mapFather.removeChild(mapSon);
    dropdownFather.removeChild(dropdownSon);

}

//添加地图
function rebuildMap()
{
    var mapFather = document.getElementById("mapFather");

    var dropdownFather = document.getElementById("dropdownFather");

    mapFather.innerHTML = "<div id = 'mapContainer' style='width: 100%; \
        height: 800px; margin-left: -7px; margin-top: -10px; overflow: hidden; \
        position: relative; z-index: 0; background-color: rgb(243, 241, 236); \
        color: rgb(0, 0, 0); text-align: left;'> </div>";

    dropdownFather.innerHTML = " \
        <div class='row' id='dropdownSon'> \
            <div class='col-sm-4'> \
                <li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown'>选择省份 <b class='caret'></b></a> \
                    <ul id = 'provinceDropdownUl' class='dropdown-menu'> \
                    </ul> \
                </li> \
            </div> \
            <div class='col-sm-4'> \
                <li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown'>选择城市 <b class='caret'></b></a> \
                    <ul id = 'cityDropdownUl' class='dropdown-menu'> \
                    </ul> \
                </li> \
            </div> \
            <div class='col-sm-4'> \
                <li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown'>选择设备编号 <b class='caret'></b></a> \
                    <ul id = 'numDropdownUl' class='dropdown-menu'> \
                    </ul> \
                </li> \
            </div> \
        </div>";

    markerInit();

    cityDropdownInit();
    provinceDropdownInit();
    numDropDownInit();
}

//将地图替换为拖拉机路线图
function pushRouteCanvas(){
    
}

function mapRoutePicturePull(num){
    var mapPictureMessage = {
        "abstract":{
            "senderType": "sever",
            "msgType": "cmd",
            "cmdName": "mapRoutePicturePush",
    
        },    
    
        "data":{
            "routeData":{
                "picture":'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551445517265&di=4d6ba78\
                1a04f801d1bd248e22501054e&imgtype=0&src=http%3A%2F%2Fagvsz2017.get.vip%2FupLoad%2Fnews%2Fmonth_1311%2F20131111134619224.jpg'
            }
        }
    }

    sendMessage=mapPictureMessage;
}

//添加标记点击事件
function pushClickEvent(markerArray){

    for(let [index,item] of markerArray.entries()){
        markerArray[index].on('click', function(){
            mapRoutePicturePull(index);

        })
    }
}

function mapPictureParse(data){
    deleteMap();

    pushRouteCanvas(); 

    var p = new Image();
    p.src = data.routeData.picture;

    var father = document.getElementById("mapFather")

    father.appendChild(p);
}

function mapPageDataPull()
{
    var mapMessage = {
        "abstract":{
            "senderType": "receiver",
            "msgType": "cmd",
            "cmdName": "tractorMapAsk",
        }
    }
    sendMessage=mapMessage;
}

window.addEventListener("load", mapPageInit, false);  
