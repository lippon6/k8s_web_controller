import datetime
class MsgEditPagePdfLog(object):
    def __init__(self,mysql_obj):
        self.mysql_obj = mysql_obj
        self.table_name = 'user_msg_edit_page_pdf_log'


    def add_pdf_log(self,user_account,file_name,msg_data_json):

        edit_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        msg_title = msg_data_json['title']
        msg_type= msg_data_json['msg_type']
        area_select_province= msg_data_json['area_select_province']
        area_select_city= msg_data_json['area_select_city']
        vendor_select_producer= msg_data_json['vendor_select_producer']
        vendor_select_servicer= msg_data_json['vendor_select_servicer']
        vendor_select_brand= msg_data_json['vendor_select_brand']
        vendor_select_model= msg_data_json['vendor_select_model']
        vendor_select_tractor_num= str(msg_data_json['vendor_select_tractor_num'])
        msg_to_one_tractor = msg_data_json['msg_to_one_tractor']
        select_tractor_one_num = msg_data_json['select_tractor_one_num']
        #print(msg_data_json)
        sql_data = "null,\'"+user_account+"\',\'"+edit_time+"\',\'"+file_name+"\',\'"+msg_title+"\',\'"+msg_type+"\',\'"+area_select_province+"\',\'"+area_select_city+"\',\'"+vendor_select_producer+"\',\'"+vendor_select_servicer+"\',\'"+vendor_select_brand+"\',\'"+vendor_select_model+"\',\'"+vendor_select_tractor_num+"\',"+str(msg_to_one_tractor)+","+str(select_tractor_one_num)+""

        if self.mysql_obj.insert_noarg_mysql(self.table_name,sql_data):
            print('add pdf log ok')
            return True
        else:
            print('add pdf log error')
            return False

    # 获得账户发布的PDF文件ID,标题,编辑时间,文件名
    def get_account_pdf_file_name_title(self,account):
        sql_cmd = "select id,msg_title,edit_time,file_name from " + self.table_name + " where user_account=\'" + str(account) + "\';"
        self.mysql_obj.query_cmd(sql_cmd)
        # 获得数据
        list = self.mysql_obj.get_all_row()
        return list




