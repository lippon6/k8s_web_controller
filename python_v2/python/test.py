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

    def print_feature(self, inc):
        print(self.heapsterHelper.get_cpu_usage_percent("node01"))
        print(self.heapsterHelper.get_cpu_usage_percent("node02"))
        print(self.heapsterHelper.get_cpu_usage_percent("raspberrypi02"))
        t = Timer(inc, self.print_feature, (inc,))
        t.start()

    def test_for_test(self):

        print(self.project_service.get_all_project())
        # self.openwrtService.create_node()

        # self.infiltraionController.infiltration_control_handle()
        # self.node_networking_check.networking_check_handle()
        # time.sleep(3)
        # self.openwrtHelper.create_node()
        #
        # self.openwrtHelper.test()

        # url = "http://192.168.0.134:8080/api/v2.1/machinestats"
        # P_get = requests.get(url)
        # print(json.loads(P_get.text)[63])

        # print(self.k8sHelper.get_all_ap_nodes())
        # self.k8sHelper.push_node_label_value("node01", "concentration", "90")
        # print(self.heapsterHelper.get_cpu_usage_percent("raspberrypi02"))
        # print(self.k8sHelper.get_all_nodes_ap())
        # for node in self.k8sHelper.get_all_nodes_ip():
        #     print(node)
        # print(self.node_networking_check.all_nodes_network_list())
        # print(self.offloading_manage_service.get_edge_nodes_by_ap('edge01'))
        # self.node_networking_check.check_all_nodes_network_list()
        #
        # print(self.node_networking_check.get_all_ap_network_list(self.k8sHelper.get_all_ap_nodes()))
        # self.infiltraionController.infiltration_control_handle()
        # self.k8sHelper.push_node_label_value("node01", "ai", "1")
        # self.print_feature(0.5)

        # print(self.cadvisorHelper.get_node_cpu_now_rate_of_utilization("node01"))

        # print(self.k8sHelper.get_all_nodes())
        pass
