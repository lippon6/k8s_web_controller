# project data structure file
# created by lippon
# 2019-11-11

# 宏常量分为数据库和返回字典，不要搞混，增减属性的时候需要都修改
PROJECT_ID = "p_id"
PROJECT_NAME = "project_name"
PROJECT_STATUS = "project_status"
PROJECT_USER_ID = "user_id"

class Project:
    def __init__(self):
        self.project_id = 0
        self.project_name = ""
        self.project_status = 0
        self.user_id = 0

    def get_project_id(self):
        return self.project_id

    def set_project_id(self, data):
        self.project_id = data

    def get_project_name(self):
        return self.project_name

    def set_project_name(self, data):
        self.project_name = data

    def get_project_status(self):
        return self.project_status

    def set_project_status(self, data):
        self.project_status = data

    def get_user_id(self):
        return self.user_id

    def set_user_id(self, data):
        self.user_id = data

    def to_dict(self):
        project = dict()

        project[PROJECT_ID] = self.project_id
        project[PROJECT_NAME] = self.project_name
        project[PROJECT_STATUS] = self.project_status
        project[PROJECT_USER_ID] = self.user_id

        return project

