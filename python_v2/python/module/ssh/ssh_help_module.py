# ssh control api
# created by lippon
# 2019-11-3
import paramiko

PORT = 22
USERNAME = "whf"
PASSWORD = "123456"

class SshHelper:
    def __init__(self):
        self.ssh = paramiko.SSHClient()

        know_host = paramiko.AutoAddPolicy()
        # 加载创建的白名单
        self.ssh.set_missing_host_key_policy(know_host)

    def connect(self, hostname):
        """
        :type hostname: str
        :rtype : bool
        """
        try:
            self.ssh.close()
            self.ssh.connect(
                hostname=hostname,
                port=PORT,
                username=USERNAME,
                password=PASSWORD
            )
        except:
            return False

        return True

    def send_command(self, command):
        """
        :type command: str
        :rtype : str
        """
        stdin, stdout, stderr = self.ssh.exec_command(command)
        res, err = stdout.read(), stderr.read()
        result = res if res else err

        return result.decode()

    def disconnect(self):
        self.ssh.close()

