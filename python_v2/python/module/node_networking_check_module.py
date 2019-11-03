# networking check
# created by lippon
# 2019-11-3

class NodeNetworkingCheck:
    def __init__(self, ssh):
        """
        :type ssh: SshHelpModule
        """
        self.ssh_helper = ssh




    def parse_ping_data(self, data):
        """
        :type data: str
        :rtype : float
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
