# created by lippon
# 2019-10-14

import uuid
import datetime

# 用户账户管理
class UserIDManage(object,):
    def __init__(self, mysql_obj, table_name):
        self.mysql_obj = mysql_obj
        self.table_name = table_name

    # 账号是否存在
    def is_exist_account(self,account):
        sql_cmd = "select user_account from "+self.table_name+" where user_account=\'"+str(account)+"\';"
        self.mysql_obj.query_cmd(sql_cmd)
        # 获得数据
        row = self.mysql_obj.get_all_row()
        #print(row)
        if row:
            id = row[0][0]
            return True
        else:
            return False

    # 创建账号
    def create_account(self, account, passwd, name):
        if self.is_exist_account(account):
            # 创建用户
            return False
        #创建账号
        key = uuid.uuid1()
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        sql_data = "null,\'" + str(key) + "\',\'" + str(account)+"\',\'"+str(passwd)+"\',\'"+str(time)+"\',\'"+str(name)+"\'"
        print(sql_data)
        if self.mysql_obj.insert_noarg_mysql(self.table_name,sql_data):
            print('create account ok')
            return True
        else:
            print('create account error')
            return False

    # 根据SID或者账号
    def get_network_sid_account(self,sid):
        # 查询sid
        sql_cmd = "select user_account from " + self.table_name + " where network_sid=\'" + str(sid) + "\';"
        self.mysql_obj.query_cmd(sql_cmd)
        # 获得数据
        list = self.mysql_obj.get_all_row()
        if list:
            return list[0][0]

    # 检查用户的账号和密码
    def check_account_passwd(self, account, passwd):
        if not self.is_exist_account(account):
            return False

        sql_cmd = "select * from "+self.table_name+" where user_account=\'"+str(account)+"\' and  user_passwd=\'"+str(passwd)+"\';"
        self.mysql_obj.query_cmd(sql_cmd)
        # 获得数据
        row = self.mysql_obj.get_all_row()
        if row:
            m_account = str(row[0][2])
            m_passwd = str(row[0][3])
            if m_account == account and m_passwd == passwd:
                return True
            else:
                return False
        else:
            print('check error')

    def get_account_id(self, account):
        """
        :type account: str
        :rtype : int
        """
        if not self.is_exist_account(account):
            return False

        sql_cmd = "select * from " + self.table_name + " where user_account=\'" + str(
            account) + "\';"
        self.mysql_obj.query_cmd(sql_cmd)
        # 获得数据
        row = self.mysql_obj.get_all_row()
        if row:
            return row[0]
        else:
            return None






