# infiltration algorithm control api
# created by lippon
# 2019-10-25

from threading import Timer
from service.edge_service.weight_manage_service import WeightMangeService

WEIGHT_MEMORY = "memory"
WEIGHT_CPU = "cpu"
WEIGHT_NETWORK_DELAY = "network_delay"
UPDATE_INTERVAL = 2

CONCENTRATION_LIMIT_TO_INFILTRATION_OUT = 60
CONCENTRATION_LIMIT_TO_QUEUE = 80

concentration = {}

class InfiltrationControllerService:
    def __init__(self, weight, heapster_helper, k8s_helper, network_check):
        """
        :type weight: dict
        :type heapster_helper: HeapsterHelper
        :type k8s_helper: K8sHelper
        :type network_check: NodeNetworkingCheckService
        """
        self.heapster_helper = heapster_helper
        self.k8s_helper = k8s_helper
        self.network_check = network_check
        self.weight_manage = WeightMangeService()
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

    def get_optimal_node(self, nodes, ap, weight):
        """
        :type nodes: list[str]
        :type ap: str
        :type weight: str
        :rtype : str
        """
        if len(nodes) == 0:
            return None

        average_concentration = self.get_ap_nodes_average_concentration(ap, weight)

        print(average_concentration)

        # 根据浓度实现不同类型的渗透
        if average_concentration < CONCENTRATION_LIMIT_TO_INFILTRATION_OUT:
            # AP内部实现渗透
            return self.get_optimal_node_by_ap_inside(nodes, weight)

        elif average_concentration < CONCENTRATION_LIMIT_TO_QUEUE:
            # 加入临近节点之后实现渗透
            return self.get_optimal_node_by_approaching_ap(nodes, ap, weight)

        elif average_concentration > CONCENTRATION_LIMIT_TO_QUEUE:
            # 加入缓冲队列实现渗透
            pass

    def get_optimal_node_by_ap_inside(self, nodes, weight):
        """
        :type nodes: list[str]
        :type weight: str
        :rtype : str
        """
        node = nodes[0]
        for i in nodes:
            if concentration[i][weight] < concentration[node][weight]:
                node = i

        return node

    def get_optimal_node_by_approaching_ap(self, nodes, ap, weight):
        """
        :type nodes: list[str]   inside nodes
        :type ap: str
        :type weight: str
        :rtype : str
        """

        approaching_aps = self.network_check.get_approaching_ap(ap)
        approaching_nodes = self.network_check.get_approaching_nodes(ap)
        approaching_nodes_concentration = {}
        for approaching_ap in approaching_aps:
            for node in self.k8s_helper.get_all_ap_nodes()[approaching_ap]:
                approaching_nodes_concentration[node] = \
                    concentration[node][weight] + \
                    self.network_check.get_all_ap_network_list()[ap][approaching_ap] * \
                    self.weight_manage.weight_search(weight)[WEIGHT_NETWORK_DELAY]

        # 获取内部最优节点
        inside_node = nodes[0]
        for i in nodes:
            if concentration[i][weight] < concentration[inside_node][weight]:
                inside_node = i

        # 获取区域最优节点
        approaching_node = approaching_nodes[0]
        for i in approaching_nodes:
            if approaching_nodes_concentration[i] < approaching_nodes_concentration[approaching_node]:
                approaching_node = i

        if concentration[inside_node][weight] > approaching_nodes_concentration[approaching_node]:
            return approaching_node
        else:
            return inside_node

    def get_ap_nodes_average_concentration(self, ap, weight):
        """
        :type ap: str
        :type weight: str
        :rtype : float
        """
        nodes = self.k8s_helper.get_all_ap_nodes()[ap]
        sum_con = 0
        for i in nodes:
            sum_con += concentration[i][weight]

        return sum_con/len(nodes)

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



