import datetime

class MsgEditPageUserLoginPdfMsg(object):
    def __init__(self,mysql_obj,arg_join_room,arg_leave_room,arg_emit):
        self.mysql_obj = mysql_obj
        self.table_name = 'user_login_pdf_msg'
        self.callback = None

    # 通信消息存放到数据库
    def broadcast_all_select_tractor_list(self,user_account,file_name,title,tractor_list):
        edit_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        for tractor_list_item in tractor_list:
            sql_data = "\'"+user_account+"\',\'"+str(tractor_list_item)+"\',\'"+str(file_name)+"\',\'"+str(title)+"\',0,\'"+str(edit_time)+"\'"
            if self.mysql_obj.insert_noarg_mysql(self.table_name, sql_data) == False:
                print('add pdf log error')
            if self.callback:
                self.callback(tractor_list_item)

    def set_broad_callback(self,callback):
        self.callback = callback
    # 查看设备没有接受到的消息
    def get_device_pdf_isnot_receive(self,device_num):
        # 整理查询条件
        sql_cmd = "select DISTINCT title,file_name,time from " + self.table_name + " where tractor_num=\'"+str(device_num)+"\' and is_receive=0;"
        # 查询数据
        self.mysql_obj.query_cmd(sql_cmd)
        list = self.mysql_obj.get_all_row()
        pdf_list = []
        for list_item in list:
            pdf_list.append(list_item)

        return pdf_list

    # 设置拖拉机文件下载完毕
    def set_device_pdf_file_is_receive(self,device_num,file_name):
        #先查询是否存在
        sql_cmd = "select DISTINCT file_name from " + self.table_name + " where tractor_num=\'"+str(device_num)+"\' and file_name=\'"+str(file_name)+"\';"
        # 查询数据
        self.mysql_obj.query_cmd(sql_cmd)
        list = self.mysql_obj.get_all_row()
        if list:
            if list[0][0] == file_name:
                pass
            else:
                print('error')
                return False
        else:
            print('error 2')
            return False

        # 设置文件已经下载
        value = "is_receive=1"
        key = "tractor_num=\'"+str(device_num)+"\' and file_name=\'"+str(file_name)+"\'"
        return self.mysql_obj.update_mysql(self.table_name,value,key)

