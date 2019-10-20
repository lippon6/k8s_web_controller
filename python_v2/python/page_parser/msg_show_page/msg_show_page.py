from client_manage.user_client_manage.user_id_manage import UserIDManage
from page_parser.msg_edit_page.msg_edit_page_pdf_log import MsgEditPagePdfLog


class MsgShowPage(object):

    def __init__(self,mysql_obj):
        self.msg_edit_page_pdf_log = MsgEditPagePdfLog(mysql_obj)
        self.user_id_manage = UserIDManage(mysql_obj, 'user_id_create')
    # 获得账户发布的PDF
    def get_account_pdf_log(self,sid):
        print(sid)
        account = self.user_id_manage.get_network_sid_account(sid)
        return self.msg_edit_page_pdf_log.get_account_pdf_file_name_title(account)
