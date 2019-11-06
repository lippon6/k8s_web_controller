# infiltration algorithm control api
# created by lippon
# 2019-10-25

from threading import Timer

WEIGHT_MEMORY = "memory"
WEIGHT_CPU = "cpu"
UPDATE_INTERVAL = 2

concentration = {}

class InfiltrationControllerService:
    def __init__(self, weight, heapster_helper, k8s_helper):
        """
        :type weight: dict
        :type heapster_helper: HeapsterHelper
        :type k8s_helper: K8sHelper
        """
        self.heapster_helper = heapster_helper
        self.k8s_helper = k8s_helper
        self.weight = weight
        self.nodes = self.heapster_helper.get_all_nodes()
        self.cpu_value = {}
        self.memory_value = {}
        self.network_value = {}

        # 进程之间的数据需要采用全局变量
        global concentration

        for node in self.nodes:
            concentration[node] = {}

        for node in self.nodes:
            for key in self.weight:
                concentration[node][key] = None

    def get_features_value(self, node):
        """
        :type node: str
        :rtype : void
        """
        self.cpu_value[node] = self.heapster_helper.get_cpu_usage_percent(node)
        self.memory_value[node] = self.heapster_helper.get_memory_usage_percent(node)

    def calculate_concentration(self, node):
        """
        :type node: str
        :rtype : dict
        """
        self.get_features_value(node)

        for key in self.weight:
            son = self.weight[key][WEIGHT_MEMORY]*self.memory_value[node] + \
                  self.weight[key][WEIGHT_CPU]*self.cpu_value[node]

            mom = self.weight[key][WEIGHT_MEMORY] + self.weight[key][WEIGHT_CPU]

            concentration[node][key] = son/mom

        return concentration

    def patch_concentration_label(self, node):
        """
        :type node: str
        :rtype : void
        """
        for key in self.weight:
            if concentration[node][key] is not None:
                self.k8s_helper.push_node_label_value(node, key, str(concentration[node][key]))

    def infiltration_control_step(self):
        """
        :rtype : void
        """
        for node in self.nodes:
            self.get_features_value(node)
            self.calculate_concentration(node)
            self.patch_concentration_label(node)

        self.nodes = self.heapster_helper.get_all_nodes()
        print(concentration)

    def get_optimal_node(self, nodes, weight):
        """
        :type nodes: list[str]
        :type weight: str
        :rtype : str
        """
        if len(nodes) == 0:
            return None

        node = nodes[0]
        for i in nodes:
            if concentration[i][weight] < concentration[node][weight]:
                node = i

        return node

    def infiltration_control_handle(self):
        """
        :rtype : void
        """
        self.infiltration_control_step()
        t = Timer(UPDATE_INTERVAL, self.infiltration_control_handle)
        t.start()

    def get_concentration(self):
        """
        :rtype : dict
        """
        return concentration



