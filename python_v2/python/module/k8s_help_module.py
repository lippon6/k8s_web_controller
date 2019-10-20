# k8s control api
# created by lippon
# 2019-10-16


from kubernetes import client, config
import yaml
from os import path

class K8sHelper(object):
    def __init__(self, file):
        try:
            config.kube_config.load_kube_config(config_file=file)
            self.coreApi = client.CoreV1Api()
            self.appApi = client.AppsV1Api()

        except TypeError:
            print("Get the kubeconfig file failed !")

    def get_all_namespace(self):
        return self.coreApi.list_namespace().items

    def get_all_service(self):
        return self.coreApi.list_service_for_all_namespaces(watch=False)

    def get_all_pod(self):
        return self.coreApi.list_pod_for_all_namespaces(watch=False)

    def get_all_deploy(self):
        return self.appApi.list_deployment_for_all_namespaces(watch=False)

    def create_deployment(self, dep):
        resp = self.appApi.create_namespaced_deployment(
            body=dep, namespace="default")
        print("Deployment created. status='%s'" % resp.metadata.name)

    def update_deployment(self, dep, name):
            resp = self.appApi.patch_namespaced_deployment(
                name=name,
                namespace="default",
                body=dep)
            print("Deployment updated. status='%s'" % str(resp.status))

    def delete_deployment(self, name):
        resp = self.appApi.delete_namespaced_deployment(
            name=name,
            namespace="default",
            body=client.V1DeleteOptions(
                propagation_policy='Foreground',
                grace_period_seconds=5))
        print("Deployment deleted. status='%s'" % str(resp.status))

    def create_pod(self, file):
        with open(path.join(path.dirname(__file__), file)) as f:
            dep = yaml.safe_load(f)
            resp = self.coreApi.create_namespaced_pod(
                body=dep, namespace="default")
            print("Pod created. status='%s'" % resp.metadata.name)

    def delete_pod(self, namespace, name):
        resp = self.coreApi.delete_namespaced_pod(namespace=namespace, name=name)
        print("delete Pod ")

