# node control api
# created by lippon
# 2019-11-11
from module.database.node_sql import NodeSql
from data_structure.node import Node

class NodeService:
    def __init__(self, helper):
        """
        :type helper: sqlHelper
        """
        self.mysql_helper = helper
        self.node_sql = NodeSql(self.mysql_helper)

    def create_node(self, node):
        """
        :type node: Node
        :rtype : bool
        """
        if self.node_sql.is_name_exist(node.get_node_name()):
            return False
        else:
            self.node_sql.create_node(node)

    def delete_node_by_name(self, name):
        """
        :type name: str
        :rtype : bool
        """
        if self.node_sql.is_name_exist(name):
            return False
        else:
            self.node_sql.delete_node_by_name(name)

    def delete_node_by_scenario(self, scenario):
        """
        :type scenario: str
        :rtype : bool
        """
        self.node_sql.delete_node_by_name(scenario)

    def get_all_nodes(self):
        """
        :rtype : list[Node]
        """
        return self.transfor_sql_data(self.node_sql.get_all_nodes())

    def transfor_sql_data(self, data):
        """
        :type data: tuple
        :rtype : list[Node]
        """
        nodes = []

        for row in data:
            node = Node()
            node.set_node_id(row[0])
            node.set_node_name(row[1])
            node.set_manage_ip(row[2])
            node.set_node_type(row[3])
            node.set_hardware_architecture(row[4])
            node.set_operating_system(row[5])
            node.set_number_port(row[6])
            node.set_number_internal_module(row[7])
            node.set_number_internal_link(row[8])
            node.set_image_name(row[9])
            node.set_node_status(row[10])
            node.set_scenario_id(row[11])
            node.set_x(row[12])
            node.set_y(row[13])
            node.set_z(row[14])
            node.set_flavor_type(row[15])
            node.set_uuid(row[16])
            node.set_icon_url(row[17])
            node.set_cn_id(row[18])
            nodes.append(node)

        return nodes

