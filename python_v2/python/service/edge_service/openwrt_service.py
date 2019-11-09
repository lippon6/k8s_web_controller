# openwrt control api
# created by lippon
# 2019-10-20

import yaml
from os import path

DEPLOYMENT_PATH = "..\..\config\lede_test1.yml"
LABEL_APP_NAME = {'app': 'lede-test'}
MAX_NODE_NUMBER = 100

class OpenWrtHelper:
    def __init__(self, helper, offloading):
        """
        :type helper: K8sHelper
        :type offloading: OffloadingManageService
        """
        self.depFile = DEPLOYMENT_PATH
        self.k8sHelper = helper
        self.offloadingHelper = offloading

    def get_nodes_num(self):
        """
        :rtype : list[int]
        """
        dep = self.k8sHelper.get_all_deploy()
        amount = 0
        num = []

        for i in dep.items:
            if i.spec.selector.match_labels == LABEL_APP_NAME:
                num.append(amount)

            amount += 1
        return num

    def get_all_name(self):
        """
        :rtype : list[str]
        """
        dep = self.k8sHelper.get_all_deploy()
        num = self.get_nodes_num()
        name = []

        for i in num:
            name.append(dep.items[i].metadata.name)

        return name

    def create_name(self):
        """
        :rtype : str
        """
        named = self.get_all_name()
        name = "lede-test0"
        num = 0

        while True:
            num += 1
            if name in named:
                name = name[:9] + str(num)
            else:
                break

            if num >= MAX_NODE_NUMBER:
                name = None
                break

        return name

    def create_node(self):
        """
        :rtype : str
        """
        with open(path.join(path.dirname(__file__), DEPLOYMENT_PATH)) as f:
            dep = yaml.safe_load(f)
            name = self.create_name()
            if name is not None:
                dep['metadata']['name'] = name
                # self.k8sHelper.create_deployment(dep)
                self.offloadingHelper.create_deployment(dep)
                return name
        return None

    def test(self):
        with open(path.join(path.dirname(__file__), DEPLOYMENT_PATH)) as f:
            dep = yaml.safe_load(f)
            name = self.create_name()
            if name is not None:
                dep['metadata']['name'] = name
                # self.offloadingHelper.create_deployment(dep)
                print("best node", self.offloadingHelper.select_the_optimal_node(dep))
                return name

    def delete_node(self, name):
        """
        :type name: str
        """
        self.k8sHelper.delete_deployment(name)






