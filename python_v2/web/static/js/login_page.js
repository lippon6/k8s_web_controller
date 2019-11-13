

// 检测登陆
function check_login() {
        $.get("/get_login",function(data,status){
            if (status === 'success'){
                var account = data['account'];
            var passwd = data['passwd'];
            console.log(account);
            console.log(passwd);
            return data;
            }});
}