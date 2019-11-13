# project sql api
# created by lippon
# 2019-11-8
SCENARIO_TABLE_NAME = "scenario"
SCENARIO_NAME = "scenario_name"
NUMBER_NODE = "number_node"
NUMBER_SIMPLE_NODE = "number_simple_node"
NUMBER_COMPLEX_NODE = "number_complex_node"
DYNAMIC_TOPOLOGY_FILE = "dynamic_topology_file"
SCENARIO_STATUS = "scenario_status"
SCENARIO_TYPE = "scenario_type"
PROJECT_ID = "project_id"

NODE_INIT_VALUE = '0'

class ScenarioSql:
    def __init__(self, sql_helper):
        """
        :type sql_helper: sqlHelper
        """
        self.mysql_helper = sql_helper

    def create_scenario(self, name, project_id):
        """
        :type name: str
        :type project_id: int
        :rtype : bool
        """
        sql_data = "null,\'" + str(name) + "\',\'" + str(project_id) + "\',\'" + NODE_INIT_VALUE \
                   + "\',\'" + NODE_INIT_VALUE + "\',\'" + NODE_INIT_VALUE + " \', null, null, null"
        print(sql_data)
        if self.mysql_helper.insert_noarg_mysql(SCENARIO_TABLE_NAME, sql_data):
            print('create scenario ok')
            return True
        else:
            print('create scenario error')
            return False

    def is_name_exist(self, name):
        """
        :type name: str
        :rtype : bool
        """
        sql_cmd = "select * from " + SCENARIO_TABLE_NAME + " where " + SCENARIO_NAME + " = \'" + str(name) + "\';"
        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        row = self.mysql_helper.get_all_row()

        if row:
            id = row[0][0]
            return True
        else:
            return False

    def delete_scenario_by_name(self, name):
        """
        :type name: str
        :rtype : bool
        """
        sql = "DELETE FROM %s WHERE %s = '%s' ;" % (SCENARIO_TABLE_NAME, SCENARIO_NAME, name)
        result = self.mysql_helper.query_cmd(sql)
        self.mysql_helper.conn.commit()

        return result

    def delete_scenario_by_project(self, project):
        """
        :type project: int
        :rtype : bool
        """
        sql = "DELETE FROM %s WHERE %s = '%s' ;" % (SCENARIO_TABLE_NAME, PROJECT_ID, project)
        result = self.mysql_helper.query_cmd(sql)
        self.mysql_helper.conn.commit()

        return result

    def get_all_scenarios(self):
        """
        :rtype : tuple
        """
        sql_cmd = "select * from " + SCENARIO_TABLE_NAME + ";"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()

    def get_scenario_by_project(self, project):
        """
        :type project: int
        :rtype : tuple
        """
        sql_cmd = "select * from " + SCENARIO_TABLE_NAME + " where " + PROJECT_ID + "=\'" + str(project)+"\';"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()
