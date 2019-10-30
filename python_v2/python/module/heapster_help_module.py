# heapster read api
# created by lippon
# 2019-10-30

import requests
import json

ROUTE_HEAD = "http://"
ROUTE_PORT = ":30003"
ROUTE_API = "/api/v1/model/"
ROUTE_NODE = "nodes/"


MASTER_NODE_NAME = "k8s-master"

class HeapsterHelper:
    def __init__(self, helper):
        """
        :type helper: K8sHelper
        """
        self.k8sHelper = helper
        try:
            self.masterIP = self.k8sHelper.get_node_ip(MASTER_NODE_NAME)
        except:
            print("bad master name")

    def get_cpu_cores(self, node):
        """
        :type node: str
        :rtype : int
        """
        url = ROUTE_HEAD + self.masterIP + ROUTE_PORT + ROUTE_API + ROUTE_NODE + node + "/metrics/cpu/node_capacity"

        try:
            response = requests.get(url)
        except:
            # bad url
            return None
        return json.loads(response.text)["metrics"][0]["value"]

    def get_cpu_usage_rate(self, node):
        """
        :type node: str
        :rtype : int
        """
        url = ROUTE_HEAD + self.masterIP + ROUTE_PORT + ROUTE_API + ROUTE_NODE + node + "/metrics/cpu/usage_rate"

        try:
            response = requests.get(url)
        except:
            # bad url
            return None

        text = json.loads(response.text)

        return text["metrics"][len(text["metrics"]) - 1]["value"]

    def get_cpu_usage_percent(self, node):
        """
        :type node: str
        :rtype : float
        """
        usage = self.get_cpu_usage_rate(node)
        capacity = self.get_cpu_cores(node)

        if usage is not None and capacity is not None:
            return usage/capacity
        else:
            return None

    def get_memory_capacity(self, node):
        """
        :type node: str
        :rtype : int
        """

    def get_memory_usage(self, node):
        """
        :type node: str
        :rtype : int
        """
    def get_memory_usage_percent(self, node):
        """
        :type node: str
        :rtype : float
        """

    def get_disk_capacity(self, node):
        """
        :type node: str
        :rtype : int
        """

    def get_disk_usage(self, node):
        """
        :type node: str
        :rtype : int
        """

    def get_disk_usage_percent(self, node):
        """
        :type node: str
        :rtype : float
        """