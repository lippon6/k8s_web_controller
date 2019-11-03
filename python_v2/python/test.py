# test file
# created by lippon
# 2019-10-26

import requests
import json
from module.cadvisor_help_module import  CadvisorHelper
from module.heapster_help_module import HeapsterHelper
from datetime import datetime
from threading import Timer
from module.infiltration_controller_module import InfiltrationAlgorithmController

weight = {'ai': {'cpu': 100, 'memory': 50}}

class Test:
    def __init__(self, k8s, openwrt):
        self.k8sHelper = k8s
        self.cadvisorHelper = CadvisorHelper(self.k8sHelper)
        self.openwrtHelper = openwrt
        self.heapsterHelper = HeapsterHelper(self.k8sHelper)
        self.infiltraionController = InfiltrationAlgorithmController(weight, self.heapsterHelper, self.k8sHelper)

    def print_feature(self, inc):
        print(self.heapsterHelper.get_cpu_usage_percent("node01"))
        print(self.heapsterHelper.get_cpu_usage_percent("node02"))
        print(self.heapsterHelper.get_cpu_usage_percent("raspberrypi02"))
        t = Timer(inc, self.print_feature, (inc,))
        t.start()

    def test_for_test(self):

        # url = "http://192.168.0.134:8080/api/v2.1/machinestats"
        # P_get = requests.get(url)
        # print(json.loads(P_get.text)[63])
        # self.openwrtHelper.create_node()
        # self.k8sHelper.push_node_label_value("node01", "concentration", "90")
        # print(self.heapsterHelper.get_cpu_usage_percent("raspberrypi02"))
        # print(self.heapsterHelper.get_all_nodes())

        self.infiltraionController.infiltration_control_handle()
        # self.k8sHelper.push_node_label_value("node01", "ai", "1")
        # self.print_feature(0.5)

        # print(self.cadvisorHelper.get_node_cpu_now_rate_of_utilization("node01"))
        pass
