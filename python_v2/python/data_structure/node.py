# node data structure file
# created by lippon
# 2019-11-11

# 宏常量分为数据库和返回字典，不要搞混，增减属性的时候需要都修改
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

class Node:
    def __init__(self):
        self.node_id = 0
        self.node_name = "null"
        self.manage_ip = "null"
        self.node_type = "null"
        self.hardware_architecture = "null"
        self.operating_system = "null"
        self.number_port = 0
        self.number_internal_module = 0
        self.number_internal_link = 0
        self.image_name = "null"
        self.node_status = "null"
        self.scenario_id = 0
        self.x = 0
        self.y = 0
        self.z = 0
        self.flavor_type = "null"
        self.uuid = "null"
        self.icon_url = "null"
        self.cn_id = 0

    def get_node_id(self):
        return self.node_id

    def set_node_id(self, data):
        self.node_id = data

    def get_node_name(self):
        return self.node_name

    def set_node_name(self, data):
        self.node_name = data

    def get_manage_ip(self):
        return self.manage_ip

    def set_manage_ip(self, data):
        self.manage_ip = data

    def get_node_type(self):
        return self.node_type

    def set_node_type(self, data):
        self.node_type = data

    def get_hardware_architecture(self):
        return self.hardware_architecture

    def set_hardware_architecture(self, data):
        self.hardware_architecture = data

    def get_operating_system(self):
        return self.operating_system

    def set_operating_system(self, data):
        self.operating_system = data

    def get_number_port(self):
        return self.number_port

    def set_number_port(self, data):
        self.number_port = data

    def get_number_internal_module(self):
        return self.number_internal_module

    def set_number_internal_module(self, data):
        self.number_internal_module = data

    def get_number_internal_link(self):
        return self.number_internal_link

    def set_number_internal_link(self, data):
        self.number_internal_link = data

    def get_image_name(self):
        return self.image_name

    def set_image_name(self, data):
        self.image_name = data

    def get_node_status(self):
        return self.node_status

    def set_node_status(self, data):
        self.node_status = data

    def get_scenario_id(self):
        return self.scenario_id

    def set_scenario_id(self, data):
        self.scenario_id = data

    def get_x(self):
        return self.x

    def set_x(self, data):
        self.x = data

    def get_y(self):
        return self.y

    def set_y(self, data):
        self.y = data

    def get_z(self):
        return self.z

    def set_z(self, data):
        self.z = data

    def get_flavor_type(self):
        return self.flavor_type

    def set_flavor_type(self, data):
        self.flavor_type = data

    def get_uuid(self):
        return self.uuid

    def set_uuid(self, data):
        self.uuid = data

    def get_icon_url(self):
        return self.icon_url

    def set_icon_url(self, data):
        self.icon_url = data

    def get_cn_id(self):
        return self.cn_id

    def set_cn_id(self, data):
        self.cn_id = data

    def to_dict(self):

        node = dict()

        node[NODE_ID] = self.node_id
        node[NODE_NAME] = self.node_name
        node[NODE_MANAGE_IP] = self.manage_ip
        node[NODE_TYPE] = self.node_type
        node[NODE_HARDWARE_ARCHITECTURE] = self.hardware_architecture
        node[NODE_OPERATING_SYSTEM] = self.operating_system
        node[NODE_NUMBER_PORT] = self.number_port
        node[NODE_NUMBER_INTERNAL_LINK] = self.number_internal_link
        node[NODE_IMAGE_NAME] = self.image_name
        node[NODE_STATUS] = self.node_status
        node[NODE_SCENARIO_ID] = self.scenario_id
        node[NODE_X] = self.x
        node[NODE_Y] = self.y
        node[NODE_Z] = self.z
        node[NODE_FLAVOR_TYPE] = self.flavor_type
        node[NODE_UUID] = self.uuid
        node[NODE_ICON_URL] = self.icon_url
        node[NODE_CN_ID] = self.cn_id

        return node




