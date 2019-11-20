# project control api
# created by lippon
# 2019-10-22
from module.database.project_sql import ProjectSql
from data_structure.project import Project

class ProjectService:
    def __init__(self, helper, session):
        """
        :type helper: sqlHelper
        """
        self.session = session
        self.mysql_helper = helper
        self.project_sql = ProjectSql(self.mysql_helper)

    def parser_web_data(self, form):
        """
        :type form: Form
        :rtype : str
        """
        func = form.get('function', '')

        if func == "get":
            return self.transfer_projects_to_dict(self.get_all_projects())
        elif func == "edit":
            return self.edit_project(self.transfer_form_to_object(form))
        elif func == "create":
            return self.create_project(self.transfer_form_to_object(form))
        elif func == "delete":
            return self.delete_project_by_id(form.get('id[]'))
        elif func == "choose":
            self.session["nowProject"] = form.get('project')
            return "success"

    def create_project(self, project):
        """
        :type project: Project
        :rtype : str
        """
        if self.project_sql.is_project_name_exist(project.get_project_name()):
            return "existed"
        else:
            self.project_sql.create_project(project.get_project_name(), project.get_project_status(),
                                            project.get_user_name())
            return "success"

    def edit_project(self, project):
        """
        :type project: Project
        :rtype : str
        """
        if self.project_sql.is_project_id_exist(project.get_project_id()):
            self.project_sql.edit_project(project.get_project_id(), project.get_project_name(),
                                          project.get_user_name(), project.get_project_status())
            return "success"
        else:
            return "non-existed"

    # 用于向前端表格提交数据
    def transfer_projects_to_dict(self, projects):
        """
        :type projects: list[Project]
        :rtype : dict
        """
        # 前端表格数据id
        data = dict()
        data["id"] = []
        data["name"] = []
        data["status"] = []
        data["user"] = []
        for project in projects:
            data["id"].append(project.get_project_id())
            data["name"].append(project.get_project_name())
            data["status"].append(project.get_project_status())
            data["user"].append(project.get_user_name())

        return data

    def get_all_projects(self):
        """
        :rtype : list[Project]
        """
        return self.transfer_sql_data(self.project_sql.get_all_projects())

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
            project.set_user_name(row[3])

            projects.append(project)

        return projects

    def transfer_form_to_object(self, form):
        """
        :type form: Form
        :rtype : Project
        """
        project = Project()

        project.set_project_id(form.get('id', ''))
        project.set_project_name(form.get('name', ''))
        project.set_user_name(form.get('user', ''))
        project.set_project_status(form.get('status', ''))

        return project

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

    def delete_project_by_id(self, ids):
        """
        :type ids: list[int]
        :rtype : str
        """
        # 因为id不由人为修改，因此一般不需查询其是否存在
        for id in ids:
            self.project_sql.delete_project_by_id(id)
        return "success"
