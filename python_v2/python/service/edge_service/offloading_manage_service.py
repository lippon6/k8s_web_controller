# offloading manage api
# created by lippon
# 2019-11-4
from service.edge_service.infiltration_controller_service import InfiltrationControllerService
from service.edge_service.node_networking_check_service import NodeNetworkingCheckService
from module.k8s.heapster_help_module import HeapsterHelper

weight = {'ai': {'cpu': 50, 'memory': 50, 'delay': 20}}

class OffloadingManageService:
    def __init__(self, k8s, ssh):
        """
        :type k8s: K8sHelper
        """
        self.k8s_helper = k8s
        self.ssh_helper = ssh
        self.heapster_helper = HeapsterHelper(self.k8s_helper)
        self.node_networking_check = NodeNetworkingCheckService(self.ssh_helper, self.k8s_helper)
        self.infiltration_controller_service = InfiltrationControllerService(weight,
                                                                             self.heapster_helper,
                                                                             self.k8s_helper,
                                                                             self.node_networking_check)

    def create_deployment(self, yaml):
        """
        :type yaml: dict
        :rtype : void
        """
        node = self.select_the_optimal_node(yaml)

        yaml = self.change_offloading_node(yaml, node)

        self.k8s_helper.create_deployment(yaml)

    def select_the_optimal_node(self, yaml):
        """
        :type yaml: dict
        :rtype : str
        """
        ap = self.get_offloading_ap(yaml)
        nodes = self.get_edge_nodes_by_ap(ap)
        weight_name = self.get_mission_weight_name(yaml)

        return self.infiltration_controller_service.get_optimal_node(nodes, ap, weight_name)

    def get_edge_nodes_by_ap(self, ap):
        """
        :type ap: str
        :rtype : list[str]
        """
        aps = self.k8s_helper.get_all_nodes_ap()
        nodes = []

        for node in aps:
            if aps[node] == ap:
                nodes.append(node)
        return nodes

    def get_offloading_ap(self, yaml):
        """
        :type yaml: dict
        :rtype : str
        """
        return yaml['spec']['template']['metadata']['labels']['accessPoint']

    def get_mission_weight_name(self, yaml):
        """
        :type yaml: dict
        :rtype : str
        """
        return yaml['spec']['template']['metadata']['labels']['weight']

    def change_offloading_node(self, yaml, node):
        """
        :type yaml: dict
        :type node: str
        :rtype : dict
        """
        yaml['spec']['template']['spec']['nodeSelector']['kubernetes.io/hostname'] = node

        return yaml

