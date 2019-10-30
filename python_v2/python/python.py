# ----------------------------------------------------------------------------------------------------------------------
# Copyright©
# File Name : python.py
# Author    : lippon
# Brief     : The encoding format of this file is UTF-8.
#             This file is the main file of project.
# Date      : 2019.10.13
# ----------------------------------------------------------------------------------------------------------------------
# Modifier                                    Data                                             Brief
# ----------------------------------------------------------------------------------------------------------------------


# official module
import os
import sys
import flask
from flask import Flask, render_template,session,request,jsonify,redirect,url_for
from flask import send_from_directory
from flask_socketio import SocketIO, Namespace, emit
from flask_socketio import join_room, leave_room
from datetime import timedelta

# user module
from message_parse_manage.message_parse_manage import MessageParseManage
from client_manage.user_client_manage.user_account_manage import UserAccountManage
from module.mysql_help_module import sqlHelper
from module.k8s_help_module import K8sHelper
from module.openwrt_help_module import OpenWrtHelper

from server_config import ServerConfig

from test import Test

# get the system platform
print(sys.platform)
system_use_windows = 0
if sys.platform == 'wind32' or sys.platform == 'wind64':
    system_use_windows = 1

# flask init
app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
app.config['SECRET_KEY']=os.urandom(24)   #设置为24位的字符,每次运行服务器都是不同的，所以服务器启动一次上次的session就清除。
app.config['PERMANENT_SESSION_LIFETIME']=timedelta(days=7) #设置session的保存时间。
app.config['ssl_context']='adhoc'
socketio = SocketIO(app)
M_WEBSOCKET_RESPONSE='response'


# config information
server_config = ServerConfig()

# database
mysql_server_ip = server_config.get_mysql_server_ip()
mysql_server_port = server_config.get_mysql_server_port()
mysql_server_account = server_config.get_mysql_server_account()
mysql_server_passwd = server_config.get_mysql_server_passwd()
mysql_server_db = server_config.get_mysql_server_db()

sql_util = sqlHelper(mysql_server_ip,mysql_server_port,mysql_server_account,mysql_server_passwd,mysql_server_db)
sql_util.connect_mysql()

# k8s helper
k8s_config_file = server_config.get_k8s_config_file()
k8sHelper = K8sHelper(k8s_config_file)

# openwrt helper
openwrtHelper = OpenWrtHelper(k8sHelper)

# user manage init
user_account_manage = UserAccountManage(sql_util,join_room,leave_room,emit)

# web messages parse
message_parse_manage = MessageParseManage(sql_util,emit)

test = Test(k8sHelper, openwrtHelper)

test.test_for_test()

# web route
@app.route('/')
def index():
    return render_template('login.html')

# 用户登陆
@app.route('/login.html')
def login_html():
    return render_template('login.html')

# 注册
@app.route('/register.html')
def register():
    return render_template('register.html')

# 首页
@app.route('/index.html')
def index_html():
    return render_template('index.html')

# 工程界面
@app.route('/projectPage.html')
def mapPage():
    return render_template('projectPage.html')

# 场景界面
@app.route('/scenePage.html')
def scenePage():
    return render_template('scenePage.html')

# 仿真界面
@app.route('/simulationPage.html')
def simulationPage():
    return render_template('simulationPage.html')

# 统计界面
@app.route('/statisticalPage.html')
def statisticalPage():
    return render_template('statisticalPage.html')

# 用户管理界面
@app.route('/userManagePage.html')
def userManagePage():
    return render_template('userManagePage.html')

# 用户管理界面
@app.route('/roleManagePage.html')
def roleManagePage():
    return render_template('roleManagePage.html')


@app.route("/login", methods=["POST"])
def login():
    account = request.form.get('account', '')
    password = request.form.get('password', '')

    if user_account_manage.check_account(account, password):
        new_login = "login_state"
        session['account'] = account
        session['passwd'] = password
        session[new_login] = 'ok'
        return jsonify({'data': 'login ok'})
    else:
        return jsonify({'data': 'login error'})


@app.route("/register_account", methods=["POST"])
def register_account():
    account = request.form.get('account', '')
    password = request.form.get('password', '')
    name = request.form.get('name', '')
    data = user_account_manage.register_account(account,password,name)
    if data == 'ok':
        return jsonify({'data': 'register ok'})
    else:
        return jsonify({'data': 'register error'})

#获取session
@app.route('/get_login')
def get():
    account = session.get('account')
    passwd = session.get('passwd')
    if account:
        return jsonify({'account': account,'passwd':passwd})
    else:
        return jsonify({'data': 'login error'})



@app.route('/usr')
def user():
    return render_template('usr.html')

@app.route("/download/<filename>", methods=['GET'])
def download_file(filename):
    print('download')
    # 需要知道2个参数, 第1个参数是本地目录的path, 第2个参数是文件名(带扩展名)
    directory = os.getcwd()  # 假设在当前目录
    if system_use_windows:
        directory = directory + "\\home\\usr\\notify_pdf"
    else:
        directory = directory + "/home/usr/notify_pdf"
    print(directory)
    return send_from_directory(directory, filename, as_attachment=True)


class M_WebSocketNamespace(Namespace):

    # 注册发送函数,和加入房间函数,离开房间函数
    def init(self,arg_socket_io_emit,arg_join_room,arg_leave_room):
        self.m_socke_io_emit = arg_socket_io_emit
        self.m_join_room = arg_join_room
        self.m_leave_room = arg_leave_room

        self.m_network_private_key = None
        self.index = 5

    # 连接成功
    def on_connect(self):
        print('webscoket Client connect')

    # 客服端断开连接
    def on_disconnect(self):
        print('websocekt Client disconnected')
        user_account_manage.login_out_disconnect_account(flask.request.sid)

    def on_login(self, data):
        self.usr_name  = data['user_name']
        self.user_passwd = data['user_passwd']
        user_account_manage.login_account(self.usr_name, self.user_passwd, flask.request.sid)

    # 解析器
    def on_response(self, data):
        if data != None:
            message_parse_manage.message_parse(data, self.usr_name)


if __name__ == '__main__':

    websocket = M_WebSocketNamespace('/dashboard')
    websocket.init(emit,join_room,leave_room)
    socketio.on_namespace(websocket)
    socketio.run(app,host='0.0.0.0')


