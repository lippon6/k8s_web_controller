

#消息解析管理器
class MessageParseManage(object):
    def __init__(self, mysql_obj, arg_socket_io_emit):
        self.mysql_obj = mysql_obj
        self.m_socket_io_emit = arg_socket_io_emit

    #解析入口
    def message_parse(self, data, account):
        if data['abstract']['senderType'] == 'receiver':
            #服务端消息解析
            pass
        elif data['abstract']['senderType'] == 'pusher':
            #底层消息解析
            pass



