# scenario control api
# created by lippon
# 2019-11-10
from module.database.scenario_sql import ScenarioSql
from data_structure.scenario import Scenario

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
        :rtype : list[Scenario]
        """
        return self.transfer_sql_data(self.scenario_sql.get_all_scenarios())

    def get_scenarios_by_project(self, project):
        """
        :type project: int
        :rtype : list[Scenario]
        """
        return self.transfer_sql_data(self.scenario_sql.get_scenarios_by_project(project))

    def transfer_sql_data(self, data):
        """
        :type data: tuple
        :rtype : list[Scenario]
        """
        scenarios = []

        for row in data:
            scenario = Scenario()
            scenario.set_scenario_id(row[0])
            scenario.set_scenario_name(row[1])
            scenario.set_project_id(row[2])
            scenario.set_number_node(row[3])
            scenario.set_number_simple_node(row[4])
            scenario.set_number_complex_node(row[5])
            scenario.set_dynamic_topology_file(row[6])
            scenario.set_scenario_status(row[7])
            scenario.set_scenario_type(row[8])
            scenarios.append(scenario)

        return scenarios

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

