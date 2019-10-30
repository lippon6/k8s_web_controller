# cAdvisor read api
# created by lippon
# 2019-10-29
import requests
import json

ROUTE_HEAD = "http://"
ROUTE_PORT = ":8080"
NODE_MACHINE_STATS_ROUTE = "/api/v2.1/machinestats"
NOW_USAGE_NUM = 63

class CadvisorHelper:
    def __init__(self, helper):
        """
        :type helper: K8sHelper
        """
        self.k8sHelper = helper
        self.ipTable = self.k8sHelper.get_all_nodes_ip()

    def get_node_now_usage(self, node):
        """
        :type node: str
        :rtype node: dict
        """
        url = ROUTE_HEAD + self.ipTable[node] + ROUTE_PORT + NODE_MACHINE_STATS_ROUTE
        try:
            response = requests.get(url)
        except:
            # bad url
            return None
        return json.loads(response.text)[NOW_USAGE_NUM]

    def get_node_cpu_now_rate_of_utilization(self, node):
        """
        :type node: str
        :rtype node: float
        """
        cpu = self.get_node_now_usage(node)['cpu_inst']['usage']

        result = cpu['total']/1000000000
        return result

    def get_node_memory_now_rate_of_utilization(self, node):
        """
        :type node: str
        :rtype node: float
        """

    def get_node_network_now_rate_of_utilization(self, node):
        """
        :type node: str
        :rtype node: float
        """

    def get_node_disk_now_rate_of_utilization(self, node):
        """
        :type node: str
        :rtype node: float
        """








