# mission weight manage service
# maybe can use deep learning for weight optimize
# created by lippon
# 2019-11-6

class WeightMangeService:
    def __init__(self):
        # self.mysql_helper = mysql_helper
        pass

    def weight_search(self, weight):
        """
        :type weight: str
        :rtype : dict
        """
        weight = {'cpu': 100, 'memory': 50, 'network_delay': 20}

        return weight