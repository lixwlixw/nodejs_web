var errorDialog=function(num,code,msg){
	var str="";
	switch(num)
	{
		case 400:
			str=code+":"+msg;
		break;
		case 401:
			str="登录失败，请重新登录";
		break;
		case 502:
			str="错误网关";
		break;
		case 500:
			str="服务器内部错误"
		break;
		case 501:
			str="尚未实施";
		break;
		case 503:
			str="服务不可用";
		break;
		case 504:
			str="网关超时";
		break;
		case 505:
			str="HTTP版本不受支持";
		break;
		default:
			str="未知错误";		
	}
	
	
	$("body").append("<div id='errorDM' class='modal fade bs-example-modal-sm' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>" +
	"<div class='modal-dialog modal-sm' style='width:450px;margin-top:200px;'>"+
	"<div class='modal-content'>"+
	
		"<div class='modal-header' style='padding:5px 15px;'>"+
	    	"<button aria-label='Close' data-dismiss='modal' class='close' type='button'><span aria-hidden='true'>×</span></button>"+
	    	"<h4 class='modal-title' style='font-family:Lucida Console'>Sorry</h4>"+
	    "</div>"+
	    "<div class='modal-body'>"+str+"！</div>"+
		
	"</div>"+
	"</div>");
	
	
}
