# test file
# created by lippon
# 2019-10-26

import requests
import json
from module.k8s.cadvisor_help_module import  CadvisorHelper
from module.k8s.heapster_help_module import HeapsterHelper
from threading import Timer
from service.edge_service.infiltration_controller_service import InfiltrationControllerService
from service.edge_service.node_networking_check_service import NodeNetworkingCheckService
from module.ssh.ssh_help_module import SshHelper
from service.edge_service.offloading_manage_service import OffloadingManageService
from service.edge_service.openwrt_service import OpenWrtHelper
from service.emulation_service.openwrt_service import OpenWrtService
from service.emulation_service.project_service import ProjectService
from service.emulation_service.scenario_service import ScenarioService
from service.emulation_service.node_service import NodeService
from data_structure.node import Node

import time

weight = {'ai': {'cpu': 100, 'memory': 50}}


class Test:
    def __init__(self, k8s, sql_helper):
        self.k8sHelper = k8s
        self.cadvisorHelper = CadvisorHelper(self.k8sHelper)
        self.heapsterHelper = HeapsterHelper(self.k8sHelper)

        self.ssh_helper = SshHelper()
        self.node_networking_check = NodeNetworkingCheckService(self.ssh_helper, self.k8sHelper)
        self.offloading_manage_service = OffloadingManageService(self.k8sHelper, self.ssh_helper)
        self.infiltraionController = InfiltrationControllerService(weight, self.heapsterHelper, self.k8sHelper,
                                                                   self.node_networking_check)
        self.openwrtHelper = OpenWrtHelper(self.k8sHelper, self.offloading_manage_service)

        self.openwrtService = OpenWrtService(self.k8sHelper)
        self.sql_helper = sql_helper
        self.project_service = ProjectService(self.sql_helper)
        self.scenario_service = ScenarioService(self.sql_helper)
        self.node_service = NodeService(self.sql_helper)

    def print_feature(self, inc):
        print(self.heapsterHelper.get_cpu_usage_percent("node01"))
        print(self.heapsterHelper.get_cpu_usage_percent("node02"))
        print(self.heapsterHelper.get_cpu_usage_percent("raspberrypi02"))
        t = Timer(inc, self.print_feature, (inc,))
        t.start()

    def test_for_test(self):
        node = Node()
        node.set_node_name("node02")
        print(self.node_service.get_node_by_name("node01").to_dict())
        print(self.project_service.get_all_projects()[0].to_dict())
        print(self.scenario_service.get_all_scenarios()[0].to_dict())
        # self.openwrtService.create_node()

