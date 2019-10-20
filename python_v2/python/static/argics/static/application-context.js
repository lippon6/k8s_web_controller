function ApplicationContextEnviroment () {
	var setting = {
		themeName: "blue",
		contextPath: "",
		utilitiesRoot: "static/utilities",
		widgetsRoot: "static/widgets",
		functionsRoot: "static/functions"
	};
	function utilitiesRoot() {return setting.contextPath + '/' + setting.utilitiesRoot;}
	function widgetsRoot()   {return setting.contextPath + '/' + setting.widgetsRoot;}
	function functionsRoot() {return setting.contextPath + '/' + setting.functionsRoot;}
	
	function writeJs(url) {
		document.writeln("<scri" + "pt src='" + url
				+ "' type='text/javascript'></sc" + "ript>");
	}
	function writeCss(url) {
		document.writeln("<li" + "nk rel='stylesheet' href='" + url
				+ "' type='text/css'></li" + "nk>");
	}
	
	return {
	    getThemeName: function() {
			return setting.themeName;
		},
		getContextPath: function() {
			return setting.contextPath;
		},
		init: function(arg) {
			function extend(des, src, override) {
				for( var i in src){
					if(override || !(i in des)){
						des[i] = src[i];
					}
				}
				return des;
			};
			extend(setting, arg, true);
		},
		utilities: function() {
			function makeJsPath(utility,ver) {
				return utilitiesRoot() + "/" + utility + "/" + ver + "/js/" + utility + "-" + ver + ".js";
			};
			
			return {
				load: function(utility,ver) {
					writeJs(makeJsPath(utility,ver));
				}
			};
		}(),
		widgets: function() {
			function makeJsPath(widget,ver) {
				return widgetsRoot() + "/" + widget + "/" + ver + "/js/" + widget + "-" + ver + ".js";
			}
			function makeCssPath(widget,ver) {
				return widgetsRoot() + "/" + widget + "/" + ver + "/css/" + setting.themeName + "/" + widget + "-" + ver + ".css";
			}
			function makeStaticJsPath(widget,ver,name){
				return widgetsRoot() + "/" + widget + "/" + ver + "/js/" + name + ".js";
			}
			
			return {
				load: function(widget,ver) {
					writeCss(makeCssPath(widget,ver));
					writeJs(makeJsPath(widget,ver));
				},
				loadJs: function(widget,ver) {
					writeJs(makeJsPath(widget,ver));
				},
				loadCss: function(widget,ver) {
					writeCss(makeCssPath(widget,ver));
				},
				loadStaticJs:function(widget,ver,name){
					writeJs(makeStaticJsPath(widget,ver,name));
				}
			};
		}(),
		functions: function() {
			function makeJsPath(func,ns) {
				if(!ns) return functionsRoot() + "/js/" + func + ".js";
				
				if(!ns.startWith("/")) ns = "/" + ns;
				return functionsRoot() + "/js" + ns + "/" + func + ".js";
			}
			function makeCssPath(func,ns) {
				if(!ns) return functionsRoot() + "/css/" + setting.themeName + "/" + func + ".css";
				
				if(!ns.startWith("/")) ns = "/" + ns;
				return functionsRoot() + "/css/" + setting.themeName + ns + "/" + func + ".css";
			}
			
			return {
				load: function(func,ns) {
					writeCss(makeCssPath(func,ns));
					writeJs(makeJsPath(func,ns));
				},
				loadJs: function(func,ns) {
					writeJs(makeJsPath(func,ns));
				},
				loadCss: function(func,ns) {
					writeCss(makeCssPath(func,ns));
				}
			};
		}(),
		staticResource: function() {
			return {
				getImgUrl: function(img,ns) {
					if(!ns) return functionsRoot() + "/css/" + setting.themeName + "/images/" + img;
					
					if(!ns.startWith("/")) ns = "/" + ns;
					return functionsRoot() + "/css/" + setting.themeName + ns + "/images"/ + img;
				}
			};
		}()
	}
}

CTX = ApplicationContext = new ApplicationContextEnviroment();

/* Extends prototype methods */
String.prototype.startWith = function(str) {
	var reg = new RegExp("^" + str);
	return reg.test(this);
};
String.prototype.endWith = function(str) {
	var reg = new RegExp(str + "$");
	return reg.test(this);
};
if(!String.prototype.trim){
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}
}
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
};

/* browser */
var browserIsTooOld = function() {
    var b = document.createElement('b');
    b.innerHTML = '<!--[if lt IE 8]><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
}
var isIE8 = function() {
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE 8]><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
}();