class UserControlLog(object):
    def __init__(self,mysql_obj):
        self.mysql_obj = mysql_obj
        self.table_name  = 'user_control_log'

    # 插入数据
    def insert_new_log(self,account,control_device_id,cmdName,cmdData,control_time,control_uuid,is_device_on_line):
        sql_data = "\'" + str(account) + "\'," + str(control_device_id) + ",\'" + str(cmdName) + "\',\'" + str(cmdData) + "\',\'" + str(control_time) + "\',\'" + str(control_uuid) + "\',"+str(is_device_on_line)+",0,0"
        #print(sql_data)
        if self.mysql_obj.insert_noarg_mysql(self.table_name,sql_data):
            print('create control log ok')
            return True
        else:
            print('create control log error')
            return False

    # 拖拉机的回复
    def tractor_response_control(self,device_id,control_uuid,is_sucess):
        # 查询是否存在
        sql_cmd = "select account from " + self.table_name + " where control_device_id=" + str(device_id) + " and control_uuid=\'"+control_uuid+"\';"
        self.mysql_obj.query_cmd(sql_cmd)
        # 获得数据
        list = self.mysql_obj.get_all_row()
        # 如果找到了账号,就证明是对的
        if list:
            #插入数据
            print('is data response')
            value = "is_device_response=1,is_msg_sucess="+str(is_sucess)
            key = 'control_uuid=\'' + str(control_uuid)+"\'"
            return self.mysql_obj.update_mysql(self.table_name, value, key)

    def is_control_msg_sucess(self,device_id,control_uuid):
        # 查询是否存在
        sql_cmd = "select account from " + self.table_name + " where control_device_id=" + str(
            device_id) + " and control_uuid=\'" + control_uuid + "\';"
        self.mysql_obj.query_cmd(sql_cmd)
        # 获得数据
        list = self.mysql_obj.get_all_row()
        # 如果找到了账号,就证明是对的
        if list:
            #查询回复和状态
            sql_cmd = "select is_device_response,is_msg_sucess from " + self.table_name + " where control_device_id=" + str(device_id) + " and control_uuid=\'" + control_uuid + "\';"
            self.mysql_obj.query_cmd(sql_cmd)
            # 获得数据
            list = self.mysql_obj.get_all_row()
            if list:
                is_response = list[0][0]
                is_sucess = list[0][1]
                data = []
                data.append(is_response)
                data.append(is_sucess)
                print(list)
