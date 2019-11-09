# networking check
# created by lippon
# 2019-11-3
from threading import Timer

PING_TIMES = '2'
PING_INTERVAL = '0.5'
UPDATE_INTERVAL = 30

APPROACHING_AP_NETWORK_DELAY = 100
CORE_AP = "k8s-master"

node_to_nodes_network_delay = {}

class NodeNetworkingCheckService:
    def __init__(self, ssh_helper, k8s_helper):
        """
        :type ssh_helper: SshHelpModule
        :type k8s_helper: K8sHelper
        """
        self.ssh_helper = ssh_helper
        self.k8s_helper = k8s_helper
        self.nodes_ip = self.k8s_helper.get_all_nodes_ip()
        global node_to_nodes_network_delay

    def networking_check_handle(self):
        """
        :rtype : void
        """
        self.check_all_nodes_network_list()

        t = Timer(UPDATE_INTERVAL, self.networking_check_handle)
        t.start()

    def get_all_nodes_network_list(self):
        """
        :rtype : dict
        """
        return node_to_nodes_network_delay

    def get_approaching_nodes(self, ap):
        """
        :type ap: str
        :rtype : list
        """
        approaching_ap = self.get_approaching_ap(ap)
        approaching_nodes = []
        for ap in approaching_ap:
            for node in self.k8s_helper.get_all_ap_nodes()[ap]:
                approaching_nodes.append(node)

        return approaching_nodes

    def get_approaching_ap(self, ap):
        """
        :type ap: str
        :rtype : list
        """
        aps = []
        ap_to_aps = self.get_all_ap_network_list()

        for target in ap_to_aps[ap]:
            if target == CORE_AP:
                continue
            if ap_to_aps[ap][target] < APPROACHING_AP_NETWORK_DELAY:
                aps.append(target)
        return aps

    def get_all_ap_network_list(self):
        """
        :rtype : dict
        """
        aps = self.k8s_helper.get_all_ap_nodes()
        ap_to_aps = {}
        if len(aps) < 2:
            return None

        for ap_send in aps:
            ap_to_aps[ap_send] = {}
            for ap_receive in aps:
                if ap_receive == ap_send:
                    continue
                else:
                    if len(aps[ap_receive]) > 0:
                        ap_to_aps[ap_send][ap_receive] = \
                            node_to_nodes_network_delay[aps[ap_send][0]][aps[ap_receive][0]]
        return ap_to_aps

    def check_all_nodes_network_list(self):
        """
        :rtype : void
        """
        for node in self.nodes_ip:
            self.check_node_network_list(node)

        # for node in node_to_nodes_network_delay:
        #     print(node, node_to_nodes_network_delay[node])

    def check_node_network_list(self, node):
        """
        :type node: str
        :rtype : void
        """
        node_to_nodes_network_delay[node] = {}

        for node_other in self.nodes_ip:
            if node == node_other:
                continue
            else:
                node_to_nodes_network_delay[node][node_other] = \
                    self.check_node_to_node_network(self.nodes_ip[node], self.nodes_ip[node_other])

    def check_node_to_node_network(self, node, other):
        """
        :type node: str
        :type other: str
        :rtype : float (ms)
        """
        command = "ping -c " + PING_TIMES + " -i " + PING_INTERVAL + " -q " + other

        if self.ssh_helper.connect(node):
            res = self.ssh_helper.send_command(command)

            return self.parse_ping_data(res)
        else:
            return None

    def parse_ping_data(self, data):
        """
        :type data: st
        :rtype : float (ms)
        """
        time = []
        state = 0

        for i in data:
            if i == 'm' and state == 0:
                state += 1
                continue

            if state == 1:
                if i == 'd':
                    state += 1
                else:
                    state = 0
                continue

            if state == 2:
                if i == 'e':
                    state += 1
                else:
                    state = 0
                continue

            if state == 3:
                if i == 'v':
                    state += 1
                    continue

            if state == 4:
                if i == '/':
                    state += 1
                    continue

            if state == 5:
                if i != '/':
                    time.append(i)
                else:
                    break

        if state != 5:
            return None
        else:
            return float(''.join(time))

