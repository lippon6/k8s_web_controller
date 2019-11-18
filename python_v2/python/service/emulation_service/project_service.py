# project control api
# created by lippon
# 2019-10-22
from module.database.project_sql import ProjectSql
from data_structure.project import Project

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

    def get_all_projects(self):
        """
        :rtype : list[Project]
        """

        return  self.transfer_sql_data(self.project_sql.get_all_projects())


    def transfer_sql_data(self, data):
        """
        :type data: tuple
        :rtype : list[Project]
        """
        projects = []

        for row in data:
            project = Project()

            project.set_project_id(row[0])
            project.set_project_name(row[1])
            project.set_project_status(row[2])
            project.set_user_id(row[3])

            projects.append(project)

        return projects

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

