# networking check
# created by lippon
# 2019-11-3

PING_TIMES = '10'
PING_INTERVAL = '0.5'

class NodeNetworkingCheck:
    def __init__(self, ssh_helper, k8s_helper):
        """
        :type ssh_helper: SshHelpModule
        :type k8s_helper: K8sHelper
        """
        self.ssh_helper = ssh_helper
        self.k8s_helper = k8s_helper
        self.nodes_ip = self.k8s_helper.get_all_nodes_ip()
        self.node_to_nodes_network_delay = {}

    def all_nodes_network_list(self):
        """
        :rtype : dict
        """
        self.check_all_nodes_network_list()
        return self.node_to_nodes_network_delay

    def check_all_nodes_network_list(self):
        for node in self.nodes_ip:
            self.check_node_network_list(node)

    def check_node_network_list(self, node):
        """
        :type node: str
        """
        self.node_to_nodes_network_delay[node] = {}

        for node_other in self.nodes_ip:
            if node == node_other:
                continue
            else:
                self.node_to_nodes_network_delay[node][node_other] = \
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
