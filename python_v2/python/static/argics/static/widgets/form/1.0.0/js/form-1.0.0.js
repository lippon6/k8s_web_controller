	function creatMoney(money){
		var monee = Math.round(money*100).toString(10),i,j=0,leng = monee.length,monval='';
		for( i=0;i<leng;i++){
			monval= monval+to_upper(monee.charAt(i))+to_mon(leng-i-1);
		}
		return repace_acc(monval);
	};
	function to_upper( a){
		switch(a){
			case '0' : return '零'; break;
			case '1' : return '壹'; break;
			case '2' : return '贰'; break;
			case '3' : return '叁'; break;
			case '4' : return '肆'; break;
			case '5' : return '伍'; break;
			case '6' : return '陆'; break;
			case '7' : return '柒'; break;
			case '8' : return '捌'; break;
			case '9' : return '玖'; break;
			default: return '' ;
		}
	};
	function to_mon(a){
		if(a>10){ a=a - 8;return(to_mon(a));}
		switch(a){
			case 0 : return '分'; break;
			case 1 : return '角'; break;
			case 2 : return '元'; break;
			case 3 : return '拾'; break;
			case 4 : return '佰'; break;
			case 5 : return '仟'; break;
			case 6 : return '万'; break;
			case 7 : return '拾'; break;
			case 8 : return '佰'; break;
			case 9 : return '仟'; break;
			case 10 : return '亿'; break;
		}
	}
	function repace_acc(Money){
		Money=Money.replace("零分","");
		Money=Money.replace("零角","零");
		var yy=0;
		var outmoney;
		outmoney=Money;
		while(true){
			var lett= outmoney.length;
			outmoney= outmoney.replace("零元","元");
			outmoney= outmoney.replace("零万","万");
			outmoney= outmoney.replace("零亿","亿");
			outmoney= outmoney.replace("零仟","零");
			outmoney= outmoney.replace("零佰","零");
			outmoney= outmoney.replace("零零","零");
			outmoney= outmoney.replace("零拾","零");
			outmoney= outmoney.replace("亿万","亿零");
			outmoney= outmoney.replace("万仟","万零");
			outmoney= outmoney.replace("仟佰","仟零");
			yy= outmoney.length;
			if(yy==lett) break;
		}
		yy = outmoney.length;
		if ( outmoney.charAt(yy-1)=='零'){outmoney=outmoney.substring(0,yy-1);}
		yy = outmoney.length;
		if (outmoney.charAt(yy-1)=='元'){outmoney=outmoney +'整';}
		return outmoney;
	}

(function($){
	$.sp = $.sp || {};

	Number.prototype.qtoFixed = function(d)
	{
	var s=this+"";if(!d)d=0;
	if(s.indexOf('e')!=-1)return parseFloat(s).toFixed(d);
	if(s.indexOf(".")==-1)s+=".";s+=new Array(d+1).join("0");
	if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+ (d+1) +"})?)\\d*$").test(s))
	{
	var s="0"+ RegExp.$2, pm=RegExp.$1, a=RegExp.$3.length, b=true;
	if (a==d+2){a=s.match(/\d/g); if (parseInt(a[a.length-1])>4)
	{
	for(var i=a.length-2; i>=0; i--) {a[i] = parseInt(a[i])+1;
	if(a[i]==10){a[i]=0; b=i!=1;} else break;}
	}
	s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
	}if(b)s=s.substr(1);return (pm+s).replace(/\.$/, "");} return this+"";
	};

	$.sp.fmoney=function (s, n,un)  {
		var   erg=/^(-?\d+)(\.\d+)?$/;
		if(erg.test(s)){
			n = n > 0 && n <= 20 ? n : 2;
			if(un) s = (s + "").replace(/[^\d\.-]/g, "");
			else s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).qtoFixed(n) + "";
			var fs=s;
			if(parseFloat(s)<0) s=s.slice(1);
			var l = s.split(".")[0].split("").reverse();
			r = s.split(".")[1];
			var joinpoint;
			if(r==undefined)var joinpoint='';
			else var joinpoint="." + r;
			t = "";
			for(i = 0; i < l.length; i ++ )
			{
			   t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			}

			var result=t.split("").reverse().join("") + joinpoint;
			if(parseFloat(fs)>=0)  return result;
			else return '-'+result;
		}
		else return '';
	};

	$.sp.rmoney=function (s,un){
		if(s!=''){
			if(un)return (s + "").replace(/[^\d\.-]/g, "");
			else return parseFloat((s + "").replace(/[^\d\.-]/g, ""));
		}
		else return '';
	};
	$.fn.noempty=function(){
		return this.each(function(){
			if($(this).hasClass('noempty'))$(this).addClass('noempty')		
			});			
	};

	
	$.fn.formReadonly=function(){
		return this.each(function(){
			if($(this).prop('readonly')||$(this).prop('disabled'))$(this).addClass('readonly');
			else $(this).removeClass('readonly');
		});
	};
	
	function cc(inputStar)
    {        
      var temp = inputStar.replace(/[^\x00-\xff]/g,"**");
      if(temp.length > maxlength)
      {
        var bytesCount = 0;
	    for (var i = 0; i < inputStar.length; i++) {
	    var c = inputStar.charAt(i);
	    if(maxlength != -1)
	    {
	    if (/^[\u0000-\u00ff]$/.test(c)) 
	    {
	      bytesCount += 1;
	    }
	    else 
	    {
	      bytesCount += 2;
	    }
	    if(bytesCount > maxlength )
	    {
	      return inputStar.substring(0,i);
	    }
	   } 
	  }
	  }
      else (maxlength == -1)
      {
        return inputStar;
      }
}
	
	$.fn.formMaxlength=function(){
		this.keyup(function(event){	
		     maxlength = $(this).prop('maxlength');		      	   		     
		    $(this).val(cc($(this).val()));
		});
	};
	
	$.fn.formMoney=function(){
	    return this.each(function(){	
		    if($(this).hasClass('money'))$(this).addClass('noempty')
		});
	};
	
	
	$.fn.clearInput=function(callback){
		this.each(function(){
			if($(this).val()!='' && $(this).prop('disabled')!=true && !($(this).parent().find('label').is('.noempty'))){
				$('input:text').addClass('text');				
				if($(this).next().hasClass('clear-trigger'));
				else $(this).after('<div class="clear-trigger"></div>').width($(this).width()-17);
				$(this).next().click(function(){
					var $prev=$(this).prev();
					$prev.width($prev.width()+17).val('');
					$(this).remove().off();
					if(callback!=undefined)callback();				
				});
			}
			
		});
		
	};		
	$.fn.sskeyvld=function(minus,callback){
		this.keypress(function(event){
	   		var evn=event.charCode == undefined ? event.keyCode : event.charCode;
			var chr = String.fromCharCode(evn);if(callback!=undefined)callback(event);
			if(minus)return (evn>=48&&evn<=57 || chr=='.' || evn==0 || chr=='-');
			else return (evn>=48&&evn<=57 || chr=='.' || evn==0);

  		});
  		this.css('ime-mode','disabled');
  		this.each(function(){
	  		$(this).get(0).onpaste=function(){
	  			return false;
	  		};
	 	});

	};
	String.prototype.strLen = function() {
	     var len = 0;
	     for (var i = 0; i < this.length; i++) {
	         if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2; else len ++;
	     }
	     return len;
	 }

	String.prototype.strToChars = function(){
	    var chars = new Array();
	    for (var i = 0; i < this.length; i++){
	        chars[i] = [this.substr(i, 1), this.isCHS(i)];
	    }
	    String.prototype.charsArray = chars;
	    return chars;
	}

	String.prototype.isCHS = function(i){
	    if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) 
	        return true;
	    else
	        return false;
	}

	String.prototype.subCHString = function(start, end){
	    var len = 0;
	    var str = "";
	    this.strToChars();
	    for (var i = 0; i < this.length; i++) {
	        if(this.charsArray[i][1])
	            len += 2;
	        else
	            len++;
	        if (end < len)
	            return str;
	        else if (start < len)
	            str += this.charsArray[i][0];
	    }
	    return str;
	}

	String.prototype.subCHStr = function(start, length){
	    return this.subCHString(start, start + length);
	}

	$.fn.maxValidate=function(){
		this.keyup(function(event){
			var maxlength=$(this).attr('maxlength');
			var tvalue=this.value;
			if(tvalue.strLen()>maxlength) this.value=tvalue.subCHStr(0,maxlength);			
		})
		
	};
	$(function(){
		$('input:text').addClass('text');
		$('input:checkbox').addClass('fcheckbox');
		$('label:not(.empty)').append('：').noempty();
		$('.f-row input:text,.f-row textarea').formReadonly();	
		$('.f-row input:text,.f-row textarea').maxValidate();	
		$('.input-trigger').each(function(){
			$(this).width($(this).width()-17).attr('readonly','readonly');
		});		
	});	
})(jQuery);	