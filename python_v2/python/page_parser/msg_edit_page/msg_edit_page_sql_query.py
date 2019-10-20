import json
# 消息编辑界面的请求
class MsgEditPageSqlQuery(object):
    def __init__(self,mysql_obj,arg_emit):
        self.mysql_obj = mysql_obj
        self.table_name = 'tractor_data'
        self.socket_io_emit = arg_emit
        self.M_WEBSOCKET_RESPONSE = 'response'
    # 路由
    def router(self,data):
        query_name =data['query_name']
        query_arg_data = data['query_arg_data']

        # 路由
        if query_name == 'get_province':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': self.get_province(query_arg_data)})

        if query_name == 'get_city':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': self.get_city(query_arg_data)})

        if query_name == 'get_producer':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': self.get_producer(query_arg_data)})

        if query_name == 'get_serviver':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': self.get_serviver(query_arg_data)})

        if query_name == 'get_brand':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': self.get_brand(query_arg_data)})
        if query_name == 'get_model':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': self.get_model(query_arg_data)})
        if query_name == 'get_num':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE, {'cmdName': query_name, 'data': self.get_num(query_arg_data)})
        if query_name == 'find_num':
            return self.socket_io_emit(self.M_WEBSOCKET_RESPONSE,{'cmdName': query_name, 'data': self.find_num(query_arg_data)})

    # 获得省份
    def get_province(self,data):

        # 整理查询条件
        sql_cmd = "select DISTINCT province_name from " + self.table_name + ";"

        # 查询数据
        self.mysql_obj.query_cmd(sql_cmd)
        list = self.mysql_obj.get_all_row()
        province_list = []
        for list_item in list:
            vale = list_item[0]
            province_list.append(vale)
        return province_list

    # 获得市
    def get_city(self,msg_data_json):

        area_select_province= msg_data_json['area_select_province']

        cmd_temp = "select DISTINCT city_name from " + self.table_name+" "
        str_and = 'and '
        str_where='where '
        is_data_before = 0

        # 整理查询条件
        if area_select_province != 'all':
            is_data_before = 1
            cmd_temp  =  cmd_temp + str_where+"province_name=\'"+area_select_province+"\'"
        cmd_temp = cmd_temp + ";"

        # 查询数据
        self.mysql_obj.query_cmd(cmd_temp)
        list = self.mysql_obj.get_all_row()
        province_list = []
        for list_item in list:
            vale = list_item[0]
            province_list.append(vale)
        return province_list


    # 获得生产厂家
    def get_producer(self,msg_data_json):
        area_select_province= msg_data_json['area_select_province']
        area_select_city= msg_data_json['area_select_city']

        cmd_temp = "select DISTINCT producer from " + self.table_name+" "
        str_and = 'and '
        str_where='where '
        is_data_before = 0

        # 整理查询条件
        if area_select_province != 'all':
            is_data_before = 1
            cmd_temp  =  cmd_temp + str_where+"province_name=\'"+area_select_province+"\'"
        if area_select_city != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp +str_where
            cmd_temp  =  cmd_temp + "city_name=\'"+area_select_city+"\'"
        cmd_temp = cmd_temp + ";"

        # 查询数据
        self.mysql_obj.query_cmd(cmd_temp)
        list = self.mysql_obj.get_all_row()
        province_list = []
        for list_item in list:
            vale = list_item[0]
            province_list.append(vale)
        return province_list

    # 获得服务商
    def get_serviver(self,msg_data_json):

        area_select_province= msg_data_json['area_select_province']
        area_select_city= msg_data_json['area_select_city']
        vendor_select_producer= msg_data_json['vendor_select_producer']

        cmd_temp = "select DISTINCT servicer from " + self.table_name + " "
        str_and = 'and '
        str_where = 'where '
        is_data_before = 0

        # 整理查询条件
        if area_select_province != 'all':
            is_data_before = 1
            cmd_temp = cmd_temp + str_where + "province_name=\'" + area_select_province + "\'"
        if area_select_city != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "city_name=\'" + area_select_city + "\'"

        if vendor_select_producer != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "producer=\'" + vendor_select_producer + "\'"
        cmd_temp = cmd_temp + ";"

        # 查询数据
        self.mysql_obj.query_cmd(cmd_temp)
        list = self.mysql_obj.get_all_row()
        province_list = []
        for list_item in list:
            vale = list_item[0]
            province_list.append(vale)
        return province_list

    # 品牌
    def get_brand(self,msg_data_json):

        area_select_province= msg_data_json['area_select_province']
        area_select_city= msg_data_json['area_select_city']
        vendor_select_producer= msg_data_json['vendor_select_producer']
        vendor_select_servicer= msg_data_json['vendor_select_servicer']

        cmd_temp = "select DISTINCT brand from " + self.table_name + " "
        str_and = 'and '
        str_where = 'where '
        is_data_before = 0

        # 整理查询条件
        if area_select_province != 'all':
            is_data_before = 1
            cmd_temp = cmd_temp + str_where + "province_name=\'" + area_select_province + "\'"
        if area_select_city != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "city_name=\'" + area_select_city + "\'"

        if vendor_select_producer != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "producer=\'" + vendor_select_producer + "\'"

        if vendor_select_servicer != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "servicer=\'" + vendor_select_servicer + "\'"
        cmd_temp = cmd_temp + ";"

        # 查询数据
        self.mysql_obj.query_cmd(cmd_temp)
        list = self.mysql_obj.get_all_row()
        province_list = []
        for list_item in list:
            vale = list_item[0]
            province_list.append(vale)
        return province_list

    # 获得类型
    def get_model(self,msg_data_json):

        area_select_province= msg_data_json['area_select_province']
        area_select_city= msg_data_json['area_select_city']
        vendor_select_producer= msg_data_json['vendor_select_producer']
        vendor_select_servicer= msg_data_json['vendor_select_servicer']
        vendor_select_brand= msg_data_json['vendor_select_brand']

        cmd_temp = "select DISTINCT model from " + self.table_name + " "
        str_and = 'and '
        str_where = 'where '
        is_data_before = 0

        # 整理查询条件
        if area_select_province != 'all':
            is_data_before = 1
            cmd_temp = cmd_temp + str_where + "province_name=\'" + area_select_province + "\'"
        if area_select_city != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "city_name=\'" + area_select_city + "\'"

        if vendor_select_producer != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "producer=\'" + vendor_select_producer + "\'"

        if vendor_select_servicer != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "servicer=\'" + vendor_select_servicer + "\'"
        if vendor_select_brand != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "brand=\'" + vendor_select_brand + "\'"
        cmd_temp = cmd_temp + ";"

        # 查询数据
        self.mysql_obj.query_cmd(cmd_temp)
        list = self.mysql_obj.get_all_row()
        province_list = []
        for list_item in list:
            vale = list_item[0]
            province_list.append(vale)
        return province_list
    # 获得拖拉机编号
    def get_num(self,msg_data_json):

        area_select_province= msg_data_json['area_select_province']
        area_select_city= msg_data_json['area_select_city']
        vendor_select_producer= msg_data_json['vendor_select_producer']
        vendor_select_servicer= msg_data_json['vendor_select_servicer']
        vendor_select_brand= msg_data_json['vendor_select_brand']
        vendor_select_model= msg_data_json['vendor_select_model']

        cmd_temp = "select DISTINCT id from " + self.table_name + " "
        str_and = 'and '
        str_where = 'where '
        is_data_before = 0

        # 整理查询条件
        if area_select_province != 'all':
            is_data_before = 1
            cmd_temp = cmd_temp + str_where + "province_name=\'" + area_select_province + "\'"
        if area_select_city != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "city_name=\'" + area_select_city + "\'"

        if vendor_select_producer != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "producer=\'" + vendor_select_producer + "\'"

        if vendor_select_servicer != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "servicer=\'" + vendor_select_servicer + "\'"
        if vendor_select_brand != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "brand=\'" + vendor_select_brand + "\'"
        if vendor_select_model != 'all':
            if is_data_before:
                cmd_temp = cmd_temp + str_and
            else:
                is_data_before = 1
                cmd_temp = cmd_temp + str_where
            cmd_temp = cmd_temp + "model=\'" + vendor_select_model + "\'"
        cmd_temp = cmd_temp + ";"

        # 查询数据
        self.mysql_obj.query_cmd(cmd_temp)
        list = self.mysql_obj.get_all_row()
        province_list = []
        for list_item in list:
            vale = list_item[0]
            province_list.append(vale)
        return province_list
    # 查找拖拉机编号是否存在
    def find_num(self,msg_json):

        # 整理查询条件
        sql_cmd = "select DISTINCT id from " + self.table_name + " where id=\'"+msg_json+"\';"
        # 查询数据

        self.mysql_obj.query_cmd(sql_cmd)
        list = self.mysql_obj.get_all_row()
        if list:
            id_temp = list[0][0]
            if id_temp == msg_json:
                print('ok')
                return 'ok'
            else:
                print('error')
                return 'error'
        else:
            return 'error'
    # 查找匹配的拖拉机编号
    def pdf_log_find_match_tractor_nums(self,msg_data_json):

        area_select_province= msg_data_json['area_select_province']
        area_select_city= msg_data_json['area_select_city']
        vendor_select_producer= msg_data_json['vendor_select_producer']
        vendor_select_servicer= msg_data_json['vendor_select_servicer']
        vendor_select_brand= msg_data_json['vendor_select_brand']
        vendor_select_model= msg_data_json['vendor_select_model']
        vendor_select_tractor_num = msg_data_json['vendor_select_tractor_num']
        msg_to_one_tractor = msg_data_json['msg_to_one_tractor']
        select_one_tractor_num = msg_data_json['select_tractor_one_num']

        device_num_list = []
        if msg_to_one_tractor == 0:
            cmd_temp = "select DISTINCT id from " + self.table_name + " "
            str_and = 'and '
            str_where = 'where '
            is_data_before = 0

            # 整理查询条件
            if area_select_province != 'all':
                is_data_before = 1
                cmd_temp = cmd_temp + str_where + "province_name=\'" + area_select_province + "\'"
            if area_select_city != 'all':
                if is_data_before:
                    cmd_temp = cmd_temp + str_and
                else:
                    is_data_before = 1
                    cmd_temp = cmd_temp + str_where
                cmd_temp = cmd_temp + "city_name=\'" + area_select_city + "\'"

            if vendor_select_producer != 'all':
                if is_data_before:
                    cmd_temp = cmd_temp + str_and
                else:
                    is_data_before = 1
                    cmd_temp = cmd_temp + str_where
                cmd_temp = cmd_temp + "producer=\'" + vendor_select_producer + "\'"

            if vendor_select_servicer != 'all':
                if is_data_before:
                    cmd_temp = cmd_temp + str_and
                else:
                    is_data_before = 1
                    cmd_temp = cmd_temp + str_where
                cmd_temp = cmd_temp + "servicer=\'" + vendor_select_servicer + "\'"
            if vendor_select_brand != 'all':
                if is_data_before:
                    cmd_temp = cmd_temp + str_and
                else:
                    is_data_before = 1
                    cmd_temp = cmd_temp + str_where
                cmd_temp = cmd_temp + "brand=\'" + vendor_select_brand + "\'"
            if vendor_select_model != 'all':
                if is_data_before:
                    cmd_temp = cmd_temp + str_and
                else:
                    is_data_before = 1
                    cmd_temp = cmd_temp + str_where
                cmd_temp = cmd_temp + "model=\'" + vendor_select_model + "\'"
            cmd_temp = cmd_temp + ";"

            # 查询数据
            self.mysql_obj.query_cmd(cmd_temp)
            list = self.mysql_obj.get_all_row()
            province_list = []
            for list_item in list:
                vale = list_item[0]
                province_list.append(vale)
            device_num_list = province_list
        else:
            # 整理查询条件
            sql_cmd = "select DISTINCT id from " + self.table_name + " where id=\'" + select_one_tractor_num + "\';"
            # 查询数据
            self.mysql_obj.query_cmd(sql_cmd)
            list = self.mysql_obj.get_all_row()
            print('this is began')
            print(list)
            print(select_one_tractor_num)
            if list:
                id_temp = list[0][0]
                if id_temp == select_one_tractor_num:
                    device_num_list.append(select_one_tractor_num)
                else:
                    print('find error')

        return device_num_list

