import pdfkit
import sys
class KPrint(object):
    def __init__(self):
        #self.path_wk = r'E:\webServer\html_to_pdf\bin\wkhtmltopdf.exe' #安装位置
        #self.config = pdfkit.configuration(wkhtmltopdf=self.path_wk)
        self.now_path = sys.path[0]
    # 把HTML文件打印为PDF
    def print_from_htmlFile(self,input_path,output_path):
        input_dir = self.now_path + '\\'+input_path
        input_path = input_dir
        output_dir = self.now_path + '\\'+output_path
        output_path = output_dir
        #pdfkit.from_file(input_path, output_path, configuration=self.config)
        pdfkit.from_file(input_path, output_path)
    # 把URL地址的内容打印为PDF
    def print_from_url(self,url,output_path):
        output_dir = self.now_path + '\\' + output_path
        output_path = output_dir
        #pdfkit.from_url(url, output_path, configuration=self.config)
        pdfkit.from_url(url, output_path)
    # 打印字符串为PDF
    def print_from_str(self,str,output_path):
        output_dir = self.now_path + '\\' + output_path
        output_path = output_dir
        #pdfkit.from_string(str, output_path, configuration=self.config)
        pdfkit.from_string(str, output_path)
