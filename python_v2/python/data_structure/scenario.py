# scenario data structure file
# created by lippon
# 2019-11-11

# 宏常量分为数据库和返回字典，不要搞混，增减属性的时候需要都修改
SCENARIO_ID = "scenario_name"
SCENARIO_NAME = "scenario_name"
PROJECT_ID = "project_id"
NUMBER_NODE = "number_node"
NUMBER_SIMPLE_NODE = "number_simple_node"
NUMBER_COMPLEX_NODE = "number_complex_node"
DYNAMIC_TOPOLOGY_FILE = "dynamic_topology_file"
SCENARIO_STATUS = "scenario_status"
SCENARIO_TYPE = "scenario_type"


class Scenario:
    def __init__(self):
        self.scenario_id = 0
        self.scenario_name = ""
        self.project_id = 0
        self.number_node = 0
        self.number_simple_node = 0
        self.number_complex_node = 0
        self.dynamic_topology_file = ""
        self.scenario_status = 0
        self.scenario_type = 0

    def get_scenario_id(self):
        return self.scenario_id

    def set_scenario_id(self, data):
        self.scenario_id = data

    def get_scenario_name(self):
        return self.scenario_name

    def set_scenario_name(self, data):
        self.scenario_name = data

    def get_project_id(self):
        return self.project_id

    def set_project_id(self, data):
        self.project_id = data

    def get_number_node(self):
        return self.number_node

    def set_number_node(self, data):
        self.number_node = data

    def get_number_simple_node(self):
        return self.number_simple_node

    def set_number_simple_node(self, data):
        self.number_simple_node = data

    def get_number_complex_node(self):
        return self.number_complex_node

    def set_number_complex_node(self, data):
        self.number_complex_node = data

    def get_dynamic_topology_file(self):
        return self.dynamic_topology_file

    def set_dynamic_topology_file(self, data):
        self.dynamic_topology_file = data

    def get_scenario_status(self):
        return self.scenario_status

    def set_scenario_status(self, data):
        self.scenario_status = data

    def get_scenario_type(self):
        return self.scenario_type

    def set_scenario_type(self, data):
        self.scenario_type = data

    def to_dict(self):
        scenario = dict()

        scenario[SCENARIO_ID] = self.scenario_id
        scenario[SCENARIO_NAME] = self.scenario_name
        scenario[PROJECT_ID] = self.project_id
        scenario[NUMBER_NODE] = self.number_node
        scenario[NUMBER_SIMPLE_NODE] = self.number_simple_node
        scenario[NUMBER_COMPLEX_NODE] = self.number_complex_node
        scenario[DYNAMIC_TOPOLOGY_FILE] = self.dynamic_topology_file
        scenario[SCENARIO_STATUS] = self.scenario_status
        scenario[SCENARIO_TYPE] = self.scenario_type

        return scenario


