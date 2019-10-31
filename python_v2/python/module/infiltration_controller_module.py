# infiltration algorithm control api
# created by lippon
# 2019-10-25
WEIGHT_MEMORY = "memory"
WEIGHT_CPU = "cpu"

class InfiltrationAlgorithmController:
    def __init__(self, weight, heapster_helper, k8s_helper):
        """
        :type weight: dict
        """
        self.heapster_helper = heapster_helper
        self.k8s_helper = k8s_helper
        self.weight = weight
        self.nodes = self.heapster_helper.get_all_nodes()
        self.concentration = {}
        self.cpu_value = {}
        self.memory_value = {}
        self.network_value = {}

        for node in self.nodes:
            self.concentration[node] = {}

        for node in self.nodes:
            for key in self.weight:
                self.concentration[node][key] = None

    def get_features_value(self, node):
        """
        :type node: str
        """
        self.cpu_value[node] = self.heapster_helper.get_cpu_usage_percent(node)
        self.memory_value[node] = self.heapster_helper.get_memory_usage_percent(node)

    def calculate_concentration(self, node):
        """
        :type node: str
        """
        self.get_features_value(node)

        for key in self.weight:
            son = self.weight[key][WEIGHT_MEMORY]*self.memory_value[node] + \
                  self.weight[key][WEIGHT_CPU]*self.cpu_value[node]

            mom = self.weight[key][WEIGHT_MEMORY] + self.weight[key][WEIGHT_CPU]

            self.concentration[node][key] = son/mom

        return self.concentration

    def patch_concentration_label(self, node):
        """
        :type node: str
        """

        for key in self.weight:
            if self.concentration[node][key] is not None:
                self.k8s_helper.push_node_label_value(node, key, str(self.concentration[node][key]))
