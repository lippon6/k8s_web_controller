# project sql api
# created by lippon
# 2019-11-8

# 宏常量分为数据库和返回字典，不要搞混，增减属性的时候需要都修改
PROJECT_TABLE_NAME = "project"
PROJECT_ID = "p_id"
PROJECT_NAME = "project_name"
PROJECT_STATUS = "project_status"
PROJECT_USER_ID = "user_id"

class ProjectSql:
    def __init__(self, sql_helper):
        """
        :type sql_helper: sqlHelper
        """
        self.mysql_helper = sql_helper

    def is_project_name_exist(self, name):
        """
        :type name: str
        :rtype : bool
        """
        sql_cmd = "select * from " + PROJECT_TABLE_NAME + " where " + PROJECT_NAME + " = \'" + str(name) + "\';"
        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        row = self.mysql_helper.get_all_row()
        #print(row)
        if row:
            id = row[0][0]
            return True
        else:
            return False

    def create_project(self, name, user):
        """
        :type name: str
        :type user: int
        :rtype : bool
        """
        sql_data = "null,\'" + str(name) + "\',null,\'" + str(user) + "\'"

        if self.mysql_helper.insert_noarg_mysql(PROJECT_TABLE_NAME, sql_data):
            print('create project ok')
            return True
        else:
            print('create project error')
            return False

    def delete_project(self, name):
        """
        :type name: str
        :rtype : bool
        """
        sql = "DELETE FROM %s WHERE %s = '%s' ;" % (PROJECT_TABLE_NAME, PROJECT_NAME, name)
        self.mysql_helper.query_cmd(sql)
        self.mysql_helper.conn.commit()

    def get_all_projects(self):
        """
        :rtype : tuple
        """
        sql_cmd = "select * from " + PROJECT_TABLE_NAME + ";"

        self.mysql_helper.query_cmd(sql_cmd)
        # 获得数据
        return self.mysql_helper.get_all_row()

