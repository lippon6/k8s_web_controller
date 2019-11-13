# scenario control api
# created by lippon
# 2019-11-10
from module.database.scenario_sql import ScenarioSql

class ScenarioService:
    def __init__(self, helper):
        """
        :type helper: sqlHelper
        """
        self.mysql_helper = helper
        self.scenario_sql = ScenarioSql(self.mysql_helper)

    def create_scenario(self, name, project_id):
        """
        :type name: str
        :type project_id: int
        :rtype : bool
        """
        if self.scenario_sql.is_name_exist(name):
            return False
        else:
            self.scenario_sql.create_scenario(name, project_id)

    def get_all_scenarios(self):
        """
        :rtype : dict
        """
        return self.transfer_sql_data(self.scenario_sql.get_all_scenarios())

    def get_scenario_by_project(self, project):
        """
        :type project: int
        :rtype : str
        """
        return self.transfer_sql_data(self.scenario_sql.get_scenario_by_project(project))

    def transfer_sql_data(self, data):
        """
        :type data: tuple
        :rtype : str
        """
        information = {}
        sid = []
        name = []
        pid = []
        number_node = []
        number_simple_node = []
        number_complex_node = []
        dynamic_topology_file = []
        scenario_status = []
        scenario_type = []

        for row in data:
            sid.append(row[0])
            name.append(row[1])
            pid.append(row[2])
            number_node.append(row[3])
            number_simple_node.append(row[4])
            number_complex_node.append(row[5])
            dynamic_topology_file.append(row[6])
            scenario_status.append(row[7])
            scenario_type.append(row[8])

        information['sid'] = pid
        information['name'] = name
        information['pid'] = pid
        information['number_node'] = number_node
        information['number_simple_node'] = number_simple_node
        information['number_complex_node'] = number_complex_node
        information['dynamic_topology_file'] = dynamic_topology_file
        information['scenario_status'] = scenario_status
        information['scenario_type'] = scenario_type

        return information

    def delete_scenario_by_name(self, name):
        """
        :type name: str
        :rtype : str
        """
        if not self.scenario_sql.is_name_exist(name):
            return "not existed"
        else:
            self.scenario_sql.delete_scenario_by_name(name)
            return "success"

    def delete_scenario_by_project(self, project):
        """
        :type project: int
        :rtype : bool
        """
        return self.scenario_sql.delete_scenario_by_project(project)

