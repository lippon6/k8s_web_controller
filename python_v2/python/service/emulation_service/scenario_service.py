# scenario control api
# created by lippon
# 2019-11-10
from module.database.scenario_sql import ScenarioSql
from data_structure.scenario import Scenario
from flask import session

class ScenarioService:
    def __init__(self, helper):
        """
        :type helper: sqlHelper
        """
        self.mysql_helper = helper
        self.scenario_sql = ScenarioSql(self.mysql_helper)

    def parser_web_data(self, form):
        """
        :type form: Form
        :rtype : str
        """
        func = form.get('function', '')

        if func == "get":
            return self.transfer_projects_to_dict(self.get_scenarios_by_project(session["nowProject"]))
        elif func == "edit":
            return self.edit_scenario(self.transfer_form_to_object(form))
        elif func == "create":
            return self.create_scenario(self.transfer_form_to_object(form))
        elif func == "delete":
            return self.delete_scenario_by_id(form.get('id[]'))
        elif func == "choose":
            session["nowScenario"] = form.get('scenario')
            return "success"

    # 用于向前端表格提交数据
    def transfer_projects_to_dict(self, scenarios):
        """
        :type scenarios: list[Scenarios]
        :rtype : dict
        """

        # 前端表格数据id
        data = dict()
        data["scenarioID"] = []
        data["scenarioName"] = []
        data["projectID"] = []
        data["numberNode"] = []
        data["numberSimpleNode"] = []
        data["numberComplexNode"] = []
        data["dynamicTopologyFile"] = []
        data["scenarioStatus"] = []
        data["scenarioType"] = []

        for scenario in scenarios:
            data["scenarioID"].append(scenario.get_scenario_id())
            data["scenarioName"].append(scenario.get_scenario_name())
            data["projectID"].append(scenario.get_project_id())
            data["numberNode"].append(scenario.get_number_node())
            data["numberSimpleNode"].append(scenario.get_number_simple_node())
            data["numberComplexNode"].append(scenario.get_number_complex_node())
            data["dynamicTopologyFile"].append(scenario.get_dynamic_topology_file())
            data["scenarioStatus"].append(scenario.get_scenario_status())
            data["scenarioType"].append(scenario.get_scenario_type())

        return data

    def transfer_form_to_object(self, form):
        """
        :type form: Form
        :rtype : Scenario
        """
        scenario = Scenario()

        scenario.set_scenario_id(form.get('scenarioID', ''))
        scenario.set_scenario_name(form.get('scenarioName', ''))
        scenario.set_project_id(form.get('projectID', ''))
        scenario.set_number_node(form.get('numberNode', ''))
        scenario.set_number_simple_node(form.get('numberSimpleNode', ''))
        scenario.set_number_complex_node(form.get('numberComplexNode', ''))
        scenario.set_dynamic_topology_file(form.get('dynamicTopologyFile', ''))
        scenario.set_scenario_status(form.get('scenarioStatus', ''))
        scenario.set_scenario_type(form.get('scenarioType', ''))

        return scenario

    def create_scenario(self, scenario):
        """
        :type scenario: Scenario
        :rtype : bool
        """
        scenario.set_project_id(session["nowProject"])
        if self.scenario_sql.is_name_exist(scenario.get_scenario_name()):
            return "existed"
        else:
            if self.scenario_sql.create_scenario(scenario.get_scenario_name(), scenario.get_project_id(),
                                              scenario.get_dynamic_topology_file(),
                                              scenario.get_scenario_status(),
                                              scenario.get_scenario_type()):
                return "success"

    def edit_scenario(self, scenario):
        """
        :type scenario: Scenario
        :rtype : bool
        """
        if self.scenario_sql.is_name_exist(scenario.get_scenario_name()):
            return "existed"
        else:
            self.scenario_sql.edit_scenario(scenario.get_scenario_id(), scenario.get_scenario_name(),
                                            scenario.get_project_id(), scenario.get_dynamic_topology_file(),
                                            scenario.get_scenario_status(), scenario.get_scenario_type())
        return "success"

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

    def delete_scenario_by_id(self, ids):
        """
        :type ids: list[int]
        :rtype : bool
        """
        print(ids)
        for id in ids:
            self.scenario_sql.delete_scenario_by_id(id)
        return "success"

