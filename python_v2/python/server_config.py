# ----------------------------------------------------------------------------------------------------------------------
# Copyright©
# File Name : server.py
# Author    : lippon
# Brief     : mysql login config info
# Date      : 2019.10.13
# ----------------------------------------------------------------------------------------------------------------------
# Modifier                                    Data                                             Brief
# ----------------------------------------------------------------------------------------------------------------------

class ServerConfig(object):
    def __init__(self):

        # 数据库服务器地址
        self.mysql_server_ip = "localhost"
        self.mysql_server_port = 3306
        self.mysql_server_account = "root"
        self.mysql_server_passwd = "123456"
        self.mysql_server_db = "k8s_controller"

        # k8s相应文件目录
        self.k8s_config_file = "config\kubeconfig.yaml"


    def get_mysql_server_ip(self):
        return self.mysql_server_ip
    def get_mysql_server_port(self):
        return self.mysql_server_port
    def get_mysql_server_account(self):
        return self.mysql_server_account
    def get_mysql_server_passwd(self):
        return self.mysql_server_passwd
    def get_mysql_server_db(self):
        return self.mysql_server_db

    def get_k8s_config_file(self):
        return self.k8s_config_file
