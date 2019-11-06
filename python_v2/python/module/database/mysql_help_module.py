#!/usr/bin/python3
import datetime
import pymysql


class sqlHelper(object):
    def  __init__(self,host,port,user,passwd,db):
        self.host = host
        self.port = port
        self.user = user
        self.password = passwd
        self.db = db
        self.connect_state = False

    # 连接数据库
    def connect_mysql(self):
        try:
            self.conn = pymysql.connect(host=self.host,port=self.port,user=self.user,passwd=self.password,db=self.db,charset='utf8')
            self.cursor = self.conn.cursor()
            self.connect_state = True
            print('connect ok')
        except:
            print('connect error')

    # 关闭数据库
    def close_mysql(self):
        self.conn.close()
        self.connect_state = False

    # 执行语句
    def query_cmd(self,sql_cmd):
        try:
            self.cursor.execute(sql_cmd)
            #print('query ok')
            return True
        except:
            print("query failed")
            return False

    def get_size(self,table):
        if self.connect_state:
            try:
                self.cursor.execute("select count(*) from "+table+";")
                len =  self.cursor.fetchall()
                return len[0][0]
            except:
                print("get failed")
                
    # 获得一行数据
    def get_one_row(self):
        return self.cursor.fetchone()

    # 获得全部行数据
    def get_all_row(self):
        return self.cursor.fetchall()

    def get_row(self,row_num):
        return self.cursor.fetchmany(row_num)

    # 插入数据库,带参数匹配的
    def insert_mysql(self,table,arg,value):
        try:
            self.cursor.execute("INSERT INTO "+table+"(" + arg + ") VALUE(" + value + ");")
            self.conn.commit()
            return True
        except:
            print("insert failed")
            return False

    # 插入数据库, 无参数匹配的
    def insert_noarg_mysql(self,table,value):
        try:
            self.cursor.execute("INSERT INTO "+table+" VALUE(" + value + ");")
            self.conn.commit()
            return True
        except:
            print("insert failed")
            return False
    # 更新数据库
    def update_mysql(self,table,value,key):
        try:
            self.cursor.execute("UPDATE "+table+" set "+value+" where "+key+";")
            self.conn.commit()
            return True
        except:
            self.conn.rollback()
            print("update failed")
            return False

    # 创建数据库
    def creat_mysql(self):

        sql = """CREATE TABLE tractor (
        id int auto_increment,
        tractor_id int ,
        latitude DOUBLE,
        altitude DOUBLE ,
        primary key(id,tractor_id,year,month,day,hour,minute,second,mus))default charset=utf8;"""
        try:
            self.cursor.execute(sql)
            print("creat ok")
        except:
            print("creat fail")


