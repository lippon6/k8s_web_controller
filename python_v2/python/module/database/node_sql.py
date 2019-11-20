# project sql api
# created by lippon
# 2019-11-8

# 宏常量分为数据库和返回字典，不要搞混，增减属性的时候需要都修改
NODE_TABLE_NAME = "node"
NODE_ID = "node_id"
NODE_NAME = "node_name"
NODE_MANAGE_IP = "manage_ip"
NODE_TYPE = "node_type"
NODE_HARDWARE_ARCHITECTURE = "hardware_architecture"
NODE_OPERATING_SYSTEM = "operating_system"
NODE_NUMBER_PORT = "number_port"
NODE_NUMBER_INTERNAL_LINK = "number_internal_link"
NODE_IMAGE_NAME = "image_name"
NODE_STATUS = "node_status"
NODE_SCENARIO_ID = "scenario_id"
NODE_X = "x"
NODE_Y = "y"
NODE_Z = "z"
NODE_FLAVOR_TYPE = "flavor_type"
NODE_UUID = "uuid"
NODE_ICON_URL = "icon_url"
NODE_CN_ID = "cn_id"

class NodeSql:
    def __init__(self, sql_helper):
        """
        :type sql_helper: sqlHelper
        """
        self.mysql_helper = sql_helper

    def is_name_exist(self, name):
        """
        :type name: str
        :rtype : bool
        """
        sql_cmd = "select * from " + NODE_TABLE_NAME + " where " + NODE_NAME + " = \'" + str(name) + "\';"
        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        row = self.mysql_helper.get_all_row()

        if row:
            id = row[0][0]
            return True
        else:
            return False

    def create_node(self, node):
        """
        :type node: Node
        :rtype : bool
        """
        sql_data = "null,'%s',%s,%s,%s,%s,'%s','%s','%s',%s,%s,'%s','%s','%s','%s',%s,%s,%s,'%s'" \
                   % (node.get_node_name(),
                      node.get_manage_ip(),
                      node.get_node_type(),
                      node.get_hardware_architecture(),
                      node.get_operating_system(),
                      node.get_number_port(),
                      node.get_number_internal_module(),
                      node.get_number_internal_link(),
                      node.get_image_name(),
                      node.get_node_status(),
                      node.get_scenario_id(),
                      node.get_x(),
                      node.get_y(),
                      node.get_z(),
                      node.get_flavor_type(),
                      node.get_uuid(),
                      node.get_icon_url(),
                      node.get_cn_id())
        print(sql_data)
        if self.mysql_helper.insert_noarg_mysql(NODE_TABLE_NAME, sql_data):
            print('create node ok')
            return True
        else:
            print('create node error')
            return False

    def get_all_nodes(self):
        """
        :rtype : tuple
        """
        sql_cmd = "select * from " + NODE_TABLE_NAME + ";"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()

    def get_node_by_name(self, name):
        """
        :type name: str
        :rtype : tuple
        """
        sql_cmd = "select * from " + NODE_TABLE_NAME + " where " + NODE_NAME + "=\'" + str(name)+"\';"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()

    def get_nodes_by_scenario(self, scenario):
        """
        :type scenario: int
        :rtype : tuple
        """
        sql_cmd = "select * from " + NODE_TABLE_NAME + " where " + NODE_SCENARIO_ID + "=\'" + str(scenario)+"\';"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()

    def delete_nodes_by_name(self, name):
        """
        :type name: str
        :rtype : tuple
        """
        sql_cmd = "delete from " + NODE_TABLE_NAME + " where " + NODE_NAME + "=\'" + str(name)+"\';"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()

    def delete_nodes_by_scenario(self, scenario):
        """
        :type scenario: int
        :rtype : tuple
        """
        sql_cmd = "delete from " + NODE_TABLE_NAME + " where " + NODE_SCENARIO_ID + "=\'" + str(scenario)+"\';"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()

    def delete_nodes_by_id(self, id):
        """
        :type id: int
        :rtype : tuple
        """
        sql_cmd = "delete from " + NODE_TABLE_NAME + " where " + NODE_NAME + "=\'" + str(id)+"\';"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()
