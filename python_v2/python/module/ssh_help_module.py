# ssh control api
# created by lippon
# 2019-11-3
import paramiko

class SshHelper:
    def __init__(self):
        self.ssh = paramiko.SSHClient()

    def connect(self, hostname, port, username, password):
        """
        :type hostname: str
        :type port: int
        :type username: str
        :type password: str
        :rtype : bool
        """
        try:
            self.ssh.close()
            self.ssh.connect(
                hostname=hostname,
                port=port,
                username=username,
                password=password
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

