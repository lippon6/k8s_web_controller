/*
 * Module:  
 * Author:  liuyh 
 * Version: 2015-04-19
 * Purpose: Defines the JsClass  
 * Desc:    公共数据校验JS
 ***********************************************************************
*/


Validate = {};

//+---------------------------------------------------   
//| 日期合法性验证   
//| 格式为：YYYY-MM-DD或YYYY/MM/DD   
//+--------------------------------------------------- 
Validate.isValidDate=function(DateStr){
    var sDate=DateStr.replace(/(^\s+|\s+$)/g,''); //去两边空格;
    if(sDate=='') return true;    
    //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''    
    //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式    
    var s = sDate.replace(/[\d]{4,4}[\-/]{1}[\d]{2}[\-/]{1}[\d]{2}/g,'');
    //var s = sDate.replace(/[\d]{4,4}[\-/]{1}[\d]{1,2}[\-/]{1}[\d]{1,2}/g,'');
    if (s=='') //说明格式满足YYYY-MM-DD或YYYY-M-DD  //或YYYY-M-D或YYYY-MM-D
    {    
        var t=new Date(sDate.replace(/\-/g,'/'));
        var ar = sDate.split(/[-/:]/);
        if(ar[0] != t.getFullYear() || ar[1] != t.getMonth()+1 || ar[2] != t.getDate())
        {    
            //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');
            return false;    
        }    
    }    
    else    
    {    
        //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');
        return false;    
    }    
    return true;    
};

/*
 *  数值的验证
 * 
 */
Validate.isValidNumber=function(numStr){
	//var re = /^[\-\+]?([0-9]\d*|0|[1-9]\d{0,2}(,\d{3})*)(\.\d+)?$/;  //支持千分位
	if(numStr=="") return true;
	var re = /^[\-]?([0-9]\d*|0|[1-9]\d{0,2}(\d{3})*)(\.\d+)?$/;  
	return re.test(numStr) ;
}

/*
 *  验证是否是整数
 */
Validate.isInteger=function(str){
	var re=/^[-]?(0|[1-9][0-9]*)$/;
	return re.test(str);
    
}

/*
 *  验证是否是正整数
 */
Validate.isPlusInteger=function(str){
	var re=/^(0|[1-9][0-9]*)$/;
	return re.test(str);
    
}

/*
 *  验证是否是浮点型
 */
Validate.isFloat=function(str){
	var re=/^[-]?(0|[1-9][0-9]*|[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/;
	return re.test(str);
    
}

/*
 * 验证是否是小于1的小数
 * 
 */
Validate.isDotDecimal=function(str){
	  var re=/^-?[0]+(\.\d+)?$/g;
	  return re.test(str);
}

/*
 * 通用的判断字符串是否含有非法字符的函数
 * 
 */
Validate.isValidName=function(str){
	
	/*特殊字符定义：1： \
	               2: &
	               3: ^
	               4: ,
	               5: "
	               6: '
	               7: <
	               8: >
	               9: \n\r\t\v 匹配空白字符，包括制表符、换页符等。
    */
	var re=/[\\&^,\"\'<>\n\r\t\v]/g;
	return !re.test(str);
}

/**
 * 检查是否是有效的编码
 * 
 * @param txt
 * @return
 */

Validate.isValidCode=function(str){
	//有效编码的范围只能是字母加数字
	var re=/[^A-Za-z0-9_\-\.]/g;
	return !re.test(str);
}

/*
 * 
 * 判断字符是否为空
 */
Validate.isEmpty = function(value) {   
    return value==null || value=="";
}

/*
 * 去掉空格
 */
Validate.isRepairBlank = function(value){
	return value.replace(/\s+/g,"");
}

Validate.isValidIntRange=function(str){
	//有效编码的范围只能是字母加数字
	var re=/[^0-9\-\,]/g;
	return !re.test(str);
}