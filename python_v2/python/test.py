# test file
# created by lippon
# 2019-10-26

import requests
import json
from module.k8s.cadvisor_help_module import  CadvisorHelper
from module.k8s.heapster_help_module import HeapsterHelper
from threading import Timer
from service.infiltration_controller_service import InfiltrationControllerService
from service.node_networking_check_service import NodeNetworkingCheck
from module.ssh.ssh_help_module import SshHelper
from service.offloading_manage_service import OffloadingManageService
from service.openwrt_service import OpenWrtHelper
import time

weight = {'ai': {'cpu': 100, 'memory': 50}}


class Test:
    def __init__(self, k8s):
        self.k8sHelper = k8s
        self.cadvisorHelper = CadvisorHelper(self.k8sHelper)

        self.heapsterHelper = HeapsterHelper(self.k8sHelper)
        self.infiltraionController = InfiltrationControllerService(weight, self.heapsterHelper, self.k8sHelper)
        self.ssh_helper = SshHelper()
        self.node_networking_check = NodeNetworkingCheck(self.ssh_helper, self.k8sHelper)
        self.offloading_manage_service = OffloadingManageService(self.k8sHelper)

        self.openwrtHelper = OpenWrtHelper(self.k8sHelper, self.offloading_manage_service)
    def print_feature(self, inc):
        print(self.heapsterHelper.get_cpu_usage_percent("node01"))
        print(self.heapsterHelper.get_cpu_usage_percent("node02"))
        print(self.heapsterHelper.get_cpu_usage_percent("raspberrypi02"))
        t = Timer(inc, self.print_feature, (inc,))
        t.start()

    def test_for_test(self):
        self.infiltraionController.infiltration_control_handle()
        time.sleep(3)
        #
        # self.openwrtHelper.test()

        # url = "http://192.168.0.134:8080/api/v2.1/machinestats"
        # P_get = requests.get(url)
        # print(json.loads(P_get.text)[63])
        self.openwrtHelper.create_node()

        # self.k8sHelper.push_node_label_value("node01", "concentration", "90")
        # print(self.heapsterHelper.get_cpu_usage_percent("raspberrypi02"))
        # print(self.k8sHelper.get_all_nodes_ap())
        # for node in self.k8sHelper.get_all_nodes_ip():
        #     print(node)
        # print(self.node_networking_check.all_nodes_network_list())
        # print(self.offloading_manage_service.get_edge_nodes_by_ap('edge01'))

        # self.infiltraionController.infiltration_control_handle()
        # self.k8sHelper.push_node_label_value("node01", "ai", "1")
        # self.print_feature(0.5)

        # print(self.cadvisorHelper.get_node_cpu_now_rate_of_utilization("node01"))

        # print(self.k8sHelper.get_all_nodes())
        pass
