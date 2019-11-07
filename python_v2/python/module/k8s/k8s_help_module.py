# k8s control api
# created by lippon
# 2019-10-16


from kubernetes import client, config
import yaml
from os import path

class K8sHelper(object):
    def __init__(self, file):
        """
        :type file: str
        """
        try:
            config.kube_config.load_kube_config(config_file=file)
            self.coreApi = client.CoreV1Api()
            self.appApi = client.AppsV1Api()
        except TypeError:
            print("Get the kubeconfig file failed !")

    def get_all_namespace(self):
        """
        :rtype: List[str]
        """
        return self.coreApi.list_namespace().items

    def get_all_service(self):
        """
        :rtype: V1ServiceList
        """
        return self.coreApi.list_service_for_all_namespaces(watch=False)

    def get_all_pod(self):
        """
        :rtype: V1PodList
        """
        return self.coreApi.list_pod_for_all_namespaces(watch=False)

    def get_all_deploy(self):
        """
        :rtype: V1DeploymentList
        """
        return self.appApi.list_deployment_for_all_namespaces(watch=False)

    def create_deployment(self, dep):
        """
        :type dep: dict
        """
        resp = self.appApi.create_namespaced_deployment(
            body=dep, namespace="default")
        print("Deployment created. status='%s'" % resp.metadata.name)

    def update_deployment(self, dep, name):
        """
        :type dep: dict
        :type name: str
        """
        resp = self.appApi.patch_namespaced_deployment(
            name=name,
            namespace="default",
            body=dep)
        print("Deployment updated. status='%s'" % str(resp.status))

    def delete_deployment(self, name):
        """
        :type name: str
        """
        resp = self.appApi.delete_namespaced_deployment(
            name=name,
            namespace="default",
            body=client.V1DeleteOptions(
                propagation_policy='Foreground',
                grace_period_seconds=5))
        print("Deployment deleted. status='%s'" % str(resp.status))

    def create_pod(self, file):
        """
        :type file: str
        """
        with open(path.join(path.dirname(__file__), file)) as f:
            dep = yaml.safe_load(f)
            resp = self.coreApi.create_namespaced_pod(
                body=dep, namespace="default")
            print("Pod created. status='%s'" % resp.metadata.name)

    def delete_pod(self, namespace, name):
        """
        :type namespace: str
        :type name: str
        """
        resp = self.coreApi.delete_namespaced_pod(namespace=namespace, name=name)
        print("delete Pod ")

    def get_all_nodes(self):
        """
        :rtype: V1NodeList
        """
        return self.coreApi.list_node()

    def get_nodes_num(self):
        """
        :rtype: int
        """
        return len(self.get_all_nodes().items)

    def get_all_nodes_name(self):
        """
        :rtype: list
        """
        names = []
        for item in self.get_all_nodes().items:
            names.append(item.metadata.name)

        return names

    def get_node_label_value(self, node, label):
        """
        :type node: str
        :type label: str
        :rtype: str
        """
        try:
            i = self.get_all_nodes_name().index(node)
            return self.get_all_nodes().items[i].metadata.labels[label]
        except ValueError:
            return None

    def push_node_label_value(self, node, label, value):
        """
        :type node: str
        :type label: str
        :type value: str
        """
        body = {
            "metadata": {
                "labels": {
                    label: value
                }
            }
        }

        if node in self.get_all_nodes_name():
            self.coreApi.patch_node(node, body)
        else:
            print("nods is not exist")

    def get_node_capacity(self, node):
        """
        :type node: str
        :rtype    : dict
        """
        try:
            i = self.get_all_nodes_name().index(node)
            return self.get_all_nodes().items[i].status.allocatable

        except ValueError:
            return None

    def get_all_nodes_arch(self):
        """
        :rtype    : dict
        """
        archs = {}

        for item in self.get_all_nodes().items:
            archs[item.metadata.name] = item.metadata.labels['beta.kubernetes.io/arch']

        return archs

    def get_all_nodes_ip(self):
        """
        :rtype    : dict
        """
        ips = {}
        for item in self.get_all_nodes().items:
            ips[item.metadata.name] = item.status.addresses[0].address

        return ips

    def get_node_ip(self, node):
        """
        :type node: str
        :rtype    : str
        """
        return self.get_all_nodes_ip()[node]

    # get ap[nodes]
    def get_all_ap_nodes(self):
        """
        :rtype    : dict
        """
        aps = {}
        node_aps = self.get_all_nodes_ap()

        for i in node_aps:
            if node_aps[i] not in aps:
                aps[node_aps[i]] = []
            aps[node_aps[i]].append(i)

        return aps

    # get the nodes[ap]
    def get_all_nodes_ap(self):
        """
        :rtype    : dict
        """
        aps = {}
        for item in self.get_all_nodes().items:
            aps[item.metadata.name] = item.metadata.labels['accessPoint']

        return aps










