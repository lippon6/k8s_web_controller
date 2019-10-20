from ..user_client_manage.user_id_manage import UserIDManage


from client_manage.user_client_manage.user_control_log import UserControlLog
import datetime
import uuid
from server_config import ServerConfig

from threading import Thread
import threading
import time

import time

M_WEBSOCKET_RESPONSE='response'

server_config = ServerConfig()

class UserAccountManage(object):
    def __init__(self,mysql_obj,arg_join_room,arg_leave_room,arg_emit):
        self.mysql_obj = mysql_obj
        self.table_name  = 'null'
        self.socket_io_join_room = arg_join_room
        self.socket_io_leave_room = arg_leave_room
        self.socket_io_emit = arg_emit

        self.user_id_manage = UserIDManage(mysql_obj,'user_id_create')
        self.user_control_log = UserControlLog(mysql_obj)

    # 注册账号
    def register_account(self,account,passwd,name):
        #查找账号名时候被注册
        if self.user_id_manage.is_exist_account(account):
            print('is exite')

            return 'has exist'
        # 注册设备ID
        self.user_id_manage.create_account(account,passwd,name)
        print('register')
        return 'ok'

    def check_account(self,account,passwd):
        if self.user_id_manage.check_account_passwd(account,passwd):
            print('客户端登陆界面登陆成功')
            return True
        else:
            print('account check error')
            return False
    # 主动登陆
    def login_account(self,account,passwd,sid):
        if self.user_id_manage.check_account_passwd(account,passwd):
            print('客户端登陆成功')
            self.user_id_manage.set_network_connect(account,sid)
            cmdName = "login"
            m_data_json = {"data": "ok"}
            server_data_json = self.msg_packet(cmdName, m_data_json, 200)
            self.socket_io_emit("response", server_data_json)
            return True
        else:
            print('客户端登陆失败')
            cmdName = "login"
            m_data_json = {"data": "error"}
            server_data_json = self.msg_packet(cmdName, m_data_json, 400)
            self.socket_io_emit("response", server_data_json)
            return False
    # 主动退出
    def login_out_account(self,account,passwd,sid):
        print('login out')

    # 断开连接
    def login_out_disconnect_account(self,sid):
        print('客户端断开')
        self.user_id_manage.set_network_disconnect(sid)


    # 消息打包
    def msg_packet(self,cmdName,data,state_code):
        # 状态码
        if state_code == 200:
            responseCode = 200
            responseInfo = 'ok'
        elif state_code == 204:
            responseCode = 204
            responseInfo = 'not find'
        else:
            responseCode = 400
            responseInfo = 'error'

        state_json = {"responseCode": responseCode,"responseInfo":responseInfo}
        abstract_json = {"senderType": "server","msgType": "response","cmdName": str(cmdName)}
        data_json = data
        m_data_json = {"status": state_json, "abstract": abstract_json, "data": data_json}
        return m_data_json