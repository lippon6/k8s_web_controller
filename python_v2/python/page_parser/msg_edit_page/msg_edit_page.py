import uuid

from ..msg_edit_page.msg_edit_page_pdf_log import MsgEditPagePdfLog
from ..msg_edit_page.msg_edit_page_user_login_pdf_msg import MsgEditPageUserLoginPdfMsg
from client_manage.user_client_manage.user_id_manage import UserIDManage
from module.convert_to_pdf_module import KPrint
from page_parser.msg_edit_page.msg_edit_page_sql_query import MsgEditPageSqlQuery

import sys


print(sys.platform)
system_use_windows = 0
if sys.platform == 'wind32' or sys.platform == 'wind64':
    system_use_windows = 1


class MsgEditPage(object):
    def __init__(self,mysql_obj,arg_join_room,arg_leave_room,arg_emit):
        self.mysql_obj = mysql_obj
        self.kprint = KPrint()
        self.socket_io_emit = arg_emit
        self.M_WEBSOCKET_RESPONSE = 'response'
        self.msg_edit_page_pdf_log = MsgEditPagePdfLog(mysql_obj)
        self.msg_edit_page_user_login_pdf_msg = MsgEditPageUserLoginPdfMsg(mysql_obj,arg_join_room,arg_leave_room,arg_emit)
        self.msg_edit_page_sql_query = MsgEditPageSqlQuery(mysql_obj,arg_emit)
        self.user_id_manage = UserIDManage(mysql_obj, 'user_id_create')

    def set_tractor_pdf_msg_callback(self,callback):
        self.msg_edit_page_user_login_pdf_msg.set_broad_callback(callback)


    # 编辑界面的转换按钮响应方法
    def convert_html_to_pdf(self,data,sid):
        msg = data['msg']
        query_name = data['query_name']
        html_content = str(data['html'])
        body = """
                <html>
                  <head>
                  <meta charset="UTF-8">
                  </head>
                  <body>
                  """ + html_content + """
                  </body>
                  </html>
                """

        file_name = str(uuid.uuid1())

        if system_use_windows:
            file_name_temp = "home\\usr\\notify_pdf\\" + file_name + ".pdf"
        else:
            file_name_temp = "home/usr/notify_pdf/" + file_name + ".pdf"

        account = self.user_id_manage.get_network_sid_account(sid)
        ss = self.get_account_pdf_log(account)

        broadcast_tractor_list = self.msg_edit_page_sql_query.pdf_log_find_match_tractor_nums(msg)
        if broadcast_tractor_list:
            self.kprint.print_from_str(body, file_name_temp)
            if self.msg_edit_page_pdf_log.add_pdf_log(account, file_name, msg):
                print('insert ok')

                self.broadcast_all_select_tractor_list(account,file_name,msg['title'],broadcast_tractor_list)
                self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': 'ok'})
            else:
                print('error')
                self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': 'error'})
        else:
            self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': '未找到拖拉机编号'})
            print('error')

    # 获得账户的所有的发布文件
    def get_account_pdf_log(self,account):
        return self.msg_edit_page_pdf_log.get_account_pdf_file_name_title(account)

    # 广播所有选中的客户端
    def broadcast_all_select_tractor_list(self,user_account,file_name,title,tractor_list):
        self.msg_edit_page_user_login_pdf_msg.broadcast_all_select_tractor_list(user_account,file_name,title,tractor_list)


