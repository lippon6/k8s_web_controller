# scenario data structure file
# created by lippon
# 2019-11-11

class Scenario:
    def __init__(self):
        self.scenario_id = 0
        self.scenario_name = ""
        self.project_id = 0
        self.number_port = 0
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

    def get_number_port(self):
        return self.number_port

    def set_number_port(self, data):
        self.number_port = data

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



