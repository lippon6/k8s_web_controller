# project control api
# created by lippon
# 2019-10-22
from module.database.project_sql import ProjectSql

class ProjectService:
    def __init__(self, helper):
        """
        :type helper: sqlHelper
        """
        self.mysql_helper = helper
        self.project_sql = ProjectSql(self.mysql_helper)

    def create_project(self, name, user):
        """
        :type name: str
        :type user: int
        :rtype : str
        """
        if self.project_sql.is_project_name_exist(name):
            return "existed"
        else:
            self.project_sql.create_project(name, user)
            return "success"

    def get_all_project(self):
        """
        :rtype : dict
        """
        information = {}
        pid = []
        name = []
        user = []

        projects = self.project_sql.get_all_project()

        for row in projects:
            pid.append(row[0])
            name.append(row[1])
            user.append(row[3])

        information['id'] = pid
        information['name'] = name
        information['user'] = user

        return information

    def delete_project(self, name):
        """
        :type name: str
        :rtype : str
        """
        if not self.project_sql.is_project_name_exist(name):
            return "not existed"
        else:
            self.project_sql.delete_project(name)
            return "success"

