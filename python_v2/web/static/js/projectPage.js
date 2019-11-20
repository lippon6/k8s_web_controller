// 全局信息
var projectInformation;
// 表格数据
var projectTableData = [];
// 提交类型
var pushType = ""

// 编辑界面文本ID
var idArray = ["projectID", "projectName", "projectStatus", "projectUser"];

// 编辑界面输入框标题
var titleArray = ["编号", "项目名称", "项目状态", "所属用户"];


// projectTableData[0] = {
//     "id":"01",
//     "name":"test1",
//     "status":"启用",
//     "user":"lippon"
// }

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
        dataRemoveById(ids);
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
            dataRemoveById([row.id]);
        },
        'click .choose': function (e, value, row, index) {
            enterScenarioPage(row.id);
        }

    }

    // 双击表格事件
    $('#projectTable').on('dbl-click-row.bs.table', function (e,row,$element) {
        enterScenarioPage(row.id);
    });

    // 添加表格数据
    $(document).ready(function() {
        $('#projectTable').bootstrapTable('append', projectTableData);
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
}

// 选择工程进入场景界面
function enterScenarioPage(id){
    // 数据组装
    data = {
        "function": "choose",
        "project": id
    }

    $.ajax({
        type: 'POST',
        url: '/project',
        data: data,
        dataType: 'json',
        success: function(data) {

        },
        error: function(xhr, type) {
            alert("网络错误!");
        }
    });

    window.location.href="scenePage.html"
}

// 依据id删除工程
function dataRemoveById(ids){

    // 数据组装
    data = {
        "function": "delete",
        "id": ids
    }
    console.log(data)
    //采用post方法向后端提交数据
    $.ajax({
        type: 'POST',
        url: '/project',
        data: data,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if(data == "success"){
                alert("成功删除!");
            }
            else if(data == "wrong"){
                alert("删除失败!");
            }
        },
        error: function(xhr, type) {
            alert("网络错误!");
        }
    });
}

// 控制事件的回调函数
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="edit btn btn-success">编辑</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">___</span>',
        '<button type="button" class="remove btn btn-danger">删除</button>',
        '<span   style="width:150px; color:#ccc;background-color:#ccc;">___</span>',
        '<button type="button" class="choose btn btn-success">选择</button>',
    ].join('')
}

// 将后端数据进行解析
function tableInformationTrans(){

    // 删除表格原有数据
    $('#projectTable').bootstrapTable('removeAll');

    for(var i = 0; i < projectInformation.id.length; i++){
        projectTableData[i] = {
            'id': projectInformation.id[i],
            'name':projectInformation.name[i],
            'status': projectInformation.status[i],
            'user': projectInformation.user[i]
        }
    }

    projectTableInit();
}

// 增加数据
function manageAddProject(){
    pushType = "create"
    $("#projectManageTable").hide();
    $("#projectTableEdit").show();
}

// 工程保存
function projectMsgSave(){
    //遍历输入框检查是否填写完全 其中编号无法修改 所以i从1开始赋值
    for(var i = 1; i < idArray.length; i++){
        if(document.getElementById(idArray[i]).value == ""){
            alert("请填写" + titleArray[i] + "!");
            return;
        }
    }

    // 数据组装
    data = {
        "function": pushType,
        "id": document.getElementById("projectID").value,
        "name": document.getElementById("projectName").value,
        "status": document.getElementById("projectStatus").value,
        "user": document.getElementById("projectUser").value,
        "data": ""
    }

    //采用post方法向后端提交数据
    $.ajax({
        type: 'POST',
        url: '/project',
        data: data,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if(data == "success"){

                // 清空表格
                manageEditDeviceDataRemove();

                //重新获取数据
                projectPageInit();   
            }
            else if(data == "existed"){
                alert("项目名称已存在!");
            }
    
        },
        error: function(xhr, type) {
            alert("网络错误!");
        }
    });
}

//清空表格
function manageEditDeviceDataRemove(){
    for(var i = 0; i < idArray.length; i++){
        document.getElementById(idArray[i]).value = "";
    }
}

//填充原有数据
function manageEditDataPush(id){
    var i;
    var index = 0;
    
    //计算id位置所在的数据
    for(i = 0; i < projectInformation.id.length; i++){
        if(id == projectInformation.id[i]){
            break;
        }
    }

    //遍历json数据并赋值
    for(var x in projectInformation){
        document.getElementById(idArray[index]).value = projectInformation[x][i];
        index++;
    }
}

//信息编辑
function dataEdit(id){
    pushType = "edit";
    manageEditDataPush(id);
    $("#projectManageTable").hide();
    $("#projectTableEdit").show();
}

//后端数据获取
function projectPageDataPull(){
    data = {
        "function": "get",
        "data": ""
    }
    //采用post方法向后端请求数据
    $.ajax({
        type: 'POST',
        url: '/project',
        data: data,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            projectInformation = data;
            tableInformationTrans();
            
        },
        error: function(xhr, type) {
            console.log('错误')
        }
    });
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

